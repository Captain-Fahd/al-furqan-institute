import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Al-Furqan Institute brand — sampled from logo.jpeg:
// navy field (#203050), gold arch & wordmark (#d0a040–#c09040), white book & subtitle.
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef1f8" },
          100: { value: "#d4daea" },
          200: { value: "#b0bbd4" },
          300: { value: "#8997b8" },
          400: { value: "#627299" },
          500: { value: "#455578" },
          600: { value: "#334066" },
          700: { value: "#283456" },
          800: { value: "#222448" },
          900: { value: "#282850" },
          950: { value: "#1a1c38" },
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
