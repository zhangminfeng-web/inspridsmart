const ws = require("nodejs-websocket");
const global = require("../global/globalFile");
const selfIp = require('../global/getIpAdress');

var server = ws.createServer(function(conn){
    if(server.connections.length<=1) {
        console.log("新的连接进来了...");
        //1.通知客户端,当前服务端正在待机状态中
        conn.sendText("connect");

        conn.on("text",function (msg) {
            if(msg.indexOf("{") != -1){ //对象信息如：offer answer candidate
                let obj = JSON.parse(msg.toString());
                //调用消息处理方法，处理对应的消息
                sendLocalMsg(obj);
            }else{  //纯字符串信息

                //接收客户端的设备名称和摄像头是否存在的状态
                if(msg.indexOf(",0") != -1 || msg.indexOf(",1") != -1){
                    let index = msg.indexOf(",");
                    let obj = {
                        deviceName:msg.substring(0,index),
                        videoStatus:msg.substring(index+1)
                    }
                    //收到客户端设备信息做对应操作
                    $(global.documentJq).trigger("openConfirmBox",[obj]);

                }

                //服务端接收到客户端端已经准备就绪的指令 clientok
                if(msg == "clientok"){
                    console.log(msg);
                    //向客户端发送门牌号，以及摄像头是否存在的状态
                    navigator.mediaDevices.enumerateDevices().then(devices => {
                        //1. 遍历当前设备信息数组,判断有没有摄像头设备
                        let flag = devices.some(device => {
                            //判断有没有摄像头设备
                            return device.kind == "videoinput";
                        });
                        //2. flag返回值为true表示有摄像头1，false没有摄像头0
                        let index = flag?"1":"0";
                        //3.向服务器发送设备的反馈信息
                        broadcast(server,"中心管理机设备,"+index);
                    });

                    //初始化发送offer
                    sendLocalMsg();
                }

                //服务端收到客户端的挂断指令
                if(msg == "hangup"){
                    //服务端执行挂断逻辑
                    $(global.documentJq).trigger("serverPcCloseVideoStream");
                }

                //报警信息
                if(msg.indexOf("alarm") != -1){
                    //调用处理报警信息的公共函数,返回一个对讲
                    let obj = policeMsg(msg);
                    //服务处理报警信息
                    $(global.documentJq).trigger("policeServerMsg",[obj]);

                }

            }
        });

        conn.on("close", function (code, reason) {
            $(global.documentJq).trigger("closeServerConnection");
            console.log("关闭连接");
        });

        conn.on("error", function (code, reason) {
            console.log("异常关闭");
        });

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

//处理报警信息的公共函数
function policeMsg(msg){
    let arr = msg.split("=");
    return {
        "type":arr[0],
        "alias_name":arr[1],
        "police_msg":arr[2],
        "now_time":arr[3]+" "+arr[4]
    }
}

// 服务端广播
function broadcast(server, msg) {
    server.connections.forEach(function(conn) {
        conn.sendText(msg);
    })
}

function sendLocalMsg(obj){
    if(obj){
        console.log("********");
        console.log(obj);
        switch(obj.type) {
            case "offer":
                console.log("收到服务端发送的offer信息了");
                break;
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