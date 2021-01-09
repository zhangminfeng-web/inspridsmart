const dgram = require('dgram');
const global = require("../global/globalFile");
const udp_client = dgram.createSocket('udp4');

module.exports.localhostUdpServer = function(callback){
    //注意：senderName:必须包含“中心管理机”这几个字
    let SendBuff = global.getJsonMsg({senderName:"中心管理机设备",msg:"消息",type:1,code:"123456"});

    //发送消息
    udp_client.send(SendBuff,0,SendBuff.length,42836, '255.255.255.255', function(err, bytes) {
        if(err != null){
            console.log(err);
        }

        callback && callback();
    });
}

udp_client.bind(function (){
    udp_client.setBroadcast(true);
});

//发送二维码
module.exports.sendQrcode = function(qrcode,code,ip,callback){
    //注意：senderName:必须包含“中心管理机”这几个字
    let SendBuff = global.getJsonMsg({senderName:"中心管理机设备",msg:qrcode,type:5,code:code});

    //发送消息
    udp_client.send(SendBuff,0,SendBuff.length,42836,ip,function(err, bytes) {
        callback();
        if(err != null){
            console.log(err);
        }
    });
}

//发送预约门禁密码
module.exports.sendPassword = function(qrcode,code,ip,callback){
    let SendBuff = global.getJsonMsg({senderName:"中心管理机设备",msg:qrcode,type:6,code:code});

    //发送消息
    udp_client.send(SendBuff,0,SendBuff.length,42836,ip,function(err, bytes) {
        callback();
        if(err != null){
            console.log(err);
        }
    });

}

module.exports.sendPeopleSendImg = function(arrayBuffer,callback){
    console.log(arrayBuffer);
    /*udp_client.send(arrayBuffer,42888, '255.255.255.255',(err) => {
        console.log(err);
        callback();
        if(err != null){  //Uint8Array
            console.log(err);
        }
    });*/
}