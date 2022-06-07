# 简易的本地数据的数据表插件

## 项目介绍：

基于JQuery与原生Js的数据表插件。用户写入数据和表头后，数据以数组方式存储在JSON对象中，提供表格界面呈现数据；提供可隐藏的搜索栏、分页栏（可通过写入一些参数控制搜索栏或分页栏是否显示）、自定义排序**、修改删除数据**（可包含修改删除后向服务器提交）等，并且可以提供onSearch、onPage、onDelete**、onModify**等事件，事件触发后执行注册事件时传入的回调函数，将内部参数通过回调函数传出来（如：搜索结果、分页结果等）供用户使用。

![](https://s2.loli.net/2022/06/07/GwaLiKEUxYbPfBA.png)

## 使用方法：



1. clone项目

2. 引入jq，js,css样式

       <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js">
       </script>
       <script src="./dataVisualization.js"></script>
       <link rel="stylesheet" type="text/css" href="./dataVisualization.css" />

3. 配置配置项

   ```html
   <div class="content">
           <div class="table" id="table">
           </div>
       </div>
       <script>
           var data=[
              {
               id:1,
               name:"张三",
               address:"四川省成都市",
               phone:"123456789"
              },
              {
               id:2,
               name:"王五",
               address:"浙江省杭州市",
               phone:"987654321"
              },
              {
               id:3,
               name:"赵六",
               address:"河南省郑州市",
               phone:"111111111111"
              },
              {
               id:4,
               name:"王麻子",
               address:"广东省广州市",
               phone:"2222222222222"
              },
              {
               id:5,
               name:"张三",
               address:"四川省成都市",
               phone:"123456789"
              },
              {
               id:6,
               name:"王五",
               address:"浙江省杭州市",
               phone:"987654321"
              },
              {
               id:7,
               name:"赵六",
               address:"河南省郑州市",
               phone:"111111111111"
              },
              {
               id:8,
               name:"王麻子",
               address:"广东省广州市",
               phone:"2222222222222"
              },
              {
               id:9,
               name:"张三",
               address:"四川省成都市",
               phone:"123456789"
              },
              {
               id:10,
               name:"王五",
               address:"浙江省杭州市",
               phone:"987654321"
              },
              {
               id:11,
               name:"赵六",
               address:"河南省郑州市",
               phone:"111111111111"
              },
              {
               id:12,
               name:"王麻子",
               address:"广东省广州市",
               phone:"2222222222222"
              },
              {
               id:13,
               name:"张三",
               address:"四川省成都市",
               phone:"123456789"
              },
               ]
           var dv1=new MyDataView();
           dv1.render({
               // 挂载的Dom元素
               el:"table",
               // 标题配置项
               title:{ text: "数据可视化插件", logo: "./dsj.png"},
               // 数据配置项
               data,
               // 表头配置项
               headers:[
               {filed:"id",name:"Id",width:"200px"},
               {filed:"name",name:"Name",width:"200px"},
               {filed:"address",name:"Address",width:"300px"},
               {filed:"phone",name:"Phone",width:"300px"}
               ],
               // 分页配置项
               page:{pageBar:true,pageSize:3},
               // 排序配置项，"as"为升序，"des"为降序
               sort:"des",
               // 更新按钮配置项,默认为true
               update:{updateBar:false},
               // 删除按钮配置项，默认为true
               del:{delBar:false},
               // 表格中的操作按钮配置项,默认为true
               operation:{operationBar:true},
               // 搜索数据配置项，默认为true
               search:{searchBar:true}
           })
           // 表格事件的监听绑定例子
           dv1.myOn("onPage",function(data,oldPage,newPage){
               console.log("翻页事件触发");
               console.log("翻页后当前前页面的数据",data);
               console.log("翻页前的页码",oldPage);
               console.log("翻页后的页码",newPage);
           })
           dv1.myOn("onUpdate",function(oldData,newData,index){
               console.log("修改事件触发");
               console.log("修改前的数据",oldData);
               console.log("修改后的数据",newData);
               console.log("数据的序号",index);
           })
           dv1.myOn("onDel",function(data,index){
               console.log("删除事件触发");
               console.log("删除的数据",data);
               console.log("删除的序号",index);
           })
           dv1.myOn("onSearch",function(data){
               console.log("查找事件触发");
               console.log("查找到的数据为",data);
           })
       </script>
   ```

   



## 最后总结

本人目前是前端小白，为了提升自己,接触插件开发。其中难免会有许多错误。请多包含。但如果能为您提供些许参考价值与帮助我将不胜荣幸。
