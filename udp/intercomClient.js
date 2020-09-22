const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const global = require('../global/globalFile');
const selfIp = require('../global/getIpAdress');

let clientMsg = {
    "answerMsg": null,
    "offerMsg": null,
};

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
    let obj = JSON.parse(msg.toString());
    switch(obj.type) {
        case "answer":
            console.log("收到服务端发送来的answer消息");
            obj.ip = rinfo.address;
            clientMsg.answerMsg = obj;
            break;
        case "offer":
            console.log("收到服务端发送来的offer请求");
            obj.ip = rinfo.address;
            clientMsg.offerMsg = obj;
            break;
        case "candidate":
            /*console.log("客户端收到了candidate消息");
            console.log(obj);*/
            break;
        default:

    }

    //client.close();
});


exports.sendOfferIntercomInfo = async function(ip,options,callback){
    //先去发送answer  参数1.发送的数据  2.端口号   3.ip地址(暂时没有写)
    let offer = JSON.stringify(options);
    await client.send(offer,0,offer.length,global.INTERCOM_PORT,selfIp.getIPAdress(),function(err){
        if(err != null){
            console.log(err);
        }
    });

    //向浏览器端返回answer信息
    Object.defineProperty(clientMsg,'answerMsg',{
        get:(value) => {
            callback(value);
        },
        set:(value) => {
            callback(value);
        }
    });

    //再去发送candidate
    let candidate = JSON.stringify({"type":"candidate","label":0,"id":"audio","candidate":""});
    await client.send(candidate,0,candidate.length,global.INTERCOM_PORT,selfIp.getIPAdress(),function(err){
        if(err != null){
            console.log(err);
        }
    });

};

exports.sendAnswerIntercomInfo = async function(ip,options,callback){
    let answer = JSON.stringify(options);

    //向服务器发送answer信息
    await client.send(answer,0,answer.length,global.INTERCOM_PORT,ip,function(err){
        if(err != null){
            console.log(err);
        }
    });

    //向浏览器端返回answer信息
    Object.defineProperty(clientMsg,'offerMsg',{
        get:(value) => {
            callback(value);
        },
        set:(value) => {
            callback(value);
        }
    });

    //再去发送candidate
    let candidate = JSON.stringify({"type":"candidate","label":0,"id":"audio","candidate":""});
    await client.send(candidate,0,candidate.length,global.INTERCOM_PORT,ip,function(err){
        if(err != null){
            console.log(err);
        }
    });
}