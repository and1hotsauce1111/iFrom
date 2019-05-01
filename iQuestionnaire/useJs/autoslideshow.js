/*
  Ver 1.10.6

  Html物件容器範例：<div id="SlideshowDemo" class="AutoSlideshow" style="width: 500px; height: 300px"></div>
  使用者需修改 id 即可套用，容器大小自行由style控制
  函數調用需再 jQuery 環境使用

  以下為可調用函數
  定義投影片容器        >  AutoSlideshow(物件ID, [資料], {選填項目})
  選填項目：是否要自動撥放           AutoPlay (預設：true)
            使用者可否控制切換圖片   Control (預設：false)
            觸控手勢開關             Touch (預設：false) 引用 jquery.wipetouch.js 才可使用，電腦會觸發點擊事件請多注意
            是否要顯示物件數量       ListAmount (預設：false)
            是否要顯示註解           Memo (預設：true)
            物件切換速度             Speed (預設：1000/毫秒)
            轉場等待時間             Timeout (預設：3000/毫秒)
            投影片底色               BgColor (預設：'#000' 可帶透明顏色：'rgba(0, 0, 0, 0)')
            物件轉場動畫樣式         Transition (預設：FadeIn/淡入)
            指定從第幾張顯示         ShowIndex (預設：0) 從0開始
            使用拖曳跟縮放功能       Tools (預設：true) 僅支援PC

            物件轉場動畫樣式：FadeIn     淡入淡出
                              SlideDown  滑動
                              Show       顯示隱藏
                              Left       由左至右
                              Right      由右至左
                              Top        由上至下
                              Bottom     由下至上
                              Auto       自動判斷切入

  資料範例：[
                {
                    Memo: '一般圖片 寬高100% 填滿',
                    Box: '<img src="圖片位址" />'
                },
                {
                    Memo: 'Div背景圖片 寬高延展',
                    Box: '<div class="AutoSlideshowCoverDiv" style="background-image:url(圖片位址)"></div>'
                },
                {
                    Memo: 'Div背景圖片 寬高自適應縮放',
                    Box: '<div class="AutoSlideshowNoCoverDiv" style="background-image:url(圖片位址)"></div>'
                }
            ]

  建議使用 Div 當資料圖片的容器較佳
*/


