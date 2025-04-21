#Crea un archivo resumen_indicadores_div.json con el conteo de los indicadores por municipio y año
import os
import json
import re
from collections import defaultdict

# === Configuración ===
carpeta_geojson = "../../db"
valores_posibles = ["1", "2", "3","4","0","5"]  

conteo_total = {}
resumen_municipio_anio = defaultdict(lambda: defaultdict(lambda: {v: 0 for v in valores_posibles}))

# === Recorrer geojson ===
for archivo in os.listdir(carpeta_geojson):
    if archivo.endswith(".geojson"):
        ruta = os.path.join(carpeta_geojson, archivo)

        with open(ruta, encoding="utf-8") as f:
            geojson = json.load(f)

        conteo_archivo = {}
        totales_por_municipio = defaultdict(lambda: defaultdict(lambda: {v: 0 for v in valores_posibles}))

        for feature in geojson["features"]:
            props = feature.get("properties", {})
            municipio = props.get("NOMGEO", "SIN_NOMBRE").strip()

            if municipio not in conteo_archivo:
                conteo_archivo[municipio] = {}

            for key, value in props.items():
                match = re.match(r"^(M\d+_\d+_\d+)_(\d{2})$", key)
                if match:
                    indicador = match.group(1)
                    anio = match.group(2)
                    valor = str(int(value)) if isinstance(value, (int, float)) else None

                    if valor not in valores_posibles:
                        continue

                    # Inicializar estructuras
                    if anio not in conteo_archivo[municipio]:
                        conteo_archivo[municipio][anio] = {}
                    if indicador not in conteo_archivo[municipio][anio]:
                        conteo_archivo[municipio][anio][indicador] = {v: 0 for v in valores_posibles}

                    # Contar por indicador
                    conteo_archivo[municipio][anio][indicador][valor] += 1

                    # Totales del archivo
                    totales_por_municipio[municipio][anio][valor] += 1

                    # Totales globales por municipio y año
                    resumen_municipio_anio[municipio][anio][valor] += 1

        conteo_archivo["totales"] = totales_por_municipio
        conteo_total[archivo] = conteo_archivo

# === Combinar todo y exportar ===
resultado_final = {
       "conteo_por_archivo": conteo_total
}

with open("resumen_indicadores_div.json", "w", encoding="utf-8") as f:
    json.dump(resultado_final, f, ensure_ascii=False, indent=2)

print("✅ Resumen completo guardado en resumen_indicadores.json")
