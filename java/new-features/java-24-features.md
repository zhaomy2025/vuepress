# Java 24 新特性

[[toc]]

## 概述

Java 24 于 2025 年 3 月发布，包含了多个新特性和改进。

## JEP 404: 分代 Shenandoah（实验性）

::: info JEP 404: Generational Shenandoah (Experimental)
Enhance the Shenandoah garbage collector with experimental generational collection capabilities to improve sustainable throughput, load-spike resilience, and memory utilization.
:::

通过实验性分代收集功能增强 Shenandoah 垃圾回收器 ，以提高可持续吞吐量、负载峰值弹性和内存利用率。

<!-- @include:generational-shenandoah-intro.md -->

## JEP 450: 紧凑对象头（实验性）

::: info JEP 450: Compact Object Headers (Experimental)
Reduce the size of object headers in the HotSpot JVM from between 96 and 128 bits down to 64 bits on 64-bit architectures. This will reduce heap size, improve deployment density, and increase data locality.
:::

重构了Java对象的内存布局，将 HotSpot JVM中的普通对象头大小从96到128位减少到64位，从而提升内存利用率和应用性能。

<!-- @include:compact-object-headers-intro.md -->

## JEP 472: 准备限制 JNI 的使用

::: info JEP 472: Prepare to Restrict the Use of JNI
Issue warnings about uses of the Java Native Interface (JNI) and adjust the Foreign Function & Memory (FFM) API to issue warnings in a consistent manner. All such warnings aim to prepare developers for a future release that ensures integrity by default by uniformly restricting JNI and the FFM API. Application developers can avoid both current warnings and future restrictions by selectively enabling these interfaces where essential.
:::

JEP 472（Prepare to Restrict the Use of JNI）是JDK 24中的一个重要提案，旨在**增强Java平台的安全性**，通过引入对Java本地接口（JNI）使用的限制和警告，为未来版本默认禁止通过JNI或FFM API与本地代码互操作做准备。

<!-- @include:prepare-to-restrict-the-use-of-jni-intro.md -->

## JEP 475: G1 的 Late Barrier 扩展

::: info JEP 475: Late Barrier Expansion for G1
Simplify the implementation of the G1 garbage collector's barriers, which record information about application memory accesses, by shifting their expansion from early in the C2 JIT's compilation pipeline to later.
:::

G1 垃圾收集器的后期屏障扩展旨在通过将屏障的扩展从 C2 编译管道的早期移到后期来简化 G1 屏障的实现。屏障记录有关应用程序内存访问的信息。目标包括减少使用 G1 收集器时 C2 编译的执行时间，使对 C2 缺乏深入了解的 HotSpot 开发人员能够理解 G1 屏障，并确保 C2 保留有关内存访问、安全点和屏障的相对顺序的不变量。第四个功能是保留 C2 生成的 JIT（即时）编译代码的质量（速度和大小）。

## JEP 478: 密钥派生函数 API（预览）

::: info JEP 478: Key Derivation Function API (Preview)
Introduce an API for Key Derivation Functions (KDFs), which are cryptographic algorithms for deriving additional keys from a secret key and other data. This is a preview API.
:::

借助密钥派生函数 (KDF) API，将引入用于密钥派生函数的 API，这些函数是用于从密钥和其他数据派生其他密钥的加密算法。此提案的目标是允许安全提供商以 Java 代码或本机代码实现 KDF 算法。另一个目标是使应用程序能够使用 KDF 算法，例如基于 HMAC（哈希消息认证码）的提取和扩展密钥派生函数 ( RFC 5869 ) 和 Argon2 ( RFC 9106 )。

## JEP 479: 删除 Windows 32 位 x86 端口

::: info JEP 479: Remove the Windows 32-bit x86 Port
Remove the source code and build support for the Windows 32-bit x86 port. This port was deprecated for removal in JDK 21 with the express intent to remove it in a future release.
:::

移除针对 Windows 32 位 x86 端口的源代码和构建支持。该端口在 JDK 21 中已被标记为“弃用以待移除”，并明确表达了在未来的版本中将其移除的意图。

