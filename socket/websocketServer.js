const ws = require("nodejs-websocket");
const global = require("../global/globalFile");
const selfIp = require('../global/getIpAdress');

var server = ws.createServer(function(conn){
    console.log(conn);
    let host = conn.headers.host;
    let index = host.indexOf(":");
    let ip = host.substring(0,index);
    console.log(ip);
    console.log("新的连接进来了...");
    conn.on("text", function (msg){
        let obj = JSON.parse(msg.toString());
        //调用消息处理方法，处理对应的消息
        sendLocalMsg(obj);
    });
    conn.on("close", function (code,reason){
        console.log("关闭连接");
    });
    conn.on("error", function (code,reason){
        console.log("异常关闭");
    });
});

//定义一个广播的方法
/*function broadcast(msg){
    //server.connections表示所有的用户
    server.connections.forEach(item => {
        //给每一个用户发送消息
        item.send(msg);
    });
}*/

function sendLocalMsg(obj){
    switch(obj.type) {
        //处理offerPc端发送过来的offer消息
        case "answer":
            //将消息通过事件派发，发送给本地处理
            $(global.documentJq).trigger("receivedOffer",[obj]);
            break;
        //处理answerPc端发送过来的answer消息
        case "offer":

            break;
        //处理两端发送过来的ice信息
        case "candidate":
            //接收offerPc端向answerPc端发送的ice信息,并转发给自己的客户端
            if(obj.offer_ice){

            }

            //接收answerPc端向offerPc端发送的ice信息,并转发给自己的客户端
            if(obj.answer_ice){

            }
            break;
        default:
    }

}

server.listen(global.INTERCOM_PORT,function(){
    console.log("websocket服务已经启动...");
});