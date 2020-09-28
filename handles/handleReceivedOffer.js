let global = require("../global/globalFile");

module.exports.receivedOffer = async function(data,documentEl){

    //创建answerPc连接对象
    let answerPc = new RTCPeerConnection();

    //answerPc端接收到offer信息，就打开本地弹框
    $(documentEl).trigger("openPopup");

    //获取本地视频流
    //let localStream = global.getData(global.KEY_LOCAL_MEDIA_STREAM);

    //通过getTracks()方法获取到媒体流设备轨道
    //再通过addTrack()将每一个轨道添加到answerPc中
    /*localStream.getTracks().forEach(t => {
        answerPc.addTrack(t);
    });*/

    //将answerPc保存为全局共享数据
    global.setData(global.KEY_ANSWER_PEER_CONNECTION,answerPc);


    //获取远程媒体流对象
    //let remoteStream = global.getData(global.KEY_REMOTE_MEDIA_STREAM);

    //接收offerPc端发送过来的媒体流数据
    /*answerPc.ontrack = e => {
        //将offerPc的媒体流通道，添加到远程媒体流中
        remoteStream.addTrack(e.track);
    };*/


    //监听网路信息事件,获取网路信息
    //当获取到answerPc端的网络信息之后，需要把信息传输给offerPc端
    /*answerPc.onicecandidate = e => {
        if(e.candidate){
            $(documentEl).trigger("answer_ice",[e.candidate]);
        }
    }*/

    //当offerPc端通过数据通道(datachannel)发送过来信息时,在answerPc端用来接收消息的方法
    /*answerPc.ondatachannel = function(e){
        let dataChannel = e.channel;
        dataChannel.onmessage = ev => {
            console.log("answerPc端接收到了信息");
            console.log(ev);
        }
    }*/

    //将type还原成offer
    data.type = "offer";

    //设置远端与连接关联的描述信息
    await answerPc.setRemoteDescription(new RTCSessionDescription(data));

    //创建answer对象
    let answer = await answerPc.createAnswer();

    //设置本地与连接关联的描述信息
     await answerPc.setLocalDescription(new RTCSessionDescription(answer));

    //将answer的type属性修改成offer
    answer.type = "offer";

    //通过事件派发机制，发送answer信息
    $(documentEl).trigger("sendAnswerInfo",[answer]);



};