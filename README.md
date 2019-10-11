最近才看了 [React Conf 2018](https://www.youtube.com/watch?v=WXYPpY_mElQ) 的发布会，对 Hooks 很感兴趣，所以写了一个 demo 同时总结了一下 Hooks 的使用。
<!--more-->
项目地址：[React Hooks Test](https://github.com/BinghuiXie/react-hooks-test)

React Hooks 的出现，提供了一种能在函数式组件中使用 <i>state</i>， <i>componentDidMount</i>， <i>componentDidUpdate</i>，<i>componentWillUnMount</i> 几个钩子的功能，同时，使用 Hooks 能对逻辑进行更好的封装。

### useState Hooks
<i>useState</i> 方法提供了在函数组件中使用，修改 <i>state</i> 的能力，<i>useState</i> 方法返回两个值，第一个是 <i>state</i> 的值，第二个是可以修改这个值的函数，类似于 <i>setState</i>，<i>useState</i> 方法接收一个初始值，会将其作为返回的第一个参数的默认值。
```javascript
import React, { useState } from 'react'

function Count ( props ) {
	/* 默认 count = 0 */
	/* 可以直接在组件中使用通过 useState 返回的变量 */
	const [ count, setCount ] = useState(0);

	return (
		<div>
			<p>You click { count } times </p>
			<button 
				onClick={
					setCount( count + 1 )
				}
			/>
		</div>
	)
}
```
上面的代码是利用 Hooks 写的，如果对应 classComponent，就是这个样子：
```javascript
import React, { useState } from 'react'

export default class Count extends React.Component {

	constructor ( props ) {
		super (props);
		this.state = {
			count: 0
		}
	}	

	render () {
		return (
			<div>
				<p>You click { this.state.count } times </p>
				<button 
					onClick={
						this.setState({ count: this.state.count + 1 })
					}
				/>
			</div>
		)
	}
}
```
对比两段代码可以看出，使用 <i>useState</i> 返回的 <i>count</i> 和 <i>setCount</i> 代替了类组件中的<i>this.state.count</i> 和 <i>setState</i>的作用。

使用 Hooks 的时候注意有一点，需要将对 Hooks 的使用放在函数组件的最上面，也就是说，不能放在条件判断，循环语句或者潜逃的函数内部里面使用 Hooks，比如：
```javascript
if ( true ) {
	const [ count, setCount ] = useState(0);
}

while ( true ) {
	const [ count, setCount ] = useState(0);
}

function Example ( props ) {
	
	function test () {
		const [ count, setCount ] = useState(0);
	}
	return (
		<div>example</div>
	)
}
```
上面这三种写法都是不可以的。
为了帮助我们检查是否正确使用了 Hooks， React 官方提供了一个[插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)，安装插件以后，在最外层目录下新建 <i>.eslintrc</i>文件，添加如下配置：
```javascript
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```
就可以为我们检测 Hooks 的使用是否正确了，不正确的话会抛出错误。

### useEffect Hooks
在平常的类组件中（class component），<i>componentDidMount</i>，<i>componentDidUpdate</i>，<i>componentWillUnmount</i>三个钩子比较常用，一般情况下，在<i>componentDidMount</i>设定绑定事件监听，发送 ajax 请求，在<i>componentDidUpdate</i>进行组件更新后同时更新数据的操作，在<i>componentWillUnmount</i>取消监听或其他操作，防止内存泄露。   
但在很多情况下，<i>componentDidUpdate</i>和<i>componentDidMount</i>的逻辑是重复的，比如：
```javascript
class Example extends React.Component {
  	constructor(props) {
    		super(props);
    		this.state = {
		      count: 0
		};
  	}

  	componentDidMount() {
    		document.title = `You clicked ${this.state.count} times`;
	}

  	componentDidUpdate() {
    		document.title = `You clicked ${this.state.count} times`;
  	}

  	render() {
    		return (
      			<div>
    				<p>You clicked {this.state.count} times</p>
    				<button onClick={() => this.setState({ count: this.state.count + 1 })}>
      					Click me
    				</button>
			</div>
    		);
  	}
}
```
在上面这个例子里面就需要将同一个逻辑在不同的钩子函数中重复两次，这是因为 React 本身没有提供一个能在挂载后和组件每次更新时同时起作用的一个 API，所以即使我们能把重复的逻辑抽离出来，但还是要写两次。    
Hooks 的出现改变了这样的写法：
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  	const [count, setCount] = useState(0);

  	useEffect(() => {
    		document.title = `You clicked ${count} times`;
	});

  	return (
    		<div>
      			<p>You clicked {count} times</p>
      			<button onClick={() => setCount(count + 1)}>
        			Click me
      			</button>
    		</div>
  	);
}
```
使用 <i>useEffect</i>，它会在组件每一次更新（包括挂载）的时候都执行一次，这样就实现了<i>componentDidMount</i>和<i>componentDidUpdate</i>的功能。
<i>useEffect</i>还可以实现<i>componentWillUnmount</i>的功能，方法是返回一个函数，React会在该去清除的时候执行这个函数：
```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  	const [isOnline, setIsOnline] = useState(null);

  	useEffect(() => {
    		function handleStatusChange(status) {
     			 setIsOnline(status.isOnline);
		}

   		ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    		// 返回一个函数，在销毁这个组件的时候会执行这个返回的函数
    		return function cleanup() {
      		ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    		};
  	});

  	if (isOnline === null) {
    		return 'Loading...';
  	}
  	return isOnline ? 'Online' : 'Offline';
}
```
注意，React 会在组件每一次新的渲染之前清除掉之前的 effect ，不是只有最终组件销毁的时候才执行一次，关于为什么需要在每一次更新都调用一次 effects，参考[官方文档](https://reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update).    
<i>useEffect</i>还接收第二个参数，第二个参数为一个数组，只有数组里面的变量有变化，React 才会去执行上面的 effects，否则不会去执行，这是一种优化的操作
```javascript
useEffect(() => {
  	document.title = `You clicked ${count} times`;
}, [count]);
```
在上面这个例子中，只有 count 变化了才会去重新执行 effect，一般来说建议把 effect 里面涉及到的变量都加到参数列表里面，如果数组中有多个变量，React将重新运行该 effect，即使其中只有一个与之前的不同。
如果想只运行和清除这个 effect 一次，可以传入一个空数组：<i>[]</i> 

### custom hooks
除了 React 官方提供的几个 Hooks 之外，还可以制定自己的 Hooks，制定自己的 Hooks 可以将组件的逻辑提取出来，变成可以复用的函数。
<i>Custom Hooks</i>其实就是一个函数，它以 <i>use</i>开头，在其内部可以使用官方的 Hooks：
```javascript
function useProgress(animate, time) {
  const [ progress, setProgress ] = useState(0);
  
  useEffect(
    () => {
      if (animate) {
        let animateTemp = null;
        let start = null;
        let step = timestamp => {
          if (!start) {
            start = timestamp;
          }
          let progress = timestamp - start;
          setProgress(progress);
          if (progress < time) {
            animateTemp = requestAnimationFrame(step);
          }
        };
        animateTemp = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animateTemp)
      }
    },
    [animate, time]
  );
  return animate ? Math.min(progress / time, time) : 0;
}
```
<i>useProgress</i>这个函数就是一个<i>Custom Hook</i>，这个 Hooks 的作用是根据传入的时间(time)返回一个进度条的宽度比例。