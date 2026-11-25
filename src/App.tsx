import { FormEvent, useMemo, useState } from 'react'

type View = 'inicio' | 'inscripcion' | 'mesas' | 'resultados'
type Modality = 'Kata' | 'Kumite'

type Competitor = {
  id: string
  name: string
  dni: string
  phone: string
  category: string
  dojo: string
  table: number
  position: number
  photo: string
}

const names = [
  'Mateo Quispe Mendoza', 'Sofía Huamán Flores', 'Diego Rojas Vargas',
  'Valeria Mendoza Cóndor', 'Joaquín Flores Ramos', 'Camila Vargas Castro',
  'Sebastián Cóndor Salazar', 'Isabella Ramos Paredes', 'Álvaro Castro Lazo',
  'Lucía Salazar Toribio', 'Renzo Paredes Rivera', 'Fiorella Lazo Quispe',
  'Bruno Toribio Huamán', 'Mía Rivera Rojas', 'Thiago Ccora Mendoza',
  'Daniela Quispe Flores', 'Gael Huamán Vargas', 'Ximena Rojas Cóndor',
  'Adrián Mendoza Ramos', 'Alejandra Flores Castro', 'Piero Vargas Salazar',
  'Nicole Cóndor Paredes', 'Jhon Ramos Lazo', 'Kiara Castro Toribio',
  'César Salazar Rivera', 'Luana Paredes Ccora', 'Marco Lazo Quispe',
  'Yarely Toribio Huamán', 'Erick Rivera Rojas', 'Brenda Ccora Mendoza',
]

const categories = [
  'Infantil 8–9 · Amarillo', 'Infantil 10–11 · Naranja', 'Infantil 12–13 · Verde',
  'Cadete 14–15 · Azul', 'Cadete 16–17 · Morado', 'Adulto · Rojo',
  'Adulto · Marrón', 'Adulto · Negro', 'Máster · Negro', 'Open infantil',
  'Open cadete', 'Open juvenil', 'Open adulto –60 kg', 'Open adulto –75 kg', 'Open adulto +75 kg',
]

const podiumPhotos = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/women/65.jpg',
]

function buildCompetitors(modality: Modality): Competitor[] {
  const offset = modality === 'Kata' ? 0 : 7
  return names.map((name, index) => {
    const rotated = (index + offset) % names.length
    const position = rotated + 1
    return {
      id: `${modality === 'Kata' ? 'KAT' : 'KUM'}-${String(index + 1).padStart(3, '0')}`,
      name,
      dni: String(70418236 + index * 19371).slice(0, 8),
      phone: `+51 9${String(10234567 + index * 27183).slice(0, 8)}`,
      category: categories[index % categories.length],
      dojo: ['Zenken Perú', 'Nakayama Lima', 'Bushido Callao'][index % 3],
      table: (index % 6) + 1,
      position,
      photo: podiumPhotos[(index + offset) % podiumPhotos.length],
    }
  })
}

const competitors: Record<Modality, Competitor[]> = {
  Kata: buildCompetitors('Kata'),
  Kumite: buildCompetitors('Kumite'),
}

