<template>
    <div>
        <div class="row placeholders">
            <div class="col-xs-12 col-sm-12 placeholder">
                <!--在线室内设备-->
                <div class="title_row_style clearfix">
                    <div class="floor_title margin_police">
                        <i class="iconfont icon-fl-jia"></i>
                        <span class="title_index">报警信息</span>
                    </div>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr class="title-police">
                                <th>编号</th>
                                <th>设备名称</th>
                                <th>报警信息</th>
                                <th>时间</th>
                            </tr>
                        </thead>
                        <tbody class="police-tbody">
                            <tr v-for="(item,index) in policeList">
                                <td>{{index+1}}</td>
                                <td>{{item.alias_name}}</td>
                                <td>{{item.police_msg}}</td>
                                <td>{{item.now_time}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data:function(){
            return {
                policeList:[],
                baseURLS:"http://localhost:43839", //全局网址
            }
        },
        mounted(){
            let _this = this;
            setInterval(function(){
                _this.init();
            },5000);
        },
        methods:{
            init(){
                let _this = this;
                //获取报警信息数据
                axios.get(this.baseURLS+"/getCallPoliceData").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        _this.policeList = obj.indoorList;
                    }
                });

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

    .margin_police{
        margin:30px 0 !important;
    }

    .title-police>th{
        text-align: center;
    }

    .police-tbody>tr>td:nth-child(2),
    .police-tbody>tr>td:nth-child(3){
        color:red;
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
</style>