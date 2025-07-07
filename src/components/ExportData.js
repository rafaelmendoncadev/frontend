import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { classifyPressure, classifyGlucose } from '../utils/validators';

const ExportData = ({ pressureData, glucoseData }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const exportToPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString('pt-BR');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.text('Relatório de Saúde', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Usuário: ${user.username || 'N/A'}`, 20, 35);
        doc.text(`Data do relatório: ${date}`, 20, 42);
        
        // Tabela de Pressão
        if (pressureData.length > 0) {
            doc.setFontSize(14);
            doc.text('Histórico de Pressão Arterial', 20, 55);
            
            const pressureRows = pressureData.map(p => {
                const classification = classifyPressure(p.systolic, p.diastolic);
                return [
                    new Date(p.timestamp).toLocaleString('pt-BR'),
                    `${p.systolic}/${p.diastolic}`,
                    p.pulse,
                    p.medicationTaken ? 'Sim' : 'Não',
                    classification.category
                ];
            });
            
            doc.autoTable({
                head: [['Data/Hora', 'Pressão', 'Pulso', 'Medicação', 'Classificação']],
                body: pressureRows,
                startY: 60,
                theme: 'striped'
            });
        }
        
        // Tabela de Glicose
        if (glucoseData.length > 0) {
            const finalY = doc.lastAutoTable?.finalY || 60;
            doc.setFontSize(14);
            doc.text('Histórico de Glicose', 20, finalY + 15);
            
            const glucoseRows = glucoseData.map(g => {
                const classification = classifyGlucose(g.glucose);
                return [
                    new Date(g.timestamp).toLocaleString('pt-BR'),
                    g.glucose,
                    classification.category
                ];
            });
            
            doc.autoTable({
                head: [['Data/Hora', 'Glicose (mg/dL)', 'Classificação']],
                body: glucoseRows,
                startY: finalY + 20,
                theme: 'striped'
            });
        }
        
        // Salvar
        doc.save(`relatorio_saude_${user.username}_${date.replace(/\//g, '-')}.pdf`);
    };
    
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const date = new Date().toLocaleDateString('pt-BR');
        
        // Aba de Pressão
        if (pressureData.length > 0) {
            const pressureSheet = pressureData.map(p => {
                const classification = classifyPressure(p.systolic, p.diastolic);
                return {
                    'Data/Hora': new Date(p.timestamp).toLocaleString('pt-BR'),
                    'Sistólica': p.systolic,
                    'Diastólica': p.diastolic,
                    'Pulso': p.pulse,
                    'Medicação': p.medicationTaken ? 'Sim' : 'Não',
                    'Classificação': classification.category
                };
            });
            
            const ws = XLSX.utils.json_to_sheet(pressureSheet);
            XLSX.utils.book_append_sheet(wb, ws, 'Pressão Arterial');
        }
        
        // Aba de Glicose
        if (glucoseData.length > 0) {
            const glucoseSheet = glucoseData.map(g => {
                const classification = classifyGlucose(g.glucose);
                return {
                    'Data/Hora': new Date(g.timestamp).toLocaleString('pt-BR'),
                    'Glicose (mg/dL)': g.glucose,
                    'Classificação': classification.category
                };
            });
            
            const ws = XLSX.utils.json_to_sheet(glucoseSheet);
            XLSX.utils.book_append_sheet(wb, ws, 'Glicose');
        }
        
        // Salvar
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `relatorio_saude_${user.username}_${date.replace(/\//g, '-')}.xlsx`);
    };
    
    return (
        <div className="btn-group" role="group">
            <button 
                className="btn btn-outline-danger" 
                onClick={exportToPDF}
                disabled={pressureData.length === 0 && glucoseData.length === 0}
            >
                <i className="bi bi-file-pdf"></i> Exportar PDF
            </button>
            <button 
                className="btn btn-outline-success" 
                onClick={exportToExcel}
                disabled={pressureData.length === 0 && glucoseData.length === 0}
            >
                <i className="bi bi-file-excel"></i> Exportar Excel
            </button>
        </div>
    );
};

export default ExportData; 