function Icon({ name }: { name: 'arrow' | 'users' | 'trophy' | 'grid' | 'download' | 'check' }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function App() {
  const [view, setView] = useState<View>('inicio')
  const [modality, setModality] = useState<Modality>('Kata')
  const [table, setTable] = useState(1)
  const [query, setQuery] = useState('')
  const [registered, setRegistered] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (next: View) => {
    setView(next)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const shown = useMemo(() => competitors[modality]
    .filter((person) => person.table === table)
    .filter((person) => `${person.name} ${person.dni} ${person.category}`.toLowerCase().includes(query.toLowerCase())), [modality, table, query])

  const ranking = useMemo(() => [...competitors[modality]].sort((a, b) => a.position - b.position), [modality])

  const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setRegistered(String(form.get('name') || 'Participante'))
    event.currentTarget.reset()
  }

  return (
    <div className="site-shell">
      <div className="noise" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate('inicio')} aria-label="Ir al inicio">
          <img src="/assets/logo.png" alt="" />
          <span><strong>ZENKEN</strong><small>PERÚ · 松濤館</small></span>
        </button>
        <button className="menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
        <nav className={menuOpen ? 'open' : ''}>
          {([
            ['inicio', 'Inicio'], ['inscripcion', 'Inscripción'],
            ['mesas', 'Mesas'], ['resultados', 'Resultados'],
          ] as [View, string][]).map(([key, label]) => (
            <button key={key} className={view === key ? 'active' : ''} onClick={() => navigate(key)}>{label}</button>
          ))}
        </nav>
        <button className="nav-cta" onClick={() => navigate('inscripcion')}>Participar <Icon name="arrow" /></button>
      </header>

      <main>
        {view === 'inicio' && (
          <>
            <section className="hero">
              <div className="hero-dragon"><img src="/assets/dragon.png" alt="" /></div>
              <div className="hero-copy">
                <div className="kicker"><span /> CAMPEONATO NACIONAL 2026</div>
                <p className="japanese-line">空手道 · 松濤館 · 選手権</p>
                <h1>FUERZA<br /><em>SIN LÍMITES</em></h1>
                <p className="hero-lead">Disciplina, carácter y espíritu en el campeonato Shotokan que reúne a los mejores karatecas del Perú.</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => navigate('inscripcion')}>Inscríbete ahora <Icon name="arrow" /></button>
                  <button className="text-button" onClick={() => navigate('resultados')}>Ver campeonato <span>↗</span></button>
                </div>
                <div className="hero-stats">
                  <div><strong>60</strong><span>competidores</span></div>
                  <div><strong>06</strong><span>mesas activas</span></div>
                  <div><strong>15</strong><span>categorías</span></div>
                </div>
              </div>
              <div className="tiger-wrap">
                <div className="red-sun" />
                <img className="tiger" src="/assets/tiger-karate.png" alt="Tigre karateca con uniforme blanco y cinturón negro" />
                <div className="vertical-seal">闘志<br /><span>ESPÍRITU DE LUCHA</span></div>
              </div>
              <div className="hero-bottom">LIMA · PERÚ <span>15 — 16 AGOSTO</span> COLISEO ZENKEN</div>
            </section>

            <section className="manifesto">
              <div className="section-number">01 / EL EVENTO</div>
              <div>
                <p className="brush-text">押忍</p>
                <h2>Más que competir.<br /><span>Superarse.</span></h2>
              </div>
              <div className="manifesto-copy">
                <p>Una experiencia de alto nivel diseñada para celebrar la técnica, el respeto y la determinación de cada atleta.</p>
                <button onClick={() => navigate('mesas')}>Explorar las mesas <Icon name="arrow" /></button>
              </div>
            </section>

            <section className="founder-section">
              <div className="founder-image">
                <img src="/assets/funa.jpg" alt="Retrato de Gichin Funakoshi" />
                <span>1868 — 1957</span>
              </div>
              <div className="founder-copy">
                <div className="section-number">02 / LEGADO</div>
                <p className="quote-mark">“</p>
                <blockquote>El objetivo último del karate no reside en la victoria o la derrota, sino en la perfección del carácter.</blockquote>
                <p>GICHIN FUNAKOSHI <span>· FUNDADOR DEL KARATE SHOTOKAN</span></p>
              </div>
              <img className="founder-logo" src="/assets/logo.png" alt="" />
            </section>

            <section className="event-strip">
              <div><small>MODALIDADES</small><strong>Kata & Kumite</strong></div>
              <div><small>SEDE OFICIAL</small><strong>Coliseo Zenken, Lima</strong></div>
              <div><small>INSCRIPCIÓN</small><strong>Desde S/ 25</strong></div>
              <button onClick={() => navigate('inscripcion')}>Reservar lugar <Icon name="arrow" /></button>
            </section>
          </>
        )}

        {view === 'inscripcion' && (
          <section className="page-section registration-page">
            <div className="page-heading">
              <div><div className="section-number">INSCRIPCIÓN OFICIAL / 2026</div><h1>ENTRA AL<br /><em>TATAMI</em></h1></div>
              <p>Completa tus datos para participar. Las inscripciones confirmadas serán asignadas automáticamente a una categoría y mesa.</p>
            </div>
            {registered ? (
              <div className="success-card">
                <div className="success-icon"><Icon name="check" /></div>
                <div><small>INSCRIPCIÓN RECIBIDA</small><h2>Nos vemos en el tatami, {registered}.</h2><p>Tu registro de demostración quedó confirmado. Código: ZEN-2026-{Math.floor(100 + Math.random() * 899)}</p></div>
                <button className="primary" onClick={() => setRegistered('')}>Nueva inscripción</button>
              </div>
            ) : (
              <form className="registration-form" onSubmit={submitRegistration}>
                <div className="form-intro"><span>01</span><div><h3>Datos del competidor</h3><p>Todos los campos son obligatorios.</p></div></div>
                <div className="form-grid">
                  <label className="wide">Nombres y apellidos<input name="name" placeholder="Ej. María Quispe Flores" required minLength={5} /></label>
                  <label>DNI<input name="dni" inputMode="numeric" placeholder="8 dígitos" pattern="[0-9]{8}" required /></label>
                  <label>Teléfono peruano<input name="phone" inputMode="tel" placeholder="+51 999 999 999" required /></label>
                  <label>Modalidad<select name="modality" required><option>Kata</option><option>Kumite</option><option>Kata + Kumite</option></select></label>
                  <label>Categoría<select name="category" required>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                  <label>Dojo<input name="dojo" placeholder="Nombre de tu dojo" required /></label>
                  <label>Cinturón<select name="belt"><option>Amarillo</option><option>Naranja</option><option>Verde</option><option>Azul</option><option>Marrón</option><option>Negro</option></select></label>
                </div>
                <label className="consent"><input type="checkbox" required /><span>Acepto el reglamento, las normas de seguridad y el uso de mis datos para la organización del campeonato.</span></label>
                <button className="primary submit" type="submit">Enviar inscripción <Icon name="arrow" /></button>
              </form>
            )}
          </section>
        )}

        {view === 'mesas' && (
          <section className="page-section tables-page">
            <div className="page-heading compact">
              <div><div className="section-number">CONTROL DE COMPETIDORES</div><h1>MESAS <em>OFICIALES</em></h1></div>
              <p>30 participantes por modalidad, distribuidos en seis mesas. Selecciona una mesa para consultar nombres, DNI, teléfono y categoría.</p>
            </div>
            <div className="control-bar">
              <div className="segmented">
                {(['Kata', 'Kumite'] as Modality[]).map((item) => <button key={item} className={modality === item ? 'active' : ''} onClick={() => setModality(item)}>{item}<span>30</span></button>)}
              </div>
              <label className="search"><span>BUSCAR</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, DNI o categoría" /></label>
            </div>
            <div className="table-selector">
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <button key={number} onClick={() => setTable(number)} className={table === number ? 'active' : ''}>
                  <small>MESA</small><strong>{String(number).padStart(2, '0')}</strong><span>5 atletas</span>
                </button>
              ))}
            </div>
            <div className="roster-card">
              <div className="roster-title">
                <div><span>MESA {String(table).padStart(2, '0')}</span><h2>{modality} · Clasificatoria</h2></div>
                <div className="live"><i /> EN CURSO</div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>#</th><th>Competidor</th><th>DNI</th><th>Teléfono</th><th>Categoría</th><th>Dojo</th><th>Estado</th></tr></thead>
                  <tbody>
                    {shown.map((person, index) => (
                      <tr key={person.id}>
                        <td>{String(index + 1).padStart(2, '0')}</td>
                        <td><strong>{person.name}</strong><small>{person.id}</small></td>
                        <td>{person.dni}</td><td>{person.phone}</td><td>{person.category}</td><td>{person.dojo}</td>
                        <td><span className="status">Confirmado</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {view === 'resultados' && (
          <section className="page-section results-page">
            <div className="results-header">
              <div><div className="section-number">RESULTADOS OFICIALES / 2026</div><h1>CUADRO DE<br /><em>HONOR</em></h1></div>
              <img src="/assets/copa.png" alt="Trofeo de karate" />
              <div className="results-actions">
                <div className="segmented">{(['Kata', 'Kumite'] as Modality[]).map((item) => <button key={item} className={modality === item ? 'active' : ''} onClick={() => setModality(item)}>{item}</button>)}</div>
                <button className="print-button" onClick={() => window.print()}><Icon name="download" /> Descargar PDF</button>
              </div>
            </div>
            <div className="podium">
              {[ranking[1], ranking[0], ranking[2]].map((person, index) => {
                const place = [2, 1, 3][index]
                return <article key={person.id} className={`place place-${place}`}>
                  <div className="place-photo"><img src={person.photo} alt={`Retrato de ${person.name}`} /><span>{String(place).padStart(2, '0')}</span></div>
                  <small>{place === 1 ? 'CAMPEÓN NACIONAL' : place === 2 ? 'SUBCAMPEÓN' : 'TERCER PUESTO'}</small>
                  <h2>{person.name}</h2><p>{person.category}</p><strong>{person.dojo}</strong>
                </article>
              })}
            </div>
            <div className="ranking-card">
              <div className="ranking-heading"><div><span>CLASIFICACIÓN GENERAL</span><h2>{modality} · Puestos 4 al 30</h2></div><p>Resultados finales consolidados</p></div>
              <div className="ranking-list">
                {ranking.slice(3).map((person) => (
                  <div key={person.id}><span>{String(person.position).padStart(2, '0')}</span><strong>{person.name}</strong><small>{person.category}</small><em>Mesa {person.table}</em></div>
                ))}
              </div>
            </div>
            <div className="print-footer">Federación Zenken Perú · Documento oficial generado el 16/08/2026</div>
          </section>
        )}
      </main>

      <footer>
        <div className="footer-brand"><img src="/assets/logo.png" alt="" /><div><strong>ZENKEN PERÚ</strong><small>空手道 · SHOTOKAN</small></div></div>
        <p>Campeonato Nacional de Karate 2026<br />Lima, Perú</p>
        <div className="footer-links"><button onClick={() => navigate('inscripcion')}>Inscripción</button><button onClick={() => navigate('mesas')}>Mesas</button><button onClick={() => navigate('resultados')}>Resultados</button></div>
      </footer>
    </div>
  )
}

export default App
