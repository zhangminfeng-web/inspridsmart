const global = require("../global/globalFile");

module.exports.receivedAnswerICE = async function(data,documentEl){

    //获取offerPc连接对象
    let answerPc = global.KEY_ANSWER_PEER_CONNECTION;

    //给offerPc添加来自answerPc端的answer_ice消息
    if(answerPc){
        if(!data.sdpMLineIndex){
            data.sdpMLineIndex = 0;
            data.sdpMid = "0";
        }
        await answerPc.addIceCandidate(new RTCIceCandidate(data));
    }

    console.log("客户端交换ice信息完成了");
};