const dgram = require("dgram");
const global = require("../global/globalFile");
const server = dgram.createSocket("udp4");
server.bind(global.INTERCOM_PORT);

server.on("error", function (err) {
    console.log("upd服务器端报错:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo){
    let obj = JSON.parse(msg.toString());
    switch(obj.type) {
        case "answer":
            let offer = msg.toString();
            server.send(offer,0,offer.length, rinfo.port, rinfo.address, function(err, bytes) {
                if(err != null){
                    console.log(err);
                }
            });
            break;
        case "offer":
            console.log("收到客户端发送来的offer请求");
            let answer = msg.toString();
            server.send(answer,0,answer.length, rinfo.port, rinfo.address, function(err, bytes) {
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



