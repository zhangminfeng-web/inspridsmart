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
                        <li @click="endAnswerInfo" v-for="item in indoorList" port="58888" :ip="item.ip">{{item.senderName}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <!--弹框-->
        <div class="intercom_model_bg" style="display:none;">
            <div class="model_content">
                <div class="model_header">
                    <span class="model_title" id="model_title">与{{intercomTitle}}的对讲</span>
                    <span class="model_close" @click="closeWatchVideo">&times;</span>
                </div>
                <div class="model_mains">
                    <video id="local" class="video1" autoplay></video>
                    <video id="remote" class="video2" autoplay></video>
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
                baseURLS:"http://localhost:43839", //全局网址
                intercomTitle:"",    //弹框标题
            }
        },
        created(){
            this._jqThis = $(this);
            this.init();
            this._jqThis.on('receiver_offer',this.endOffer);
        },
        methods:{
            async endAnswerInfo(event){  //发送answer
                let El = $(event.currentTarget);
                let ip = El.attr("ip");
                this.intercomTitle = El.text();
                $(".intercom_model_bg").show();
                //发送answer
                El.trigger("sendAnswer",[ip]);
            },
            closeWatchVideo(){

            },
            init(){     //初始化获取设备信息
                axios.get(this.baseURLS+"/videoIntercom").then(res => {
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
        display: flex;
        align-items: center;
        overflow:hidden;
        width:100%;
        height:440px;
    }

    .model_mains>.video1{
        max-height:100%;
        max-width:49%;
        float:left;
    }

    .model_mains>.video2{
        max-height:100%;
        max-width:49%;
        float:right;
    }
</style>