## JEP 483: 提前类加载和链接
::: info JEP 483: Ahead-of-Time Class Loading & Linking
Improve startup time by making the classes of an application instantly available, in a loaded and linked state, when the HotSpot Java Virtual Machine starts. Achieve this by monitoring the application during one run and storing the loaded and linked forms of all classes in a cache for use in subsequent runs. Lay a foundation for future improvements to both startup and warmup time.
:::

提前类加载和链接旨在缩短启动时间，方法是在 HotSpot Java 虚拟机启动时，使应用程序的类立即处于加载和链接状态。这将通过在一次运行期间监视应用程序并将所有类的加载和链接形式存储在缓存中以供后续运行使用来实现。

## JEP 484: 类文件 API

::: info JEP 484: Class-File API
Provide a standard API for parsing, generating, and transforming Java class files.
:::

<!-- @include: ./class-file-api-intro.md -->

自第二个预览版以来的更改包括重命名枚举值、删除某些字段、添加方法和方法重载、重命名方法以及删除被认为不必要的接口和方法。


## JEP 485: 流收集器
::: info JEP 485: Stream Gatherers
Enhance the Stream API to support custom intermediate operations. This will allow stream pipelines to transform data in ways that are not easily achievable with the existing built-in intermediate operations.
:::
流收集器（Stream Gatherers）能为Stream API轻松添加自定义的中间操作，实现更复杂的数据转换。

## JEP 486: 永久禁用安全管理器
::: info JEP 486: Permanently Disable the Security Manager
The Security Manager has not been the primary means of securing client-side Java code for many years, it has rarely been used to secure server-side code, and it is costly to maintain. We therefore deprecated it for removal in Java 17 via JEP 411 (2021). As the next step toward removing the Security Manager, we will revise the Java Platform specification so that developers cannot enable it and other Platform classes do not refer to it. This change will have no impact on the vast majority of applications, libraries, and tools. We will remove the Security Manager API in a future release.
:::

永久禁用安全管理器需要修改 Java 平台规范，以便开发人员无法启用安全管理器，而其他平台类则不会引用它。提案指出，多年来，安全管理器一直不是保护客户端 Java 代码的主要手段，很少用于保护服务器端代码，而且维护成本高昂。安全管理器已在 Java 17 中被弃用并被删除。


## JEP 487: 范围值（第四个预览版）
::: info JEP 487: Scoped Values (Fourth Preview)
Introduce scoped values, which enable a method to share immutable data both with its callees within a thread, and with child threads. Scoped values are easier to reason about than thread-local variables. They also have lower space and time costs, especially when used together with virtual threads (JEP 444) and structured concurrency (JEP 480). This is a preview API.
:::

范围值使方法能够与线程内的调用方和子线程共享不可变数据。范围值比本地线程变量更容易推理。它们还具有较低的空间和时间成本，特别是与虚拟线程和结构化并发一起使用时。范围值 API 是在 JDK 20 中提出的孵化版，在 JDK 21 中提出的预览版，并针对 JDK 22 和 JDK 23 进行了改进和完善。范围值将在 JDK 24 中预览。

## JEP 488: 模式、instanceof 和 switch中的原始类型（第二次预览）
::: info JEP 488: Primitive Types in Patterns, instanceof, and switch (Second Preview)
Enhance pattern matching by allowing primitive types in all pattern contexts, and extend instanceof and switch to work with all primitive types. This is a preview language feature.
:::

<!-- @include: ./primitive-types-in-patterns-instanceof-and-switch-intro.md -->

[模式、instanceof 和 switch中的原始类型](./primitive-types-in-patterns-instanceof-and-switch.md)

## JEP 489: 向量 API（第九个孵化器）
::: info JEP 489: Vector API (Ninth Incubator)
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::

<!-- @include:./vector-api-intro.md -->

## JEP 490:  ZGC：删除非分代模式

