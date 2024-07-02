import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import * as path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`
    },
    extensions: ['.mjs', '.js', '.jsx', '.json', '.vue']
  },
  plugins: [
    uni(),
    // 自动导入 Vue 的相关函数，如: ref, reative, onMounted 等
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      imports: ['vue', 'uni-app'],
      dts: 'typings/auto-imports.d.ts'
    }),
    Components({
      // 指定自动导入的组件位置
      dirs: ['src/components']
    })
  ],
  define: {
    'process.env': {}
  }
});
