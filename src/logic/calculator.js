/**
 * Docente Hour Calculation Logic (Ley 20.903 - Chile)
 */

export const CONSTANTS = {
  FACTOR_MAX_LECTIVO: 0.65,
  FACTOR_MIN_NO_LECTIVO: 0.35,
  MIN_POR_HORA_PEDAGOGICA: 45,
  MIN_POR_HORA_CRONOLOGICA: 60,
  PORCENTAJE_MIN_PREPARACION: 0.40,
};

/**
 * Calculates the distribution of hours based on input parameters.
 * @param {number} hc_semanal - Total weekly chronological hours.
 * @param {number} hp_asignadas - Assigned pedagogical hours (45 min).
 * @param {number} recreo_semanal_min - Total weekly break minutes.
 * @param {number} [customFactorLectivo=0.65] - Optional custom teaching factor.
 * @param {number} [hp_jefatura=0] - Optional Jefatura hours (45 min).
 * @returns {Object} Calculation results and legal status.
 */
export function calculateJornada(hc_semanal, hp_asignadas, recreo_semanal_min, customFactorLectivo = 0.65, hp_jefatura = 0, excluirJefatura = false) {
  const m_total = hc_semanal * CONSTANTS.MIN_POR_HORA_CRONOLOGICA;
  const m_aula_efectiva = hp_asignadas * CONSTANTS.MIN_POR_HORA_PEDAGOGICA;
  const m_jefatura = hp_jefatura * CONSTANTS.MIN_POR_HORA_PEDAGOGICA;
  
  // Base total for 65/35 calculation
  // Recreo is now subtracted from the base as it's neutral time (neither lective nor non-lective activities)
  const m_recreo = recreo_semanal_min;
  const m_total_base = (m_total - m_recreo - (excluirJefatura ? m_jefatura : 0));
  
  // Theoretical HNL: Min required to support hp_asignadas based on ratio
  const ratio = customFactorLectivo || CONSTANTS.FACTOR_MAX_LECTIVO;
  const m_hnl_teorica = (m_aula_efectiva / ratio) * (1 - ratio);

  const m_max_aula = m_total_base * ratio;
  const cumple_normativa = m_aula_efectiva <= m_max_aula;
  const exceso_minutos_aula = Math.max(0, m_aula_efectiva - m_max_aula);

  // Real HNL = Total - Aula - Recreos - Jefatura
  // Note: Jefatura is always subtracted from the physical time available, 
  // but it's the "ref" total that changes for the legal limit.
  const m_hnl_real = Math.max(0, m_total - m_aula_efectiva - m_recreo - m_jefatura);

  // HNL distribution (based on Real HNL)
  const m_preparacion = m_hnl_real * CONSTANTS.PORCENTAJE_MIN_PREPARACION;
  const m_otras = m_hnl_real * (1 - CONSTANTS.PORCENTAJE_MIN_PREPARACION);

  // Comparison
  const diferencia_hnl = m_hnl_real - m_hnl_teorica;
  const hnl_insuficiente = diferencia_hnl < 0;

  return {
    analisis_legal: {
      cumplimiento_65_35: cumple_normativa,
      exceso_minutos_aula,
      alerta_recreos: recreo_semanal_min > 0 ? "Incluidos en jornada" : "No reportados",
    },
    comparativa_hnl: {
      teorica: m_hnl_teorica,
      real: m_hnl_real,
      diferencia: diferencia_hnl,
      estado: hnl_insuficiente ? "Insuficiente" : "Suficiente",
      minutos_faltantes: hnl_insuficiente ? Math.abs(diferencia_hnl) : 0
    },
    distribucion_minutos: {
      total_jornada: m_total,
      aula_efectiva: m_aula_efectiva,
      recreos_totales: recreo_semanal_min,
      jefatura: m_jefatura,
      no_lectivas_disponibles: m_hnl_real,
    },
    desglose_no_lectivo: {
      minutos_preparacion_clases: m_preparacion,
      minutos_gestion_administrativa: m_otras,
    },
    conversion_cronologica: {
      hnl_horas_decimales: m_hnl_real / CONSTANTS.MIN_POR_HORA_CRONOLOGICA,
    },
  };
}
