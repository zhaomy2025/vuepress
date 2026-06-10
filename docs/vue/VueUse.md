## 状态管理

### useAsyncState
以声明式方式封装所有异步状态管理逻辑，一行代码搞定 loading/error/data/execute。
- 一行代码替代数十行样板代码
- 支持立即执行、手动触发、延迟、重试等场景
- 性能优化（shallowRef）

```javascript
import { useAsyncState } from '@vueuse/core'
import axios from 'axios'

const { state, isLoading, isReady, error, execute } = useAsyncState(
  // 1. 异步操作（函数或 Promise）
  () => axios.get('/api/user').then(res => res.data),
  // 2. 初始状态
  null,
  // 3. 配置选项（可选）
  {
    immediate: true, // 是否立即执行，默认值为 true
    delay: 0, // 延迟执行时间（单位：毫秒），默认值为 0
    onSuccess: (data) => {
      console.log('成功', data)
    }, // 成功回调函数
    onError: (err) => {
      console.error('错误', err)
    }, // 错误回调函数
    resetOnExecute: true, // 是否在每次执行前重置状态，默认值为 true
    shallow: true, // 是否使用浅响应式，默认值为 true
    throwOnError: false, // 是否在错误回调函数中抛出错误，默认值为 false
  }
)
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `state` | `Ref<T>` | 异步操作的结果（响应式） |
| `isLoading` | `Ref<boolean>` | 是否正在加载 |
| `isReady` | `Ref<boolean>` | 是否已成功加载完成 |
| `error` | `Ref<Error \| undefined>` | 错误对象（如果有） |
| `execute` | `Function` | 手动触发异步操作的方法 |

### useStorage
实现一个跨组件共享、持久化到 localStorage、且响应式更新的全局状态。
```typescript
// store.ts
import { createGlobalState, useStorage } from '@vueuse/core'

// 创建真正的“全局单例”状态
export const useGlobalState = createGlobalState(
  // 创建一个响应式引用，其值会自动同步到 localStorage
  // 从 localStorage.getItem('vueuse-local-storage') 读取值，若不存在，则使用默认值 'initialValue'
  () => useStorage('vueuse-local-storage', 'initialValue'),
)

// component.ts
import { useGlobalState } from './store'

export default defineComponent({
  setup() {
    const state = useGlobalState()
    return { state }
  },
})
```

**为什么需要createGlobalState？**

假设你在多个组件中直接调用 useStorage：
```
// ComponentA.vue
const state = useStorage('my-key', 'init')

// ComponentB.vue
const state = useStorage('my-key', 'init')
```
表面上看，它们读写同一个 localStorage key，但它们是两个独立的 ref 对象！
如果 ComponentA 修改了 state.value，ComponentB 不会自动更新（因为它的 ref 没有被通知）。
虽然 localStorage 数据变了，但 Vue 的响应式系统不知道。

解决方案：
createGlobalState 是 VueUse 提供的一个高阶函数，用于确保在整个应用中只创建一次状态实例，并让所有消费者共享同一个响应式引用。

### useSessionStorage
将 sessionStorage 封装成一个开箱即用、类型安全、响应式的 ref，自动处理序列化与同步。
解决使用原生 sessionStorage 的痛点：
- 非响应式：修改 sessionStorage 不会触发 Vue 组件更新。
- 类型不友好：只能存取字符串，对象需手动 JSON.stringify/parse。
- 样板代码多：每次读写都要处理序列化、错误、默认值等。
- 作用域隔离：不同标签页的 sessionStorage 完全独立（这是特性，但需理解）。

```javascript
import { useSessionStorage } from '@vueuse/core'

// 创建一个响应式引用，键为 'user-preferences'
const preferences = useSessionStorage(
  'user-preferences',
  { theme: 'light', notifications: true }, // 默认值（可为对象）
  {
    flush: 'pre', // 控制副作用刷新时机
    deep: true, // 是否深度监听对象/数组变化，默认值为 true
    writeDefaults: true, // 是否在值为 undefined 时写入默认值，默认值为 true
    mergeDefaults: true, // 是否合并默认值，默认值为 true
  }
)

// 在模板中直接使用
// {{ preferences.theme }}

