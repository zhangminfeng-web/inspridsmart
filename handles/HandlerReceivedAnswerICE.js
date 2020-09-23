const global = require("../global/globalFile");

module.exports.receivedAnswerICE = async function(data,documentEl,ip){
    console.log("offerPc端收到answer_ice消息");
    //获取offerPc连接对象
    let offerPc = global.getData(global.KEY_OFFER_PEER_CONNECTION);

    //给offerPc添加来自answerPc端的answer_ice消息
    await offerPc.addIceCandidate(new RTCIceCandidate(data));

}