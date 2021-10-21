/**
 * JD双11赚汪汪币
 * 
 * Author: czj
 * Date: 2021/10/20
 * Time: 23:02:50
 * Versions: 1.1.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */

// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
var x = 878;
var y = 1242;
// 设置手机分辨率
var screenXY = dialogs.rawInput("请设置分辨率(逗号隔开，width,height)", "1080, 2400")
setScreenMetrics(screenXY.split(",")[0], screenXY.split(",")[1]);
console.log("设置手机分辨率为：" + screenXY);
init();

function init() {
    start();

    // 子线程开启计时
    threads.start(function () {
        if (interval == null) {
            // 开启计时器，进行卡顿计时
            // 启动定时器前，将计数器归为0
            JUDGE_TIME = 0;
            log("开启定时器");
            interval = setInterval(function () {
                JUDGE_TIME = JUDGE_TIME + 1;
            }, 1000);
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
function start() {
    auto.waitFor()
    var appName = "com.jingdong.app.mall";
    launch(appName);
    console.info("启动京东APP");
    console.show();
}

// 进入做任务界面
function enterActivity() {
    if (!text("累计任务奖励").exists()) {
        sleep(4000);
        while (true) {
            if (text("累计任务奖励").exists()) {
                console.info("打开做任务界面")
                break;
            } else {
                click(1034, 1658)
            }
            sleep(1000);
        }
    }
}

// 去完成任务
function viewTask() {
    // 根据坐标点击任务，判断哪些需要进行
    if (text("累计任务奖励").exists() && click(x, y)) {
        sleep(2000);
        while (true) {
            if ((textStartsWith("获得").exists() && textEndsWith("汪汪币").exists()) || text("已浏览").exists()) {
                console.info("任务完成，返回");
                viewAndFollow();
                // 重置计时
                JUDGE_TIME = 0;
                break;
            } else if (text("任务已达上限").exists()) {
                console.info("任务已达上限,切换已完成按钮");
                y = y + 250;
                viewAndFollow();
                // 重置计时
                JUDGE_TIME = 0;
                break;
            } else if (textContains('会员授权协议').exists()) {
                console.info("不授权加入会员，切换已完成按钮");
                y = y + 250;
                viewAndFollow();
                // 重置计时
                JUDGE_TIME = 0;
                break;
            } else if (textContains('当前页点击浏览5个').exists() || textContains('当前页浏览加购').exists()) {
                console.info("当前为加入购物车任务");
                break;
            } else if (text("互动种草城").exists()) {
                console.info("当前为互动种草城任务");
                if (interactionGrassPlanting()) {
                    break;
                }
                break;
            } else if (text("到底了，没有更多了～").exists() && !text("消息").exists() && !text("扫啊扫").exists()
            && !(textStartsWith("完成").exists() && textEndsWith("次").exists())) {
                console.info("到底了，没有更多了～");
                var dx = 137;
                var dy = 1831;
                var count = 0;
                while (true) {
                    if (click(dx, dy)) {
                        sleep(2000);
                        if (back()) {
                            sleep(2000);
                            console.info("浏览任务，点击返回");
                            count = count + 1;
                            if (5 <= count) {
                                swipe(807, 314, 807, 414, 1);
                                sleep(1000);
                            }
                        }
                    }
                }
            } else if (text("消息").exists() && text("扫啊扫").exists()) {
                console.warn("因为某些原因回到首页，重新进入活动界面");
                while (true) {
                    if (text("做任务赚汪汪币").exists()) {
                        console.info("进入活动界面")
                        break;
                    } else {
                        click(1057, 1673)
                    }
                    sleep(1000);
                }
            } else if (text("天天都能领").exists()) {
                if (click(580, 1600)) {
                    sleep(1000);
                    if (click(580, 1600)) {
                        console.log("点我收下");
                        if (back()) {
                            break;
                        }
                    }
                }
            } else if (text("邀请新朋友 更快赚现金").exists()) {
                if (click(960, 380)) {
                    if (click(580, 1600)) {
                        console.log("点我收下");
                        back();
                        break;
                    }
                }
            } else if (text('京东11.11热爱环...').exists()) {
                console.info("下单任务，跳过");
                back();
            }else {
                if (recoverApp()) {
                    break;
                }
            }
        }

    }

}

// 加入购物车
function addMarketCar() {
    if (textContains('当前页点击浏览5个').exists() || textContains('当前页浏览加购').exists()) {
        const productList = className('android.view.View').indexInParent(5).clickable().find();
        //const productList = className('android.widget.Button').depth(19).clickable().find()
        var count = 0;
        for (index = 0; index < productList.length; index++) {
            if (count == 5) {
                if (back()) {
                    sleep(1000)
                    count = 0;
                    break;
                }
            }
            if (productList[index].click()) {
                log("加入购物车任务:正在添加第" + (index + 1) + "个商品");
                sleep(2000);
                if (back()) {
                    count = count + 1;
                    sleep(2000);
                }
            }
        }
    }

}

// 互动种草城
function interactionGrassPlanting() {
    var count = 0;
    while (true) {
        if (click(850, 430)) {
            console.info("去逛逛");
            sleep(2000);
            if (back()) {
                count = count + 1;
                if (count == 5) {
                    return true;
                }
            }
        }
    }
    
}

// 返回
function viewAndFollow() {
    sleep(1000);
    back();
    sleep(1000);
}

// 自动判断程序是否卡顿，恢复方法
// 判断依据：1.不在活动界面 2.停留某个界面长达30s
function recoverApp() {
    if (!text("累计任务奖励").exists() && JUDGE_TIME > 30) {
        if (back()) {
            // 计时器重置
            JUDGE_TIME = 0;
            console.warn("停留某个页面超过30s,自动返回，重置定时器。");
            return true;
        }
    }
}

/**
 * Author: czj
 * Date: 2021/10/20
 * Time: 23:02:50
 * Github: https://github.com/czj2369/jd_tb_auto
 */