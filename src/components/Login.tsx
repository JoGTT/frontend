import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Assets
import IconLogo from '../assets/usario';
import ContraLogo from '../assets/contraseña';
import OjoLogo from '../assets/ojo';
import OjoCerradoLogo from '../assets/ojoCerrado';
import SedegesLogo from './SedegesLogo';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    sessionStorage.clear();
    localStorage.clear();
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Por favor ingrese usuario y contraseña');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast.success('¡Bienvenido al Sistema SEDEGES!');
        navigate('/dashboard');
      } else {
        toast.error('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      toast.error('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#080d1a] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#b8860b]/20 blur-[110px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-[120px] animate-ping"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f162b] via-[#0b1020] to-[#0f162b] opacity-70"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-[2px] rounded-[28px] bg-gradient-to-br from-[#d4af37] via-[#e8d18a] to-[#8c6b1f] opacity-90 blur-[2px] animate-[pulse_6s_ease-in-out_infinite]"></div>

        <div className="relative bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl p-10 border border-[#e8d18a]/60">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-[10px] rounded-full bg-white shadow-inner shadow-[#e8d18a]/50 border border-[#d4af37]/40 animate-[pulse_4s_ease-in-out_infinite]">
              <SedegesLogo width={90} height={90} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-black text-[#b8860b] tracking-wide mt-4 mb-1">SEDEGES</h1>
            <p className="text-sm text-[#0f172a] font-semibold">Servicio Departamental de Gestión Social</p>
            <p className="text-xs text-[#334155]">Gobernación Autónoma de La Paz</p>
            <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] mx-auto mt-4 shadow-[0_0_12px_rgba(212,175,55,0.6)]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0f172a] block">Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLogo width={20} height={20} fill="#b8860b" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#b8860b] transition-all duration-200 bg-white text-[#0f172a] placeholder:text-[#6b7280] shadow-sm group-hover:border-[#d4af37]/80"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0f172a] block">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ContraLogo width={20} height={20} fill="#b8860b" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full pl-10 pr-12 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#b8860b] transition-all duration-200 bg-white text-[#0f172a] placeholder:text-[#6b7280] shadow-sm group-hover:border-[#d4af37]/80"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#b8860b] hover:text-[#8c6b1f] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <OjoCerradoLogo width={20} height={20} fill="#b8860b" />
                  ) : (
                    <OjoLogo width={20} height={20} fill="#b8860b" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group mt-2 overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] focus:ring-offset-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#8c6b1f] transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-40 transition-all duration-500 transform group-hover:translate-x-6"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-500">
                <div className="absolute left-6 top-2 w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
                <div className="absolute right-10 bottom-3 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              </div>
              <div className="relative z-10 flex items-center justify-center py-4 px-6 font-extrabold text-white text-lg tracking-wide uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Accediendo...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Ingresar al Sistema
                  </span>
                )}
              </div>
              <div className="absolute inset-0 shadow-[0_10px_30px_rgba(12,10,4,0.35)] rounded-lg"></div>
              {isLoading && <div className="absolute inset-0 bg-black/20 rounded-lg"></div>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#e8d18a]/60">
            <div className="text-xs text-[#475569] text-center space-y-1">
              <p className="font-semibold text-[#0f172a]">Sistema de Control y Seguimiento</p>
              <p>de Hojas de Ruta - SEDEGES La Paz</p>
              <p className="text-[#b8860b] font-semibold">© 2025 Estado Plurinacional de Bolivia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;