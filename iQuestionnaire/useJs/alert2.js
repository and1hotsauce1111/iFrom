/*
  Ver 2.0.11

  ※可與舊版本並存
  ※解析度 1920 以上時，由 css 控制放大 1.25 倍

  函數調用需再 jQuery 1.9.1 ~ 3.3.1 環境使用

-----------------------------------------------------------------------------------------------------------------------------

  ※調整 AlertBoxSetting 變數可做全域設定

  以下為可調用函數
  呼叫視窗         >  alertBox({ 選填項目 })
  關閉視窗         >  alertClose('執行狀態', 'Code碼')   ※執行狀態分別為('ok'、'cancel')
                                                           若無填寫則不會執行結束後函數，但會關閉視窗
                                                           若無設定 Code碼 則預設關閉最上層的視窗
                                                           a. alert模式時：   設置 'ok'、'cancel' 時，將執行 OnOK、OnCancel、OnClose、OnEnd 函數
                                                           b. confirm模式時： 設置 'ok' 時，將執行 OnClose、OnOK、OnEnd 函數
                                                                              設置 'cancel' 時，將執行 OnCancel、OnClose、OnEnd 函數
                                                           c. prompt模式時：  設置 'ok' 時，將執行 OnClose、OnOK、OnEnd 函數
                                                                              設置 'cancel' 時，將執行 OnCancel、OnClose、OnEnd 函數
                                                           d. progress模式時：設置 'ok'、'cancel' 時，將執行 OnOK、OnCancel、OnClose、OnEnd 函數
                                                           e. loading模式時： 設置 'ok'、'cancel' 時，將執行 OnOK、OnCancel、OnClose、OnEnd 函數
                  
  改變進度條資訊   >  alertProgress(百分比, 'Html內容', 自動關閉設定)  ※此為 progress 模式專用函數
                                                                         百分比請輸入純數字設定參數，Html內容為非必填項目，可自行斟酌
                                                                         若百分比大於100時，將延遲0.5秒(預設)後自動關閉視窗，並執行 OnEnd 函數
                                                                         自動關閉設定如果設定為 true 為自動關閉，設定為 false 為不關閉，預設為 true
                  
  改變loading內容  >  alertLoadingMsg('Html內容', 'Code碼')  ※此為 loading 模式專用函數，Code碼為非必填項目，可自行斟酌

  關閉loading視窗  >  alertLoadingEnd('Html內容', 延遲毫秒, 回調函數, 'Code碼')  ※此為 loading 模式專用函數
                                                                                   所有參數為非必填項目，可自行斟酌
                                                                                   延遲毫秒請輸入純數字設置，單位為毫秒數 1秒/1000毫秒
                                                                                   回調函數設定後即自動套用至 OnEnd 函數並調用

-----------------------------------------------------------------------------------------------------------------------------

  呼叫視窗 選填項目：使用模式            Mode (預設：'alert')      ※分別有下列模式('alert'('A')、'confirm'('C')、'prompt'('PM')、'progress'('PR')、'loading'('L'))，括號內大寫字母為縮寫參數
                     Html內容            Html (預設：'')           ※可利用 $(id) 帶入
                     抬頭文字            Title (預設：'')          ※若為空白或 null 則不會顯示，未設定時依照模式帶入預設值
                     操控列內容          Ctrl (預設：'')           ※若為空白或 null 則不會顯示，未設定時依照模式帶入預設值
                     擴充指令            Setting (預設：{ } )      ※依照各個 Mode 使用模式而有所不同，詳細設定請參考下面各個模式的解說
                     外層容器Style       OutsideStyle (預設：'')
                     外層容器Class       OutsideClass (預設：'')
                     內層標題Style       TitleStyle (預設：'')
                     內層標題Class       TitleClass (預設：'')
                     內層容器Style       InsideStyle (預設：'')
                     內層容器Class       InsideClass (預設：'')
                     內層控制列Style     CtrlStyle (預設：'')
                     內層控制列Class     CtrlClass (預設：'')
                     點擊其他處關閉視窗  TouchClose (預設：依附全域設定)  ※可蓋過全域設定獨立運作
                     顯示前 執行函數     OnStart (預設：null，設定時請使用 function (Code) { } )               ※執行順序 1，物件建立前執行
                     顯示時 執行函數     OnRun (預設：null，設定時請使用 function (Code) { } )                 ※執行順序 2，物件建立後且動畫前執行
                     顯示後 執行函數     OnReady (預設：null，設定時請使用 function (Code) { } )               ※執行順序 3，物件建立後且動畫後執行
                     關閉前 執行函數     OnClose (預設：null，設定時請使用 function (Type, Value) { return true; } )  ※執行順序 4，物件移除前且動畫前執行，若回傳 false 則不接續執行下面動作
                     確認後 執行函數     OnOK (預設：null，設定時請使用 function (Value) { } )                 ※執行順序 5，物件移除前且動畫後執行
                     取消後 執行函數     OnCancel (預設：null，設定時請使用 function () { } )                  ※同上
                     關閉後 執行函數     OnEnd (預設：null，設定時請使用 function () { } )                     ※同上

-----------------------------------------------------------------------------------------------------------------------------

  prompt模式 擴充指令：使用模式        Mode (預設：'text')             ※分別有下列模式('text'、'password'、'textarea')
                       預設值          Value (預設：'')
                       欄位註解        Placeholder (預設：'輸入...')
                       欄位行數        Rows (預設：3)                  ※輸入純數字設定參數，使用 textarea 模式時才會生效
                       預設框選        Select (預設：false)
                       是否必填        Required (預設：true)           ※若資料為空白則自動提示使用者該項目必填

  progress模式 擴充指令：延遲關閉時間  Delay (預設：500)               ※單位為毫秒數

  loading模式 擴充指令：延遲關閉時間   Delay (預設：500)               ※單位為毫秒數

-----------------------------------------------------------------------------------------------------------------------------
*/


