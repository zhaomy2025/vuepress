## 创建一个 Vue 应用
### 应用实例
每个 Vue 应用都是通过 createApp 函数创建一个新的应用实例：
```
import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
  data() {    return {      count: 0    }  }
})
```
应用实例并不只限于一个。createApp API 允许你在同一个页面中创建多个共存的 Vue 应用，而且每个应用都拥有自己的用于配置和全局资源的作用域。

### 根组件
传入 createApp 的对象实际上是一个组件，每个应用都需要一个“根组件”，其他组件将作为其子组件。

### 挂载应用
应用实例必须在调用了 .mount() 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串。
```html
<div id="app"></div>
```

```js
app.mount('#app')
```
.mount() 方法应该始终在整个应用配置和资源注册完成后被调用。同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。

### 应用配置
应用实例会暴露一个 .config 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，用来捕获所有子组件上的错误：
```
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```
应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件：
```
app.component('TodoDeleteButton', TodoDeleteButton)
```

## 模板语法

### 文本插值
```
<span>Message: {{ msg }}</span>
```

### 原始HTML
```
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### Attribute 绑定
```
<div v-bind:id="dynamicId"></div>
简写
<div :id="dynamicId"></div>
同名简写
<div :id></div>
<div v-bind:id></div>
布尔型
<button :disabled="isButtonDisabled">Button</button>
```

动态绑定多个值
```
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```
```html
<div v-bind="objectOfAttrs"></div>
```

### 使用 JavaScript 表达式
```html
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div :id="`list-${id}`"></div>
```

模板中的表达式仅能够访问到有限的全局对象列表。
没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 window 上的属性。然而，你也可以自行在 app.config.globalProperties 上显式地添加它们，供所有的 Vue 表达式使用。

### 指令

指令是带有`v-`前缀的特殊 attribute。Vue 提供了许多内置指令，包括上面我们所介绍的`v-bind`和`v-html`。

指令 attribute 的期望值为一个 JavaScript 表达式 (除了少数几个例外，即之后要讨论到的 v-for、v-on 和 v-slot)。一个指令的任务是在其表达式的值变化时响应式地更新 DOM。

某些指令会需要一个“参数”，在指令名后通过一个冒号隔开做标识。例如用 v-bind 指令来响应式地更新一个 HTML attribute：

动态参数值的限制​
动态参数中表达式的值应当是一个字符串，或者是 null。特殊值 null 意为显式移除该绑定。其他非字符串的值会触发警告。

动态参数语法的限制​
动态参数表达式因为某些字符的缘故有一些语法限制，比如空格和引号，在 HTML attribute 名称中都是不合法的。

当使用 DOM 内嵌模板 (直接写在 HTML 文件里的模板) 时，我们需要避免在名称中使用大写字母，因为浏览器会强制将其转换为小写：

#### v-if

```html
<div v-if="seen">Now you see me</div>
```

#### v-else
```
<button @click="awesome = !awesome">Toggle</button>
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

#### v-else-if
```
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

#### v-show
```
<h1 v-show="ok">Hello!</h1>
```

#### v-for
```
<li v-for="item in items">
  {{ item.message }}
</li>
```
v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名。

#### v-bind
```
<a v-bind:href="url"> ... </a>
<a :href="url"> ... </a>

<!-- 动态参数 -->
<a v-bind:[attributeName]="url"> ... </a>
<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```

#### v-on
```
<a v-on:click="doSomething"> ... </a>
<!-- 简写 -->
<a @click="doSomething"> ... </a>

<!-- 动态参数 -->
<a v-on:[eventName]="doSomething"> ... </a>
<!-- 简写 -->
<a @[eventName]="doSomething"> ... </a>
```

#### v-model
```
<input v-model="message" placeholder="edit me" />
```

#### v-once

#### v-memo

#### 事件修饰符
修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。例如：
.prevent → 不再重新加载页面（相当于 event.preventDefault()）
.stop → 阻止事件冒泡（相当于 event.stopPropagation()）
.once → 事件只触发一次
.capture → 在捕获阶段处理事件
.self → 
.passive → 
```

