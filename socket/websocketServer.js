const ws = require("nodejs-websocket");
const global = require("../global/globalFile");
const selfIp = require('../global/getIpAdress');

var server = ws.createServer(function(conn){
    if(server.connections.length<=1) {
        console.log("新的连接进来了...");
        //1.通知客户端,当前服务端正在待机状态中
        conn.sendText("connect");



        conn.on("text",function (msg) {
            console.log("服务器收到消息");
            console.log(msg);
            if(msg.indexOf("{") != -1){ //对象信息
                let obj = JSON.parse(msg.toString());
                //调用消息处理方法，处理对应的消息
                sendLocalMsg(obj);
            }else{  //纯字符串信息

                //接收客户端的设备名称和摄像头是否存在的状态
                if(msg.indexOf(",0") != -1 || msg.indexOf(",1") != -1){
                    let index = msg.indexOf(",");
                    let deviceName = msg.substring(0,index);
                    let videoStatus = msg.substring(index);
                    console.log(deviceName);
                    console.log(videoStatus);
                }


            }
        });

        conn.on("close", function (code, reason) {
            console.log("关闭连接");
        });

        conn.on("error", function (code, reason) {
            console.log("异常关闭");
        });

        //初始化发送offer
        sendLocalMsg();
    }else{
        //表示当前大于1人正在连接，通知其它连接的客户端，当前正在视频通话
        conn.sendText("isPhone");
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
        conn.sendText(msg);
    })
}

function sendLocalMsg(obj){
    if(obj){
        switch(obj.type) {
            //处理客户端发送过来的answer消息
            case "answer":
                //将消息通过事件派发，发送给本地处理
                $(global.documentJq).trigger("serverAnswer",[obj]);
                break;
            case "candidate":
                //服务端处理客户端发送的ice信息
                $(global.documentJq).trigger("answer_candidate",[obj]);
                break;
            default:
        }
    }else{
        //触发创建offer事件,并将offer信息发送给客户端
        $(global.documentJq).trigger("sendAnswer");
    }
}

server.listen(global.INTERCOM_PORT,function(){
    console.log("websocket服务已经启动...");
});