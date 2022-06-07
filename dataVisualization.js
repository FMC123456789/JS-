/*
 * @Author: ffuucckking szrt46093@163.com
 * @Date: 2022-05-31 09:04:15
 * @LastEditors: ffuucckking szrt46093@163.com
 * @LastEditTime: 2022-06-07 17:13:09
 * @FilePath: \大数据结业作业\dataVisualization.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
;(function(global){
    "use strict";
    var MyDataView=function(){
    }
    MyDataView.prototype={
        // 默认配置项
        optinos:{
            el:null,
            title: { text: "数据可视化", logo: "./bg.jpg"},
            headers:[{filed:"test1",name:"Test1",width:"200px"},{filed:"test2",name:"Test2",width:"100px"},{filed:"test3",name:"Test3",width:"100px"}],
            data:[],
            page:{pageBar:true,pageSize:4},
            //翻页事件触发器
            pageEvent:null,
            //翻页事件注册
            onPage:function(callback){
                this.pageEvent=callback;
            },
            search:{searchBar:true},
            searchEvent:null,
            onSearch:function(callback){
                this.searchEvent=callback;
            },
            update:{updateBar:true},
            updateEvent:null,
            onUpdate:function(callback){
                this.updateEvent=callback;
            },
            del:{delBar:true},
            delEvent:null,
            onDel:function(callback){
                this.delEvent=callback;
            },
            operation:{operationBar:true},
            // 排序配置项，
            sort:"as"
        },
        render:function(opts){
            var optinos=config(opts,this.optinos);
            // var data=optinos.data;
            // var html="";
            var headerHtml="";
            // var dataHtml="";
            if(optinos.sort==="des"){
                optinos.data.reverse();
            }
            if(optinos.search.searchBar){
                headerHtml=`                <div>
                <div class="dv-logo"></div>
                <h4>${optinos.title.text}</h4>
            </div>
            <input type="text" class="dv-input"/>
            <button class="dv-btn-search">搜索</button>
            <button class="dv-btn-reflash">刷新</button>
            `
            headerHtml=addDivContain(headerHtml,"dv-header");
            }
            else{
                headerHtml=`
                <div style="width:130px;margin:0 auto;">
                <div class="dv-logo"></div>
                <h4 style=" text-align: center;">${optinos.title.text}</h4>
                </div>`
                headerHtml=addDivContain(headerHtml,"dv-header");
            }

           let mainHtml=renderData(optinos,1);
            let footerHtml=`            <div class="dv-footer">
            <span class="dv-total left">总记录数${optinos.data.length}</span>
            <div class="left">
            <a href="javascrpit:;" class="dv-pre">上一页</a>
            <span class="dv-biaoji">1/${getTotalPage(optinos)}</span>
            <a href="javascrpit:;" class="dv-next">下一页</a>
            </div>
            <div class="right">
            <a href="javascrpit:;" class="dv-go">前往</a>
            <input type="text" id="dv-page"/>
            <span>页</span>
            </div>
        </div>`;
            
            //表格的宽度控制
            let tableWidth=null;
            optinos.headers.forEach((item)=>{
                tableWidth=parseInt(item.width)+tableWidth+1;
            })
            if(optinos.operation.operationBar){
                tableWidth=tableWidth+100;
            }
            tableWidth++;
 
            // 模板字符串的渲染与css样式的渲染
            $(`#${optinos.el}`).html(headerHtml+mainHtml+footerHtml).css("width",`${tableWidth}`);

            $(".dv-logo").css({
                "background":  `url(${optinos.title.logo})`,
                "backgroundSize":"contain",
                " backgroundRepeat":"no-repeat"
            });
            if(optinos.data.length==0){
                renderEmpty();
            }



            // 事件的绑定
            $(".dv-next").click(function(){
                // 当处于更改的状态时，不可以进行其他操作
                if(isUpdateing()){
                    return;
                };

                let curPage=$(".dv-footer .dv-biaoji").text();
                curPage=parseInt(curPage);
                let totalPgae=getTotalPage(optinos);
                if(curPage>=totalPgae){return;}
                let data=loadData(optinos,parseInt(curPage+1));
                $(".dv-footer .dv-biaoji").text(`${curPage+1}/${totalPgae}`);
                if(typeof optinos.pageEvent==="function"){
                optinos.pageEvent(data,curPage,curPage+1);
                }
            })

            $(".dv-pre").click(function(){
                // 当处于更改的状态时，不可以进行其他操作
                if(isUpdateing()){
                    return;
                };

                let curPage=$(".dv-footer .dv-biaoji").text();
                curPage=parseInt(curPage);
                let totalPgae=getTotalPage(optinos);
                if(curPage<=1){return;}
                let data=loadData(optinos,parseInt(curPage-1));
                $(".dv-footer .dv-biaoji").text(`${curPage-1}/${totalPgae}`);
                if(typeof optinos.pageEvent==="function"){
                    optinos.pageEvent(data,curPage,curPage-1);
                }
                // optinos.onPage(data);
            })
            $(".dv-go").click(function(){
                // 当处于更改的状态时，不可以进行其他操作
                if(isUpdateing()){
                    return;
                };
                
                let curPage=$(".dv-footer input").val();
                let oldPage=$(".dv-footer .dv-biaoji").text();
                oldPage=parseInt(oldPage);
                curPage=parseInt(curPage);
                let totalPgae=getTotalPage(optinos);
                if(curPage<=0||curPage>totalPgae){return;}
                let data=loadData(optinos,curPage);
                $(".dv-footer .dv-biaoji").text(`${curPage}/${totalPgae}`);
                $(".dv-footer input").val("");
                if(typeof optinos.pageEvent==="function"){
                    optinos.pageEvent(data,oldPage,curPage);
                }
                // optinos.onPage(data);
            })

            $(".dv-update").click(function(){
             let  spans=$(this).parent().parent().find("span");
            let len=spans.length;
            for(let i=0;i<len;i++){
                let parent=spans[i].parentNode;
               let input=document.createElement("input");
               input.type="text";
               input.classList.add("dv-updateInput")
               input.value=spans[i].innerText;
               input.setAttribute("data-key",spans[i].dataset.key);
              parent.appendChild(input);
              parent.removeChild(spans[i]);
            }
            $(".dv-updateInput").change(function(event){
                let curPage=$(".dv-footer .dv-biaoji").text();
                curPage=parseInt(curPage);
                let totalPgae=getTotalPage(optinos);
                let pageSize=optinos.page.pageSize;

                // 修改本地data数据
                let input=event.target;
                let row=input.parentNode.parentNode;
                let mbody=document.getElementsByClassName("dv-row");
                var index = Array.prototype.indexOf.call(mbody,row);
                let dataIndex=(curPage-1)*pageSize+index;
                let key=input.dataset.key;
                let oldData= JSON.parse(JSON.stringify(optinos.data[dataIndex]));
                optinos.data[dataIndex][key]=input.value;
                let newData= optinos.data[dataIndex];

                // 加载修改后的数据
            let fileds=row.getElementsByClassName("dv-filed");
            let len=fileds.length;
            if(optinos.operation.operationBar){
                len=len-1;
            }
            for(let k=0;k<len;k++){
                let selfinput=fileds[k].getElementsByTagName("input");
                let span=document.createElement("span");
                span.setAttribute("data-key",selfinput[0].dataset.key);
                fileds[k].removeChild(selfinput[0]);
                fileds[k].appendChild(span);
            }
                loadData(optinos,curPage);
                if(typeof optinos.updateEvent==="function"){
                optinos.updateEvent(oldData,newData,dataIndex)
                }
            });
            })

            $(".dv-del").click(function(event){
                // 当处于更改的状态时，不可以进行其他操作
                if(isUpdateing()){
                    return;
                };

                let curPage=$(".dv-footer .dv-biaoji").text();
                curPage=parseInt(curPage);
                let totalPgae=getTotalPage(optinos);
                let pageSize=optinos.page.pageSize;

                if(optinos.data.length%pageSize===1){
                    curPage--;
                    if(curPage<1){
                        curPage=1;
                    }
                }

                let delBtn=event.target;
                let row=delBtn.parentNode.parentNode;
                let mbody=document.getElementsByClassName("dv-row");
                var index = Array.prototype.indexOf.call(mbody,row);
                let dataIndex=(curPage-1)*pageSize+index;
                let dataToCallback=optinos.data[dataIndex];       
             optinos.data.splice(dataIndex,1);
           
            //  页面中只有一条数据时的情况处理
            $(".dv-footer .dv-biaoji").text(`${curPage}/${getTotalPage(optinos)}`);
            $(".dv-total").text(`总记录数${optinos.data.length}`);
            loadData(optinos,curPage);
            if(optinos.data.length===0){
                renderEmpty();
            }
            if(typeof optinos.delEvent==="function"){
            optinos.delEvent(dataToCallback,dataIndex);
            }
            })
            $(".dv-btn-reflash").click(function(event){
                if(isUpdateing()){
                    return;
                };
                let curPage=$(".dv-footer .dv-biaoji").text();
                curPage=parseInt(curPage);
                let totalPgae=getTotalPage(optinos);
                let data=loadData(optinos,parseInt(curPage));
                $(".dv-footer .dv-biaoji").text(`${1}/${totalPgae}`);
                $(".dv-input").val("");
                
            })

            $(".dv-btn-search").click(function(event){
              let value=$(".dv-input").val();
              let filterData=searchData(optinos,value);
                $(".dv-input").val("");
                if(typeof optinos.searchEvent==="function"){
                optinos.searchEvent(filterData);
                }
            })

            



        },
        // 事件监听函数
        myOn:function(eventName,callback){
            if(this.optinos[eventName]=='undefined'){
                return;
            }
            this.optinos[eventName](callback);

        }
    }
    //将用户传入的配置与默认配置合并
    function config(opts,optinos){
        if(!opts) return optinos;
        for(var key in optinos){
            if(!!opts[key]){
                if(typeof optinos[key]==='object'||optinos[key] instanceof Array){
                    //深拷贝引用型数据
                    optinos[key]=JSON.parse(JSON.stringify(opts[key]))
                }
                else{
                    optinos[key]=opts[key]
                }
                
            }
        }

        return optinos;
    }
    // 模板字符串添加外部div
    function addDivContain(s,className){
        if(arguments.length===1){
            return `<div>`+s+"</div>";
        }
        else{
        return `<div class=${className}>`+s+"</div>";
        }
    }
    // 数据展示页面的模板字符串构建
    function renderData(optinos,curPage){
        let mainHtml="";
        var data=optinos.data;
        let pageSize=optinos.page.pageSize;
        let totalPgae=data.length/pageSize;

        // 数据分页截取
        if(curPage<totalPgae){          
        data=data.slice((curPage-1)*pageSize,pageSize*curPage)
        }else{
            data=data.slice((curPage-1)*pageSize);
        }

         //根据数据构建模板字符串
        for(let i=-1;i<pageSize;i++){
            let row="";  
        if(i<data.length){
            for(let j=0;j<optinos.headers.length;j++){
                let key=optinos.headers[j].filed;
                let width=optinos.headers[j].width;
                if(i==-1){
                row=row+`
                <div class="dv-filed" style="width: ${width}; "><span>${optinos.headers[j].name}</span></div>
                `;
                }
                else{
                row=row+`
                <div class="dv-filed" style="width: ${width}; "><span data-key=${key}>${data[i][key]}</span></div>
                `;
                }
            }
            if(optinos.operation.operationBar){
                if(i==-1){
                    row=row+`
                    <div class="dv-filed" style="width: 100px; "><span>操作</span></div>
                    `;
                }
                else{
                    row=row+`
                    <div class="dv-filed operation" style="width: 100px; ">
                    <a href="javascrpit:;" class="dv-update" data-id=${i} >${optinos.update.updateBar?"更改":""}</a>
                    <a href="javascrpit:;" class="dv-del" data-id=${i}>${optinos.del.delBar?"删除":""}</a>
                    </div>
                    `;
                }

            }
        }
        else{
            for(let j=0;j<optinos.headers.length;j++){
                let key=optinos.headers[j].filed;
                let width=optinos.headers[j].width;
                row=row+`
                <div class="dv-filed" style="width: ${width}; "><span>&nbsp;</span></div>
                `;
            }
            if(optinos.operation.operationBar){
                row=row+`
                <div class="dv-filed operation" style="width: 100px; ">
                <a href="javascrpit:;" class="dv-update" data-id=${i}  visibility: hidden;>${optinos.update.updateBar?"更改":""}</a>
                <a href="javascrpit:;" class="dv-del" data-id=${i}  visibility: hidden;>${optinos.del.delBar?"删除":""}</a>
                </div>
                `;
            }
        }

            if(i==-1){
                row=addDivContain(row,"dv-data-header")
            }
            else{
            row=addDivContain(row,"dv-row");
            }
            mainHtml=mainHtml+row+`
            `;
        }

        //模板字符串构建完成
        mainHtml=addDivContain(mainHtml,"dv-body");

        return mainHtml;
    }
    //数据的加载
    function loadData(optinos,curPage){
        var data=optinos.data;
        let pageSize=optinos.page.pageSize;
        let totalPgae=data.length/pageSize;
        //数据分页
        if(curPage<totalPgae){
        data=data.slice((curPage-1)*pageSize,pageSize*curPage)
        }else{
            data=data.slice((curPage-1)*pageSize);
        }


        let dvRows=document.querySelectorAll(".dv-row");
        for(let j=0;j<pageSize;j++){
            let row=dvRows[j];
            let spans=row.querySelectorAll("span");
                for(let i=0;i<spans.length;i++){
                    let key=spans[i].dataset.key;
                    if(j<data.length){
                    spans[i].innerText=data[j][key];
                    spans[i].style.visibility="visible";
                    }
                    else{
                        spans[i].innerText="******"
                        spans[i].style.visibility="hidden";
                    }
                   }
                //    操作区的显示控制
            if(j>=data.length){
                row.querySelectorAll("a").forEach((item)=>{
                    item.style.visibility="hidden";
                })
            }else{
                row.querySelectorAll("a").forEach((item)=>{
                    item.style.visibility="visible";
                })
            }

            
        }


        // data.forEach((item,index)=>{
        //     let row=dvRows[index];
        // let spans=row.querySelectorAll("span");

        // for(let i=0;i<spans.length;i++){
        //  let key=spans[i].dataset.key;
        //  spans[i].innerText=item[key];
        // }
        // });
        
        return data;
    }
    //获取当前的总页数
    function getTotalPage(optinos){
        var data=optinos.data;
        let pageSize=optinos.page.pageSize;
        let totalPgae=Math.ceil(parseFloat(data.length)/pageSize);
        return totalPgae;
    }
    // 判断是否处于更新状态
    function isUpdateing(){
        let input=document.getElementsByClassName("dv-updateInput");
       
        if(input.length>=1){
            alert("错误！请在更改完成后进行其他操作");
            return true;
        }
        else{
            return false;
        }
    }
    //当数据为空时的页面渲染
    function renderEmpty(){
        $(".dv-filed a").css("visibility","hidden");
        $(".dv-footer .dv-biaoji").text(`0/0`);

    }
    //数据的查询
    function searchData(optinos,key){
        let data=optinos.data;
        // let headers=optinos.headers;
        // let keys=[];
        // headers.forEach((item)=>{
        //     keys.push(item.filed);
        // })
        if(key===""){
            return [];
        }
        let reg=new RegExp(key,"g");
        let  filterData=data.filter((item,index)=>{
            let chekced=false;
            for(key in item){
                if(reg.test(item[key])){
                    chekced=true;
                }
            }

            return chekced;
        })
        if(filterData.length<1){
            return [];
        }
        let notPageFilterData=filterData;



        let pageSize=optinos.page.pageSize;
        let totalPgae=filterData.length/pageSize;
        let curPage=1;
        if(curPage<totalPgae){
            filterData=filterData.slice((curPage-1)*pageSize,pageSize*curPage)
        }else{
            filterData=filterData.slice((curPage-1)*pageSize);
        }


        let dvRows=document.querySelectorAll(".dv-row");
        for(let j=0;j<pageSize;j++){
            let row=dvRows[j];
            let spans=row.querySelectorAll("span");
                for(let i=0;i<spans.length;i++){
                    let key=spans[i].dataset.key;
                    if(j<filterData.length){
                    spans[i].innerText=filterData[j][key];
                    }
                    else{
                        spans[i].innerText="  "
                    }
                   }
                //    操作区的显示控制
            if(j>=filterData.length){
                row.querySelectorAll("a").forEach((item)=>{
                    item.style.visibility="hidden";
                })
            }else{
                row.querySelectorAll("a").forEach((item)=>{
                    item.style.visibility="visible";
                })
            }            
        }


        // data.forEach((item,index)=>{
        //     let row=dvRows[index];
        // let spans=row.querySelectorAll("span");

        // for(let i=0;i<spans.length;i++){
        //  let key=spans[i].dataset.key;
        //  spans[i].innerText=item[key];
        // }
        // });
        
        return notPageFilterData;

    }
    global.MyDataView = MyDataView;
}(this));