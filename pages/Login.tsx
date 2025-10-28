import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Logo from '../components/Logo';
import { FiLogIn, FiAlertCircle, FiLoader } from 'react-icons/fi';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (email.trim() && password.trim()) {
            setLoading(true);
            const success = await signIn(email.trim());
            if (!success) {
                setError('Invalid email or password.');
            }
            setLoading(false);
        } else {
            setError('Please enter both email and password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <Logo className="w-16 h-16 text-primary-500 mb-4" />
                    <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Welcome to CRM Pro</h1>
                    <p className="text-center text-gray-500 dark:text-gray-400">Please sign in to continue</p>
                </div>

                <div className="p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                                <FiAlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:bg-primary-400 disabled:cursor-not-allowed"
                            >
                                {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiLogIn className="w-5 h-5 mr-2" />}
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="mt-6 p-4 bg-primary-50 dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-lg text-sm">
                    <h3 className="font-bold text-primary-800 dark:text-primary-200 mb-2">Demo Credentials</h3>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p><strong>Admin:</strong> admin@businesscrm.com</p>
                        <p><strong>Agent:</strong> alice@businesscrm.com</p>
                        <p className="italic text-xs mt-1"> (Password can be anything)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;