let intercom_intercom = require("./udp/intercomClient");
let handleReceivedOffer = require("./handles/handleReceivedOffer");
let handleReceivedAnswer = require("./handles/HandlerReceivedAnswer");
let handleReceivedOfferICE = require("./handles/handleReceivedOfferICE");
let HandlerReceivedAnswerICE = require("./handles/HandlerReceivedAnswerICE");
let global = require("./global/globalFile");

$(document).ready(function(){
    let documentEl = $(this);

    //发送offer事件
    $(documentEl).on("sendAnswer","#house_list_intercom>li",async function(e,ip){
        console.log("发送answer");
        //1.返回一个新建的 RTCPeerConnection实例，它代表了本地机器与远端机器的一条连接。
        let peerConnection = new RTCPeerConnection();

        //2.将peerConnection保存为全局共享数据
        global.setData(global.KEY_OFFER_PEER_CONNECTION,peerConnection);

        //将数据通道打开之后，监听网路信息的事件
        peerConnection.onicecandidate = e => {
            if(e.candidate){
                $(documentEl).trigger("offer_ice",[e.candidate])
            }
        }

        //打开数据通道，用于传输数据
        let dataChannel = peerConnection.createDataChannel("MessageChannel");

        //监听dataChannel数据打开事件
        dataChannel.onopen = function(e){
            dataChannel.send("hello RTC");
        };

        //将dataChannel设置为全局共享数据
        global.setData(global.KEY_DATACHANNEL,dataChannel);

        //3.获取本地数据流
        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            //false:true
        });

        //4.将本地流信息展示在video中
        document.getElementById('local').srcObject = stream;

        //5.创建一个offer
        let offer = await peerConnection.createOffer();

        //6.更改与连接关联的本地描述
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        offer.type = "answer";

        //7.发送answer
        intercom_intercom.sendOfferIntercomInfo(ip,offer,function(data){
            if(data.type == "answer"){
                let ip = data.ip;
                delete data.ip;
                handleReceivedOffer.receivedOffer(data,documentEl,ip);
            }
        });
    });

    //发送answer事件
    $(documentEl).on("sendAnswerInfo",function(e,data,ip){
        //发送answer信息：data为answer信息
        intercom_intercom.sendAnswerIntercomInfo(ip,data,function(data){
            if(data.type == "offer") {
                let ip = data.ip;
                delete data.ip;
                //本地接收answer信息
                handleReceivedAnswer.receivedAnswer(data,documentEl,ip);
            }
        });
    })

    //发送offer_ice消息
    $(documentEl).on("offer_ice",function(e,data){
        let obj = {};
        for(let key in data){
            if(key == "type"){
                obj[key] = "candidate";
                obj["offer_ice"] = "offer_ice";
            }else{
                obj[key] = data[key];
            }
        }

        //向服务器发送offer_ice信息
        intercom_intercom.sendOffer_ice(obj.address,obj,function(data){
            //answer端接受到服务器返回的offer_ice
            //answer端处理offerICE
            handleReceivedOfferICE.receivedOfferICE(data,documentEl,data.address);
        })

    });

    //发送answer_ice
    $(documentEl).on("answer_ice",function(e,data){
        let obj = {};
        for(let key in data){
            if(key == "type"){
                obj[key] = "candidate";
                obj["answer_ice"] = "answer_ice";
            }else{
                obj[key] = data[key];
            }
        }

        //向服务器发送answer_ice信息
        intercom_intercom.sendAnswer_ice(obj.address,obj,function(data){
            //offerPc端接受到服务器返回的answer_ice
            //offerPc端处理answer_ice消息
            HandlerReceivedAnswerICE.receivedAnswerICE(data,documentEl,data.address);
        })


    })


});
