import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/main.scss'

import { createVuetify } from 'vuetify'

const light = {
  dark: false,
  colors: {
    background: '#F5F6F8',
    surface: '#FFFFFF',
    'surface-variant': '#EEF1F5',
    'on-surface': '#0F172A',
    'on-surface-variant': '#475569',
    primary: '#2563EB',
    'on-primary': '#FFFFFF',
    secondary: '#475569',
    'on-secondary': '#FFFFFF',
    error: '#B91C1C',
    'on-error': '#FFFFFF',
    info: '#1D4ED8',
    success: '#15803D',
    warning: '#B45309',
  },
}

const dark = {
  dark: true,
  colors: {
    background: '#0F1319',
    surface: '#161B22',
    'surface-variant': '#1F2630',
    'on-surface': '#E6EAF0',
    'on-surface-variant': '#9AA5B4',
    primary: '#60A5FA',
    'on-primary': '#0B1220',
    secondary: '#9AA5B4',
    'on-secondary': '#0B1220',
    error: '#F87171',
    'on-error': '#2A0A0A',
    info: '#7DB0FF',
    success: '#4ADE80',
    warning: '#FBBF24',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: { light, dark },
  },
  defaults: {
    VBtn: {
      elevation: 0,
      rounded: 'lg',
    },
    VCard: {
      border: true,
      elevation: 0,
      rounded: 'lg',
    },
    VChip: {
      rounded: 'sm',
    },
    VSelect: {
      density: 'comfortable',
      hideDetails: 'auto',
      variant: 'outlined',
    },
    VSheet: {
      rounded: 'lg',
    },
    VTextarea: {
      density: 'comfortable',
      hideDetails: 'auto',
      variant: 'outlined',
    },
    VTextField: {
      density: 'comfortable',
      hideDetails: 'auto',
      variant: 'outlined',
    },
  },
})
