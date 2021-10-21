/**
 * TB双11
 * 
 * Author: czj
 * Date: 2021/10/21 13:01:32
 * Versions: 1.0.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */

// 需要忽略的任务中包含的关键字
var IGNORE_LIST = ['农场', '芭芭农场','下单','蚂蚁','淘特','小互动','点淘','充话费','参与合伙'];
// 点击之后返回的任务
const BACK_LIST = [];
const GO_View = '去浏览';
const GO_FINISH = '去完成';
const GO_SEARCH = '去搜索';
// 需要做的任务
const FINISHED_TASK = ['任务完成','全部完成啦','喵糖已发放'];
const VIEW_MOST = '去逛逛';

init();

function init() { 
    start();

    while (true) {

        enterActivity();

        viewTask();

    }

    
}

// 启动淘宝
function start(){
    auto.waitFor()
    var appName = "com.taobao.taobao";
    launch(appName);
    console.info("启动淘宝APP");
    console.show();
}

// 进入活动中心
function enterActivity(){
    const GET_MIAO = '领喵币';
    const SIGN_IN = '签到';
    const GET_REWARD = '领取奖励';
    const CUT_TEN_BILION = '赚喵糖';
    if (className('android.widget.FrameLayout').depth(17).indexInParent(14).clickable().find().length == 1){
        console.info("进入喵糖总动员")
        var button = className('android.widget.FrameLayout').depth(17).indexInParent(14).clickable().find()[0].bounds();
        click(button.centerX(), button.centerY());
    }

    // 签到
    if (text(SIGN_IN).exists()){
        text(SIGN_IN).findOne().click();
    }

    //领取奖励
    if (text(GET_REWARD).exists()){
        text(GET_REWARD).findOne().click();
    }

    // 进入活动中心
    if(text(CUT_TEN_BILION).exists()) {
        var button =  text(CUT_TEN_BILION).findOnce().bounds();
        click(button.centerX(), button.centerY());
    }
}

// 任务
function viewTask(){
    // 去完成
    if(text(GO_FINISH).exists()) {
        sleep(500);
        // 获取多个'去完成' 或者 '去浏览'
        var button = text(GO_FINISH).find();
        for(index = 0;index < button.length;index++) {
            var buttonParent = button[index].parent();
            // 遍历'去完成'或者'去浏览'的父控件下面的子控件，判断是否存在IGNORE_LIST中包含的文字，如果存在，不执行该任务，否则执行
            if(!recursionControl(buttonParent)) {
                var isViewAndFollow = false;
                // 判断是否直接返回
                buttonParent.child(0).children().forEach(element => {
                    print(element.text())
                    for(i=0;i<BACK_LIST.length;i++) {
                        if(element.text().indexOf(BACK_LIST[i]) >= 0) {
                            isViewAndFollow = true;
                        }
                    }
                });

                log("正在进行任务:" + buttonParent.child(0).children()[0].text());
                if(isViewAndFollow){
                    viewAndFollow();
                }

                button[index].click();
                sleep(500)
                break;
            }
        }
    }

    // 去浏览
    if(text(GO_View).exists()) {
        sleep(500);
        text(GO_View).findOne().click();
        log("正在进行任务:" + text(GO_View).findOne().parent().child(0).children()[0].text());
        sleep(2000);
    }

    // 去搜索
    if(text(GO_SEARCH).exists()) {
        sleep(500);
        text(GO_SEARCH).findOne().click();
        log("正在进行任务:" + text(GO_SEARCH).findOne().parent().child(0).children()[0].text());
        sleep(2000);
    }

    // 去逛逛
    if(textContains(VIEW_MOST).exists()){
        textContains(VIEW_MOST).findOnce().click();
        log("正在进行任务:" + textContains(VIEW_MOST).findOnce().parent().child(0).children()[0].text());
        sleep(2000);
    }
    
    isFinshed(FINISHED_TASK);

}

function customBack(){
    while(back()) {
        break;
    }
}

// 判断是不是完成任务
function isFinshed(uiName){
    for(i = 0;i < uiName.length;i++) {
        if(textContains(uiName[i]).exists() || descContains(uiName[i]).exists()) {
            back();
            sleep(500);
        }
    }
    
    
    return false;
}

// 递归遍历控件是否包含忽略的关键词
function recursionControl(parentControl){
    var retFlag = false;
    // 遍历子控件是否包含忽略关键词
    parentControl.child(0).children().forEach(element => {
        for(ignoreIndex = 0;ignoreIndex < IGNORE_LIST.length;ignoreIndex++) {
            if(element.text().indexOf(IGNORE_LIST[ignoreIndex]) >= 0) {
                retFlag = true;
            }
        }
    });
    return retFlag;
}

// 返回
function viewAndFollow(){
    sleep(1000);
    back();
    sleep(1000);
}

/**
 * Author: czj
 * Date: 2021/10/21 13:01:32
 * Github: https://github.com/czj2369/jd_tb_auto
 */