// 修改值 → 自动同步到 sessionStorage
preferences.value.theme = 'dark'
// 此时 sessionStorage.setItem('user-preferences', '{"theme":"dark","notifications":true}')
```

### useStorageAsync
useStorageAsync 是 VueUse 为现代跨平台应用量身打造的存储方案，它：
- 无缝衔接异步存储后端
- 保持与 useStorage 一致的响应式体验
- 通过 Promise 和 onReady 解决加载竞态问题
- 适用于 React Native、安全存储、IndexedDB 等场景
**使用时机**：
当你的存储 API 是基于 Promise 的异步接口时，
请使用 useStorageAsync；否则，继续使用 useStorage。
这标志着 VueUse 从“纯 Web 工具库”向“跨平台通用工具库”的重要演进。


### useRefHistory
useRefHistory 是 VueUse 提供的一个组合式函数，用于为任意 ref 自动记录变更历史，并支持撤销（undo）、重做（redo）等操作。

### useDebouncedRefHistory
在 useRefHistory 的基础上增加防抖（debounce）能力，确保只有在值稳定一段时间后才记录历史，从而避免过度记录。
**基本用法**
1. 创建带防抖历史的 ref
```
import { ref } from 'vue'
import { useDebouncedRefHistory } from '@vueuse/core'
const text = ref('')
// 启用防抖历史记录，延迟 500ms
const { history, undo, redo, canUndo, canRedo } = useDebouncedRefHistory(
  text,
  {
    debounce: 500, // 防抖延迟时间（毫秒）
    // 其他配置项（可选），与 useRefHistory 相同
    capacity: 10,  // 最大历史记录数（可选）
    deep: false,   // 是否深度监听对象/数组变化（可选）
    clone: JSON.parse(JSON.stringify(v)), // 自定义克隆函数（可选）
    dump: JSON.stringify, // 自定义序列化函数（可选）
    parse: JSON.parse,    // 自定义解析函数（可选）
  }
)
```
2. 在模板中使用
```
<template>
  <div>
    <textarea v-model="text" />
    <!-- 撤销/重做按钮 -->
    <button :disabled="!canUndo" @click="undo">撤销</button>
    <button :disabled="!canRedo" @click="redo">重做</button>
    <!-- 显示历史记录数量 -->
    <p>历史记录: {{ history.length }}</p>
  </div>