<form @submit.prevent="onSubmit">...</form>
组合使用：@click.stop.prevent → 既阻止冒泡，又阻止默认行为
```

使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 @click.prevent.self 会阻止元素及其子元素的所有点击事件的默认行为，而 @click.self.prevent 则只会阻止对元素本身的点击事件的默认行为。

## 响应式基础
### ref()
在组合式 API 中，推荐使用 ref() 函数来声明响应式状态：
```
import { ref } from 'vue'
const count = ref(0)
const object = { id: ref(1) }
```

在模板渲染上下文中，只有顶级的 ref 属性或 ref 是文本插值的最终计算值 (即 {{ }} 标签)，才会被解包。
```
{{ count + 1 }}
{{ object.id }}
```

DOM 更新不是同步的。要等待 DOM 更新完成后再执行额外的代码，可以使用 nextTick() 全局 API。

### reactive()

reactive() 函数用于创建响应式对象。
```
import { reactive } from 'vue'
const state = reactive({ count: 0 })
```

在模板中使用：
```
<button @click="state.count++">
  {{ state.count }}
</button>
```

### `<script setup>`
`<script setup>`中的顶层的导入、声明的变量和函数可在同一组件的模板中直接使用。你可以理解为模板是在同一作用域内声明的一个 JavaScript 函数——它自然可以访问与它一起声明的所有内容。

## 计算属性

若我们将同样的函数定义为一个方法而不是计算属性，两种方式在结果上确实是完全相同的，然而，不同之处在于计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要 author.books 不改变，无论多少次访问 publishedBooksMessage 都会立即返回先前的计算结果，而不用重复执行 getter 函数。
这也解释了为什么下面的计算属性永远不会更新，因为 Date.now() 并不是一个响应式依赖：
```
const now = computed(() => Date.now())
```

可以通过同时提供 getter 和 setter 来修改一个计算属性。

## Class 与 Style 绑定

Vue 专门为 class 和 style 的 v-bind 用法提供了特殊的功能增强。除了字符串外，表达式的值也可以是对象或数组。
```
<div :class="{ active: isActive }"></div>
```
绑定的对象并不一定需要写成内联字面量的形式，也可以直接绑定一个对象：
```
const classObject = reactive({
  active: true,
  'text-danger': false
})
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
})
```
```
<div :class="classObject" :style="styleObject"></div>
```

也可以绑定一个返回对象的计算属性。
```
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

我们可以给 :class和:style 绑定数组：
```
<div :class="[activeClass, errorClass]" :style="[baseStyles, overridingStyles]"></div>
```

## 事件处理

### 按键修饰符

#### 按键别名
- .enter
- .tab
- .delete (捕获“删除”和“退格”键)
- .esc
- .space
- .up
- .down
- .left
- .right

```
<!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit" />

<!-- 仅会在 $event.key 为 'PageDown' 时调用事件处理。 -->
<input @keyup.page-down="onPageDown" />

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>

<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

#### 系统按键修饰符
- .ctrl
- .alt
- .shift
- .meta

+ .exact 修饰符允许精确控制触发事件所需的系统修饰符的组合。

### 鼠标按键修饰符
+ .left
+ .right
+ .middle

.left，.right 和 .middle 这些修饰符名称是基于常见的右手用鼠标布局设定的，但实际上它们分别指代设备事件触发器的“主”、”次“，“辅助”，而非实际的物理按键。因此，对于左手用鼠标布局而言，“主”按键在物理上可能是右边的按键，但却会触发 .left 修饰符对应的处理程序。又或者，触控板可能通过单指点击触发 .left 处理程序，通过双指点击触发 .right 处理程序，通过三指点击触发 .middle 处理程序。

## 表单输入绑定
```
<input v-model="text">
```
v-model 会忽略任何表单元素上初始的 value、checked 或 selected attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。

```
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

### 修饰符
```
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
<!-- 让用户输入自动转换为数字 -->
<input v-model.number="age" />
<!-- 自动去除用户输入内容中两端的空格 -->
<input v-model.trim="msg" />
```

## 侦听器
watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组。

### 深层侦听器
直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发。
```
watch(
  source,
  (newValue, oldValue) => {
    // 在嵌套的属性变更时触发
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // 因为它们是同一个对象！
  }
)
```

一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调，必须显式地加上 deep 选项，强制转成深层侦听器，才能在嵌套的属性变更时触发回调。
```
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

### 即时回调的侦听器
```
watch(
  source,
  (newValue, oldValue) => {
    // 立即执行，且当 `source` 改变时再次执行
  },
  { immediate: true }
)
```

### 一次性侦听器
```
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，仅触发一次
  },
  { once: true }
)
```

## 模板引用

## 组件创建
```
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

