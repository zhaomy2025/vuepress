## 简介
Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里。
Vue 的组件可以按两种不同的风格书写：选项式 API 和组合式 API。
通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 `<script setup>` 搭配使用。
使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 data、methods 和 mounted。选项所定义的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。
选项式 API 是在组合式 API 的基础上实现的！关于 Vue 的基础概念和知识在它们之间都是通用的。

## 全局 API
### 应用实例
#### app.config
+ compilerOptions: 配置运行时编译器的选项。
  - isCustomElement: 用于指定一个检查方法来识别原生自定义元素。
  - whitespace: 用于调整模板中空格的处理行为。
  - delimiters: 用于调整模板内文本插值的分隔符。
  - comments: 用于调整模板中 HTML 注释的处理方式。
+ globalProperties: 一个用于注册能够被应用内所有组件实例访问到的全局属性的对象。
+ optionMergeStrategies: 一个用于定义自定义组件选项的合并策略的对象。
+ idPrefix: 配置此应用中通过 useId() 生成的所有 ID 的前缀。
+ throwUnhandledErrorInProduction: 强制在生产模式下抛出未处理的错误。
### 通用
#### version
#### nextTick()
nextTick() 可以在状态改变后立即使用，以等待 DOM 更新完成。
#### defineComponent()
在定义 Vue 组件时提供类型推导的辅助函数。
简单说：它让 Vue 组件在 TypeScript 中“有类型”，避免 any 和类型丢失。
#### defineAsyncComponent()
定义一个异步组件，它在运行时是懒加载的。

## 组合式 API

Vue 3 推出了两种使用组合式 API 的方式，只有当你无法使用`<script setup>`时，才需要手写 setup() 函数。

### 响应式：核心

+ ref(): 接受一个内部值，返回一个响应式的、可更改的 ref 对象。
+ computed(): 接受一个 getter 函数，返回一个只读的响应式 ref 对象。也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
+ reactive(): 返回一个对象的响应式代理。
+ readonly(): 接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理。
+ watchEffect(): 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
+ watchPostEffect(): 与 watchEffect() 类似，但会在 DOM 更新后执行。
+ watchSyncEffect(): 与 watchEffect() 类似，但会同步执行。
+ watch(): 默认是懒侦听的，即仅在侦听源发生变化时才执行回调函数。
+ onWatcherCleanup(): 注册一个清理函数，在当前侦听器即将重新运行时执行。

---

readonly(obj) = “请不要动这个对象” → 保护现有数据
computed(() => ...) = “这是根据其他数据算出来的新东西” → 生成派生数据

---

与 watchEffect() 相比，watch() 使我们可以：
+ 懒执行副作用；
+ 更加明确是应该由哪个状态触发侦听器重新执行；
+ 可以访问所侦听状态的前一个值和当前值。

### 响应式：工具
+ isRef(): 检查某个值是否为 ref。
+ unref(): 如果参数是 ref，则返回内部值，否则返回参数本身。
+ toRef(): 将各种形式的数据“规范化”为 ref 对象，并在需要时保持与源数据的双向同步。
  - 解决“解构响应式对象会丢失响应性”的问题
+ toValue(): 将值、refs 或 getters 规范化为值。这与 unref() 类似，不同的是此函数也会规范化 getter 函数。
+ toRefs(): 将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。
+ isProxy(): 检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理。
+ isReactive(): 检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代理。
+ isReadonly(): 检查传入的值是否为只读对象。

### 响应式：进阶

+ shallowRef(): ref() 的浅层作用形式。
+ triggerRef(): 强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用。
+ customRef(): 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。
+ shallowReactive(): reactive() 的浅层作用形式。
+ shallowReadonly(): readonly() 的浅层作用形式。
+ toRaw(): 根据一个 Vue 创建的代理返回其原始对象。
+ markRaw(): 将一个对象标记为不可被转为代理。返回该对象本身。
+ effectScope(): 创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。
+ getCurrentScope(): 如果有的话，返回当前活跃的 effect 作用域。
+ onScopeDispose(): 在当前活跃的 effect 作用域上注册一个处理回调函数。当相关的 effect 作用域停止时会调用这个回调函数。