//設定按鈕樣式 Class
var AlertBoxSetting = {
    OkText: '確定',                   //確認 按鈕文字
    CancelText: '取消',               //取消 按鈕文字
    OkClass: 'button btn_miku',       //確認 按鈕樣式
    CancelClass: 'button btn_white',  //取消 按鈕樣式
    CoverSpeed: 200,                  //遮罩速度
    CoverTransition: 'linear',        //遮罩過場動畫樣式
    StartSpeed: 300,                  //開啟速度
    StartTransition: 'easeOutBack',   //開啟過場動畫樣式
    EndSpeed: 200,                    //關閉速度
    EndTransition: 'linear',          //關閉過場動畫樣式
    ScrollType: 'mousewheel',         //滾動禁用模式：'overflow'、'mousewheel'、'keydown'、'none'    ※建議使用 mousewheel 最佳
    TouchClose: false,                //是否開啟點擊其他處關閉視窗 (全域設定)
    ButtonChange: false,              //確定按鈕與取消按鈕位置是否要交換
    EscClose: true,                   //使用ESC視窗關閉視窗開關
    CloseIcon: false,                 //是否要使用於 Title 區塊的關閉 icon 按鈕 (progress、loading模式無法使用)
    Compatible: true,                 //是否開啟舊版本相容函數
    FilterTarget: '#MasterPage_div',  //設定濾鏡使用 DOM 元件
    FilterBlur: false,                //是否開啟失焦濾鏡 (IE不支援、FireFox相容性較差背景有跑版面的可能)
    FilterBlurValue: 2,               //設定失焦濾鏡參數 (輸入純數字設置)
};


//宣告專用變數儲存物件
var AlertBoxTempData = {};
var AlertBoxMouseWheelCheck = true;  //判斷 body 的滾動條是否要禁用
var AlertBoxBodyScrollValue = 0;     //判斷 body 目前的 scrollTop 座標
var AlertBoxKeyupEscCloseTarget;     //ESC所使用的當前開啟的視窗辨別變數
var AlertBoxUidCode = 0;             //唯一值變數


