import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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
            <h2>Dashboard</h2>
            <div className="btn-group mb-3" role="group">
                <button type="button" className={`btn btn-secondary ${period === 7 ? 'active' : ''}`} onClick={() => setPeriod(7)}>Últimos 7 dias</button>
                <button type="button" className={`btn btn-secondary ${period === 30 ? 'active' : ''}`} onClick={() => setPeriod(30)}>Últimos 30 dias</button>
                <button type="button" className={`btn btn-secondary ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>Todos</button>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h3>Pressão Arterial</h3>
                    <Line data={pressureChartData} />
                    <div className="mt-3">
                        <h5>Estatísticas (Sistólica)</h5>
                        <p>Média: {pressureStats.systolic.avg} | Máxima: {pressureStats.systolic.max} | Mínima: {pressureStats.systolic.min}</p>
                        <h5>Estatísticas (Diastólica)</h5>
                        <p>Média: {pressureStats.diastolic.avg} | Máxima: {pressureStats.diastolic.max} | Mínima: {pressureStats.diastolic.min}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>Glicose</h3>
                    <Line data={glucoseChartData} />
                    <div className="mt-3">
                        <h5>Estatísticas</h5>
                        <p>Média: {glucoseStats.avg} | Máxima: {glucoseStats.max} | Mínima: {glucoseStats.min}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
