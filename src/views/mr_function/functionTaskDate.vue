<template>
    <div class="taskDate">
        <div class="task-heading">
            <a href="javascript:;" class="index">养号任务列表</a>
        </div>
        <div class="group-statistical">
            <div class="item">
                <p>次数</p>
                <h1>{{num}}</h1>
            </div>
            <div class="item">
                <p> </p>
                <h1> </h1>
            </div>
        </div>
        <!-- //表 -->
        <div calss="set-table">
           <el-table :data="tableData">
                <el-table-column label="账号名称">
                    
                </el-table-column>

                <el-table-column label="执行任务">
                    
                </el-table-column>

                <el-table-column label="执行时间">
                    
                </el-table-column>

                <el-table-column label="状态">
                    
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            num: 5,
            tableData: [
                {
                 setName: "张三",
                 task: "漂流瓶",
                 time: "2018-8-22",
                 state: "成功"
                }]
            
        };
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.task-heading {
    padding: 0 15px 0 35px;
    width: 100%;
    height: 47px;
    line-height: 29px;
    font-size: 18px;
    z-index: 5;
    background: #fff;
    padding: 10px 15px;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
.group-statistical {
    width: 100%;
    overflow: hidden;
    padding: 50px 0;
    box-sizing: border-box;
    .item {
        float: left;
        width: 50%;
        text-align: center;
        h1 {
            font-size: 50px;
        }
    }
}
</style>
