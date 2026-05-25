import { defineConfig, loadEnv, } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {  
  
  // command为serve是本地开发，build是打包
  const isDev = command === 'serve'
  // 本地根路径，生产子目录路径
  const baseUrl = isDev ? '/' : '/rolebot/console/'
  
  // 使用加载的环境变量进行配置  
  return {  
    // ... 其他配置项  
    base:baseUrl,
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
    // server: {
    //   proxy: isDev ? {
    //     '/api': {
    //       target: 'http://www.kaoiki.com:8080',
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, '')
    //     }
    //   } : {}
    // } 
  }  
})

