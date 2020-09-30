let global = require("../global/globalFile");

module.exports.receivedOfferICE = async function(data,documentEl,answerPc){
    console.log("*****answer端接收ice信息");
    console.log(data);
    //添加远端发送过来的offer_ice信息,
    //通过这种方式就将answer端的icecandidate添加上了
    if(answerPc){
        console.log("********");
        if(!data.sdpMLineIndex){
            data.sdpMLineIndex = 0;
            data.sdpMid = "0";
        }
        await answerPc.addIceCandidate(new RTCIceCandidate(data));
    }
};