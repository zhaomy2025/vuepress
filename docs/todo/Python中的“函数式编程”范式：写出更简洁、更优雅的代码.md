# Python中的"函数式编程"范式：写出更简洁、更优雅的代码

当我们谈论Python时，我们常常称其为一门"多范式"的编程语言。除了我们最熟悉的面向对象编程（OOP）和过程式编程，Python还优雅地支持一种强大而迷人的编程思想------**函数式编程（Functional Programming, FP）** 。

## **第一章：函数式编程的核心思想------换个"大脑"看代码**

在深入代码之前，我们必须先理解函数式编程的三个核心支柱。

1. **可重复利用**

   你可以：

   * 将函数赋值给一个变量。
   * 将函数作为参数传递给另一个函数（高阶函数）。
   * 将函数作为另一个函数的返回值。 这是Python实现函数式编程的基石。

2. **数据不可变** 我们倾向于不修改已存在的数据，而是创建新的数据。例如，不去修改一个列表，而是返回一个经过处理的新列表。这极大地减少了因数据状态改变而引发的复杂性和潜在bug，尤其是在并发编程中。

3. **函数独立性** 一个"纯函数"（Pure Function）是指，对于相同的输入，永远产生相同的输出，并且在这个过程中，不与外界发生任何交互（如修改全局变量、打印到控制台、读写文件等）。这种函数就像一个封闭的数学公式，独立、可预测、易于测试。

## **第二章：入门三剑客------map, filter, reduce**

这三个函数是函数式编程的经典入门工具，它们能让你用一种声明式的方式来处理序列数据。

### **map()：对序列中的每个元素应用同一个操作**

想象一下，你想将一个列表中的所有数字都平方。用传统的for循环，你会这么写：

```python
numbers = [1, 2, 3, 4, 5]
squared = []
for n in numbers:
    squared.append(n * n)
# squared -> [1, 4, 9, 16, 25]
```

而使用map，代码会变得极其简洁：

```python
numbers = [1, 2, 3, 4, 5]
# map(function, iterable)
squared = list(map(lambda x: x * x, numbers))
# squared -> [1, 4, 9, 16, 25]
```

这里我们用了lambda来创建一个简单的匿名函数。map的写法，更像是在"声明"一个意图（"将平方操作映射到numbers上"），而不是描述具体的执行步骤。

**更Pythonic的选择：列表推导式** 在Python中，对于简单的map操作，列表推导式通常更受欢迎，因为它更直观：

```python
squared = [n * n for n in numbers]
```

### **filter()：筛选出序列中满足条件的元素**

假设你想从列表中筛选出所有的偶数。

传统写法：

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = []
for n in numbers:
    if n % 2 == 0:
        evens.append(n)
# evens -> [2, 4, 6]
```

使用filter：

```python
numbers = [1, 2, 3, 4, 5, 6]
# filter(function, iterable)
evens = list(filter(lambda x: x % 2 == 0, numbers))
# evens -> [2, 4, 6]
```

同样，列表推导式也能实现，并且更具可读性：

```python
evens = [n for n in numbers if n % 2 == 0]
```

### **reduce()：对序列进行累积计算**

reduce可能是三者中最不常用的一个，因为它在Python 3中被移入了functools模块。它的作用是将一个接收两个参数的函数，累积地应用到序列的元素上，从而将序列"减少"为一个单一的值。

例如，计算一个列表中所有数字的乘积：

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
# reduce(function, iterable)
product = reduce(lambda x, y: x * y, numbers)
# 过程: (((1*2)*3)*4)*5
# product -> 120
```

虽然reduce很强大，但Python之父Guido van Rossum认为，对于大多数场景，一个清晰的for循环更易于理解。因此，除非逻辑非常契合reduce的模式，否则不建议滥用。

## **第三章：进阶的利器------functools模块**

functools模块是Python函数式编程的"兵器库"，它提供了一系列强大的高阶函数和函数装饰器。

### **functools.partial：冻结函数的参数**

当你有一个多参数的函数，但希望在多次调用时，其中一些参数保持不变，partial就派上用场了。它能将一个函数的部分参数"冻结"起来，生成一个新的、更简单的函数。

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

# 我们想创建一个专门计算平方的函数
square = partial(power, exponent=2)

# 创建一个专门计算立方的函数
cube = partial(power, exponent=3)

print(square(5))  # 输出: 25 (相当于调用 power(5, exponent=2))
print(cube(5))    # 输出: 125 (相当于调用 power(5, exponent=3))
```

partial在回调函数、事件处理等场景中非常有用，它能让你的代码更具模块化和可复用性。

### **functools.wraps：优雅的装饰器助手**

当你编写装饰器时，一个常见的问题是，被装饰后的函数，其元信息（如函数名__name__、文档字符串__doc__）会丢失，变成了装饰器内部函数的元信息。@functools.wraps就是为了解决这个问题而生的。

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 关键！
    def wrapper(*args, **kwargs):
        """这是一个wrapper函数的文档字符串"""
        print("Something is happening before the function is called.")
        result = func(*args, **kwargs)
        print("Something is happening after the function is called.")
        return result
    return wrapper

@my_decorator
def say_hello():
    """这是一个say_hello函数的文档字符串"""
    print("Hello!")

print(say_hello.__name__)  # 输出: 'say_hello' (如果没有@wraps，会输出'wrapper')
print(say_hello.__doc__)   # 输出: '这是一个say_hello函数的文档字符串'
```

**编写装饰器时，可尝试使用@functools.wraps。**

### **functools.lru_cache：一行代码实现缓存**

这是一个极其强大的装饰器，它可以为函数的结果提供一个LRU（Least Recently Used，最近最少使用）缓存。对于那些计算开销大，且同样输入会得到同样输出的纯函数，lru_cache能极大地提升性能。

最经典的例子就是斐波那契数列：

```python
from functools import lru_cache
import time

@lru_cache(maxsize=None)  # maxsize=None表示缓存大小无限制
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

# 测试性能
start_time = time.time()
print(fib(40))  # 几乎是瞬间完成
print(f"Time with cache: {time.time() - start_time:.4f}s")

# 如果没有@lru_cache，计算fib(40)会花费数十秒甚至更久
```

只需一行@lru_cache，就将一个指数级时间复杂度的递归，优化为了近乎线性的时间复杂度。

## **第四章：拥抱函数式思维，重塑你的代码**

掌握了工具，更重要的是转变思维。在日常编码中，我们可以如何应用函数式思想？

* **优先使用列表/字典推导式** ，而不是手写for循环来创建新的集合。
* **多编写小的、单一职责的纯函数** ，然后像搭积木一样将它们组合起来解决复杂问题。
* **尽量避免修改传入的参数（尤其是可变类型如列表、字典）** ，而是返回一个新的、修改后的对象。
* **对于复杂的函数调用链，考虑使用函数式编程风格** ，例如将多个操作串联起来：

```python
# 命令式风格
result = []
for item in data:
    if condition(item):
        transformed_item = transform(item)
        result.append(transformed_item)

# 函数式风格
result = list(map(transform, filter(condition, data)))
# 或者更Pythonic的推导式
result = [transform(item) for item in data if condition(item)]
```

函数式编程并非要取代面向对象编程，而是为我们提供了另一种看待和组织代码的视角。

当你在处理数据集合，或者构建复杂的函数逻辑时，不妨尝试用函数式的"大脑"来思考一下。或许你会发现，那些曾经冗长复杂的代码，可以用一种惊人简洁和优雅的方式来表达。


[Read in Cubox](https://cubox.pro/my/card?id=7353385581545521222)