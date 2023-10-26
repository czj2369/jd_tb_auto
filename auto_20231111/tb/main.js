/**
 * TB231111
 * 
 * Author: czj
 * Versions: 1.0.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */
// 任务序号
var TASK_ID = 0;
const appPackageName = "com.taobao.taobao";
// 忽略任务
const IGNORE_TASK_LIST = ['从首页入口回访', '支付宝', '淘宝乐园', '芭芭', '动物餐厅', '分享好友得金币', '蚂蚁森林', '火爆连连消', '兑换任务', '斗地主', '订阅互动', '开通省钱卡'];
const BACK_LIST = ['任务完成', '任务已经全部完成啦', '下单可获得额外喵果'];
const GAME_LIST = ['完成挑战', '挑战挑一挑任务', '可得互动奖励']
// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
// 任务进行中标记
var task_process = true;
init();
function init() {
    console.log("项目地址:https://github.com/czj2369/jd_tb_auto");
    console.log("音量上键结束脚本运行");
    console.log("如果程序无法自动进入活动页，请手动进入！")
    console.log("如果程序太久没有动静（半分钟内）,请结束脚本之后，重新启动脚本！")
    // 子线程监听音量上键按下
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
    // 子线程开启计时
    threads.start(function () {
        if (interval == null) {
            // 开启计时器，进行卡顿计时
            // 启动定时器前，将计数器归为0
            JUDGE_TIME = 0;
            console.log("开启定时器");
            interval = setInterval(function () {
                JUDGE_TIME = JUDGE_TIME + 1;
                //console.log("停留时间计时：", JUDGE_TIME);
                recoverApp();
            }, 1000);
        }
    });

    console.log("当前手机分辨率", device.width, device.height)
    // 设置分辨率
    // setScreenMetrics(720, 1560);
    console.log("设置手机脚本分辨率", 720, 1560)
    auto.waitFor();
    auto.setMode("normal");

    console.show();
    // 启动淘宝
    app.launch(appPackageName);

    // 启动任务
    while (true) {
        enterActivity();
        task_process = clikcFinish();
        while (task_process) {
            execTask();
        }
    }

}

/**
 * 进入活动界面
 */
function enterActivity() {
    if (desc("我的淘宝").exists() && desc("购物车").exists()) {
        desc("我的淘宝").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
    }

    if (text("瓜分10亿").exists()) {
        clickCenter("瓜分10亿")
        // 计时器重置
        JUDGE_TIME = 0;
    }

    if (textContains("11月10日 09:00开奖兑红包").exists()
        && textContains("瓜分十亿红包").exists()
        && !text("去完成").exists()) {
        console.log("点击做任务");
        clickCenterXY(186, 1275, 534, 1411)
        sleep(2000);
        // 计时器重置
        JUDGE_TIME = 0;
    }
}

/**
 * 
 * @returns 点击去完成O
 */
function clikcFinish() {
    try {
        const button = text("去完成").find()[TASK_ID];
        if (button != undefined) {
            const parentButton = button.parent();
            var taskName = parentButton.children()[0].children()[0].text();
            for (var i = 0; i < IGNORE_TASK_LIST.length; i++) {
                if (taskName.indexOf(IGNORE_TASK_LIST[i]) >= 0) {
                    TASK_ID++;
                    console.log("忽略当前任务:", taskName);
                    console.log("任务序号自增", TASK_ID);
                    return false;
                }
            }
            console.log("当前任务:", taskName);
            //sleep(2000);
            if (button.click()) {
                console.log("点击去完成");
                // 计时器重置
                JUDGE_TIME = 0;
                sleep(3000);
                return true;
            }
        }
    } catch (err) {
        return false;
    }
    return false;
}

/**
 * 执行任务
 * 
 * @returns 
 */
function execTask() {
    // 判断任务序号是否需要自增
    judgeAddTaskId();

    // 双十一喵果互动
    interactionMG();

    // 浏览任务
    viewTask();

    // 游戏任务
    gameTask();
}

/**
 * 判断任务序号是否需要自增
 */
function judgeAddTaskId() {
    if (text("浏览得奖励").exists()) {
        // 计时器重置
        JUDGE_TIME = 0;
    }
}

/**
 * 浏览任务
 */
function viewTask() {
    for (var i = 0; i < BACK_LIST.length; i++) {
        if (textContains(BACK_LIST[i]).exists() || descContains(BACK_LIST[i]).exists() || id("2542212460").exists()) {
            back();
            sleep(2000);
            // 计时器重置
            JUDGE_TIME = 0;
            console.log("浏览完成，返回");
            task_process = false;
            break;
        }
    }
}

/**
 * 双十一喵果互动
 */
function interactionMG() {
    if (text("双十一喵果互动").exists()) {
        text("允许").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
        task_process = false;
    }
}

/**
 * 做游戏任务
 */
function gameTask() {
    for (var i = 0; i < GAME_LIST.length; i++) {
        if (textContains(GAME_LIST[i]).exists()) {
            clickCenterXY(196, 1212, 524, 1344);
            clickCenterXY(104, 1088, 616, 1186);
            clickCenterXY(170, 1218, 550, 1394);
            back();
            // 计时器重置
            JUDGE_TIME = 0;
            return true;
        }
    }

}

/**
 * 点击控件中点
 * 
 * @param {*} uiName 
 * @param {*} type 
 * @param {*} index 
 * @returns 
 */
function clickCenter(uiName, type, index) {
    let type = type || 'text';
    let index = index || 0;
    try {
        const bounds = type == "desc" ? desc(uiName).find()[index].bounds() : text(uiName).find()[index].bounds();
    } catch (error) {
        return false;
    }
    console.log("点击坐标：", bounds.centerX(), bounds.centerY());
    // 计时器重置
    JUDGE_TIME = 0;
    return click(bounds.centerX(), bounds.centerY());
}

/**
 * 根据坐标直接点击
 * @param {*} bounds 
 * @returns 
 */
function clickCenterXY(x1, y1, x2, y2) {
    // 计时器重置
    JUDGE_TIME = 0;
    setScreenMetrics(720, 1560)
    console.log("点击坐标：", (x1 + x2) / 2, (y1 + y2) / 2);
    if (click((x1 + x2) / 2, (y1 + y2) / 2)) {
        setScreenMetrics(device.width, device.height);
        return true;
    } else {
        setScreenMetrics(device.width, device.height);
        return false;
    }

}

/**
 * 自动判断程序是否卡顿，恢复方法
 * 判断依据：1.不在活动界面 2.停留某个界面长达15s
 */
function recoverApp() {
    if (JUDGE_TIME > 25) {
        if (back()) {
            sleep(2000);
            task_process = false;
            // 计时器重置
            JUDGE_TIME = 0;
            app.launch(appPackageName);
            log("停留某个页面超过25s,自动返回，重置定时器。");
            console.log("当前任务序号：", TASK_ID)
            return true;
        }
    }
}
/**
* TB231111
*
* Author: czj
* Github: https://github.com/czj2369/jd_tb_auto
*/