</template>
```

### useManualRefHistory
useManualRefHistory 是 useRefHistory 的手动模式版本：它不会自动记录状态变更，而是由开发者显式调用 commit() 方法来保存历史快照，从而精确控制何时创建撤销/重做点。

### useThrottledRefHistory
useThrottledRefHistory 是 useRefHistory 的节流（throttle）增强版：它不会记录每一次状态变更，而是以固定时间间隔采样并保存历史快照，从而避免高频变更导致的历史记录爆炸。

## Element

### useActiveElement
useActiveElement 封装的是浏览器原生的 document.activeElement API，用于响应式地获取当前获得焦点的 DOM 元素。

### useDocumentVisibility
useDocumentVisibility 是 VueUse 提供的一个组合式函数，用于响应式地获取当前页面的可见性状态（如用户是否切换到其他标签页或最小化浏览器），其值为 'visible'、'hidden'、'prerender' 或 'unloaded'。

### useDraggable
useDraggable 是 VueUse 提供的一个组合式函数，用于让任意 DOM 元素支持位置拖拽（移动），返回响应式的 x、y 坐标和可直接绑定的 style 对象，实现“元素随鼠标/触摸移动”的交互。

### useDropZone
useDropZone 是 VueUse 提供的一个组合式函数，用于将任意 DOM 元素变为文件拖放区域，自动处理拖拽高亮、文件验证、事件回调等逻辑，并返回响应式的文件列表和状态。

### useElementBounding
一行代码创建一个响应式的边界对象，自动监听所有相关变化，并在组件卸载时自动清理。

### useElementSize
useElementSize 是 VueUse 提供的一个组合式函数，用于响应式地获取指定 DOM 元素的宽度和高度，并自动监听元素尺寸变化（如窗口缩放、内容增删、CSS 动画等），实时更新数据。

### useElementVisibility
useElementVisibility 是 VueUse 提供的一个组合式函数，用于响应式地判断指定 DOM 元素是否至少部分可见于当前浏览器视口（viewport）中，并自动监听滚动、缩放、元素位置变化等事件，实时更新状态。

### useIntersectionObserver
useIntersectionObserver 是 VueUse 对浏览器原生 IntersectionObserver API 的响应式封装，用于高效、异步地监听目标元素是否进入或离开视口（或其他祖先容器），并返回详细的交叉状态信息。

### useMouseInElement
useMouseInElement 是 VueUse 提供的一个组合式函数，用于响应式地获取鼠标相对于指定 DOM 元素的位置（坐标），并提供是否在元素内的状态，适用于实现自定义悬停效果、画布交互、拖拽手柄等场景。

### useMutationObserver
useMutationObserver 是 VueUse 对浏览器原生 MutationObserver API 的响应式封装，用于高效、异步地监听指定 DOM 元素的结构或属性变化（如子节点增删、属性修改、文本内容变更），并自动管理观察器的生命周期。

### useParentElement
useParentElement 是 VueUse 提供的一个组合式函数，用于响应式地获取指定 DOM 元素的直接父元素（parentElement），并在父元素发生变化时自动更新。

### useResizeObserver
useResizeObserver 是 VueUse 对浏览器原生 ResizeObserver API 的响应式封装，用于高效、异步地监听指定 DOM 元素的尺寸（宽高）变化，并自动管理观察器的生命周期。

### useWindowFocus
useWindowFocus 是 VueUse 提供的一个组合式函数，用于响应式地追踪浏览器窗口是否处于聚焦（focused）或失焦（blurred）状态，并在用户切换标签页、最小化窗口或切换到其他应用时自动更新。

### useWindowScroll
useWindowScroll 是 VueUse 提供的一个组合式函数，用于响应式地获取浏览器窗口的水平（x）和垂直（y）滚动位置，并在用户滚动时自动更新。

### useWindowSize
useWindowSize 是 VueUse 提供的一个组合式函数，用于响应式地获取浏览器窗口的宽度（width）和高度（height），并在用户调整窗口大小时自动更新。

## Browser

### useBluetooth
useBluetooth 是 VueUse 提供的响应式组合函数，用于在浏览器中安全、简洁地连接和操作 Bluetooth Low Energy (BLE) 设备，封装了 Web Bluetooth API 的核心流程，并自动管理连接状态与生命周期。

### useBreakpoints
useBreakpoints 是 VueUse 提供的一个组合式函数，用于在 JavaScript 中响应式地检测当前屏幕尺寸是否匹配预定义的断点（如 'sm', 'md', 'lg'），从而实现基于设备尺寸的逻辑控制，而无需依赖 CSS 媒体查询。

### useBroadcastChannel
useBroadcastChannel 是 VueUse 对浏览器原生 BroadcastChannel API 的响应式封装，用于在同源（same-origin）的多个浏览器标签页、窗口或 iframe 之间发送和接收消息，并自动管理通道的生命周期。

### useBrowserLocation
useBrowserLocation 是 VueUse 提供的一个组合式函数，用于响应式地获取和监听当前浏览器地址栏的 URL 信息（包括路径、查询参数、哈希等），并支持程序化导航，实现无刷新的 SPA 路由基础能力。

### useClipboard
useClipboard 是 VueUse 提供的一个组合式函数，用于响应式地读取和写入系统剪贴板内容，支持现代 Clipboard API 并自动回退到传统 execCommand 方案，实现跨浏览器的复制/粘贴功能。

### useClipboardItems
useClipboardItems 是 VueUse 提供的组合式函数，基于浏览器原生 ClipboardItem API，支持响应式地读取和写入任意格式的剪贴板内容（如文本、HTML、图片、自定义 MIME 类型），而不仅限于纯文本。

核心目标：解决什么问题？
- 突破 useClipboard 的纯文本限制
- 支持复制/粘贴富媒体内容（如截图、代码高亮 HTML、文件）
- 统一处理现代 Clipboard API 的复杂性（权限、异步、多格式）

### useColorMode
useColorMode 是 VueUse 提供的一个组合式函数，用于响应式地管理应用的颜色模式（如 'light'、'dark' 或 'auto'），自动同步到 <html> 元素的 class 或 attribute，并支持持久化存储与系统偏好检测。

### useCssVar
useCssVar 是 VueUse 提供的一个组合式函数，用于在 JavaScript 中响应式地读取和修改 DOM 元素上的 CSS 自定义属性（即 CSS 变量），实现 JS 与 CSS 的双向数据绑定。

### useDark
useDark 是 VueUse 提供的一个组合式函数，用于响应式地管理应用的暗黑模式（dark mode）状态，自动同步到 <html> 元素的 class="dark"，并支持持久化存储与系统偏好检测。

### useEventListener
useEventListener 是 VueUse 提供的一个组合式函数，用于在 Vue 组件中声明式地添加 DOM 事件监听器，并在组件卸载时自动清理，避免内存泄漏。

### useEyeDropper
useEyeDropper 是 VueUse 提供的一个组合式函数，用于在浏览器中调用系统级取色器（EyeDropper），让用户从屏幕任意位置选取颜色，并返回十六进制颜色值（如 #ff0000）。

### useFavicon
useFavicon 是 VueUse 提供的一个组合式函数，用于在运行时动态更改网页的 Favicon（网站图标），支持 ICO、PNG、SVG 等多种格式，并自动处理浏览器兼容性。

### useFileDialog
useFileDialog 是 VueUse 提供的一个组合式函数，用于在浏览器中以声明式方式打开原生文件选择对话框（<input type="file">），并返回用户选择的文件列表，同时自动管理输入元素的创建与清理。

### useFileSystemAccess
useFileSystemAccess 是 VueUse 提供的一个组合式函数，用于在浏览器中以声明式方式访问用户的本地文件系统（读取、写入、创建文件），基于现代 File System Access API，并返回响应式的文件内容和操作方法。

### useFullscreen
useFullscreen 是 VueUse 提供的一个组合式函数，用于在浏览器中以声明式方式控制元素（或整个页面）的全屏状态，基于原生 Fullscreen API，并返回响应式的全屏状态和操作方法。

### useGamepad
useGamepad 是 VueUse 提供的一个组合式函数，用于在浏览器中以声明式方式监听和响应游戏手柄（Gamepad）的输入状态，基于原生 Gamepad API，并返回响应式的连接手柄列表及其按钮、摇杆状态。

### useImage
useImage 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中声明式地加载图片资源，并返回响应式的加载状态（加载中、已加载、加载失败）和原生 HTMLImageElement 对象。

### useMediaControls
useMediaControls 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中声明式地控制 HTML5 媒体元素（<audio> 或 <video>）的播放状态，并返回响应式的播放属性（如当前时间、音量、播放速率）和控制方法（播放、暂停、跳转等）。

### useMediaQuery
useMediaQuery 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中声明式地监听 CSS 媒体查询的状态变化，并返回响应式的布尔值，表示当前是否匹配指定的媒体查询条件。

### useMemory
useMemory 是 VueUse 提供的一个组合式函数，用于在浏览器中实时监控 JavaScript 堆内存的使用情况，基于浏览器的 performance.memory API，并返回响应式的内存使用数据。

### useObjectUrl
useObjectUrl 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中安全地创建和管理 Blob、File 或 MediaSource 对象的 Object URL，并在组件卸载时自动释放内存，避免内存泄漏。

### usePerformanceObserver
usePerformanceObserver 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中声明式地监听浏览器性能条目（Performance Entries），并返回响应式的性能数据数组，自动处理观察器的创建、监听和清理。

### usePermission
usePermission 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中声明式地查询和监听浏览器 API 权限的状态（如摄像头、麦克风、地理位置等），并返回响应式的权限状态和请求方法。

### usePreferredColorScheme
usePreferredColorScheme 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取用户操作系统的首选配色方案（浅色或深色模式），并自动监听系统主题切换的变化。

### usePreferredContrast
usePreferredContrast 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取用户操作系统的首选对比度偏好（标准、更高或更低对比度），并自动监听系统对比度设置的变化。

### usePreferredDark
usePreferredDark 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地检测用户是否偏好深色主题（基于系统设置），并返回一个布尔值引用，自动监听系统主题切换的变化。

### usePreferredLanguages
usePreferredLanguages 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取用户浏览器的首选语言列表（按偏好顺序排列），并自动监听语言设置的变化。

### usePreferredReducedMotion
usePreferredReducedMotion 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地检测用户是否启用了系统级“减少动画”偏好，并返回一个布尔值引用以简化无障碍动画控制。

### usePreferredReducedTransparency
usePreferredReducedTransparency 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地检测用户是否启用了系统级“减少透明度”辅助功能偏好（主要用于 macOS 和 iOS），并返回一个布尔值引用，以便开发者据此调整 UI 透明效果以提升可访问性。

### useScreenOrientation
useScreenOrientation 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取和监听设备的当前屏幕方向（如 portrait、landscape 等），并支持在兼容的环境中主动锁定或更改屏幕朝向，适用于需要控制横竖屏行为的移动 Web 应用。

### useScreenSafeArea
useScreenSafeArea 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取设备屏幕的安全区域内边距（通过 CSS 环境变量 env(safe-area-inset-*)），以确保内容不会被刘海屏、圆角、状态栏或底部手势条等系统 UI 遮挡，常用于移动端 Web 或 PWA 的安全区域适配。

### useScriptTag
useScriptTag 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中动态、响应式地注入和管理  标签，支持按需加载外部 JavaScript 资源（如第三方 SDK、广告脚本、地图 API 等），并自动处理脚本的加载状态、错误处理及组件卸载时的清理，避免重复加载和内存泄漏。

### useShare
useShare 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地调用原生 Web Share API，以触发设备的系统级分享功能（如分享链接、文本或标题到微信、邮件、短信等），并自动处理浏览器兼容性检测与降级逻辑。

### useSSRWidth

### useStyleTag
useStyleTag 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中动态、响应式地创建、注入和管理`<style>`标签，支持按需插入 CSS 样式（如主题切换、组件私有样式或运行时生成的样式），并自动处理重复插入、作用域控制及组件卸载时的清理，避免全局样式污染和内存泄漏。

### useTextareaAutosize
useTextareaAutosize 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中自动调整  元素的高度以精确适应其内容文本，通过响应式地监听输入变化并动态计算滚动高度，实现无滚动条的流畅输入体验，同时支持自定义最小/最大行数限制、外部容器约束及服务端渲染（SSR）安全。

### useTextDirection
useTextDirection 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地检测并返回用户界面的当前文本方向（ltr 或 rtl），通常基于 HTML 文档的 dir 属性或根元素的计算样式，便于开发者动态适配从左到右（LTR）与从右到左（RTL）语言布局（如阿拉伯语、希伯来语），实现国际化友好的 UI 渲染。

### useTitle
useTitle 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取、设置和同步浏览器页面标题（document.title），支持动态更新、标题模板格式化（如 %s - 网站名），并可选监听 DOM 变化以自动恢复标题，常用于路由切换、页面状态更新或 SEO 优化场景。

### useUrlSearchParams
useUrlSearchParams 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地解析、读取和操作当前 URL 的查询参数（search params），返回一个包含所有参数的响应式对象，并支持通过 setter 更新参数以触发导航，简化了与 URL 状态同步的常见需求（如筛选、分页、搜索等）。

### useVibrate
useVibrate 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地触发设备的振动反馈（Haptic Feedback），封装了浏览器的 navigator.vibrate() API，支持传入振动时长或模式，并自动处理兼容性检测与权限限制，适用于移动端 Web 应用中的交互反馈（如点击确认、游戏事件等）。

### useWakeLock
useWakeLock 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地请求并管理屏幕唤醒锁（Wake Lock），通过浏览器的 Screen Wake Lock API 防止设备在关键操作（如视频播放、扫码、导航等）期间自动熄屏或进入休眠，同时自动处理权限请求、兼容性检测及资源释放，提升 Web 应用的用户体验与可靠性。

### useWebNotification
useWebNotification 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地请求权限、创建并管理 Web 通知（Web Notifications），封装了浏览器的 Notification API，支持动态设置通知标题、选项（如图标、正文、行为），并自动处理权限状态（default/granted/denied）、用户交互事件（点击、关闭等）及跨浏览器兼容性，适用于消息提醒、任务完成提示等场景。

### useWebWorker
useWebWorker 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中便捷地创建和管理 Web Worker，通过传入内联函数或 Worker 脚本 URL，自动处理 Worker 的实例化、消息通信、响应式数据绑定及生命周期清理，使开发者能轻松将耗时任务（如大数据计算、图像处理等）移至后台线程执行，避免阻塞主线程，同时保持与 Vue 响应式系统的无缝集成。

### useWebWorkerFn
useWebWorkerFn 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中将普通 JavaScript 函数自动运行在 Web Worker 线程中，通过传入一个纯函数（必须可序列化），它会动态创建内联 Worker 并返回一个异步调用包装器，使得复杂计算任务无需阻塞主线程即可执行，同时以 Promise 形式返回结果，极大简化了在 Vue 中实现高性能、非阻塞计算的流程。

## Sensors
### onClickOutside
onClickOutside 是 VueUse 提供的一个组合式函数，用于监听用户在指定元素外部的点击事件，当点击发生在目标元素及其子元素之外时，自动触发回调函数，常用于实现下拉菜单、模态框、弹出面板等组件的“点击外部关闭”交互，内部基于 mousedown/mouseup 或 click 事件与 Node.contains()（或 event.composedPath()）进行精准判断，并自动处理事件监听器的添加与清理，确保响应式、可访问且无内存泄漏。

### onElementRemoval
onElementRemoval 是 VueUse 提供的一个组合式函数，用于监听指定 DOM 元素从文档中被移除的事件，当目标元素（或其祖先）被删除时自动触发回调，并可选地在触发后自动清理监听器；它基于 MutationObserver 实现，适用于需要在组件销毁、动态内容移除等场景下执行清理或通知逻辑的高级 DOM 生命周期管理。

### onKeyStroke
onKeyStroke 是 VueUse 提供的一个组合式函数，用于响应式地监听键盘按键事件（如 keydown 或 keyup），支持按特定键（字符、键码或组合键）、修饰键（Ctrl、Shift 等）进行精确匹配，并可指定监听目标元素和事件类型，常用于实现快捷键、游戏控制、表单导航等交互，同时自动处理事件监听器的绑定与清理，确保安全、高效且符合 Vue 响应式范式。

### onLongPress
onLongPress 是 VueUse 提供的一个组合式函数，用于在指定 DOM 元素上监听长按（long press）手势事件，当用户持续按下（或触摸）元素超过设定的延迟时间（默认通常为 500ms）时触发回调，并在手指/鼠标抬起或移动超出容差范围时自动取消，常用于实现上下文菜单、删除确认、拖拽准备等交互；它同时兼容指针（PointerEvent）、鼠标（MouseEvent）和触摸（TouchEvent）事件，内置防抖与状态管理，并支持自定义延迟时间和移动阈值，确保跨设备的一致体验。

### onStartTyping
onStartTyping 是 VueUse 提供的一个组合式函数，用于在用户开始向页面输入文本时触发回调（例如按下可产生字符的按键），通过监听 keydown 事件并智能过滤非文本输入键（如 Tab、Enter、方向键等），从而精准检测用户“真正开始打字”的行为，常用于自动聚焦搜索框、隐藏静态提示、启动输入辅助功能等场景，并支持自定义目标元素和事件选项，同时自动管理事件监听器的生命周期。

### useBattery
useBattery 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地访问设备的电池状态信息（如电量百分比、是否正在充电、剩余放电时间等），它基于浏览器的 Battery Status API 封装，自动处理兼容性检测、权限限制和事件监听，并返回一个包含 charging、level、chargingTime、dischargingTime 等属性的响应式对象，适用于低电量提醒、节能模式切换或用户体验优化等场景（注：该 API 在多数现代浏览器中已受限或弃用，主要在部分旧版移动浏览器中可用）。

### useDeviceMotion
useDeviceMotion 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地访问设备的运动传感器数据（如加速度、重力、旋转速率等），它封装了浏览器的 DeviceMotionEvent API，自动处理权限请求、事件监听与兼容性问题，并返回一个包含 acceleration、accelerationIncludingGravity、rotationRate 和 interval 等属性的响应式对象，适用于实现体感交互、游戏控制、AR 体验或运动检测等场景（需注意：在 iOS 上需用户手势触发授权，且部分浏览器已限制该 API 的使用）。

### useDeviceOrientation
useDeviceOrientation 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取设备的方向信息（如偏航角、俯仰角、翻滚角），它封装了浏览器的 DeviceOrientationEvent API，自动处理权限请求、事件监听及兼容性差异，并返回一个包含 alpha（绕 Z 轴旋转）、beta（绕 X 轴旋转）、gamma（绕 Y 轴旋转）和 absolute（是否为绝对坐标系）等属性的响应式对象，常用于实现指南针、AR 视图、3D 场景控制或体感交互等场景（注：在 iOS 上需用户手势触发授权，且部分浏览器已限制该 API 的使用）。

### useDevicePixelRatio
useDevicePixelRatio 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取并监听设备的当前像素比（devicePixelRatio），该值表示物理像素与 CSS 逻辑像素的比率（如 1、1.5、2 等），常用于适配高 DPI 屏幕（如 Retina 显示器），以优化 Canvas 渲染、图像资源加载或 UI 缩放；该函数会自动监听 window.matchMedia('(resolution: ...dppx)') 的变化，在用户切换显示器或缩放页面时实时更新，确保应用始终使用正确的分辨率策略。

### useDevicesList
useDevicesList 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地枚举并监听用户设备上可用的媒体输入/输出设备列表（如摄像头、麦克风、扬声器等），它基于浏览器的 navigator.mediaDevices.enumerateDevices() API 封装，自动处理权限请求、设备变更事件（通过 devicechange 事件监听）和兼容性问题，并返回一个包含所有 MediaDeviceInfo 对象的响应式数组，常用于音视频通话、直播、录音或设备选择界面等 WebRTC 相关场景。

### useDisplayMedia
useDisplayMedia 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地请求并获取用户的屏幕共享媒体流（如整个屏幕、应用窗口或浏览器标签），它封装了浏览器的 navigator.mediaDevices.getDisplayMedia() API，自动处理权限弹窗、流生命周期管理及错误边界，并返回一个包含 stream（MediaStream | null）、enabled（控制启停状态）等属性的响应式对象，常用于实现 Web 端录屏、远程协助、直播分享等场景，且仅在安全上下文（HTTPS 或 localhost）下可用。

### useElementByPoint
useElementByPoint 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地获取位于指定视口坐标（x, y）处的最顶层 DOM 元素，它封装了原生 document.elementFromPoint(x, y) 方法，并可选支持监听鼠标或触摸位置的实时变化，常用于实现 hover 检测、自定义 tooltip 定位、无障碍调试或交互式高亮等场景，返回值为一个响应式的 Ref，当坐标处无元素或超出视口时返回 null。

### useElementHover
useElementHover 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地监听指定 DOM 元素的悬停（hover）状态，通过绑定 mouseenter 和 mouseleave 事件，返回一个布尔值的响应式引用（Ref），当鼠标指针进入元素时为 true，离开时为 false，常用于实现悬停效果、下拉菜单触发、工具提示显示等交互，且自动处理事件监听器的添加与清理，确保安全、简洁且符合 Vue 响应式范式。

### useFocus
useFocus 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地管理 DOM 元素的聚焦（focus）状态，它返回一个包含 focused（布尔值响应式引用）、focus() 和 blur() 方法的对象，可自动监听元素的 focus 与 blur 事件，并支持在组件挂载时自动聚焦、条件聚焦或焦点追踪，常用于表单控件高亮、无障碍导航、输入框交互优化等场景，同时兼容原生元素和通过模板引用（ref）获取的组件。

### useFocusWithin
useFocusWithin 是 VueUse 提供的一个组合式函数，用于在 Vue 应用中响应式地检测一个元素或其任意子元素是否处于聚焦状态，它基于 focusin 和 focusout 事件实现，返回一个布尔值的响应式引用（Ref），当目标元素自身或其内部任何可聚焦子元素获得焦点时为 true，失去焦点时为 false，常用于实现表单组高亮、输入容器样式联动、无障碍交互反馈等场景，是 CSS 伪类 :focus-within 的 JavaScript 响应式等效方案。

### useFps

### useGeolocation

## 实用工具

### useLastChanged
useLastChanged 是一个组合式函数，用于自动记录某个响应式引用（ref 或 reactive）最后一次发生变化的时间戳。

## useMouse
```
import { useMouse } from '@vueuse/core'
import { reactive } from 'vue'