//定義容器 載入物件
AutoSlideshow = function (Obj, Data, Setting) {

    //將 ID 轉成標籤
    Obj = '#' + Obj;

    //先嘗試取消 setTimeout
    try {
        var AutoSlideshowEval = $(Obj).attr('set-AutoSlideshowEval'); //提取 setTimeout 函數名稱
        var TempEval = 'clearTimeout(' + AutoSlideshowEval + ');'; //停止 setTimeout
        eval(TempEval); //執行
    } catch (e) { }

    //若 Setting 是空值的話則帶入 {}
    if (!Setting) {
        Setting = {};
    }
    //若 Setting.AutoPlay 是空值的話則帶入 true
    if (!Setting.AutoPlay && Setting.AutoPlay != false) {
        Setting.AutoPlay = true;
    }
    //若 Setting.Speed 是空值的話則帶入 1000
    if (!Setting.Speed) {
        Setting.Speed = 1000;
    }
    //若 Setting.Timeout 是空值的話則帶入 5000
    if (!Setting.Timeout) {
        Setting.Timeout = 5000;
    }
    //若 Setting.Transition 是空值的話則帶入 'FadeIn'
    if (!Setting.Transition) {
        Setting.Transition = 'FadeIn';
    }
    //若 Setting.BgColor 有值的話則帶入
    if (Setting.BgColor) {
        $(Obj).css('background-color', Setting.BgColor);
    }
    //若 Setting.ShowIndex 是空值的話則帶入 0
    if (!Setting.ShowIndex) {
        Setting.ShowIndex = 0;
    }
    //若 Setting.Tools 是空值的話則帶入 true
    if (!Setting.Tools && Setting.Tools != false) {
        Setting.Tools = true;
    }


    //清空選單資料
    $(Obj).empty();

    //填入迴圈所需變數
    $(Obj).attr('set-AutoPlay', Setting.AutoPlay);
    $(Obj).attr('set-DataLength', Data.length);
    $(Obj).attr('set-Timeout', Setting.Timeout);
    $(Obj).attr('set-Speed', Setting.Speed);
    $(Obj).attr('set-NowIndex', Setting.ShowIndex);
    $(Obj).attr('set-Transition', Setting.Transition);
    $(Obj).attr('set-zoom', 100);
    $(Obj).attr('set-dragging', 'false');
    $(Obj).attr('set-iX', 0);
    $(Obj).attr('set-iY', 0);
    //將 # 去除，給 setTimeout 套用
    var TempEvalObj = 'AutoSlideshowEval_' + Obj.replace('#', '');
    $(Obj).attr('set-AutoSlideshowEval', TempEvalObj);

    //判斷是否為IE 如果是的話 iframe 的寬只能為 80%
    var tempIEClass = '';
    if (AutoSlideshowGetBrowser().ie) {
        tempIEClass = ' iframeForIE';
    }

    //填入Memo註解及Box資料
    for (var i = 0; i < Data.length; i++) {

        //判斷是否要註解
        if (Setting.Memo == false) {
            $(Obj).append('<div class="AutoSlideshowBoxData' + tempIEClass + '">' +
                              Data[i].Box +
                          '</div>');
        } else {
            $(Obj).append('<div class="AutoSlideshowBoxData">' +
                              Data[i].Box +
                              '<div class="AutoSlideshowMemoData">' + Data[i].Memo + '</div>' +
                          '</div>');
        }

    }

    //行動裝置手勢判斷
    if (Setting.Touch == true) {
        $(Obj + ' .AutoSlideshowBoxData').wipetouch({
            wipeUp: function (result) { AutoSlideshowChange('Left', TempObj) },
            wipeLeft: function (result) { AutoSlideshowChange('Right', TempObj) },
            wipeRight: function (result) { AutoSlideshowChange('Left', TempObj) },
            wipeDown: function (result) { AutoSlideshowChange('Right', TempObj) }
        });
    }

    //判斷 是否要顯示物件數量 是否套用
    if (Setting.ListAmount == true) {
        //套入物件
        $(Obj).append('<div class="AutoSlideshowListAmount"></div>');
        //改變物件數量文字
        $(Obj + ' .AutoSlideshowListAmount').html((Setting.ShowIndex + 1) + '/' + Data.length);
    }

    //將 # 去除，給 setTimeout 套用
    var TempObj = Obj.replace('#', '');
    //判斷 使用者可否控制切換圖片 是否套用
    if (Setting.Control == true) {
        $(Obj).append('<i class="fa fa-chevron-left AutoSlideshowArrow_Left" onclick="AutoSlideshowChange(\'Left\', \'' + TempObj + '\')"></i>');
        $(Obj).append('<i class="fa fa-chevron-right AutoSlideshowArrow_Right" onclick="AutoSlideshowChange(\'Right\', \'' + TempObj + '\')"></i>');
    }

    //填入控制工具欄 (僅支援PC)
    if (Setting.Tools == true && !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
        $(Obj).append('<div class="AutoSlideToolsBox">\
                       <button type="button" class="button btn_white btn_s" onclick="AutoSlideToolsZoom(\'In\',\'' + Obj + '\')"><i class="fa fa-plus"></i></button>\
                       <button type="button" class="button btn_white btn_s" onclick="AutoSlideToolsZoom(\'Out\',\'' + Obj + '\')"><i class="fa fa-minus"></i></button>\
                       <button type="button" class="button btn_white btn_s" onclick="AutoSlideToolsReSize(\'' + Obj + '\')"><i class="fa fa-window-maximize"></i></button>\
                       <button type="button" class="button btn_white btn_s AutoSlideToolsZoomValue" style="outline:none;cursor:default">' + $(Obj).attr('set-zoom') + '%</button>\
                       </div>');

        //填入滑鼠滾輪控制項
        $(Obj).mousewheel(function (e) {
            //計算
            if (e.deltaY == 1) {
                AutoSlideToolsZoom('In', Obj);
            } else if (e.deltaY == -1) {
                AutoSlideToolsZoom('Out', Obj);
            }
            return false;
        });
        //填入拖曳功能
        $(Obj).mousedown(function (e) {
            // e.clientX、e.clientY 表示滑鼠的座標
            $(Obj).attr('set-dragging', 'true');
            $(Obj).attr('set-iX', e.clientX - $(Obj).find('.AutoSlideshowBoxData')[$(Obj).attr('set-NowIndex')].offsetLeft);
            $(Obj).attr('set-iY', e.clientY - $(Obj).find('.AutoSlideshowBoxData')[$(Obj).attr('set-NowIndex')].offsetTop);
            return false;
        });
        $(Obj).mousemove(function (e) {  //如果 viewBoxOst 改為 viewBox 就是只拖曳自己的版本
            if ($(Obj).attr('set-dragging') == 'true') {
                var e = e || window.event;
                var oX = e.clientX - $(Obj).attr('set-iX');
                var oY = e.clientY - $(Obj).attr('set-iY');
                $(Obj).find('.AutoSlideshowBoxData').css({ 'left': oX + 'px', 'top': oY + 'px' });
                return false;
            }
        });
        $(document).on('mouseup', function (e) {
            $(Obj).attr('set-dragging', 'false');
            return false;
        });

        //改變滑鼠樣式
        $(Obj).css('cursor', 'move');

    };

    //隱藏所有Box資料
    $(Obj + ' .AutoSlideshowBoxData').hide();
    //顯示第一筆Box資料
    //$(Obj + ' .AutoSlideshowBoxData:first-child').show();
    $(Obj + ' .AutoSlideshowBoxData:eq(' + Setting.ShowIndex + ')').show();

    //判斷是否自動撥放
    if (Setting.AutoPlay == false) {
        //若判斷為關閉則不動作
    } else {
        //執行輪播迴圈 並設定 First 值要求單次執行
        AutoSlideshowRepeat(Obj, '', 'First');
    }

};

