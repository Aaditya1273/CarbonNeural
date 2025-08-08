import React, { useMemo, useState } from 'react'

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; background: #0a0a0a; color: #ffffff; overflow-x: hidden; line-height: 1.6; min-height: 100vh; }
  .bg-pattern { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 20% 80%, rgba(0, 51, 102, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 102, 51, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(51, 0, 102, 0.05) 0%, transparent 50%); }
  .hexagon-grid { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.15; }
  .hex { position: absolute; width: 1px; height: 1px; border: 1px solid rgba(255, 255, 255, 0.1); clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); }
  .hex-large { width: 120px; height: 120px; border-color: rgba(0, 255, 127, 0.15); }
  .hex-medium { width: 80px; height: 80px; border-color: rgba(255, 255, 255, 0.08); }
  .hex-small { width: 40px; height: 40px; border-color: rgba(0, 191, 255, 0.12); }
  .navbar { position: fixed; top: 0; left: 0; right: 0; background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; z-index: 1000; transition: all 0.3s ease; }
  .logo { font-size: 24px; font-weight: 700; color: #00ff7f; letter-spacing: -0.5px; }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-weight: 500; font-size: 15px; transition: color 0.3s ease; letter-spacing: -0.2px; }
  .nav-links a:hover { color: #ffffff; }
  .nav-cta { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.3s ease; }
  .nav-cta:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(0, 255, 127, 0.3); }
  .main-content { padding-top: 120px; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding-left: 40px; padding-right: 40px; }
  .app-container { max-width: 800px; width: 100%; }
  .app-header { text-align: center; margin-bottom: 48px; }
  .app-badge { display: inline-block; background: rgba(0, 255, 127, 0.1); border: 1px solid rgba(0, 255, 127, 0.2); color: #00ff7f; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; margin-bottom: 24px; letter-spacing: 0.5px; }
  .app-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; margin-bottom: 16px; letter-spacing: -2px; color: #ffffff; }
  .app-highlight { color: #00ff7f; }
  .app-subtitle { font-size: 1.1rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 32px; line-height: 1.7; }
  .calculator-form { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; backdrop-filter: blur(10px); transition: all 0.3s ease; }
  .calculator-form:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.1); }
  
  /* Toggle Switch Styling */
  .toggle { margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .toggle input[type="checkbox"] { position: relative; width: 50px; height: 26px; appearance: none; background: rgba(255, 255, 255, 0.1); border-radius: 13px; cursor: pointer; transition: all 0.3s ease; }
  .toggle input[type="checkbox"]:checked { background: #00ff7f; }
  .toggle input[type="checkbox"]::before { content: ''; position: absolute; top: 2px; left: 2px; width: 22px; height: 22px; background: #ffffff; border-radius: 50%; transition: transform 0.3s ease; }
  .toggle input[type="checkbox"]:checked::before { transform: translateX(24px); }
  .toggle label { color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 500; cursor: pointer; }
  
  .form-group { margin-bottom: 24px; }
  .form-label { display: block; font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.2px; }
  .form-input { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px 16px; color: #ffffff; font-size: 15px; font-weight: 500; transition: all 0.3s ease; font-family: inherit; }
  .form-input:focus { outline: none; border-color: #00ff7f; background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 0 3px rgba(0, 255, 127, 0.1); }
  .form-input::placeholder { color: rgba(255, 255, 255, 0.4); }
  .btn-predict { width: 100%; background: #00ff7f; color: #000000; border: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; letter-spacing: -0.2px; }
  .btn-predict:hover:not(:disabled) { background: #00e670; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 255, 127, 0.3); }
  .btn-predict:active { transform: translateY(0); }
  .btn-predict:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  
  .results-section { margin-top: 32px; padding: 32px; background: rgba(0, 255, 127, 0.05); border: 1px solid rgba(0, 255, 127, 0.15); border-radius: 12px; opacity: 0; transform: translateY(20px); transition: all 0.3s ease; }
  .results-section.show { opacity: 1; transform: translateY(0); }
  .results-title { font-size: 1.3rem; font-weight: 600; color: #00ff7f; margin-bottom: 16px; text-align: center; }
  .footprint-display { text-align: center; margin-bottom: 24px; }
  .footprint-value { font-size: 3rem; font-weight: 800; color: #ffffff; margin-bottom: 8px; letter-spacing: -1px; animation: countUp 0.8s ease-out; }
  .footprint-unit { color: rgba(255, 255, 255, 0.7); font-size: 1rem; font-weight: 500; }
  
  @keyframes countUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  
  /* Advanced Grid Styling */
  .advanced-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; transition: all 0.3s ease; animation: slideInUp 0.4s ease-out; }
  .card:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(0, 255, 127, 0.2); transform: translateY(-2px); }
  .card h4 { color: #00ff7f; font-size: 14px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .kv { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .kv:last-child { margin-bottom: 0; }
  .kv span { color: rgba(255, 255, 255, 0.7); font-size: 13px; }
  .kv strong { color: #ffffff; font-weight: 600; }
  
  .tag { display: inline-block; background: rgba(0, 255, 127, 0.1); color: #00ff7f; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; margin: 2px; }
  
  .mac-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  .mac-item:last-child { border-bottom: none; }
  .mac-item > div:first-child { color: #ffffff; font-weight: 500; flex: 1; }
  
  @keyframes slideInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  
  .recommendations { margin-top: 24px; }
  .recommendation-item { background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 3px solid #00ff7f; animation: slideInLeft 0.4s ease-out; animation-fill-mode: both; }
  .recommendation-item:nth-child(1) { animation-delay: 0.1s; }
  .recommendation-item:nth-child(2) { animation-delay: 0.2s; }
  .recommendation-item:nth-child(3) { animation-delay: 0.3s; }
  .recommendation-item:nth-child(4) { animation-delay: 0.4s; }
  .recommendation-item:last-child { margin-bottom: 0; }
  
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  
  @media (max-width: 768px) { 
    .navbar { padding: 16px 20px; } 
    .nav-links { display: none; } 
    .main-content { padding: 100px 20px 40px; } 
    .calculator-form { padding: 24px; } 
    .app-title { font-size: 2.5rem; }
    .advanced-grid { grid-template-columns: 1fr; }
  }
`;

function HexGrid() {
  const hexagons = useMemo(() => ([
    { x: 10, y: 15, size: 'large' },
    { x: 85, y: 20, size: 'medium' },
    { x: 15, y: 60, size: 'small' },
    { x: 75, y: 70, size: 'large' },
    { x: 45, y: 25, size: 'medium' },
    { x: 90, y: 50, size: 'small' },
    { x: 25, y: 85, size: 'medium' },
    { x: 60, y: 80, size: 'small' },
  ]), [])

  return (
    <div className="hexagon-grid">
      {hexagons.map((h, i) => (
        <div key={i} className={`hex hex-${h.size}`} style={{ left: `${h.x}%`, top: `${h.y}%` }} />
      ))}
    </div>
  )
}

// Mock API function for demo
const api = {
  post: async (path, body) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseFootprint = (body.device_hours * 0.2) + (body.travel_km * 0.15) + (body.grid_intensity * 0.001);
    
    if (path.includes('advanced=true')) {
      return {
        footprint: baseFootprint,
        mode: 'advanced',
        notes: [
          'Peak usage detected during high-intensity hours (2-6 PM)',
          'Short-distance travel optimization opportunities identified'
        ],
        suggestions: [
          'Switch to renewable energy plan (est. -20%)',
          'Optimize device standby schedules (est. -10%)',
          'Enable smart thermostat eco-mode (est. -5%)'
        ],
        ci: {
          low: baseFootprint * 0.8,
          high: baseFootprint * 1.3
        },
        breakdown: {
          device: body.device_hours * 0.2,
          travel: body.travel_km * 0.15,
          total: baseFootprint
        },
        abatement: [
          { name: 'LED Lighting Upgrade', reduction: 0.12, mac: 15 },
          { name: 'Smart Thermostat', reduction: 0.28, mac: 25 },
          { name: 'Solar Panel Installation', reduction: 0.45, mac: 85 }
        ],
        tokenization: {
          monthly_emissions: baseFootprint * 30,
          credits_per_month: Math.floor((baseFootprint * 30) / 100),
          days_to_one_credit: Math.ceil(100 / baseFootprint),
          kg_per_credit: 100
        }
      };
    } else {
      return {
        footprint: baseFootprint,
        mode: 'basic',
        notes: ['Basic analysis complete'],
        suggestions: ['Consider enabling advanced mode for detailed insights']
      };
    }
  }
};

export default function App() {
  const [deviceHours, setDeviceHours] = useState(2)
  const [travelKm, setTravelKm] = useState(0)
  const [gridIntensity, setGridIntensity] = useState(300)
  const [loading, setLoading] = useState(false)
  const [footprint, setFootprint] = useState(null)
  const [notes, setNotes] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [advanced, setAdvanced] = useState(true)
  const [ci, setCi] = useState(null)
  const [breakdown, setBreakdown] = useState(null)
  const [abatement, setAbatement] = useState([])
  const [tokenization, setTokenization] = useState(null)

  async function calculateFootprint() {
    try {
      setLoading(true)
      const body = { device_hours: Number(deviceHours), travel_km: Number(travelKm), grid_intensity: Number(gridIntensity) }
      const path = `/api/footprint${advanced ? '?advanced=true' : ''}`
      const data = await api.post(path, body)
      setFootprint(data.footprint)
      setNotes(data.notes || [])
      setSuggestions(data.suggestions || [])
      if (data.mode === 'advanced') {
        setCi(data.ci)
        setBreakdown(data.breakdown)
        setAbatement(data.abatement || [])
        setTokenization(data.tokenization || null)
      } else {
        setCi(null); setBreakdown(null); setAbatement([]); setTokenization(null)
      }
    } catch (e) {
      console.error(e)
      setFootprint(0)
      setNotes(["Service not available. Using fallback recommendations."])
      setSuggestions([
        'Switch to renewable energy plan (est. -20%)',
        'Optimize device standby schedules (est. -10%)',
        'Enable smart thermostat eco-mode (est. -5%)'
      ])
      setCi(null); setBreakdown(null); setAbatement([]); setTokenization(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <style>{styles}</style>
      <div className="bg-pattern" />
      <HexGrid />

      <nav className="navbar">
        <div className="logo">Carbon-Neural</div>
        <ul className="nav-links">
          <li><a href="#platform">Platform</a></li>
          <li><a href="#ai-engine">AI Engine</a></li>
          <li><a href="#tokenization">Tokenization</a></li>
          <li><a href="#docs">Documentation</a></li>
        </ul>
        <a className="nav-cta" href="#dashboard">Dashboard</a>
      </nav>

      <main className="main-content">
        <div className="app-container">
          <div className="app-header">
            <div className="app-badge">AI-Powered Carbon Footprint Analysis</div>
            <h1 className="app-title">Carbon<span className="app-highlight">Neural</span></h1>
            <p className="app-subtitle">AI + Hedera for real-time carbon footprint optimization and tokenized credits.</p>
          </div>

          <div className="calculator-form">
            <div className="toggle">
              <input id="advToggle" type="checkbox" checked={advanced} onChange={e => setAdvanced(e.target.checked)} />
              <label htmlFor="advToggle">Use Advanced Engine (uncertainty, optimization, tokenization)</label>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="deviceHours">Device Hours/day</label>
              <input className="form-input" id="deviceHours" type="number" value={deviceHours} min={0} max={24} step={0.5} onChange={e => setDeviceHours(e.target.value)} placeholder="Enter hours per day" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="travelKm">Travel (km/day)</label>
              <input className="form-input" id="travelKm" type="number" value={travelKm} min={0} step={0.1} onChange={e => setTravelKm(e.target.value)} placeholder="Enter kilometers per day" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gridIntensity">Grid Intensity (gCO2/kWh)</label>
              <input className="form-input" id="gridIntensity" type="number" value={gridIntensity} min={0} step={1} onChange={e => setGridIntensity(e.target.value)} placeholder="Enter grid carbon intensity" />
            </div>

            <button className="btn-predict" onClick={calculateFootprint} disabled={loading}>
              {loading ? 'Analyzing…' : 'Predict Footprint'}
            </button>
          </div>

          <div className={`results-section ${footprint !== null ? 'show' : ''}`}>
            <h3 className="results-title">🧠 AI Carbon Analysis</h3>
            <div className="footprint-display">
              <div className="footprint-value">{(footprint ?? 0).toFixed(2)}</div>
              <div className="footprint-unit">kg CO₂/day</div>
            </div>

            {ci && breakdown && (
              <div className="advanced-grid">
                <div className="card">
                  <h4>Uncertainty (90% CI)</h4>
                  <div className="kv"><span>Low</span><strong>{ci.low.toFixed(2)} kg</strong></div>
                  <div className="kv"><span>High</span><strong>{ci.high.toFixed(2)} kg</strong></div>
                </div>
                <div className="card">
                  <h4>Breakdown</h4>
                  <div className="kv"><span>Device</span><strong>{breakdown.device.toFixed(2)} kg</strong></div>
                  <div className="kv"><span>Travel</span><strong>{breakdown.travel.toFixed(2)} kg</strong></div>
                  <div className="kv"><span>Total</span><strong>{breakdown.total.toFixed(2)} kg</strong></div>
                </div>
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                  <h4>Marginal Abatement Options (sorted by $/t)</h4>
                  {abatement.length === 0 && <div className="tag">No options available</div>}
                  {abatement.map((o, i) => (
                    <div className="mac-item" key={i}>
                      <div>{o.name}</div>
                      <div className="tag">Δ {o.reduction.toFixed(2)} kg/day</div>
                      <div className="tag">MAC ${o.mac}/t</div>
                    </div>
                  ))}
                </div>
                {tokenization && (
                  <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h4>Tokenization Preview</h4>
                    <div className="kv"><span>Monthly emissions</span><strong>{tokenization.monthly_emissions.toFixed(2)} kg</strong></div>
                    <div className="kv"><span>Credits / month</span><strong>{tokenization.credits_per_month}</strong></div>
                    <div className="kv"><span>Days to 1 credit</span><strong>{tokenization.days_to_one_credit} days</strong></div>
                    <div className="tag">1 credit = {tokenization.kg_per_credit} kg CO₂e</div>
                  </div>
                )}
              </div>
            )}

            <div className="recommendations">
              <div className="recommendation-item">
                <strong>⚡ Energy Optimization:</strong> <span>{notes[0] || 'Reduce device usage during peak hours'}</span>
              </div>
              <div className="recommendation-item">
                <strong>🚗 Mobility Insights:</strong> <span>{notes[1] || 'Consider sustainable transport alternatives'}</span>
              </div>
              <div className="recommendation-item">
                <strong>🌱 Carbon Offset:</strong> <span>Annual offset estimate: {footprint ? (footprint * 365).toFixed(0) : '0'} kg CO₂</span>
              </div>
              {suggestions?.length > 0 && (
                <div className="recommendation-item">
                  <strong>🤖 Agent Suggestions:</strong> <span>{suggestions.join(' • ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}