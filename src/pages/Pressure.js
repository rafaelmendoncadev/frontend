import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validatePressure, classifyPressure } from '../utils/validators';

const Pressure = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [medicationTaken, setMedicationTaken] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação no frontend
        const errors = validatePressure(systolic, diastolic, pulse);
        if (errors.length > 0) {
            errors.forEach(err => toast.error(err));
            return;
        }
        
        try {
            // Log dos dados sendo enviados
            console.log('Dados enviados:', { systolic, diastolic, pulse, medicationTaken });
            console.log('Token:', localStorage.getItem('token'));
            console.log('Headers do axios:', axios.defaults.headers.common);
            
            const response = await axios.post('http://localhost:3001/api/pressure', { 
                systolic: parseInt(systolic), 
                diastolic: parseInt(diastolic), 
                pulse: parseInt(pulse), 
                medicationTaken 
            });
            
            console.log('Resposta do servidor:', response.data);
            
            // Classificar e mostrar resultado
            const classification = classifyPressure(systolic, diastolic);
            toast.success(`Leitura salva! ${classification.icon} Classificação: ${classification.category}`, {
                className: `toast-${classification.color}`
            });
            
            setSystolic('');
            setDiastolic('');
            setPulse('');
            setMedicationTaken(false);
        } catch (error) {
            console.error('Erro completo:', error);
            console.error('Resposta do erro:', error.response?.data);
            console.error('Status do erro:', error.response?.status);
            console.error('Headers do erro:', error.response?.headers);
            
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else if (error.response && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error('Erro ao salvar a leitura de pressão: ' + (error.message || 'Erro desconhecido'));
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Registrar Pressão Arterial</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="systolic" className="form-label">Pressão Sistólica</label>
                    <input type="number" className="form-control" id="systolic" value={systolic} onChange={(e) => setSystolic(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="diastolic" className="form-label">Pressão Diastólica</label>
                    <input type="number" className="form-control" id="diastolic" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="pulse" className="form-label">Pulso</label>
                    <input type="number" className="form-control" id="pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} required />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="medicationTaken" checked={medicationTaken} onChange={(e) => setMedicationTaken(e.target.checked)} />
                    <label className="form-check-label" htmlFor="medicationTaken">Tomei medicação</label>
                </div>
                <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
        </div>
    );
};

export default Pressure;
