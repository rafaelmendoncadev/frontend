import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuthToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            toast.success('Login bem-sucedido!');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else if (error.response && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error('Erro ao fazer login.');
            }
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Nome de Usuário</label>
                    <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
