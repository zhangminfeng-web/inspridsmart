let global = require("../global/globalFile");

module.exports.receivedOfferICE = async function(data,documentEl,ip){

    //获取answer链接对象
    let answerPc =  global.getData(global.KEY_ANSWER_PEER_CONNECTION);

    //添加远端offer发送过来的offer_ice信息,
    //通过这种方式就将answer端的icecandidate添加上了
    await answerPc.addIceCandidate(new RTCIceCandidate(data));

};