// "x" and "y" are refs
const { x, y } = useMouse()
console.log(x.value)

// "mouse" is a reactive object
const mouse = useMouse()
console.log(mouse.x.value)

// "x" and "y" will be auto unwrapped, no `.value` needed
const mouse = reactive(useMouse())
console.log(mouse.x)
```

## useTitle
useTitle 组合工具可以帮助你获取并设置当前页面的属性。
```
const isDark = useDark()

useTitle(() => isDark.value ? '🌙 Good evening!' : '☀️ Good morning!')
```

## createInjectionState
将 provide/inject 封装成一个可复用、类型安全、响应式友好的“状态容器”，让依赖注入像使用 Pinia store 一样简单。

| 特性 | 原生 provide/inject | `createInjectionState` |
|------|---------------------|------------------------|
| 使用方式 | 手动写 `provide(key, value)` 和 `inject(key)` | 自动生成 `useProvideXxx` 和 `useXxx` 函数 |
| 类型安全 | 需手动管理 InjectionKey | 自动推导返回类型，TS 友好 |
| 封装性 | 状态逻辑分散 | 状态、计算属性、方法集中在一个函数内 |
| 复用性 | 每次都要重写 provide/inject | 一次定义，到处使用 |
| 默认值处理 | inject 支持默认值 | 可通过 `??` 或自定义 hook 处理 `undefined` |

### 定义状态（createInjectionState）
```typescript
// stores/useCounterStore.ts
import { createInjectionState } from '@vueuse/core'
import { ref, computed } from 'vue'

