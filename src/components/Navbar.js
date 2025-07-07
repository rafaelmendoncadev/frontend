import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ authToken, setAuthToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Controle de Saúde</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {authToken && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/pressure">Pressão</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/glucose">Glicose</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {authToken ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>Sair</button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registrar</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
