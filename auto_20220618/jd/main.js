/**
 * JD618
 * 
 * Author: czj
 * Date: 2022/06/04
 * Versions: 1.1.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */
const sleepTime = 500;
const speed = 2;

// 点击之后返回的任务
const BACK_LIST = ['浏览并关注可得', '逛店可得', '成功浏览可得1000金币', '浏览可得2000', '浏览可得3000', '获得7000金币', '去组队可得6000'];
// 去完成按钮
const NEED_FININSH_TASK_LIST = [/去.+\)/, /领点点券.+\)/, /签到领.+\)/, /逛众筹.+\)/];
// 需要做的任务
const FINISHED_TASK = ['您所访问的页面不存在', '全部完成啦', /获得\w+金币/, '已浏览', '已达上限'];

// 判断停留时间
var JUDGE_TIME = 0;
// 操作记录数，每操作五次返回刷新界面一次
var operCount = 0;
// 定时器
var interval;

var taskCount = null;

init();

function init() {
    start();
    console.log("项目地址:https://github.com/czj2369/jd_tb_auto");
    console.log("音量上键结束脚本运行")
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

        recoverApp();

        refreshUI();
    }


}

// 启动京东
function start() {
    auto.waitFor()
    var appName = "com.jingdong.app.mall";
    app.launchPackage(appName);
    log("启动JD成功");
    console.show();
}

// 进入活动中心 JD这里需要手动进入下活动中心，故没有写代码
function enterActivity() {
    sleep(sleepTime * speed);
    if (!textContains("做任务 赚金币").exists()) {
        sleep(sleepTime * speed * 2);
        var p = text("抽奖").findOne().parent().parent().parent().parent();

        if (null != p.children()[5]) {
            var bounds = p.children()[5].bounds();
            if (click(bounds.centerX(), bounds.centerY())) {
                sleep(sleepTime * speed);
                console.log("进入活动界面");
            }
        }

    }
}

/**
 * 去浏览任务
 */
function viewTask() {
    NEED_FININSH_TASK_LIST.forEach(item => {
        if (taskCount == null || textContains("做任务 赚金币").exists()) {
            taskCount = textMatches(item).find();
            for (var i = 0; i < taskCount.length; i++) {
                sleep(sleepTime * speed);
                var par = taskCount[i];
                if (par != null && par.parent() != null && par.parent().childCount() >= 3) {
                    par = par.parent();
                    // 获取去完成按钮
                    var button = par.children()[3];
                    if (par.children()[2] != null) {
                        sleep(sleepTime);
                        var buttonText = par.children()[2].text();
                        goTask(button, buttonText);
                    }
    
                }
            }
        }
    });
}

/**
 * 执行任务
 * @param {*} button 任务界面的完成按钮
 * @param {*} par 完成按钮的父类控件
 * @returns 
 */