### 生命周期钩子

+ onMounted(): 注册一个回调函数，在组件挂载完成后执行。
+ onUpdated(): 注册一个回调函数，在组件因为响应式状态变更而更新其 DOM 树之后调用。
+ onUnmounted(): 注册一个回调函数，在组件实例被卸载之后调用。
+ onBeforeMount(): 注册一个钩子，在组件被挂载之前被调用。
+ onBeforeUpdate(): 注册一个钩子，在组件即将因为响应式状态变更而更新其 DOM 树之前调用。
+ onBeforeUnmount(): 注册一个钩子，在组件实例被卸载之前调用。
+ onErrorCaptured(): 注册一个钩子，在捕获了后代组件传递的错误时调用。
+ onRenderTracked(): 注册一个调试钩子，当组件渲染过程中追踪到响应式依赖时调用。
+ onRenderTriggered(): 注册一个调试钩子，当响应式依赖的变更触发了组件渲染时调用。
+ onActivated(): 注册一个回调函数，若组件实例是`<KeepAlive>`缓存树的一部分，当组件被插入到 DOM 中时调用。
+ onDeactivated(): 注册一个回调函数，若组件实例是`<KeepAlive>`缓存树的一部分，当组件从 DOM 中被移除时调用。
+ onServerPrefetch(): 注册一个异步函数，在组件实例在服务器上被渲染之前调用。

### 依赖注入

+ provide(): 提供一个值，可以被后代组件注入。
+ inject(): 注入一个由祖先组件或整个应用 (通过 app.provide()) 提供的值。
+ hasInjectionContext(): 如果 inject() 可以在错误的地方 (例如 setup() 之外) 被调用而不触发警告，则返回 true。此方法适用于希望在内部使用 inject() 而不向用户发出警告的库。

### 辅助

+ useAttrs(): 从 Setup 上下文中返回 attrs 对象，其中包含当前组件的透传 attributes。
+ useSlots(): 从 Setup 上下文中返回 slots 对象，其中包含父组件传递的插槽。
+ useModel(): 这是驱动 defineModel() 的底层辅助函数。如果使用 <script setup>，应当优先使用 defineModel()。
+ useTemplateRef(): 返回一个浅层 ref，其值将与模板中的具有匹配 ref attribute 的元素或组件同步。
+ useId(): 用于为无障碍属性或表单元素生成每个应用内唯一的 ID。

## 选项式 API

### 状态选项

+ data: 用于声明组件初始响应式状态的函数。
+ props: 用于声明一个组件的 props。
+ computed: 用于声明要在组件实例上暴露的计算属性。
+ methods: 用于声明要混入到组件实例中的方法。
+ watch: 用于声明在数据更改时调用的侦听回调。
+ emits: 用于声明由组件触发的自定义事件。
+ expose: 用于声明当组件实例被父组件通过模板引用访问时暴露的公共属性。

### 渲染选项

+ template: 用于声明组件的字符串模板。
+ render: 用于编程式地创建组件虚拟 DOM 树的函数。
+ compilerOptions: 用于配置组件模板的运行时编译器选项。
+ slots: 一个在渲染函数中以编程方式使用插槽时辅助类型推断的选项。

### 生命周期选项

+ beforeCreate: 在组件实例初始化完成之后立即调用。
+ created: 在组件实例处理完所有与状态相关的选项后调用。
+ beforeMount: 在组件被挂载之前调用。
+ mounted: 在组件被挂载之后调用。
+ beforeUpdate: 在组件即将因为一个响应式状态变更而更新其 DOM 树之前调用。
+ updated: 在组件因为一个响应式状态变更而更新其 DOM 树之后调用。
+ beforeUnmount: 在一个组件实例被卸载之前调用。
+ unmounted: 在一个组件实例被卸载之后调用。
+ errorCaptured: 在捕获了后代组件传递的错误时调用。
+ renderTracked: 在一个响应式依赖被组件的渲染作用追踪后调用。
+ renderTriggered: 在一个响应式依赖被组件触发了重新渲染之后调用。
+ activated: 若组件实例是`<KeepAlive>`缓存树的一部分，当组件被插入到 DOM 中时调用。
+ deactivated: 若组件实例是`<KeepAlive>`缓存树的一部分，当组件从 DOM 中被移除时调用。
+ serverPrefetch: 当组件实例在服务器上被渲染之前要完成的异步函数。

