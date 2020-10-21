auto.waitFor();
var appName = "手机淘宝";

// 建立一个循环，不断的检测里面控件的存在并且做出对应操作
while(true){
    // 打开淘宝APP
    launchApp(appName);
    
    // 点击'我的淘宝'
    clickByDescName("我的淘宝");

    // 点击'养猫分20亿'
    clickByDescName("养猫分20亿");

    // 点击'赚喵币'
    clickByTextName("赚喵币");

    // 点击'去完成'
    clickByTextName("去完成");
    sleep(1500);

    // 点击'领取奖励'
    clickByTextName("领取奖励");
    // 点击'去浏览'
    clickByTextName("去浏览");
    // 点击'去搜索'
    clickByTextName("去搜索");
    sleep(1500);

    backByFinish()

}

// 通过描述获取控件并点击
function clickByDescName(descName){
    if(descContains(descName).exists()){
        log("进入"+descName+"界面");
        descContains(descName).findOne().click();
    }
}

// 通过文本获取控件并点击
function clickByTextName(textName){
    if(textName == "去完成" && textContains("邀请好友一起撸猫").exists()){
        if(textContains("淘宝特价版").exists()){
            if(textContains(textName).find()[2]!=null){
                textContains(textName).find()[2].click();
            }
            return;
        }
        if(textContains(textName).find()[1]!=null){
            textContains(textName).find()[1].click();
            return;
        }
        return;
    }
    if(textContains(textName).exists()){
        log("进入"+textName+"界面");
        textContains(textName).findOne().click();
    }
    
}

// 判断是否需要返回
function backByFinish(){
    if(textContains("任务完成").exists() || textContains("全部完成啦").exists() ||
    descContains("任务完成").exists() || textContains("任务已完成").exists() ||
    descContains("继续退出").exists()){
        log("返回上层");
        back();
    }
}

