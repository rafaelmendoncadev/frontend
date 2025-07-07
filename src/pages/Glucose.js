import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Glucose = () => {
    const [glucose, setGlucose] = useState('');
    const [readings, setReadings] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const fetchReadings = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/glucose');
            setReadings(response.data);
        } catch (error) {
            toast.error('Erro ao buscar leituras de glicose.');
            console.error('Erro ao buscar leituras de glicose:', error);
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { glucose: parseInt(glucose) };

            if (editingId) {
                await axios.put(`http://localhost:3001/api/glucose/${editingId}`, data);
                toast.success('Leitura de glicose atualizada com sucesso!');
                setEditingId(null);
            } else {
                await axios.post('http://localhost:3001/api/glucose', data);
                toast.success('Leitura de glicose salva com sucesso!');
            }
            setGlucose('');
            fetchReadings(); // Refresh the list
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else {
                toast.error('Erro ao salvar/atualizar a leitura de glicose.');
            }
            console.error('Erro ao salvar/atualizar a leitura de glicose:', error);
        }
    };

    const handleEdit = (reading) => {
        setGlucose(reading.glucose);
        setEditingId(reading.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este registro?')) {
            try {
                await axios.delete(`http://localhost:3001/api/glucose/${id}`);
                toast.success('Registro de glicose deletado com sucesso!');
                fetchReadings(); // Refresh the list
            } catch (error) {
                toast.error('Erro ao deletar registro de glicose.');
                console.error('Erro ao deletar registro de glicose:', error);
            }
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
                <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar' : 'Salvar'}</button>
            </form>

            <h3 className="mt-5">Histórico de Leituras de Glicose</h3>
            {readings.length === 0 ? (
                <p>Nenhum registro de glicose encontrado.</p>
            ) : (
                <ul className="list-group">
                    {readings.map((reading) => (
                        <li key={reading.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                Glicose: {reading.glucose} mg/dL
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

export default Glucose;
