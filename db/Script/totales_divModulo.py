#genera un resumen por modulos separando los valores por modulo y año, apartir de resumen_indicadores_div.json
import json
import re
from collections import defaultdict

# === Leer el archivo original ===
with open("resumen_indicadores_div.json", encoding="utf-8") as f:
    datos = json.load(f)

# Extraer solo el conteo por archivo
conteo_por_archivo = datos.get("conteo_por_archivo", {})

# === Crear estructura para el nuevo resumen por módulo ===
resumen_por_modulo = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(int))))

# === Recorrer los archivos y sumar por módulo ===
for archivo, municipios in conteo_por_archivo.items():
    for municipio, info in municipios.items():
        if municipio == "totales":
            continue
        for anio, indicadores in info.items():
            for indicador, conteo in indicadores.items():
                if not re.match(r"^M\d+_\d+_\d+$", indicador):  # Validar clave del indicador
                    continue
                modulo = indicador.split("_")[0]  # Solo M1, M2, etc.
                for valor, cantidad in conteo.items():
                    resumen_por_modulo[municipio][anio][modulo][valor] += cantidad

# === Guardar como JSON ===
with open("resumen_por_modulo.json", "w", encoding="utf-8") as f:
    json.dump(resumen_por_modulo, f, ensure_ascii=False, indent=2)

print("✅ Archivo generado como resumen_por_modulo.json")
