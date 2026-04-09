import { useState, useEffect } from 'react'
import { calculateJornada } from './logic/calculator'
import { 
  Calculator, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Info,
  Layers,
  FileText,
  Settings,
  Users,
  BarChart3,
  Scale,
  BookOpen,
  ShieldCheck,
  Gavel
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const formatMinutesToTime = (totalMinutes) => {
  const absMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

function App() {
  const [activeTab, setActiveTab] = useState('calc') // 'calc' | 'legal'
  const [hcSemanal, setHcSemanal] = useState(44)
  const [hpAsignadas, setHpAsignadas] = useState(28)
  const [recreoSemanal, setRecreoSemanal] = useState(150)
  const [percentLectivo, setPercentLectivo] = useState(65)
  const [hpJefatura, setHpJefatura] = useState(2)
  const [jefaturaExcluida, setJefaturaExcluida] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const res = calculateJornada(hcSemanal, hpAsignadas, recreoSemanal, percentLectivo / 100, hpJefatura, jefaturaExcluida)
    setResults(res)
  }, [hcSemanal, hpAsignadas, recreoSemanal, percentLectivo, hpJefatura, jefaturaExcluida])

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Design accents */}
      <div className="fixed top-0 left-0 w-full h-[300px] bg-primary -z-10 opacity-[0.03]"></div>

      {/* Header */}
      <header className="container py-8 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-md">
            <Calculator size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary m-0">Docente<span className="text-primary-accent">Pro</span></h1>
            <p className="text-xs text-text-muted m-0">Calculadora Profesional de Jornada</p>
          </div>
        </div>
        <nav className="flex gap-6 text-sm font-semibold">
          <button 
            onClick={() => setActiveTab('calc')}
            className={`transition-all bg-transparent border-none cursor-pointer pb-1 ${activeTab === 'calc' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-primary'}`}
          >
            Calculadora
          </button>
          <button 
            onClick={() => setActiveTab('legal')}
            className={`transition-all bg-transparent border-none cursor-pointer pb-1 ${activeTab === 'legal' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-primary'}`}
          >
            Marco Legal
          </button>
        </nav>
      </header>

      <main className="container pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'calc' ? (
            <motion.div 
              key="calc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in">
                <h2 className="text-3xl font-extrabold mb-4 text-slate-800">Calculadora de Horas Docentes</h2>
                <p className="text-text-muted text-lg">Distribución precisa de horas lectivas y no lectivas basada en el Estatuto Docente y la Ley 20.903.</p>
              </div>

              <div className="grid-layout">
                {/* Form Side */}
                <motion.aside 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                    <Layers size={18} className="text-primary" />
                    <h3 className="text-lg font-bold text-slate-800">Configuración del Contrato</h3>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Horas Cronológicas (Contrato Semanal)</label>
                    <input 
                      type="number" 
                      value={hcSemanal} 
                      onChange={(e) => setHcSemanal(Number(e.target.value))}
                      className="input-field"
                      placeholder="Ej. 44"
                    />
                    <p className="text-[0.75rem] text-text-muted mt-2 leading-relaxed">
                      Ingrese el total de horas indicadas en su contrato de trabajo semanal (tiempo reloj).
                    </p>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Horas Pedagógicas (Lectivas/Aula)</label>
                    <input 
                      type="number" 
                      value={hpAsignadas} 
                      onChange={(e) => setHpAsignadas(Number(e.target.value))}
                      className="input-field"
                      placeholder="Ej. 28"
                    />
                    <p className="text-[0.75rem] text-text-muted mt-2 leading-relaxed">
                      Cantidad de horas pedagógicas de **45 minutos** que realiza frente a alumnos.
                    </p>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Minutos de Recreo a la Semana</label>
                    <input 
                      type="number" 
                      value={recreoSemanal} 
                      onChange={(e) => setRecreoSemanal(Number(e.target.value))}
                      className="input-field"
                      placeholder="Ej. 150"
                    />
                    <p className="text-[0.75rem] text-text-muted mt-2 leading-relaxed">
                      Sumatoria de todos los minutos de recreo que tiene durante su jornada semanal.
                    </p>
                  </div>

                  <div className="input-group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <label className="input-label m-0">Horas de Jefatura</label>
                      </div>
                    </div>
                    <input 
                      type="number" 
                      value={hpJefatura} 
                      onChange={(e) => setHpJefatura(Number(e.target.value))}
                      className="input-field"
                      placeholder="Ej. 2"
                    />
                    
                    <div className="mt-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setJefaturaExcluida(!jefaturaExcluida)}>
                      <input 
                        type="checkbox" 
                        checked={jefaturaExcluida} 
                        onChange={(e) => setJefaturaExcluida(e.target.checked)}
                        className="mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">Excluir jefatura del 65/35</span>
                        <span className="text-[0.65rem] text-text-muted leading-tight">Las horas de jefatura no se contarán como base lectiva/no lectiva.</span>
                      </div>
                    </div>

                    <p className="text-[0.75rem] text-text-muted mt-2 leading-relaxed">
                      Cantidad de bloques de **45 minutos** asignados a labores de jefatura. Estas horas se descuentan del tiempo no lectivo total.
                    </p>
                  </div>

                  <div className="input-group pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings size={14} className="text-text-muted" />
                      <label className="input-label m-0">Tope Lectivo Personalizado (%)</label>
                    </div>
                    <input 
                      type="number" 
                      value={percentLectivo} 
                      onChange={(e) => setPercentLectivo(Number(e.target.value))}
                      className="input-field"
                      min="0"
                      max="100"
                    />
                    <p className="text-[0.75rem] text-text-muted mt-2 leading-relaxed">
                      Por defecto es 65% (Ley 20.903). Puede modificarlo para contratos específicos o privados.
                    </p>
                  </div>

                </motion.aside>

                {/* Results Side */}
                <motion.section 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-6"
                >
                  {results && (
                    <>
                      {/* Status Card */}
                      <div className={`p-6 rounded-2xl shadow-sm border ${results.analisis_legal.cumplimiento_65_35 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} flex flex-col sm:flex-row items-center gap-4`}>
                          <div className={`p-4 rounded-full ${results.analisis_legal.cumplimiento_65_35 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                            {results.analisis_legal.cumplimiento_65_35 ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                          </div>
                          <div className="text-center sm:text-left flex-1">
                            <h4 className={`text-xl font-extrabold ${results.analisis_legal.cumplimiento_65_35 ? 'text-emerald-800' : 'text-rose-800'}`}>
                              {results.analisis_legal.cumplimiento_65_35 ? 'Cumplimiento Normativo' : 'Inconsistencia Detectada'}
                            </h4>
                            <p className="text-slate-600 text-sm mt-1 font-medium">
                              {results.analisis_legal.cumplimiento_65_35 
                                ? `Su carga lectiva está dentro del límite permitido del ${percentLectivo}%.` 
                                : `Excede el tope legal del ${percentLectivo}% por aproximadamente ${Math.round(results.analisis_legal.exceso_minutos_aula)} minutos.`}
                            </p>
                          </div>
                      </div>

                      {/* HNL Comparison Section */}
                      <div className={`bg-white p-8 rounded-2xl shadow-sm border ${results.comparativa_hnl.estado === 'Insuficiente' ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}>
                         <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <BarChart3 size={18} className={results.comparativa_hnl.estado === 'Insuficiente' ? 'text-rose-600' : 'text-primary'} />
                            <h5 className="font-bold text-sm uppercase tracking-wider">Comparativa de Horas No Lectivas</h5>
                         </div>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">HNL Teóricas (Requeridas)</p>
                              <p className="text-2xl font-black text-slate-800">{formatMinutesToTime(results.comparativa_hnl.teorica)} hrs</p>
                              <p className="text-[0.7rem] text-slate-400 mt-1">Mínimo sugerido según carga horaria de aula.</p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">HNL Reales (Disponibles)</p>
                              <p className={`text-2xl font-black ${results.comparativa_hnl.estado === 'Insuficiente' ? 'text-rose-600' : 'text-slate-800'}`}>
                                {formatMinutesToTime(results.comparativa_hnl.real)} hrs
                              </p>
                              <p className="text-[0.7rem] text-slate-400 mt-1">Tiempo restante tras descontar Aula, Recreos y Jefatura.</p>
                            </div>
                         </div>

                         {results.comparativa_hnl.estado === 'Insuficiente' && (
                           <div className="mt-6 p-4 rounded-xl bg-rose-600 text-white shadow-lg animate-fade-in">
                              <div className="flex items-center gap-3">
                                 <AlertCircle size={24} />
                                 <div>
                                    <p className="font-bold text-sm">Contrato con Horas Faltantes</p>
                                    <p className="text-xs opacity-90">Faltan **{ formatMinutesToTime(results.comparativa_hnl.minutos_faltantes) } horas** para cumplir con el tiempo no lectivo teórico.</p>
                                 </div>
                              </div>
                           </div>
                         )}
                      </div>

                      {/* Main Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* HNL Deficit View */}
                        <div className={`p-8 rounded-2xl shadow-sm border text-center flex flex-col justify-center transition-colors ${results.comparativa_hnl.minutos_faltantes > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-100'}`}>
                          <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${results.comparativa_hnl.minutos_faltantes > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>HNL Faltantes</p>
                          <div className="flex flex-col items-center justify-center mb-2">
                            <span className={`text-6xl font-black leading-none ${results.comparativa_hnl.minutos_faltantes > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {formatMinutesToTime(results.comparativa_hnl.minutos_faltantes)}
                            </span>
                            <span className="text-slate-400 font-bold text-sm uppercase mt-2 tracking-widest">horas</span>
                          </div>
                          <p className="text-slate-500 text-sm mt-3">
                             {results.comparativa_hnl.minutos_faltantes > 0 
                               ? "Déficit de tiempo no lectivo para cumplir con la normativa." 
                               : "Su jornada cumple con el tiempo no lectivo legal."}
                          </p>
                        </div>

                        {/* Visual Distribution */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                          <div className="flex items-center gap-2 mb-6">
                            <Clock size={16} className="text-primary-accent" />
                            <h5 className="font-bold text-sm uppercase tracking-wider text-slate-700">Horas Totales Semanales</h5>
                          </div>
                          <div className="flex flex-col gap-6">
                            <MetricRow 
                              label="Aula Efectiva" 
                              value={results.distribucion_minutos.aula_efectiva} 
                              total={results.distribucion_minutos.total_jornada}
                              color="bg-primary"
                            />
                            <MetricRow 
                              label="No Lectivas Reales" 
                              value={results.distribucion_minutos.no_lectivas_disponibles} 
                              total={results.distribucion_minutos.total_jornada}
                              color="bg-emerald-500"
                            />
                            <MetricRow 
                              label="Jefatura" 
                              value={results.distribucion_minutos.jefatura} 
                              total={results.distribucion_minutos.total_jornada}
                              color="bg-amber-400"
                            />
                            <MetricRow 
                              label="Recreos" 
                              value={results.distribucion_minutos.recreos_totales} 
                              total={results.distribucion_minutos.total_jornada}
                              color="bg-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.section>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="legal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                 <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
                    <Scale size={32} />
                 </div>
                 <h2 className="text-4xl font-black text-slate-800 mb-6">Marco Legal y Normativo</h2>
                 <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                  Información clave sobre el sustento regulatorio del sistema educativo chileno, garantizando transparencia y certeza jurídica.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <LegalCard 
                    icon={<Gavel className="text-blue-600" />}
                    title="1. Proporción de la Jornada (65/35)"
                    color="border-blue-100"
                 >
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      La distribución está regulada por el <strong>Estatuto Docente</strong> (D.F.L. N° 1 de 1996) y actualizada por la <strong>Ley N° 20.903</strong>.
                    </p>
                    <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-blue-500 mt-1 shrink-0" />
                          <span><strong>Límite de Aula:</strong> En régimen JEC, la docencia no puede exceder el 65% de la jornada.</span>
                       </li>
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-blue-500 mt-1 shrink-0" />
                          <span><strong>Resguardo No Lectivo:</strong> El 35% debe destinarse a preparación de clases, evaluación y otras labores formativas.</span>
                       </li>
                    </ul>
                 </LegalCard>

                 <LegalCard 
                    icon={<Clock className="text-emerald-600" />}
                    title="2. Definición de los Recreos"
                    color="border-emerald-100"
                 >
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                       Según el <strong>Ord. N° 681 de 2020</strong> de la Dirección del Trabajo, los recreos son fundamentales:
                    </p>
                    <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-1 shrink-0" />
                          <span><strong>Jornada Pagada:</strong> Forman parte íntegra de la jornada de trabajo docente.</span>
                       </li>
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-1 shrink-0" />
                          <span><strong>Tiempo Neutro:</strong> Al ser descanso, no se computan para el 65% lectivo ni deben absorber el tiempo no lectivo.</span>
                       </li>
                    </ul>
                 </LegalCard>

                 <LegalCard 
                    icon={<Users className="text-amber-600" />}
                    title="3. Horas de Jefatura"
                    color="border-amber-100"
                 >
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                       La jefatura de curso posee una naturaleza mixta declarada en el contrato:
                    </p>
                    <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-amber-500 mt-1 shrink-0" />
                          <span><strong>Orientación:</strong> El tiempo frente a alumnos en Consejo de Curso se considera hora lectiva.</span>
                       </li>
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-amber-500 mt-1 shrink-0" />
                          <span><strong>Gestión:</strong> Entrevistas a apoderados e informes deben imputarse al bloque no lectivo.</span>
                       </li>
                    </ul>
                 </LegalCard>

                 <LegalCard 
                    icon={<ShieldCheck className="text-purple-600" />}
                    title="4. Certeza Jurídica"
                    color="border-purple-100"
                 >
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                       Basado en el <strong>Artículo 10 N° 4</strong> del Código del Trabajo:
                    </p>
                    <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-purple-500 mt-1 shrink-0" />
                          <span><strong>Determinación de Jornada:</strong> El contrato debe precisar la distribución del horario semanal.</span>
                       </li>
                       <li className="flex gap-3 text-xs text-slate-500 items-start">
                          <CheckCircle2 size={14} className="text-purple-500 mt-1 shrink-0" />
                          <span><strong>Garantía de Tiempo:</strong> El docente debe tener certeza del tiempo disponible para su labor fuera del aula.</span>
                       </li>
                    </ul>
                 </LegalCard>
              </div>

              <div className="mt-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
                 <p className="text-slate-500 text-sm italic m-0">
                   "Esta plataforma se sustenta en la normativa vigente para asegurar la calidad pedagógica y el bienestar del profesional."
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="container mt-20 pt-10 pb-12 border-t border-slate-200 text-center animate-fade-in flex flex-col gap-6">
        <div className="max-w-4xl mx-auto bg-slate-100/50 p-6 rounded-2xl border border-slate-200/60">
          <p className="text-slate-500 text-[0.6rem] leading-relaxed uppercase tracking-widest mb-3 font-black">Exención de Responsabilidad (Legal Disclaimer)</p>
          <p className="text-slate-500 text-[0.7rem] leading-relaxed italic text-pretty">
            Esta herramienta tiene un carácter <strong>estrictamente informativo y pedagógico</strong>. Aunque se han realizado esfuerzos exhaustivos para alinear los algoritmos con la Ley 20.903 y el Estatuto Docente, la complejidad de la normativa y la constante actualización de la jurisprudencia administrativa (Dictámenes de la Dirección del Trabajo) implican que los resultados pueden variar según el caso particular. 
          </p>
          <p className="text-slate-500 text-[0.7rem] leading-relaxed italic mt-2 text-pretty">
            El uso de esta calculadora <strong>no constituye asesoría legal profesional</strong> ni sustituye el reporte de entidades fiscalizadoras. El autor y DocentePro se deslindan de toda responsabilidad por errores, omisiones o perjuicios derivados del uso de la información generada. Es responsabilidad exclusiva del usuario validar estos cálculos con un experto en legislación laboral docente o ante la Inspección del Trabajo correspondiente.
          </p>
        </div>
        <p className="text-slate-400 text-[0.65rem] font-bold tracking-tight">© 2026 DocentePro - Herramienta de Apoyo Pedagógico Profesional</p>
      </footer>
    </div>
  )
}

function LegalCard({ icon, title, children, color }) {
  return (
    <div className={`bg-white p-8 rounded-3xl border ${color} shadow-sm hover:shadow-md transition-shadow`}>
       <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-slate-50">
             {icon}
          </div>
          <h4 className="text-lg font-bold text-slate-800 m-0">{title}</h4>
       </div>
       {children}
    </div>
  )
}

function MetricRow({ label, value, total, color }) {
  const percentage = (value / total) * 100
  const hours = formatMinutesToTime(value)
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-2">
        <span className="text-slate-500 uppercase">{label}</span>
        <span className="text-slate-700">{hours} hrs</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color} rounded-full shadow-sm`}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export default App
