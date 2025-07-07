import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { classifyPressure, classifyGlucose } from '../utils/validators';
import AlertBanner from '../components/AlertBanner';
import ExportData from '../components/ExportData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [pressureData, setPressureData] = useState([]);
    const [glucoseData, setGlucoseData] = useState([]);
    const [period, setPeriod] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pressureRes = await axios.get('http://localhost:3001/api/pressure');
                const glucoseRes = await axios.get('http://localhost:3001/api/glucose');
                setPressureData(pressureRes.data);
                setGlucoseData(glucoseRes.data);
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };
        fetchData();
    }, []);

    const filterDataByPeriod = (data, days) => {
        if (days === 'all') {
            return data;
        }
        const date = new Date();
        date.setDate(date.getDate() - days);
        return data.filter(d => new Date(d.timestamp) >= date);
    };

    const filteredPressureData = filterDataByPeriod(pressureData, period);
    const filteredGlucoseData = filterDataByPeriod(glucoseData, period);

    const calculateStats = (data, key) => {
        if (data.length === 0) {
            return { avg: 0, max: 0, min: 0 };
        }
        const values = data.map(d => d[key]);
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        return { avg: avg.toFixed(2), max, min };
    };

    const pressureStats = {
        systolic: calculateStats(filteredPressureData, 'systolic'),
        diastolic: calculateStats(filteredPressureData, 'diastolic'),
    };

    const glucoseStats = calculateStats(filteredGlucoseData, 'glucose');

    const pressureClassification = classifyPressure(pressureStats.systolic.avg, pressureStats.diastolic.avg);
    const glucoseClassification = classifyGlucose(glucoseStats.avg);
    
    // Contar leituras com medicação
    const medicationCount = filteredPressureData.filter(p => p.medicationTaken).length;
    const medicationPercentage = filteredPressureData.length > 0 
        ? Math.round((medicationCount / filteredPressureData.length) * 100) 
        : 0;

    const pressureChartData = {
        labels: filteredPressureData.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'Sistólica',
                data: filteredPressureData.map(d => d.systolic),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Diastólica',
                data: filteredPressureData.map(d => d.diastolic),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    const glucoseChartData = {
        labels: filteredGlucoseData.map(d => new Date(d.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'Glicose',
                data: filteredGlucoseData.map(d => d.glucose),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard de Saúde</h2>
                <ExportData pressureData={pressureData} glucoseData={glucoseData} />
            </div>
            
            {/* Banner de Alertas */}
            <AlertBanner pressureData={pressureData} glucoseData={glucoseData} />
            
            <div className="btn-group mb-3" role="group">
                <button type="button" className={`btn btn-secondary ${period === 7 ? 'active' : ''}`} onClick={() => setPeriod(7)}>Últimos 7 dias</button>
                <button type="button" className={`btn btn-secondary ${period === 30 ? 'active' : ''}`} onClick={() => setPeriod(30)}>Últimos 30 dias</button>
                <button type="button" className={`btn btn-secondary ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>Todos</button>
            </div>
            {/* Cards de Resumo */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Pressão Média</h5>
                            <h3>{pressureStats.systolic.avg}/{pressureStats.diastolic.avg}</h3>
                            <span className={`badge bg-${pressureClassification.color}`}>
                                {pressureClassification.icon} {pressureClassification.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Glicose Média</h5>
                            <h3>{glucoseStats.avg} mg/dL</h3>
                            <span className={`badge bg-${glucoseClassification.color}`}>
                                {glucoseClassification.icon} {glucoseClassification.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total de Leituras</h5>
                            <h3>{filteredPressureData.length + filteredGlucoseData.length}</h3>
                            <small className="text-muted">No período selecionado</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Com Medicação</h5>
                            <h3>{medicationPercentage}%</h3>
                            <small className="text-muted">{medicationCount} de {filteredPressureData.length}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Pressão Arterial</h4>
                        </div>
                        <div className="card-body">
                            <Line data={pressureChartData} options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: false }
                                }
                            }} />
                            <div className="mt-3">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Média</th>
                                            <th>Máxima</th>
                                            <th>Mínima</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Sistólica</strong></td>
                                            <td>{pressureStats.systolic.avg}</td>
                                            <td>{pressureStats.systolic.max}</td>
                                            <td>{pressureStats.systolic.min}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Diastólica</strong></td>
                                            <td>{pressureStats.diastolic.avg}</td>
                                            <td>{pressureStats.diastolic.max}</td>
                                            <td>{pressureStats.diastolic.min}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Glicose</h4>
                        </div>
                        <div className="card-body">
                            <Line data={glucoseChartData} options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: false }
                                }
                            }} />
                            <div className="mt-3">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Média</th>
                                            <th>Máxima</th>
                                            <th>Mínima</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{glucoseStats.avg}</td>
                                            <td>{glucoseStats.max}</td>
                                            <td>{glucoseStats.min}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
