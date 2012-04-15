# JSLint tool
该工具用于淘宝EDP团队提高代码质量之用。

- 检查点可配置
- 可扫描单个文件，也可以扫描目录

## 检查点
检查点是可配置的，可以根据各自的项目修改`config.json`文件。

- 2格缩进
- 120的单行最大长度限制
- 必须使用`===`做判断
- 变量必须申明
- ..

## 用法
```
node precommit.js [file] //扫描单个文件
node precommit.js [folder] [-r] //扫描目录，加-r决定是否递归扫描目录
```

## 参考
<http://www.jslint.com/>