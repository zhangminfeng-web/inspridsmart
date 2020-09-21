const ws = require('nodejs-websocket');
const Udp = require("../udp/cloudUdpServer");


module.exports = ws.createServer(socket =>{
    let ip =null;
    console.log("有新用户连接上来了");
    //接收用户的发送消息的事件
    socket.on('text',function(data){
        console.log("服务器接收到数据：");
        console.log(data);
        /*if(typeof data == 'string'){
            let obj = JSON.parse(data);
            if(obj.sendIp){
                ip = obj.sendIp;
            }
        }*/
        //await Udp.sendOpenVideo(ip);
        socket.send(data);
    });

    //关闭连接的方法
    socket.on("close",function(){
        //await Udp.sendCloseVideo(ip);
        console.log("服务端断开链接...");
    })

    //连接发生错误的时候触发
    socket.on("error",function(e){
        console.log(e);
    })

}).listen(4000);