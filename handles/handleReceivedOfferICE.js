let global = require("../global/globalFile");

module.exports.receivedOfferICE = async function(data,documentEl,answerPc){
    console.log("________");
    console.log(answerPc);
    console.log(data);
    //添加远端发送过来的offer_ice信息,
    //通过这种方式就将answer端的icecandidate添加上了
    if(answerPc){
        await answerPc.addIceCandidate(new RTCIceCandidate(data));
        console.log("answerPc端添加ice信息成功");
    }

};