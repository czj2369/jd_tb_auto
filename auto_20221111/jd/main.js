/**
 * JD221111
 * 
 * Author: czj
 * Versions: 1.0.3
 * Github: https://github.com/czj2369/jd_tb_auto
 */
// 任务序号
var TASK_ID = 0;
const appPackageName = "com.jingdong.app.mall";
// 干扰选项
const INTERFERE_TASK_LIST = ['预约抽红包', '立即抽奖', '继续环游', '恭喜获得奖励']
// 忽略任务
const IGNORE_TASK_LIST = ['授权信息', '确认授权', '下单再得'];
const BACK_LIST = ['获得8000金币', '获得7000金币', '获得4000金币', '获得3000金币'];
// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
// 任务进行中标记
var task_process = true;
// 是否为品牌墙任务
var is_pp = false;
// 是否领取奖励
var is_get_reward = false;
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
    setScreenMetrics(1090, 1920);
    console.log("设置手机脚本分辨率", 1090, 1920)
    auto.waitFor();
    auto.setMode("normal");

    console.show();
    // 启动京东
    app.launch(appPackageName);

    // 启动任务
    while (true) {
        task_process = clikcFinish();
        enterActivity();
        while (task_process) {
            execTask();
        }
    }

}

/**
 * 进入活动界面
 */
function enterActivity() {
    if (desc("浮层活动").exists() && text("购物车").exists()) {
        const rect = desc("浮层活动").findOne().bounds();
        click(rect.centerX(), rect.centerY());
        sleep(500)
        click(rect.centerX(), rect.centerY());
        // 计时器重置
        JUDGE_TIME = 0;
    }
    if (textContains("距离下次抽到分红").exists() && !text("做任务 赚金币").exists()) {
        console.log("点击做任务")
        clickCenterXY(855, 1893, 1035, 1920);
        sleep(2000);
        clickCenterXY(855, 1893, 1035, 1920);
        // 计时器重置
        JUDGE_TIME = 0;
    }
}

/**
 * 
 * @returns 点击去完成
 */