::: info JEP 490: ZGC: Remove the Non-Generational Mode
Remove the non-generational mode of the Z Garbage Collector (ZGC), keeping the generational mode as the default for ZGC.
:::

删除 Z 垃圾收集器 (ZGC) 的非分代模式，旨在降低支持两种不同模式的维护成本。该提案指出，维护非分代 ZGC 会减慢新功能的开发速度，而对于大多数用例而言，分代 ZGC 应该是比非分代 ZGC 更好的解决方案。后者最终应该被前者取代，以降低长期维护成本。该计划要求通过淘汰 ZGenerational 选项并删除非分代 ZGC 代码及其测试来删除非分代模式。非分代模式将在未来的版本中过期，届时它将不会被 HotSpot JVM 识别，从而拒绝启动。

## JEP 491: 无需固定即可同步虚拟线程

::: info JEP 491: Synchronize Virtual Threads without Pinning
Improve the scalability of Java code that uses synchronized methods and statements by arranging for virtual threads that block in such constructs to release their underlying platform threads for use by other virtual threads. This will eliminate nearly all cases of virtual threads being pinned to platform threads, which severely restricts the number of virtual threads available to handle an application's workload.
:::

优化了虚拟线程在同步操作（如 `synchronized`）时的性能，减少了“线程固定”（pinning）问题，从而提升了虚拟线程的吞吐量和可扩展性。

## JEP 492: 灵活的构造函数体（第三次预览）

::: info JEP 492: Flexible Constructor Bodies (Third Preview)
In constructors in the Java programming language, allow statements to appear before an explicit constructor invocation, i.e., super(..) or this(..). The statements cannot reference the instance under construction, but they can initialize its fields. Initializing fields before invoking another constructor makes a class more reliable when methods are overridden. This is a preview language feature.
:::

<!-- @include:./flexible-constructor-bodies-intro.md -->

## JEP 493: 无需 JMOD 即可链接运行时图像

::: info JEP 493: Linking Run-Time Images without JMODs
Reduce the size of the JDK by approximately 25% by enabling the jlink tool to create custom run-time images without using the JDK's JMOD files. This feature must be enabled when the JDK is built; it will not be enabled by default, and some JDK vendors may choose not to enable it.
:::

通过链接不使用 JMOD 的运行时映像，计划通过启用 jlink 工具来创建不使用 JDK JMOD（模块化 JAR）文件的自定义运行时映像，将 JDK 的大小减少约 25%。在构建 JDK 时必须启用此功能（默认情况下不会启用），某些 JDK 供应商可能选择不启用它。目标包括允许用户从模块链接运行时映像，而不管这些模块是独立的 JMOD 文件、模块化 JAR 文件还是先前链接的运行时映像的一部分。提出该提案的动机是，在云环境中，文件系统上安装的 JDK 的大小非常重要，因为包含已安装 JDK 的容器映像会通过网络自动且频繁地从容器注册表复制。减小 JDK 的大小将提高这些操作的效率。

## JEP 494: 模块导入声明（第二次预览）

::: info JEP 494: Module Import Declarations (Second Preview)
Enhance the Java programming language with the ability to succinctly import all of the packages exported by a module. This simplifies the reuse of modular libraries, but does not require the importing code to be in a module itself. This is a preview language feature.
:::

<!-- @include: ./module-Import-declarations-intro.md -->

之前在 JDK 23 中预览过，本次改动点：
- 解除任何模块都不能声明对 java.base 模块的传递依赖的限制
- 修改 java.se 模块的声明
- 允许 type-import-on-demand 声明遮蔽模块导入声明

## JEP 495: 简单源文件和实例主方法（第四次预览）

::: info JEP 495: Simple Source Files and Instance Main Methods (Fourth Preview)
Evolve the Java programming language so that beginners can write their first programs without needing to understand language features designed for large programs. Far from using a separate dialect of the language, beginners can write streamlined declarations for single-class programs and then seamlessly expand their programs to use more advanced features as their skills grow. Experienced developers can likewise enjoy writing small programs succinctly, without the need for constructs intended for programming in the large. This is a preview language feature.
:::

