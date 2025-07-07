import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { classifyPressure, classifyGlucose } from '../utils/validators';

const ExportData = ({ pressureData, glucoseData }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString('pt-BR');
            const username = user.username || 'Usuario';
            
            console.log('Iniciando exportação PDF...');
            console.log('User:', user);
            console.log('Pressure data:', pressureData);
            console.log('Glucose data:', glucoseData);
            
            // Cabeçalho
            doc.setFontSize(20);
            doc.text('Relatório de Saúde', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Usuário: ${username}`, 20, 35);
            doc.text(`Data do relatório: ${date}`, 20, 42);
            
            let currentY = 55;
            
            // Tabela de Pressão
            if (pressureData && pressureData.length > 0) {
                doc.setFontSize(14);
                doc.text('Histórico de Pressão Arterial', 20, currentY);
                
                const pressureRows = pressureData.map(p => {
                    try {
                        const classification = classifyPressure(p.systolic, p.diastolic);
                        const timestamp = new Date(p.timestamp);
                        const dateStr = timestamp.toLocaleDateString('pt-BR');
                        const timeStr = timestamp.toLocaleTimeString('pt-BR');
                        
                        return [
                            `${dateStr} ${timeStr}`,
                            `${p.systolic || 'N/A'}/${p.diastolic || 'N/A'}`,
                            p.pulse || 'N/A',
                            p.medicationTaken ? 'Sim' : 'Não',
                            classification.category || 'N/A'
                        ];
                    } catch (error) {
                        console.error('Erro ao processar dados de pressão:', error, p);
                        return ['Erro', 'Erro', 'Erro', 'Erro', 'Erro'];
                    }
                });
                
                autoTable(doc, {
                    head: [['Data/Hora', 'Pressão', 'Pulso', 'Medicação', 'Classificação']],
                    body: pressureRows,
                    startY: currentY + 5,
                    theme: 'striped'
                });
                
                currentY = doc.lastAutoTable.finalY + 15;
            }
            
            // Tabela de Glicose
            if (glucoseData && glucoseData.length > 0) {
                doc.setFontSize(14);
                doc.text('Histórico de Glicose', 20, currentY);
                
                const glucoseRows = glucoseData.map(g => {
                    try {
                        const classification = classifyGlucose(g.glucose);
                        const timestamp = new Date(g.timestamp);
                        const dateStr = timestamp.toLocaleDateString('pt-BR');
                        const timeStr = timestamp.toLocaleTimeString('pt-BR');
                        
                        return [
                            `${dateStr} ${timeStr}`,
                            g.glucose || 'N/A',
                            classification.category || 'N/A'
                        ];
                    } catch (error) {
                        console.error('Erro ao processar dados de glicose:', error, g);
                        return ['Erro', 'Erro', 'Erro'];
                    }
                });
                
                autoTable(doc, {
                    head: [['Data/Hora', 'Glicose (mg/dL)', 'Classificação']],
                    body: glucoseRows,
                    startY: currentY + 5,
                    theme: 'striped'
                });
            }
            
            // Salvar com nome seguro
            const safeDate = date.replace(/\//g, '-');
            const fileName = `relatorio_saude_${username}_${safeDate}.pdf`;
            doc.save(fileName);
            
            console.log('PDF exportado com sucesso:', fileName);
            
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            alert('Erro ao gerar PDF: ' + error.message);
        }
    };
    
    const exportToExcel = () => {
        try {
            const wb = XLSX.utils.book_new();
            const date = new Date().toLocaleDateString('pt-BR');
            const username = user.username || 'Usuario';
            
            console.log('Iniciando exportação Excel...');
            
            // Aba de Pressão
            if (pressureData && pressureData.length > 0) {
                const pressureSheet = pressureData.map(p => {
                    try {
                        const classification = classifyPressure(p.systolic, p.diastolic);
                        const timestamp = new Date(p.timestamp);
                        
                        return {
                            'Data/Hora': timestamp.toLocaleString('pt-BR'),
                            'Sistólica': p.systolic || 'N/A',
                            'Diastólica': p.diastolic || 'N/A',
                            'Pulso': p.pulse || 'N/A',
                            'Medicação': p.medicationTaken ? 'Sim' : 'Não',
                            'Classificação': classification.category || 'N/A'
                        };
                    } catch (error) {
                        console.error('Erro ao processar dados de pressão para Excel:', error, p);
                        return {
                            'Data/Hora': 'Erro',
                            'Sistólica': 'Erro',
                            'Diastólica': 'Erro',
                            'Pulso': 'Erro',
                            'Medicação': 'Erro',
                            'Classificação': 'Erro'
                        };
                    }
                });
                
                const ws = XLSX.utils.json_to_sheet(pressureSheet);
                XLSX.utils.book_append_sheet(wb, ws, 'Pressão Arterial');
            }
            
            // Aba de Glicose
            if (glucoseData && glucoseData.length > 0) {
                const glucoseSheet = glucoseData.map(g => {
                    try {
                        const classification = classifyGlucose(g.glucose);
                        const timestamp = new Date(g.timestamp);
                        
                        return {
                            'Data/Hora': timestamp.toLocaleString('pt-BR'),
                            'Glicose (mg/dL)': g.glucose || 'N/A',
                            'Classificação': classification.category || 'N/A'
                        };
                    } catch (error) {
                        console.error('Erro ao processar dados de glicose para Excel:', error, g);
                        return {
                            'Data/Hora': 'Erro',
                            'Glicose (mg/dL)': 'Erro',
                            'Classificação': 'Erro'
                        };
                    }
                });
                
                const ws = XLSX.utils.json_to_sheet(glucoseSheet);
                XLSX.utils.book_append_sheet(wb, ws, 'Glicose');
            }
            
            // Salvar
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const safeDate = date.replace(/\//g, '-');
            const fileName = `relatorio_saude_${username}_${safeDate}.xlsx`;
            
            saveAs(data, fileName);
            console.log('Excel exportado com sucesso:', fileName);
            
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            alert('Erro ao gerar Excel: ' + error.message);
        }
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