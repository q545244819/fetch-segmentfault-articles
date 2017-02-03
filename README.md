# 简介

一个简单爬虫，爬取你所在 segmentfault 发表的文章，保存源 markdown 内容到本地。

# 使用

先使用 git 克隆本项目到本地，然后，把 config.example.json 重命名为 config.json。

username 可以在你的首页 url 上面看到：

![](http://ww1.sinaimg.cn/large/6d693dfegy1fcdk6eod3ej208v00ydfo)

打开 chrome 开发者工具，点击 network 然后在 request headers 里面找到 cookie：

![](http://ww1.sinaimg.cn/large/6d693dfegy1fcdk9o3jb7j20dj0623yl)

然后对应的复制到 config.json 里面即可，最后到项目根目录下运行：

```
$ npm run fetch
```

就会在根目录创建一个 articles 文件夹，里面就是你所有的文章了！

# 一些问题

 - 如果文章名字包含`/`的符号会被替换成`-`。