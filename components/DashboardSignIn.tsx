import React, { useState } from 'react';
import type { User, Language } from '../types';
import { supabaseClient as supabase } from '../services/supabaseClient';

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

interface PartnerHubSignInProps {
    onLogin: (user: User) => void;
    language: Language;
}

export const PartnerHubSignIn: React.FC<PartnerHubSignInProps> = ({ onLogin, language }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError(null);

        try {
            // Step 1: Sign in the user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                throw new Error(authError.message);
            }

            if (!authData.user) {
                throw new Error('Authentication failed, please try again.');
            }

            // Step 2: Fetch the user's profile from the 'clients' table
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('user_id', authData.user.id)
                .single();
            
            if (clientError) {
                // This could happen if a user exists in auth but not in the clients table
                throw new Error('Could not find your client profile. Please contact support.');
            }
            
            if (clientData) {
                const userProfile: User = {
                    name: clientData.name,
                    company: clientData.company,
                    email: clientData.email,
                    phone: clientData.phone,
                };
                onLogin(userProfile);
            }

        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 backdrop-blur-md p-8 sm:p-12 rounded-lg shadow-2xl border border-raisin-black/10 dark:border-eggshell-white/10">
                <div className="text-center mb-8">
                    <h1 className="font-serif font-bold text-3xl text-raisin-black dark:text-eggshell-white mb-2 uppercase tracking-wider">
                        Welcome to Your Partner Hub
                    </h1>
                    <p className="text-raisin-black/70 dark:text-eggshell-white/70">
                        Sign in to manage your projects and collaborate with our team.
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-500/20 text-red-400 dark:text-red-300 p-3 rounded-md text-center mb-6 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                            <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </div>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            className="w-full bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 ps-10 p-3 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue dark:focus:border-vibrant-magenta dark:focus:ring-vibrant-magenta transition-colors" 
                            placeholder="Email Address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required 
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                            <Icon path="M10 12a2 2 0 100-4 2 2 0 000 4zm-1-7a4 4 0 00-4 4v4a2 2 0 002 2h4a2 2 0 002-2v-4a4 4 0 00-4-4z" />
                        </div>
                        <input 
                            id="password" 
                            name="password" 
                            type={showPassword ? 'text' : 'password'}
                            className="w-full bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 ps-10 pe-10 p-3 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue dark:focus:border-vibrant-magenta dark:focus:ring-vibrant-magenta transition-colors" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 end-0 flex items-center pe-3 text-raisin-black/50 dark:text-eggshell-white/50 hover:text-action-blue dark:hover:text-vibrant-magenta focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <Icon path="M13.879 10.121a3 3 0 10-3.758 3.758l3.758-3.758zM10 4a8 8 0 00-8 8c0 1.045.24 2.03.684 2.93l9.09-9.09A7.96 7.96 0 0010 4zM2 10a8 8 0 0013.07 6.316L4.316 5.56A7.96 7.96 0 002 10z" />
                            ) : (
                                <Icon path="M10 12a2 2 0 100-4 2 2 0 000 4z M1 10c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7-8-3.134-8-7z" />
                            )}
                        </button>
                    </div>

                    <div className="pt-4">
                        <div className="interactive-shadow-container w-full">
                            <button 
                                type="submit" 
                                className="w-full bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 relative overflow-hidden shine-effect disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait button-inset-shadow"
                                disabled={isLoggingIn}
                            >
                                <span className="relative z-10">{isLoggingIn ? 'Signing In...' : 'Sign In'}</span>
                            </button>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-8 text-sm text-raisin-black/60 dark:text-eggshell-white/60">
                    <p>
                        Need access? Please get in touch with your project manager, and we'll be happy to help.
                    </p>
                </div>
            </div>
        </div>
    );
};