let handleReceivedOffer = require("./handles/handleReceivedOffer");
let handleReceivedAnswer = require("./handles/HandlerReceivedAnswer");
let handleReceivedOfferICE = require("./handles/handleReceivedOfferICE");
let HandlerReceivedAnswerICE = require("./handles/HandlerReceivedAnswerICE");
let websocketServer = require('./socket/websocketServer');
let localhostUdpServer = require('./udp/localhostUdpServer');
let propleFaceSend = require('./udp/propleFaceSend');
let global = require("./global/globalFile");

$(document).ready(function(){
    let documentEl = $(this);
    //将jquery全局对象，保存为全局共享数据
    global.documentJq = documentEl;
    let vueObj = null;
    let localSocket = null;    //本地socket对象
    let removeSocket = null;  //远程socket对象
    let layerConfirm = null;    //layer询问弹框
    let layerOpen = null;  //layer等待应答弹框


    $(documentEl).on("sendMediaStreamObj",async function (e,vueApp,layer) {
        console.log("媒体流被添加了");

        //获取本地媒体流对象
        let localStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        });

        //获取远程媒体流对象
        let remoteStream = new MediaStream();


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

        //3.获取本地数据流
        const localStream = global.getData(global.KEY_LOCAL_MEDIA_STREAM);

        //通过getTracks()方法获取到媒体流设备轨道
        //再通过addTrack()将每一个轨道添加到peerConnection中

        localStream.getTracks().forEach(t => {
            console.log("在服务端添加媒体流轨道");
            console.log(t);
            try {
                offerPc.addTrack(t);
            }
            catch (err) {

            }
        });

        //获取到远程媒体流对象
        const remoteStream = global.getData(global.KEY_REMOTE_MEDIA_STREAM);

        //接收服务端端发送过来的媒体流数据
        offerPc.ontrack = e => {
            //将offerPc的媒体流通道，添加到远程媒体流中
            console.log("接收客户端发送过来的媒体流轨道");
            console.log(e.track);
            remoteStream.addTrack(e.track);
        };

        //5.创建一个offer
        let offer = await offerPc.createOffer();

        //6.更改与连接关联的本地描述
        await offerPc.setLocalDescription(new RTCSessionDescription(offer));

        //向客户端发送offer信息
        websocketServer.sendMsgToClient(JSON.stringify(offer));

        //当dataChannel通道打开后,监听网路信息事件,获取网路信息
        //当获取到offerPc端的网络信息之后，需要把信息传输给answerPc端
        offerPc.onicecandidate = e => {
            if(e.candidate){
                $(documentEl).trigger("offer_ice",[e.candidate]);
            }
        };


    });

    //客户端socket信息的发送和接收事件
    $(documentEl).on("clientSocketMsg",function(e,socket){
        //将本地weblocalSocket连接对象,赋值给全局
        localSocket = socket;

        //获取layer实例
        let layerObj = global.getData(global.LAYER_OBJ);

        //开启等待服务器端回应的加载层
        layerOpen = layer.open({
            content:"等待对方应答中...",
            btn: ['挂断'],
            yes:function(index){
                layer.close(layerOpen);
                sendStringText("hangup",function(){
                    localSocket.close();
                });
            },
            cancel:function(index){
                sendStringText("hangup",function () {
                    localSocket.close();
                });
            }
        });

        //当连接成功触发这个方法
        localSocket.addEventListener('open',function(event){

        });

        //当服务端有消息发送过来的时候触发方法
        localSocket.addEventListener('message',function (event) {
            //获取layer实例
            let layerObj = global.getData(global.LAYER_OBJ);

            //当前占线,提示客户端
            if(event.data == "isPhone"){
                //弹框提示客户端，当前设备正在通话中。
                layerObj.alert('当前设备正在通话中,请稍后再拨...',{
                    icon:0,
                    anim:6
                });
                //关闭连接
                localSocket.close();
                return false;
            }

            //收到服务端的挂断指令
            if(event.data == "hangup"){
                //关闭加载层
                if(layerOpen != null){
                    layerObj.close(layerOpen);
                }
                //关闭本地视频弹框
                $(documentEl).find(".intercom_model_bg").hide();
                //关闭连接
                localSocket.close();
                //弹框提示客户端，当前设备正在通话中。
                layerObj.msg('对方已挂断...',{
                    icon:5,
                    anim:6,
                    time:2000
                });
                //1.获取本地连接对象
                let answerPc = global.KEY_ANSWER_PEER_CONNECTION;

                if(answerPc != null){

                    document.getElementById('remote').srcObject = null;

                    //7.关闭本地连接对象
                    answerPc.close();

                    //8.关闭监听ice信息的方法
                    answerPc.onicecandidate = null;

                    //9.关闭监听添加媒体流函数
                    answerPc.onaddstream = null;

                    //10.重置初始化方法
                    $(documentEl).trigger("sendMediaStreamObj",[
                        vueObj,
                        global.getData(global.LAYER_OBJ)
                    ])

                }

                return false;
            }

            //当前服务端正在待机状态,可以通信
            if(event.data == "connect"){
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

            //服务器端接收了可视对讲请求，并返回了answer
            if(event.data == "answer"){
                if(layerOpen != null){
                    layerObj.close(layerOpen);
                }
                //开打视频通话弹框
                $(documentEl).find(".intercom_model_bg").show();
                //显示客户端挂断按钮
                $(documentEl).find("#localClose").show();
                //向服务端发现设备准备就绪指令 clientok
                sendStringText("clientok");

                return false;
            }

            //接收服务端的设备名称和摄像头是否存在的状态
            if(event.data.indexOf(",0") != -1 || event.data.indexOf(",1") != -1){
                let index = event.data.indexOf(",");
                //4.如果没有摄像头,就提示没有摄像头
                if(event.data.substring(index+1) == "0"){
                    //获取远程视频标签,并添加封面图片
                    $(documentEl).find(".video2").attr("poster","./public/img/tishi.png");
                }else{
                    //移除封面图片
                    $(documentEl).find(".video2").removeAttr("poster");
                }

                return false;
            }

            //调用接收服务器消息的公共函数
            receiveServerMsg(JSON.parse(event.data));

        });

        //当断开连接触发方法
        localSocket.addEventListener('close',function () {
            if(layerOpen != null){
                layerObj.close(layerOpen);
            }
            console.log("weblocalSocket连接已经关闭");
        });

    });

    //服务端处理报警信息
    $(documentEl).on("policeServerMsg",function(e,obj){
        //获取layer实例
        let layerObj = global.getData(global.LAYER_OBJ);
        //将报警信息添加到全局报警数组中
        global.CALL_POLICE_LIST.push(obj);
        //展示报警弹框
        layerObj.alert("门牌号: "+obj.alias_name+"</br>"+
                       "报警内容："+obj.police_msg+"</br>"+
                       "报警时间："+obj.now_time);
        //打开报警音乐
        let audioEl = document.getElementById("police-player");
        audioEl.play();
        //6秒之后关闭报警音乐
        let t = setTimeout(function(){
            clearTimeout(t);
            audioEl.pause();
            audioEl.load();
        },6000);
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
    function sendStringText(msg,callback){
        let t = setInterval(function(){
            //offerPc发送消息的公共方法
            let status = sendToServerStringMsg(msg);
            if(status){
                window.clearInterval(t);
                if(callback){
                    callback("true");
                }
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

    //客户端向服务端发送ice信息
    $(documentEl).on("client_send_ice",function (e,data) {
        allSendMsg(data);
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

        //服务端向客服端发送ice信息
        websocketServer.sendMsgToClient(JSON.stringify(obj));
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


    //服务端收到客户端设备信息,打开询问弹框
    $(documentEl).on("openConfirmBox",function (e,options) {

        //1. 获取layer实例
        let layerObj = global.getData(global.LAYER_OBJ);
        //2. 打开来电铃声
        let audioEl = document.getElementById("audio-player");
        audioEl.play();

        //3.询问是否接收可视对讲请求
        layerConfirm = layerObj.confirm(options.deviceName+'正在请求与您对讲...',{
            btn: ['接收','拒绝'], //按钮
            title:options.deviceName+"的请求!",
            //点击接受可视对讲请求
            btn1:function(index){
                //关闭弹框,关闭音乐
                musicClose(layerObj,index,audioEl);
                //获取vue的实例对象
                vueObj.showComponentValue = 3;
                vueObj.$forceUpdate();
                //打开打视频通话弹框
                $(documentEl).find(".intercom_model_bg").show();
                //显示服务端挂断按钮
                $(documentEl).find("#remoteClose").show();
                //向客户端发送接收了可视对讲的指令  answer
                websocketServer.sendMsgToClient("answer");

            },
            //点击拒绝可视对讲请求
            btn2:function(index){
                //关闭弹框,关闭音乐
                musicClose(layerObj,index,audioEl);
                //服务器向客户端发送挂断指令 hangup
                websocketServer.sendMsgToClient("hangup");
            },
            //点击拒绝可视对讲请求
            cancel:function(index){
                //关闭弹框,关闭音乐
                musicClose(layerObj,index,audioEl);
                //服务器向客户端发送挂断指令 hangup
                websocketServer.sendMsgToClient("hangup");
            }
        });

        //4.如果没有摄像头,就提示没有摄像头
        if(options.videoStatus == "0"){
            //获取远程视频标签,并添加封面图片
            $(documentEl).find(".video2").attr("poster","./public/img/tishi.png");
        }else{
            //移除封面图片
            $(documentEl).find(".video2").removeAttr("poster");
        }
    });


    /**
     * 关闭音乐的公共方法
     * @param layers  layer对讲
     * @param popupObj  弹框对象
     * @param audioEl   audio元素
     */
    function musicClose(layers,popupObj,audioEl){
        layers.close(popupObj);
        audioEl.pause();
        audioEl.load();
        if(layerConfirm != null){
            layers.close(layerConfirm);
            layerConfirm = null;
        }
    }

    //关闭弹框
    $(documentEl).on("closeServerConnection",function(e){
        let layerObj = global.getData(global.LAYER_OBJ);
        let audioEl = document.getElementById("audio-player");
        if(layerConfirm != null){
            layerObj.close(layerConfirm);
            if(audioEl){
                audioEl.pause();
                audioEl.load();
            }
            layerConfirm = null;
            return false;
        }
    });

    //服务端挂断可视对讲时触发
    $(documentEl).on("serverPcCloseVideoStream",function (e) {

        //1.获取本地连接对象
        let offerPc = global.KEY_OFFER_PEER_CONNECTION;

        //2.关闭本地弹框
        $(documentEl).find(".intercom_model_bg").hide();

        //3.关闭本地按钮
        $(documentEl).find("#remoteClose").hide();

        //4.提示关闭弹框
        global.getData(global.LAYER_OBJ).msg("连接已断开...",{time:2000});

        //5.服务器端断开连接
        websocketServer.sendMsgToClient("hangup");

        //6.将本地远程remote video标签设置为null
        document.getElementById('remote').srcObject = null;

        //7.关闭本地连接对象
        offerPc.close();

        //8.关闭监听ice信息的方法
        offerPc.onicecandidate = null;

        //9.关闭监听添加媒体流函数
        offerPc.onaddstream = null;

        //10.重置初始化方法
        $(documentEl).trigger("sendMediaStreamObj",[
            vueObj,
            global.getData(global.LAYER_OBJ)
        ])
        

    });


    //客户端挂断可视对讲时触发
    $(documentEl).on("clientPcCloseVideoStream",function(e){
        //1.获取本地连接对象
        let answerPc = global.KEY_ANSWER_PEER_CONNECTION;

        //3.关闭本地弹框
        $(documentEl).find(".intercom_model_bg").hide();

        //4.关闭本地按钮
        $(documentEl).find("#localClose").hide();

        //5.提示关闭弹框
        global.getData(global.LAYER_OBJ).msg("连接已断开...",{time:2000});

        //6.向服务端发送挂断指令
        sendStringText("hangup",function(){
            //断开与服务器的链接
            localSocket.close();
        });

        //7.将本地远程remote video标签设置为null
        document.getElementById('remote').srcObject = null;

        //8.关闭本地连接对象
        answerPc.close();

        //9.关闭监听ice信息的方法
        answerPc.onicecandidate = null;

        //10.关闭监听添加媒体流函数
        answerPc.onaddstream = null;

        //11.重置初始化方法
        $(documentEl).trigger("sendMediaStreamObj",[
            vueObj,
            global.getData(global.LAYER_OBJ)
        ]);

    });

    //发送二维码，预约门禁
    $(documentEl).on("sendQRcodeNumber",function(e,senderName,code){
        localhostUdpServer.sendQrcode(senderName,code,function(){
            //获取layer实例
            let layerObj = global.getData(global.LAYER_OBJ);
            layerObj.msg("通知设备接收二维码成功！",{time:2000, icon:6, shift:5});
        });
    })

    //发送密码，预约门禁
    $(documentEl).on("sendPasswordNumber",function(e,senderName,code){
        localhostUdpServer.sendPassword(senderName,code,function(){
            //获取layer实例
            let layerObj = global.getData(global.LAYER_OBJ);
            layerObj.msg("通知设备接收密码成功！",{time:1000, icon:6, shift:5});
        });
    });

    //发送人脸识别图片数据
    $(documentEl).on("sendPeopleFaceData",function(e,arrayBuffer){
        propleFaceSend.sendPeopleSendImg(arrayBuffer,function(){
            //获取layer实例
            let layerObj = global.getData(global.LAYER_OBJ);
            layerObj.msg("通知设备接收人脸数据成功！",{time:3000, icon:6, shift:5});
        });
    });

});
