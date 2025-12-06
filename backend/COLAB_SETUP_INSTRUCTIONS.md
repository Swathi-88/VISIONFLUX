# 🚀 VISIONFLUX COLAB SERVER - UPDATED WITH CORS

**IMPORTANT: Copy this ENTIRE script to a NEW cell in your Google Colab notebook**

## Step 1: Install Dependencies (Run Once)
```python
!pip install fastapi uvicorn pyngrok nest-asyncio
```

## Step 2: Copy and Run This Script

```python
# ------------------------------------------------------------------
# VISIONFLUX COLAB SERVER SCRIPT - WITH CORS SUPPORT
# Run this AFTER loading your Stable Diffusion model (pipe)
# ------------------------------------------------------------------

import nest_asyncio
from pyngrok import ngrok
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import base64
import io
from PIL import Image

# ------------------------------------------------------------------
# CHECK: Make sure 'pipe' is loaded before running this cell
# ------------------------------------------------------------------
if 'pipe' not in globals():
    print("⚠️  WARNING: 'pipe' not found!")
    print("Please run the cell that loads your Stable Diffusion model first.")
    print("Looking for: pipe = StableDiffusionPipeline.from_pretrained(...)")
else:
    print("✅ Stable Diffusion model (pipe) found!")

app = FastAPI()

# ✨ ADD CORS MIDDLEWARE - THIS FIXES THE 405 ERROR ✨
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

@app.get("/")
def read_root():
    return {"status": "Colab Server Running", "message": "VisionFlux API Ready"}

@app.post("/generate")
def generate(req: GenerateRequest):
    """
    Generates an image from a text prompt using Stable Diffusion.
    """
    try:
        print(f"📝 Received prompt: {req.prompt}")
        print(f"🔧 Inference steps: {req.num_inference_steps}")
        
        # Generate consistent latents
        latents = torch.randn(
            (1, pipe.unet.in_channels, 64, 64),
            device=pipe.device,
            dtype=pipe.dtype
        )
        
        print("🎨 Generating image...")
        
        # Generate image
        image = pipe(
            req.prompt,
            latents=latents,
            num_inference_steps=req.num_inference_steps,
            guidance_scale=7.5
        ).images[0]
        
        print("✅ Image generated successfully!")
        
        # Convert to base64
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {
            "status": "success",
            "image_base64": img_str,
            "format": "png",
            "message": "Image generated successfully"
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

# ------------------------------------------------------------------
# Set up ngrok
# ------------------------------------------------------------------
print("\n" + "="*60)
print("🔧 Setting up Ngrok tunnel...")
print("="*60)

ngrok.set_auth_token("36BVGKWdcZOEKNe9yxIl1HiGobL_A6Du4wRsJvbaLkx8Rwoe")
ngrok_tunnel = ngrok.connect(8000)

print("\n" + "="*60)
print("🚀 VisionFlux Server is LIVE!")
print("="*60)
print(f"📡 Public URL: {ngrok_tunnel.public_url}")
print("="*60)
print("📋 Copy the URL above and paste it into your frontend!")
print("="*60 + "\n")

# Start server
nest_asyncio.apply()
uvicorn.run(app, port=8000)
```

## ✅ What to Do Next:

1. **Stop your current Colab server** (if running)
2. **Copy the script above** (everything in the code block)
3. **Paste it in a NEW Colab cell**
4. **Run the cell**
5. **Copy the ngrok URL** that appears
6. **Paste it in your frontend** (Connection tab)
7. **Click "Save Connection"**
8. **Try generating a video!**

## 🎯 What Changed:

The key addition is the **CORS middleware**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This allows your frontend (localhost) to make requests to the Colab server (ngrok).

## 🐛 Troubleshooting:

- **Still getting 405 errors?** Make sure you restarted the server with the NEW script
- **Connection refused?** Check that the ngrok URL is correct
- **Model not found?** Load your Stable Diffusion model first
