import type { Config } from 'postcss-load-config';

/** @type {Config} */
const config: Config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Recomendado para garantir compatibilidade com navegadores
  },
};

export default config;
