import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ColorPalette {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    warning: string;
    error: string;
    darkBg: string;
    lightBg: string;
  };
  ideal: string;
  animationStyle: 'dynamic' | 'elegant' | 'energetic' | 'balanced';
}

const palettes: ColorPalette[] = [
  {
    name: 'Tech Moderno',
    description: 'Azul vibrante + Púrpura - Ideal para startups y SaaS',
    colors: {
      primary: '#2563EB',
      secondary: '#8B5CF6',
      accent: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      darkBg: '#0F172A',
      lightBg: '#F8FAFC',
    },
    ideal: 'Startups, SaaS, sistemas dinámicos',
    animationStyle: 'dynamic',
  },
  {
    name: 'Corporate Elegante',
    description: 'Gris oscuro + Dorado - Ideal para instituciones formales',
    colors: {
      primary: '#1F2937',
      secondary: '#D97706',
      accent: '#059669',
      warning: '#F59E0B',
      error: '#DC2626',
      darkBg: '#1F2937',
      lightBg: '#F9FAFB',
    },
    ideal: 'Banca, gov, empresas formales',
    animationStyle: 'elegant',
  },
  {
    name: 'Energía Moderna',
    description: 'Cian + Verde + Naranja - Ideal para ONG y servicios sociales',
    colors: {
      primary: '#0891B2',
      secondary: '#16A34A',
      accent: '#EA580C',
      warning: '#FBBF24',
      error: '#F87171',
      darkBg: '#1E293B',
      lightBg: '#F0F9FF',
    },
    ideal: 'ONG, salud, educación, SEDEGES ⭐',
    animationStyle: 'energetic',
  },
  {
    name: 'Premium Minimalista',
    description: 'Púrpura + Marrón mejorado - Mantiene tu identidad',
    colors: {
      primary: '#7C3AED',
      secondary: '#92400E',
      accent: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      darkBg: '#1C1917',
      lightBg: '#FAFAF9',
    },
    ideal: 'Actualizar tu paleta actual con estilo',
    animationStyle: 'balanced',
  },
];

const ColorPalettePreview: React.FC = () => {
  const [selectedPalette, setSelectedPalette] = useState(0);

  const current = palettes[selectedPalette];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🎨 Paletas Corporativas</h1>
          <p className="text-slate-300">Inspiración para tu sistema con animaciones</p>
        </div>

        {/* Palette Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {palettes.map((palette, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedPalette(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg transition-all ${
                selectedPalette === idx
                  ? 'ring-2 ring-white shadow-lg'
                  : 'hover:shadow-md'
              }`}
              style={{
                background: `linear-gradient(135deg, ${palette.colors.primary} 0%, ${palette.colors.secondary} 100%)`,
              }}
            >
              <div className="text-white text-left">
                <h3 className="font-bold text-sm">{palette.name}</h3>
                <p className="text-xs opacity-90 line-clamp-2">{palette.ideal}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Preview Section */}
        <motion.div
          key={selectedPalette}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Preview Header */}
          <div
            className="p-8 text-white"
            style={{
              background: `linear-gradient(135deg, ${current.colors.primary} 0%, ${current.colors.secondary} 100%)`,
            }}
          >
            <h2 className="text-3xl font-bold mb-2">{current.name}</h2>
            <p className="text-lg opacity-90">{current.description}</p>
            <p className="text-sm opacity-80 mt-3">💡 {current.ideal}</p>
          </div>

          {/* Color Grid */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Colores de la Paleta</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
              {[
                { label: 'Primario', value: current.colors.primary },
                { label: 'Secundario', value: current.colors.secondary },
                { label: 'Acento', value: current.colors.accent },
                { label: 'Advertencia', value: current.colors.warning },
                { label: 'Error', value: current.colors.error },
                { label: 'Fondo Oscuro', value: current.colors.darkBg },
                { label: 'Fondo Claro', value: current.colors.lightBg },
              ].map((color, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(color.value);
                  }}
                >
                  <div
                    className="w-full h-24 rounded-lg shadow-md mb-2 transition-transform hover:shadow-lg"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-xs font-mono text-gray-600 text-center">{color.label}</p>
                  <p className="text-xs font-bold text-gray-800 text-center">{color.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Interactive Demo */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Demo Interactivo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Buttons */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Botones</h4>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all"
                    style={{ backgroundColor: current.colors.primary }}
                  >
                    Botón Primario
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all"
                    style={{ backgroundColor: current.colors.secondary }}
                  >
                    Botón Secundario
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all"
                    style={{ backgroundColor: current.colors.accent }}
                  >
                    Botón Acento
                  </motion.button>
                </div>

                {/* Animations Demo */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Animaciones</h4>

                  {current.animationStyle === 'dynamic' && (
                    <motion.div
                      animate={{
                        background: [
                          current.colors.primary,
                          current.colors.secondary,
                          current.colors.primary,
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-full h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                    >
                      Gradiente Dinámico
                    </motion.div>
                  )}

                  {current.animationStyle === 'elegant' && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold transition-colors"
                      style={{ backgroundColor: current.colors.primary }}
                    >
                      Fade Elegante
                    </motion.div>
                  )}

                  {current.animationStyle === 'energetic' && (
                    <motion.div
                      animate={{
                        boxShadow: [
                          `0 0 0 0 rgba(8, 145, 178, 0.7)`,
                          `0 0 0 20px rgba(8, 145, 178, 0)`,
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-16 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: current.colors.primary }}
                    >
                      Pulse Energético
                    </motion.div>
                  )}

                  {current.animationStyle === 'balanced' && (
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: current.colors.primary }}
                    >
                      Movimiento Suave
                    </motion.div>
                  )}

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-full h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${current.colors.primary}, ${current.colors.secondary})`,
                    }}
                  >
                    Scale Suave
                  </motion.div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: current.colors.lightBg }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: current.colors.primary }}
                  >
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold" style={{ color: current.colors.darkBg }}>
                      Listo para usar
                    </h5>
                    <p className="text-sm" style={{ color: current.colors.secondary }}>
                      Haz clic en los colores para copiar su valor hex
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CSS Code Block */}
        <motion.div
          className="mt-12 bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold mb-4 text-gray-300">CSS Variables</h3>
          <pre>
            {`@theme {
  --color-primary: ${current.colors.primary};
  --color-secondary: ${current.colors.secondary};
  --color-accent: ${current.colors.accent};
  --color-warning: ${current.colors.warning};
  --color-error: ${current.colors.error};
  --color-dark-bg: ${current.colors.darkBg};
  --color-light-bg: ${current.colors.lightBg};
}`}
          </pre>
        </motion.div>

        {/* Bottom Notes */}
        <div className="mt-8 text-center text-gray-300 text-sm">
          <p>🎨 Selecciona una paleta arriba para ver la vista previa completa</p>
          <p className="mt-2">⭐ Recomendación para SEDEGES: Energía Moderna</p>
        </div>
      </div>
    </div>
  );
};

export default ColorPalettePreview;