//輪播迴圈
AutoSlideshowRepeat = function (Obj, Type, First) {

    //取得設定資訊
    // Obj 物件ID標籤
    // AutoPlay 是否要自動撥放
    // DataLength 物件總數
    // Timeout 轉場等待時間
    // Speed 物件切換速度
    // NowIndex 當前物件排序
    // Transition 物件轉場動畫樣式
    // AutoSlideshowEval setTimeout函數名稱
    var AutoPlay = $(Obj).attr('set-AutoPlay');
    var DataLength = parseInt($(Obj).attr('set-DataLength'));
    var Timeout = parseInt($(Obj).attr('set-Timeout'));
    var Speed = parseInt($(Obj).attr('set-Speed'));
    var NowIndex = parseInt($(Obj).attr('set-NowIndex'));
    var Transition = $(Obj).attr('set-Transition');
    var AutoSlideshowEval = $(Obj).attr('set-AutoSlideshowEval');



    //開啟網頁不執行過場
    if (First != 'First') {

        //執行過場 淡入淡出
        if (Transition == 'FadeIn') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').fadeIn(Speed);
        }
        //執行過場 滑動
        if (Transition == 'SlideDown') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').slideDown(Speed);
        }
        //執行過場 顯示隱藏
        if (Transition == 'Show') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').show(Speed);
        }
        //執行過場 由左至右
        if (Transition == 'Left') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').fadeIn(0);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').css({ right: '-' + $(Obj).width() + 'px' });
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').animate({ right: 0 }, Speed);
        }
        //執行過場 由右至左
        if (Transition == 'Right') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').fadeIn(0);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').css({ left: '-' + $(Obj).width() + 'px' });
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').animate({ left: 0 }, Speed);
        }
        //執行過場 由上至下
        if (Transition == 'Top') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').fadeIn(0);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').css({ top: '-' + $(Obj).height() + 'px' });
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').animate({ top: 0 }, Speed);
        }
        //執行過場 由下至上
        if (Transition == 'Bottom') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').fadeIn(0);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').css({ bottom: '-' + $(Obj).height() + 'px' });
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').animate({ bottom: 0 }, Speed);
        }
        //執行過場 自動判斷切入
        if (Transition == 'Auto') {
            $(Obj + ' .AutoSlideshowBoxData').fadeOut(Speed);
            $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').fadeIn(0);
            $(Obj + ' .AutoSlideshowBoxData').css({ left: 'auto' });
            $(Obj + ' .AutoSlideshowBoxData').css({ right: 'auto' });
            var AutoAnimate = $(Obj).attr('set-AutoAnimate');
            if (AutoAnimate == 'Left') {
                $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').css({ left: '-' + $(Obj).width() + 'px' });
                $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').animate({ left: 0 }, Speed);
            } else {
                $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').css({ right: '-' + $(Obj).width() + 'px' });
                $(Obj + ' .AutoSlideshowBoxData:eq(' + NowIndex + ')').animate({ right: 0 }, Speed);
            }
        }

    }



    //改變物件數量文字
    $(Obj + ' .AutoSlideshowListAmount').html(NowIndex + 1 + '/' + DataLength);

    //判斷切換模式
    if (Type == 'Left') {

        //計算 NowIndex 值是否合理
        if (NowIndex - 1 < 0) {
            $(Obj).attr('set-NowIndex', DataLength - 1);
        } else {
            $(Obj).attr('set-NowIndex', NowIndex - 1);
        }

        //執行輪播迴圈函數
        AutoSlideshowRepeat(Obj);
        //並不再執行 AutoPlay
        return;

    } else if (Type == 'Right') {

        //計算 NowIndex 值是否合理
        if (NowIndex + 1 >= DataLength) {
            $(Obj).attr('set-NowIndex', 0);
        } else {
            $(Obj).attr('set-NowIndex', NowIndex + 1);
        }

        //執行輪播迴圈函數
        AutoSlideshowRepeat(Obj);
        //並不再執行 AutoPlay
        return;

    }

    //都沒操作就繼續執行 AutoPlay
    if (AutoPlay == 'true') {

        //計算 NowIndex
        if (NowIndex + 1 >= DataLength) {
            $(Obj).attr('set-NowIndex', 0);
        } else {
            $(Obj).attr('set-NowIndex', NowIndex + 1);
        }

        //取得 setTimeout 名稱供 eval 函數使用
        var TempEval = AutoSlideshowEval + ' = setTimeout(\'AutoSlideshowRepeat("' + Obj + '")\', ' + Timeout + ')';
        //執行 setTimeout
        eval(TempEval);

    }

};

