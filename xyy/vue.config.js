// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false
// })

let proxyObj={};

proxyObj['/']={
  //websocket
  ws: false,
  //目标地址
  target:'http://localhost:8081',
  //发送请求头会被设置成target
  chageOrigin:true,
  //不重写请求地址
  pathRewrite:{
    '^/':'/'
  }

}

module.exports = {
  devServer:{
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}
