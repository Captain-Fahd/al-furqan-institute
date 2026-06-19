import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Al-Furqan Institute brand — navy (#25274E), gold arch & wordmark (#d0a040–#c09040).
const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: 'var(--font-google-sans), ui-sans-serif, system-ui, sans-serif',
        },
        body: {
          value: 'var(--font-google-sans), ui-sans-serif, system-ui, sans-serif',
        },
      },
      colors: {
        brand: {
          50: { value: "#eeeff5" },
          100: { value: "#d0d2e4" },
          200: { value: "#aeb1cb" },
          300: { value: "#8a8eb2" },
          400: { value: "#666b99" },
          500: { value: "#4a4f7f" },
          600: { value: "#3a3f6c" },
          700: { value: "#303565" },
          800: { value: "#2a2d58" },
          900: { value: "#25274E" },
          950: { value: "#181a32" },
        },
        accent: {
          50: { value: "#fbf6ea" },
          100: { value: "#f5e9c9" },
          200: { value: "#ebd59a" },
          300: { value: "#e0c06a" },
          400: { value: "#d0a040" },
          500: { value: "#c09040" },
          600: { value: "#a87830" },
          700: { value: "#886020" },
          800: { value: "#684818" },
          900: { value: "#483010" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.900}" },
          contrast: { value: "{colors.brand.50}" },
          fg: { value: "{colors.brand.800}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.accent.500}" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