## 组件注册

### 局部注册（推荐）
在使用 <script setup> 的单文件组件中，导入的组件可以直接在模板中使用，无需注册：
```
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```
如果没有使用 <script setup>，则需要使用 components 选项来显式注册。
请注意：局部注册的组件在后代组件中不可用。在这个例子中，ComponentA 注册后仅在当前组件可用，而在任何的子组件或更深层的子组件中都不可用。

### 全局注册
使用 Vue 应用实例的 .component() 方法，让组件在当前 Vue 应用中全局可用。
```
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyButton from './components/MyButton.vue'

const app = createApp(App)
app.component('MyButton', MyButton) // 全局注册
app.mount('#app')
```

## 组件使用
```
<MyButton text="删除" @click="onDelete" />
```

## 组件通信

### 父 -> 子: props

一个组件需要显式声明它所接受的 props，这样 Vue 才能知道外部传入的哪些是 props，哪些是透传 attribute。
在使用`<script setup>`的单文件组件中，props 可以使用 defineProps() 宏来声明。

```
<script setup>
defineProps(['title'])
// 使用对象的形式
defineProps({
  title: String,
  likes: Number
})
</script>
```

### 子 -> 父: $emit

子组件：defineEmits + emit
```html
<script setup>
// 声明：本组件可以触发 'enlarge-text' 事件
defineEmits(['enlarge-text'])
</script>
<template>
  <!-- 【使用】通过变量 emit 来触发 -->
  <button @click="emit('enlarge-text')">放大</button>
</template>
```

父组件可以通过 v-on (缩写为 @) 来监听事件：
```html
<MyComponent @some-event="callback" />
```

### 插槽
父组件决定子组件内部显示什么内容。
#### 具名插槽
```
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

```
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
</BaseLayout>
```

#### 条件插槽

有时你需要根据内容是否被传入了插槽来渲染某些内容。

你可以结合使用 $slots 属性与 v-if 来实现。

#### 动态插槽名
```
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

#### 作用域插槽
```
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>

<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

## 透传Attributes
单根节点组件自动 attribute 透传。
多根节点的组件没有自动 attribute 透传行为。如果 $attrs 没有被显式绑定，将会抛出一个运行时警告。

### 禁用 Attributes 继承
```
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```
最常见的需要禁用 attribute 继承的场景就是 attribute 需要应用在根节点以外的其他元素上。通过设置 inheritAttrs 选项为 false，你可以完全控制透传进来的 attribute 被如何使用。

```
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

这些透传进来的 attribute 可以在模板的表达式中直接用 $attrs 访问到。这个 $attrs 对象包含了除组件所声明的 props 和 emits 之外的所有其他 attribute，例如 class，style，v-on 监听器等等。

### 多根节点的 Attributes 继承

多根节点模板需要显式绑定`$attrs`

```
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

### 在 JavaScript 中访问透传 Attributes
```
<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()
</script>
```

## 生命周期钩子
onMounted 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码：
```
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

## 依赖注入
provide 和 inject 必须搭配使用，它们是一对成对出现、协同工作的 API，共同构成了 Vue 的依赖注入（Dependency Injection）机制。

一个父组件相对于其所有的后代组件，会作为依赖提供者。任何后代的组件树，无论层级有多深，都可以注入由父组件提供给整条链路的依赖。

这意味着：
- provide 只负责“发布”数据到组件树的上下文中。
- inject 负责“订阅”并获取祖先发布的数据。

### Provide
```
<script setup>
import { ref, provide } from 'vue'

provide(/* 注入名，可以是字符串或 Symbol */ 'message', /* 值可以是任意类型 */ 'hello!')
const count = ref(0)
provide('key', /* 响应式的状态 */ count)
</script>
```

#### 应用层 Provide

### Inject
要注入上层组件提供的数据，需使用 inject() 函数：
```
<script setup>
import { inject } from 'vue'
const message = inject('message')

// 如果没有祖先组件提供 "message"，`value` 会是 "这是默认值"
const value = inject('message', '这是默认值')
</script>
```
如果提供的值是一个 ref，注入进来的会是该 ref 对象，而不会自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。

::: tip
当提供 / 注入响应式的数据时，建议尽可能将任何对响应式状态的变更都保持在供给方组件中。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。
:::

