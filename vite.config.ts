import { defineConfig } from "vite"
import { resolve } from "path"
import uni from "@dcloudio/vite-plugin-uni"

// https://vitejs.dev/config/
let viteConfig = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "app-comment": resolve(__dirname, "src/plugins/app-comment/src"),
      "uview-ui": resolve(__dirname, "src/plugins/uview-ui"),
    }
  },
  plugins: [uni({
    vueOptions: {
      reactivityTransform: true
    }
  })],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@import "./src/assets/scss/var.scss";  @import "./src/plugins/app-comment/src/assets/scss/ac-var.scss";'
      }
    }
  }
});

// // 小程序和快应用暴露配置
// if (process.env.UNI_PLATFORM.startsWith('mp') || process.env.UNI_PLATFORM.startsWith('quickapp')) {
//   Object.assign(viteConfig, defineConfig({
//     build: {
//       rollupOptions: {
//         input: {
//           config: resolve(__dirname, './src/config')
//         }
//       }
//     }
//   }))
// } else if (process.env.UNI_PLATFORM.startsWith('h5')) {
//   // h5暴露配置
// } else if (process.env.UNI_PLATFORM.startsWith('app')) {
//   // 安卓暴露配置
// }

export default viteConfig
