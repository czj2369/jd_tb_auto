// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
var x = 878;
var y = 1242;
setScreenMetrics(1080, 2400);
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
            },1000);
        }
    });
    
    while (true) {

        enterActivity();

        viewTask();

        addMarketCar();
    }

    
}

// 启动京东
function start(){
    auto.waitFor()
    var appName = "com.jingdong.app.mall";
    launch(appName);
    console.info("启动京东");
    console.show();
}

// 进入活动中心 JD这里需要手动进入下活动中心，故没有写代码
function enterActivity(){
    
    sleep(1000);
}
// 去浏览任务
function viewTask(){
    // 始终点击第二个任务
    if (click(x, y)) {
        sleep(3000);
        while (true) {
            if (textStartsWith("获得").exists() && textEndsWith("汪汪币").exists()) {
                console.log("任务完成，返回");
                viewAndFollow();
                // 重置计时
                JUDGE_TIME = 0;
                break;
            }else if (text("任务已达上限").exists()) {
                console.info("任务已达上限,切换已完成按钮");
                y = y + 250;
                viewAndFollow();
                // 重置计时
                JUDGE_TIME = 0;
                break;
            }else if (textContains('会员授权协议').exists()){
                console.info("不授权加入会员，切换已完成按钮");
                y = y + 250;
                viewAndFollow();
                // 重置计时
                JUDGE_TIME = 0;
                break;
            }else if (textContains('当前页点击浏览5个').exists() || textContains('当前页浏览加购').exists()) {
                console.info("当前为加入购物车任务");
                break;
            }else if (text("互动种草城").exists()) {
                console.info("当前为互动种草城任务");
                if (interactionGrassPlanting()) {
                    break;
                }
                break;
            }else if (text("到底了，没有更多了～").exists() && text("累计任务奖励").exists()) {
                console.info("到底了，没有更多了～");
                var dx = 137;
                var dy = 1831;
                var count = 0;
                while (true) {
                    if (click(dx ,dy)) {
                        sleep(2000);
                        if (back()) {
                            console.info("浏览任务，点击返回");
                            count = count + 1;
                            if (5 == count) {
                                swipe(533, 314, 536, 414, 1);
                                sleep(1000);
                                if (click(930, 1591)) {
                                    if (text("累计任务奖励").exists()) {
                                        break;
                                    }else {
                                        click(930, 1591)
                                    }
                                }
                                
                            }
                        }
                    }
                }
            }else {
                if (recoverApp()) {
                    console.info("点击去完成之后，界面无变化30S");
                    break;
                }
            }
        }
        
    }

}

// 加入购物车
function addMarketCar(){
    if(textContains('当前页点击浏览5个').exists() || textContains('当前页浏览加购').exists()) {
        const productList = className('android.view.View').indexInParent(5).clickable().find();
        var count = 0;
        for(index = 0;index<productList.length;index++) {
            if(count == 5) {
                if(back()) {
                    sleep(1000)
                    count = 0;
                    break;
                }
            }
            if(productList[index].click()) {
                log("加入购物车任务:正在添加第" + (index+1) + "个商品");
                sleep(2000);
                if(back()){
                    count = count + 1;
                    sleep(1000); 
                }
            }
        }
    }

}

// 互动种草城
function interactionGrassPlanting() {
    if (text("去逛逛").exists()) {
        var count = 0;
        while(true) {
            if (text("去逛逛").findOne().click()) {
                sleep(1000);
                if (back()) {
                    count = count + 1;
                    if (count == 5) {
                        return true;
                    }
                }
            }
        }
    }
}

// 返回
function viewAndFollow(){
    sleep(1000);
    back();
    sleep(1000);
}

// 自动判断程序是否卡顿，恢复方法
// 判断依据：1.不在活动界面 2.停留某个界面长达30s
function recoverApp(){
    if (!text("累计任务奖励").exists() && JUDGE_TIME > 30) {
        if (back()) {
            // 计时器重置
            JUDGE_TIME = 0;
            log("停留某个页面超过30s,自动返回，关闭定时器。");
            return true;
        }
    }
}

