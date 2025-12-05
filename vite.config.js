//  import { defineConfig } from 'vite';

//  export default defineConfig({
//     root: 'dist/scripts',
//     build: {
//         outDir: '../bundleJS',
//         emptyOutDir: true,
//     }
//  });

// vite.config.js
import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  build: {
    lib: {
      // Input pekar på din nuvarande källsökväg:
      entry: path.resolve(__dirname, 'dist/scripts/jsbundle.js'), 
      
      name: 'HackerEscapeRoomBundle', 
      fileName: 'main-bundle', 
      formats: ['es'], 
    },
    
    outDir: './dist/bundleJS',
    
    // KRITISK ÖVERSTYRNING: För att skydda din källfil i dist/
    emptyOutDir: false, 
  }
});