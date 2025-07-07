import React from 'react';

const AlertBanner = ({ pressureData, glucoseData }) => {
    const recentPressure = pressureData.slice(0, 5);
    const recentGlucose = glucoseData.slice(0, 5);
    
    const criticalPressure = recentPressure.filter(p => 
        p.systolic >= 180 || p.diastolic >= 120 || // Crise hipertensiva
        p.systolic < 90 || p.diastolic < 60 // Hipotensão
    );
    
    const criticalGlucose = recentGlucose.filter(g => 
        g.glucose < 70 || // Hipoglicemia
        g.glucose > 250 // Hiperglicemia severa
    );
    
    if (criticalPressure.length === 0 && criticalGlucose.length === 0) {
        return null;
    }
    
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>⚠️ Atenção! Valores críticos detectados:</strong>
            
            {criticalPressure.length > 0 && (
                <div className="mt-2">
                    <strong>Pressão Arterial:</strong>
                    <ul className="mb-0">
                        {criticalPressure.map((p, index) => (
                            <li key={index}>
                                {new Date(p.timestamp).toLocaleString('pt-BR')}: 
                                {' '}{p.systolic}/{p.diastolic} mmHg
                                {p.systolic >= 180 || p.diastolic >= 120 ? ' (Crise Hipertensiva!)' : ' (Hipotensão!)'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {criticalGlucose.length > 0 && (
                <div className="mt-2">
                    <strong>Glicose:</strong>
                    <ul className="mb-0">
                        {criticalGlucose.map((g, index) => (
                            <li key={index}>
                                {new Date(g.timestamp).toLocaleString('pt-BR')}: 
                                {' '}{g.glucose} mg/dL
                                {g.glucose < 70 ? ' (Hipoglicemia!)' : ' (Hiperglicemia Severa!)'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="mt-3">
                <small>
                    <strong>Recomendação:</strong> Procure atendimento médico imediatamente se estiver com sintomas.
                </small>
            </div>
            
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
};

export default AlertBanner; 