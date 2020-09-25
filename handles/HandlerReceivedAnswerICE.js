const global = require("../global/globalFile");

module.exports.receivedAnswerICE = async function(data,documentEl){
    //获取offerPc连接对象
    let offerPc = global.getData(global.KEY_OFFER_PEER_CONNECTION);

    //给offerPc添加来自answerPc端的answer_ice消息
    if(offerPc){
        await offerPc.addIceCandidate(new RTCIceCandidate(data));
    }
    console.log("offerPc端和answerPc端交换ice信息完成了");

}