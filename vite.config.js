import { defineConfig, loadEnv, } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {  
  // 加载环境变量文件  
  const env = loadEnv(mode, process.cwd())

  // 使用加载的环境变量进行配置  
  return {  
    // ... 其他配置项  
    base: env.VITE_BASE_URL, // 设置 publicPath 
    plugins: [vue()],
    // vite2.x
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        }
      },
    },
    build: {  
      outDir: 'dist', // 设置输出目录  
      assetsDir: 'assets', // 设置静态资源目录  
      terserOptions: {  
        compress: {  
          drop_console: true, // 生产环境下去除console  
        },  
      },  
      // 其他构建选项...  
    }, 
    server: {
      proxy: {
        '/cors-img': {
          target: 'https://www.spriteon.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/cors-img/, '')
        }
      }
    } 
  }  
})

