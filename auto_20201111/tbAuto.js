auto.waitFor();
var appName = "手机淘宝";
var finishIndex = 0;
console.show();
// 建立一个循环，不断的检测里面控件的存在并且做出对应操作
while(true){
    // 打开淘宝APP
    launchApp(appName);
    
    // 保证进入'淘宝特价版'这个界面后仍然能够正常运行
    finishIndexAdd();

    // 点击'我的淘宝'
    clickByDescName("我的淘宝");

    // 点击'养猫分20亿'
    clickByDescName("养猫分20亿");

    // 点击'赚喵币'
    clickByTextName("赚喵币");

    // 点击'领取奖励'
    clickByTextName("领取奖励");
    // 点击'签到'
    clickByTextName("签到");
    // 点击'去浏览'
    clickByTextName("去浏览");
    // 点击'去搜索'
    clickByTextName("去搜索");
    // 点击'去搜索'
    clickByTextName("去观看");
    // 点击'去完成'
    clickByTextName("去完成");
    // 点击'去完成'
    clickByTextName("去逛逛");
    sleep(1500);
    
    backByFinish()

}

// 通过描述获取控件并点击
function clickByDescName(descName){
    if(descContains(descName).exists()){
        log("进入"+descName+"界面");
        descContains(descName).findOne().click();
        sleep(1500);
    }
}

// 通过文本获取控件并点击
function clickByTextName(textName){
    
    if(textName == "签到" && textContains("每日签到领喵币")){
        if(textContains(textName).exists()){
            textContains(textName).findOne().click();
            log("进入"+textName+"界面");
            sleep(1500);
        }
        return;
    }
    if(textName == "去完成"){
        if(textContains("淘宝特价版").exists() || textContains("邀请好友一起撸猫").exists()){
            if(textContains(textName).find()[finishIndex]!=null){
                textContains(textName).find()[finishIndex].click();
                log("进入"+textName+"界面");
                sleep(1500);
            }
            return;
        }
        
    }
    if(textContains(textName).exists()){
        textContains(textName).findOne().click();
        log("进入"+textName+"界面");
        sleep(1500);
    }
    
}

// 判断是否需要返回
function backByFinish(){
    if(textContains("任务完成").exists() || textContains("全部完成啦").exists() ||
    descContains("任务完成").exists() || textContains("任务已完成").exists() ||
    descContains("继续退出").exists() || descContains("全部完成啦").exists() || 
    textContains("当面分享").exists() || textContains("当面扫码").exists() || 
    textContains("请返回重试").exists() || textContains("继续逛逛吧").exists() ||
    textContains("了解Ta").exists()){
        log("返回上层");
        back();
        sleep(1500);
    }
}

// 判断是否需要将'去完成'的下标修改
function finishIndexAdd(){
    if((textContains("淘宝特价版送红包").exists() && textContains("为保证喵币正常发放").exists()) ||
    textContains("快和我一起撸猫").exists()){
        if(back()){
            finishIndex = finishIndex + 1;
        }
    }
    if(textContains("去完成").find()[2]!=null || textContains("去完成").find()[1]!=null){
        finishIndex = 0;
    }
}

