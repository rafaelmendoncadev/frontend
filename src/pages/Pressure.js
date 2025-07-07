import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Pressure = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/pressure', { systolic, diastolic, pulse });
            toast.success('Leitura de pressão salva com sucesso!');
            setSystolic('');
            setDiastolic('');
            setPulse('');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else {
                toast.error('Erro ao salvar a leitura de pressão.');
            }
            console.error('Erro ao salvar a leitura de pressão:', error);
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
                <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
        </div>
    );
};

export default Pressure;
