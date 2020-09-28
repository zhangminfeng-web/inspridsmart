const ws = require("nodejs-websocket");
const global = require("../global/globalFile");
const selfIp = require('../global/getIpAdress');

var server = ws.createServer(function(conn){
    if(server.connections.length<=1) {
        console.log("新的连接进来了...");
        let host = conn.socket.remoteAddress;
        let index = host.lastIndexOf(":");
        let ip = host.substring(index + 1);

        //保存offerPc端的IP
        if(ip != selfIp.getIPAdress()){
            global.OFFERPC_IP = ip;
        }

        conn.on("text", function (msg) {
            let obj = JSON.parse(msg.toString());
            //调用消息处理方法，处理对应的消息
            sendLocalMsg(obj);
        });

        conn.on("close", function (code, reason) {
            console.log("关闭连接");
        });

        conn.on("error", function (code, reason) {
            console.log("异常关闭");
        });

    }

});

function sendLocalMsg(obj){
    switch(obj.type) {
        //处理offerPc端发送过来的offer消息
        case "answer":
            //将消息通过事件派发，发送给本地处理
            $(global.documentJq).trigger("receivedOffer",[obj]);
            break;
        //处理answerPc端发送过来的answer消息
        case "offer":
            //将answerPc发送来的消息通过事件派发，发送给本地处理
            $(global.documentJq).trigger("localAnswer",[obj]);
            break;
        //处理两端发送过来的ice信息
        case "candidate":
            //answerPc端收到offerPc端发送的ice信息,并转发给自己的客户端
            if(obj.address == global.OFFERPC_IP){
                console.log(1);
                $(global.documentJq).trigger("offerPc_ice",[obj]);
            }

            //接收answerPc端向offerPc端发送的ice信息,并转发给自己的客户端
            if(obj.address != global.OFFERPC_IP){
                console.log(2);
                console.log("接收到answerPc端发送过来的ice信息");
                console.log(obj);
            }
            break;
        default:
    }

}

server.listen(global.INTERCOM_PORT,function(){
    console.log("websocket服务已经启动...");
});