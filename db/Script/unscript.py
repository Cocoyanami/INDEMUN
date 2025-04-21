#deshacemos el cambio realizado por el script anterior que crea o genera las claves del año en los geojson
import os
import json

# Carpeta donde están los archivos GeoJSON
carpeta_geojson = "../db"
anio_a_eliminar = "24"  # Cambia esto si es otro año

# Recorremos todos los archivos .geojson
for archivo in os.listdir(carpeta_geojson):
    if archivo.endswith(".geojson"):
        ruta = os.path.join(carpeta_geojson, archivo)
        with open(ruta, encoding="utf-8") as f:
            geojson = json.load(f)

        actualizado = False

        for feature in geojson["features"]:
            props = feature["properties"]
            claves_a_borrar = [k for k in props if k.endswith(f"_{anio_a_eliminar}")]
            for k in claves_a_borrar:
                del props[k]
                actualizado = True

        if actualizado:
            # Ordenar municipios por nombre
            geojson["features"].sort(key=lambda feat: feat["properties"].get("NOMGEO", "").lower())
            with open(ruta, "w", encoding="utf-8") as f:
                json.dump(geojson, f, ensure_ascii=False, indent=2)
            print(f"🧽 Limpieza completada en: {archivo}")
        else:
            print(f"✔️ Nada que eliminar en: {archivo}")
