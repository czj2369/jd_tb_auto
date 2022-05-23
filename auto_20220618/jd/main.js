/**
 * JD618
 * 
 * Author: czj
 * Date: 2022/05/24
 * Versions: 1.0.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */
const sleepTime = 500;
const speed = 2;

// 点击之后返回的任务
const BACK_LIST = ['浏览并关注可得', '逛店可得', '成功浏览可得1000金币', '浏览可得2000', '浏览可得3000'];
// 去完成按钮
const NEED_FININSH_TASK_LIST = [/去.+\)/, /领点点券.+\)/, /签到领.+\)/, /逛众筹.+\)/];
// 需要做的任务
const FINISHED_TASK = ['您所访问的页面不存在', '全部完成啦', /获得\w+金币/, '已浏览', '已达上限'];

// 判断停留时间
var JUDGE_TIME = 0;
// 当前浏览的按钮位置
var currentTask = 0;
// 定时器
var interval;
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

        recoverApp();
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
}

/**
 * 去浏览任务
 */
function viewTask() {
    NEED_FININSH_TASK_LIST.forEach(item => {
        var taskCount = textMatches(item).find();
        for (var i = 0; i <= taskCount.length; i++) {
            sleep(sleepTime * speed);
            goTask(taskCount[i]);
        }
    });
}

function goTask(parent) {
    var par = parent;

    // 找到去完成按钮
    if (par != null && par.parent() != null && par.parent().childCount() >= 3) {
        par = par.parent();
        // 先判断需要执行几次这个任务
        var finshAndCount = par.children()[1].text().split('(')[1].split(')')[0].split('/');
        var execCount = finshAndCount[1];
        var currentFininshNum = finshAndCount[0];
        // 获取去完成按钮
        var button = par.children()[3];
        while (currentFininshNum < execCount && par.children()[2] != null) {
            sleep(sleepTime);
            var buttonText = par.children()[2].text();
            button.click();
            // 点击任务 重置计时
            JUDGE_TIME = 0;

            log("正在进行任务: " + buttonText + "，目前进度(" + currentFininshNum + "/" + execCount + ")");
            sleep(sleepTime * speed * 4);
            while (true) {

                if (textContains("确认授权").exists() || buttonText.indexOf("成功入会") >= 0) {
                    while (!textContains("做任务 赚金币").exists() && back()) {
                        sleep(sleepTime * speed);
                        currentFininshNum = execCount;
                    }
                    break;
                }
                
                var isViewAndFollow = false;
                for (i = 0; i < BACK_LIST.length; i++) {
                    if (buttonText.indexOf(BACK_LIST[i]) >= 0) {
                        isViewAndFollow = true;
                        break;
                    }
                }

                if (isViewAndFollow) {
                    while (!textContains("做任务 赚金币").exists()  && back()) {
                        sleep(sleepTime * speed);
                    }
                    currentFininshNum++;
                    sleep(sleepTime * speed);
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
                        if (back()) {
                            sleep(sleepTime * speed);
                            currentFininshNum++;
                            break;
                        }
                    }
                }

                if (isFinshed(FINISHED_TASK)) {
                    while (!textContains("做任务 赚金币").exists() && back()) {
                        sleep(sleepTime * speed);
                        currentFininshNum = execCount;
                    }
                    break;
                }

                if (buttonText.indexOf("去参与小程序") >= 0) {
                    while (!textContains("做任务 赚金币").exists() && back()) {
                        launchPackage("com.jingdong.app.mall")
                        sleep(sleepTime * speed);
                        currentFininshNum++;
                        break;
                    }
                }

                if (textContains("当前页浏览加购").exists() && textStartsWith("¥").find().length > 0) {
                    addMarketCar();
                    while (!textContains("做任务 赚金币").exists() && back()) {
                        sleep(sleepTime * speed);
                        currentFininshNum = execCount;
                        break;
                    }
                }

                if (textContains("品牌种草城").exists()) {
                    for (var j = 0; j < 4; j++) {
                        if (textContains("喜欢").exists() && textContains("喜欢").click()) {
                            while(!textContains("喜欢").click() && back()) {
                                sleep(sleepTime * speed);
                            }
                            
                        }
                    }
                    currentFininshNum++;
                    break;
                }

                if (JUDGE_TIME > 30) {
                    currentFininshNum = execCount;
                    JUDGE_TIME = 0;
                    break;
                }
            }

        }
    }
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
    sleep(1000);
    back();
    sleep(1000);
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

function addJudgeTime() {

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
 * Date: 2022/05/24
 * Versions: 1.0.0
 * Github: https://github.com/czj2369/jd_tb_auto
 */
