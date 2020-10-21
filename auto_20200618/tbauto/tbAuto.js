auto.waitFor();
var appName = "手机淘宝";

// 建立一个循环，不断的检测里面控件的存在并且做出对应操作
while(true){
    // 打开淘宝APP
    launchApp(appName);
    
    // 判断是否有瓜分10亿
    if(className("android.widget.FrameLayout").depth(12).indexInParent(5).exists()){
        log("进入瓜分10亿界面");
        className("android.widget.FrameLayout").depth(12).indexInParent(5).findOne().click();
        sleep(1500);
    }   
    
    if(textContains("收下祝福").exists()){
        log("收下祝福");
        textContains("收下祝福").findOne().click();
    }
    // 签到
    if(textContains("签到").exists()){
        log("签到");
        textContains("签到").findOne().click()
    }
    // 进入活动界面，点击中间的“做任务领金币”控件，进入任务界面
    if(textContains("做任务").exists() && !textContains("去完成").exists() && !textContains("去浏览").exists()){
        log("进入活动界面并且点击做任务按钮");
        textContains("做任务").findOne().click();
        sleep(1500);
    }

    // 进入任务界面，判断已完成控件，如果存在则点击
    if(textContains("去完成").exists()){
        log("进入去完成任务界面");
        textContains("去完成").findOne().click();
        sleep(2000);
    }
    if(textContains("去浏览").exists()){
        log("去浏览");
        textContains("去浏览").findOne().click();
        sleep(2000);
    }
    
    // 参与列车活动
    if(textContains("去参与").exists()){
        log("参与列车活动");
        textContains("去参与").findOne().click();
        sleep(2000);
    }

    if(textContains("我的战报").exists()){
        textContains("返回").findOne().click();
    }

    if(textContains("去逛逛").exists()){
        log("去逛逛");
        if(textContains("去逛逛").find()[1]){
            textContains("去逛逛").find()[1].click();
        }else if(textContains("去逛逛").find()[0]){
            textContains("去逛逛").find()[0].click();
        }
        sleep(2000);
    }
    
    if(descContains("任务已完成").exists() || textContains("任务已完成").exists() || 
    textContains("继续逛逛吧").exists() || descContains("继续逛逛吧").exists() || descContains("任务完成").exists()
    ||descContains("返回看看").exists() || descContains("请返回重试").exists() || textContains("请返回重试").exists()){
        back();
        log("直接返回");
        continue;
    }
    sleep(1500);

}