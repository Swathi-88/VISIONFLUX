from fastapi import FastAPI
from .pipeline import generate_video

app = FastAPI()

@app.get("/")
def home():
    return {"status": "VisionFlux backend running"}

@app.get("/generate")
def generate(prompt: str):
    result = generate_video(prompt)
    return {"message": result}
