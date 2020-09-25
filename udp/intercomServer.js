const dgram = require("dgram");
const global = require("../global/globalFile");
const selfIp = require('../global/getIpAdress');
const server = dgram.createSocket("udp4");
server.bind(global.INTERCOM_PORT,function(){
    console.log("intercomClient服务启动了...");
});

server.on("error", function (err) {
    console.log("upd服务器端报错:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo){
    let obj = JSON.parse(msg.toString());
    switch(obj.type) {
        case "answer":
            //将本地的ip保存为共享数据
            global.localhostIp = rinfo.address;
            let offer = JSON.stringify(obj);
            server.send(offer,0,offer.length,global.INTERCOM_CLIENT_PORT,selfIp.getIPAdress(), function(err, bytes) {
                if(err != null){
                    console.log(err);
                }
            });
            break;
        case "offer":
            let answer = JSON.stringify(obj);
            server.send(answer,0,answer.length,global.INTERCOM_CLIENT_PORT,selfIp.getIPAdress(), function(err, bytes) {
                if(err != null){
                    console.log(err);
                }
            });
            break;
        case "candidate":
            //接收offerPc端向answerPc端发送的ice信息,并转发给自己的客户端
            if(obj.offer_ice){
                let offerCandidate = msg.toString();
                server.send(offerCandidate,0,offerCandidate.length,global.INTERCOM_CLIENT_PORT,global.receivedIp, function(err, bytes) {
                    if(err != null){
                        console.log(err);
                    }
                });
            }
            //接收answerPc端向offerPc端发送的ice信息,并转发给自己的客户端
            if(obj.answer_ice){
                let answerCandidate = msg.toString();
                server.send(answerCandidate,0,answerCandidate.length,global.INTERCOM_CLIENT_PORT,global.localhostIp,function(err, bytes) {
                    if(err != null){
                        console.log(err);
                    }
                });
            }
            break;
        default:
    }
});



