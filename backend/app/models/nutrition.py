from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Macronutrients(BaseModel):
    proteinas_g: float
    carboidratos_g: float
    gorduras_g: float
    fibras_g: float
    acucares_g: float


class NutritionAnalysis(BaseModel):
    identificado: bool
    nome_prato: Optional[str] = None
    descricao: Optional[str] = None
    peso_aproximado_gramas: Optional[int] = None
    porcoes: Optional[int] = None
    calorias_kcal: Optional[int] = None
    macronutrientes: Optional[Macronutrients] = None
    micronutrientes_destaque: Optional[List[str]] = None
    nivel_confianca: Optional[str] = None
    observacoes: Optional[str] = None
    dica_nutricional: Optional[str] = None


class AnalysisResponse(BaseModel):
    success: bool
    timestamp: datetime
    data: Optional[NutritionAnalysis] = None
    error: Optional[str] = None


class HealthCheck(BaseModel):
    status: str
    app_name: str
    version: str
    message: str