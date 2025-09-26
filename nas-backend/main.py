from fastapi import FastAPI, HTTPException, UploadFile, File, Body
from fastapi.responses import FileResponse
from pathlib import Path
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


BASE_DIR = Path.cwd().parent / "stored_files"
print(BASE_DIR)
BASE_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NAS backend is running! Please navigate to /docs for API documentation."}

@app.get("/files")
def getFiles():
    if not BASE_DIR.exists():
        raise HTTPException(status_code=500, detail="Drive not found")
    
    folders = []
    files = []

    for f in BASE_DIR.iterdir():
        if f.is_file():
            files.append({
                "name": f.name,
                "size_kb":round(f.stat().st_size / 1024, 2),
                "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat()
            })
        elif f.is_dir():
            folders.append({
                "name":f.name,
                "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat()
            })

    return{
        "folders": folders,
        "files": files
    } 

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    dest_path = BASE_DIR / file.filename

    with open(dest_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return {"message":"Uploaded", "filename":file.filename}
    


@app.get("/download/{filename}")
def download_file(filename:str):
    file_path = BASE_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404,detail="FIle not found")
    
    return FileResponse(file_path, filename=filename, media_type='application/octet-stream')


@app.delete("/delete")
def delete_file(filename: str = Body(..., embed=True)):
    file_path = BASE_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path.unlink()
    return {"message": f"{filename} deleted"}

    
@app.get("/view/{filename}")
def view_file(filename: str):
    file_path = BASE_DIR / filename

    if not file_path.resolve().is_file() or BASE_DIR not in file_path.resolve().parents:
        raise HTTPException(status_code=404, detail="File not found")

    ext = file_path.suffix.lower()
    if ext in ['.mp4', '.webm', '.ogg']:
        media_type = f"video/{ext[1:]}"
    elif ext in ['.txt', '.csv', '.log']:
        media_type = "text/plain"
    elif ext in ['.jpg', '.jpeg']:
        media_type = "image/jpeg"
    elif ext == '.png':
        media_type = "image/png"
    elif ext == '.pdf':
        media_type = "application/pdf"
    elif ext == '.svg':
        media_type = "image/svg+xml"
    else:
        media_type = "application/octet-stream"

    # **Do NOT pass filename for inline content**, let the browser render it
    response = FileResponse(file_path, media_type=media_type)
    response.headers["Cache-Control"] = "no-store"
    return response



class EditRequest(BaseModel):
    content: str

@app.put("/edit/{filename}")
def edit_file(filename: str, req: EditRequest):
    file_path = BASE_DIR / filename

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    if file_path.suffix.lower() not in [".txt", ".csv", ".log"]:
        raise HTTPException(status_code=400, detail="Editing not supported for this file type")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(req.content)

    return {"message": "File updated successfully"}
