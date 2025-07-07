import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [readings, setReadings] = useState([]);
  const [type, setType] = useState('pressure');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [glucose, setGlucose] = useState('');

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/readings');
      setReadings(response.data);
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReading = {
        type,
        ...(type === 'pressure' && { systolic: parseInt(systolic), diastolic: parseInt(diastolic), pulse: parseInt(pulse) }),
        ...(type === 'glucose' && { glucose: parseInt(glucose) }),
      };
      await axios.post('http://localhost:3001/api/readings', newReading);
      fetchReadings();
      // Limpar formulário
      setSystolic('');
      setDiastolic('');
      setPulse('');
      setGlucose('');
    } catch (error) {
      console.error('Erro ao adicionar leitura:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Controle de Pressão Arterial e Glicose</h1>

      <div className="card mb-4">
        <div className="card-header">Adicionar Nova Leitura</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">Tipo de Leitura:</label>
              <select id="type" className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="pressure">Pressão Arterial</option>
                <option value="glucose">Glicose</option>
              </select>
            </div>

            {type === 'pressure' && (
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="systolic" className="form-label">Sistólica (mmHg):</label>
                  <input type="number" id="systolic" className="form-control" value={systolic} onChange={(e) => setSystolic(e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label htmlFor="diastolic" className="form-label">Diastólica (mmHg):</label>
                  <input type="number" id="diastolic" className="form-control" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label htmlFor="pulse" className="form-label">Pulso (bpm):</label>
                  <input type="number" id="pulse" className="form-control" value={pulse} onChange={(e) => setPulse(e.target.value)} required />
                </div>
              </div>
            )}

            {type === 'glucose' && (
              <div className="mb-3">
                <label htmlFor="glucose" className="form-label">Glicose (mg/dL):</label>
                <input type="number" id="glucose" className="form-control" value={glucose} onChange={(e) => setGlucose(e.target.value)} required />
              </div>
            )}

            <button type="submit" className="btn btn-primary">Adicionar Leitura</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Histórico de Leituras</div>
        <div className="card-body">
          {readings.length === 0 ? (
            <p>Nenhuma leitura registrada ainda.</p>
          ) : (
            <ul className="list-group">
              {readings.map((reading) => (
                <li key={reading.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {reading.type === 'pressure' ? (
                      `Pressão: ${reading.systolic}/${reading.diastolic} mmHg, Pulso: ${reading.pulse} bpm`
                    ) : (
                      `Glicose: ${reading.glucose} mg/dL`
                    )}
                    <br />
                    <small className="text-muted">{new Date(reading.timestamp).toLocaleString()}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;