// Validações para pressão arterial
export const validatePressure = (systolic, diastolic, pulse) => {
    const errors = [];
    
    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    const pulseNum = parseInt(pulse);
    
    if (!systolic || isNaN(systolicNum)) {
        errors.push('Pressão sistólica é obrigatória');
    } else if (systolicNum < 50 || systolicNum > 300) {
        errors.push('Pressão sistólica deve estar entre 50 e 300');
    }
    
    if (!diastolic || isNaN(diastolicNum)) {
        errors.push('Pressão diastólica é obrigatória');
    } else if (diastolicNum < 30 || diastolicNum > 200) {
        errors.push('Pressão diastólica deve estar entre 30 e 200');
    }
    
    if (!pulse || isNaN(pulseNum)) {
        errors.push('Pulso é obrigatório');
    } else if (pulseNum < 30 || pulseNum > 200) {
        errors.push('Pulso deve estar entre 30 e 200');
    }
    
    if (systolicNum && diastolicNum && systolicNum <= diastolicNum) {
        errors.push('Pressão sistólica deve ser maior que a diastólica');
    }
    
    return errors;
};

// Validações para glicose
export const validateGlucose = (glucose) => {
    const errors = [];
    
    const glucoseNum = parseInt(glucose);
    
    if (!glucose || isNaN(glucoseNum)) {
        errors.push('Valor de glicose é obrigatório');
    } else if (glucoseNum < 20 || glucoseNum > 600) {
        errors.push('Glicose deve estar entre 20 e 600 mg/dL');
    }
    
    return errors;
};

// Classificação da pressão arterial
export const classifyPressure = (systolic, diastolic) => {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    
    if (s < 120 && d < 80) {
        return { category: 'Normal', color: 'success', icon: '✓' };
    } else if (s < 130 && d < 80) {
        return { category: 'Elevada', color: 'warning', icon: '!' };
    } else if (s < 140 || d < 90) {
        return { category: 'Hipertensão Estágio 1', color: 'warning', icon: '⚠' };
    } else if (s < 180 || d < 120) {
        return { category: 'Hipertensão Estágio 2', color: 'danger', icon: '⚠' };
    } else {
        return { category: 'Crise Hipertensiva', color: 'danger', icon: '🚨' };
    }
};

// Classificação da glicose
export const classifyGlucose = (glucose) => {
    const g = parseInt(glucose);
    
    if (g < 70) {
        return { category: 'Hipoglicemia', color: 'danger', icon: '⚠' };
    } else if (g <= 99) {
        return { category: 'Normal', color: 'success', icon: '✓' };
    } else if (g <= 125) {
        return { category: 'Pré-diabetes', color: 'warning', icon: '!' };
    } else {
        return { category: 'Diabetes', color: 'danger', icon: '⚠' };
    }
}; 