### 组合选项

+ provide: 用于提供可以被后代组件注入的值。
+ inject: 用于声明要通过从上层提供方匹配并注入进当前组件的属性。
+ mixins: 一个包含组件选项对象的数组，这些选项都将被混入到当前组件的实例中。
+ extends: 要继承的“基类”组件。

### 其他杂项

+ name: 用于显式声明组件展示时的名称。
+ inheritAttrs: 用于控制是否启用默认的组件 attribute 透传行为。
+ components: 一个对象，用于注册对当前组件实例可用的组件。
+ directives: 一个对象，用于注册对当前组件实例可用的指令。

### 组件实例
+ $data: 从 data 选项函数中返回的对象，会被组件赋为响应式。组件实例将会代理对其数据对象的属性访问。
+ $props: 表示组件当前已解析的 props 对象。
+ $el: 该组件实例管理的 DOM 根节点。
+ $options: 已解析的用于实例化当前组件的组件选项。
+ $parent: 当前组件可能存在的父组件实例，如果当前组件是顶层组件，则为 null。
+ $root: 当前组件树的根组件实例。如果当前实例没有父组件，那么这个值就是它自己。
+ $slots: 一个表示父组件所传入插槽的对象。
+ $refs: 一个包含 DOM 元素和组件实例的对象，通过模板引用注册。
+ $attrs: 一个包含了组件所有透传 attributes 的对象。
+ $watch(): 用于命令式地创建侦听器的 API。
+ $emit(): 在当前组件触发一个自定义事件。任何额外的参数都会传递给事件监听器的回调函数。
+ $forceUpdate(): 强制该组件重新渲染。
+ $nextTick(): 绑定在实例上的 nextTick() 函数。

## 内置内容
### 指令
+ v-text: 更新元素的文本内容。
+ v-html: 更新元素的 innerHTML。
  - v-html 的内容直接作为普通 HTML 插入—— Vue 模板语法是不会被解析的。
+ v-show: 基于表达式值的真假性，来改变元素的可见性。
+ v-if: 基于表达式值的真假性，来条件性地渲染元素或者模板片段。
+ v-else: 表示 v-if 或 v-if / v-else-if 链式调用的“else 块”。
+ v-else-if: 表示 v-if 的“else if 块”。可以进行链式调用。
+ v-for: 基于原始数据多次渲染元素或模板块。
+ v-on: 给元素绑定事件监听器。
+ v-bind: 动态的绑定一个或多个 attribute，也可以是组件的 prop。
+ v-model: 在表单输入元素或组件上创建双向绑定。
+ v-slot: 用于声明具名插槽或是期望接收 props 的作用域插槽。
+ v-pre: 跳过该元素及其所有子元素的编译。
+ v-once: 仅渲染元素和组件一次，并跳过之后的更新。
+ v-memo: 缓存一个模板的子树。在元素和组件上都可以使用。
+ v-cloak: 用于隐藏尚未完成编译的 DOM 模板。

### 组件
+ `<Transition>`: 为单个元素或组件提供动画过渡效果。
+ `<TransitionGroup>`: 为列表中的多个元素或组件提供过渡效果。
+ `<KeepAlive>`: 缓存包裹在其中的动态切换组件。
+ `<Teleport>`: 将其插槽内容渲染到 DOM 中的另一个位置。
+ `<Suspense>`: 用于协调对组件树中嵌套的异步依赖的处理。