//開啟視窗
alertBox = function (Setting) {

    //唯一值變數
    AlertBoxUidCode++;


    //定義預設值
    Setting.Mode = Setting.Mode ? Setting.Mode : 'alert';                     //使用模式
    Setting.Html = Setting.Html ? Setting.Html : '';                          //Html內容
    Setting.OutsideStyle = Setting.OutsideStyle ? Setting.OutsideStyle : '';  //外層容器Style
    Setting.OutsideClass = Setting.OutsideClass ? Setting.OutsideClass : '';  //外層容器Class
    Setting.TitleStyle = Setting.TitleStyle ? Setting.TitleStyle : '';        //內層標題Style
    Setting.TitleClass = Setting.TitleClass ? Setting.TitleClass : '';        //內層標題Class
    Setting.InsideStyle = Setting.InsideStyle ? Setting.InsideStyle : '';     //內層容器Style
    Setting.InsideClass = Setting.InsideClass ? Setting.InsideClass : '';     //內層容器Class
    Setting.CtrlStyle = Setting.CtrlStyle ? Setting.CtrlStyle : '';           //內層控制列Style
    Setting.CtrlClass = Setting.CtrlClass ? Setting.CtrlClass : '';           //內層控制列Class
    Setting.OnStart = Setting.OnStart ? Setting.OnStart : null;               //顯示前 執行函數
    Setting.OnRun = Setting.OnRun ? Setting.OnRun : null;                     //顯示時 執行函數
    Setting.OnReady = Setting.OnReady ? Setting.OnReady : null;               //顯示後 執行函數
    Setting.OnOK = Setting.OnOK ? Setting.OnOK : null;                        //確認後 執行函數
    Setting.OnCancel = Setting.OnCancel ? Setting.OnCancel : null;            //取消後 執行函數
    Setting.OnClose = Setting.OnClose ? Setting.OnClose : null;               //關閉前 執行函數
    Setting.OnEnd = Setting.OnEnd ? Setting.OnEnd : null;                     //關閉後 執行函數
    Setting.Code = Setting.Mode + '_' + AlertBoxUidCode;                      //辨識名稱 (系統使用)
    Setting.ID = null;                                                        //使用 dom 物件內容時使用變數 (系統使用)
    Setting.Setting = Setting.Setting ? Setting.Setting : {};                 //擴充指令
    Setting.TouchClose = Setting.TouchClose === undefined ? AlertBoxSetting.TouchClose : Setting.TouchClose;  //點擊其他處關閉視窗


    //對應 Setting.Mode 縮寫參數
    if (Setting.Mode === 'A') {
        Setting.Mode = 'alert';
    } else if (Setting.Mode === 'C') {
        Setting.Mode = 'confirm';
    } else if (Setting.Mode === 'PM') {
        Setting.Mode = 'prompt';
    } else if (Setting.Mode === 'PR') {
        Setting.Mode = 'progress';
    } else if (Setting.Mode === 'L') {
        Setting.Mode = 'loading';
    }
    //若 Setting.Ctrl 未設定 則依照模式賦予設定值
    if (Setting.Ctrl === undefined) {

        var tempOKBtn = '<button onclick="alertClose(\'ok\',\'' + Setting.Code + '\')" type="button" class="' + AlertBoxSetting.OkClass + '"><i class="fa fa-check"></i>&nbsp;' + AlertBoxSetting.OkText + '</button>';
        var tempCancelBtn = '<button onclick="alertClose(\'cancel\',\'' + Setting.Code + '\')" type="button" class="' + AlertBoxSetting.CancelClass + '"><i class="fa fa-times"></i>&nbsp;' + AlertBoxSetting.CancelText + '</button>';

        //判斷是否需要顛倒按鈕位置
        if (AlertBoxSetting.ButtonChange == true) {
            if (Setting.Mode == 'alert') {
                Setting.Ctrl = tempOKBtn;
            } else if (Setting.Mode == 'confirm') {
                Setting.Ctrl = tempOKBtn + '&nbsp;' + tempCancelBtn;
            } else if (Setting.Mode == 'prompt') {
                Setting.Ctrl = tempOKBtn + '&nbsp;' + tempCancelBtn;
            } else if (Setting.Mode == 'progress') {
                Setting.Ctrl = '';
            }
        } else {
            if (Setting.Mode == 'alert') {
                Setting.Ctrl = tempOKBtn;
            } else if (Setting.Mode == 'confirm') {
                Setting.Ctrl = tempCancelBtn + '&nbsp;' + tempOKBtn;
            } else if (Setting.Mode == 'prompt') {
                Setting.Ctrl = tempCancelBtn + '&nbsp;' + tempOKBtn;
            } else if (Setting.Mode == 'progress') {
                Setting.Ctrl = '';
            }
        }
    }
    //判斷是否使用關閉 icon 按鈕 (progress、loading模式、Title不顯示時無法使用)
    var tempCloseIcon = '';
    if (AlertBoxSetting.CloseIcon == true && Setting.Title != '' && Setting.Title != null) {
        tempCloseIcon = '<i onclick="alertClose(\'cancel\',\'' + Setting.Code + '\')" class="fa fa-times AlertBoxDivCloseIcon"></i>';
    }
    //若 Setting.Title 未設定 則依照模式賦予設定值
    if (Setting.Title === undefined) {
        if (Setting.Mode == 'alert') {
            Setting.Title = '<i class="fa fa-commenting-o"></i>&nbsp;訊息提示' + tempCloseIcon;
        } else if (Setting.Mode == 'confirm') {
            Setting.Title = '<i class="fa fa-check-square-o"></i>&nbsp;確認動作' + tempCloseIcon;
        } else if (Setting.Mode == 'prompt') {
            Setting.Title = '<i class="fa fa-pencil-square-o"></i>&nbsp;資料輸入' + tempCloseIcon;
        } else if (Setting.Mode == 'progress') {
            Setting.Title = '<i class="fa fa-align-left"></i>&nbsp;執行進度';
        } else if (Setting.Mode == 'loading') {
            Setting.Title = '<i class="fa fa-pie-chart"></i>&nbsp;當前狀態';
        }
    } else {
        if (tempCloseIcon != '') {
            Setting.Title = Setting.Title + tempCloseIcon;
        }
    }
    // Setting.Setting 依照模式賦予設定值
    if (Setting.Mode == 'prompt') {
        Setting.Setting.Mode = Setting.Setting.Mode ? Setting.Setting.Mode : 'text';
        Setting.Setting.Value = Setting.Setting.Value ? Setting.Setting.Value : '';
        Setting.Setting.Placeholder = Setting.Setting.Placeholder ? Setting.Setting.Placeholder : '輸入...';
        Setting.Setting.Rows = Setting.Setting.Rows ? Setting.Setting.Rows : 3;
        Setting.Setting.Select = Setting.Setting.Select ? Setting.Setting.Select : 'text';
        Setting.Setting.Required = Setting.Setting.Required === undefined ? true : Setting.Setting.Required;
    } else if (Setting.Mode == 'progress' || Setting.Mode == 'loading') {
        Setting.Setting.Delay = Setting.Setting.Delay ? Setting.Setting.Delay : 500;
    }
    //判斷 Setting.Html 是否為 object 物件 如果是就進行轉換
    if (typeof (Setting.Html) == 'object') {
        //套用變數
        Setting.ID = '#' + $(Setting.Html).attr('id');
        Setting.Html = $(Setting.Html).html();
        //移除前端 dom 物件內的資料
        $(Setting.ID).empty();
    }
    //放置於儲存物件變數內
    AlertBoxTempData[Setting.Code] = Setting;


    //執行 OnStart 顯示前 執行函數
    if (typeof (Setting.OnStart) == 'function') {
        Setting.OnStart(Setting.Code);
    }


    //啟用滾動禁用
    alertBoxDisabledStart();


    //填入遮罩
    $('body').append('<div class="AlertBoxDiv" dom-code="' + Setting.Code + '"></div>');
    //宣告容器變數
    var tempBox = $(".AlertBoxDiv[dom-code='" + Setting.Code + "']");
    //放入容器
    tempBox.append('<table>' +
                      '<tr>' +
                          '<td>' +
                              '<div class="AlertBoxDivContent ' + Setting.OutsideClass + '" style="' + Setting.OutsideStyle + '"></div>' +
                          '</td>' +
                      '</tr>' +
                   '</table>');
    //如果有 Setting.Title 就放入標題列
    if (Setting.Title != '' && Setting.Title != null) {
        tempBox.find('.AlertBoxDivContent').append('<div class="AlertBoxDivTitle ' + Setting.TitleClass + '" style="' + Setting.TitleStyle + '">' + Setting.Title + '</div>');
    }
    //放入內容區塊
    tempBox.find('.AlertBoxDivContent').append('<div class="AlertBoxDivHtml ' + Setting.InsideClass + '" style="' + Setting.InsideStyle + '">' + Setting.Html + '</div>');
    //如果有 Setting.Ctrl 就放入控制列
    if (Setting.Ctrl != '' && Setting.Ctrl != null) {
        tempBox.find('.AlertBoxDivContent').append('<div class="AlertBoxDivCtrl ' + Setting.CtrlClass + '" style="' + Setting.CtrlStyle + '">' + Setting.Ctrl + '</div>');
    }


    //判斷若為 prompt 模式時 需要加入輸入視窗
    if (Setting.Mode == 'prompt') {
        //依照擴充設定帶入元件
        if (Setting.Setting.Mode == 'text' || Setting.Setting.Mode == 'password') {
            tempBox.find('.AlertBoxDivHtml').append('<div style="margin-top: 5px">' +
                                                        '<input type="' + Setting.Setting.Mode + '" class="AlertBoxDivPromptDOM" placeholder="' + Setting.Setting.Placeholder + '" value="' + Setting.Setting.Value + '" />' +
                                                        '<div class="inputLine"></div>' +
                                                    '</div>');
            //綁定鍵盤判斷
            $('.AlertBoxDivPromptDOM').keyup(function (event) {
                if (event.which == 13) {
                    alertClose('ok');
                }
            });
        } else if (Setting.Setting.Mode == 'textarea') {
            tempBox.find('.AlertBoxDivHtml').append('<div style="font-size: 0; margin-top: 5px">' +
                                                        '<textarea rows="' + Setting.Setting.Rows + '" class="AlertBoxDivPromptDOM" placeholder="' + Setting.Setting.Placeholder + '">' + Setting.Setting.Value + '</textarea>' +
                                                    '</div>');
        }
    }
    //判斷若為 progress 模式時 需要加入進度條
    if (Setting.Mode == 'progress') {
        //重新套用 內容區塊 內的資料結構
        tempBox.find('.AlertBoxDivHtml').empty();
        tempBox.find('.AlertBoxDivHtml').html('<div class="AlertBoxDivHtmlText">' + Setting.Html + '</div>');
        //插入進度條
        tempBox.find('.AlertBoxDivHtml').append('<div class="ProgressBar">' +
                                                    '<div class="ProgressBar2" style="width: 0%"></div>' +
                                                    '<div class="ProgressBarWord">' +
                                                        '0%' +
                                                    '</div>' +
                                                '</div>');
    }
    //判斷若為 loading 模式時 需要將欄位置中且最小高度重置
    if (Setting.Mode == 'loading') {
        tempBox.find('.AlertBoxDivHtml').css('text-align', 'center');
        tempBox.find('.AlertBoxDivHtml').css('min-height', 'initial');
    }


    //畫面失焦防止連點
    $(document.activeElement).blur();
    //預設指定聚焦
    if (Setting.Mode == 'prompt') {
        tempBox.find('.AlertBoxDivPromptDOM:first').focus();
        //判斷是否需要預設框選
        if (Setting.Setting.Select == true) {
            tempBox.find('.AlertBoxDivPromptDOM:first').select();
        }
    } else {
        tempBox.find('.AlertBoxDivCtrl button:last').focus();
    }


    //顯示視窗
    tempBox.animate({ opacity: 1 }, AlertBoxSetting.CoverSpeed, AlertBoxSetting.CoverTransition);
    tempBox.find('.AlertBoxDivContent').animate({ 'margin-top': '0px', 'margin-bottom': '0px' }, AlertBoxSetting.StartSpeed, AlertBoxSetting.StartTransition);


    //執行 OnRun 顯示時 執行函數
    if (typeof (Setting.OnRun) == 'function') {
        Setting.OnRun(Setting.Code);
    }
    //執行 OnReady 顯示後 執行函數 (依照動畫時間延遲執行)
    if (typeof (Setting.OnReady) == 'function') {
        $('body').delay(AlertBoxSetting.StartSpeed).show(1, function () {
            Setting.OnReady(Setting.Code);
        });
    }


    //綁定觸控、點擊操作事件
    if (Setting.TouchClose == true) {
        if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
            //手機、平板用觸控
            tempBox.on('touchstart', '.AlertBoxDivContent', function (event) {
                //關閉觸發click
                event.stopPropagation();
            });
            tempBox.on('touchstart', function (event) {
                //執行關閉
                alertClose('cancel', Setting.Code, 'click');
            });
        } else {
            //電腦用點擊
            tempBox.on('click', '.AlertBoxDivContent', function (event) {
                //關閉觸發click
                event.stopPropagation();
            });
            tempBox.on('click', function (event) {
                //執行關閉
                alertClose('cancel', Setting.Code, 'click');
            });
        }
    }

    //console.dir(Setting)
};
//關閉視窗
alertClose = function (Type, Code, Operating) {

    //如果沒有 Code 碼就尋找最後一個容器的 Code 碼
    Code = Code ? Code : $(".AlertBoxDiv:last").attr('dom-code');
    //宣告容器變數
    var tempBox = $(".AlertBoxDiv[dom-code='" + Code + "']");
    //判斷變數是否還存在
    if (!AlertBoxTempData[Code]) {
        return;
    }


    //判斷是否需要無效化 (progress、loading模式使用)
    if ((AlertBoxTempData[Code].Mode == 'progress' || AlertBoxTempData[Code].Mode == 'loading') &&
        (Operating == 'esc' || Operating == 'click')) {
        return;
    }


    //判斷若為 prompt 模式時 取得輸入的值
    var tempValue = '';
    if (AlertBoxTempData[Code].Mode == 'prompt') {
        tempValue = $(".AlertBoxDiv[dom-code='" + Code + "']").find('.AlertBoxDivPromptDOM').val();
        //判斷是否必填
        if (AlertBoxTempData[Code].Setting.Required == true && tempValue == '' && Type == 'ok') {
            alertBox({
                Html: '<span style="color:#f00">請勿輸入空白！</span>',
                OnEnd: function () {
                    tempBox.find('.AlertBoxDivPromptDOM:first').focus();
                },
            });
            return;
        }
    }


    //依照不同模式執行函數
    if (AlertBoxTempData[Code].Mode == 'alert' || AlertBoxTempData[Code].Mode == 'progress' || AlertBoxTempData[Code].Mode == 'loading') {
        // alert 及 progress 及 loading
        if (typeof (AlertBoxTempData[Code].OnClose) == 'function' && Type) {
            var tempOnClose = AlertBoxTempData[Code].OnClose(Type, tempValue);
            if (tempOnClose == false) {
                return;
            }
        }
    } else if (AlertBoxTempData[Code].Mode == 'confirm' || AlertBoxTempData[Code].Mode == 'prompt') {
        // confirm 及 prompt
        if (typeof (AlertBoxTempData[Code].OnClose) == 'function' && (Type == 'ok' || Type == 'cancel')) {
            var tempOnClose = AlertBoxTempData[Code].OnClose(Type, tempValue);
            if (tempOnClose == false) {
                return;
            }
        }
    }


    //關閉視窗
    tempBox.animate({ opacity: 0 }, AlertBoxSetting.CoverSpeed, AlertBoxSetting.CoverTransition);
    tempBox.find('.AlertBoxDivContent').animate({ 'margin-top': '20px', 'margin-bottom': '-20px' }, AlertBoxSetting.EndSpeed, AlertBoxSetting.EndTransition, function () {

        //依照不同模式執行函數
        if (AlertBoxTempData[Code].Mode == 'alert') {
            // alert
            if (typeof (AlertBoxTempData[Code].OnOK) == 'function' && Type) {
                AlertBoxTempData[Code].OnOK(tempValue);
            }
            if (typeof (AlertBoxTempData[Code].OnCancel) == 'function' && Type) {
                AlertBoxTempData[Code].OnCancel();
            }
            if (typeof (AlertBoxTempData[Code].OnEnd) == 'function' && Type) {
                AlertBoxTempData[Code].OnEnd();
            }
        } else if (AlertBoxTempData[Code].Mode == 'confirm' || AlertBoxTempData[Code].Mode == 'prompt') {
            // confirm 及 prompt
            if (typeof (AlertBoxTempData[Code].OnOK) == 'function' && Type == 'ok') {
                AlertBoxTempData[Code].OnOK(tempValue);
            }
            if (typeof (AlertBoxTempData[Code].OnCancel) == 'function' && Type == 'cancel') {
                AlertBoxTempData[Code].OnCancel();
            }
            if (typeof (AlertBoxTempData[Code].OnEnd) == 'function' && (Type == 'ok' || Type == 'cancel')) {
                AlertBoxTempData[Code].OnEnd();
            }
        } else if (AlertBoxTempData[Code].Mode == 'progress' || AlertBoxTempData[Code].Mode == 'loading') {
            // progress 及 loading
            if (typeof (AlertBoxTempData[Code].OnOK) == 'function' && Type) {
                AlertBoxTempData[Code].OnOK(tempValue);
            }
            if (typeof (AlertBoxTempData[Code].OnCancel) == 'function' && Type) {
                AlertBoxTempData[Code].OnCancel();
            }
            if (typeof (AlertBoxTempData[Code].OnEnd) == 'function' && Type) {
                AlertBoxTempData[Code].OnEnd();
            }
        }


        //判斷是物件還是字串模式
        if (AlertBoxTempData[Code].ID != null) {
            //將資料放回前端dom物件上
            $(AlertBoxTempData[Code].ID).append(AlertBoxTempData[Code].Html);
        }


        //關閉滾動禁用
        alertBoxDisabledEnd();


        //移除視窗物件
        tempBox.remove();


        //移除變數
        delete AlertBoxTempData[Code];

    });

};
//改變進度條資訊 (progress模式專用)
alertProgress = function (Percent, Html, AutoClose) {

    //轉為數字
    Percent = parseInt(Percent);


    //尋找最後一個容器的 Code 碼
    Code = $(".AlertBoxDiv:last").attr('dom-code');
    //宣告容器變數
    var tempBox = $(".AlertBoxDiv[dom-code='" + Code + "']");
    //判斷變數是否還存在
    if (!AlertBoxTempData[Code]) {
        return;
    }


    //改變Html內容
    if (Html) {
        tempBox.find('.AlertBoxDivHtml .AlertBoxDivHtmlText').html(Html);
    }


    //賦予預設開啟使用自動關閉
    if (AutoClose == undefined) {
        AutoClose = true;
    }


    //判斷百分比是否大於100
    if (Percent >= 100 && AutoClose == true) {
        //改變進度為100
        tempBox.find('.AlertBoxDivHtml .ProgressBar2').css('width', '100%');
        tempBox.find('.AlertBoxDivHtml .ProgressBarWord').html('100%');

        //延遲後關閉視窗
        $('body').delay(AlertBoxTempData[Code].Setting.Delay).show(1, function () {
            alertClose('over', Code);
        });

    } else {
        //改變進度
        tempBox.find('.AlertBoxDivHtml .ProgressBar2').css('width', Percent + '%');
        tempBox.find('.AlertBoxDivHtml .ProgressBarWord').html(Percent + '%');
    }

};
//改變內容資訊 (loading模式專用)
alertLoadingMsg = function (Html, Code) {

    //如果沒有 Code 碼就尋找最後一個容器的 Code 碼
    Code = Code ? Code : $(".AlertBoxDiv:last").attr('dom-code');
    //宣告容器變數
    var tempBox = $(".AlertBoxDiv[dom-code='" + Code + "']");
    //判斷變數是否還存在
    if (!AlertBoxTempData[Code]) {
        return;
    }


    //改變內容
    tempBox.find('.AlertBoxDivHtml').html(Html);

};
//關閉loading視窗 (loading模式專用)
alertLoadingEnd = function (Html, Speed, CallBack, Code) {

    //如果沒有 Code 碼就尋找最後一個容器的 Code 碼
    Code = Code ? Code : $(".AlertBoxDiv:last").attr('dom-code');
    //宣告容器變數
    var tempBox = $(".AlertBoxDiv[dom-code='" + Code + "']");
    //判斷變數是否還存在
    if (!AlertBoxTempData[Code]) {
        return;
    }


    //改變內容
    if (Html != '' && Html != null && Html != undefined) {
        tempBox.find('.AlertBoxDivHtml').html(Html);
    }


    //套用延遲時間
    var tempSpeed = Speed ? Speed : AlertBoxTempData[Code].Setting.Delay;
    //套用 callback 函數
    if (typeof (CallBack) == 'function') {
        AlertBoxTempData[Code].OnEnd = CallBack;
    }


    //延遲後關閉視窗
    $('body').delay(tempSpeed).show(1, function () {
        alertClose('over', Code);
    });

};


//滾動禁用開始
alertBoxDisabledStart = function () {

    if (AlertBoxSetting.ScrollType == 'overflow') {

        //遮罩 body 內容方式
        $('body').css('overflow', 'hidden');

    } else if (AlertBoxSetting.ScrollType == 'mousewheel') {

        //禁用滾動方式 (行動裝置不執行)
        //if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
        //相加 html 與 body ，因應瀏覽器定義 scrollTop 的差異
        AlertBoxBodyScrollValue = $('html').scrollTop() + $('body').scrollTop();
        AlertBoxMouseWheelCheck = false;
        //}

    }

    //判斷是否使用失焦遮罩 開啟
    if (AlertBoxSetting.FilterBlur == true) {
        $(AlertBoxSetting.FilterTarget).css('filter', 'blur(' + AlertBoxSetting.FilterBlurValue + 'px)');
    }

};
//滾動禁用結束
alertBoxDisabledEnd = function () {

    //場上所有視窗剩下最後一個時才開放
    var TempNumber = 0;
    $('.AlertBoxDiv').each(function (index, element) {
        TempNumber++;
    });
    if (TempNumber <= 1) {

        if (AlertBoxSetting.ScrollType == 'overflow') {

            //恢復 body 內容
            $('body').css('overflow', 'visible');

        } else if (AlertBoxSetting.ScrollType == 'mousewheel') {

            //開啟滾動使用 (行動裝置不執行)
            //if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
            AlertBoxMouseWheelCheck = true;
            //}

        }

        //判斷是否使用失焦遮罩 關閉
        if (AlertBoxSetting.FilterBlur == true) {
            $(AlertBoxSetting.FilterTarget).css('filter', 'initial');
        }

    }

};
//禁用滾動方式 專用監控
$(window).scroll(function () {
    if (AlertBoxMouseWheelCheck == false) {
        $('html,body').scrollTop(AlertBoxBodyScrollValue);
    }
});
//判斷使否使用 ESC 關閉
if (AlertBoxSetting.EscClose = true) {
    $(document).on('keyup', 'body', function (event) {
        //判斷在視窗開啟的情況下才可以關閉
        if (event.keyCode == 27) {
            if ($('.AlertBoxDiv').length > 0) {
                alertClose('cancel', null, 'esc');
            }
        }
    });
};
////點擊空白處關閉視窗判斷
//$(document).on('click', '.AlertBoxDivContent', function (event) {
//    if (AlertBoxSetting.TouchClose == true) {
//        //關閉觸發click
//        event.stopPropagation();
//    }
//});
//$(document).on('click', '.AlertBoxDiv', function (event) {
//    if (AlertBoxSetting.TouchClose == true) {
//        //執行關閉
//        alertClose('cancel', null, 'click');
//    }
//});
//$(document).on('touchstart', '.AlertBoxDivContent', function (event) {
//    if (AlertBoxSetting.TouchClose == true) {
//        //關閉觸發click
//        event.stopPropagation();
//    }
//});
//$(document).on('touchstart', '.AlertBoxDiv', function (event) {
//    if (AlertBoxSetting.TouchClose == true) {
//        //執行關閉
//        alertClose('cancel', null, 'click');
//    }
//});


