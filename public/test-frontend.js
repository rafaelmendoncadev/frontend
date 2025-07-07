// Teste simples do frontend
console.log('=== Teste do Frontend ===');

// Verificar se o localStorage tem token
const token = localStorage.getItem('token');
console.log('Token no localStorage:', token);

// Testar requisição diretamente
if (token) {
    fetch('http://localhost:3001/api/pressure', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({
            systolic: 120,
            diastolic: 80,
            pulse: 72,
            medicationTaken: false
        })
    })
    .then(response => {
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
} else {
    console.log('Sem token - precisa fazer login primeiro');
}