### 特殊元素
+ `<component>`: 一个用于渲染动态组件或元素的“元组件”。
+ `<slot>`: 表示模板中的插槽内容出口。
+ `<template>`: 当我们想要使用内置指令而不在 DOM 中渲染元素时，`<template>` 标签可以作为占位符使用。

### 特殊 Attributes
+ key: key 这个特殊的 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode。
+ ref: 用于注册模板引用。
+ is: 用于绑定动态组件。

## 单文件组件
### 语法定义
+ 总览：每一个`*.vue`文件都由三种顶层语言块和自定义块构成
+ 相应语言块：
  - `<template>`
  - `<script>`
  - `<style>`
  - 自定义块
+ 自动名称推导: 根据文件名自动推导其组件名
+ 预处理器: 代码块可以使用 lang 这个 attribute 来声明预处理器语言。
+ src 导入: 如果将 *.vue 组件分散到多个文件中，可以为一个语块使用 src 这个 attribute 来导入一个外部文件
  - 相对路径需要以 ./ 开头
  - 在 src 中使用别名时，不要以 ~ 开头，后面的任何内容都会被解释为模块请求。
+ 注释: 在每一个语块中你都可以按照相应语言的语法书写注释。对于顶层注释，请使用 HTML 的注释语法 `<!-- 注释内容 -->`。

### `<script setup>`
+ 基本语法
  - `<script setup>`中的代码会在每次组件实例被创建的时候执行。
  - 顶层的绑定会被暴露给模板，这意味着你可以直接在模板中使用这些绑定。
  - import 导入的内容也会以同样的方式暴露。这意味着我们可以在模板表达式中直接使用导入的 helper 函数。
+ 响应式: 响应式状态需要明确使用响应式 API 来创建，ref 在模板中使用的时候会自动解包。
+ 使用组件: `<script setup>`范围里的值也能被直接作为自定义组件的标签名使用。
  - 在`<script setup>`中要使用动态组件的时候，应该使用动态的`:is`来绑定。
  - 如果有具名的导入和组件自身推导的名字冲突了，可以为导入的组件添加别名。
  - 可以使用带`.`的组件标签，例如 <Foo.Bar> 来引用嵌套在对象属性中的组件。
+ 使用自定义指令
  - 全局注册的自定义指令将正常工作。本地的自定义指令在`<script setup>`中不需要显式注册。
+ defineProps() 和 defineEmits()
  - defineProps() 用于定义组件的 props，声明当前组件从父组件接收哪些数据。
  - defineEmits() 用于定义组件的自定义事件，返回一个 emit 函数，用于触发事件并传递数据。
+ defineModel(): 声明一个双向绑定 prop，通过父组件的 v-model 来使用。
+ defineExpose(): 通过 defineExpose 编译器宏来显式指定在`<script setup>`组件中要暴露出去的属性。
+ defineOptions(): 用来直接在`<script setup>` 中声明组件选项，而不必使用单独的`<script>`块。
+ defineSlots(): 用于为 IDE 提供插槽名称和 props 类型检查的类型提示。
+ useSlots() 和 useAttrs() 与 setupContext.slots 和 setupContext.attrs 等价。
+ 与普通的`<script>`一起使用
  - 不要为已经可以用`<script setup>`定义的选项使用单独的`<script>`部分，如`props`和`emits`。
+ 顶层 await: `<script setup>` 中可以使用顶层 await。
+ 导入语句: Vue 中的导入语句遵循 ECMAScript 模块规范。
+ 泛型: 可以使用`<script>`标签上的`generic`属性声明泛型类型参数。
+ 限制: `<script setup>`不能和`src`、`attribute` 一起使用。