function goTask(button, buttonText) {
    log("正在进行任务: " + buttonText);
    while (true) {

        if (buttonText.indexOf("参与下单返现金") >= 0 || buttonText.indexOf("浏览5个品牌墙") >= 0) {
            break;
        }
        button.click();
        JUDGE_TIME = 0;
        
        sleep(sleepTime * speed * 4);
        if (textContains("确认授权").exists() || textContains("会员卡详情").exists()) {
            if (!textContains("做任务 赚金币").exists() && back()) {
                sleep(sleepTime * speed);
                break;
            }
        }

        var isViewAndFollow = false;
        for (i = 0; i < BACK_LIST.length; i++) {
            if (buttonText.indexOf(BACK_LIST[i]) >= 0) {
                isViewAndFollow = true;
                break;
            }
        }

        if (isViewAndFollow) {
            viewAndFollow();
            break;
        }

        if (textContains("当前页点击浏览").exists() && textStartsWith("¥").find().length > 0) {
            var product = textStartsWith("¥").find()[0].parent().parent().parent().childCount();
            if (product >= 4) {
                log("进入浏览任务")
                for (var i = 0; i <= 3; i++) {
                    if (textStartsWith("¥").find()[i].parent().parent().children()[4].click()) {
                        sleep(sleepTime * speed);
                        log("加购并返回");
                        while (!textContains("当前页点击浏览").exists() && back()) {
                            sleep(sleepTime * speed * 2);
                        }
                    }
                }
                viewAndFollow();
                break;
            }
        }

        if (isFinshed(FINISHED_TASK)) {
            viewAndFollow();
            break;
        }

        if (buttonText.indexOf("去参与小程序") >= 0) {
            sleep(sleepTime * speed);
            launchPackage("com.jingdong.app.mall")
            sleep(sleepTime * speed);
            break;
        }

        if (textContains("当前页浏览加购").exists() && textStartsWith("¥").find().length > 0) {
            addMarketCar();
            viewAndFollow();
            break;
        }

        if (textContains("品牌种草城").exists()) {
            for (var j = 0; j < 4; j++) {
                if (textContains("喜欢").exists() && textContains("喜欢").click()) {
                    sleep(sleepTime * speed);
                    while (!textContains("喜欢").click() && back()) {
                        sleep(sleepTime * speed);
                    }

                }
            }
            break;
        }
        if (buttonText.indexOf("点击首页浮层") >= 0) {
            break;
        }
        if (JUDGE_TIME > 30) {
            break;
        }

    }

    while (!textContains("做任务 赚金币").exists() && back()) {
        sleep(sleepTime * speed);
    }
    log("任务结束: " + buttonText);
}

// 判断是不是完成任务
function isFinshed(uiName) {
    for (i = 0; i < uiName.length; i++) {
        if (textMatches(uiName[i]).exists() || descMatches(uiName[i]).exists()) {
            return true;
        }
    }
    return false;

}

/**
 * 加入购物车
 */
function addMarketCar() {
    var product = textStartsWith("¥").find()[0].parent().parent().parent().childCount();
    if (product >= 4) {
        log("进入加入购物车任务")
        for (var i = 0; i <= 3; i++) {
            if (textStartsWith("¥").find()[i].parent().parent().children()[4].click()) {
                sleep(sleepTime * speed);
                log("加购并返回");
                while (!textContains("当前页浏览加购").exists() && back()) {
                    sleep(sleepTime * speed * 2);
                }
            }
        }
    }
}

// 返回
function viewAndFollow() {
    if (back()) {
        sleep(sleepTime * speed);
        JUDGE_TIME = 0;
    }
}

// 递归遍历控件是否包含忽略的关键词
function recursionControl(parentControl) {
    var retFlag = false;
    // 遍历子控件是否包含忽略关键词
    parentControl.children().forEach(element => {
        for (ignoreIndex = 0; ignoreIndex < IGNORE_LIST.length; ignoreIndex++) {
            if (element.text().indexOf(IGNORE_LIST[ignoreIndex]) >= 0) {
                retFlag = true;
            }
        }
    });
    return retFlag;
}

/**
 * 刷新活动界面
 */
function refreshUI() {
    if (textContains("做任务 赚金币").findOne().parent().children()[1].click()) {
        sleep(sleepTime * speed * 4);
        var p = text("抽奖").findOne().parent().parent().parent().parent();

        if (null != p.children()[5]) {
            var bounds = p.children()[5].bounds();
            click(bounds.centerX(), bounds.centerY());
            sleep(sleepTime * speed);
            console.log("刷新界面");
        }

    }

}

// 自动判断程序是否卡顿，恢复方法
// 判断依据：1.不在活动界面 2.停留某个界面长达30s
function recoverApp() {
    if (JUDGE_TIME > 30) {
        if (back()) {
            // 计时器重置
            JUDGE_TIME = 0;
            log("停留某个页面超过30s,自动返回，关闭定时器。");
        }
    }
}
/**
 * JD618
 *
 * Author: czj
 * Date: 2022/06/04
 * Versions: 1.1.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */
