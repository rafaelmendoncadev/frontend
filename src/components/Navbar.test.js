import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
    it('renders navigation links when authenticated', () => {
        render(
            <Router>
                <Navbar authToken="test-token" setAuthToken={() => {}} />
            </Router>
        );
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Pressão/i)).toBeInTheDocument();
        expect(screen.getByText(/Glicose/i)).toBeInTheDocument();
        expect(screen.getByText(/Sair/i)).toBeInTheDocument();
    });

    it('renders login and register links when not authenticated', () => {
        render(
            <Router>
                <Navbar authToken={null} setAuthToken={() => {}} />
            </Router>
        );
        expect(screen.getByText(/Registrar/i)).toBeInTheDocument();
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
});
