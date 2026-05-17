from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/v1", tags=["Nutrition Analysis"])


@router.post("/analyze", summary="Analisa foto de comida")
async def analyze_food(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Formato não suportado. Use: JPG, PNG ou WEBP",
        )

    image_bytes = await file.read()
    max_size = 10 * 1024 * 1024
    if len(image_bytes) > max_size:
        raise HTTPException(
            status_code=400,
            detail="Imagem muito grande. Máximo: 10MB"
        )

    result = gemini_service.analyze_food_image(image_bytes)

    if result["success"]:
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "timestamp": datetime.now().isoformat(),
                "filename": file.filename,
                "data": result["data"],
            },
        )
    else:
        raise HTTPException(status_code=500, detail=result["error"])


@router.get("/health", summary="Verifica status da API")
async def health_check():
    return {
        "status": "online ✅",
        "app_name": "Food Nutrition Analyzer",
        "version": "1.0.0",
        "message": "API funcionando perfeitamente!",
        "timestamp": datetime.now().isoformat(),
    }