from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure requests session with retry logic for SSL issues
def get_session():
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=[500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

# Allow CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProxyRequest(BaseModel):
    prompt: str
    colab_url: str

@app.get("/")
def read_root():
    return {"status": "Local Backend Running"}

@app.post("/proxy/generate")
def proxy_generate(req: ProxyRequest):
    """
    Forwards the generation request to the Colab instance.
    """
    if not req.colab_url:
        raise HTTPException(status_code=400, detail="Colab URL is required")

    # Ensure URL doesn't end with slash for consistency
    colab_base_url = req.colab_url.rstrip("/")
    target_url = f"{colab_base_url}/generate"

    try:
        print(f"Forwarding request to: {target_url}")
        # Add header to skip Ngrok warning page
        headers = {"ngrok-skip-browser-warning": "true"}
        session = get_session()
        response = session.post(target_url, json={"prompt": req.prompt}, headers=headers, timeout=30, verify=True)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.JSONDecodeError:
        print(f"Error: Received non-JSON response from Colab. Status: {response.status_code}, Content: {response.text[:200]}")
        raise HTTPException(status_code=502, detail="Received invalid response from Colab. Likely Ngrok warning page or server error.")
    except requests.exceptions.RequestException as e:
        print(f"Error contacting Colab: {e}")
        raise HTTPException(status_code=502, detail=f"Failed to contact Colab: {str(e)}")

@app.post("/proxy/test")
def proxy_test(req: ProxyRequest):
    """
    Tests if the Colab URL is reachable.
    """
    if not req.colab_url:
        raise HTTPException(status_code=400, detail="Colab URL is required")

    colab_base_url = req.colab_url.rstrip("/")
    target_url = f"{colab_base_url}/" # Root endpoint of Colab server

    try:
        print(f"Testing connection to: {target_url}")
        headers = {"ngrok-skip-browser-warning": "true"}
        session = get_session()
        response = session.get(target_url, headers=headers, timeout=10, verify=True)
        response.raise_for_status()
        return {"status": "connected", "colab_response": response.json()}
    except Exception as e:
        print(f"Connection test failed: {e}")
        raise HTTPException(status_code=502, detail=f"Connection failed: {str(e)}")
