let global = require("../global/globalFile");

module.exports.receivedOffer = async function(data,documentEl,ip){

    //创建answerPc连接对象
    let answerPc = new RTCPeerConnection();

    //将answerPc保存为全局共享数据
    global.setData(global.KEY_ANSWER_PEER_CONNECTION,answerPc);

    //将数据通道打开之后，监听网路信息的事件
    answerPc.onicecandidate = e => {
        console.log("answer端的数据监听器，收到数据");
        console.log(e);
        //获取offer_ice信息，并通过网络服务端转发给offerPc
        if(e.candidate){
            $(documentEl).trigger("answer_ice",[e.candidate]);
        }
    }

    //answerPc添加一个打开的dataChannel的事件监听
    //用于接收offerPc端通过dataChannel通道发送过来的数据
    answerPc.ondatachannel = function(e){
        let dataChannel = e.channel;
        dataChannel.onmessage = ev => {
            console.log(ev);
        }
    }

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
    $(documentEl).trigger("sendAnswerInfo",[answer,ip]);



};