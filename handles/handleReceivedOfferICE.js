let global = require("../global/globalFile");

module.exports.receivedOfferICE = async function(data,documentEl,offerPc){
    //添加远端发送过来的offer_ice信息,
    //通过这种方式就将answer端的icecandidate添加上了
    if(offerPc){
        if(!data.sdpMLineIndex){
            data.sdpMLineIndex = 0;
            data.sdpMid = "0";
        }

        console.log("******&&&&");
        console.log(data);

        try {
            await offerPc.addIceCandidate(new RTCIceCandidate(data));
        }
        catch (err) {

        }

    }

    console.log("answerPc端交换ice信息完成了");
};