<!-- @include: ./jer-445-463-477-495-512-intro.md -->

改动点：将**隐式声明的类和实例主方法**重命名为**简单源文件和实例主要方法**

## JEP 496: 基于抗量子模块格的密钥封装机制 & JEP 497: 基于模块格的抗量子数字签名算法

::: info JEP 496: Quantum-Resistant Module-Lattice-Based Key Encapsulation Mechanism
Enhance the security of Java applications by providing an implementation of the quantum-resistant Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM). Key encapsulation mechanisms (KEMs) are used to secure symmetric keys over insecure communication channels using public key cryptography. ML-KEM is designed to be secure against future quantum computing attacks. It has been standardized by the United States National Institute of Standards and Technology (NIST) in FIPS 203.
:::

为通过抗量子性提高 Java 安全性而提出的两个功能包括抗量子的基于模块格的密钥封装机制(ML-KEM) 和抗量子的基于模块格的数字签名算法(ML-DSA)。ML-DSA 将通过提供抗量子的数字签名来检测对数据的未经授权的修改并验证签名者的身份，从而防止未来的量子计算攻击。密钥封装机制 (KEM) 用于使用公钥加密技术通过不安全的通信通道保护对称密钥。这两个功能都旨在防止未来的量子计算攻击。下一步将是引入对这些 API 和密钥派生函数 API 的 TLS（传输层安全性）支持。

## JEP 498: 在 sun.misc.Unsafe 中使用内存访问方法时发出警告

::: info JEP 498: Warn upon Use of Memory-Access Methods in sun.misc.Unsafe
Issue a warning at run time on the first occasion that any memory-access method in sun.misc.Unsafe is invoked. All of these unsupported methods were terminally deprecated in JDK 23. They have been superseded by standard APIs, namely the VarHandle API (JEP 193, JDK 9) and the Foreign Function & Memory API (JEP 454, JDK 22). We strongly encourage library developers to migrate from sun.misc.Unsafe to supported replacements, so that applications can migrate smoothly to modern JDK releases.
:::

Java 会在运行时首次调用 sun.misc.Unsafe 中的任何内存访问方法时发出警告。所有这些不受支持的方法在 JDK 23 中都已弃用，并已被标准 API 取代。创建 sun.misc.Unsafe 类是为了为 Java 类提供一种执行低级操作的机制。它的大多数方法用于访问内存，无论是在 JVM 的垃圾收集堆中还是在堆外内存中，这些内存不受 JVM 控制。正如类名所示，这些内存访问方法是不安全的。

## JEP 499: 结构化并发（第四次预览）

::: info JEP 499: Structured Concurrency (Fourth Preview)
Simplify concurrent programming by introducing an API for structured concurrency. Structured concurrency treats groups of related tasks running in different threads as a single unit of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is a preview API.
:::

<!-- @include:./structured-concurrency-intro.md -->

## JEP 501: 弃用 32 位 x86 端口并将其删除

::: info JEP 501: Deprecate the 32-bit x86 Port for Removal
Deprecate the 32-bit x86 port, with the intent to remove it in a future release. This will thereby deprecate the Linux 32-bit x86 port, which is the only 32-bit x86 port remaining in the JDK. It will also, effectively, deprecate any remaining downstream 32-bit x86 ports. After the 32-bit x86 port is removed, the architecture-agnostic Zero port will be the only way to run Java programs on 32-bit x86 processors.
:::

弃用 32 位 x86 端口并删除，这是在弃用 Windows 32 位 x86 端口的提议之后做出的，这将弃用 Linux 32 位 x86 端口，这是 JDK 中剩余的唯一 32 位 x86 端口。它还将有效弃用任何剩余的下游 32 位 x86 端口。在删除 32 位 x86 端口后，与架构无关的零端口将成为在 32 位 x86 处理器上运行 Java 程序的唯一方法。在 JDK 24 中弃用 32 位 x86 端口将允许在 JDK 25 中将其删除。