### CSS 功能
+ 组件作用域 CSS: 当`<style>`标签带有`scoped` attribute 的时候，它的 CSS 只会影响当前组件的元素。
  - 子组件的根元素: 使用`scoped`后，父组件的样式将不会渗透到子组件中，但子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。
  - 深度选择器: 处于 scoped 样式中的选择器如果想要影响到子组件，可以使用`:deep()`这个伪类。
  - 插槽选择器: 默认情况下，作用域样式不会影响到`<slot/>`渲染出来的内容，使用`:slotted`伪类以明确地将插槽内容作为选择器的目标。
  - 全局选择器: 如果想让其中一个样式规则应用到全局，可以使用 :global 伪类来实现。
+ CSS Modules: 一个`<style module>`标签会被编译为 CSS Modules 并且将生成的 CSS class 作为`$style`对象暴露给组件。
+ CSS 中的 v-bind(): 单文件组件的 <style> 标签支持使用 v-bind CSS 函数将 CSS 的值链接到动态的组件状态。

## 进阶 API

### 自定义元素
+ defineCustomElement()
+ useHost(): 一个组合式 API 辅助函数，返回当前 Vue 自定义元素的宿主元素。
+ useShadowRoot(): 一个组合式 API 辅助函数，返回当前 Vue 自定义元素的 shadow root。
+ this.$host: 一个选项式 API 的 property，暴露当前 Vue 自定义元素的宿主元素。

### 渲染函数
+ h(): 创建虚拟 DOM 节点 (vnode)。
+ mergeProps(): 合并多个 props 对象，用于处理含有特定的 props 参数的情况。
+ cloneVNode(): 克隆一个 vnode。
+ isVNode(): 判断一个值是否为 vnode 类型。
+ resolveComponent(): 按名称手动解析已注册的组件。
+ resolveDirective(): 按名称手动解析已注册的指令。
+ withDirectives(): 用于给 vnode 增加自定义指令。
+ withModifiers(): 用于向事件处理函数添加内置 v-on 修饰符。

### 服务端渲染
+ renderToString()
+ renderToNodeStream(): 将输入渲染为一个 Node.js Readable stream 实例。
+ pipeToNodeWritable(): 将输入渲染并 pipe 到一个 Node.js Writable stream 实例。
+ renderToWebStream(): 将输入渲染为一个 Web ReadableStream 实例。
+ pipeToWebWritable(): 将输入渲染并 pipe 到一个 Web WritableStream 实例。
+ renderToSimpleStream(): 通过一个简单的接口，将输入以 stream 模式进行渲染。
+ useSSRContext(): 一个运行时 API，用于获取已传递给 renderToString() 或其他服务端渲染 API 的上下文对象。
+ data-allow-mismatch: 可以消除激活不匹配警告的特殊 attribute。

### TypeScript 工具类型
+ `PropType<T>`: 用于在用运行时 props 声明时给一个 prop 标注更复杂的类型定义。
+ `MaybeRef<T>`: `T | Ref<T>`的别名。对于标注组合式函数的参数很有用。
+ `MaybeRefOrGetter<T>`: `T | Ref<T> | (() => T)`的别名。对于标注组合式函数的参数很有用。
+ `ExtractPropTypes<T>`: 从运行时的 props 选项对象中提取 props 类型。
+ `ExtractPublicPropTypes<T>`: 从运行时的 props 选项对象中提取 prop。
+ ComponentCustomProperties: 用于增强组件实例类型以支持自定义全局属性。
+ ComponentCustomOptions: 用来扩展组件选项类型以支持自定义选项。
+ ComponentCustomProps: 用于扩展全局可用的 TSX props，以便在 TSX 元素上使用没有在组件选项上定义过的 props。
+ CSSProperties: 用于扩展在样式属性绑定上允许的值的类型。

### 自定义渲染
+ createRenderer(): 创建一个自定义渲染器。通过提供平台特定的节点创建以及更改 API，你可以在非 DOM 环境中也享受到 Vue 核心运行时的特性。

### 编译时标志
+ `__VUE_OPTIONS_API__`: 启用/禁用选项式 API 支持。
+ `__VUE_PROD_DEVTOOLS__`: 在生产环境中启用/禁用开发者工具支持。
+ `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`: 启用/禁用生产环境构建下激活 (hydration) 不匹配的详细警告。
