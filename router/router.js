const express = require('express');
const middle = require("../middleware/middle");
const global = require("../global/globalFile");
//加载net客户端模块
let net_server = require("../socket/net_server");
/*let intercom_server = require("../socket/intercom_server");*/

/*1.创建路由容器*/
const Router = express.Router();

/*2.将全部路由都添加到容器中*/

//展示首页数据
Router.get("/",[middle.getTung,middle.getUnit,middle.getHouseNumber],function(req,res){
    res.json({
        code:0,
        data:{
            listTung:res.listTung,
            listUnit:res.listUnit,
            listHouse:res.listHouse
        }
    })
});

//通过楼栋选择获取对应的单元门
Router.get("/selectGetUnit",[middle.selectGetUnit],function(req,res){
    return res.json({
        code:0,
        unitList:res.chengeUint
    })
});

//表单搜索门牌号
Router.post("/searchHouse",[middle.getHouseOne],function(req,res){
    return res.json({
        code:0,
        houseList:res.houseList
    })
});

//查询楼栋->单元门->门牌号的数组集合
Router.get("/getHouseAll",[middle.getHouseAll],function(req,res){
    if(res.houseAllList.length != 0){
        return res.json({
            code:0,
            houseAllList:res.houseAllList
        })
    }
});

//获取住户详细信息数据
Router.get('/userdetail/:id',[middle.getUserDetail,middle.getPeopleInfo],function (req,res) {
    res.json({
        code:0,
        houseInfo:res.houseInfo[0],
        peopleInfoList:res.peopleInfoList
    });
});

//获取住户基本信息
Router.get("/getBaseInfoData",[middle.getUserDetail],function(req,res){
    return res.json({
        code:0,
        baseInfo:res.houseInfo[0]
    })
});

//更新住户详情的基本信息
Router.post("/updateBaseInfo",[middle.updateUserBaseInfo],function(req,res){
    return res.json({
        code:0
    })
});

//添加入住人员
Router.post("/addUserInfo",[middle.addUserPersonnel],function(req,res){
    return res.json({
        code:0,
        id:res.result.id
    })
});

//查询单个入住人员信息
Router.get("/showUserInfo",[middle.showOnePeopleInfo],function(req,res){
    return res.json({
        code:0,
        userInfo:res.userInfo[0]
    })
});

//更新住户人员信息
Router.post("/editUserPeopleInfo",[middle.editUserPeopleInfo],function(req,res){
    return res.json({
        code:0
    })
});

//删除住户人员信息
Router.get("/deleteUserInfo",[middle.deleteUserInfo],function(req,res){
    return res.json({
        code:0
    })
});

//展示视频监控页面
Router.get("/videoWatch",function(req,res){
    res.json({
        code:0,
        doorwayList:global.VIDEO_EQUIPMENT_DOORWAY_LIST,
        doorbellList:global.VIDEO_EQUIPMENT_DOORBELL_LIST
    })
});

//发送ip数据，接收视频图片数据
Router.get("/receiveInfo",function(req,res){
    //console.log("收到客户端发送的请求！");
    //向服务端发送消息
    net_server.sendInfo(req.query.ip,req.query.type,function(data){
        res.json({
            code:0,
            imgData:data
        });
    });
});

//关闭socket连接
Router.get("/closeConnection",function(req,res){
    net_server.close(req.query.ip,req.query.type);
    res.json({
        code:0
    });
})

//展示可视对讲主页面
Router.get("/videoIntercom",function(req,res){
    res.json({
        code:0,
        indoorList:global.VIDEO_EQUIPMENT_INDOOR_LIST
    });
});

//所有在线设备的展示
Router.get("/allOnlineEquipment",function (req,res){
    res.json({
        code:0,
        onlineList:[...global.VIDEO_EQUIPMENT_INDOOR_LIST,...global.VIDEO_EQUIPMENT_DOORWAY_LIST,...global.VIDEO_EQUIPMENT_DOORBELL_LIST]
    });
});

//获取报警信息数据
Router.get("/getCallPoliceData",function(req,res){
    res.json({
        code:0,
        callPoliceList:global.CALL_POLICE_LIST
    })
})

/*3.将路由容器导出*/
module.exports = Router;