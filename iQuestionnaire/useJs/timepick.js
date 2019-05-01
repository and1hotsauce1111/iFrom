/*
  Ver 1.12.5

  物件建立：<div id="物件ID"></div>  ※請修改[物件ID]部分

  函數調用需再 jQuery 1.9.1 ~ 3.3.1 環境使用

  以下為可調用函數
  定義時間選擇器          >  TimePickSetting({選填項目})  或  $('#物件ID').TimeSetting({選填項目})
  取得時間選擇器選取數值  >  var pick = TimePickGet(物件ID)  或  $('#物件ID').TimeGet()
  修改{選填項目}參數      >  TimePickSettingChange(物件ID , {選填項目})  或  $('#物件ID').TimeSettingChange({選填項目})
  手動呼叫日曆            >  TimePickCell($(this) , 物件ID)
                             ※放在按鈕的 onclick 事件之中即可

  查詢儲存陣列          >  TimePickTempData[物件ID]
  取選取的值            >  TimePickTempData[物件ID].Pick
                           ※Time為毫秒數，Format為自訂格式字串，ROCFormat為民國年自訂格式字串，String為時間字串，ROCString為民國年時間字串，Object為時間物件
                           ※若無選取的話 Pick 物件則為 null，請特別注意

  定義下拉選單 選填項目：*物件ID                 ID (必填項目無預設)                    ※若ID相同則會被覆蓋
                         顯示模式                Mode (預設：'Drop')                    ※僅電腦上執行有效，Drop 為下拉模式，Float 為浮動模式(出現在螢幕中間的)
                         日期顯示格式            Format (預設：'yyyy-MM-dd HH:mm:ss')   ※yyyy:年、MM:月、dd:日、HH:24小時、mm:分鐘、ss:秒
                         設定初始時間            DefaultDate (預設：null 尚未選取)      ※設定格式為西元年 '2017-01-31 22:50:45' 或 new Date() 都可以
                         是否可選擇日期          DatePick (預設：true)
                         是否可選擇時間          TimePick (預設：false)
                         是否可選擇秒            SecondsPike (預設：false)
                         箭頭切換圖標-左         PrevArrow (預設：'<i class="fa fa-chevron-left"></i>')
                         箭頭切換圖標-右         NextArrow (預設：'<i class="fa fa-chevron-right"></i>')
                         日曆圖示                CalendarIcon (預設：'<i class="fa fa-calendar"></i>')
                         是否開啟時間顯示        TextView (預設：true)
                         點選日期後自動關閉      PickAuto (預設：false)                 ※此功能僅針對日期響應，開啟後將會隱藏操作按鈕列
                         按鈕預設文字            ButtonText (預設：'尚未設定')          ※開啟時間顯示才會作用
                         設定按鈕Class           Class (預設：'button_l btn_sky_l')
                         設定按鈕Style           Style (預設：'')                       ※使用css語法，打成字串，只有靜態建立有效，動態建立請直接設定DOM物件
                         顯示為民國年            ROC (預設：false)                      ※僅顯示文字為民國年，輸出值仍然為西元年
                         何時之前不能選          DisabledAbove (預設：null)             ※設定格式為西元年 '2017-01-31'，包含設定當日，切勿輸入時間，會失效
                         何時之後不能選          DisabledBelow (預設：null)             ※設定格式為西元年 '2017-02-15'，包含設定當日，切勿輸入時間，會失效
                         年分選擇起始年份        YearRangeStart (預設：10)              ※設定10，即為年份下拉選單的選項顯示從10年前開始算
                         年分選擇結尾年份        YearRangeEnd (預設：10)                ※設定10，即為年份下拉選單的選項顯示最多算到10年後
                         設定單位文字            TimeText (預設：{ AD: '西元', ROC: '民國', Year: '年', Month: '月', Day: '日', Hours: '時', Minutes: '分', Seconds: '秒' })
                         設定月份文字            MonthsText (預設：['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'])
                         設定星期文字            WeekdaysText (預設：['週日', '週一', '週二', '週三', '週四', '週五', '週六'])
                         選擇器與按鈕的間距      ListSpace (預設：2)
                         超出視窗位移選單        MoveList (預設：true)              ※顯示模式為 'Drop' 下拉模式且使用者於電腦裝置時會使用，行動裝置為浮動模式不需要
                         使用手動控制選單位移量  MoveListCtrl (預設：null，設定時請使用 { Top: 0, Left: 0 } )      ※只有開啟[超出視窗位移選單]功能開啟才會生效
                         日曆開始時事件          OnOpen (預設：null，設定時請使用 function (Name) { } )
                         日曆選取值變換時事件    OnChange (預設：null，設定時請使用 function (Pick, Name) { } )
                         日曆關閉時事件          OnClose (預設：null，設定時請使用 function (Pick, Name) { } )
*/



//取得使用者瀏覽器
TimePickGetBrowser = function () {

    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    return Sys;
}
//時間Format函數
Date.prototype.TimePickFormat = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                    //月份 
        "d+": this.getDate(),                         //日 
        "H+": this.getHours(),                        //小时 
        "m+": this.getMinutes(),                      //分 
        "s+": this.getSeconds(),                      //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3),  //季度 
        "S": this.getMilliseconds()                   //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//宣告專用變數儲存物件
var TimePickTempData = {};
var TimePickTempOnEndName = null;
var TimePickBrowser = TimePickGetBrowser();
var TimePickTempCloseEvent;
var TimePickTempCloseName;
var TimePickTempNowName = null;



