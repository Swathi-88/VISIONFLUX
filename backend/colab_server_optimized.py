# ------------------------------------------------------------------
# VISIONFLUX COLAB SERVER SCRIPT
# Copy this into a NEW cell in your Google Colab notebook
# AFTER you've loaded your models (pipe, RIFE model, etc.)
# ------------------------------------------------------------------

# 1. Install dependencies (if not already installed)
# !pip install fastapi uvicorn pyngrok nest-asyncio

import nest_asyncio
from pyngrok import ngrok
import uvicorn
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import base64
import io
import os
from PIL import Image
import cv2
import numpy as np
import asyncio # Import asyncio

# ------------------------------------------------------------------
# ASSUMPTION: You have already loaded these in previous cells:
# - pipe: StableDiffusionPipeline (for text-to-image)
# - model: RIFE Model (for frame interpolation)
# - device: torch.device
# ------------------------------------------------------------------

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class GenerateRequest(BaseModel):
    prompt: str
    num_inference_steps: int = 12
    num_frames: int = 4  # How many frames to generate
    use_interpolation: bool = True  # Whether to use RIFE

@app.options("/generate")
async def options_generate(request: Request):
    """
    Explicitly handle OPTIONS requests for /generate to fix 405 Method Not Allowed errors.
    """
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    )

@app.get("/")
def read_root():
    return {"status": "Colab Server Running", "message": "VisionFlux API Ready"}

@app.post("/generate")
def generate(req: GenerateRequest):
    """
    Generates a video from a text prompt using your loaded models.
    Returns base64-encoded video or GIF.
    """
    try:
        print(f"Generating for prompt: {req.prompt}")

        # Create output directory
        temp_dir = "/content/temp_generation"
        os.makedirs(temp_dir, exist_ok=True)

        # ------------------------------------------------------------------
        # STEP 1: Generate frames using Stable Diffusion
        # ------------------------------------------------------------------
        frames = []
        base_prompt = req.prompt

        # Check if pipe exists (for safety in this script, though assumed loaded)
        if 'pipe' not in globals():
             raise HTTPException(status_code=500, detail="Stable Diffusion 'pipe' not found in globals. Please load model first.")

        # Generate consistent latents for the sequence
        latents = torch.randn(
            (1, pipe.unet.in_channels, 64, 64),
            device=pipe.device,
            dtype=pipe.dtype
        )

        # Generate multiple frames with slight variations
        for i in range(req.num_frames):
            # Add motion description to prompt
            motion_prompts = [
                f"{base_prompt}, starting pose",
                f"{base_prompt}, slight movement forward",
                f"{base_prompt}, mid-motion",
                f"{base_prompt}, ending pose"
            ]

            current_prompt = motion_prompts[min(i, len(motion_prompts)-1)]

            # Generate image with consistent latents
            image = pipe(
                current_prompt,
                latents=latents,
                num_inference_steps=req.num_inference_steps,
                guidance_scale=5
            ).images[0]

            frames.append(image)

            # Save frame
            frame_path = os.path.join(temp_dir, f"frame_{i:03d}.png")
            image.save(frame_path)
            print(f"Generated frame {i+1}/{req.num_frames}")

        # ------------------------------------------------------------------
        # STEP 2: Apply RIFE interpolation (if enabled and model loaded)
        # ------------------------------------------------------------------
        if req.use_interpolation and 'model' in globals():
            print("Applying RIFE interpolation...")
            interpolated_frames = []

            for i in range(len(frames) - 1):
                # Add current frame
                interpolated_frames.append(frames[i])

                # Interpolate between current and next frame
                img1 = cv2.cvtColor(np.array(frames[i]), cv2.COLOR_RGB2BGR)
                img2 = cv2.cvtColor(np.array(frames[i+1]), cv2.COLOR_RGB2BGR)

                # Convert to tensor
                img1_tensor = torch.from_numpy(img1.transpose(2, 0, 1)).unsqueeze(0).float() / 255.
                img2_tensor = torch.from_numpy(img2.transpose(2, 0, 1)).unsqueeze(0).float() / 255.

                # Move to device
                img1_tensor = img1_tensor.to(device)
                img2_tensor = img2_tensor.to(device)

                # Interpolate
                with torch.no_grad():
                    mid = model.inference(img1_tensor, img2_tensor)[0]

                mid_np = (mid.cpu().numpy().transpose(1, 2, 0) * 255).astype(np.uint8)
                mid_rgb = cv2.cvtColor(mid_np, cv2.COLOR_BGR2RGB)
                interpolated_frames.append(Image.fromarray(mid_rgb))

            # Add last frame
            interpolated_frames.append(frames[-1])
            frames = interpolated_frames
            print(f"Interpolation complete. Total frames: {len(frames)}")

        # ------------------------------------------------------------------
        # STEP 3: Create GIF or return first frame as preview
        # ------------------------------------------------------------------
        if len(frames) > 1:
            # Create animated GIF
            gif_path = os.path.join(temp_dir, "output.gif")
            frames[0].save(
                gif_path,
                save_all=True,
                append_images=frames[1:],
                duration=200,  # 200ms per frame = 5 FPS
                loop=0
            )

            # Read and encode GIF
            with open(gif_path, "rb") as f:
                gif_bytes = f.read()

            gif_b64 = base64.b64encode(gif_bytes).decode("utf-8")

            return {
                "status": "success",
                "image_base64": gif_b64,
                "format": "gif",
                "num_frames": len(frames),
                "message": f"Generated {len(frames)} frames"
            }
        else:
            # Return single image
            buffered = io.BytesIO()
            frames[0].save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

            return {
                "status": "success",
                "image_base64": img_str,
                "format": "png",
                "num_frames": 1
            }

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------------------------------------
# Set up ngrok with your auth token
# ------------------------------------------------------------------
ngrok.set_auth_token("36BVGKWdcZOEKNe9yxIl1HiGobL_A6Du4wRsJvbaLkx8Rwoe")

ngrok_tunnel = ngrok.connect(8000)
print('=' * 60)
print('🚀 VisionFlux Server is LIVE!')
print('=' * 60)
print('Public URL:', ngrok_tunnel.public_url)
print('=' * 60)
print('Copy the URL above and paste it into your frontend!')
print('=' * 60)

nest_asyncio.apply()

# Configure Uvicorn
config = uvicorn.Config(app, host="0.0.0.0", port=8000, loop="asyncio")
server = uvicorn.Server(config)

# Get the already running event loop (patched by nest_asyncio)
loop = asyncio.get_event_loop()

# Run the server's serve method in the existing loop
loop.run_until_complete(server.serve())
