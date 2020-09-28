let global = require("../global/globalFile");

module.exports.receivedOfferICE = async function(data,documentEl){

    //获取answer链接对象
    await global.getData(global.KEY_ANSWER_PEER_CONNECTION).then((answerPc) => {
        console.log(answerPc);
        //添加远端发送过来的offer_ice信息,
        //通过这种方式就将answer端的icecandidate添加上了
        answerPc.addIceCandidate(new RTCIceCandidate(data));
        console.log("answerPc端添加ice信息成功");
    });

};