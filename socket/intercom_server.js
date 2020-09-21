const net = require('net');
const global = require("../global/globalFile");
let intercom_server = null;

//创建socket服务
net.createServer(socket => {

    intercom_server = socket;

    console.log("可视对讲服务器有新连接进来了:" + intercom_server.remoteAddress);

    //接收到数据
    intercom_server.on('data',function(data){
        console.log("可视对讲服务器接收到数据：");
        console.log(data);
    });

    //客户端关闭事件
    intercom_server.on('close',async function(data){
        console.log('可视对讲服务器断开连接....');
    });

    //数据错误事件
    intercom_server.on('error',function(exception){
        console.log('可视对讲服务器报错:' + exception);
    });

}).listen(5000,function(){
    console.log("可视对讲服务器跑起来了...");
});

