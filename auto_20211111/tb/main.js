/**
 * TB双11
 * 
 * Author: czj
 * Date: 2021/10/21 13:01:32
 * Versions: 1.5.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */

// 需要忽略的任务中包含的关键字
var IGNORE_LIST = ['农场', '芭芭农场', '下单', '蚂蚁森林', '淘特', '点淘', '充话费', '参与合伙', '喂小鸡', '斗地主', '续卡', '88VIP', '消消乐'];
// 过渡操作
var PASS_LIST = ['我再想想', '我知道了', '开心收下'];

var app_package = "com.taobao.taobao";
var app_name = "淘宝";

// 点击之后返回的任务
const BACK_LIST = [];
const GO_View = '去浏览';
const GO_FINISH = '去完成';
const GO_SEARCH = '去搜索';
// 返回标记
const FINISHED_TASK = ['任务完成', '全部完成啦', '喵糖已发放', '任务已完成'];
const VIEW_MOST = '去逛逛';
// 判定是否进入到喵糖总动员
var isEnterTaskUI = false;
// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;

var options = ["做任务", "掷骰子"];
var i = dialogs.select("请选择一个选项", options);
if (i >= 0) {
    console.info("您选择的是" + options[i]);
} else {
    toast("您取消了选择");
}

init();

/**
 * 初始化
 */
function init() {
    // 子线程监听脚本
    threads.start(function () {
        events.setKeyInterceptionEnabled("volume_up", true);
        //启用按键监听
        events.observeKey();
        //监听音量上键按下
        events.onKeyDown("volume_up", function (event) {
            console.log("脚本退出!")
            exit();
        });
    });

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

    if (0 == i) {
        while (true) {

            recoverApp();

            enterActivity();

            viewTask();

            transitioPperation();
        }
    } else {
        while (!enterMiaoTang() && !textContains("骰子").exists()) {

        }
        var textContent = textContains("骰子").findOnce().text();
        var count = textContent.split("，")[1];
        console.info("获取当前骰子数：", count);
        while (count > 0) {
            if (textContains("骰子").findOnce().click()) {
                // 计时器重置
                JUDGE_TIME = 0;
                count = count - 1;
                console.info("掷骰子,剩余次数：", count);
                sleep(5000);
            }
        }
        console.info("掷骰子任务结束");
        exit();
    }
}

/**
 * 启动淘宝
 */
function start() {
    auto.waitFor()

    console.info("author:czj");
    console.info("地址:https://github.com/czj2369/jd_tb_auto");
    if (launch(app_package)) {
        console.info("启动" + app_name + "APP");
    } else {
        console.info("请手动启动" + app_name + "APP")
    }

    console.show();
}

/**
 * 进入活动中心
 */
function enterActivity() {
    const SIGN_IN = '签到';
    const GET_REWARD = '领取奖励';
    const CUT_TEN_BILION = '赚糖';
    enterMiaoTang();

    // 签到
    if (text(SIGN_IN).exists()) {
        text(SIGN_IN).findOne().click();
    }

    //领取奖励
    if (text(GET_REWARD).exists()) {
        text(GET_REWARD).findOne().click();
    }

    // 进入做任务界面
    if (textContains(CUT_TEN_BILION).exists()) {
        var button = textContains(CUT_TEN_BILION).findOnce().bounds();
        click(button.centerX(), button.centerY());
    }

    if (isEnterTaskUI && !textContains(CUT_TEN_BILION).exists()) {
        if (back()) {
            isEnterTaskUI = false;
        }

    }
    return false;
}

/**
 * 进入喵糖总动员
 * @returns 
 */
function enterMiaoTang() {
    if (className('android.widget.FrameLayout').depth(17).indexInParent(14).clickable().find().length == 1) {
        console.info("进入喵糖总动员,稍等5s即刻开始任务");
        var button = className('android.widget.FrameLayout').depth(17).indexInParent(14).clickable().find()[0].bounds();
        click(button.centerX(), button.centerY());
        isEnterTaskUI = true;
        sleep(5000);
        return true;
    } else {
        if (desc("我的淘宝").exists() && desc("我的淘宝").findOne().click()) {
            sleep(3000);
            if (descContains("赢20亿红包").exists() && descContains("赢20亿红包").findOne().click()) {
                console.info("进入喵糖总动员,稍等7s即刻开始任务");
                isEnterTaskUI = true;
                sleep(7000);
                return true;
            }
        }
    }
}

/**
 * 完成查看任务
 */
