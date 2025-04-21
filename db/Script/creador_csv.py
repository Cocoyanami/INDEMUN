#crea el csv por año apartir de resumne_por_modulo.json
import json
import csv

# === Año a exportar ===
anio_objetivo = "20"
archivo_salida = f"indicadores_modulo_20{anio_objetivo}.csv"

# === Mapeo de valores a sufijos ===
sufijos = {
    "1": "V",
    "2": "a",
    "3": "r",
    "4": "ndR",
    "0": "nd",
    "5": "nm"
}

modulos = [f"M{i}" for i in range(1, 9)]
columnas = ["Municipio"]
for m in modulos:
    for suf in ["V", "a", "r", "ndR", "nd", "nm"]:
        columnas.append(f"{m}_{suf}")
columnas += ["T_v", "T_a", "T_r", "T_ndR", "T_nd", "T_nm"]

# === Leer resumen por módulo ===
with open("resumen_por_modulo.json", encoding="utf-8") as f:
    resumen = json.load(f)

# === Procesar filas y ordenarlas alfabéticamente ===
filas = []

for municipio, datos_por_anio in resumen.items():
    if anio_objetivo not in datos_por_anio:
        continue

    fila = [municipio]
    totales = {"1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "0": 0.0, "5": 0.0}

    for m in modulos:
        mod_data = datos_por_anio[anio_objetivo].get(m, {})
        for valor in ["1", "2", "3", "4", "0", "5"]:
            cantidad = float(mod_data.get(valor, 0.0))
            fila.append(cantidad)
            totales[valor] += cantidad

    # Totales finales
    fila += [
        totales["1"],  # T_v
        totales["2"],  # T_a
        totales["3"],  # T_r
        totales["4"],  # T_ndR
        totales["0"],  # T_nd
        totales["5"],  # T_nm
    ]

    filas.append(fila)

# === Ordenar filas alfabéticamente por municipio ===
filas.sort(key=lambda x: x[0].lower())

# === Escribir CSV ===
with open(archivo_salida, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(columnas)
    writer.writerows(filas)

print(f"✅ Archivo ordenado generado: {archivo_salida}")
