auto.waitFor();
var appName = "京东";

var finishButtonNum = 1;
// 建立一个循环，不断的检测里面控件的存在并且做出对应操作
while(true){
    // 打开京东APP
    launchApp(appName);
    // 睡眠1.5秒，等待程序加载
    sleep(1500);
    // 进入京东主界面，检查是否存在“我的”右下角，如果存在，点击进去，接着判断是否存在全民叠蛋糕活动，如果有则点击进入
    if(descContains("我的").exists()){
        log("进入我的界面");
        descContains("我的").findOne().click();
        sleep(1500);
        // 判断是否有全民叠蛋糕活动
        if(idContains("ur").exists()){
            idContains("ur").findOne().click();
        }else if(idContains("us").exists()){
            idContains("us").findOne().click();
        }
        sleep(2000);
    }



    // 签到
    if(textContains("签到").exists()){
        log("签到");
        textContains("签到").findOne().click()
    }

    // 进入活动界面，点击中间的“做任务领金币”控件，进入任务界面
    if(idContains("homeSceneBtn").exists() && !textContains("去完成").exists()){
        log("进入活动界面并且点击做任务按钮");
        idContains("homeSceneBtn").findOne().click();
        sleep(1500);
    }

    // 进入任务界面，判断已完成控件，如果存在则点击
    if(textContains("去完成").exists()){
        
        if(textContains("去完成").find()[finishButtonNum].click()){
            sleep(4000);
            log("进入任务界面");
        }
        
    }

    if(textContains("战队红包").exists() || descContains("战队红包").exists()){
        log("进入组队界面");
        if(descContains("返回").findOne().click()){
            finishButtonNum = finishButtonNum + 1;
        }
        sleep(2000);
    }
    
    if(textContains("恭喜完成").exists()){
        descContains("返回").findOne().click();
        log("浏览八秒完成返回");
        sleep(2000);
    }
    // 跳过开会员卡任务，如果需要请手动
    if(textContains("会员卡详情").exists()){
        if(back()){
            finishButtonNum = finishButtonNum + 1;
            log("跳过会员卡任务");
            sleep(2000);
        }
        
    }

    //直接返回不需要等待的活动
    if(idContains("g4").exists() && idContains("fd").exists() && (!textContains("vk image").exists() || 
    !idContains("vh").exists() || !textContains("S").exists())){
        if(back()){
            log("back返回");
            sleep(2000);
        }
    }


    // 进入浏览活动界面，不用等待直接返回
    if(textContains("玩一玩").exists() || descContains("领券中心").exists() || textContains("逛新品").exists()
    || textContains("东东萌宠").exists() || textContains("全民开").exists() || textContains("1元包邮").exists()
    || textContains("豆苗").exists() || textContains("互动好物").exists()
    || textContains("城市嘉年华").exists() || textContains("城市嘉年华").exists() 
    || textContains("超级盒子免息驾到").exists()){
        if(textContains("豆苗").exists() || textContains("东东萌宠").exists() || textContains("逛新品").exists()
        || textContains("超级盒子免息驾到").exists() || textContains("购物返豆").exists()){
            back();
            log("活动back返回");    
            sleep(2000);
        }else{
            descContains("返回").findOne().click();
            log("直接返回");
            sleep(2000);
        }
        continue;
    }

    if(idContains("继续领红包").exists()){
        log("点击屏幕中的继续领红包");
        idContains("继续领红包").findOne().click();
        sleep(2000);
    }

    if(textContains("忍痛离开").exists()){
        textContains("忍痛离开").findOne().click();
        sleep(2000);
    }

    // 进入浏览商品活动界面，浏览完毕后自动返回
    if(textContains("浏览以下5个商品").exists() && !textContains("去完成").exists()){
        log("进入浏览商品活动界面");
        var imges = idContains("view_").find();
        var i = 0;
        while(imges && !textContains("已完成").exists()){
            imges[i].click();
            sleep(2000);
            if(textContains("店铺").exists() || textContains("购物车").exists()){
                descContains("返回").findOne().click();
                log("完成店铺浏览，返回");
            }
            sleep(1500);
            i = i+1;
        }
        descContains("返回").findOne().click();
        log("浏览商品任务结束，返回");
        sleep(1500);
        
    }

    // 进入加购物车活动界面，完成后自动返回
    if(textContains("当前页点击加购以下").exists()){
        log("进入加购物车活动界面");
        var shopCart = idContains("cart_").find();
        var i = 0;
        while(shopCart && !textContains("已完成").exists()){
            shopCart[i].click();
            sleep(1500);
            i = i+1;
            log("添加购物车");
        }
        descContains("返回").findOne().click();
        log("任务完成，返回");
        sleep(1500);
    }

}