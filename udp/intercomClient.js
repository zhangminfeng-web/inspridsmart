const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const Udp = require("../udp/cloudUdpServer");
const global = require('../global/globalFile');
const selfIp = require('../global/getIpAdress');

//客户端关闭触发
client.on('close',()=>{
    console.log('socket已关闭');
});

//链接报错触发
client.on('error',(err)=>{
    console.log(err);
});

//监听服务端返回的消息
client.on('message',(msg,rinfo)=>{
    console.log(msg);
    //client.close();
});


exports.sendIntercomInfo = async function(ip,options,callback){
    //先去发送answer  参数1.发送的数据  2.端口号   3.ip地址(暂时没有写)
    let answer = JSON.stringify(options);
    await client.send(answer,0,answer.length,global.CLOUD_PORT,selfIp.getIPAdress(),function(err){
        if(err != null){
            console.log(err);
        }
    });

    //再去发送candidate
    let candidate = JSON.stringify({"type":"candidate","label":0,"id":"audio","candidate":""});
    await client.send(candidate,0,candidate.length,global.CLOUD_PORT,selfIp.getIPAdress(),function(err){
        if(err != null){
            console.log(err);
        }
    });

    //走回调传值
    callback(123);
};
