# VisionFlux 🎬

**VisionFlux** is a cutting-edge AI video generation platform that bridges the gap between high-performance cloud computing and a sleek, cinematic local user interface. It leverages **Stable Diffusion** for text-to-image generation and **RIFE (Real-Time Intermediate Flow Estimation)** for frame interpolation, creating smooth, high-quality short films from simple text prompts.



## 🚀 Project Overview

VisionFlux was built to solve a specific challenge: **How to run resource-intensive AI video generation models (requiring 12GB+ VRAM) accessible to users without high-end local hardware.**

The solution involves a hybrid architecture:
1.  **Frontend**: A local, highly responsive React application with a "Netflix-style" cinematic aesthetic.
2.  **Backend**: A Python FastAPI server that runs on **Google Colab** (or any high-end GPU server), utilizing free cloud GPUs for the heavy lifting.
3.  **Tunneling**: **Ngrok** creates a secure tunnel, allowing the local frontend to communicate seamlessly with the remote Colab backend.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, CSS Modules
-   **UI Components**: shadcn/ui, Radix UI
-   **Animations**: CSS Keyframes, Framer Motion (planned)
-   **State Management**: React Hooks

### Backend (Colab/Python)
-   **Server**: FastAPI, Uvicorn
-   **AI Models**:
    -   **Stable Diffusion**: For generating keyframes from text prompts.
    -   **RIFE**: For interpolating frames to create smooth motion (60fps-like smoothness).
-   **Libraries**: PyTorch, Diffusers, OpenCV, Pillow, NumPy.
-   **Infrastructure**: Google Colab (T4 GPU), Ngrok.

## 💡 Key Features

-   **Text-to-Video**: Transform text prompts into animated sequences.
-   **Cinematic UI**: Dark mode, glassmorphism, and immersive video backgrounds.
-   **Smart Interpolation**: Uses RIFE to fill in gaps between generated frames, resulting in fluid motion rather than a slideshow effect.
-   **Cloud-Local Bridge**: Seamlessly connects a local web app to a remote cloud GPU.
-   **Downloadable Assets**: Save generated videos as GIFs or MP4s (planned).

## 🚧 Challenges & Solutions

### 1. The "Cold Start" & Connectivity Problem
*Challenge*: Connecting a local `localhost` frontend to a dynamic Google Colab instance that changes IP every session.
*Solution*: Implemented a dynamic connection tab where users paste their unique Ngrok URL. The frontend stores this in `localStorage` for persistence during the session.

### 2. CORS (Cross-Origin Resource Sharing) Hell
*Challenge*: Browsers block requests from `localhost` to a remote Ngrok domain due to security policies.
*Solution*: Configured `CORSMiddleware` in FastAPI to allow all origins (`*`) and, crucially, added an explicit `OPTIONS` handler to satisfy browser preflight checks, resolving `405 Method Not Allowed` errors.

### 3. Video Smoothness
*Challenge*: Stable Diffusion generates static images. Simply sequencing them creates a jerky, flickering video.
*Solution*: Integrated **RIFE (Real-Time Intermediate Flow Estimation)**. We generate "key" frames with Stable Diffusion and then use RIFE to hallucinate intermediate frames, smoothing out the transitions significantly.

## 📦 Installation & Setup

### Prerequisites
-   Node.js & npm
-   Python 3.10+ (for local backend only)
-   Google Account (for Colab backend)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The app will open at `http://localhost:5173`.

### 2. Backend Setup (Google Colab)
1.  Open the provided `VisionFlux_Backend.ipynb` (or create a new notebook).
2.  Paste the server script (found in `backend/colab_server_optimized.py`).
3.  Run the cell.
4.  Copy the **Ngrok Public URL** (e.g., `https://xxxx.ngrok-free.app`).

### 3. Connecting
1.  Open the VisionFlux frontend.
2.  Go to the **Create** page.
3.  Paste the Ngrok URL in the **Connection** tab.
4.  Start generating!

## 📂 Project Structure

```
VISIONFlux/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # UI Components (Showcase, Footer, etc.)
│   │   ├── pages/            # Page Views (Create, Index)
│   │   └── App.tsx           # Main Router
│   └── tailwind.config.js    # Styling Config
│
├── backend/                  # Python Server Logic
│   ├── colab_server_optimized.py # The script to run in Colab
│   ├── app.py                # Local development server
│   └── LOCAL_SETUP.md        # Guide for local GPU setup
│
└── README.md                 # This file
```

## 🔮 Future Roadmap
-   [ ] **User Accounts**: Save generation history.
-   [ ] **Advanced Settings**: Control guidance scale, seed, and negative prompts.
-   [ ] **Upscaling**: Integrate Real-ESRGAN for 4K output.
-   [ ] **Audio**: Generate background music based on the prompt.

---
*Built with ❤️ by the VisionFlux Team*

