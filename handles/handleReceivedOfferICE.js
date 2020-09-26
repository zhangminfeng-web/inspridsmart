let global = require("../global/globalFile");

module.exports.receivedOfferICE = async function(data,documentEl){

    //获取answer链接对象
    let answerPc =  global.getData(global.KEY_ANSWER_PEER_CONNECTION);

    //添加远端发送过来的offer_ice信息,
    //通过这种方式就将answer端的icecandidate添加上了
    if(answerPc){
        console.log(data);
        await answerPc.addIceCandidate(new RTCIceCandidate(data));
    }

};