---
name: Protocolo de Cálculo: Jornada Docente (Ley 20.903 - Chile)
description: Lógica para determinar la distribución de horas pedagógicas (lectivas) y no lectivas de un docente, asegurando el cumplimiento legal (65/35).
---

# Protocolo de Cálculo: Jornada Docente

Este documento define la lógica computacional para determinar la distribución de horas pedagógicas y no lectivas de un docente en Chile, bajo la Ley 20.903.

## 1. Parámetros de Entrada

El sistema requiere los siguientes datos para procesar el cálculo:

| Parámetro | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `hc_semanal` | Horas cronológicas totales del contrato | 44 |
| `hp_asignadas` | Horas pedagógicas (45 min) frente a alumnos | 28 |
| `recreo_semanal_min` | Sumatoria total de minutos de recreo a la semana | 150 |

## 2. Constantes de Sistema

- `FACTOR_MAX_LECTIVO`: 0.65 (65% del tiempo total)
- `FACTOR_MIN_NO_LECTIVO`: 0.35 (35% del tiempo total)
- `MIN_POR_HORA_PEDAGOGICA`: 45
- `MIN_POR_HORA_CRONOLOGICA`: 60
- `PORCENTAJE_MIN_PREPARACION`: 0.40 (40% de las horas no lectivas)

## 3. Lógica del Algoritmo

### Paso 1: Conversión a Minutos Totales
Determine la capacidad total de la jornada en minutos:
$$M_{total} = hc\_semanal \times 60$$

### Paso 2: Validación de Techo Legal
Calcule el límite máximo de minutos permitidos para docencia de aula:
$$M_{max\_aula} = M_{total} \times 0.65$$

**Validación:**
- Si $(hp\_asignadas \times 45) > M_{max\_aula}$:
  - **ESTADO**: `INCUMPLE_NORMATIVA`
  - **ERROR**: Exceso de horas pedagógicas sobre el 65% legal.

### Paso 3: Cálculo de Horas No Lectivas (HNL)
Las Horas No Lectivas cronológicas se obtienen restando el tiempo de aula y los recreos del total contratado:
$$M_{hnl} = M_{total} - (hp\_asignadas \times 45) - recreo\_semanal\_min$$

### Paso 4: Distribución Interna de HNL (Art. 69)
Desglose del tiempo no lectivo según la ley:
- **Preparación y Evaluación (Minutos)**: $M_{preparacion} = M_{hnl} \times 0.40$
- **Otras Actividades Curriculares (Minutos)**: $M_{otras} = M_{hnl} \times 0.60$

## 4. Estructura de Salida (JSON)

```json
{
  "analisis_legal": {
    "cumplimiento_65_35": "boolean",
    "exceso_minutos_aula": "number",
    "alerta_recreos": "string"
  },
  "distribucion_minutos": {
    "total_jornada": "number",
    "aula_efectiva": "number",
    "recreos_totales": "number",
    "no_lectivas_disponibles": "number"
  },
  "desglose_no_lectivo": {
    "minutos_preparacion_clases": "number",
    "minutos_gestion_administrativa": "number"
  },
  "conversion_cronologica": {
    "hnl_horas_decimales": "number"
  }
}
```

## Nota Técnica Importante
El tiempo de **recreo** es tiempo de descanso para el alumno pero **tiempo de trabajo para el docente**. 
Bajo la normativa chilena, el recreo:
1. No puede ser descontado de las horas de aula (pues el aula es lectiva).
2. No puede considerarse como hora no lectiva (preparación de clases).

Por lo tanto, actúa como un "tercer bloque" que consume minutos de la jornada total de contrato.