//切換按鈕
AutoSlideshowChange = function (Type, Obj) {

    //將 ID 轉成標籤
    Obj = '#' + Obj;

    //判斷是否需要停止輪播
    var AutoPlay = $(Obj).attr('set-AutoPlay');
    if (AutoPlay == 'true') {
        try {
            //提取 setTimeout 函數名稱
            var AutoSlideshowEval = $(Obj).attr('set-AutoSlideshowEval');
            //停止 setTimeout
            var TempEval = 'clearTimeout(' + AutoSlideshowEval + ');';
            //執行
            eval(TempEval);
        } catch (e) { }
    }

    //因為自動撥放的緣故 所以在切換的時候 要先處理 NowIndex
    if (AutoPlay == 'true') {

        //提取函數
        var DataLength = parseInt($(Obj).attr('set-DataLength'));
        var NowIndex = parseInt($(Obj).attr('set-NowIndex'));

        if (NowIndex - 1 < 0) {
            $(Obj).attr('set-NowIndex', DataLength - 1);
        } else {
            $(Obj).attr('set-NowIndex', NowIndex - 1);
        }

    }

    //執行過場 自動判斷切入 專用變數
    $(Obj).attr('set-AutoAnimate', Type);

    //呼叫迴圈函數
    AutoSlideshowRepeat(Obj, Type, 'First');

    //恢復控制
    AutoSlideToolsReSize(Obj);

};

//瀏覽器判斷
AutoSlideshowGetBrowser = function () {

    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    //以下進行測試
    //if (Sys.ie) alert('IE: ' + Sys.ie);
    //if (Sys.firefox) alert('Firefox: ' + Sys.firefox);
    //if (Sys.chrome) alert('Chrome: ' + Sys.chrome);
    //if (Sys.opera) alert('Opera: ' + Sys.opera);
    //if (Sys.safari) alert('Safari: ' + Sys.safari);


    return Sys;


};

//縮放控制
AutoSlideToolsZoom = function (Type, Obj) {

    //取得目前大小
    var zoom = parseInt($(Obj).attr('set-zoom'));

    //計算
    if (Type == 'In') {
        if (zoom >= 600) {
            zoom = 600;
        } else {
            zoom = zoom + 50;
        }
    } else {
        if (zoom <= 100) {
            zoom = 100;
        } else {
            zoom = zoom - 50;
        }
    }

    //改變大小
    $(Obj).find('.AutoSlideshowBoxData').css('width', zoom + '%');
    $(Obj).find('.AutoSlideshowBoxData').css('height', zoom + '%');

    //重新記錄值
    $(Obj).attr('set-zoom', zoom);
    //修改顯示值
    $(Obj).find('.AutoSlideToolsZoomValue').html(zoom + '%');

};
//恢復控制
AutoSlideToolsReSize = function (Obj) {

    //重新記錄值
    $(Obj).attr('set-zoom', 100);
    $(Obj).attr('set-dragging', 'false');
    $(Obj).attr('set-iX', 0);
    $(Obj).attr('set-iY', 0);

    //修改顯示值
    $(Obj).find('.AutoSlideToolsZoomValue').html('100%');

    //改變大小及位置
    $(Obj).find('.AutoSlideshowBoxData').css('width', '100%');
    $(Obj).find('.AutoSlideshowBoxData').css('height', '100%');
    $(Obj).find('.AutoSlideshowBoxData').css({ 'left': '0px', 'top': '0px' });

};
