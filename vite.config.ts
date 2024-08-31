import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// export default defineConfig({
//   plugins: [
//       react(),
//         nodePolyfills({
//       globals: {
//         Buffer: true,
//       },
//     }),
//   ],
// })

export default defineConfig({
  base: './',
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
    }),
  ],
  // base : '/test/front/',

  build : {
    minify : true ,
    sourcemap : false ,
    target : 'modules' ,
  },
})





