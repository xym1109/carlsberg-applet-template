# 嘉士伯小程序通用模板

## 一、模板介绍

1. 技术栈：uni-app + vue3 + vite + typescript + @vant/weapp + pinia + scss

2. 暂定 AppID: wx1f2424fe17276971 (后期新的小程序自己替换appid)

3. 项目依赖 Node 版本需 > 18.0.0（PS：本项目使用的是v18.18.2）, 包管理工具强烈建议使用综合性能更高的 PNPM 安装所需依赖

4. 建议编辑器使用 <u>[HBuilderX](https://www.dcloud.io/hbuilderx.html)</u>，可直接在编辑器运行打开相关小程序平台启动项目，无需使用命令运行

5. 使用命令快速启动项目

```
  pnpm install

  pnpm dev:mp-weixin

  // 运行命令，项目根目录会生成dist/dev文件，将 mp-weixin文件在小程序开发者工具打开即可
```

6. 基本组织架构如下，其他部分按照对应项目需求进行修改

## 二、项目目录

```
├── src/                     # 源代码目录，包含了所有的开发代码
│   ├── static/              # 存放项目所需的静态资源，如图像、样式等
│   ├── components/          # 公共可复用组件目录
│   ├── pages/               # 存放各个页面的视图组件
│   │   ├── ...              # 关于页面视图组件
│   │   └── ...              # 其他页面视图组件
|   |—— hooks/               # 项目公共钩子文件
|   |   ├── useAuth.ts       # 用户相关授权hooks
|   |   ├── useScanCode.ts   # 扫码相关hooks
|   |   ├── useUserAuth.ts   # 用户相关授权hooks
|   |   ├── useMixin.ts      # Mixin文件兼容Vue3写法无法实现的场景
│   │   └── ...              # 其他钩子方法
|   |
|   |—— uni.scss/            # 项目全局样式变量配置
|   |—— utils/               # 全局公共方法文件
|   |—— wxcomponents/        # VantUI的组件
|   |
│   ├── service/             # 项目服务相关文件
    |   ├── config           # 请求环境配置文件
│   │   └──request.ts        # API请求封装文件
│   ├── types/               # ts文件
│   │   └──index.d.ts        # 全局ts文件配置
│   ├── stores/              # Pinia 状态管理相关的文件
│   │   └── main.js          # 主状态管理文件
│   ├── subpackages          # 小程序分包文件
│   |   ├── image            # 分包图片资源
│   |   ├── pages            # 分包页面文件
│   |   ├── personalCenter   # 个人中心分包文件
│   |   ├── mallCenter       # 积分商城分包文件
    |   └──...
    |
│   ├── App.vue              # 单页面入口文件
│   ├── main.js              # 入口文件
│   └── pages.json           # 页面路由配置
│
|—— .husky/                  # 代码提交配置
|
|—— typings/                 # 自动生成ts文件项目依赖配置
|
|—— vite.config.ts           # 项目配置文件
|
├── index.html               # 主 HTML 文件
|
├── .env.development         # 开发环境变量配置
├── .env.production          # 生产环境变量配置
├── tsconfig.json            # ts配置文件
├── .eslintrc.cjs            # eslint配置文件
├── .commitlint.config.cjs   # 代码格式化校验配置文件
├── prettier.config.json     # 代码格式化配置文件
│
├── .gitignore               # Git 忽略文件配置
├── package.json             # 项目依赖及配置
└── README.md                # 项目说明文档

```
