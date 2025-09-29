from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# This will serve the static files from the 'static' directory
app.mount("/", StaticFiles(directory="static", html=True), name="site")
