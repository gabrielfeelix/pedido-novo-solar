import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const prototypeBasePath = process.env.PROTOTYPE_BASE_PATH || '/'
const prototypeOutDir = process.env.PROTOTYPE_OUT_DIR || 'dist'
const prototypePublicRoots = ['home', 'pages', 'switches']

function prototypePublicAssetBase() {
  const base = prototypeBasePath.endsWith('/') ? prototypeBasePath : `${prototypeBasePath}/`
  if (base === '/') return null

  const roots = prototypePublicRoots.join('|')
  const stringPattern = new RegExp(`(["'\`])/(?:${roots})/`, 'g')
  const cssPattern = new RegExp(`url\\(/(?:${roots})/`, 'g')
  const htmlPattern = new RegExp(`(src|href)=["']/(?:${roots})/`, 'g')

  function rewrite(code) {
    return code
      .replace(stringPattern, (match, quote) => `${quote}${base}${match.slice(2)}`)
      .replace(cssPattern, (match) => `url(${base}${match.slice(5)}`)
      .replace(htmlPattern, (match, attr) => `${attr}="${base}${match.slice(attr.length + 3)}`)
  }

  return {
    name: 'prototype-public-asset-base',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'chunk') {
          item.code = rewrite(item.code)
        } else if (typeof item.source === 'string') {
          item.source = rewrite(item.source)
        }
      }
    },
  }
}

const publicAssetBasePlugin = prototypePublicAssetBase()

export default defineConfig({
  base: prototypeBasePath,
  build: {
    outDir: prototypeOutDir,
    emptyOutDir: true,
  },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    publicAssetBasePlugin,
  ].filter(Boolean),
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
