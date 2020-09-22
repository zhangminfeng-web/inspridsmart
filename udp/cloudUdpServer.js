const dgram = require("dgram");
const global = require("../global/globalFile");
const server = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("upd服务器端报错:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo){
    let obj = JSON.parse(msg.toString());
    /*走视频监控模块*/
    obj.ip = rinfo.address;
    obj.port = rinfo.port;
    /*如果收到自己发送的消息,则立即退出程序*/
    if(rinfo.address == global.SELF_IP){
        console.log(global.SELF_IP);
        return false;
    }
    /*如果是后上线的设备,则通知设备本机设备也在线上*/
    if(obj.type == 1 && rinfo.address != global.SELF_IP){
        //1.返回新上线设备信息
        let SendBuff = global.getJsonMsg({senderName:"中心管理机设备",msg:"消息",type:2,code:"123456"});
        //2.保存新上线设备信息
        global.addEquipmentInfo(obj);
        //3.发送回复设备信息，给新上线的客户端
        server.send(SendBuff,0,SendBuff.length,42836,rinfo.address, function(err, bytes) {
            if(err != null){
                console.log(err);
            }
        });
    }
    /*将之前已经上线的设备信息，保存起来*/
    else if(obj.type ==2){
        global.addEquipmentInfo(obj);
    }
    /*除开门口机和门铃机之外的室内设备*/
    else{
        global.addEquipmentInfo(obj);
    }

});

server.on("close",function(){
    console.log("客户端与服务端断开连接");
});

server.on("listening", function () {
    var address = server.address();
    //console.log("服务器端接受到"+address.address+":"+address.port);
});

/**
 * 打开视频监控的消息
 */
exports.sendOpenVideo = function(ip,type){
    if(type){
        let SendBuff = global.getJsonMsg({senderName:"中心管理机设备",msg:"消息",type:11,code:"123456"});
        server.send(SendBuff,0,SendBuff.length,42836,ip, function(err) {
            if(err != null){
                console.log(err);
            }
        });
    }
}

/**
 * 关闭视频监控的消息
 */
exports.sendCloseVideo = function(ip,type){
    let SendBuff = global.getJsonMsg({senderName:"中心管理机设备",msg:"消息",type:17,code:"123456"});
    server.send(SendBuff,0,SendBuff.length,42836,ip, function(err){
        if(err != null){
            console.log(err);
        }
    });
}

server.bind(global.CLOUD_PORT);

