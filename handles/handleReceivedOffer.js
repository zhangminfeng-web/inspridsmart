let global = require("../global/globalFile");
let websocketServer = require("../socket/websocketServer");

module.exports.receivedOffer = async function(data,documentEl){

    //创建answerPc连接对象
    let answerPc = new RTCPeerConnection();

    //将answerPc保存为全局共享数据
    global.KEY_ANSWER_PEER_CONNECTION = answerPc;

    //获取远程媒体流对象
    let remoteStream = global.getData(global.KEY_REMOTE_MEDIA_STREAM);

    //接收客户端发送过来的媒体流数据
    answerPc.ontrack = e => {
        remoteStream.addTrack(e.track);
    };

    //获取本地视频流
    let localStream = global.getData(global.KEY_LOCAL_MEDIA_STREAM);

    //通过getTracks()方法获取到媒体流设备轨道
    //再通过addTrack()将每一个轨道添加到answerPc中
    localStream.getTracks().forEach(t => {
        console.log("向服务端媒体流添加视频轨道");
        console.log(t);
        answerPc.addTrack(t);
    });


    //监听网路信息事件,获取网路信息
    //当获取到answerPc端的网络信息之后，需要把信息传输给offerPc端
    answerPc.onicecandidate = e => {
        if(e.candidate){
            sendIceToOfferPc(e.candidate);
        }
    }

    //客户端向服务端发送ice信息
    function sendIceToOfferPc(data){
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
        $(documentEl).trigger("client_send_ice",[obj]);
    }

    //设置远端与连接关联的描述信息
    await answerPc.setRemoteDescription(new RTCSessionDescription(data));

    //创建answer对象
    let answer = await answerPc.createAnswer();

    //设置本地与连接关联的描述信息
    await answerPc.setLocalDescription(new RTCSessionDescription(answer));

    //通过事件派发机制，发送answer信息
    $(documentEl).trigger("sendAnswerMsgClient",[answer]);

};