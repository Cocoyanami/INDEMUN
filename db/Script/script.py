#generamos un script para agregar claves a los geojson de los municipios
import os
import json
import re
import shutil

# === Configuración ===
carpeta_geojson = "../db"  # Carpeta donde están los .geojson
carpeta_backups = os.path.join(carpeta_geojson, "backups")  # Carpeta donde se guardarán los .bak
anio_nuevo = "24"  # Año que se agregará como sufijo
valor_por_defecto = 0  # Valor que se asignará a las nuevas claves

# === Crear carpeta de respaldo si no existe ===
os.makedirs(carpeta_backups, exist_ok=True)

# === Recorremos todos los archivos geojson ===
for archivo in os.listdir(carpeta_geojson):
    if archivo.endswith(".geojson"):
        ruta = os.path.join(carpeta_geojson, archivo)
        respaldo = os.path.join(carpeta_backups, archivo + ".bak")

        # === Crear respaldo ===
        try:
            shutil.copy(ruta, respaldo)
        except Exception as e:
            print(f"⚠️ No se pudo crear respaldo de {archivo}: {e}")
            continue

        # === Cargar archivo ===
        try:
            with open(ruta, encoding="utf-8") as f:
                geojson = json.load(f)
        except Exception as e:
            print(f"❌ No se pudo leer {archivo}: {e}")
            continue

        actualizado = False

        # === Recorremos todos los municipios ===
        for feature in geojson["features"]:
            props = feature.get("properties", {})
            nuevas_claves = {}

            # Buscar claves que coincidan con patrón tipo: M5_2_1_23
            for key in list(props.keys()):
                match = re.match(r"^(M\d+_\d+_\d+)_(2[0-3])$", key)
                if match:
                    base = match.group(1)
                    nueva_clave = f"{base}_{anio_nuevo}"
                    if nueva_clave not in props:
                        nuevas_claves[nueva_clave] = valor_por_defecto

            if nuevas_claves:
                props.update(nuevas_claves)
                actualizado = True

        # === Guardar cambios si se modificó algo ===
# === Guardar cambios si se modificó algo ===
        if actualizado:
            try:
                # Ordenar municipios por nombre
                geojson["features"].sort(key=lambda feat: feat["properties"].get("NOMGEO", "").lower())

                with open(ruta, "w", encoding="utf-8") as f:
                    json.dump(geojson, f, ensure_ascii=False, indent=2, sort_keys=True)

                print(f"✅ Claves 2024 agregadas en: {archivo}")
            except OSError as e:
                print(f"❌ Error al escribir {archivo}: {e}")
                print(f"ℹ️ Puedes restaurar desde: {respaldo}")
        else:
            print(f"✔️ Sin cambios en: {archivo}")
