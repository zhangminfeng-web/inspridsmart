<template>
    <div>
        <div class="row placeholders">
            <div class="col-xs-12 col-sm-12 placeholder">
                <!--在线室内设备-->
                <div class="title_row_style clearfix">
                    <div class="floor_title video_intercom">
                        <i class="iconfont icon-fl-jia"></i>
                        <span class="title_index">在线室内设备</span>
                    </div>
                    <ul class="clearfix list_all_item" id="house_list_intercom">
                        <li @click="endAnswerInfo" v-for="item in indoorList" data-port="58888" :data-ip="item.ip">{{item.senderName}}</li>
                        <!--<li @click="endAnswerInfo" port="58888" ip="192.168.1.104">测试1</li>
                        <li @click="endAnswerInfo" port="58888" ip="192.168.1.105">测试2</li>-->
                    </ul>
                </div>
            </div>
        </div>

        <!--弹框-->
        <div class="intercom_model_bg" style="display:none;">
            <div class="model_content">
                <div class="model_header">
                    <span class="model_title" id="model_title">可视对讲</span>
                    <span class="model_close"></span>
                </div>
                <div class="model_mains">
                    <video id="local" controls class="video1" autoplay></video>
                    <video id="remote" controls class="video2" autoplay></video>
                    <div class="btn-group-box">
                        <button type="button" @click="localCloseVideo" class="btn btn-danger" id="localClose">挂断</button>
                        <button type="button" @click="remoteCloseVideo" class="btn btn-danger" id="remoteClose">挂断</button>
                        <button type="button" @click="openTheDoorFun" class="btn btn-info" id="openDoor">开门</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data:function(){
            return {
                indoorList:[],   //可视对讲设备数组集合
                intercomTitle:"",    //弹框标题
            }
        },
        mounted(){
            let _this = this;
            setInterval(function(){
                _this.init();
            },5000);
        },
        methods:{
            endAnswerInfo(event){  //发送offer
                let El = $(event.currentTarget);
                let ip = event.target.getAttribute('data-ip');

                //设置服务器地址
                let socket = new WebSocket('ws://'+ip+':58888');

                //发送offer
                El.trigger("clientSocketMsg",[socket]);
            },
            remoteCloseVideo(event){  //服务端挂断可视对讲
                $(documentJq).trigger("serverPcCloseVideoStream");
            },
            localCloseVideo(event){  //客户端挂断可视对讲
                $(documentJq).trigger("clientPcCloseVideoStream");
            },
            openTheDoorFun(event){
                let El = $(event.currentTarget);
                El.attr({"disabled":"disabled"});
                El.text("3秒后重启按钮...");
                //打开单元门
                $(documentJq).trigger("openPlayTheDoor");
                setTimeout(function(){
                    El.removeAttr("disabled");
                    El.text("开门");
                },3000);
            },
            init(){     //初始化获取设备信息
                requests.requestGet("/videoIntercom").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        this.indoorList = obj.indoorList;
                    }
                })
            }
        }
    }
</script>

<style>
    .fromSearch>i{
        display: block;
        position: absolute;
        right:0;
        top:0;
        padding:6px 8px;
        cursor:pointer;
        font-size:20px;
        color:#C0C0C0;
    }

    .btn-group-box{
        width:100%;
        height:60px;
        clear: both;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-group-box>button{
        margin-right:5px;
        display:none;
    }

    .btn-group-box>button:last-child{
        margin-right:0;
    }

    .video_intercom{
        margin:30px 0 !important;
    }

    .fromSearch>i:hover{
        opacity: .8;
    }

    .title_row_style{
        margin-bottom:30px;
    }

    .floor_title{
        margin-bottom:15px;
    }

    .floor_title>i{
        font-size:24px;
        color:#000;
    }

    .title_index{
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #000000;
    }

    .list_all_item>li{
        width:150px;
        height:40px;
        line-height: 40px;
        text-align: center;
        border-radius:20px;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.5);
        margin-right:10px;
        margin-bottom:10px;
        float:left;
        cursor: pointer;
    }

    .list_all_item>li.active,
    .list_all_item>li:hover{
        border:1px solid #E41612;
        background:rgba(252,231,231,.6);
        color:#E41612;
    }

    .scroll_ul>li>a{
        color: rgba(0, 0, 0, 0.5);
    }

    .scroll_ul>li:hover>a{
        color:#E41612;
        text-decoration:none;
    }

    .intercom_model_bg{
        width:100%;
        height:100%;
        background:rgba(0,0,0,.5);
        position:fixed;
        z-index: 10000;
        top:0;
        left:0;
    }

    .model_content{
        width:800px;
        height:500px;
        border:1px solid #ddd;
        border-radius:5px;
        position:absolute;
        top:50%;
        left:50%;
        margin-left:-400px;
        margin-top:-250px;
        background:#fff;
    }

    .model_header{
        width:100%;
        height:40px;
        padding:0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:1px solid #ddd;
    }

    .model_title{
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 0.85);
    }

    .model_close{
        font-size: 30px;
        font-weight: 500;
        line-height: 1;
        color: #333;
        text-shadow: 0 1px 0 #fff;
        cursor: pointer;
    }

    .model_close:hover{
        opacity: .6;
    }

    .model_mains{
        width:100%;
        height:400px;
        padding:10px 10px;
    }

    .model_mains>.video1{
        height:180px;
        width:30%;
        float:left;
        border:1px solid #ddd;
        object-fit:fill;
        /*transform: rotateY(180deg);*/
    }

    .model_mains>.video2{
        height:380px;
        width:68%;
        float:right;
        border:1px solid #ddd;
        object-fit: fill;
        /*transform: rotateY(180deg);*/
    }
</style>