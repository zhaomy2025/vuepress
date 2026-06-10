# Element Plus

## 快速开始

### 完整引入
```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
// 导入 ElementPlus 插件，会调用 ElementPlus 插件的 install 方法
app.use(ElementPlus, {
  size: 'small', // 设置默认大小为 small
  zIndex: 2000, // 设置默认 z-index 为 2000
  locale: zhCn,
})
// 挂载应用
app.mount('#app')
```

### 按需导入

#### 自动导入

首先你需要安装unplugin-vue-components 和 unplugin-auto-import这两款插件。
然后修改配置文件。

#### 手动导入

Element Plus 提供了基于 ES Module 的开箱即用的 Tree Shaking 功能。
安装 unplugin-element-plus 来导入样式。

## 国际化
```
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'

app.use(ElementPlus, {
  locale: zhCn,
})
```

## 主题

### 自定义主题
我想把 Element Plus 的默认蓝色主题（比如按钮、标签等）改成绿色或橙色，该怎么改？
官方给出了两种主流方法：SCSS 变量覆盖 和 CSS 变量动态修改。

#### 方法一：通过 SCSS 变量（构建时修改，适合固定主题）
1. 安装 `sass` 包。
```
npm install -D sass
```
2. 创建一个 SCSS 文件（比如 `src/styles/element/index.scss`），并在其中定义你想要的颜色变量。
```scss
/*
* 只覆盖你需要的颜色
* @forward ... with 是 Sass 新语法，意思是：“用我给的新值，去覆盖原变量”。
*/
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': green,   // ← 把主色改成绿色
    ),
    'success': (
      'base': #46b61f,
    )
    // 其他颜色按需改
  )
);
```
3. 修改 vite.config.ts：
```ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 关键！让所有组件编译时都用你的变量
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    // 启用按需引入 + 源码样式（支持主题）
    ElementPlus({ useSource: true }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }) // 注意这里是 'sass'
      ],
    }),
  ],
})
```
4. 在 Vue 项目的入口文件（比如 `main.ts`）中引入这个 SCSS 文件。
```ts
import { createApp } from 'vue'
import App from './App.vue'

// ❌ 删除这行！否则会冲突
// import 'element-plus/dist/index.css'

// 只引入你的自定义 SCSS 文件（Vite 会自动处理）
import './styles/element/index.scss'

const app = createApp(App)
app.use(ElementPlus) // 如果是完整引入才需要；按需引入可省略
app.mount('#app')
```

#### 方法二：通过 CSS 变量（运行时修改，适合动态主题）
1. 全局修改
```css
:root {
  --el-color-primary: green; /* 所有主色变绿 */
  --el-color-success: #46b61f;
}
```
2. 动态修改
```
// 切换成绿色主题
document.documentElement.style.setProperty('--el-color-primary', 'green');

// 切换成橙色主题
document.documentElement.style.setProperty('--el-color-primary', 'orange');
```
3. 局部修改
```html
<el-button style="--el-button-bg-color: red">红色按钮</el-button>
```

## 暗黑模式
如果只需要暗色模式，只需在 html 上添加一个名为 dark 的类。
```
<html class="dark">
  <head></head>
  <body></body>
</html>
```

如果想动态切换，建议使用 useDark | VueUse。只需要如下在项目入口文件修改一行代码：
```
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'
```

## 自定义命名空间
Element Plus 提供的默认命名空间为 el。在特殊情况下，我们需要自定义命名空间，必须同时设置 ElConfigProvider 和 scss $namespace。

1. 使用 ElConfigProvider 包装根组件：
```html
<template>
  <el-config-provider namespace="ep">
  </el-config-provider>
</template>
```
2. 创建 styles/element/index.scss 文件，定义命名空间：
```scss
// styles/element/index.scss
@use 'element-plus/theme-chalk/src/common/var.scss' with (
  $namespace: 'ep',
);
```
3. 在 vite.config.ts 中导入 styles/element/index.scss：
```ts
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  // ...
})
```

## 内置过渡动画

## 组件
### 按钮
### Border 边框
### Color 色彩
### Container 布局容器
### Icon 图标
### Layout 布局
### Link 链接
### Text 文本
### Scrollbar 滚动条
### Space 间距
不要让 ElSpace 与使用依赖父元素百分比宽度（或高度）的元素一起使用（例如 ElSlider），这样会造成光标不同步。
### Splitter 分隔面板
### Typography 排版
### Config Provider 全局配置
### Autocomplete 自动补全输入框
### Cascader 级联选择器
### Checkbox 多选框
### ColorPickerPanel 颜色选择器面板
### ColorPicker 颜色选择器
### DatePickerPanel 日期选择器面板
### DatePicker 日期选择器
### DateTimePicker 日期时间选择器
### Form 表单组件
### Input 输入框
### InputNumber 数字输入框
### InputTag 标签输入框
### Mention 提及
### Radio 单选框
### Rate 评分
### Select 选择器
### Virtualized Select 虚拟化选择器
### Slider 滑块
### Switch 开关
### TimePicker 时间选择器
### TimeSelect 时间选择
### Transfer 穿梭框
### TreeSelect 树形选择
### Upload 上传
### Avatar 头像
### Badge 徽标
### Calendar 日历
### Card 卡片
### Carousel 走马灯
### Collapse 折叠面板
### Descriptions 描述列表
### Empty 空状态
### Image 图片
### Infinite Scroll 无限滚动
### Pagination 分页
### Progress 进度条
### Result 结果
### Skeleton 骨架屏
### Table 表格
### Virtualized Table 虚拟化表格
按需渲染：只渲染当前可视区域内的行（如 20 行）
### Tag 标签
### Timeline 时间线
### Tour 漫游式引导
### Tree 树形控件
### Virtualized Tree 虚拟化树形控件
### Statistic 统计组件
### Segmented 分段控制器
### Affix 固钉
### Anchor 锚点
### Backtop 回到顶部
### Breadcrumb 面包屑
### Dropdown 下拉菜单
### Menu 菜单
### Page Header 页头
### Steps 步骤条
### Tabs 标签页
### Alert 提示
### Dialog 对话框
### Drawer 抽屉
### Loading 加载
### Message 消息提示
轻量级非模态提示，页面顶部居中，仅显示文本/图标
### MessageBox 消息弹窗
模态对话框
### Notification 通知
系统级非模态通知，右上角（默认），支持点击、关闭按钮、自定义操作
### Popconfirm 气泡确认框
操作确认工具，仅标题+按钮
### Popover 弹出框
信息展示容器，可嵌套表单、表格等
### Tooltip 文字提示
### Divider 分割线
### Watermark 水印
