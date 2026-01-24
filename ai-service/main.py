import os
import torch
import numpy as np
import pandas as pd
from PIL import Image
import torchvision.transforms.functional as TF
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import CNN as cnn_module
import io

app = FastAPI(title="AgroScan AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load disease data
disease_info = pd.read_csv('disease_info.csv', encoding='cp1252')
supplement_info = pd.read_csv('supplement_info.csv', encoding='cp1252')

# Load ML Model
model = cnn_module.CNN(39)
model.load_state_dict(torch.load('plant_disease_model_1_latest.pt', map_location=torch.device('cpu')))
model.eval()

# Health check indices
HEALTHY_INDICES = [3, 5, 7, 11, 15, 18, 20, 23, 24, 25, 28, 38]

def run_prediction(image_bytes):
    """Run AI prediction on image bytes"""
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224))
    
    with torch.no_grad():
        output = model(input_data)
        output = output.detach().numpy()
        index = np.argmax(output)
    
    return int(index)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        pred_index = run_prediction(contents)
        
        # Get disease info
        disease_name = disease_info['disease_name'][pred_index]
        is_healthy = pred_index in HEALTHY_INDICES
        description = disease_info['description'][pred_index]
        prevention = disease_info['Possible Steps'][pred_index]
        
        # Get supplement info
        supplement_name = ''
        supplement_image = ''
        supplement_link = ''
        
        if pred_index != 4:  # Some arbitrary logic from original django
            try:
                supplement_name = supplement_info['supplement name'][pred_index]
                supplement_image = supplement_info['supplement image'][pred_index]
                supplement_link = supplement_info['buy link'][pred_index]
            except:
                pass
        
        return {
            "index": pred_index,
            "disease_name": disease_name,
            "is_healthy": is_healthy,
            "description": description,
            "prevention": prevention,
            "supplement": {
                "name": supplement_name,
                "image": supplement_image,
                "link": supplement_link
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
