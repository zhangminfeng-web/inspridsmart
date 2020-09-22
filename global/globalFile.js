module.exports = {
    LOCALHOST_PORT:"43839",
    SELF_IP:"",
    CLOUD_PORT:"42836",
    CLOUD_IP:"",
    VIDEO_PORT:"42839",
    INTERCOM_PORT:"58888",
    LOCALHOST_IP:"localhost",
    /*门口机设备信息数组*/
    VIDEO_EQUIPMENT_DOORWAY_LIST:[],
    /*门铃机设备信息数组*/
    VIDEO_EQUIPMENT_DOORBELL_LIST:[],
    /*室内设备数组*/
    VIDEO_EQUIPMENT_INDOOR_LIST:[],
    /**
     * 获取需要发送消息的JSON字符串
     * @param options  设备信息
     */
    getJsonMsg:function(options){
        return JSON.stringify({
            "senderName":new Buffer.from(options.senderName).toString('base64'),
            "msg":new Buffer.from(options.msg).toString('base64'),
            "sendTime":new Date().getTime(),
            "type":options.type,
            "deviceCode":options.code
        });
    },
    /**
     * 将设备信息保存在全局变量数组中
     * @param options 设备信息
     */
    addEquipmentInfo:function(options){
        let senderName = new Buffer.from(options.senderName,'base64').toString();
        console.log(senderName);
        let msg = new Buffer.from(options.msg,'base64').toString();
        if(senderName.indexOf("门口机") != -1){
            options.senderName = senderName;
            options.msg = msg;
            /*将门口机信息保存至数组中*/
            this.removeRepeatValue(options,1);
        }else if(senderName.indexOf("门铃机") != -1){
            options.senderName = senderName;
            options.msg = msg;
            /*将门铃机信息保存至数组中*/
            this.removeRepeatValue(options,2);
        }
        /**/
        else{
            options.senderName = senderName;
            options.msg = msg;
            this.removeRepeatValue(options,3);
        }
    },
    /**
     * 给门铃机和门口机数组去重
     * @param obj  判断是否重复的对象
     * @param type 1为门口机2为门铃机3为室内机
     */
    removeRepeatValue:function(obj,type){
        let arr =[];
        if(type == 1){
            arr = this.VIDEO_EQUIPMENT_DOORWAY_LIST;
        }else if(type == 2){
            arr = this.VIDEO_EQUIPMENT_DOORBELL_LIST;
        }else if(type == 3){
            arr = this.VIDEO_EQUIPMENT_INDOOR_LIST;
        }
        let status = arr.some((item)=>{
            return obj.ip == item.ip;
        });
        if(!status){
            arr.push(obj);
        }
    }
};