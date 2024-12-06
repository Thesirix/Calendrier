import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === 'FSP13') {
            navigate('/landing'); 
        } else {
            setError('Mot de passe incorrect');
        }
    };

    return (
        <div className="login-page">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 login-card">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-6xl font-bold leading-9 tracking-tight text-white">
                        Connexion
                    </h2>
                </div>

                <div className="max-w-md w-full p-6 bg-white rounded-lg mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                <h3>Nom</h3>
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-md border py-1.5 text-grey placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                <h3>Mot de passe</h3>
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border py-1.5 text-grey placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-orange px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-white hover:text-orange border hover:border-orange"
                        >
                            <h3>Se connecter</h3>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
