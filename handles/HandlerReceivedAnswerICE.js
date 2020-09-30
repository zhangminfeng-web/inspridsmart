const global = require("../global/globalFile");

module.exports.receivedAnswerICE = async function(data,documentEl){

    //获取offerPc连接对象
    let offerPc = global.KEY_OFFER_PEER_CONNECTION;

    //给offerPc添加来自answerPc端的answer_ice消息
    if(offerPc){
        if(!data.sdpMLineIndex){
            data.sdpMLineIndex = 0;
            data.sdpMid = "0";
        }
        await offerPc.addIceCandidate(new RTCIceCandidate(data));
    }

    console.log("offerPc端交换ice信息完成了");
};