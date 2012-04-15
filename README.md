# JSLint tool
该工具用于淘宝EDP团队提高代码质量之用。编码规范尽管是一些可有可无且琐碎的事情，但是错误也往往是隐藏在细节中的。工具存在的目的仅仅是为了让犯错变得困难一点而已。

- 检查点可配置
- 可扫描单个文件，也可以扫描目录

## 检查点
检查点是可配置的，可以根据各自的项目修改`config.json`文件。

- （2格）缩进检查
- 空格检查。
  - `function`前后必须有空格
  - `if`，`switch`，`function`后的`(`前，和`)`后必须有空格
  - `,`后必须有空格
  - 操作符（`+`、`-`、`=`、`*`、`/`等）前后必须有空格
  - `:`后必须存在一个空格
- 120的单行最大长度限制
- 必须使用`===`做判断
- 变量必须申明
- `JavaScript`的保留字检查
  - 请不要使用`static`、`delete`等保留字作为变量或者方法名
  - 保留字请参见：<https://developer.mozilla.org/en/JavaScript/Reference/Reserved_Words>
- 点操作符检查
  - 请用`obj.attr`代替`obj["attr"]`
- 分号结尾检查
  - 变量申明必须用`;`结尾
  - 单行表达式必须用`;`结尾
- 不能混合使用tab键和空格来进行缩进
- ..

## 用法
```
node precommit.js [file] //扫描单个文件
node precommit.js [folder] [-r] //扫描目录，加-r决定是否递归扫描目录
```

## 参考
<http://www.jslint.com/>