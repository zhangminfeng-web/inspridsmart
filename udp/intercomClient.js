const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const global = require('../global/globalFile');
const selfIp = require('../global/getIpAdress');

let clientMsg = {
    "answerMsg": null,
    "offerMsg": null,
    "offerIce":null,
    "answerIce":null,
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
    console.log(msg.toString());
    console.log("---*******");
    let obj = JSON.parse(msg.toString());
    switch(obj.type) {
        case "answer":
            console.log("收到服务端发送来的answer消息");
            clientMsg.answerMsg = obj;
            console.log(obj);
            break;
        case "offer":
            console.log("收到服务端发送来的offer请求");
            obj.ip = rinfo.address;
            clientMsg.offerMsg = obj;
            break;
        case "candidate":
            console.log("客户端收到了candidate消息");
            if(obj.offer_ice){
                clientMsg.offerIce = obj;
            }

            if(obj.answer_ice){
                clientMsg.answerIce = obj;
            }

            break;
        default:

    }

    //client.close();
});

//开启客户端服务
client.bind(global.INTERCOM_CLIENT_PORT);

//发送offer
exports.sendOfferIntercomInfo = async function(ip,options,callback){
    console.log(2);
    console.log(ip);
    //先去发送answer  参数1.发送的数据  2.端口号   3.ip地址(暂时没有写)
    let offer = JSON.stringify(options);
    console.log(offer);
    //selfIp.getIPAdress()
    await client.send(offer,0,offer.length,global.INTERCOM_PORT,ip,function(err){
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


}

//向服务端发送offer_ice信息
exports.sendOffer_ice = async function(ip,options,callback){
    //再去发送candidate
    if(options.toJSON){
        delete  options.toJSON;
    }
    let offerCandidate = JSON.stringify(options);
    await client.send(offerCandidate,0,offerCandidate.length,global.INTERCOM_PORT,ip,function(err){
        if(err != null){
            console.log(err);
        }
    });

    //接收到服务器端发送offer_ice信息
    Object.defineProperty(clientMsg,'offerIce',{
        get:(value) => {
            callback(value);
        },
        set:(value) => {
            callback(value);
        }
    });


}

exports.sendAnswer_ice = async function(ip,options,callback){

    //发送answer_ice的candidate消息
    if(options.toJSON){
        delete  options.toJSON;
    }

    let answerCandidate = JSON.stringify(options);

    await client.send(answerCandidate,0,answerCandidate.length,global.INTERCOM_PORT,ip,function(err){
        if(err != null){
           console.log(err);
        }
    });

    //接收到服务器端发送offer_ice信息
    Object.defineProperty(clientMsg,'answerIce',{
        get:(value) => {
            callback(value);
        },
        set:(value) => {
            callback(value);
        }
    });

}