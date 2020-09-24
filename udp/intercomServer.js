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
    console.log("服务端收到信息");
    console.log(rinfo);
    console.log(obj);
    switch(obj.type) {
        case "answer":
            let objects = {ip:rinfo.address,offer:msg.toString()};
            console.log(objects);
            let offer = objects.toString();
            console.log(3);
            console.log(offer);
            server.send(offer,0,offer.length,global.INTERCOM_CLIENT_PORT,selfIp.getIPAdress(), function(err, bytes) {
                if(err != null){
                    console.log(err);
                }
            });
            break;
        case "offer":
            let answer = msg.toString();
            server.send(answer,0,answer.length, rinfo.port,selfIp.getIPAdress(), function(err, bytes) {
                if(err != null){
                    console.log(err);
                }
            });
            break;
        case "candidate":
            let candidate = msg.toString();
            server.send(candidate,0,candidate.length, rinfo.port, rinfo.address, function(err, bytes) {
                if(err != null){
                    console.log(err);
                }
            });
            break;
        default:
    }
});



