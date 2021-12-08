# 运行前修改
## 1.修改dbConfig的数据库配置
## 2.将sql文件导入数据库

#### 1. 安装依赖

```js
npm install // 安装后台依赖
```

#### 2.启动服务

```js
node ./bin/www
```

也可以安装`nodemon`来启动项目，后台的热更新，本地开发推荐使用此方法。

##### 2.1 nodemon的安装

```js
npm install -g nodemon
```

##### 2.2 使用nodemon启动项目

```js
nodemon ./bin/www
```

想看接口地址的话具体看`app.js `和 路由文件吧



