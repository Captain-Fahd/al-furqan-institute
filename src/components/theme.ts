import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Al-Furqan Institute brand: deep night-sky teal/green with a crescent-gold accent.
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f7f4" },
          100: { value: "#c3ebe3" },
          200: { value: "#9bddd0" },
          300: { value: "#6fcebb" },
          400: { value: "#46bfa8" },
          500: { value: "#1f9c85" },
          600: { value: "#177a68" },
          700: { value: "#105a4d" },
          800: { value: "#0a3b33" },
          900: { value: "#052420" },
          950: { value: "#02110f" },
        },
        accent: {
          50: { value: "#fdf6e3" },
          100: { value: "#f9e7b8" },
          200: { value: "#f3d488" },
          300: { value: "#ecc057" },
          400: { value: "#e6ad2e" },
          500: { value: "#c8901a" },
          600: { value: "#9c6f14" },
          700: { value: "#70500e" },
          800: { value: "#453109" },
          900: { value: "#231904" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.50}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
