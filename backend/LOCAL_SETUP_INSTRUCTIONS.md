# Local / Dedicated Cloud Backend Setup Guide

This guide explains how to run the VisionFlux backend on your own machine or a dedicated cloud server (like RunPod, Lambda Labs, or AWS), removing the need for Google Colab.

## 1. Hardware Requirements
Video generation using Stable Diffusion and RIFE is computationally expensive.

-   **GPU**: NVIDIA GPU is highly recommended (CUDA support).
    -   **Minimum**: 8GB VRAM (e.g., RTX 3060, RTX 2070).
    -   **Recommended**: 12GB+ VRAM (e.g., RTX 3080, 4070, 4090).
-   **RAM**: 16GB+ System RAM.
-   **Storage**: ~20GB free space for models and dependencies.

> [!NOTE]
> If you do not have a powerful local GPU, you can rent a GPU server from providers like **RunPod**, **Lambda Labs**, or **Vast.ai** for a few cents per hour and follow these same instructions.

## 2. Software Prerequisites
-   **OS**: Windows 10/11 or Linux (Ubuntu 20.04+ recommended).
-   **Python**: Version 3.10 or 3.11.
-   **Git**: For cloning repositories.
-   **CUDA Toolkit**: Version 11.8 or 12.1 (must match your PyTorch version).

## 3. Installation Steps

### Step 1: Clone the Repository
If you haven't already:
```bash
git clone <your-repo-url>
cd VISIONFlux/backend
```

### Step 2: Create a Virtual Environment
It's best to keep dependencies isolated.
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install PyTorch (with CUDA support)
**Crucial**: Do not just run `pip install torch`. You need the CUDA version.
Visit [pytorch.org](https://pytorch.org/get-started/locally/) to get the exact command, or use:

```bash
# For CUDA 12.1 (Recommended for newer GPUs)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Step 4: Install Other Dependencies
Create a `requirements.txt` file in the `backend` folder with the following content:
```text
fastapi
uvicorn
diffusers
transformers
accelerate
opencv-python
pillow
numpy
nest_asyncio
pyngrok
```
Then run:
```bash
pip install -r requirements.txt
```

### Step 5: Download RIFE Model (For Interpolation)
If you want the smooth video effect, you need the RIFE model.
1.  Clone the RIFE repository or download the model weights.
2.  (Simplest way) Use a library like `rife-ncnn-vulkan-python` or follow a specific RIFE implementation guide for PyTorch.
    *Note: The Colab script used a specific RIFE implementation. For local use, it's easier to disable interpolation initially or use a standard library.*

## 4. Running the Server Locally

1.  **Modify the Script**: You need a local version of the server script that loads models from your disk or HuggingFace directly, rather than relying on Colab's pre-loaded variables.

2.  **Create `local_app.py`**:
    (See the file `backend/local_app.py` which I will create for you).

3.  **Run the Server**:
    ```bash
    uvicorn local_app:app --host 0.0.0.0 --port 8000
    ```

4.  **Connect Frontend**:
    -   If running on the **same machine**: Use `http://localhost:8000` in the frontend (instead of the ngrok URL).
    -   If running on a **remote server**: Use the server's IP address (e.g., `http://123.45.67.89:8000`).

## 5. Connecting Frontend to Localhost
In `frontend/src/pages/Create.tsx`, you can bypass the "Connection" tab if you hardcode the URL or default it to localhost.

To test quickly:
1.  Enter `http://localhost:8000` in the VisionFlux "Connection" tab.
2.  Click "Save Connection".
