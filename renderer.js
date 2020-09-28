let intercom_intercom = require("./udp/intercomClient");
let handleReceivedOffer = require("./handles/handleReceivedOffer");
let handleReceivedAnswer = require("./handles/HandlerReceivedAnswer");
let handleReceivedOfferICE = require("./handles/handleReceivedOfferICE");
let HandlerReceivedAnswerICE = require("./handles/HandlerReceivedAnswerICE");
let global = require("./global/globalFile");

$(document).ready(function(){
    let documentEl = $(this);
    //将jquery全局对象，保存为全局共享数据
    global.documentJq = documentEl;
    let vueObj = null;

    //将jquery全局事件对象传给客户端
    intercom_intercom.sendJqObj(documentEl);

    $(documentEl).on("sendMediaStreamObj",function (e,localStream,remoteStream,vueApp,layer) {
        console.log("媒体流被添加了");
        global.setData(global.KEY_LOCAL_MEDIA_STREAM,localStream);
        global.setData(global.KEY_REMOTE_MEDIA_STREAM,remoteStream);

        //将vue实例保存为全局变量
        vueObj = vueApp;

        //将layer实例，保存为全局共享数据
        global.setData(global.LAYER_OBJ,layer);

        //1.返回一个新建的 RTCPeerConnection实例，它代表了本地机器与远端机器的一条连接。
        let peerConnection = new RTCPeerConnection();

        //2.将peerConnection保存为全局共享数据
        global.setData(global.KEY_OFFER_PEER_CONNECTION,peerConnection);

        //创建一个数据通道，用于传输数据
        let dataChannel = peerConnection.createDataChannel("MessageChannel");

        //将dataChannel设置为全局共享数据
        global.setData(global.KEY_DATACHANNEL,dataChannel);

        //4.在本地预览本地媒体流对象(localStream)
        document.getElementById('local').srcObject = localStream;

        //4.将远程媒体流对象(localStream)，在本地预览
        //document.getElementById('remote').srcObject = remoteStream;

    });

    //发送offer事件
    $(documentEl).on("sendAnswer","#house_list_intercom>li",async function(e,ip,ws){

        let peerConnection = global.getData(global.KEY_OFFER_PEER_CONNECTION);

        //将远程的ip保存为共享数据
        /*global.receivedIp = ip;*/

        //当dataChannel通道打开后,监听网路信息事件,获取网路信息
        //当获取到offerPc端的网络信息之后，需要把信息传输给answerPc端
        /*peerConnection.onicecandidate = e => {
            if(e.candidate){
                $(documentEl).trigger("offer_ice",[e.candidate])
            }
        };*/

        //获取到远程媒体流对象
        //const remoteStream = global.getData(global.KEY_REMOTE_MEDIA_STREAM);

        //接收answerPc端发送过来的媒体流数据
        /*peerConnection.ontrack = e => {
            console.log(e);
            //将offerPc的媒体流通道，添加到远程媒体流中
            remoteStream.addTrack(e.track);
        };*/

        //给dataChannel监听事件,在dataChannel打开数据通道之后，就会被触发
        //主要用来向answerPc端，发送消息
        /*dataChannel.onopen = function(e){
            dataChannel.send("hello RTC");
        };*/

        //3.获取本地数据流
        //const localStream = global.getData(global.KEY_LOCAL_MEDIA_STREAM);

        //通过getTracks()方法获取到媒体流设备轨道
        //再通过addTrack()将每一个轨道添加到peerConnection中
        /*localStream.getTracks().forEach(t => {
            peerConnection.addTrack(t);
        });*/

        //5.创建一个offer
        let offer = await peerConnection.createOffer();

        //6.更改与连接关联的本地描述
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        offer.type = "answer";

        //7.发送offer
        //await intercom_intercom.sendOfferIntercomInfo(ip,offer,documentEl);

        //将本地weblocalSocket连接对象,赋值给全局
        global.localSocket = ws;

        //当连接成功触发这个方法
        global.localSocket.addEventListener('open',function(event){
            global.localSocket.send(JSON.stringify(offer));
        });

        //当服务端有消息发送过来的时候触发方法
        global.localSocket.addEventListener('message',function (event) {
            console.log('收到服务器的消息：',event.data);
        });

        //当断开连接触发方法
        global.localSocket.addEventListener('message',function () {
            console.log("weblocalSocket连接已经关闭");
        });

    });

    //发送answer事件
    $(documentEl).on("sendAnswerInfo",async function(e,data){

        //发送answer信息：data为answer信息
        //remoteSocket.send(JSON.stringify(data));

        //设置服务器地址
        let socket = await new WebSocket('ws://'+global.OFFERPC_IP+':58888');

        global.removeSocket = socket;

        //当连接成功触发这个方法
        global.removeSocket.addEventListener('open',function(event){
            global.removeSocket.send(JSON.stringify(data));
        });

        //当服务端有消息发送过来的时候触发方法
        global.removeSocket.addEventListener('message',function (event) {
            console.log('收到服务器的消息：',event.data);
        });

        //当断开连接触发方法
        global.removeSocket.addEventListener('message',function () {
            console.log("weblocalSocket连接已经关闭");
        });

    });

    //answerPc端收到offerPc端的信息了
    $(documentEl).on("receivedOffer",function(e,data){
        handleReceivedOffer.receivedOffer(data,documentEl);
    });

    //offer端接收answer信息
    $(documentEl).on("localAnswer",function(e,data){
        //本地接收answer信息
        handleReceivedAnswer.receivedAnswer(data,documentEl);
    });

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

        intercom_intercom.sendOffer_ice(obj);

    });

    //answerPc端接收到了offerPc端的ice消息
    $(documentEl).on("offerPc_ice",function(e,data){
        //在answerPc端处理ice信息
        console.log(data);
        handleReceivedOfferICE.receivedOfferICE(data,documentEl);
    });

    //answerPc端发送answer_ice信息给offerPc端
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
        intercom_intercom.sendAnswer_ice(obj)

    })

    //offerPc客户端接收到了answerPc端发送过来的ice信息
    $(documentEl).on("answerPc_ice",function(e,data){
        //offerPc端处理,由answerPc端发送过来的ice信息
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

        //当answerPc接受之后，需要通过udp服务告诉offerPc端我接受了视频
        //待定逻辑，还未编写
    });

    //answerPc端挂断可视对讲时触发
    $(documentEl).on("answerPcCloseVideoStream","#remoteClose",function (e) {
        //1.获取本地连接对象
        let answerPc = global.getData(global.KEY_ANSWER_PEER_CONNECTION);

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
        let offerPc = global.getData(global.KEY_OFFER_PEER_CONNECTION);

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