// 1. 创建注入状态
const [useProvideCounterStore, useCounterStore] = createInjectionState(
  (initialValue: number) => {
    const count = ref(initialValue)
    const double = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    return { count, double, increment }
  }
)

export { useProvideCounterStore, useCounterStore }
```

### 在祖先组件中“提供”状态（useProvideCounterStore）
```html
<!-- App.vue 或 Layout.vue -->
<script setup>
import { useProvideCounterStore } from '@/stores/useCounterStore'
// 调用 provide 函数，初始化状态
useProvideCounterStore(0)
</script>
```

### 在任意后代组件中“注入”状态（useCounterStore）
```
<!-- AnyChild.vue -->
<script setup>
import { useCounterStore } from '@/stores/useCounterStore'

// 获取状态（注意：可能为 undefined）
const store = useCounterStore()
const { count, double, increment } = store!
</script>

<template>
  <div>
    Count: {{ count }}
    Double: {{ double }}
    <button @click="increment">+1</button>
  </div>
</template>
```

## createSharedComposable
让多个组件共享同一个组合式函数实例，确保：
- 只创建一次状态
- 只注册一次副作用
- 所有组件共享同一份响应式数据

### 基本用法
1. 创建共享版本
```typescript
// composables/useSharedMouse.ts
import { createSharedComposable } from '@vueuse/core'
import { useMouse } from './useMouse' // 假设这是你自己的组合式函数

// 创建共享版本
export const useSharedMouse = createSharedComposable(useMouse)
```
2. 在多个组件中使用
```html
<!-- ComponentA.vue -->
<script setup>
import { useSharedMouse } from '@/composables/useSharedMouse'
const { x, y } = useSharedMouse()
</script>

<!-- ComponentB.vue -->
<script setup>
import { useSharedMouse } from '@/composables/useSharedMouse'
const { x, y } = useSharedMouse() // 👈 共享同一个实例！
</script>
```

## injectLocal & provideLocal
通过扩展 Vue 的 provide/inject 机制，新增 provideLocal 和 injectLocal，使得同一个组件内部可以自己提供、自己注入值（原生 provide/inject 只能由祖先提供、后代注入，不能在自身使用）。

在同一组件中提供该值。
provideLocal：
```
<script setup>
import { injectLocal, provideLocal } from '@vueuse/core'

provideLocal('MyInjectionKey', 1)
const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
</script>
```

