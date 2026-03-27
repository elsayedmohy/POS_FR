import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const AppPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '8px',
      md: '10px',
      lg: '14px',
      xl: '20px',
    },
  },

  semantic: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },

    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },

        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },

        focusRing: {
          width: '2px',
          style: 'solid',
          color: '{primary.500}',
          offset: '2px',
        },

        text: {
          color: '{surface.900}',
          hoverColor: '{surface.950}',
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },

        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: '{surface.200}',
          color: '{text.color}',
        },

        formField: {
          background: '{surface.0}',
          borderColor: '{surface.300}',
          focusBorderColor: '{primary.500}',
          color: '{text.color}',
        },
      },

      dark: {
        surface: {
          0: '#050509',
          50: '#0b0b13',
          100: '#0f0f1a',
          200: '#141423',
          300: '#1c1c2e',
          400: '#2a2a40',
          500: '#3b3b5c',
          600: '#6b6b8f',
          700: '#a1a1c2',
          800: '#d1d1e0',
          900: '#ececf5',
          950: '#f8f8fc',
        },

        primary: {
          color: '{primary.400}',
          contrastColor: '#000',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },

        highlight: {
          background: 'rgba(168,85,247,0.18)',
          focusBackground: 'rgba(168,85,247,0.28)',
          color: '#ffffff',
        },

        focusRing: {
          width: '2px',
          style: 'solid',
          color: '{primary.400}',
          shadow: '0 0 0 2px rgba(168,85,247,0.25)',
        },

        text: {
          color: 'rgba(255,255,255,0.72)',
          hoverColor: '#ffffff',
          mutedColor: 'rgba(255,255,255,0.6)',
        },

        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: 'rgba(255,255,255,0.08)',
        },

        overlay: {
          modal: {
            background: 'rgba(20,20,35,0.9)',
            borderColor: 'rgba(255,255,255,0.08)',
          },
        },

        formField: {
          background: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.08)',
          focusBorderColor: '{primary.400}',
          placeholderColor: '{surface.600}',
          color: '{text.color}',
        },



        navigation: {
          item: {
            activeBackground: 'rgba(168,85,247,0.18)',
            color: '#fff',
          },
        },
      },
    },
  },
});
