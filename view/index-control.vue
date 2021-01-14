<template>
    <div>
        <div v-if="isShow == 0" class="residential_main">
            <div class="container-fluid" style="padding:0;">
                <div class="row">
                    <div class="col-sm-12 col-md-12" style="padding:0;">
                        <div class="row headerBgColor" style="margin-top:0;line-height:40px;">
                            <div class="col-sm-12">
                                <div class="layout_block_box">
                                    <div class="row home_info_block clearfix">
                                        <div class="clearfix title-base-info">
                                            <div class="base_info_title pull-left" style="margin-bottom:0;">小区基本信息设置:</div>
                                            <button class="btn btn-success btn-sm pull-right base_info_model" data-toggle="modal" data-target="#editAreaInfo">编辑</button>
                                        </div>
                                        <div class="col-sm-6 col-md-6">
                                            <span class="label_style">小区名称：</span>
                                            <span v-if="areaInfo.area_name" class="value_style">{{areaInfo.area_name}}</span>
                                            <span v-else class="value_style">暂无</span>
                                        </div>
                                        <div class="col-sm-6 col-md-6">
                                            <span class="label_style">绿化面积：</span>
                                            <span v-if="areaInfo.green_area" class="value_style">{{areaInfo.green_area}}㎡</span>
                                            <span v-else class="value_style">暂无</span>
                                        </div>
                                        <div class="col-sm-6 col-md-6">
                                            <span class="label_style">总体面积：</span>
                                            <span v-if="areaInfo.total_area" class="value_style">{{areaInfo.total_area}}㎡</span>
                                            <span v-else class="value_style">暂无</span>
                                        </div>
                                        <div class="col-sm-6 col-md-6">
                                            <span class="label_style">小区地址：</span>
                                            <span v-if="areaInfo.area_address" class="value_style">{{areaInfo.area_address}}</span>
                                            <span v-else class="value_style">暂无</span>
                                        </div>
                                        <div class="col-sm-12 col-md-12">
                                            <span class="label_style">小区简介：</span>
                                            <span v-if="areaInfo.area_introduction" class="value_style" style="line-height:0;">{{areaInfo.area_introduction}}</span>
                                            <span v-else class="value_style" style="line-height:0;">暂无</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="layout_block_box mt-30">
                                    <div class="row home_info_block clearfix">
                                        <div class="clearfix title-base-info">
                                            <div class="base_info_title pull-left">楼栋信息操作:</div>
                                            <button class="btn btn-success btn-sm pull-right" @click="editFloorInfo">编辑</button>
                                            <div class="pull-right">&nbsp;&nbsp;</div>
                                            <button class="btn btn-info btn-sm pull-right" @click="addFloorInfo">添加</button>
                                        </div>
                                    </div>
                                    <ul class="row floor_box_all floor_set_up">
                                        <li @click="toggleFloorStatus" v-for="item in floorArray" :id="item.id" :name="item.name">
                                            <span>{{item.name}}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div class="layout_block_box mt-30">
                                    <div class="row home_info_block clearfix">
                                        <div class="clearfix title-base-info">
                                            <div class="base_info_title pull-left">人员信息操作:</div>
                                            <button class="btn btn-success btn-sm pull-right" @click="peopleEditInfo">编辑</button>
                                        </div>
                                    </div>
                                    <ul class="row floor_box_all people_set_up">
                                        <li @click="togglePeopleStatus" v-for="item in floorArray" :id="item.id" :name="item.name">
                                            <span>{{item.name}}</span>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="residential_main">
            <div class="warning_info">只有超级管理员才能操作住户管理模块！</div>
        </div>

        <!--编辑小区信息弹框-->
        <div class="modal fade" id="editAreaInfo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">编辑小区基本信息</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" id="baseInfoForm">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">小区名称</label>
                                <div class="col-sm-10">
                                    <input type="text" v-model="areaInfo.area_name" name="area_name" maxlength="20" placeholder="小区名称20字以内" class="form-control">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">绿化面积</label>
                                <div class="col-sm-10">
                                    <input type="text" v-model="areaInfo.green_area" name="green_area" class="form-control" placeholder="以平方米为单位(㎡)">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">总体面积</label>
                                <div class="col-sm-10">
                                    <input type="text" v-model="areaInfo.total_area" name="total_name" class="form-control" placeholder="以平方米为单位(㎡)">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">小区地址</label>
                                <div class="col-sm-10">
                                    <input type="text" v-model="areaInfo.area_address" name="area_address" class="form-control" maxlength="100" placeholder="小区名称100字以内">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">小区简介</label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" v-model="areaInfo.area_introduction" maxlength="200" name="area_introduction" placeholder="请输入200字以内的简介内容" v-model="areaInfo.area_introduction"  rows="3"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" @click="submitAreaInfo" class="btn btn-success">提交</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    module.exports = {
        data:function() {
            return {
                areaInfo:{
                    area_name:"",
                    green_area:"",
                    total_area:"",
                    area_address:"",
                    area_introduction:"",
                    id:1
                },
                floorArray:[]
            }
        },
        props:{
            isShow:{
                default:1
            }
        },
        mounted(){
            let _that = this;
            _that.init();
            _that.getFloorArray();
            setInterval(function(){
                _that.getFloorArray();
            },10000);
        },
        methods:{
            init(){
                let _that = this;
                //获取小区基本信息
                requests.requestGet("/").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        _that.areaInfo = obj.data.getAreaInfo[0] || _that.areaInfo;
                    }
                });
            },
            getFloorArray(){  //获取楼栋信息
                let _that = this;
                requests.requestGet("/getFloorArrayInfo").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        return obj.listTung;
                    }
                }).then((arr) => {
                    this.fileFloorSliceClass(arr);
                })
            },
            fileFloorSliceClass(arr){
                let specialArray = [];  //特殊楼栋数组
                let munberArray = [];   //数字楼栋数组
                //1.判断特殊字符楼栋名称和数字字符楼栋名称，并分类归纳
                for(item of arr){
                    if(!isNaN(parseInt(item.name))){
                        munberArray.push(item);
                    }else{
                        specialArray.push(item);
                    }
                }
                munberArray = munberArray.sort(this.compareDesc('name')).reverse();
                specialArray = specialArray.sort(this.compare('name')).reverse();
                this.floorArray = [...munberArray,...specialArray];
            },
            compareDesc(prop){  //按照name的数字属性排序
                return function (obj1, obj2) {
                    var val1 = parseInt(obj1[prop]);
                    var val2 = parseInt(obj2[prop]);
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if (val1 > val2) {
                        return -1;
                    } else if (val1 < val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            compare(prop){  //按照name的字母属性排序
                return function (b, a) {
                    var x1 = a[prop].toUpperCase();
                    var x2 = b[prop].toUpperCase();
                    if (x1 < x2) {
                        return -1;
                    }
                    if (x1 > x2) {
                        return 1;
                    }
                    return 0;
                }
            },
            submitAreaInfo(){  //提交小区总体信息
                let _that = this;
                let obj = _that.areaInfo;
                if(_that.areaInfo.area_name != "" && _that.areaInfo.area_name != null){
                    requests.requestPost("/submitAreaInfo",obj).then(res => {
                        let obj = res.data;
                        if(obj.code == 0){
                            layer.msg(obj.msg,{icon:6,time:2000});
                            $("#editAreaInfo").modal('hide');
                        }
                    });
                }else{
                    requests.failMsgInfo(layer,"请输入小区名称！");
                }
            },
            addFloorInfo(){   //添加楼栋信息
                let _that = this;
                layer.prompt(
                    {title: '添加楼栋信息', formType: 3},
                    function(pass, index){
                        let status = _that.floorArray.some((item)=>{
                            return item.name == pass;
                        });
                        if(!status){
                            requests.requestPost('/addFloorInfo',{name:pass}).then(res => {
                                let obj = res.data;
                                if(obj.code == 0){
                                    layer.close(index);
                                    requests.successMsgInfo(layer,"添加成功！");
                                    _that.getFloorArray();
                                }
                            })
                        }else{
                            requests.failMsgInfo(layer,"楼栋名称重复,请重新输入！");
                        }
                    }
                );
            },
            editFloorInfo(){ //编辑楼栋信息
                let _that = this;
                let arr = $(".floor_set_up").find(".active");
                let id = $(".floor_set_up").find(".active").attr("id");
                let name = $(".floor_set_up").find(".active").attr("name");
                if(arr.length != 0){
                    var index = layer.open({
                        title: '楼栋编辑',
                        type: 2,
                        shade: 0.2,
                        maxmin:true,
                        shadeClose: true,
                        area: ['100%', '100%'],
                        content:"./view/index-unit.html?id="+id+"&name="+name,
                    });
                }else{
                    requests.failMsgInfo(layer,"请先选择楼栋");
                }
            },
            peopleEditInfo(event){  //编辑人员信息模块
                let _that = this;
                let parentEl = $(".people_set_up");
                let arr = parentEl.find(".active");
                let id = parentEl.find(".active").attr("id");
                let name = parentEl.find(".active").attr("name");
                if(arr.length != 0){
                    var index = layer.open({
                        title: '编辑人员信息',
                        type: 2,
                        shade: 0.2,
                        maxmin:true,
                        shadeClose: true,
                        area: ['100%', '100%'],
                        content:"./view/unitPeoplePage.html?id="+id+"&name="+name,
                    });
                }else{
                    requests.failMsgInfo(layer,"请先选择人员信息模块下的楼栋号！");
                }
            },
            toggleFloorStatus(event){  //切换楼栋信息
                let liEl = $(event.currentTarget);
                liEl.parent().find(".active").removeClass('active');
                liEl.addClass('active');
            },
            togglePeopleStatus(event){ //切换人员信息中的
                let liEl = $(event.currentTarget);
                liEl.parent().find(".active").removeClass('active');
                liEl.addClass('active');
            }
        }
    }
</script>

<style>
    .floor_box_all{
        height:200px;
        overflow:hidden;
        overflow-y: scroll;
        padding-left:20px;
    }

    .floor_box_all>li{
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

    .floor_box_all>li.active,
    .floor_box_all>li:hover{
        border:1px solid #E41612;
        background:rgba(252,231,231,.6);
        color:#E41612;
    }

    .floor_box_all>li>a{
        color: rgba(0, 0, 0, 0.5);
    }

    .floor_box_all>li:hover>a{
        color:#E41612;
        text-decoration:none;
    }

    .residential_main{
        width:100%;
    }

    .headerBgColor{
        line-height:60px;
        height: 60px;
        background: #FFFFFF;
    }

    .zuojianIcon{
        font-size:24px;
        color:#8E8E8E;
    }

    .user_munber{
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 0.85);
    }

    .layout_block_box{
        background:#F5F5F5;
        padding:20px 25px;
        border-radius:5px;
    }

    .base_info_title{
        font-size:22px;
        font-weight:500;
        margin-bottom:30px;
    }

    .mb-20{
        margin-bottom:20px;
    }

    .label_style{
        color:#333;
        font-size:18px;
        font-family: MicrosoftYaHei;
    }

    .value_style{
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: #666;
    }

    .title-base-info{
        padding:0 30px 0 15px;
    }

    .mt-30{
        margin-top:30px;
    }

    .text-center>th{
        text-align: center;
    }

    .modal-dialog{
        margin: 130px auto;
    }

    .layui-form-radio{
        margin:0;
    }

    .layui-form-radio>i{
        margin-right:0;
    }

    .modal-title{
        font-weight:600;
        font-size:20px;
    }

    .warning_info{
        font-weight: 600;
        font-size: 18px;
        color:#D63E3B;
    }
</style>