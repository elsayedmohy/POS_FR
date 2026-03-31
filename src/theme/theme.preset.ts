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
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
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
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        primary: {
          color: '{primary.400}',
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
          // background: '{surface.900}',
          background: 'transparent',
          hoverBackground: '{surface.950}',
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
