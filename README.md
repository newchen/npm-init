## 解决npm初始化同步创建github仓库的问题

### 使用

```
// 下载
git clone git@github.com:newchen/npm-init.git

// 设置init-module指向
// ~/.npm-init.js 替换为下载下来的路径
npm config set init-module ~/.npm-init.js 

// 初始化
npm init 
```