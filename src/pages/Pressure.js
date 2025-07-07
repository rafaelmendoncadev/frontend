import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validatePressure, classifyPressure } from '../utils/validators';

const Pressure = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [medicationTaken, setMedicationTaken] = useState(false);
    const [readings, setReadings] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const fetchReadings = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/pressure');
            setReadings(response.data);
        } catch (error) {
            toast.error('Erro ao buscar leituras de pressão.');
            console.error('Erro ao buscar leituras de pressão:', error);
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validatePressure(systolic, diastolic, pulse);
        if (errors.length > 0) {
            errors.forEach(err => toast.error(err));
            return;
        }
        
        try {
            const data = { 
                systolic: parseInt(systolic), 
                diastolic: parseInt(diastolic), 
                pulse: parseInt(pulse), 
                medicationTaken 
            };

            if (editingId) {
                await axios.put(`http://localhost:3001/api/pressure/${editingId}`, data);
                toast.success('Leitura de pressão atualizada com sucesso!');
                setEditingId(null);
            } else {
                await axios.post('http://localhost:3001/api/pressure', data);
                toast.success('Leitura de pressão salva com sucesso!');
            }
            
            const classification = classifyPressure(systolic, diastolic);
            toast.success(`Leitura salva! ${classification.icon} Classificação: ${classification.category}`, {
                className: `toast-${classification.color}`
            });
            
            setSystolic('');
            setDiastolic('');
            setPulse('');
            setMedicationTaken(false);
            fetchReadings(); // Refresh the list
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else if (error.response && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error('Erro ao salvar/atualizar a leitura de pressão: ' + (error.message || 'Erro desconhecido'));
            }
            console.error('Erro ao salvar/atualizar a leitura de pressão:', error);
        }
    };

    const handleEdit = (reading) => {
        setSystolic(reading.systolic);
        setDiastolic(reading.diastolic);
        setPulse(reading.pulse);
        setMedicationTaken(reading.medicationTaken === 1); // SQLite stores booleans as 0 or 1
        setEditingId(reading.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este registro?')) {
            try {
                await axios.delete(`http://localhost:3001/api/pressure/${id}`);
                toast.success('Registro de pressão deletado com sucesso!');
                fetchReadings(); // Refresh the list
            } catch (error) {
                toast.error('Erro ao deletar registro de pressão.');
                console.error('Erro ao deletar registro de pressão:', error);
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
                <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar' : 'Salvar'}</button>
            </form>

            <h3 className="mt-5">Histórico de Leituras de Pressão</h3>
            {readings.length === 0 ? (
                <p>Nenhum registro de pressão encontrado.</p>
            ) : (
                <ul className="list-group">
                    {readings.map((reading) => (
                        <li key={reading.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                Pressão: {reading.systolic}/{reading.diastolic} mmHg, Pulso: {reading.pulse} bpm
                                {reading.medicationTaken ? ' (Medicação Tomada)' : ''}
                                <br />
                                <small className="text-muted">{new Date(reading.timestamp).toLocaleString()}</small>
                            </div>
                            <div>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(reading)}>Editar</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(reading.id)}>Deletar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Pressure;
