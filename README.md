最近才看了 [React Conf 2018](https://www.youtube.com/watch?v=WXYPpY_mElQ) 的发布会，对 Hooks 很感兴趣，所以写了一个 demo 同时总结了一下 Hooks 的使用。
<!--more-->
项目地址：[React Hooks Test](https://github.com/BinghuiXie/react-hooks-test)

React Hooks 的出现，提供了一种能在函数式组件中使用 <i>state</i>， <i>componentDidMount</i>， <i>componentDidUpdate</i>，<i>componentWillUnMount</i> 几个钩子的功能，同时，使用 Hooks 能对逻辑进行更好的封装。

### useState Hooks
<i>useState</i> 方法提供了在函数组件中使用，修改 <i>state</i> 的能力，<i>useState</i> 方法返回两个值，第一个是 <i>state</i> 的值，第二个是可以修改这个值的函数，类似于 <i>setState</i>，<i>useState</i> 方法接收一个初始值，会将其作为返回的第一个参数的默认值。
```javascript
import React, { useState } from 'react'

/* 默认 count = 0 */
const [ count, setCount ] = useState(0)
```