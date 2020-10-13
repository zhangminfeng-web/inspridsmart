let handleReceivedOffer = require("./handles/handleReceivedOffer");
let handleReceivedAnswer = require("./handles/HandlerReceivedAnswer");
let handleReceivedOfferICE = require("./handles/handleReceivedOfferICE");
let HandlerReceivedAnswerICE = require("./handles/HandlerReceivedAnswerICE");
let websocketServer = require('./socket/websocketServer');
let global = require("./global/globalFile");

$(document).ready(function(){
    let documentEl = $(this);
    //将jquery全局对象，保存为全局共享数据
    global.documentJq = documentEl;
    let vueObj = null;
    let localSocket = null;    //本地socket对象
    let removeSocket = null;  //远程socket对象


    $(documentEl).on("sendMediaStreamObj",async function (e,localStream,remoteStream,vueApp,layer) {
        console.log("媒体流被添加了");

        //在本地预览本地媒体流对象(localStream)
        document.getElementById('local').srcObject = localStream;

        //保存本地媒体流
        global.setData(global.KEY_LOCAL_MEDIA_STREAM,localStream);

        //将远程媒体流对象(localStream)，在本地预览
        document.getElementById('remote').srcObject = remoteStream;

        //保存远程媒体流
        global.setData(global.KEY_REMOTE_MEDIA_STREAM,remoteStream);

        //将vue实例保存为全局变量
        vueObj = vueApp;

        //将layer实例，保存为全局共享数据
        global.setData(global.LAYER_OBJ,layer);

        //1.返回一个新建的 RTCPeerConnection实例，它代表了本地机器与远端机器的一条连接。
        let peerConnection = new RTCPeerConnection();

        //2.将peerConnection保存为全局共享数据
        global.KEY_OFFER_PEER_CONNECTION =peerConnection;

        var dataChannelOptions = {
            ordered: false, // do not guarantee order
            maxRetransmitTime: 3000, // in milliseconds
        };

        //创建一个数据通道，用于传输数据
        let dataChannel = peerConnection.createDataChannel("MessageChannel",dataChannelOptions);


        //将dataChannel设置为全局共享数据
        global.setData(global.KEY_DATACHANNEL,dataChannel);

    });

    //服务器端向客户端发送offer信息
    $(documentEl).on("sendAnswer",async function(e){

        let offerPc = global.KEY_OFFER_PEER_CONNECTION;

        //当dataChannel通道打开后,监听网路信息事件,获取网路信息
        //当获取到offerPc端的网络信息之后，需要把信息传输给answerPc端
        offerPc.onicecandidate = e => {
            if(e.candidate){
                websocketServer.sendMsgToClient(JSON.stringify(e.candidate));
            }
        };

        //3.获取本地数据流
        const localStream = global.getData(global.KEY_LOCAL_MEDIA_STREAM);

        //通过getTracks()方法获取到媒体流设备轨道
        //再通过addTrack()将每一个轨道添加到peerConnection中
        localStream.getTracks().forEach(t => {
            offerPc.addTrack(t);
        });


        //获取到远程媒体流对象
        const remoteStream = global.getData(global.KEY_REMOTE_MEDIA_STREAM);

        //接收服务端端发送过来的媒体流数据
        offerPc.ontrack = e => {
            //将offerPc的媒体流通道，添加到远程媒体流中
            console.log("接收服务端端发送过来的媒体流数据");
            console.log(e.track);
            remoteStream.addTrack(e.track);
        };

        //5.创建一个offer
        let offer = await offerPc.createOffer();

        //6.更改与连接关联的本地描述
        await offerPc.setLocalDescription(new RTCSessionDescription(offer));

        //向客户端发送offer信息
        websocketServer.sendMsgToClient(JSON.stringify(offer));

        //answerPc端接收到offer信息，就打开本地弹框
        $(documentEl).trigger("openPopup");


    });

    //客户端socket信息的发送和接收事件
    $(documentEl).on("clientSocketMsg",function(e,socket){
        //将本地weblocalSocket连接对象,赋值给全局
        localSocket = socket;

        //当连接成功触发这个方法
        localSocket.addEventListener('open',function(event){

        });

        //当服务端有消息发送过来的时候触发方法
        localSocket.addEventListener('message',function (event) {
            if(event.data == "isPhone"){  //当前占线,提示客户端
                //获取layer实例
                let layerObj = global.getData(global.LAYER_OBJ);
                //弹框提示客户端，当前设备正在通话中。
                layerObj.alert('当前设备正在通话中,请稍后再拨...',{
                    icon:0,
                    anim:6
                });
                //关闭连接
                localSocket.close();
                return false;
            }

            if(event.data == "connect"){  //当前服务端正在待机状态,可以通信
                //1.遍历本地数据流，查看有无摄像头。
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    //1. 遍历当前设备信息数组,判断有没有摄像头设备
                    let flag = devices.some(device => {
                        //判断有没有摄像头设备
                        return device.kind == "videoinput";
                    });
                    //2. flag返回值为true表示有摄像头1，false没有摄像头0
                    let index = flag?"1":"0";
                    //3.向服务器发送设备的反馈信息
                    sendStringText("中心管理机设备,"+index);
                });
                return false;
            }


            //调用接收服务器消息的公共函数
            receiveServerMsg(JSON.parse(event.data));


        });

        //当断开连接触发方法
        localSocket.addEventListener('close',function () {
            console.log("weblocalSocket连接已经关闭");
        });
    });

    function receiveServerMsg(obj){
        switch(obj.type) {
            case "offer":
                //客户端端处理服务端发送来的offer消息
                $(global.documentJq).trigger("receivedOffer",[obj]);
                break;
            case "candidate":
                //客户端处理服务端发送来的ice消息
                $(documentEl).trigger("offer_candidate",[obj]);
                break;
            default:
        }
    }

    //客户端发送消息的公共方法
    function answerSendMsg(msg){
        //向answerPc端发送消息
        if(localSocket.readyState == 1){
            localSocket.send(msg);
            return true;
        }else{
            return false;
        }
    }

    //公共发送消息的函数
    function allSendMsg(msg){
        let t = setInterval(function(){
            //offerPc发送消息的公共方法
            let status = answerSendMsg(JSON.stringify(msg));
            if(status){
                window.clearInterval(t);
            }
        },100);
    }



    //向服务器发送纯字符串的消息
    function sendToServerStringMsg(msg){
        if(localSocket.readyState == 1){
            localSocket.send(msg);
            return true;
        }else{
            return false;
        }
    }

    //发送纯字符串的公共函数
    function sendStringText(msg){
        let t = setInterval(function(){
            //offerPc发送消息的公共方法
            let status = sendToServerStringMsg(msg);
            if(status){
                window.clearInterval(t);
            }
        },100);
    }

    //客户端发送answer信息给服务端
    $(documentEl).on("sendAnswerMsgClient",function(e,data){
        console.log("客户端即将发送answer信息给服务端");
        allSendMsg(data);
    });

    //answerPc端收到offerPc端的信息了
    $(documentEl).on("receivedOffer",function(e,data){
        handleReceivedOffer.receivedOffer(data,documentEl);
    });

    //服务端处理客户端发送来的answer信息
    $(documentEl).on("serverAnswer",function(e,data){
        //服务端处理接收answer信息
        handleReceivedAnswer.receivedAnswer(data,documentEl);
    });

    //客户端处理服务端发送来的ice消息
    $(documentEl).on("offer_ice",function(e,data){
        let obj = {};
        for(let key in data){
            if(key == "type"){
                obj[key] = "candidate";
            }else{
                obj[key] = data[key];
            }
        }
        if(obj.toJSON){
            delete  obj.toJSON;
        }

        //offerPc端向answer服务端发送ice信息
        allSendMsg(obj);
    });

    //服务端处理客户端发送的ice信息
    $(documentEl).on("answer_candidate",function(e,data){
        //获取answer链接对象
        let offerPc = global.KEY_OFFER_PEER_CONNECTION;

        //处理客户端发送来的candidate消息
        handleReceivedOfferICE.receivedOfferICE(data,documentEl,offerPc);
    });

    //answerPc端发送answer_ice信息给offerPc端
    $(documentEl).on("answer_ice",function(e,data){
        let obj = {};
        for(let key in data){
            if(key == "type"){
                obj[key] = "candidate";
            }else{
                obj[key] = data[key];
            }
        }

        if(obj.toJSON){
            delete  obj.toJSON;
        }

        //answerPc端向offerPc服务端发送ice信息
        allSendMsg(obj);
    });

    //客户端处理服务端发送来的ice消息
    $(documentEl).on("offer_candidate",function(e,data){
        //处理服务端发送来的candidate消息
        HandlerReceivedAnswerICE.receivedAnswerICE(data,documentEl);
    });

    //answerPc端收到消息的时候，开打弹框
    $(documentEl).on("openPopup",function(e){
        //获取vue的实例对象
        vueObj.showComponentValue = 3;
        vueObj.$forceUpdate();
        $(".intercom_model_bg").show();
        $("#remoteAccept").show();
        $("#remoteClose").show();
    });

    //answerPc点击接收按钮，同意接收视频流消息
    $(documentEl).on("receviedVideoMsg","#remoteAccept",function(e){
        //获取远程视频流对象
        let remoteStream = global.getData(global.KEY_REMOTE_MEDIA_STREAM);
        //将远程视频流添加到video标签中
        document.getElementById('remote').srcObject = remoteStream;

        //关闭接受按钮
        $(this).hide();

        //当answerPc接受之后，需要通过服务器发送消息告诉offerPc端我接受了视频
        //待定逻辑，还未编写

    });

    //服务端收到客户端设备信息,打开询问弹框
    $(documentEl).on("openConfirmBox",function (e,options) {

        //1. 获取layer实例
        let layerObj = global.getData(global.LAYER_OBJ);
        //2. 打开来电铃声
        let audioEl = document.getElementById("audio-player");
        audioEl.play();

        //3.询问是否接收可视对讲请求
        layerObj.confirm(options.deviceName+'正在请求与您对讲...',{
            btn: ['接收','拒绝'] //按钮
        },function(index){
            console.log("接收了视频对讲请求");
            layerObj.close(index);
            audioEl.pause();
            audioEl.load();
        },function(){
            console.log("拒绝了视频对讲请求");
            layerObj.close(index);
            audioEl.pause();
            audioEl.load();
        });

    });

    //answerPc端挂断可视对讲时触发
    $(documentEl).on("answerPcCloseVideoStream","#remoteClose",function (e) {
        //1.获取本地连接对象
        let answerPc = global.KEY_ANSWER_PEER_CONNECTION;

        //2.发送挂断信息给offerPc端


        //3.将本地远程remote video标签设置为null
        document.getElementById('remote').srcObject = null;

        //4.关闭本地连接对象
        //answerPc.close();

        //关闭远程按钮
        $("#remoteAccept").hide();
        $("#remoteClose").hide();

        //5.关闭监听ice信息的方法
        //answerPc.onicecandidate = null;

        //6.关闭监听添加媒体流函数
        answerPc.onaddstream = null;

        //7.关闭本地弹框
        $(".intercom_model_bg").hide();

        //关闭本地按钮
        $("#localClose").hide();

        //8.提示关闭弹框
        global.getData(global.LAYER_OBJ).msg("连接已断开...",{time:2000});

        //9.重置初始化方法
        $(documentEl).trigger("sendMediaStreamObj",[
            global.getData(global.KEY_LOCAL_MEDIA_STREAM),
            global.getData(global.KEY_REMOTE_MEDIA_STREAM),
            vueObj,
            global.getData(global.LAYER_OBJ)
        ])

    });


    //offerPc端挂断可视对讲时触发
    $(documentEl).on("offerPcCloseVideoStream","#localClose",function(e){

        //1.获取本地连接对象
        let offerPc = global.KEY_OFFER_PEER_CONNECTION;

        //2.发送挂断信息给answerPc端


        //3.将本地远程remote video标签设置为null
        document.getElementById('local').srcObject = null;

        //4.关闭本地连接对象
        //offerPc.close();

        //5.关闭监听ice信息的方法
        //offerPc.onicecandidate = null;

        //6.关闭监听添加媒体流函数
        offerPc.onaddstream = null;

        //7.关闭本地弹框
        $(".intercom_model_bg").hide();

        //8.提示关闭弹框
        global.getData(global.LAYER_OBJ).msg("连接已断开...",{time:2000});

        //9.重置初始化方法
        $(documentEl).trigger("sendMediaStreamObj",[
            global.getData(global.KEY_LOCAL_MEDIA_STREAM),
            global.getData(global.KEY_REMOTE_MEDIA_STREAM),
            vueObj,
            global.getData(global.LAYER_OBJ)
        ])
    });

});
