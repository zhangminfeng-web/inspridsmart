const ws = require("nodejs-websocket");
const global = require("../global/globalFile");
const selfIp = require('../global/getIpAdress');

var server = ws.createServer(function(conn){
    if(server.connections.length<=1) {
        console.log("新的连接进来了...");
        conn.on("text",function (msg) {
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

//向客户端发送消息的公共函数
exports.sendMsgToClient = function(msg){
    //调用广播函数
    broadcast(server,msg);
};

// 服务端广播
function broadcast(server, msg) {
    server.connections.forEach(function(conn) {
        conn.sendText(msg)
    })
}

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
            //$(global.documentJq).trigger("localAnswer",[obj]);
            break;
        //处理两端发送过来的ice信息
        case "candidate":

            //answerPc端收到offerPc端发送的ice信息,并转发给自己的客户端
            /*if(obj.offer_ice){
                console.log(1);
                console.log(obj);
                $(global.documentJq).trigger("offerPc_ice",[obj]);
            }

            //接收answerPc端向offerPc端发送的ice信息,并转发给自己的客户端
            if(obj.answer_ice){
                console.log(2);
                console.log(obj);
                console.log("接收到answerPc端发送过来的ice信息");
            }*/


            /*if(obj.answer_ice){

            }

*/

            break;
        default:
    }

}

server.listen(global.INTERCOM_PORT,function(){
    console.log("websocket服务已经启动...");
});