//定義時間選擇器
TimePickSetting = function (Setting) {

    //參數驗證 / 預設值賦予
    var Success = true;
    if (!Setting) {
        console.info('缺乏參數[Setting]設定！');
        Success = false;
    } else {
        //數值判斷 物件ID (必填)
        if (Setting.ID == undefined) {
            console.info('缺乏物件[ID]參數設定！');
            Success = false;
        }
        //物件名稱 (舊的用不到了 直接同步ID)
        Setting.Name = Setting.ID;
        //日期顯示格式
        if (Setting.Format == undefined) {
            Setting.Format = 'yyyy-MM-dd HH:mm:ss';
            //Setting.Format = 'yyyy年MM月dd日 HH時mm分ss秒';
        }
        //設定初始時間 (套用標準化時間字串)
        if (Setting.DefaultDate == undefined) {
            Setting.DefaultDate = null;
            //設置 取值物件 Pick 變數
            Setting.Pick = null;
        } else {

            //標準化時間字串 (為了相容IE跟Edge)
            Setting.DefaultDate = TimePickFormatDate(Setting.DefaultDate);

            //設置 取值物件 Pick 變數
            Setting.Pick = {
                Time: new Date(Setting.DefaultDate).getTime(),
                Format: new Date(Setting.DefaultDate).TimePickFormat(Setting.Format),
                ROCFormat: new Date(Setting.DefaultDate).TimePickFormat(Setting.Format).replace(new Date(Setting.DefaultDate).getFullYear(), (new Date(Setting.DefaultDate).getFullYear() - 1911)),
                String: new Date(Setting.DefaultDate).TimePickFormat('yyyy-MM-dd HH:mm:ss'),
                ROCString: (new Date(Setting.DefaultDate).getFullYear() - 1911) + new Date(Setting.DefaultDate).TimePickFormat('-MM-dd HH:mm:ss'),
                Object: new Date(Setting.DefaultDate)
            };

        }
        //DatePick
        if (Setting.DatePick == undefined) {
            Setting.DatePick = true;
        }
        //顯示模式
        if (Setting.Mode == undefined) {
            Setting.Mode = 'Drop';
        }
        //是否可選擇時間
        if (Setting.TimePick == undefined) {
            Setting.TimePick = false;
        }
        //是否可選擇秒
        if (Setting.SecondsPike == undefined) {
            Setting.SecondsPike = false;
        }
        //箭頭切換圖標-左
        if (Setting.PrevArrow == undefined) {
            Setting.PrevArrow = '<i class="fa fa-chevron-left"></i>';
        }
        //箭頭切換圖標-右
        if (Setting.NextArrow == undefined) {
            Setting.NextArrow = '<i class="fa fa-chevron-right"></i>';
        }
        //日曆圖示
        if (Setting.CalendarIcon == undefined) {
            Setting.CalendarIcon = '<i class="fa fa-calendar"></i>';
        }
        //是否開啟時間顯示
        if (Setting.TextView == undefined) {
            Setting.TextView = true;
        }
        //點選日期後自動關閉
        if (Setting.PickAuto == undefined) {
            Setting.PickAuto = false;
        }
        //按鈕預設文字
        if (Setting.ButtonText == undefined) {
            Setting.ButtonText = '尚未設定';
        }
        //設定按鈕Class
        if (Setting.Class == undefined) {
            Setting.Class = 'button_l btn_sky_l';
        }
        //設定按鈕Style
        if (Setting.Style == undefined) {
            Setting.Style = '';
        }
        //顯示為民國年
        if (Setting.ROC == undefined) {
            Setting.ROC = false;
        }
        //何時之前不能選 (套用標準化時間字串)
        if (Setting.DisabledAbove == undefined) {
            Setting.DisabledAbove = null;
        } else {
            Setting.DisabledAbove = TimePickFormatDate(Setting.DisabledAbove).TimePickFormat('yyyy-MM-dd');
        }
        //何時之後不能選 (套用標準化時間字串)
        if (Setting.DisabledBelow == undefined) {
            Setting.DisabledBelow = null;
        } else {
            Setting.DisabledBelow = TimePickFormatDate(Setting.DisabledBelow).TimePickFormat('yyyy-MM-dd');
        }
        //年分選擇起始年份
        if (Setting.YearRangeStart == undefined) {
            Setting.YearRangeStart = 10;
        }
        //年分選擇結尾年份
        if (Setting.YearRangeEnd == undefined) {
            Setting.YearRangeEnd = 10;
        }
        //設定單位文字
        if (Setting.TimeText == undefined) {
            Setting.TimeText = { AD: '西元', ROC: '民國', Year: '年', Month: '月', Day: '日', Hours: '時', Minutes: '分', Seconds: '秒' };
        }
        //設定月份文字
        if (Setting.MonthsText == undefined) {
            Setting.MonthsText = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        }
        //設定星期文字
        if (Setting.WeekdaysText == undefined) {
            Setting.WeekdaysText = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
            //Setting.WeekdaysText = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        }
        //選擇器與按鈕的間距
        if (Setting.ListSpace == undefined) {
            Setting.ListSpace = 2;
        }
        //超出視窗位移選單
        if (Setting.MoveList == undefined) {
            Setting.MoveList = true;
        }
        //使用手動控制選單位移量
        if (Setting.MoveListCtrl == undefined) {
            Setting.MoveListCtrl = null;
        }
        //日曆開始時事件
        if (Setting.OnOpen == undefined) {
            Setting.OnOpen = null;
        }
        //日曆選取值變換時事件
        if (Setting.OnChange == undefined) {
            Setting.OnChange = null;
        }
        //日曆關閉時事件
        if (Setting.OnClose == undefined) {
            Setting.OnClose = null;
        }
    }

    //驗證確認 若失敗則不填入資料
    if (Success == false) {
        return;
    }

    //若有 指定建立選單物件ID 則建立呼叫按鈕
    if (Setting.ID != null) {

        //主動帶入 class (先移除再增加)
        $('#' + Setting.ID).removeClass('TimePick');
        $('#' + Setting.ID).addClass('TimePick');

        //顯示文字判斷
        var TempString = '';
        if (Setting.TextView == true) {
            if (Setting.Pick == null) {
                TempString = Setting.ButtonText;
            } else {
                //依照使用者設定格式化執行
                TempString = Setting.Pick.Object.TimePickFormat(Setting.Format);
                //判斷是否為ROC
                if (Setting.ROC == true) {
                    //西元年 直接取代成 民國年
                    TempString = TempString.replace(new Date(Setting.DefaultDate).getFullYear(), (new Date(Setting.DefaultDate).getFullYear() - 1911));
                }
            }
            TempString = TempString + '&nbsp;';
        }

        //先清除
        $('#' + Setting.ID).empty();
        //建立呼叫按鈕
        $('#' + Setting.ID).append('<button type="button" class="' + Setting.Class + '" onclick="TimePickCell($(this),\'' + Setting.Name + '\')" style="' + Setting.Style + '">' +
                                      '<span class="TimePickText">' + TempString + '</span><span class="TimePickIcon">' + Setting.CalendarIcon + '</span></button>');
    }

    //填入資料
    TimePickTempData[Setting.Name] = Setting;

};
//呼叫日曆
TimePickCell = function (Event, Name) {

    //如果開啟中 直接開啟另一個選擇器時 則先觸發前一個選擇器的 OnClose
    if (TimePickTempNowName != null && TimePickTempData[TimePickTempNowName].OnClose != null) {
        TimePickTempData[TimePickTempNowName].OnClose(TimePickTempData[TimePickTempNowName].Pick, TimePickTempNowName);
    }

    //紀錄目前使用的名稱
    TimePickTempNowName = Name;

    //紀錄點擊空白及ESC時關閉選單用資料物件及名稱
    TimePickTempCloseEvent = Event;
    TimePickTempCloseName = Name;



    //紀錄當前按鈕文字、物件 (取消按鈕用)
    TimePickTempData[Name].CloseText = $(Event).parent().find('.TimePickText').html();
    TimePickTempData[Name].ClosePick = TimePickTempData[Name].Pick;

    //如果選擇器已經是開啟狀態 就不做動作
    if ($(Event).parent().find('.TimePickSelect').css('display') == 'block') {
        return;
    }

    //執行 OnOpen 函數
    if (TimePickTempData[Name].OnOpen != null) {
        TimePickTempData[Name].OnOpen(Name);
    }



    //關閉非使用的所有選單
    $('.TimePickSelect').hide(200);
    //清除選擇器容器
    $(Event).parent().find('.TimePickSelect').remove();
    //填入選擇器容器
    $(Event).parent().append('<div class="TimePickSelect"></div>');
    //隱藏選擇器容器
    $(Event).parent().find('.TimePickSelect').hide();

    //判斷是否為行動裝置 若不是就定位選單位置 /(android|iphone|ipad|ipod);?/i
    if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
        //行動裝置的話就套用專用的 Css
        $(Event).parent().find('.TimePickSelect').addClass('TimePickSelect_Phone');
        //依照解析度調整位置跟大小
        TimePickSelectResize();

    } else {

        //判斷顯示模式
        if (TimePickTempData[Name].Mode == 'Drop') {
            //下拉選單模式 (定位容器 垂直位置)
            $(Event).parent().find('.TimePickSelect').css({
                top: $(Event).height() + parseInt($(Event).css('padding-top').replace('px', '')) + parseInt($(Event).css('padding-bottom').replace('px', '')) + TimePickTempData[Name].ListSpace
            });
        } else if (TimePickTempData[Name].Mode == 'Float') {
            //浮動模式 (套用行動裝置的 Css)
            $(Event).parent().find('.TimePickSelect').addClass('TimePickSelect_Phone');
            //調整位置跟大小
            var WindowWidth = window.innerWidth;

            if (WindowWidth <= 1024) {
                $('.TimePickSelect').css({
                    top: '25%',
                    zoom: 1
                });
            }
            if (WindowWidth > 1024) {
                $('.TimePickSelect').css({
                    top: '25%',
                    zoom: 1.15
                });
            }
            if (WindowWidth > 1600) {
                $('.TimePickSelect').css({
                    top: '25%',
                    zoom: 1.3
                });
            }


        }

    }

    //====================================== Header 年份月份星期 ======================================

    //取得年份建立文字
    var YearText = TimePickTempData[Name].TimeText.AD;
    if (TimePickTempData[Name].ROC == true) {
        YearText = TimePickTempData[Name].TimeText.ROC;
    }
    //建構容器
    $(Event).parent().find('.TimePickSelect').append(
        //Header
        '<div class="TimePickHeader">' +
            '<div class="TimePickTitle">' +
                '<span class="TimePickPrevArrow" onclick="TimePickArrowBtn($(this),\'' + Name + '\',\'Prev\')"><i class="fa fa-chevron-left"></i></span>' +
                '<span class="TimePickNextArrow" onclick="TimePickArrowBtn($(this),\'' + Name + '\',\'Next\')"><i class="fa fa-chevron-right"></i></span>' +
                '<div>' + YearText + '&nbsp;' +
                '<select class="TimePickTitle_SelectOption_Year" select-boxname="' + Name + '" select-type="YearMonth" onchange="TimePickSelectOptionOnChange($(this),\'' + Name + '\',\'YearMonth\')"></select>&nbsp;&nbsp;' +
                '<select class="TimePickTitle_SelectOption_Month" select-boxname="' + Name + '" select-type="YearMonth" onchange="TimePickSelectOptionOnChange($(this),\'' + Name + '\',\'YearMonth\')"></select>' +
                '</div>' +
            '</div>' +
            '<table class="TimePickTable">' +
                '<tbody>' +
                '<tr>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[0] + '</span></td>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[1] + '</span></td>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[2] + '</span></td>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[3] + '</span></td>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[4] + '</span></td>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[5] + '</span></td>' +
                '<td><span class="TimePickTableTitle">' + TimePickTempData[Name].WeekdaysText[6] + '</span></td>' +
                '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>' +
        //DateBox
        '<div class="TimePickDateBox">' +
            '<table class="TimePickTable"><tbody></tbody></table>' +
        '</div>');
    //判斷是否需要時間選擇
    if (TimePickTempData[Name].TimePick == true) {
        $(Event).parent().find('.TimePickSelect').append(
            //TimeBox
            '<div class="TimePickTimeBox">' +
                '<select class="TimePickTimeBox_SelectOption_Hours" select-boxname="' + Name + '" select-type="TimePick" onchange="TimePickSelectOptionOnChange($(this),\'' + Name + '\',\'TimePick\')"></select>：' +
                '<select class="TimePickTimeBox_SelectOption_Minutes" select-boxname="' + Name + '" select-type="TimePick" onchange="TimePickSelectOptionOnChange($(this),\'' + Name + '\',\'TimePick\')"></select>' +
            '</div>');
    }
    //判斷是否需要秒數選擇
    if (TimePickTempData[Name].TimePick == true && TimePickTempData[Name].SecondsPike == true) {
        $(Event).parent().find('.TimePickSelect .TimePickTimeBox').append(
        '：<select class="TimePickTimeBox_SelectOption_Seconds" select-boxname="' + Name + '" select-type="TimePick" onchange="TimePickSelectOptionOnChange($(this),\'' + Name + '\',\'TimePick\')"></select>');
    }
    //填入按鈕 (點選日期後自動關閉 功能沒開啟才填入按鈕)
    if (TimePickTempData[Name].PickAuto == false) {
        $(Event).parent().find('.TimePickSelect').append(
                //Work
                '<div class="TimePickWork">' +
                    '<button type="button" class="button btn_s" onclick="TimePickRestoreBtn($(this),\'' + Name + '\')" style="float: left; margin: 2px 0 0 0">恢復預設</button>' +
                    '<button type="button" class="button btn_s" onclick="TimePickCloseBtn($(this),\'' + Name + '\')">取消</button>&nbsp;' +
                    '<button type="button" class="button btn_s" onclick="TimePickSelectBtn($(this),\'' + Name + '\')">確認</button>' +
                '</div>');
    } else {
        $(Event).parent().find('.TimePickSelect').append(
            //Work
            '<div class="TimePickWork">' +
                '<button type="button" class="button btn_s" onclick="TimePickCloseBtn($(this),\'' + Name + '\')">關閉</button>' +
                '<button type="button" class="button btn_s" style="display:none">確認</button>' +
            '</div>');
    }

    //取得年份月份設定時間
    var DefaultDate = new Date();
    if (TimePickTempData[Name].DefaultDate != null) {
        DefaultDate = new Date(TimePickTempData[Name].DefaultDate);
    }
    //計算年份下拉選單矩陣
    var YearOptionStart = DefaultDate.getFullYear() - TimePickTempData[Name].YearRangeStart;
    var YearOptionEnd = DefaultDate.getFullYear() + TimePickTempData[Name].YearRangeEnd;
    //填入年份下拉選單
    for (var i = YearOptionStart; i <= YearOptionEnd; i++) {

        //判斷民國年顯示
        var TempYear = i;
        if (TimePickTempData[Name].ROC == true) {
            TempYear = TempYear - 1911;
        }

        $(Event).parent().find('.TimePickSelect .TimePickTitle_SelectOption_Year').append(
            '<option value="' + i + '">' + TempYear + ' ' + TimePickTempData[Name].TimeText.Year + '</option>');
    }
    //填入月份下拉選單
    for (var i = 0; i < TimePickTempData[Name].MonthsText.length; i++) {
        $(Event).parent().find('.TimePickSelect .TimePickTitle_SelectOption_Month').append(
            '<option value="' + i + '">' + TimePickTempData[Name].MonthsText[i] + '</option>');
    }

    //賦予開啟年份月份設定
    var SetDate = new Date();
    if (TimePickTempData[Name].Pick != null) {
        SetDate = TimePickTempData[Name].Pick.Object;
    }

    //呼叫日曆建構函數
    TimePickBuild(Event, Name, {
        Mode: 'PickCell',
        SetDate: SetDate
    });

    //顯示選擇器容器
    $(Event).parent().find('.TimePickSelect').show(200, function () {

        var TimpPickEvent = $(Event).parent();

        //判斷是否有使用 超出視窗位移下拉選單
        if (TimePickTempData[Name].MoveList == true) {

            //行動裝置不需要位移判斷
            if (!navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i)) {

                //判斷是否需要調整位置
                var tempEvenTop = TimpPickEvent.find('.TimePickSelect').offset().top + TimpPickEvent.find('.TimePickSelect').height() - $('html')[0].scrollTop;
                var tempEvenRight = TimpPickEvent.find('.TimePickSelect').offset().left + TimpPickEvent.find('.TimePickSelect').width() - $('html')[0].scrollLeft + 40;
                var tempBodyH = window.innerHeight; //$('body').height();
                var tempBodyW = window.innerWidth; //$('body').width();


                //判斷是否有使用 使用手動控制選單位移量 MoveListCtrl
                if (TimePickTempData[Name].MoveListCtrl != null) {

                    //位移
                    TimpPickEvent.find('.TimePickSelect').animate({
                        top: TimePickTempData[Name].MoveListCtrl.Top,
                        left: TimePickTempData[Name].MoveListCtrl.Left,
                    }, 300);

                } else {

                    //計算位移量
                    var tempTop = tempBodyH - tempEvenTop;
                    var tempLeft = tempBodyW - tempEvenRight;

                    //位移
                    if (tempEvenRight > tempBodyW &&
                        tempEvenTop > tempBodyH) {

                        TimpPickEvent.find('.TimePickSelect').animate({
                            top: tempTop,
                            left: tempLeft
                        }, 300);

                    } else if (tempEvenRight > tempBodyW) {

                        TimpPickEvent.find('.TimePickSelect').animate({
                            left: tempLeft
                        }, 300);

                    } else if (tempEvenTop > tempBodyH) {

                        TimpPickEvent.find('.TimePickSelect').animate({
                            top: tempTop
                        }, 300);

                    }

                }

            }

        }

    });

    //防止點擊選項時關閉選單
    $('.TimePick').click(function (event) {
        event.stopPropagation();

        //判斷關閉下拉選單
        if ($('.DropListSelect').not('.DropListSelect_List').length > 0) {
            //判斷是否有 OnEnd 函數可執行
            if (DropListTempOnEndName != null) {

                //清單模式不執行
                if (DropListTempData[DropListTempOnEndName].Mode != 'list') {
                    DropListTempData[DropListTempOnEndName].OnEnd(DropListTempData[DropListTempOnEndName].Select, DropListTempOnEndName);
                }

                DropListTempOnEndName = null;
            }

            //關閉所有選單 (除了清單模式)
            $('.DropListSelect').not('.DropListSelect_List').hide(200, function () {
                //清除所有選單容器
                $('.DropListSelect').not('.DropListSelect_List').remove();
            });
        }
    });

};
//日曆建構函數
TimePickBuild = function (Event, Name, Setting) {

    //Setting = {
    //    Mode: 'PickCell',         ※模式：PickCell下拉呼叫、ArrowBtn箭頭呼叫、PickBtn選取按鈕、RestoreBtn恢復預設按鈕、SelectOption時間下拉選單
    //    SetDate: SetDate,         ※指定時間
    //};

    //====================================== DateBox 日期 ======================================

    //若操作年份下拉選單時 不修改
    if (Setting.Mode != 'YearMonth' && Setting.Mode != 'TimePick') {
        //指定選取年份
        $(Event).parent().find('.TimePickSelect .TimePickTitle_SelectOption_Year')[0].value = Setting.SetDate.getFullYear();
        //指定選取月份
        $(Event).parent().find('.TimePickSelect .TimePickTitle_SelectOption_Month')[0].value = Setting.SetDate.getMonth();
    }

    //若操作時間下拉選單時 不修改
    if (Setting.Mode != 'TimePick') {

        //計算日期矩陣
        var MonthPeriod = TimePickGetMonthPeriod(Setting.SetDate.getFullYear(), (Setting.SetDate.getMonth() + 1));

        //取得這個月第一天的星期位置 取得的數值 就是前面要增加的天數
        var InsertAbove = new Date(MonthPeriod.StartDate).getDay();
        //取得這個月總天數
        var ThisDateDay = new Date(MonthPeriod.EndDate).getDate();
        //取得這個月最後一天的星期位置 6減去取得的數值 就是後面要增加的天數
        var InsertBelow = 6 - new Date(MonthPeriod.EndDate).getDay();
        //判斷是否滿42天 如果沒有滿就補足
        var InsertDaySum = InsertAbove + ThisDateDay + InsertBelow;
        if (InsertDaySum != 42) {
            InsertBelow = InsertBelow + (42 - InsertDaySum);
        }

        //暫時套用到陣列 一天等於86400000毫秒 (24 * 60 * 60 * 1000)
        var TempArray = [];
        //補足之前天數
        for (var i = InsertAbove; i > 0; i--) {
            TempArray.push({
                Type: 'Above',
                //String: new Date(new Date(MonthPeriod.StartDate).getTime() - (86400000 * i)).TimePickFormat('yyyy-MM-dd HH:mm:ss'),
                Object: new Date(new Date(MonthPeriod.StartDate).getTime() - (86400000 * i))
            });
        }
        //當月天數 (套用標準化時間字串)
        for (var i = 0; i < ThisDateDay; i++) {

            var TempObject;

            //判斷如果是IE或safari就要標準化
            if (TimePickBrowser.chrome || TimePickBrowser.firefox) {
                TempObject = new Date(Setting.SetDate.getFullYear() + '-' + (Setting.SetDate.getMonth() + 1) + '-' + (i + 1))
            } else {
                TempObject = new Date(TimePickFormatDate(Setting.SetDate.getFullYear() + '-' + (Setting.SetDate.getMonth() + 1) + '-' + (i + 1)))
            }

            TempArray.push({
                Type: 'This',
                Object: TempObject
            });
        }
        //補足之後天數
        for (var i = 0; i < InsertBelow; i++) {
            TempArray.push({
                Type: 'Below',
                Object: new Date(new Date(MonthPeriod.EndDate).getTime() + (86400000 * (i + 1)))
            });
        }

        //分析 選取、今天日期、何時之前不能選、何時之後不能選
        //取 選取 時間
        var TempCheckPickDate = null;
        if (TimePickTempData[Name].Pick != null) {
            TempCheckPickDate = TimePickTempData[Name].Pick.Object.TimePickFormat('yyyy-MM-dd');
        }
        //取 今天日期 時間
        var TempCheckToday = new Date().TimePickFormat('yyyy-MM-dd');
        //取得 何時之前不能選 時間
        var TempCheckDisabledAbove = null;
        if (TimePickTempData[Name].DisabledAbove != null) {
            TempCheckDisabledAbove = new Date(TimePickTempData[Name].DisabledAbove).TimePickFormat('yyyy-MM-dd');
        }
        //取得 何時之後不能選 時間
        var TempCheckDisabledBelow = null;
        if (TimePickTempData[Name].DisabledBelow != null) {
            TempCheckDisabledBelow = new Date(TimePickTempData[Name].DisabledBelow).TimePickFormat('yyyy-MM-dd');
        }
        //取得 年份範圍
        var TempCheckDefaultDate = new Date();
        if (TimePickTempData[Name].DefaultDate != null) {
            TempCheckDefaultDate = new Date(TimePickTempData[Name].DefaultDate);
        }
        var TempCheckDisabledYear = (TempCheckDefaultDate.getFullYear() - TimePickTempData[Name].YearRangeStart) + '-01-01';
        var TempCheckDisabledEnd = (TempCheckDefaultDate.getFullYear() + TimePickTempData[Name].YearRangeEnd) + '-12-31';
        var TempCheckPrevArrowDisabled = false;
        var TempCheckNextArrowDisabled = false;
        //比對
        for (var i = 0; i < TempArray.length; i++) {

            var TempCheck = TempArray[i].Object.TimePickFormat('yyyy-MM-dd');

            if (TempCheck == TempCheckPickDate) {
                //判斷是否為預設選取
                TempArray[i].Type = 'Select';

            } else if (TempCheck == TempCheckToday) {
                //判斷有沒有今天日期
                TempArray[i].Type = 'Today';

            } else if (TempCheck < TempCheckDisabledYear || TempCheck > TempCheckDisabledEnd) {

                //判斷有沒有超過限制年份範圍
                TempArray[i].Type = 'Disabled';

            } else if (TempCheck <= TempCheckDisabledAbove || TempCheck >= TempCheckDisabledBelow) {
                //判斷有沒有小於限制日期
                TempArray[i].Type = 'Disabled';

            }

            //判斷箭頭是否隱藏
            if (TempCheck <= TempCheckDisabledYear) {
                TempCheckPrevArrowDisabled = true;
            }
            if (TempCheck >= TempCheckDisabledEnd) {
                TempCheckNextArrowDisabled = true;
            }

        }

        //只要這個月有 TempCheckPrevArrowDisabled 或 TempCheckNextArrowDisabled 就要隱藏箭頭，都沒有的話就顯示
        $(Event).parent().find('.TimePickSelect .TimePickPrevArrow').show();
        $(Event).parent().find('.TimePickSelect .TimePickNextArrow').show();
        if (TempCheckPrevArrowDisabled == true) {
            $(Event).parent().find('.TimePickSelect .TimePickPrevArrow').hide();
        }
        if (TempCheckNextArrowDisabled == true) {
            $(Event).parent().find('.TimePickSelect .TimePickNextArrow').hide();
        }

        //宣告巢狀矩陣
        TimePickTempData[Name].TableDate = [];

        //將暫存陣列 分析成巢狀矩陣
        for (var i = 0; i < TempArray.length;) {

            TimePickTempData[Name].TableDate.push([
                TempArray[i],
                TempArray[i + 1],
                TempArray[i + 2],
                TempArray[i + 3],
                TempArray[i + 4],
                TempArray[i + 5],
                TempArray[i + 6]
            ]);

            i = i + 7;
        }

        //先清空 TimePickTable
        $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tbody').empty();

        //放置日期span 依照內存參數判斷顯示class -------------------------------- 按鈕呼叫處
        for (var i = 0; i < TimePickTempData[Name].TableDate.length; i++) {

            //填入 tr
            $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tbody').append('<tr></tr>');
            //放入 td
            for (j = 0; j < TimePickTempData[Name].TableDate[i].length; j++) {

                //依照type調整class
                if (TimePickTempData[Name].TableDate[i][j].Type == 'Above' || TimePickTempData[Name].TableDate[i][j].Type == 'Below') {
                    //不是這個月 Above Below (可點擊)
                    $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tr:last').append(
                        '<td><span class="TimePickTableSpan TimePickTableFalse" onclick="TimePickPickBtn($(this),\'' + Name + '\')" date-value="' + TimePickTempData[Name].TableDate[i][j].Object.TimePickFormat('yyyy-MM-dd') + '">' + TimePickTempData[Name].TableDate[i][j].Object.getDate() + '</span></td>');

                } else if (TimePickTempData[Name].TableDate[i][j].Type == 'Disabled') {
                    //不可選取 Disabled
                    $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tr:last').append(
                        '<td><span class="TimePickTableSpan TimePickTableDisabled">' + TimePickTempData[Name].TableDate[i][j].Object.getDate() + '</span></td>');

                } else if (TimePickTempData[Name].TableDate[i][j].Type == 'Select') {
                    //預設選取 Select
                    $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tr:last').append(
                        '<td><span class="TimePickTableSpan TimePickTableSelect">' + TimePickTempData[Name].TableDate[i][j].Object.getDate() + '</span></td>');

                } else if (TimePickTempData[Name].TableDate[i][j].Type == 'Today') {
                    //今日 Today (可點擊)
                    $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tr:last').append(
                        '<td><span class="TimePickTableSpan TimePickTableToday" onclick="TimePickPickBtn($(this),\'' + Name + '\')" date-value="' + TimePickTempData[Name].TableDate[i][j].Object.TimePickFormat('yyyy-MM-dd') + '">' + TimePickTempData[Name].TableDate[i][j].Object.getDate() + '</span></td>');

                } else {
                    //剩下就是空的 This (可點擊)
                    $(Event).parent().find('.TimePickSelect .TimePickDateBox .TimePickTable tr:last').append(
                        '<td><span class="TimePickTableSpan" onclick="TimePickPickBtn($(this),\'' + Name + '\')" date-value="' + TimePickTempData[Name].TableDate[i][j].Object.TimePickFormat('yyyy-MM-dd') + '">' + TimePickTempData[Name].TableDate[i][j].Object.getDate() + '</span></td>');

                }

            }

        }

    }

    //如果設定為關閉 則隱藏日期選擇區塊
    if (TimePickTempData[Name].DatePick == false) {
        $('.TimePickHeader').hide();
        $('.TimePickDateBox').hide();
        $('.TimePickTimeBox').css('border-top', '0');
    }

    //====================================== TimeBox 時間 ======================================

    //時間選擇 select 內部的 option (只有按鈕呼叫時才需要建構)
    if (Setting.Mode == 'PickCell') {
        //填入小時下拉選單
        for (var i = 0; i < 24; i++) {
            $(Event).parent().find('.TimePickSelect .TimePickTimeBox_SelectOption_Hours').append(
                '<option value="' + i + '">' + i + ' ' + TimePickTempData[Name].TimeText.Hours + '</option>');
        }
        //填入分鐘下拉選單
        for (var i = 0; i < 60; i++) {
            $(Event).parent().find('.TimePickSelect .TimePickTimeBox_SelectOption_Minutes').append(
                '<option value="' + i + '">' + i + ' ' + TimePickTempData[Name].TimeText.Minutes + '</option>');
        }
        //填入秒下拉選單
        for (var i = 0; i < 60; i++) {
            $(Event).parent().find('.TimePickSelect .TimePickTimeBox_SelectOption_Seconds').append(
                '<option value="' + i + '">' + i + ' ' + TimePickTempData[Name].TimeText.Seconds + '</option>');
        }
    }

    //判斷是否需要指定選取時間 (箭頭選擇、選擇按鈕不指定)
    if (Setting.Mode == 'PickCell' || Setting.Mode == 'RestoreBtn') {
        if (TimePickTempData[Name].TimePick == true && TimePickTempData[Name].Pick != null) {
            //指定選取小時
            $(Event).parent().find('.TimePickSelect .TimePickTimeBox_SelectOption_Hours')[0].value = Setting.SetDate.getHours();
            //指定選取分鐘
            $(Event).parent().find('.TimePickSelect .TimePickTimeBox_SelectOption_Minutes')[0].value = Setting.SetDate.getMinutes();

            //判斷是否需要指定選取秒數
            if (TimePickTempData[Name].SecondsPike == true) {
                //指定選取秒
                $(Event).parent().find('.TimePickSelect .TimePickTimeBox_SelectOption_Seconds')[0].value = Setting.SetDate.getSeconds();
            }
        }
    }

    //====================================== 其他 ======================================

    //改變按鈕文字 依照使用者設定的 Format 賦予
    if (TimePickTempData[Name].TextView == true) {
        if (TimePickTempData[Name].Pick == null) {
            //如果取值為空值 就顯示預設文字
            $(Event).parent().find('.TimePickText').html(TimePickTempData[Name].ButtonText + '&nbsp;');

        } else if (TimePickTempData[Name].ROC == true) {
            //先取西元年文字
            var TempROC = TimePickTempData[Name].Pick.Object.TimePickFormat(TimePickTempData[Name].Format);
            //西元年 直接取代成 民國年
            TempROC = TempROC.replace(new Date(TimePickTempData[Name].Pick.Object).getFullYear(), (new Date(TimePickTempData[Name].Pick.Object).getFullYear() - 1911));
            //套用民國年
            $(Event).parent().find('.TimePickText').html(TempROC + '&nbsp;');

        } else {
            //套用西元年
            $(Event).parent().find('.TimePickText').html(TimePickTempData[Name].Pick.Object.TimePickFormat(TimePickTempData[Name].Format) + '&nbsp;');

        }
    }



    //console.dir($(Event).parent().find('.TimePickText'))
    //console.dir(TimePickTempData[Name].Pick)

    return;
};


//選取 按鈕
TimePickPickBtn = function (Event, Name) {

    //console.dir($(Event).parent().parent().parent().parent().parent().parent().parent().find('button')[0])
    //console.dir(Name)

    //取得 選取 時間
    var TempPickDate = $(Event).attr('date-value');

    //取得 時間 數值
    var TempHours = 0;
    var TempMinutes = 0;
    var TempSeconds = 0;
    if (TimePickTempData[Name].TimePick == true) {

        TempHours = $(Event).parent().parent().parent().parent().parent().parent().find('.TimePickTimeBox_SelectOption_Hours')[0].value;
        TempMinutes = $(Event).parent().parent().parent().parent().parent().parent().find('.TimePickTimeBox_SelectOption_Minutes')[0].value;

        if (TimePickTempData[Name].SecondsPike == true) {

            TempSeconds = $(Event).parent().parent().parent().parent().parent().parent().find('.TimePickTimeBox_SelectOption_Seconds')[0].value;
        }
    }
    //調整字串長度
    if (TempHours.length == 1) {
        TempHours = '0' + TempHours;
    }
    if (TempMinutes.length == 1) {
        TempMinutes = '0' + TempMinutes;
    }
    if (TempSeconds.length == 1) {
        TempSeconds = '0' + TempSeconds;
    }

    //拼出時間字串 (標準化時間字串)
    var TempString = TimePickFormatDate(new Date(TempPickDate).TimePickFormat('yyyy-MM-dd') + ' ' + TempHours + ':' + TempMinutes + ':' + TempSeconds);

    //設置 取值物件 Pick 變數
    TimePickTempData[Name].Pick = {
        Time: new Date(TempString).getTime(),
        ROCFormat: new Date(TempString).TimePickFormat(TimePickTempData[Name].Format).replace(new Date(TempString).getFullYear(), (new Date(TempString).getFullYear() - 1911)),
        Format: new Date(TempString).TimePickFormat(TimePickTempData[Name].Format),
        String: TempString.TimePickFormat('yyyy-MM-dd HH:mm:ss'),
        ROCString: (new Date(TempPickDate).getFullYear() - 1911) + new Date(TempPickDate).TimePickFormat('-MM-dd') + ' ' + TempHours + ':' + TempMinutes + ':' + TempSeconds,
        Object: new Date(TempString)
    };

    //執行 OnChange 函數
    if (TimePickTempData[Name].OnChange != null) {
        TimePickTempData[Name].OnChange(TimePickTempData[Name].Pick, Name);
    }

    //呼叫日曆建構函數
    TimePickBuild($(Event).parent().parent().parent().parent().parent().parent().parent().find('button')[0], Name, {
        Mode: 'PickBtn',
        SetDate: new Date(TempPickDate)
    });


    //若 點選日期後自動關閉 功能開啟時 則自動關閉選單
    if (TimePickTempData[Name].PickAuto == true) {
        //判斷在視窗開啟的情況下才可以關閉
        if ($('.TimePickSelect').length > 0) {

            //清除目前使用的名稱
            TimePickTempNowName = null;

            //執行 OnClose 函數
            if (TimePickTempData[Name].OnClose != null) {
                TimePickTempData[Name].OnClose(TimePickTempData[Name].Pick, Name);
            }

            //關閉選單
            $('.TimePickSelect').hide(200, function () {
                //清除選擇器容器
                $('.TimePickSelect').remove();
            });
        }
    }

};
//恢復預設 按鈕
TimePickRestoreBtn = function (Event, Name) {

    //console.dir($(Event).parent().parent().parent().find('button')[0])
    //console.dir(Name)

    var SetDate = new Date();

    //恢復預設
    if (TimePickTempData[Name].DefaultDate == null) {
        //設置 取值物件 Pick 變數
        TimePickTempData[Name].Pick = null;
        //重製時間選單
        if (TimePickTempData[Name].TimePick == true) {
            $(Event).parent().parent().find('.TimePickTimeBox_SelectOption_Hours')[0].value = 0;
            $(Event).parent().parent().find('.TimePickTimeBox_SelectOption_Minutes')[0].value = 0;

            if (TimePickTempData[Name].SecondsPike == true) {
                $(Event).parent().parent().find('.TimePickTimeBox_SelectOption_Seconds')[0].value = 0;
            }
        }
    } else {
        //設置 取值物件 Pick 變數
        TimePickTempData[Name].Pick = {
            Time: new Date(TimePickTempData[Name].DefaultDate).getTime(),
            ROCFormat: new Date(TimePickTempData[Name].DefaultDate).TimePickFormat(TimePickTempData[Name].Format).replace(new Date(TimePickTempData[Name].DefaultDate).getFullYear(), (new Date(TimePickTempData[Name].DefaultDate).getFullYear() - 1911)),
            Format: new Date(TimePickTempData[Name].DefaultDate).TimePickFormat(TimePickTempData[Name].Format),
            String: new Date(TimePickTempData[Name].DefaultDate).TimePickFormat('yyyy-MM-dd HH:mm:ss'),
            ROCString: (new Date(TimePickTempData[Name].DefaultDate).getFullYear() - 1911) + new Date(TimePickTempData[Name].DefaultDate).TimePickFormat('-MM-dd HH:mm:ss'),
            Object: new Date(TimePickTempData[Name].DefaultDate)
        };

        SetDate = TimePickTempData[Name].Pick.Object;

    }

    //執行 OnChange 函數
    if (TimePickTempData[Name].OnChange != null) {
        TimePickTempData[Name].OnChange(TimePickTempData[Name].Pick, Name);
    }

    //呼叫日曆建構函數
    TimePickBuild($(Event).parent().parent().parent().find('button')[0], Name, {
        Mode: 'RestoreBtn',
        SetDate: SetDate
    });

};
//取消 按鈕
TimePickCloseBtn = function (Event, Name) {

    //console.dir($(Event).parent().parent().parent().find('button .TimePickText'))
    //console.dir(TimePickTempData[Name].CloseText)

    //清除目前使用的名稱
    TimePickTempNowName = null;

    if (TimePickTempData[Name].TextView == true) {
        //恢復紀錄的顯示文字
        $(Event).parent().parent().parent().find('button .TimePickText').html(TimePickTempData[Name].CloseText);
    }

    //物件還原
    TimePickTempData[Name].Pick = TimePickTempData[Name].ClosePick;

    //關閉選單
    $('.TimePickSelect').hide(200, function () {
        //清除選擇器容器
        //$(Event).parent().parent().remove();
        $('.TimePickSelect').remove();
    });

};
//箭頭呼叫 按鈕
TimePickArrowBtn = function (Event, Name, Mode) {

    //console.dir($(Event).parent().parent().parent().parent().find('button')[0])
    //console.dir($(Event).parent().parent().parent())
    //console.dir(Name)

    //取得 當前年份月份位置
    var TempYear = $(Event).parent().parent().parent().find('.TimePickTitle_SelectOption_Year')[0].value;
    var TempMonth = parseInt($(Event).parent().parent().parent().find('.TimePickTitle_SelectOption_Month')[0].value) + 1;

    var TempObject = new Date(TempYear + '-' + TempMonth + '-01');

    //判斷如果是IE或safari就要標準化 (套用標準化時間字串)
    if (TimePickBrowser.chrome || TimePickBrowser.firefox) {
        var TempObject = new Date(TempYear + '-' + TempMonth + '-01');
    } else {
        var TempObject = new Date(TimePickFormatDate(TempYear + '-' + TempMonth + '-01'));
    }

    //左箭頭
    if (Mode == 'Prev') {
        TempObject.setMonth(TempObject.getMonth() - 1);
    }
    //右箭頭
    if (Mode == 'Next') {
        TempObject.setMonth(TempObject.getMonth() + 1);
    }

    //console.dir(TempObject.getFullYear())

    //呼叫日曆建構函數
    TimePickBuild($(Event).parent().parent().parent().parent().find('button')[0], Name, {
        Mode: 'ArrowBtn',
        SetDate: TempObject
    });

};
//確定 按鈕
TimePickSelectBtn = function (Event, Name) {

    //清除目前使用的名稱
    TimePickTempNowName = null;

    //執行 OnClose 函數
    if (TimePickTempData[Name].OnClose != null) {
        TimePickTempData[Name].OnClose(TimePickTempData[Name].Pick, Name);
    }

    //關閉選單
    $('.TimePickSelect').hide(200, function () {
        //清除選擇器容器
        //$(Event).parent().parent().remove();
        $('.TimePickSelect').remove();
    });

};
//下拉選單 OnChange 事件
TimePickSelectOptionOnChange = function (Event, Name, Mode) {

    //YearMonth
    //console.dir($(Event).parent().parent().parent().parent())
    //TimePick
    //console.dir($(Event).parent().parent())

    //套用物件
    var TempEvemt = null;
    var TempString = '';
    if (Mode == 'YearMonth') {
        TempEvemt = $(Event).parent().parent().parent().parent();
    } else if (Mode == 'TimePick') {
        TempEvemt = $(Event).parent().parent();
    }

    //取得 時間 數值
    var TempYear = 0;
    var TempMonth = 0;
    var TempHours = 0;
    var TempMinutes = 0;
    var TempSeconds = 0;
    TempYear = $(TempEvemt).find('.TimePickTitle_SelectOption_Year')[0].value;
    TempMonth = '' + (parseInt($(TempEvemt).find('.TimePickTitle_SelectOption_Month')[0].value) + 1);
    if (TimePickTempData[Name].TimePick == true) {

        TempHours = $(TempEvemt).find('.TimePickTimeBox_SelectOption_Hours')[0].value;
        TempMinutes = $(TempEvemt).find('.TimePickTimeBox_SelectOption_Minutes')[0].value;

        if (TimePickTempData[Name].SecondsPike == true) {

            TempSeconds = $(TempEvemt).find('.TimePickTimeBox_SelectOption_Seconds')[0].value;
        }
    }

    //調整字串長度
    if (TempHours.length == 1) {
        TempHours = '0' + TempHours;
    }
    if (TempMinutes.length == 1) {
        TempMinutes = '0' + TempMinutes;
    }
    if (TempSeconds.length == 1) {
        TempSeconds = '0' + TempSeconds;
    }

    //帶入選取值
    var TempPickDate = new Date();
    if (TimePickTempData[Name].Pick != null) {
        TempPickDate = TimePickTempData[Name].Pick.Object;
    }

    //判斷是年月 還是時間 的下拉選單
    if (Mode == 'YearMonth') {

        //拼出時間字串 (套用標準化時間字串)
        TempString = TimePickFormatDate(TempYear + '-' + TempMonth);

    } else if (Mode == 'TimePick') {

        //拼出時間字串 (套用標準化時間字串)
        TempString = TimePickFormatDate(new Date(TempPickDate).TimePickFormat('yyyy-MM-dd') + ' ' + TempHours + ':' + TempMinutes + ':' + TempSeconds);

        //設置 取值物件 Pick 變數
        TimePickTempData[Name].Pick = {
            Time: new Date(TempString).getTime(),
            ROCFormat: new Date(TempString).TimePickFormat(TimePickTempData[Name].Format).replace(new Date(TempString).getFullYear(), (new Date(TempString).getFullYear() - 1911)),
            Format: new Date(TempString).TimePickFormat(TimePickTempData[Name].Format),
            String: TempString.TimePickFormat('yyyy-MM-dd HH:mm:ss'),
            ROCString: (parseInt(TempYear) - 1911) + new Date(TempPickDate).TimePickFormat('-MM-dd') + ' ' + TempHours + ':' + TempMinutes + ':' + TempSeconds,//(new Date(TempPickDate).getFullYear() - 1911) + new Date(TempPickDate).TimePickFormat('-MM-dd') + ' ' + TempHours + ':' + TempMinutes + ':' + TempSeconds,
            Object: new Date(TempString)
        };

        //執行 OnChange 函數
        if (TimePickTempData[Name].OnChange != null) {
            TimePickTempData[Name].OnChange(TimePickTempData[Name].Pick, Name);
        }

    }

    //呼叫日曆建構函數
    TimePickBuild($(TempEvemt).parent().find('button')[0], Name, {
        Mode: Mode,
        SetDate: new Date(TempString)
    });

};
//滑鼠滾輪觸發 每小時 下拉選單 OnChange 事件 (此處使用 document 會跟其他第三方套件衝突 所以只好改監視 html)
if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
    $('html').on('mousewheel', '.TimePickTitle_SelectOption_Year,.TimePickTitle_SelectOption_Month,.TimePickTimeBox_SelectOption_Hours,.TimePickTimeBox_SelectOption_Minutes,.TimePickTimeBox_SelectOption_Seconds', function (e) {

        //取得目前選取的位置
        var selectedIndex = $(this)[0].selectedIndex;
        var optionCount = $(this)[0].childNodes.length - 1;

        //計算滾動
        if (e.deltaY == 1) {
            if (selectedIndex > 0) {
                selectedIndex--;
            } else {
                return false;
            }
        } else if (e.deltaY == -1) {
            if (selectedIndex < optionCount) {
                selectedIndex++;
            } else {
                return false;
            }
        }

        //賦予值
        $(this).val($(this)[0][selectedIndex].value);

        //刷新數值
        TimePickSelectOptionOnChange($(this), $(this).attr('select-boxname'), $(this).attr('select-type'));

        return false;
    });
};
//取得時間選擇器選取數值
TimePickGet = function (Name) {
    return TimePickTempData[Name].Pick;
};


//修改選填項目參數
TimePickSettingChange = function (Name, Setting) {

    //先複製出目前的參數
    var tempSetting = TimePickTempData[Name];

    //重新套用
    for (var i in Setting) {
        //排除 ID 項目
        if (i != 'ID') {
            //直接套用
            tempSetting[i] = Setting[i];
        }
    }

    //執行建立
    TimePickSetting(tempSetting);

};



//計算當月起始日與結束日 (回傳計算結果物件) (套用標準化時間字串)
TimePickGetMonthPeriod = function (Year, Month) {

    //取得日期
    //var TempDate = new Date(Year + '-' + Month + '-01');
    var TempDate = TimePickFormatDate(Year + '-' + Month + '-01');

    //定日期為第一天
    var UTC_StartDate = TempDate.setDate(1);
    var StartDate = TempDate.getFullYear() + '-' + (TempDate.getMonth() + 1) + '-' + TempDate.getDate();

    //將月份移至下個月份
    TempDate.setMonth(TempDate.getMonth() + 1);
    //設定為下個月份的第一天
    TempDate.setDate(1);
    //將日期-1為當月的最後一天
    var UTC_EndDate = TempDate.setDate(TempDate.getDate() - 1);
    var EndDate = TempDate.getFullYear() + '-' + (TempDate.getMonth() + 1) + '-' + TempDate.getDate();

    //判斷如果是IE或safari就要標準化
    if (TimePickBrowser.chrome || TimePickBrowser.firefox) {
    } else {
        StartDate = TimePickFormatDate(StartDate);
        EndDate = TimePickFormatDate(EndDate);
    }

    return { StartDate: StartDate, EndDate: EndDate };
};
//標準化時間字串 (為了相容IE)
TimePickFormatDate = function (DateVal) {

    //判斷是字串還是物件
    if (typeof (DateVal) == 'string') {

        var TempDate = new Date(DateVal);

        var TempLeft;
        var TempRight;
        //切割日期跟時間
        if (DateVal.match(/(.*?) /) != null) {
            TempLeft = DateVal.match(/(.*?) /)[1];
            TempRight = DateVal.replace(DateVal.match(/(.*?) /)[0], '');
        } else {
            TempLeft = DateVal;
        }

        //分析陣列
        if (DateVal.match(/(.*?) /) != null) {
            //分析 日期
            TempLeft = TempLeft.split('-');
            //分析 時間
            TempRight = TempRight.split(':');
        } else {
            //分析 日期
            TempLeft = TempLeft.split('-');
            TempRight = [];
        }

        //導入年份 (若有資料就帶入，無資料帶預設)
        if (TempLeft[0] != undefined) {
            TempDate.setFullYear(TempLeft[0]);
        } else {
            TempDate.setFullYear(1970);
        }

        //導入月份
        if (TempLeft[1] != undefined) {
            TempDate.setMonth(parseInt(TempLeft[1]) - 1);
        } else {
            TempDate.setMonth(0);
        }

        //導入日期
        if (TempLeft[2] != undefined) {
            TempDate.setDate(TempLeft[2]);
        } else {
            TempDate.setDate(1);
        }

        //導入時間
        if (TempRight[0] != undefined) {
            TempDate.setHours(TempRight[0]);
        } else {
            TempDate.setHours(0);
        }
        //導入分鐘
        if (TempRight[1] != undefined) {
            TempDate.setMinutes(TempRight[1]);
        } else {
            TempDate.setMinutes(0);
        }
        //導入秒
        if (TempRight[2] != undefined) {
            TempDate.setSeconds(TempRight[2]);
        } else {
            TempDate.setSeconds(0);
        }

        //回傳
        return TempDate;

    } else if (typeof (DateVal) == 'object') {
        //物件本身適用 直接離開
        return DateVal;
    }

};
//調整日曆外觀大小
TimePickSelectResize = function () {

    var WindowWidth = window.innerWidth;
    var WindowHeight = window.innerHeight;

    //計算置中

    if (WindowHeight <= 420) {
        $('.TimePickSelect').css({
            top: '10px',
            zoom: 0.9
        });
    }
    if (WindowWidth >= 768) {
        $('.TimePickSelect').css({
            top: '20px',
            zoom: 1.5
        });
    }
    if (WindowWidth >= 1024) {
        $('.TimePickSelect').css({
            top: '20px',
            zoom: 1.75
        });
    }

};
//每次改變視窗大小時 調整日曆外觀大小
$(window).resize(function () {
    if (navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i)) {
        TimePickSelectResize();
    }
});
//點擊空白處隱藏選單 (防止點擊選項時關閉選單 改至 呼叫日曆 最後執行)
$(document).click(function () {

    //判斷在視窗開啟的情況下才可以關閉
    if ($('.TimePickSelect').length > 0) {

        ////清除目前使用的名稱
        //TimePickTempNowName = null;
        //if (TimePickTempData[TimePickTempCloseName].TextView == true) {
        //    //恢復紀錄的顯示文字
        //    $(TimePickTempCloseEvent).find('.TimePickText').html(TimePickTempData[TimePickTempCloseName].CloseText);
        //}
        ////物件還原
        //TimePickTempData[TimePickTempCloseName].Pick = TimePickTempData[TimePickTempCloseName].ClosePick;
        ////關閉選單
        //$('.TimePickSelect').hide(200, function () {
        //    //清除選擇器容器
        //    $('.TimePickSelect').remove();
        //});

        //清除目前使用的名稱
        TimePickTempNowName = null;

        //執行 OnClose 函數
        if (TimePickTempData[TimePickTempCloseName].OnClose != null) {
            TimePickTempData[TimePickTempCloseName].OnClose(TimePickTempData[TimePickTempCloseName].Pick, TimePickTempCloseName);
        }

        //關閉選單
        $('.TimePickSelect').hide(200, function () {
            //清除選擇器容器
            $('.TimePickSelect').remove();
        });

    }

});
//ESC 關閉選單
$(document).on('keyup', 'body', function (key_event) {
    //判斷在視窗開啟的情況下才可以關閉
    if ($('.TimePickSelect').length > 0) {
        if (key_event.keyCode == 27) {

            //清除目前使用的名稱
            TimePickTempNowName = null;

            if (TimePickTempData[TimePickTempCloseName].TextView == true) {
                //恢復紀錄的顯示文字
                $(TimePickTempCloseEvent).find('.TimePickText').html(TimePickTempData[TimePickTempCloseName].CloseText);
            }

            //物件還原
            TimePickTempData[TimePickTempCloseName].Pick = TimePickTempData[TimePickTempCloseName].ClosePick;

            //關閉選單
            $('.TimePickSelect').hide(200, function () {
                //清除選擇器容器
                $('.TimePickSelect').remove();
            });

        }
    }
});



// jQuery 風格使用函數
$.fn.extend({
    //定義時間選擇器
    TimeSetting: function (Setting) {
        if ($(this).length > 0) {
            if ($(this)[0].id != '') {
                //有 id
                Setting['ID'] = $(this)[0].id;
                TimePickSetting(Setting);
            } else {
                //無 id
                console.info('缺乏物件[ID]參數設定！');
            }
        }
    },
    //取得時間選擇器選取數值
    TimeGet: function () {
        return TimePickGet($(this)[0].id);
    },
    //修改{選填項目}參數
    TimeSettingChange: function (Setting) {
        TimePickSettingChange($(this)[0].id, Setting);
    },
});




//取得目前時間 並格式化
//var Today = new Date();
//console.dir('現在時間：' + Today.TimePickFormat('yyyy-MM-dd HH:mm:ss'));
//console.dir('現在時間：' + Today.getFullYear() + '年' + (Today.getMonth() + 1) + '月' + Today.getDate() + '日' + Today.getHours() + '點' + Today.getMinutes() + '分' + Today.getSeconds() + '.' + Today.getMilliseconds() + '秒');

//取得今日星期 (從 0 開始算起)
//var WeekdaysArray = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
//console.dir('今日為：' + WeekdaysArray[Today.getDay()]);

//取得月份 (從 0 開始算起)
//var MonthsArray = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
//console.dir('這個月為：' + MonthsArray[Today.getMonth()]);


//var MonthPeriod = GetMonthPeriod(Today.getFullYear(), (Today.getMonth() + 1));
//console.dir('本月起始日：' + MonthPeriod.StartDate);
//console.dir('本月結束日：' + MonthPeriod.EndDate);

