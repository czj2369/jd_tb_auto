// 需要忽略的任务中包含的关键字
const IGNORE_LIST = ['好友','成功入会','加入战队','参与可得2000金币','打怪兽'];
// 点击之后返回的任务
const BACK_LIST = ['浏览并关注','逛店可得','成功浏览可得1000金币'];
// 去完成按钮
const GO_FINISH = '去完成';
// 需要做的任务
const FINISHED_TASK = ['您所访问的页面不存在','全部完成啦',/获得\w+金币/,'已浏览'];

// 正在执行的任务
var CURRTENT_TASK = '';
// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
init();

function init() { 
    start();

    // 子线程开启计时
    threads.start(function(){
        if (interval == null) {
            // 开启计时器，进行卡顿计时
            // 启动定时器前，将计数器归为0
            JUDGE_TIME = 0;
            log("开启定时器");
            interval = setInterval(function(){
                JUDGE_TIME = JUDGE_TIME + 1;
                log("此时计数：" + JUDGE_TIME);
            },1000);
        }
    });
    
    while (true) {

        enterActivity();

        viewTask();

        addMarketCar();

        recoverApp();
    }

    
}

// 启动京东
function start(){
    auto.waitFor()
    var appName = "京东";
    launchApp(appName);
    console.show();
}

// 进入活动中心 JD这里需要手动进入下活动中心，故没有写代码
function enterActivity(){
    
    sleep(1000);
}

// 去浏览任务
function viewTask(){
    if(text(GO_FINISH).exists()) {
        sleep(500);
        // 获取多个'去完成'
        var button = text(GO_FINISH).find();
        for(index = 0;index < button.length;index++) {
            var buttonParent = button[index].parent();
            // 遍历'去完成'或者'去浏览'的父控件下面的子控件，判断是否存在IGNORE_LIST中包含的文字，如果存在，不执行该任务，否则执行
            if(!recursionControl(buttonParent)) {
                var isViewAndFollow = false;
                // 判断是否直接返回
                buttonParent.children().forEach(element => {
                    for(i=0;i<BACK_LIST.length;i++) {
                        if(element.text().indexOf(BACK_LIST[i]) >= 0) {
                            isViewAndFollow = true;
                        }
                    }
                });
                button[index].click();

                // 点击任务 重置计时
                JUDGE_TIME = 0;

                log("正在进行任务:" + buttonParent.children()[1].text());
                if(isViewAndFollow){
                    viewAndFollow();
                }
                
                sleep(500)
                break;
            }
        }
    }

    isFinshed(FINISHED_TASK);
}

// 判断是不是完成任务
function isFinshed(uiName){
    for(i = 0;i < uiName.length;i++) {
        if(textMatches(uiName[i]).exists() || descMatches(uiName[i]).exists()) {
            if(back()) {
                sleep(500);
                break;
            }
        }
    }
    
}

// 加入购物车
function addMarketCar(){
    if(textContains('当前页点购物车').exists()) {
        const productList = className('android.view.View').indexInParent(5).clickable().find();
        for(index = 0;index<productList.length;index++) {
            if(className('android.view.View').indexInParent(0).drawingOrder(0).depth(13).enabled().findOnce().childCount() == 5) {
                if(back()) {
                    sleep(1000)
                    break;
                }
            }
            if(productList[index].click()) {
                log("加入购物车任务:正在添加第" + (index+1) + "个商品");
                sleep(2000);
                if(back()){
                    sleep(1000); 
                }
            }
        }
    }


}

// 浏览并关注
function viewAndFollow(){
    sleep(1000);
    back();
    sleep(1000);
}

// 递归遍历控件是否包含忽略的关键词
function recursionControl(parentControl){
    // 控件下是否存在子控件
    var retFlag = false;
    parentControl.children().forEach(element => {
        for(ignoreIndex = 0;ignoreIndex < IGNORE_LIST.length;ignoreIndex++) {
            if(element.text().indexOf(IGNORE_LIST[ignoreIndex]) >= 0) {
                retFlag = true;
            }
        }
    });
    return retFlag;
}

function addJudgeTime(){
   
}

// 自动判断程序是否卡顿，恢复方法
// 判断依据：1.不在活动界面 2.停留某个界面长达30s
function recoverApp(){
    if (!text(GO_FINISH).exists() && JUDGE_TIME > 30) {
        if (back()) {
            // 计时器重置
            JUDGE_TIME = 0;
            log("停留某个页面超过30s,自动返回，关闭定时器。");
        }
    }
}

