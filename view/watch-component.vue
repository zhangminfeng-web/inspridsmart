<template>
    <div>
        <div class="row headerBgColor">
            <div class="col-sm-12">
                <ul class="clearfix list_all_item" id="select_tung_all">
                    <li @click="changeStatusLi" class="active">门口机</li>
                    <li @click="changeStatusLi">门铃机</li>
                </ul>
            </div>
        </div>
        <div class="layout_block_box">
            <div class="row home_info_block clearfix">
                <div class="clearfix title-base-info">
                    <div class="base_info_title pull-left">设备展示:</div>
                </div>
                <div class="col-sm-12 mb-20 clearfix" id="equipment_show">
                    <ul class="doorway_machine" style="display: block;">
                        <li port="42839" @click="showWatchVideo" v-for="item in doorwayList" :ip="item.ip">{{item.senderName}}</li>
                    </ul>
                    <ul class="doorbell_machine" style="display: none;">
                        <li port="42839" @click="showWatchVideo" v-for="item in doorbellList" :ip="item.ip">{{item.senderName}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <!--弹框-->
        <div class="model_bg" style="display:none;">
            <div class="model_content">
                <div class="model_header">
                    <span class="model_title" id="model_title"></span>
                    <span class="model_close" @click="closeWatchVideo">&times;</span>
                </div>
                <div class="model_main">
                    <img src="./public/img/timg.gif" alt="" id="videoImg">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    module.exports = {
        data: function(){
            return {
                baseURLS:"http://localhost:43839", //全局网址
                doorwayList:[],     //门口机数组
                doorbellList:[],    //门铃机数组
                type:11,  //发送的视频控制状态码：11打开  17关闭
                ip:null,    //当前操作设备的ip地址
                poperTitle:"",      //弹框标题
                //imgStr:"./public/img/timg.gif",     //视频数据
                timer:null,     //定时器参数
            }
        },
        mounted(){
            //初始化网页数据
            let _this = this;
            setInterval(function(){
                _this.init();
            },5000);
        },
        methods:{
            changeStatusLi(event){  //切换门口机和门铃机
                let El = $(event.currentTarget);
                let index = El.index();
                let doorway = $(".doorway_machine");
                let doorbell = $(".doorbell_machine");
                El.parent().find(".active").removeClass("active");
                El.addClass("active");
                if(index == 0){
                    doorway.show();
                    doorbell.hide();
                }else{
                    doorway.hide();
                    doorbell.show();
                }
            },
            showWatchVideo(event){   //打开弹框
                let _this = this;
                let El = $(event.currentTarget);
                _this.ip = El.attr('ip');
                _this.poperTitle = El.text();
                $(".model_bg").show();
                _this.timer = window.setInterval(()=>{
                    _this.getDataImg(_this.ip,_this.type);
                    _this.type = null;
                },100);

            },
            getDataImg(ip,type){
                let _this = this;
                axios.get(this.baseURLS+"/receiveInfo?ip="+ip+"&type="+type).then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        let bytes = new Uint8Array(obj.imgData.data);
                        let storeData = "";
                        let len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            storeData += String.fromCharCode(bytes[i]);
                        }
                        let imgStr  = "data:image/png;base64," + window.btoa(storeData);
                        $("#videoImg").attr("src",imgStr);
                    }
                });
            },
            closeWatchVideo(){  //关闭弹框
                let _this = this;
                window.clearInterval(_this.timer);
                $(".model_bg").hide();
                _this.type = _this.type?_this.type:11;
                $("#videoImg").attr("src","./public/img/timg.gif");
                axios.get(this.baseURLS+"/closeConnection?ip="+_this.ip+"&type="+17).then(res => {
                    //location.reload();
                });
            },
            init(){  //初始化网页数据
                let _this = this;
                axios.get(_this.baseURLS+"/videoWatch").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        _this.doorwayList = obj.doorwayList;
                        _this.doorbellList = obj.doorbellList;
                    }
                });
            }

        },

    }
</script>

<style>
    .headerBgColor{
        margin:30px 0;
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

    .layout_block_box{
        background:#F5F5F5;
        padding:20px 25px;
        border-radius:5px;
    }

    .title-base-info{
        padding:0 30px 0 15px;
    }

    .base_info_title{
        font-size:22px;
        font-weight:500;
        margin-bottom:30px;
    }

    .doorway_machine>li,
    .doorbell_machine>li{
        width: 150px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        border-radius:5px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.5);
        margin-right: 10px;
        margin-bottom: 10px;
        float: left;
        cursor: pointer;
    }

    .doorway_machine>li:hover,
    .doorbell_machine>li:hover{
        border: 1px solid #E41612;
        background: rgba(252,231,231,.6);
        color: #E41612;
    }

    .model_bg{
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

    .model_main{
        display: flex;
        justify-content: center;
        align-items: center;
        overflow:hidden;
        width:100%;
        height:440px;
    }

    .model_main>img{
        max-height:100%;
        max-width:100%;
    }
</style>