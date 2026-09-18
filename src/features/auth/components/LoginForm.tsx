import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hook/useAuth';

import leafmain from '@/assets/images/background.png';
import leaf3d from '@/assets/images/leafmain.png';

export function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Estados del formulario[cite: 1, 2]
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // NUEVO ESTADO: Controla la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/tareas', { replace: true });
        } catch {
            setError('Credenciales inválidas');
        } finally {
            setPassword('');
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden font-[--font-poppins] antialiased bg-cover bg-center"
            style={{ backgroundImage: `url(${leafmain})` }}
        >
            {/* CAPA AMBIENTAL */}
            <div className="absolute inset-0 bg-green-800/40 pointer-events-none backdrop-blur-md" />

            {/* TARJETA CONTENEDORA GLASSMORPHIC */}
            <div className="relative flex flex-col md:grid md:grid-cols-12 w-full max-w-md md:max-w-4xl min-h-135 rounded-4xl bg-white/70 shadow-[0_0_40px_0_rgba(0,5,1,0.4)] backdrop-blur-xl overflow-visible">

                {/* LADO IZQUIERDO: Zona de la Planta (Ampliada) */}
                <div className="relative hidden md:flex md:col-span-5 h-full rounded-l-4xl items-center justify-center bg-lime-900/10 overflow-hidden">
                    <div className="z-10 group flex justify-center items-center">
                        <img
                            src={leaf3d}
                            alt="Hoja 3D"
                            className="w-[40rem] max-w-none scale-[1.1] object-contain drop-shadow-[4px_6px_25px_rgba(0,5,1,0.3)] pointer-events-none transition-transform duration-700 ease-in-out group-hover:scale-[1.3]"
                        />
                    </div>
                </div>

                {/* LADO DERECHO: Formulario */}
                <div className="col-span-12 md:col-span-7 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 z-10">
                    <div className="w-full max-w-sm space-y-8 text-center">

                        {/* TÍTULO PRINCIPAL */}
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-wide text-green-900 uppercase drop-shadow-sm">
                                Inicia Sesión en SIMCO
                            </h2>
                            <p className="text-base tracking-wide text-black/60 mt-1">
                                Ingresa tus credenciales para acceder.
                            </p>
                        </div>

                        {/* FORMULARIO */}
                        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">

                            {/* Campo: Correo Electrónico */}
                            <div className="relative flex items-center">
                                <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-700 shadow-sm z-10 border border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    autoComplete="username"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 w-full rounded-full bg-white border border-gray-200 pl-14 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 focus:border-green-700 focus:ring-4 focus:ring-green-700/10 shadow-sm"
                                    required
                                />
                            </div>

                            {/* Campo: Contraseña */}
                            <div className="relative flex items-center justify-end">
                                <input
                                    // Cambiamos dinámicamente el tipo de input dependiendo del estado
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 w-full rounded-full bg-white border border-gray-200 pl-6 pr-14 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 focus:border-green-700 focus:ring-4 focus:ring-green-700/10 shadow-sm"
                                    required
                                />

                                {/* Botón interactivo para mostrar/ocultar contraseña */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-700 shadow-sm z-10 border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700/20 cursor-pointer"
                                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        // Ícono de ojo abierto (Visible)
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    ) : (
                                        // Ícono de ojo cerrado (Oculto)
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Mensaje de Error */}
                            {error && (
                                <p role="alert" className="text-xs font-semibold text-rose-700 py-2 px-4 rounded-full text-center animate-pulse bg-rose-100">
                                    {error}
                                </p>
                            )}

                            {/* BOTÓN LOGIN */}
                            <button
                                type="submit"
                                className="w-full h-12 rounded-full bg-green-700 text-sm font-bold tracking-widest text-white uppercase shadow-md transition-all duration-300 hover:bg-green-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer mt-2"
                            >
                                Iniciar
                            </button>
                        </form>

                        {/* ENLACES RECUPERACIÓN */}
                        <div className="pt-2">
                            <a href="#" className="text-xs font-semibold text-green-800 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}