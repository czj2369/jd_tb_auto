auto.waitFor();
var appName = "京东";
var index = 0;
console.show();
// 建立一个循环，不断的检测里面控件的存在并且做出对应操作
while(true){
    // 打开京东APP
    launchApp(appName);

    // 点击'全民营业'
    clickByAllName("desc","浮层活动");

    // 点击 '去完成'
    clickByAllName("text","去完成");

    // 点击'领金币'
    clickByAllName("text","领金币");

    // 浏览商品
    BrowseForItems();

    // 加购商品
    addShopCard();

    backByFinish();
};

// 通过包含的形式找到控件并点击
function clickByContainsName(type,name){
    var control = null;
    if(textContains("邀请好友助力").exists()){
        index = 1;
    }
    if(textContains("商圈人数达2人").exists()){
        index = 2;
    }
    if(type == "desc"){
        if(descContains(name).exists()){
            control = descContains(name).find()[index];
        }
    }else{
        if(textContains(name).exists()){
            control = textContains(name).find()[index];
        }
    }

    if(control!=null){
        clickControl(control,name)
    }
};

// 通过完整控件名称找到空间并点击
function clickByAllName(type,name){
    var control = null;
    if(textContains("邀请好友助力").exists()){
        index = 1;
    }
    if(textContains("商圈人数达2人").exists()){
        index = 2;
    }
    if(textContains("确认授权并加入店铺会员")){
        index = 3;
    }
    if(type == "desc"){
        if(desc(name).exists()){
            control = desc(name).find()[index];
        }
    }else{
        if(text(name).exists()){
            control = text(name).find()[index];
        }
    }
    if(control!=null){
        clickControl(control,name)
    }
    
};

// 点击控件
function clickControl(control,name){
    var controlBounds = control.bounds();
    if(name == "确认授权并加入店铺会员"){
        controlBounds = []
    }
    press(random(controlBounds.left, controlBounds.right), random(controlBounds.top, controlBounds.bottom), random(50, 350));
    log("点击控件:"+name);
    sleep(1500);
};

// 浏览商品
function BrowseForItems(){
    if(textContains("任意浏览以下5个商品").exists() && !textContains("去完成").exists()){
        log("进入浏览商品活动界面");
        var imges = idContains("jmdd-react-smash_").find();
        var i = 0;
        while(imges && !textContains("已完成").exists()){
            imges[i].click();
            sleep(2000);
            if(textContains("店铺").exists() || textContains("购物车").exists()){
                descContains("返回").findOne().click();
                log("完成第"+(i+1)+"个店铺浏览，返回");
            }
            sleep(1500);
            i = i+1;
        }
        descContains("返回").findOne().click();
        log("浏览商品任务结束，返回");
        sleep(1500);
    }
}

// 判断是否需要加入购物车
function addShopCard(){
     // 进入加购物车活动界面，完成后自动返回
     if(textContains("在当前页任意加购5个").exists()){
        log("进入加购物车活动界面");
        var shopCart = idContains("jmdd-react-smash_").find();
        var i = 0;
        while(shopCart && !textContains("已完成").exists()){
            shopCart[i].click();
            sleep(1500);
            i = i+1;
            log("添加第"+(i)+"个购物车");
        }
        sleep(1500);
    }
}

// 判断是否需要返回 7f0f00df fd
function backByFinish(){
    if((textStartsWith("获得").exists() && textEndsWith("金币").exists()) ||
    textContains("重新连接").exists() || descContains("重新连接").exists() ||
    textContains("商圈红包").exists() || textContains("已集齐").exists() ||
    (textContains("已完成").exists() && textContains("在当前页任意加购5个").exists()) ||
    textContains("豆苗成长值").exists() || textContains("看看好友买什么").exists() ||
    text("京友圈").exists() || text("天天开新").exists() || 
    textContains("摇京豆").exists() || textContains("切换相似商品").exists()||
    text("天天都能领")){
        log("返回上层");
        back();
        sleep(1500)
    }
}


