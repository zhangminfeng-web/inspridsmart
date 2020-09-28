const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const global = require('../global/globalFile');
const selfIp = require('../global/getIpAdress');

let documentEl;

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
            $(documentEl).trigger("receivedOffer",[obj]);
            break;
        case "offer":
            $(documentEl).trigger("localAnswer",[obj]);
            break;
        case "candidate":

            //answerPc客户端接收到了offerPc端发送过来的ice信息
            if(obj.offer_ice){
                $(documentEl).trigger("offerPc_ice",[obj]);
            }

            //offerPc客户端接收到了answerPc端发送过来的ice信息
            if(obj.answer_ice){
                $(documentEl).trigger("answerPc_ice",[obj]);
            }

            break;
        default:

    }

    //client.close();
});

//开启客户端服务
client.bind(global.INTERCOM_CLIENT_PORT);

//发送offer
exports.sendOfferIntercomInfo = async function(ip,options){
    //先去发送answer  参数1.发送的数据  2.端口号   3.ip地址(暂时没有写)
    let offer = JSON.stringify(options);
    //将远程的ip保存为共享数据
    global.receivedIp = ip;
    //selfIp.getIPAdress()
    await client.send(offer,0,offer.length,global.INTERCOM_PORT,ip,function(err){
        if(err != null){
            console.log(err);
        }
    });
};

//向服务端发送offer_ice信息给answerPc端
/*exports.sendOffer_ice = async function(options){
    //再去发送candidate
    if(options.toJSON){
        delete  options.toJSON;
    }
    let offerCandidate = JSON.stringify(options);
    //global.receivedIp
    client.send(offerCandidate,0,offerCandidate.length,global.INTERCOM_CLIENT_PORT,global.receivedIp,function(err){
        if(err != null){
            console.log(err);
        }
    });
}*/

//向服务器发送answer_ice信息给offerPc端
exports.sendAnswer_ice = async function(options){
    //发送answer_ice的candidate消息
    if(options.toJSON){
        delete  options.toJSON;
    }
    let answerCandidate = JSON.stringify(options);
    await client.send(answerCandidate,0,answerCandidate.length,global.INTERCOM_CLIENT_PORT,global.localhostIp,function(err){
        if(err != null){
           console.log(err);
        }
    });

}

//接收jquery全局对象
exports.sendJqObj = function(Jobj){
    documentEl = Jobj;
}