// Versão alternativa sem autoTable para caso de emergência
import React from 'react';
import { jsPDF } from 'jspdf';

const ExportDataAlternative = ({ pressureData, glucoseData }) => {
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString('pt-BR');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const username = user.username || 'Usuario';
            
            // Cabeçalho
            doc.setFontSize(20);
            doc.text('Relatório de Saúde', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Usuário: ${username}`, 20, 35);
            doc.text(`Data do relatório: ${date}`, 20, 42);
            
            let currentY = 60;
            
            // Dados de Pressão
            if (pressureData && pressureData.length > 0) {
                doc.setFontSize(14);
                doc.text('Histórico de Pressão Arterial', 20, currentY);
                currentY += 10;
                
                doc.setFontSize(10);
                pressureData.forEach((p, index) => {
                    const timestamp = new Date(p.timestamp);
                    const dateStr = timestamp.toLocaleDateString('pt-BR');
                    const timeStr = timestamp.toLocaleTimeString('pt-BR');
                    
                    doc.text(`${index + 1}. ${dateStr} ${timeStr}`, 20, currentY);
                    doc.text(`Pressão: ${p.systolic}/${p.diastolic}`, 20, currentY + 7);
                    doc.text(`Pulso: ${p.pulse}`, 20, currentY + 14);
                    doc.text(`Medicação: ${p.medicationTaken ? 'Sim' : 'Não'}`, 20, currentY + 21);
                    
                    currentY += 35;
                    
                    // Nova página se necessário
                    if (currentY > 250) {
                        doc.addPage();
                        currentY = 20;
                    }
                });
            }
            
            // Dados de Glicose
            if (glucoseData && glucoseData.length > 0) {
                if (currentY > 200) {
                    doc.addPage();
                    currentY = 20;
                }
                
                doc.setFontSize(14);
                doc.text('Histórico de Glicose', 20, currentY);
                currentY += 10;
                
                doc.setFontSize(10);
                glucoseData.forEach((g, index) => {
                    const timestamp = new Date(g.timestamp);
                    const dateStr = timestamp.toLocaleDateString('pt-BR');
                    const timeStr = timestamp.toLocaleTimeString('pt-BR');
                    
                    doc.text(`${index + 1}. ${dateStr} ${timeStr}`, 20, currentY);
                    doc.text(`Glicose: ${g.glucose} mg/dL`, 20, currentY + 7);
                    
                    currentY += 20;
                    
                    // Nova página se necessário
                    if (currentY > 250) {
                        doc.addPage();
                        currentY = 20;
                    }
                });
            }
            
            // Salvar
            const safeDate = date.replace(/\//g, '-');
            const fileName = `relatorio_saude_${username}_${safeDate}.pdf`;
            doc.save(fileName);
            
            console.log('PDF exportado com sucesso (versão alternativa):', fileName);
            
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            alert('Erro ao gerar PDF: ' + error.message);
        }
    };
    
    return (
        <button className="btn btn-outline-danger" onClick={exportToPDF}>
            📄 Exportar PDF (Alternativo)
        </button>
    );
};

export default ExportDataAlternative;