## 异步组件
defineAsyncComponent 方法接收一个返回 Promise 的加载函数。这个 Promise 的 resolve 回调方法应该在从服务器获得组件定义时调用。
ES 模块动态导入也会返回一个 Promise，所以多数情况下我们会将它和 defineAsyncComponent 搭配使用。
```
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
// ... 像使用其他一般组件一样使用 `AsyncComp`
```

与普通组件一样，异步组件可以使用 app.component() 全局注册，也可以直接在父组件中直接定义它们。

## 组合式函数

命名规范：以 use 开头 + 驼峰命名（如 useMouse, useLocalStorage）。

### useMouse —— 鼠标位置追踪
```
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y } // 返回响应式引用
}
```

在组件中使用
```
<script setup>
import { useMouse } from '@/composables/useMouse'
const { x, y } = useMouse()
</script>

<template>
  鼠标位置：{{ x }}, {{ y }}
</template>
```

### useFetch —— 封装网络请求
```
// composables/useFetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    try {
      const res = await fetch(url)
      data.value = await res.json()
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  fetchData() // 组件挂载时自动请求

  return { data, error, loading, fetchData }
}
```

### 生态推荐：VueUse

不要重复造轮子！VueUse 是一个包含 200+ 高质量组合式函数 的工具库，覆盖：
- 状态管理：useStorage, useRefHistory
- 浏览器 API：useMouse, useWindowSize, useClipboard
- 传感器：useBattery, useNetwork
- 动画：useTransition, useRafFn
- 实用工具：useDebounceFn, useThrottleFn

## 自定义指令
一个自定义指令由一个包含类似组件生命周期钩子的对象来定义。钩子函数会接收到指令所绑定元素作为其参数。在 `<script setup>` 中，任何以 v 开头的驼峰式命名的变量都可以当作自定义指令使用。
```html
<script setup>
// 在模板中启用 v-highlight
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

将一个自定义指令全局注册到应用层级也是一种常见的做法：
```js
const app = createApp({})

// 使 v-highlight 在所有组件中都可用
app.directive('highlight', {
  /* ... */
})
```

只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令。
使元素获取焦点的 v-focus 指令比 autofocus 属性更有用，因为它不仅在页面加载时有效，而且在 Vue 动态插入元素时也有效！
```html
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

对于自定义指令来说，一个很常见的情况是仅仅需要在 mounted 和 updated 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令，如下所示：
```html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

不推荐在组件上使用自定义指令。当组件具有多个根节点时可能会出现预期外的行为。

## 插件

一个插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。
```js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```

安装插件
```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
// 安装插件
app.use(myPlugin, { /* 可选的选项 */ })
app.mount('#app')
```

插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：
- 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
- 通过 app.provide() 使一个资源可被注入进整个应用。
- 向 app.config.globalProperties 中添加一些全局实例属性或方法
- 一个可能上述三种都包含了的功能库 (例如 vue-router)。

### 插件中的 Provide / Inject
可以将插件接收到的 options 参数提供给整个应用，让任何组件都能使用这个翻译字典对象。
```
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

现在，插件用户就可以在他们的组件中以 i18n 为 key 注入并访问插件的选项对象了。
```
<script setup>
import { inject } from 'vue'
const i18n = inject('i18n')
console.log(i18n.greetings.hello)
</script>
```

## Transition & TransitionGroup
Vue 提供了两个内置组件，可以帮助你制作基于状态变化的过渡和动画：
+ <Transition> 会在一个元素或组件进入和离开 DOM 时应用动画。本章节会介绍如何使用它。
+ <TransitionGroup> 会在一个 v-for 列表中的元素或组件被插入，移动，或移除时应用动画。我们将在下一章节中介绍。

### Transition
<Transition> 仅支持单个元素或组件作为其插槽内容。如果内容是一个组件，这个组件必须仅有一个根元素。

**CSS 的 animation​**
原生 CSS 动画和 CSS transition 的应用方式基本上是相同的，只有一点不同，那就是 *-enter-from 不是在元素插入后立即移除，而是在一个 animationend 事件触发时被移除。

**自定义过渡 class**
也可以向 <Transition> 传递以下的 props 来指定自定义的过渡 class：
+ enter-from-class
+ enter-active-class
+ enter-to-class
+ leave-from-class
+ leave-active-class
+ leave-to-class
你传入的这些 class 会覆盖相应阶段的默认 class 名。

