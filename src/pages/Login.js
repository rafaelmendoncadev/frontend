import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setAuthToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            setAuthToken(res.data.token);
            toast.success(`Bem-vindo, ${res.data.user?.username || username}!`);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach(err => toast.error(err.msg));
            } else if (error.response && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error('Erro ao fazer login. Verifique sua conexão.');
            }
            console.error('Erro ao fazer login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Entrar no Sistema</h2>
                            <p className="text-center text-muted mb-4">
                                Controle de Pressão e Glicose
                            </p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        <i className="bi bi-person"></i> Nome de Usuário
                                    </label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg" 
                                        id="username" 
                                        placeholder="Digite seu usuário"
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        disabled={loading}
                                        required 
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        <i className="bi bi-lock"></i> Senha
                                    </label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg" 
                                        id="password" 
                                        placeholder="Digite sua senha"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        disabled={loading}
                                        required 
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Entrando...
                                        </>
                                    ) : (
                                        'Entrar'
                                    )}
                                </button>
                                
                                <div className="text-center">
                                    <p className="mb-0">
                                        Não tem uma conta? {' '}
                                        <Link to="/register" className="text-decoration-none">
                                            Cadastre-se aqui
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
