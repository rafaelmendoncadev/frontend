import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Glucose = () => {
    const [glucose, setGlucose] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/glucose', { glucose });
            toast.success('Leitura de glicose salva com sucesso!');
            setGlucose('');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else {
                toast.error('Erro ao salvar a leitura de glicose.');
            }
            console.error('Erro ao salvar a leitura de glicose:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Registrar Glicose</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="glucose" className="form-label">Nível de Glicose</label>
                    <input type="number" className="form-control" id="glucose" value={glucose} onChange={(e) => setGlucose(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
        </div>
    );
};

export default Glucose;