//以下為相容舊版本函數
if (AlertBoxSetting.Compatible == true) {

    //alert
    alert_S = function (Html, OnEnd, Setting) {

        Setting = Setting ? Setting : { style: '' };

        alertBox({
            Mode: 'alert',
            Html: Html ? Html : '',
            //Title: '',
            OutsideStyle: Setting.style ? Setting.style : '',
            OnEnd: OnEnd ? OnEnd : null,
        });

    };

    //confirm
    confirm_S = function (Html, OnOK, OnCancel, Setting) {

        Setting = Setting ? Setting : {
            style: '',
            onStart: function () { },
            onBeforeEnd: function () { return true; }
        };

        alertBox({
            Mode: 'confirm',
            Html: Html ? Html : '',
            //Title: '',
            OutsideStyle: Setting.style ? Setting.style : '',
            OnReady: Setting.onStart ? Setting.onStart : null,
            OnOK: OnOK ? OnOK : null,
            OnCancel: OnCancel ? OnCancel : null,
            OnClose: Setting.onBeforeEnd ? Setting.onBeforeEnd : null,
        });

    };

    //prompt (單一輸入)
    prompt_S = function (Html, OnOK, Setting, OnCancel) {

        Setting = Setting ? Setting : {
            style: '',
            value: '',
            placeholder: '輸入...',
            textarea: false,
            filter: '',
            select: false,
            required: true,
        };

        alertBox({
            Mode: 'prompt',
            Html: Html ? Html : '',
            //Title: '',
            OutsideStyle: Setting.style ? Setting.style : '',
            OnOK: OnOK ? OnOK : null,
            OnCancel: OnCancel ? OnCancel : null,
            Setting: {
                Mode: Setting.textarea == true ? 'textarea' : 'text',
                Value: Setting.value ? Setting.value : '',
                Placeholder: Setting.placeholder ? Setting.placeholder : '輸入...',
                Select: Setting.select ? Setting.select : false,
                Required: Setting.required === undefined ? true : Setting.required,
            },
            OnReady: function (Code) {
                var tempFilter = Setting.filter ? Setting.filter : null;
                if (tempFilter != null) {
                    $(".AlertBoxDiv[dom-code='" + Code + "']").find('.AlertBoxDivPromptDOM').attr('onkeyup', tempFilter);
                }
            },
        });

    };

    //prompt (多筆輸入) --- 先跳過

    //loading
    loading_S = function (Html, OnReady, Setting) {

        Setting = Setting ? Setting : { style: '' };

        alertBox({
            Mode: 'loading',
            Html: Html ? Html : '',
            Title: '',
            Ctrl: '',
            OutsideStyle: Setting.style ? Setting.style : '',
            OnReady: OnReady ? OnReady : null,
        });

    };
    loading_S_msg = function (Html) {
        $(".AlertBoxDiv:last").find('.AlertBoxDivHtml').html(Html);
    };
    loading_S_end = function (Html, Speed, OnEnd) {
        alertLoadingEnd(Html, Speed, OnEnd);
    };

    //wait --- 先跳過

    //float
    float_S = function (Html, Setting, OnRun, OnEnd) {

        Setting = Setting ? Setting : {
            style: '',
            boxstyle: '',
            titlestyle: '',
            ctrlstyle: '',
            touchclose: false,
            titlehtml: '',
            ctrlhtml: '',
        };

        alertBox({
            Mode: 'alert',
            Html: Html ? Html : '',
            Title: Setting.titlehtml ? Setting.titlehtml : '',
            Ctrl: Setting.ctrlhtml ? Setting.ctrlhtml : '<button onclick="float_S_end(\'OnClose\')" type="button" class="button btn_white"><i class="fa fa-times"></i>&nbsp;' + AlertBoxSetting.CancelText + '</button>',
            OutsideStyle: Setting.style ? Setting.style : '',
            TitleStyle: Setting.titlestyle ? Setting.titlestyle : '',
            InsideStyle: Setting.boxstyle ? Setting.boxstyle : '',
            CtrlStyle: Setting.ctrlstyle ? Setting.ctrlstyle : '',
            TouchClose: Setting.touchclose === undefined ? false : Setting.touchclose,
            OnRun: OnRun ? OnRun : null,
            OnEnd: OnEnd ? OnEnd : null,
        });

    };
    float_S_end = function (Type) {
        if (Type == 'OnClose') {
            alertClose('over');
        } else {
            alertClose();
        }
    };

};
