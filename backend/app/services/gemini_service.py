import google.generativeai as genai
from PIL import Image
import io
import json
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def analyze_food_image(self, image_bytes: bytes) -> dict:
        try:
            image = Image.open(io.BytesIO(image_bytes))

            prompt = """
            Você é um nutricionista especialista em análise visual de alimentos.
            
            Analise esta foto de comida cuidadosamente e retorne APENAS um JSON válido,
            sem texto adicional, sem markdown, apenas o JSON puro com esta estrutura:
            
            {
                "identificado": true,
                "nome_prato": "nome do prato ou alimento",
                "descricao": "breve descrição do que você vê",
                "peso_aproximado_gramas": 300,
                "porcoes": 1,
                "calorias_kcal": 450,
                "macronutrientes": {
                    "proteinas_g": 25.5,
                    "carboidratos_g": 45.0,
                    "gorduras_g": 15.0,
                    "fibras_g": 5.0,
                    "acucares_g": 8.0
                },
                "micronutrientes_destaque": ["ferro", "vitamina C"],
                "nivel_confianca": "media",
                "observacoes": "alguma observação importante sobre a estimativa",
                "dica_nutricional": "uma dica saudável relacionada ao prato"
            }
            
            Regras importantes:
            - Se não conseguir identificar comida na foto, retorne "identificado": false
            - nivel_confianca deve ser: "baixa", "media" ou "alta"
            - Todos os valores numéricos devem ser números, não strings
            - Seja conservador e realista nas estimativas
            - Considere o tamanho aparente dos alimentos na foto
            """

            response = self.model.generate_content([prompt, image])

            raw_text = response.text.strip()

            if raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]

            result = json.loads(raw_text)
            return {"success": True, "data": result}

        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Erro ao processar resposta da IA: {str(e)}",
                "raw_response": response.text if "response" in locals() else None,
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Erro ao analisar imagem: {str(e)}"
            }


gemini_service = GeminiService()