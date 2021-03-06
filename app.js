const express = require('express');
const router = require("./router/router");
const bodyParser = require('body-parser');
const global = require("./global/globalFile");
const getLocalhostIp = require("./global/getIpAdress");
const localSendMsg = require("./udp/localhostUdpServer");

const app = express();

/*app.engine('html', require('express-art-template'));*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*app.use('/node_modules',express.static("./node_modules"));
app.use('/public/',express.static("./public"));*/

/*将路由容器挂载到app中*/
app.use(router);

//配置全局错误处理中间件
app.use((err,req,res,next)=>{
    console.log(err);
});

app.listen(global.LOCALHOST_PORT, function(){
    //获取本机IP地址
    getLocalhostIp.getIPAdress();
    //执行服务器用于接收广播数据
    require("./udp/cloudUdpServer");
    //调用执行UDP协议发送数据
    localSendMsg.localhostUdpServer();
    //启动net中socket服务
    require("./socket/net_server");
    //启动可视对讲服务器
    //require("./udp/intercomServer");

    //启动websocket服务
    require("./socket/websocketServer");

});