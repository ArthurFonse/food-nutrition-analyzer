from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.nutrition_routes import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="🍽️ Food Nutrition Analyzer",
    description="""
    ## API de Análise Nutricional por Foto
    
    Tire uma foto da sua comida e receba:
    - 🔥 Calorias estimadas
    - 💪 Proteínas
    - ⚡ Carboidratos  
    - 🥑 Gorduras
    - 📊 Peso aproximado
    - 💡 Dica nutricional
    
    **Powered by Google Gemini AI**
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "🍽️ Food Nutrition Analyzer API",
        "docs": "/docs",
        "health": "/api/v1/health",
        "analyze": "POST /api/v1/analyze",
    }