### TransitionGroup

## KeepAlive
想要组件能在被“切走”的时候保留它们的状态。要解决这个问题，我们可以用`<KeepAlive>`内置组件将这些动态组件包装起来：

```
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

`<KeepAlive>`默认会缓存内部的所有组件实例，但我们可以通过 include 和 exclude prop 来定制该行为。它会根据组件的 name 选项进行匹配，所以组件如果想要条件性地被 KeepAlive 缓存，就必须显式声明一个 name 选项。

### 最大缓存实例数
```html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Teleport

<Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。
+ 将内容直接挂载到 <body> 或指定容器下
+ 脱离父级样式约束（overflow、z-index、transform 等）
+ 无需修改 CSS 即可实现全屏覆盖、顶层显示

尽管 DOM 被移走，但：
+ 仍能访问父组件的 props、data、methods
+ 事件（@click、$emit）正常工作
+ 响应式数据更新实时同步
+ 在 Vue DevTools 中仍显示为原组件的子节点

## Suspense
让整个页面等一等，等所有异步内容准备好再一起显示，避免白屏或闪烁。

## 单文件组件
Vue 单文件组件是一个框架指定的文件格式，因此必须交由 @vue/compiler-sfc 编译为标准的 JavaScript 和 CSS，一个编译后的单文件组件是一个标准的 JavaScript(ES) 模块，这也意味着在构建配置正确的前提下，你可以像导入其他 ES 模块一样导入单文件组件：
```
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```
在实际项目中，我们一般会使用集成了单文件组件编译器的构建工具，比如 Vite 或者 Vue CLI (基于 webpack)，Vue 官方也提供了脚手架工具来帮助你尽可能快速地上手开发单文件组件。

## 工具链

### 项目脚手架
Vite(推荐)

### 格式化
+ Vue-Official
+ Prettier

## 路由
服务端路由指的是服务器根据用户访问的 URL 路径返回不同的响应结果。
一个客户端路由器的职责就是利用诸如 History API 或是 hashchange 事件这样的浏览器 API 来管理应用当前应该渲染的视图。

## 状态管理
### 用响应式 API 做简单状态管理
### Pinia

## 测试
Vitest对于组件和组合式函数都采用无头渲染的方式 (例如 VueUse 中的 useFavicon 函数)。组件和 DOM 都可以通过 @vue/test-utils 来测试。
Cypress 组件测试 会预期其准确地渲染样式或者触发原生 DOM 事件。它可以搭配 @testing-library/cypress 这个库一同进行测试。

## 服务端渲染（SSR）
服务端渲染（Server-Side Rendering，简称 SSR）是一种 Web 应用的渲染策略，其核心思想是：在服务器端生成完整的 HTML 页面内容，并将已包含数据的 HTML 直接发送给浏览器，使用户在首次加载时即可看到完整页面，而非等待 JavaScript 执行后再渲染内容。

### 主流SSR框架
+ Next.js(React)
+ Remix(React)
+ Nuxt.js(Vue)

### SSR vs. SSG
静态站点生成 (Static-Site Generation，缩写为 SSG)，也被称为预渲染，是另一种流行的构建快速网站的技术。如果用服务端渲染一个页面所需的数据对每个用户来说都是相同的，那么我们可以只渲染一次，提前在构建过程中完成，而不是每次请求进来都重新渲染页面。预渲染的页面生成后作为静态 HTML 文件被服务器托管。

## 生产部署

## 性能优化

用于生产部署的负载性能分析：
+ PageSpeed Insights
+ WebPageTest

### 包体积与 Tree-shaking 优化

如果使用了构建步骤，应当尽量选择提供 ES 模块格式的依赖，它们对`tree-shaking`更友好。举例来说，选择`lodash-es`比 `lodash`更好。

### 代码分割

## 安全
无论是使用模板还是渲染函数，HTML内容都是自动转义的。
同样地，动态 attribute 的绑定也会被自动转义。

## 总览

## TypeScript与组合式API

## 总结
Vue 中重用代码的方式：组件、组合式函数和自定义指令。
组件是主要的构建模块，组合式函数则侧重于有状态的逻辑，自定义指令主要是为了重用涉及普通元素的底层 DOM 访问的逻辑。

