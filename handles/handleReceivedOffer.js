let global = require("../global/globalFile");

module.exports.receivedOffer = async function(data,documentEl,ip){

    //创建answerPc连接对象
    let answerPc = new RTCPeerConnection();

    //将answerPc保存为全局共享数据
    global.setData(global.KEY_ANSWER_PEER_CONNECTION,answerPc);

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