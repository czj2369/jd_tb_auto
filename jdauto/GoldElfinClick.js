auto.waitFor();
var appName = "京东";

// 建立一个循环，不断的检测里面控件的存在并且做出对应操作
while(true){
    // 打开京东APP
    launchApp(appName);
    // 睡眠3秒，等待程序加载
    sleep(3000);
    // 进入京东主界面，检查是否存在“我的”右下角，如果存在，点击进去，接着判断是否存在全民叠蛋糕活动，如果有则点击进入
    if(descContains("我的").exists()){
        log("进入我的界面");
        descContains("我的").findOne().click();
        sleep(2000);
        // 判断是否有全民叠蛋糕活动
        if(textContains("叠蛋糕分").exists()){
            log("进入叠蛋糕界面");
            if(idContains("ur").exists()){
                idContains("ur").findOne().click();
            }else if(idContains("ur").exists()){
                idContains("us").findOne().click();
            }
        }
        sleep(2000);
    }
    
    // 不断点击金小人
    while(idContains("goldElfin").exists() && !textContains("去完成").exists()){
        idContains("goldElfin").findOne().click();
    }
}