function clikcFinish() {

    for (var i = 0; i < INTERFERE_TASK_LIST.length; i++) {
        if (text(INTERFERE_TASK_LIST[i]).exists()) {
            back();
            sleep(1000);
            break;
        }
    }

    if (textContains("去打卡").exists()) {
        const daka = textContains("去打卡").findOne().bounds();
        click(daka.centerX(), daka.centerY());
    }


    if (text("当前进度：10/10").exists() && !is_get_reward) {
        clickCenterXY(516, 648, 606, 684);
        clickCenterXY(705, 648, 792, 684);
        clickCenterXY(891, 648, 981, 684);
        is_get_reward = true;
    }

    const button = text("去完成").find()[TASK_ID];
    if (button != undefined) {
        const rect = button.bounds()
        const parentButton = button.parent();
        for (var i = 0; i < parentButton.childCount(); i++) {
            var b = parentButton.children()[i].bounds();
            if (rect.centerX() == b.centerX() && rect.centerY() == b.centerY()) {
                const info = parentButton.children()[i - 1];
                console.log("当前任务:", info.children()[1].text());
                if (info.children()[1].text().indexOf("浏览5个品牌墙店铺") >= 0) {
                    is_pp = true;
                }

            }
        }
        //sleep(2000);
        if (click(rect.centerX(), rect.centerY())) {
            console.log("点击去完成");
            // 计时器重置
            JUDGE_TIME = 0;
            sleep(3000);
            return true;
        }
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

    // 滑动任务
    swipeTask();

    // 浏览商品任务
    viewProduct();

    // 加购任务
    addCarTask();

    // 种草城任务
    viewBrankTask();

    // 浏览品牌商店任务
    viewBrankShopTask();

}

/**
 * 判断任务序号是否需要自增
 */
function judgeAddTaskId() {
    for (var j = 0; j < IGNORE_TASK_LIST.length; j++) {
        if (textContains(IGNORE_TASK_LIST[j]).exists()) {
            TASK_ID++;
            if (TASK_ID >= 3) {
                TASK_ID = 0;
            }
            console.log("任务序号自增:", TASK_ID)
            back();
            sleep(1000);
            // 计时器重置
            JUDGE_TIME = 0;
            task_process = false;
            break;
        }
    }
}

/**
 * 滑动任务
 */
function swipeTask() {
    if (textContains("滑动浏览").exists() && !text("去完成").exists()) {
        if (swipe(971, 1610, 989, 1135, 300)) {
            // 计时器重置
            JUDGE_TIME = 0;
            for (var i = 0; i < BACK_LIST.length; i++) {
                if (text(BACK_LIST[i]).exists()) {
                    isReturn = true;
                    back();
                    task_process = false;
                    // 计时器重置
                    JUDGE_TIME = 0;
                    sleep(2000);
                    break;
                }
            }
        }
    }
}

/**
 * 浏览商品任务
 */
function viewProduct() {
    if (text("当前页点击浏览4个商品领金币5000金币").exists()) {
        console.log("浏览4个商品任务");
        const list = textContains("¥").find();
        const ret = list[0].bounds();
        if (click(ret.centerX(), ret.centerY())) {
            sleep(2000);
            while (text("购物车").exists()) {
                sleep(2000);
                back();
                break;
            }
            sleep(2000);
        }
        back();
        // 计时器重置
        JUDGE_TIME = 0;
        task_process = false;
        sleep(2000);
    }
}

/**
 * 加购任务
 */
function addCarTask() {
    if (text("当前页浏览加购4个商品领4000金币").exists()) {
        console.log("浏览4个商品任务");
        if (clickCenterXY(315, 1098, 501, 1182)) {
            sleep(2000);
            while (text("购物车").exists()) {
                sleep(2000);
                back();
                break;
            }
            sleep(2000);
        }
        back();
        // 计时器重置
        JUDGE_TIME = 0;
        task_process = false;
        sleep(2000);
    }
}

/**
 * 浏览品牌商店任务
 */
function viewBrankShopTask() {
    if (is_pp) {
        clickCenterXY(63, 867, 240, 957);
        sleep(2000);
        back();
        sleep(2000);
        clickCenterXY(324, 867, 498, 957);
        sleep(2000);
        back();
        sleep(2000);
        clickCenterXY(582, 867, 756, 957);
        sleep(2000);
        back();
        sleep(2000);
        clickCenterXY(840, 867, 1017, 957);
        sleep(2000);
        back();
        sleep(2000);
        clickCenterXY(63, 1062, 240, 1152);
        is_pp = false;
        // 计时器重置
        JUDGE_TIME = 0;
        task_process = false;
    }
}

/**
 * 种草城任务
 */
function viewBrankTask() {
    if (text("品牌种草城").exists()) {
        var i = 0;
        while (i <= 4) {
            if (clickCenterXY(540, 1746, 1029, 1920)) {
                sleep(2000);
                back();
                i++;
                sleep(2000);
            }
            if (i == 5) {
                back();
                // 计时器重置
                JUDGE_TIME = 0;
                task_process = false;
            }
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
    return click((x1 + x2) / 2, (y1 + y2) / 2);
}

/**
 * 自动判断程序是否卡顿，恢复方法
 * 判断依据：1.不在活动界面 2.停留某个界面长达15s
 */
function recoverApp() {
    if (JUDGE_TIME > 15) {
        if (back()) {
            sleep(2000);
            task_process = false;
            // 计时器重置
            JUDGE_TIME = 0;
            app.launch(appPackageName);
            console.log("停留某个页面超过15s,自动返回，重置定时器。");
            console.log("当前任务序号：", TASK_ID)
            return true;
        }
    }
}
 /**
* JD221111
*
* Author: czj
* Versions: 1.0.3
* Github: https://github.com/czj2369/jd_tb_auto
*/