function viewTask() {
    // 去完成
    if (text(GO_FINISH).exists()) {
        sleep(500);
        // 获取多个'去完成' 或者 '去浏览'
        var button = text(GO_FINISH).find();
        for (index = 0; index < button.length; index++) {
            var buttonParent = button[index].parent();
            // 遍历'去完成'或者'去浏览'的父控件下面的子控件，判断是否存在IGNORE_LIST中包含的文字，如果存在，不执行该任务，否则执行
            try {
                if (!recursionControl(buttonParent)) {
                    var isViewAndFollow = false;
                    // 判断是否直接返回
                    buttonParent.child(0).children().forEach(element => {
                        print(element.text())
                        for (i = 0; i < BACK_LIST.length; i++) {
                            if (element.text().indexOf(BACK_LIST[i]) >= 0) {
                                isViewAndFollow = true;
                            }
                        }
                    });

                    log("正在进行任务:" + buttonParent.child(0).children()[0].text());

                    if (isViewAndFollow) {
                        viewAndFollow();
                    }

                    button[index].click();
                    sleep(4000);
                    if (id("titlebar").exists()) {
                        huDong();
                    }
                    // 计时器重置
                    JUDGE_TIME = 0;
                    sleep(500)
                    break;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    // 去浏览
    if (text(GO_View).exists()) {
        sleep(500);
        text(GO_View).findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
        log("正在进行任务:" + text(GO_View).findOne().parent().child(0).children()[0].text());
        sleep(2000);
    }

    // 去搜索
    if (text(GO_SEARCH).exists()) {
        sleep(500);
        text(GO_SEARCH).findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
        log("正在进行任务:" + text(GO_SEARCH).findOne().parent().child(0).children()[0].text());
        sleep(2000);
    }

    // 去逛逛
    if (textContains(VIEW_MOST).exists()) {
        textContains(VIEW_MOST).findOnce().click();
        // 计时器重置
        JUDGE_TIME = 0;
        log("正在进行任务:" + textContains(VIEW_MOST).findOnce().parent().child(0).children()[0].text());
        sleep(2000);
    }

    // 天天去领钱
    if (text("打开链接").exists()) {
        text("打开链接").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
        sleep(2000);
    }
    isFinshed(FINISHED_TASK);

}

function customBack() {
    while (back()) {
        break;
    }
}

/**
 * 互动任务
 */
function huDong() {
    if (id("titlebar").exists()) {
        console.info("进入互动任务");
        var titleBarXY = id("titlebar").findOne().bounds();
        var x = titleBarXY.centerX();
        var y = titleBarXY.centerY();

        while (!textContains("执行").exists() && click(x, y)) {
            console.info("未点击到任务，重试");
            y = y + 50;
        }

        y = titleBarXY.centerY();

        while (textContains("喵糖+1").exists() && textContains("执行").exists() && click(x, y)) {
            console.info("点击屏幕");
            y = y + 50;
        }

    }
}

/**
 * 判断是不是完成任务
 * @param {控件名称} uiName 
 * @returns 
 */
function isFinshed(uiName) {
    for (i = 0; i < uiName.length; i++) {
        if (textContains(uiName[i]).exists() || descContains(uiName[i]).exists()) {
            back();
            sleep(500);
            break;
        }
    }

    return false;
}

// 递归遍历控件是否包含忽略的关键词
function recursionControl(parentControl) {
    var retFlag = false;
    // 遍历子控件是否包含忽略关键词
    parentControl.child(0).children().forEach(element => {
        for (ignoreIndex = 0; ignoreIndex < IGNORE_LIST.length; ignoreIndex++) {
            if (element.text().indexOf(IGNORE_LIST[ignoreIndex]) >= 0) {
                retFlag = true;
            }
        }
    });
    return retFlag;
}

/**
 * 返回
 */
function viewAndFollow() {
    sleep(1000);
    back();
    sleep(1000);
}

/**
 * 自动判断程序是否卡顿，恢复方法
 * 判断依据：1.不在活动界面 2.停留某个界面长达30s
 * @returns 
 */
function recoverApp() {
    if (!text("查看红包").exists() && JUDGE_TIME > 45) {
        if (back()) {
            // 计时器重置
            JUDGE_TIME = 0;
            console.warn("停留某个页面超过45s,自动返回，重置定时器。");
            return true;
        }
    } else {
        return false;
    }
}

/**
 * 过渡操作
 */
function transitioPperation() {
    for (let index = 0; index < PASS_LIST.length; index++) {
        if (text(PASS_LIST[index]).exists()) {
            text(PASS_LIST[index]).click();
            console.info("过渡操作：", PASS_LIST[index]);
            sleep(500);
        }
    }
}
/**
 * Author: czj
 * Date: 2021/10/21 13:01:32
 * Github: https://github.com/czj2369/jd_tb_auto
 */