/*
  Ver 2.23.23

  物件建立：<div id="物件ID"></div>  ※請修改[物件ID]部分

  函數調用需再 jQuery 1.9.1 ~ 3.3.1 環境使用

  以下為可調用函數
  定義下拉選單            >  DropListSetting({選填項目})  或  $('#物件ID').DropSetting({選填項目})
  指定下拉選單選取        >  DropListSet(物件ID , [指定選取的Val陣列])  或  $('#物件ID').DropSet([指定選取的Val陣列])
  取得下拉選單選取數值    >  var value = DropListGet(物件ID)  或  $('#物件ID').DropGet()
                             ※單選模式回傳 object (裡面包含 Group、Text、Val 三個參數)，複選模式回傳 array，無選取時回傳 null
  設定下拉選單啟用/關閉   >  DropListEnabled(物件ID, true或false)  或  $('#物件ID').DropEnabled(true或false)
  修改{選填項目}參數      >  DropListSettingChange(物件ID , {選填項目})  或  $('#物件ID').DropSettingChange({選填項目})
  資料製作輔助函數        >  var data = DropListDataHelp(來源資料陣列, 群組欄位名稱(可陣列設定), 選項欄位名稱(可陣列設定), 選項數值欄位名稱(可陣列設定), 選項文字提示(可陣列設定))
                             ※範例：var data = DropListDataHelp(array, 'title', ['id','name'], 'val')

  查詢儲存陣列        >  DropListTempData[物件ID]
  取選取的值          >  DropListTempData[物件ID].Select
  取選取的文字        >  DropListTempData[物件ID].SelectText         ※相對應Select的排序

  資料陣列：[{ Optgroup: '群組名稱可空白', Option: [{ Text: '選項一', Val: 1, Title: '選項一' }, { Text: '選項二', Val: 'two', Title: '選項二' }] }]
  Val 的資料可 置入 img span 等相容 label 物件之 html 語法
  Title 為選填項目，可自行決定滑鼠懸停時的文字提示內容

  定義下拉選單 選填項目：*物件ID                    ID (必填項目無預設)                ※若ID相同則會被覆蓋
                         *資料陣列                  Data (必填項目無預設)
                         選項模式                   Type (預設：'single' 單選)         ※多選為 'multiple'
                         選單型態                   Mode (預設：'drop' 下拉模式)       ※清單模式為 'list' (較舊的瀏覽器 (LINE、IE) 需要特別注意外觀是否會跑掉)
                         使用搜尋列                 Search (預設：true)
                         開啟優先查詢模式           SearchPriority (預設：false)       ※必須啟用[搜尋列]才會作用，設定後使用者需要先查詢才會建立選項 (建議資料超過 500 筆以上時使用，取得最佳效能)
                         優先查詢模式顯示最大筆數   SearchPriorityCount (預設：100)    ※必須啟用[開啟優先查詢模式]才會作用，設定每次查詢最大顯示筆數，預設為前 100 筆，建議不超過 300 以維持最佳效能
                         顯示選取圖示               InputBox (預設：true)
                         使用全選/全消              AllSelect (預設：false)            ※只有[複選模式]會生效
                         開啟群組清單               GroupList (預設：false)
                         開啟直接顯示群組清單       GroupListStart (預設：false)       ※只有開啟[群組清單]功能開啟才會生效
                         複選選取N個以下時顯示文字  MultipleSelect (預設：數字最大值)  ※只有[複選模式]會生效，若為 0 則僅顯示數字
                         選項清單與按鈕的間距       ListSpace (預設：2)
                         預設選取                   Select (預設：[])
                         設定按鈕Class              Class (預設：'button btn_blue')
                         設定按鈕Style              Style (預設：'')                   ※使用css語法，打成字串
                         設定選單Style              ListStyle (預設：'')               ※使用css語法，打成字串
                         設定選項視窗Style          ItemStyle (預設：'')               ※使用css語法，打成字串
                         設定按鈕預設文字           ButtonText (預設：'尚未選擇')
                         設定下拉選單不啟用         Disabled (預設：false)
                         設定不啟用時按鈕外觀樣式   DisabledButtonStyle (預設：'color:#505050;background-color:#ccc;')
                         開啟箭頭切換功能           ArrowChange (預設：false)          ※僅 Type 為單選模式(single)，且 Mode 為下拉模式(drop) 才有效
                         箭頭切換功能的按鈕Class    ArrowClass (預設：'button btn_blue')
                         箭頭切換功能的按鈕Style    ArrowStyle (預設：'')
                         超出視窗位移下拉選單       MoveList (預設：true)              ※選單型態為 'drop' 下拉模式且使用者於電腦裝置時會使用，行動裝置為全螢幕選單不需要
                         使用手動控制選單位移量     MoveListCtrl (預設：null，設定時請使用 { Top: 0, Left: 0 } )      ※只有開啟[超出視窗位移下拉選單]功能開啟才會生效
                         點選按鈕時事件             OnStart (預設：null，設定時請使用 function (Name) { } )
                         點擊選項時事件             OnChange (預設：null，設定時請使用 function (Select, Name) { } )  ※但執行[指定下拉選單選取]函數時不會觸發(避免無線迴圈)
                         關閉選項時事件             OnEnd (預設：null，設定時請使用 function (Select, Name) { } )
                         選項按鈕樣式               ItemButtonMode (預設：'normal' 標準按鈕)  ※磚塊按鈕為 'brick'

  ※範例：
  DropListSetting({
      ID: '',
      Data: [],
      Search: true,
      Select: [],
      Class: '',
      Style: '',
      ListStyle: '',
      ButtonText: '',
      Disabled: false,
      OnEnd: function (Select, Name) { },
  });
*/

//宣告專用變數儲存物件
var DropListTempData = {};
var DropListTempOnEndName = null;



//定義下拉選單
DropListSetting = function (Setting) {

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
        //數值判斷 資料陣列 (必填)
        if (Setting.Data == undefined) {
            console.info('缺乏資料陣列[Data]參數設定！');
            Success = false;
        }
        //物件名稱 (舊的用不到了 直接同步ID)
        Setting.Name = Setting.ID;
        //選項模式
        if (Setting.Type == undefined) {
            Setting.Type = 'single';
        }
        //選單型態
        if (Setting.Mode == undefined) {
            Setting.Mode = 'drop';
        }
        //使用搜尋列
        if (Setting.Search == undefined) {
            Setting.Search = true;
        }
        //開啟優先查詢模式
        if (Setting.SearchPriority == undefined) {
            Setting.SearchPriority = false;
        }
        //優先查詢模式顯示最大筆數
        if (Setting.SearchPriorityCount == undefined) {
            Setting.SearchPriorityCount = 100;
        }
        //顯示選取圖示
        if (Setting.InputBox == undefined) {
            Setting.InputBox = true;
        }
        //使用全選/全消
        if (Setting.AllSelect == undefined) {
            Setting.AllSelect = false;
        }
        //開啟群組清單
        if (Setting.GroupList == undefined) {
            Setting.GroupList = false;
        }
        //開啟直接顯示群組清單
        if (Setting.GroupListStart == undefined) {
            Setting.GroupListStart = false;
        }
        //複選選取N個以下時顯示文字
        if (Setting.MultipleSelect == undefined) {
            Setting.MultipleSelect = 2147483647;
        }
        //選項清單與按鈕的間距
        if (Setting.ListSpace == undefined) {
            Setting.ListSpace = 2;
        }
        //預設選取
        if (Setting.Select == undefined) {
            Setting.Select = [];
        }
        //設定按鈕Class
        if (Setting.Class == undefined) {
            Setting.Class = 'button btn_blue';
        }
        //設定按鈕Style
        if (Setting.Style == undefined) {
            Setting.Style = '';
        }
        //設定選單Style
        if (Setting.ListStyle == undefined) {
            Setting.ListStyle = '';
        }
        //設定選項視窗Style
        if (Setting.ItemStyle == undefined) {
            Setting.ItemStyle = '';
        }
        //設定按鈕預設文字
        if (Setting.ButtonText == undefined) {
            Setting.ButtonText = '尚未選擇';
        }
        //設定下拉選單不啟用
        if (Setting.Disabled == undefined) {
            Setting.Disabled = false;
            if (Setting.Enabled == undefined) {
                Setting.Enabled = true;
            }
        } else {
            //套用 Enabled 參數 (舊的參數 被 Disabled 替代)
            if (Setting.Disabled == false) {
                Setting.Enabled = true;
            } else if (Setting.Disabled == true) {
                Setting.Enabled = false;
            }
        }
        //設定不啟用時外觀樣式
        if (Setting.DisabledButtonStyle == undefined) {
            Setting.DisabledButtonStyle = 'color:#505050;background-color:#ccc';
        }
        //開啟箭頭切換功能
        if (Setting.ArrowChange == undefined) {
            Setting.ArrowChange = false;
        }
        //箭頭切換功能的按鈕Class
        if (Setting.ArrowClass == undefined) {
            Setting.ArrowClass = 'button btn_blue';
        }
        //箭頭切換功能的按鈕Style
        if (Setting.ArrowStyle == undefined) {
            Setting.ArrowStyle = '';
        }
        //超出視窗位移下拉選單
        if (Setting.MoveList == undefined) {
            Setting.MoveList = true;
        }
        //使用手動控制選單位移量
        if (Setting.MoveListCtrl == undefined) {
            Setting.MoveListCtrl = null;
        }
        //點選按鈕時事件
        if (Setting.OnStart == undefined) {
            Setting.OnStart = null;
        }
        //點擊選項時事件
        if (Setting.OnChange == undefined) {
            Setting.OnChange = null;
        }
        //關閉選項時事件
        if (Setting.OnEnd == undefined) {
            Setting.OnEnd = null;
        }
        //選項按鈕樣式
        if (Setting.ItemButtonMode == undefined) {
            Setting.ItemButtonMode = 'normal';
        }
    }

    //驗證確認 若失敗則不填入資料
    if (Success == false) {
        return;
    }

    //若有 指定建立選單物件ID 則建立呼叫按鈕
    if (Setting.ID != null) {

        //主動帶入 class (先移除再增加)
        $('#' + Setting.ID).removeClass('DropList');
        $('#' + Setting.ID).addClass('DropList');

        //判斷是否有預設選取 若有則帶入文字
        var TempButtonText = Setting.ButtonText;
        //複選選取N個以下時顯示文字時使用的陣列
        var TempMultipleSelect = [];
        if (Setting.Select.length != 0) {
            //尋找相符合之資料列
            for (var i = 0; i < Setting.Select.length; i++) {
                //單選模式
                if (Setting.Type == 'single') {
                    for (var g = 0; g < Setting.Data.length; g++) {
                        for (var p = 0; p < Setting.Data[g].Option.length; p++) {
                            if (Setting.Data[g].Option[p].Val == Setting.Select[i]) {
                                TempButtonText = Setting.Data[g].Option[p].Text;
                            }
                        }
                    }
                }

                //複選模式
                if (Setting.Type == 'multiple') {
                    if (Setting.Select.length == 1) {
                        for (var g = 0; g < Setting.Data.length; g++) {
                            for (var p = 0; p < Setting.Data[g].Option.length; p++) {
                                if (Setting.Data[g].Option[p].Val == Setting.Select[i]) {
                                    TempButtonText = Setting.Data[g].Option[p].Text;
                                }
                            }
                        }

                    } else {
                        if (Setting.Select.length > Setting.MultipleSelect) {
                            TempButtonText = '選取了 ' + Setting.Select.length + ' 個';
                        } else {
                            for (var g = 0; g < Setting.Data.length; g++) {
                                for (var p = 0; p < Setting.Data[g].Option.length; p++) {
                                    if (Setting.Data[g].Option[p].Val == Setting.Select[i]) {
                                        TempMultipleSelect.push(Setting.Data[g].Option[p].Text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //複選選取N個以下時顯示文字時使用
        if (Setting.Type == 'multiple') {
            if (Setting.Select.length > Setting.MultipleSelect) {
            } else {
                //這裡要陣列大於1才可以執行 不然會變空白
                if (Setting.Select.length > 1) {
                    TempButtonText = TempMultipleSelect.join('、');
                }
            }
        }

        //先清空
        $('#' + Setting.ID).empty();

        //建立左箭頭按鈕
        var tempArrowChange = '';
        if (Setting.ArrowChange == true && Setting.Type == 'single' && Setting.Mode == 'drop') {
            $('#' + Setting.ID).append('<button onclick="DropListArrowChange(\'' + Setting.Name + '\',\'left\')" mod-arrow="left" type="button" class="' + Setting.ArrowClass + '" style="' + Setting.ArrowStyle + '"><i class="fa fa-chevron-left"></i></button>');

            //強制下拉選單按鈕圓角歸零
            tempArrowChange = ';border-radius:0';
        }

        //建立呼叫按鈕 (若開啟 ArrowChange 模式則強制圓角歸零)
        $('#' + Setting.ID).append('<button type="button" class="' + Setting.Class + '" onclick="DropListCell($(this),\'' + Setting.Name + '\')" style="' + Setting.Style + tempArrowChange + '">' +
                                   '<span class="DropList_span">' + TempButtonText + '</span>&nbsp;<i class="fa fa-caret-down DropList_i"></i></button>');

        //建立右箭頭按鈕
        if (Setting.ArrowChange == true && Setting.Type == 'single' && Setting.Mode == 'drop') {
            $('#' + Setting.ID).append('<button onclick="DropListArrowChange(\'' + Setting.Name + '\',\'right\')" mod-arrow="right" type="button" class="' + Setting.ArrowClass + '" style="' + Setting.ArrowStyle + '"><i class="fa fa-chevron-right"></i></button>');
        }


        //判斷是否禁用
        if (Setting.Enabled == false) {

            //添加 css
            $('#' + Setting.ID).find('button').addClass('DropListDisabled');

            //拆解 DisabledButtonStyle 參數
            var tempStyle = Setting.DisabledButtonStyle.split(';');
            for (var s = 0; s < tempStyle.length; s++) {
                if (tempStyle[s] != '') {
                    var tempCss = tempStyle[s].split(':');
                    var tempCssCode = tempCss[0];
                    var tempCssValue = tempCss[1];
                    if (tempCssCode && tempCssValue) {
                        $('#' + Setting.ID).find('button').css(tempCssCode, tempCssValue);
                    }
                }
            }
        }

        //若選單型態 設定為list 則隱藏按鈕
        if (Setting.Mode == 'list') {
            $('#' + Setting.ID).find('button').hide();
        }

    }

    //設置選取的值 文字陣列
    Setting.SelectText = [];

    //取得資料總數 判斷是否需要讀取圖示 比對SelectText需要的文字 將巢狀陣列轉換成單層陣列(只儲存值)
    Setting.DataCount = 0;
    Setting.DataArray = [];
    for (var i = 0; i < Setting.Data.length; i++) {
        for (var j = 0; j < Setting.Data[i].Option.length; j++) {

            Setting.DataCount++;
            Setting.DataArray.push(Setting.Data[i].Option[j].Val);

            //順便比對SelectText需要的文字
            for (var s = 0; s < Setting.Select.length; s++) {
                if (Setting.Select[s] == Setting.Data[i].Option[j].Val) {
                    Setting.SelectText.push(Setting.Data[i].Option[j].Text);
                }
            }
        }
    }

    //選項按鈕樣式判斷
    if (Setting.ItemButtonMode == 'normal') {
        Setting.ItemButtonMode_OptionClass = 'DropListOption';
    } else if (Setting.ItemButtonMode == 'brick') {
        Setting.ItemButtonMode_OptionClass = 'DropListOption DropListOption_Brick';
    }

    //填入資料
    DropListTempData[Setting.Name] = Setting;

    //若選單型態 設定為list 則呼叫選單
    if (Setting.Mode == 'list') {
        DropListCell($('#' + Setting.ID).find('button'), Setting.Name);
    }

    //額外新增判斷 如果SelectText找不到任何資料 表示Select內的資料都沒意義 就顯示ButtonText文字 並清空Select
    if (Setting.SelectText.length == 0) {
        Setting.Select = [];
        $('#' + Setting.ID).find('.DropList_span').html(Setting.ButtonText);
    }

};
//呼叫下拉選單
DropListCell = function (Event, Name) {

    //先判斷是啟用還是關閉 (關閉就直接不執行 但是要跳過 list 模式)
    if (DropListTempData[Name].Enabled == false && DropListTempData[Name].Mode != 'list') {
        return;
    }

    //簡寫物件
    var DropListEvent = $(Event).parent();

    //如果清單已經是開啟狀態 就不做動作
    if (DropListEvent.find('.DropListSelect').css('display') == 'block') {
        return;
    }

    //判斷是否有 OnEnd 函數可執行 (上一個的)
    if (DropListTempOnEndName != null) {

        //清單模式不執行
        if (DropListTempData[DropListTempOnEndName].Mode != 'list') {
            DropListTempData[DropListTempOnEndName].OnEnd(DropListTempData[DropListTempOnEndName].Select, DropListTempOnEndName);
        }

        DropListTempOnEndName = null;
    }

    //預設是沒有 OnEnd 函數要執行
    DropListTempOnEndName = null;

    //顯示讀取icon (超過100筆的話就顯示讀取圖示 搜尋優先模式不顯示讀取圖示)
    if (DropListTempData[Name].Search == false || DropListTempData[Name].SearchPriority == false) {
        if (DropListTempData[Name].DataCount > 100 && DropListTempData[Name].Mode != 'list') {
            DropListEvent.find('.DropList_i').attr('class', 'fa fa-spinner fa-pulse DropList_i DropList_i_loading');
        }
    }

    //設定延遲 讓讀取圖示有顯示緩衝時間
    $('body').delay(10).show(1, function () {

        //執行 OnStart 函數
        if (DropListTempData[Name].OnStart != null) {
            DropListTempData[Name].OnStart(Name);
        }

        //關閉非使用的所有選單 (除了清單模式)
        $('.DropListSelect').not('.DropListSelect_List').hide(200);
        //清除選單容器 (除了清單模式)
        DropListEvent.find('.DropListSelect').not('.DropListSelect_List').remove();
        //填入選單容器
        DropListEvent.append('<div class="DropListSelect" style="' + DropListTempData[Name].ListStyle + '"></div>');
        //隱藏選單容器
        DropListEvent.find('.DropListSelect').hide();
        //判斷自適應 或賦予選單容器位置
        if (DropListTempData[Name].Mode == 'list') {
            //若為清單模式 則替換專用css
            DropListEvent.find('.DropListSelect').addClass('DropListSelect_List');
        } else if (navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i)) {
            //手機板的話就套用手機專用的 Css
            DropListEvent.find('.DropListSelect').addClass('DropListSelect_Phone');
            //並加上關閉按鈕
            DropListEvent.find('.DropListSelect').append('<div class="DropListClose"><i class="fa fa-times"></i>&nbsp;關閉選單</div>');
        } else {
            //電腦版的話就 定位選單容器 垂直位置
            DropListEvent.find('.DropListSelect').css({
                top: $(Event).height() + parseInt($(Event).css('padding-top').replace('px', '')) + parseInt($(Event).css('padding-bottom').replace('px', '')) + DropListTempData[Name].ListSpace
            });
        }


        //判斷是否要搜尋列 (同時判斷是否為搜尋優先模式)
        if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == false) {
            DropListEvent.find('.DropListSelect').append(
                  '<div class="DropListSearch">' +
                      '<table>' +
                          '<tbody>' +
                              '<tr>' +
                                  '<td>' +
                                     '<input class="DropListSearchInput" val-name="' + Name + '" type="text" placeholder="關鍵字搜尋..." title="輸入關鍵字後，按下Enter鍵即可執行搜尋" value="" />' +
                                  '</td>' +
                                  '<td>' +
                                      '<button onclick="DropListSearch($(this),\'' + Name + '\')" type="button" class="button_l btn_space_l btn_s DropListSearchInputBtn"><i class="fa fa-search fa-fw"></i></button>' +
                                  '</td>' +
                              '</tr>' +
                          '</tbody>' +
                      '</table>' +
                  '</div>');
        } else if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {
            DropListEvent.find('.DropListSelect').append(
                  '<div class="DropListSearchMemo">輸入關鍵字查詢出符合選項：</div>' +
                  '<div class="DropListSearch">' +
                      '<table>' +
                          '<tbody>' +
                              '<tr>' +
                                  '<td>' +
                                     '<input class="DropListSearchInput" val-name="' + Name + '" type="text" placeholder="關鍵字搜尋..." title="輸入關鍵字後，按下Enter鍵即可執行搜尋" value="" />' +
                                  '</td>' +
                                  '<td>' +
                                      '<button onclick="DropListSearch($(this),\'' + Name + '\', \'KeySearch\')" type="button" class="button_l btn_space_l btn_s DropListSearchInputBtn"><i class="fa fa-search fa-fw"></i></button>' +
                                  '</td>' +
                              '</tr>' +
                          '</tbody>' +
                      '</table>' +
                  '</div>');
        } else {
            //就算沒開啟查詢模式 也要維持查詢 才不會出錯 (因為已選取項目是利用查詢製作的)
            DropListEvent.find('.DropListSelect').append(
                  '<div class="DropListSearch" style="display:none">' +
                      '<table>' +
                          '<tbody>' +
                              '<tr>' +
                                  '<td>' +
                                     '<input class="DropListSearchInput" val-name="' + Name + '" type="text" placeholder="關鍵字搜尋..." title="輸入關鍵字後，按下Enter鍵即可執行搜尋" value="" />' +
                                  '</td>' +
                                  '<td>' +
                                      '<button onclick="DropListSearch($(this),\'' + Name + '\')" type="button" class="button_l btn_space_l btn_s DropListSearchInputBtn"><i class="fa fa-search fa-fw"></i></button>' +
                                  '</td>' +
                              '</tr>' +
                          '</tbody>' +
                      '</table>' +
                  '</div>');
        }


        //建立插件模組區塊 (全選全消、群組清單 有開啟時才建立)
        if ((DropListTempData[Name].AllSelect == true && DropListTempData[Name].Type == 'multiple') || DropListTempData[Name].GroupList == true) {
            DropListEvent.find('.DropListSelect').append('<div class="DropListPlugin"></div>');
        }

        //判斷是否要加入群組按鈕
        if (DropListTempData[Name].GroupList == true) {
            DropListEvent.find('.DropListPlugin').append('<button type="button" class="button btn_white btn_s" onclick="DropListGroupListBtn($(this),\'' + Name + '\')" title="清單列出所有群組方便選取"><i class="fa fa-list-ul"></i>&nbsp;群組清單</button>');
        }

        //判斷是否要填入全選功能 (全選跟全消要分開才能讓群組按鈕放中間)
        if (DropListTempData[Name].AllSelect == true && DropListTempData[Name].Type == 'multiple') {
            DropListEvent.find('.DropListPlugin').append('<button type="button" class="button btn_white btn_s" onclick="DropListCheckBoxAll($(this),\'' + Name + '\',\'AllSelect\')" title="選取當前所見項目"><i class="fa fa-check-square-o"></i>&nbsp;全選</button>');
        }

        //判斷是否要填入全消功能 (全選跟全消要分開才能讓群組按鈕放中間)
        if (DropListTempData[Name].AllSelect == true && DropListTempData[Name].Type == 'multiple') {
            DropListEvent.find('.DropListPlugin').append('<button type="button" class="button btn_white btn_s" onclick="DropListCheckBoxAll($(this),\'' + Name + '\',\'AllCancel\')" title="取消當前所見項目"><i class="fa fa-square-o"></i>&nbsp;全消</button>');
        }

        //放入選項外殼
        DropListEvent.find('.DropListSelect').append('<div class="DropListTarget" style="' + DropListTempData[Name].ItemStyle + '"></div>');

        //若開啟搜尋優先模式 要多插入一個當前筆數顯示區塊 (順便隱藏 DropListTarget 區塊)
        if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {
            DropListEvent.find('.DropListSelect').append('<div class="DropListNowCount"></div>');

            //隱藏 DropListTarget 區塊
            DropListEvent.find('.DropListTarget').hide();
        }

        //放群組清單區塊 放到 DropListTarget 裡面
        if (DropListTempData[Name].GroupList == true) {
            DropListEvent.find('.DropListTarget').append('<div class="DropListGroupList"></div>');
            //填入 全部顯示 按鈕
            DropListEvent.find('.DropListGroupList').append('<div class="DropListGroupListItem" onclick="DropListGroupListItemBtn($(this),\'' + Name + '\',\'All\')" title="顯示所有群組選項"><i class="fa fa-caret-right"></i>&nbsp;全部顯示</div>');
            //填入 已選取項目 按鈕
            DropListEvent.find('.DropListGroupList').append('<div class="DropListGroupListItem DropListGroupListItemSelectBtn" onclick="DropListGroupListItemBtn($(this),\'' + Name + '\',\'Select\')" title="顯示已選取的項目"><i class="fa fa-caret-right"></i>&nbsp;已選取項目</div>');

            //填入 群組標題 按鈕
            for (var i = 0; i < DropListTempData[Name].Data.length; i++) {
                DropListEvent.find('.DropListGroupList').append('<div class="DropListGroupListItem" onclick="DropListGroupListItemBtn($(this),\'' + Name + '\',' + i + ')" title="開啟該群組"><span style="color:#aaa">' + (i + 1) + '.</span> ' + DropListTempData[Name].Data[i].Optgroup + '</div>');
            }
        }

        //建立下拉清單
        for (var i = 0; i < DropListTempData[Name].Data.length; i++) {

            //判斷要不要放群組標題
            var tempOptgroupHtml = '';
            if (DropListTempData[Name].Data[i].Optgroup != '') {
                tempOptgroupHtml = '<div class="DropListOptgroupTitle">' +
                                      '<span class="DropListOptgroupTitleSpan">' +
                                          DropListTempData[Name].Data[i].Optgroup +
                                      '</span>' +
                                   '</div>'
            }

            //放入群組標題
            DropListEvent.find('.DropListTarget').append('<div class="DropListOptgroup">' +
                                                             tempOptgroupHtml +
                                                         '</div>');

            //帶入選項 (若為搜尋模式優先的話 就只放預設選取的項目)
            if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {

                //比對符合預設選取的選項
                for (var j = 0; j < DropListTempData[Name].Data[i].Option.length; j++) {
                    for (var s = 0; s < DropListTempData[Name].Select.length; s++) {
                        if (DropListTempData[Name].Select[s] == DropListTempData[Name].Data[i].Option[j].Val) {

                            var tempTitle = DropListTempData[Name].Data[i].Option[j].Title ? DropListTempData[Name].Data[i].Option[j].Title : DropListTempData[Name].Data[i].Option[j].Text;

                            //模式判斷 單選模式
                            if (DropListTempData[Name].Type == 'single') {
                                DropListEvent.find('.DropListTarget .DropListOptgroup:last-child').append(
                                    '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_radio" title="' + tempTitle + '">' +
                                        '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="radio" name="' + Name + '" />' +
                                        '<span class="label_icon"></span>' +
                                        DropListTempData[Name].Data[i].Option[j].Text +
                                    '</label>');
                            }
                            //模式判斷 複選模式
                            if (DropListTempData[Name].Type == 'multiple') {
                                DropListEvent.find('.DropListTarget .DropListOptgroup:last-child').append(
                                    '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_checkbox" title="' + tempTitle + '">' +
                                        '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="checkbox" name="' + Name + '" />' +
                                        '<span class="label_icon"></span>' +
                                        DropListTempData[Name].Data[i].Option[j].Text +
                                    '</label>');
                            }
                        }
                    }
                }

                //套用當前筆數
                DropListEvent.find('.DropListNowCount').html('選取：<span class="DropListNowCountSelect">' + DropListTempData[Name].Select.length + ' 筆</span>查詢：<span class="DropListNowCountSearch">0 筆</span>總計：<span class="DropListNowCountAll">' + DropListTempData[Name].DataCount + ' 筆</span>');

            } else {

                for (var j = 0; j < DropListTempData[Name].Data[i].Option.length; j++) {

                    var tempTitle = DropListTempData[Name].Data[i].Option[j].Title ? DropListTempData[Name].Data[i].Option[j].Title : DropListTempData[Name].Data[i].Option[j].Text;

                    //模式判斷 單選模式
                    if (DropListTempData[Name].Type == 'single') {
                        DropListEvent.find('.DropListTarget .DropListOptgroup:last-child').append(
                            '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_radio" title="' + tempTitle + '">' +
                                '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="radio" name="' + Name + '" />' +
                                '<span class="label_icon"></span>' +
                                DropListTempData[Name].Data[i].Option[j].Text +
                            '</label>');
                    }
                    //模式判斷 複選模式
                    if (DropListTempData[Name].Type == 'multiple') {
                        DropListEvent.find('.DropListTarget .DropListOptgroup:last-child').append(
                            '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_checkbox" title="' + tempTitle + '">' +
                                '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="checkbox" name="' + Name + '" />' +
                                '<span class="label_icon"></span>' +
                                DropListTempData[Name].Data[i].Option[j].Text +
                            '</label>');
                    }
                }

            }

        }


        //判斷 選取方塊 是否需要隱藏
        if (DropListTempData[Name].InputBox == false) {
            //隱藏單選及複選的方塊
            DropListEvent.find('.DropListTarget input[type="radio"]').hide();
            DropListEvent.find('.DropListTarget input[type="checkbox"]').hide();
            DropListEvent.find('.DropListTarget .label_icon').hide();
        };

        //清空 套用文字 陣列
        DropListTempData[Name].SelectText = [];
        //判斷 預設選取 並套用文字
        if (DropListTempData[Name].Select.length != 0) {

            //判斷如果為單選模式 就只提取最後一個項目 (防呆功能)
            if (DropListTempData[Name].Type == 'single') {
                DropListTempData[Name].Select = [DropListTempData[Name].Select[DropListTempData[Name].Select.length - 1]];
            }

            for (var i = 0; i < DropListTempData[Name].Select.length; i++) {
                DropListEvent.find('.DropListTarget input[type="radio"],.DropListTarget input[type="checkbox"]').each(function (index, element) {
                    var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
                    var TempOption = parseInt(element.attributes['option-index'].value);
                    if (DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Val == DropListTempData[Name].Select[i]) {
                        element.checked = true;
                        //改變背景顏色
                        DropListEvent.find('.DropListTarget .DropListOption:eq(' + index + ')').addClass('DropListOptionSelectBG');
                        //套用文字
                        DropListTempData[Name].SelectText.push(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text);
                    }
                });
            }
        }

        //若開啟直接顯示群組清單 就自動執行 群組清單的功能
        if (DropListTempData[Name].GroupList == true && DropListTempData[Name].GroupListStart == true) {
            //關閉選項區塊
            DropListEvent.find('.DropListOptgroup').hide();
            //打開群組清單
            DropListEvent.find('.DropListGroupList').show();
        }

        //判斷是否要顯示或隱藏 已選取項目 的群組按鈕
        if (DropListTempData[Name].GroupList == true && DropListTempData[Name].Select.length == 0) {
            DropListEvent.find('.DropListGroupListItemSelectBtn').hide();
        } else {
            DropListEvent.find('.DropListGroupListItemSelectBtn').show();
        }

        //顯示箭頭icon
        $(Event).find('.DropList_i').attr('class', 'fa fa-caret-down DropList_i');

        //如果不啟用 在 list 模式時 要添加禁用符號 並把所有 input 項目添加 disabled 屬性
        if (DropListTempData[Name].Enabled == false && DropListTempData[Name].Mode == 'list') {
            $(Event).parent().find('.DropListTarget').addClass('DropListDisabled');
            $(Event).parent().find('.DropListTarget input[type="radio"],.DropListTarget input[type="checkbox"]').attr('disabled', 'disabled');
        }

        //顯示選單容器 若為選單模式則馬上顯示
        if (DropListTempData[Name].Mode == 'list') {
            DropListEvent.find('.DropListSelect').show();
        } else {

            DropListEvent.find('.DropListSelect').show(200, function () {

                //判斷是否有使用 超出視窗位移下拉選單
                if (DropListTempData[Name].MoveList == true) {

                    //行動裝置不需要位移判斷
                    if (!navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i)) {

                        //判斷是否需要調整位置
                        var tempEvenTop = DropListEvent.find('.DropListSelect').offset().top + DropListEvent.find('.DropListSelect').height() - $('html')[0].scrollTop;
                        var tempEvenRight = DropListEvent.find('.DropListSelect').offset().left + DropListEvent.find('.DropListSelect').width() - $('html')[0].scrollLeft + 40;
                        var tempBodyH = window.innerHeight; //$('body').height();
                        var tempBodyW = window.innerWidth; //$('body').width();


                        //判斷是否有使用 使用手動控制選單位移量 MoveListCtrl
                        if (DropListTempData[Name].MoveListCtrl != null) {

                            //位移
                            DropListEvent.find('.DropListSelect').animate({
                                top: DropListTempData[Name].MoveListCtrl.Top,
                                left: DropListTempData[Name].MoveListCtrl.Left,
                            }, 300);

                        } else {

                            //計算位移量
                            var tempTop = tempBodyH - tempEvenTop;
                            var tempLeft = tempBodyW - tempEvenRight;

                            //位移
                            if (tempEvenRight > tempBodyW &&
                                tempEvenTop > tempBodyH) {

                                DropListEvent.find('.DropListSelect').animate({
                                    top: tempTop,
                                    left: tempLeft
                                }, 300);

                            } else if (tempEvenRight > tempBodyW) {

                                DropListEvent.find('.DropListSelect').animate({
                                    left: tempLeft
                                }, 300);

                            } else if (tempEvenTop > tempBodyH) {

                                DropListEvent.find('.DropListSelect').animate({
                                    top: tempTop
                                }, 300);

                            }

                        }

                    }

                }

            });

        }

        //若有已選取項目的話 滑動條直接拉到選取項目的位置
        if (DropListTempData[Name].Select.length > 0) {
            if (navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i)) {
                //行動裝置不執行
            } else {
                //電腦
                if (DropListEvent.find('.DropListPlugin').height()) {
                    DropListEvent.find('.DropListTarget').scrollTop(DropListEvent.find('.DropListTarget .DropListOptionSelectBG')[0].offsetTop - 78);
                } else {
                    DropListEvent.find('.DropListTarget').scrollTop(DropListEvent.find('.DropListTarget .DropListOptionSelectBG')[0].offsetTop - 46);
                }
            }
        }

        //聚焦在查詢欄位 (電腦才用)
        if (DropListTempData[Name].Search == true && DropListTempData[Name].Mode != 'list' &&
            !navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i)) {
            $('body').delay(200).show(1, function () {
                DropListEvent.find('.DropListSearchInput').focus();
            });
        }

        //手機板的話 就要計算 DropListTarget 容器的高度
        if (navigator.userAgent.match(/(android|iphone|ipad|ipod);?/i) && DropListTempData[Name].Mode != 'list') {

            var TempTargetHeight = 0;

            //套用 螢幕高度
            TempTargetHeight = window.innerHeight;

            //減去 關閉按鈕的高度
            TempTargetHeight = TempTargetHeight -
                               $(Event).parent().find('.DropListClose')[0].clientHeight -
                               parseInt($(Event).parent().find('.DropListClose').css('margin-bottom').replace('px', ''));

            //搜尋優先模式註解的高度
            if ($(Event).parent().find('.DropListSearchMemo').length != 0) {
                TempTargetHeight = TempTargetHeight -
                                   $(Event).parent().find('.DropListSearchMemo')[0].clientHeight -
                                   parseInt($(Event).parent().find('.DropListSearchMemo').css('margin-bottom').replace('px', ''));
            }

            //搜尋列的高度
            if ($(Event).parent().find('.DropListSearch').length != 0) {
                TempTargetHeight = TempTargetHeight -
                                   $(Event).parent().find('.DropListSearch')[0].clientHeight -
                                   parseInt($(Event).parent().find('.DropListSearch').css('margin-bottom').replace('px', ''));
            }

            //擴充按鈕模組的高度
            if ($(Event).parent().find('.DropListPlugin').length != 0) {
                TempTargetHeight = TempTargetHeight -
                                   $(Event).parent().find('.DropListPlugin')[0].clientHeight -
                                   parseInt($(Event).parent().find('.DropListPlugin').css('margin-bottom').replace('px', ''));
            }

            //當前筆數高度
            if ($(Event).parent().find('.DropListNowCount').length != 0) {
                TempTargetHeight = TempTargetHeight -
                                   $(Event).parent().find('.DropListNowCount')[0].clientHeight -
                                   parseInt($(Event).parent().find('.DropListNowCount').css('margin-top').replace('px', ''));
            }

            //運算容器高度
            $(Event).parent().find('.DropListTarget').css('max-height', TempTargetHeight);
        }

    });

};
//選項執行
DropListClick = function (Event, Name) {

    //先判斷是啟用還是關閉 (關閉就直接不執行)
    if (DropListTempData[Name].Enabled == false) {
        //$(Event)[0].checked = false;
        return;
    }

    //簡寫物件
    var DropListSelectEvent = $(Event).parent().parent().parent().parent();
    var DropListOption = $(Event).parent();

    //超過100筆的話 就顯示讀取icon
    if (DropListTempData[Name].DataCount > 100 && DropListTempData[Name].Mode != 'list') {
        //DropListSelectEvent.find('.DropListSearchInput')[0].value = '選取中...';
        DropListSelectEvent.find('.DropListSearchInputBtn i').attr('class', 'fa fa-spinner fa-pulse fa-fw');
    }

    //設定延遲 讓讀取圖示有顯示緩衝時間
    $('body').delay(10).show(1, function () {

        //單選模式
        if (DropListTempData[Name].Type == 'single') {

            //先清除所有點選的按鈕樣式
            DropListSelectEvent.find('.DropListTarget .DropListOption').removeClass('DropListOptionSelectBG');
            $(DropListOption).addClass('DropListOptionSelectBG');

            //尋找選擇了哪一個，index 是位置，element 是這個元件
            DropListSelectEvent.find('.DropListTarget input[type="radio"]').each(function (index, element) {

                if ($(element).parent().css('display') != 'none') {

                    if (element.checked) {
                        //element.attributes['optgroup-index'].value 取到的群組座標
                        //element.attributes['option-index'].value 取到的選項座標

                        var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
                        var TempOption = parseInt(element.attributes['option-index'].value);

                        ////改變背景顏色 (清單模式才需要)
                        //if (DropListTempData[Name].Mode == 'list') {
                        //    DropListSelectEvent.find('.DropListTarget .DropListOption:eq(' + index + ')').addClass('DropListOptionSelectBG');
                        //}

                        //改變 button 文字
                        DropListSelectEvent.parent().find('.DropList_span').html(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text);
                        //填入選取值
                        DropListTempData[Name].Select = [DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Val];
                        DropListTempData[Name].SelectText = [DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text];

                    }
                    //else {
                    //
                    //    ////沒被選到的還原背景顏色 (清單模式才需要)
                    //    //if (DropListTempData[Name].Mode == 'list') {
                    //    //    DropListSelectEvent.find('.DropListTarget .DropListOption:eq(' + index + ')').removeClass('DropListOptionSelectBG');
                    //    //}
                    //
                    //}

                }

            });

            //執行 OnEnd 函數
            if (DropListTempData[Name].OnEnd != null) {
                DropListTempData[Name].OnEnd(DropListTempData[Name].Select, Name);
            }

            //單選預設點擊後 關閉所有選單 (除了清單模式)
            $('.DropListSelect').not('.DropListSelect_List').hide(200, function () {
                //清除選單容器
                DropListSelectEvent.not('.DropListSelect_List').remove();
            });

        }

            //複選模式
        else if (DropListTempData[Name].Type == 'multiple') {

            //直接改變點選的按鈕樣式
            if ($(Event).prop('checked') == true) {
                $(DropListOption).addClass('DropListOptionSelectBG');
            } else {
                $(DropListOption).removeClass('DropListOptionSelectBG');
            }

            //先清空選取值
            DropListTempData[Name].Select = [];
            DropListTempData[Name].SelectText = [];

            //尋找選擇了哪一個，index 是位置，element 是這個元件
            DropListSelectEvent.find('.DropListTarget input[type="checkbox"]').each(function (index, element) {

                if (element.checked) {

                    var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
                    var TempOption = parseInt(element.attributes['option-index'].value);

                    //填入選取值
                    DropListTempData[Name].Select.push(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Val);
                    DropListTempData[Name].SelectText.push(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text);

                }

            });

            //賦予 OnEnd 儲存變數
            if (DropListTempData[Name].OnEnd != null) {
                DropListTempOnEndName = Name;
            }

            //改變 button 文字
            if (DropListTempData[Name].Select.length == 0) {
                //取得預設文字
                DropListSelectEvent.parent().find('.DropList_span').html(DropListTempData[Name].ButtonText);
            } else {

                if (DropListTempData[Name].SelectText.length > DropListTempData[Name].MultipleSelect) {

                    DropListSelectEvent.parent().find('.DropList_span').html('選取了 ' + DropListTempData[Name].Select.length + ' 個');

                } else {

                    var TempMultipleSelect = [];
                    for (var i = 0; i < DropListTempData[Name].SelectText.length; i++) {
                        TempMultipleSelect.push(DropListTempData[Name].SelectText[i]);
                    }
                    DropListSelectEvent.parent().find('.DropList_span').html(TempMultipleSelect.join('、'));

                }

            }

        }

        //執行 OnChange 函數
        if (DropListTempData[Name].OnChange != null) {
            DropListTempData[Name].OnChange(DropListTempData[Name].Select, Name);
        }

        //顯示箭頭icon
        //DropListSelectEvent.find('.DropListSearchInput')[0].value = '';
        DropListSelectEvent.find('.DropListSearchInputBtn i').attr('class', 'fa fa-search fa-fw');

        //若開啟搜尋優先模式 則要更改選取的筆數
        if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {
            DropListSelectEvent.find('.DropListNowCountSelect').html(DropListTempData[Name].Select.length + ' 筆');
        }

    });

};
//全選/全消功能
DropListCheckBoxAll = function (Event, Name, Type) {

    //簡寫物件
    var DropListSelectEvent = $(Event).parent().parent();

    //顯示讀取icon (超過100筆的話就顯示讀取圖示)
    if (DropListTempData[Name].DataCount > 100 && DropListTempData[Name].Mode != 'list') {
        DropListSelectEvent.parent().find('.DropListSearchInputBtn i').attr('class', 'fa fa-spinner fa-pulse fa-fw');
    }

    //先清空選取值
    DropListTempData[Name].Select = [];
    DropListTempData[Name].SelectText = [];

    //設定延遲 讓讀取圖示有顯示緩衝時間
    $('body').delay(10).show(1, function () {

        //將目前畫面上的項目同步
        DropListSelectEvent.find('.DropListTarget input[type="checkbox"]').each(function (index, element) {

            if ($(element).parent().parent().css('display') != 'none' && $(element).parent().css('display') != 'none') {

                if (Type == 'AllSelect') {

                    element.checked = true;
                    //改變背景顏色
                    DropListSelectEvent.find('.DropListOption:eq(' + index + ')').addClass('DropListOptionSelectBG');

                } else if (Type == 'AllCancel') {

                    element.checked = false;
                    //移除背景顏色
                    DropListSelectEvent.find('.DropListOption:eq(' + index + ')').removeClass('DropListOptionSelectBG');

                }

            }

        });


        //查詢目前還有勾選的項目 並填入資料
        DropListSelectEvent.find('.DropListTarget input[type="checkbox"]').each(function (index, element) {
            if (element.checked) {
                //填入選取值
                var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
                var TempOption = parseInt(element.attributes['option-index'].value);
                DropListTempData[Name].Select.push(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Val);
                DropListTempData[Name].SelectText.push(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text);
            }
        });


        //改變 button 文字
        if (DropListTempData[Name].Select.length == 0) {
            DropListSelectEvent.parent().find('.DropList_span').html(DropListTempData[Name].ButtonText);
        } else {
            if (DropListTempData[Name].SelectText.length > DropListTempData[Name].MultipleSelect) {

                DropListSelectEvent.parent().find('.DropList_span').html('選取了 ' + DropListTempData[Name].Select.length + ' 個');

            } else {

                var TempMultipleSelect = [];
                for (var i = 0; i < DropListTempData[Name].SelectText.length; i++) {
                    TempMultipleSelect.push(DropListTempData[Name].SelectText[i]);
                }
                DropListSelectEvent.parent().find('.DropList_span').html(TempMultipleSelect.join('、'));

            }
        }

        //執行 OnChange 函數
        if (DropListTempData[Name].OnChange != null) {
            DropListTempData[Name].OnChange(DropListTempData[Name].Select, Name);
        }

        //賦予 OnEnd 儲存變數
        if (DropListTempData[Name].OnEnd != null) {
            DropListTempOnEndName = Name;
        }

        //顯示箭頭icon
        DropListSelectEvent.parent().find('.DropListSearchInputBtn i').attr('class', 'fa fa-search fa-fw');

        //若開啟搜尋優先模式 則要更改選取的筆數
        if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {
            DropListSelectEvent.find('.DropListNowCountSelect').html(DropListTempData[Name].Select.length + ' 筆');
        }

    });

};
//搜尋功能
DropListSearch = function (Event, Name, Type) {

    //Enter搜尋引導 若目前開啟了搜尋優先模式的話 就直接引導過去再轉回來
    if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true && Type == 'KeySearch') {
        DropListSearchPriority(Event, Name, Type);
    }

    //簡寫物件
    var DropListSearchInputEvent = $(Event).parent().parent().parent().parent().parent().find('.DropListSearchInput');
    var DropListTargetEvent = $(Event).parent().parent().parent().parent().parent().parent().find('.DropListTarget');

    //搜尋欄位的值
    TempSearch = DropListSearchInputEvent[0].value;


    //顯示搜尋文字 及 讀取圖示 (超過100筆的話就顯示搜尋文字)
    if (DropListTempData[Name].DataCount > 100) {

        if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {

            //搜尋優先模式在 專用的函數執行

        } else {

            //普通搜尋模式直接執行

            //修改為搜尋中
            //DropListSearchInputEvent[0].value = '搜尋中...';
            //顯示讀取圖示
            $(Event).parent().parent().find('.DropListSearchInputBtn i').attr('class', 'fa fa-spinner fa-pulse fa-fw');
        }

    }

    //設定延遲 讓搜尋文字有顯示緩衝時間
    $('body').delay(10).show(1, function () {

        //先隱藏所有群組標題 (其中每個群組只要有一個選項 顯示 就打開)
        DropListTargetEvent.find('.DropListOptgroupTitle').hide();

        //宣告 搜尋優先模式時 專用計數器
        var TempSearchPrioritySun = 0;

        //搜尋所有單選項目
        DropListTargetEvent.find('input[type="radio"],input[type="checkbox"]').each(function (index, element) {

            ////關閉所有勾選
            //element.checked = false;
            ////還原背景顏色
            //DropListTargetEvent.find('.DropListOption:eq(' + index + ')').removeClass('DropListOptionSelectBG');

            var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
            var TempOption = parseInt(element.attributes['option-index'].value);

            //模糊比對 (轉文字)
            var TempMath = '' + DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text;
            TempMath = TempMath.match(TempSearch);

            //判斷是否有特殊情況
            if (Type == 'GroupListSelect') {

                if (element.checked) {
                    DropListTargetEvent.find('.DropListOption:eq(' + index + ')').show();
                    //打開所屬群組標題
                    DropListTargetEvent.find('.DropListOptgroupTitle:eq(' + TempOptgroup + ')').show();
                } else {
                    DropListTargetEvent.find('.DropListOption:eq(' + index + ')').hide();
                }

            } else if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {

                //搜尋優先模式時 專用 (僅顯示 N 筆以下)
                if (TempMath && TempSearchPrioritySun < DropListTempData[Name].SearchPriorityCount) {
                    DropListTargetEvent.find('.DropListOption:eq(' + index + ')').show();
                    //打開所屬群組標題
                    DropListTargetEvent.find('.DropListOptgroupTitle:eq(' + TempOptgroup + ')').show();
                    //增加專用計數器
                    TempSearchPrioritySun++;
                } else {
                    DropListTargetEvent.find('.DropListOption:eq(' + index + ')').hide();
                }

            } else {

                if (TempMath) {
                    //若符合 顯示
                    //超過100筆的話 就不跑動畫
                    if (DropListTempData[Name].DataCount > 100) {
                        DropListTargetEvent.find('.DropListOption:eq(' + index + ')').show();
                    } else {
                        DropListTargetEvent.find('.DropListOption:eq(' + index + ')').slideDown(200);
                    }

                    //打開所屬群組標題
                    DropListTargetEvent.find('.DropListOptgroupTitle:eq(' + TempOptgroup + ')').show();

                } else {
                    //若不符合 隱藏
                    //超過100筆的話 就不跑動畫
                    if (DropListTempData[Name].DataCount > 100) {
                        DropListTargetEvent.find('.DropListOption:eq(' + index + ')').hide();
                    } else {
                        DropListTargetEvent.find('.DropListOption:eq(' + index + ')').slideUp(200);
                    }
                }

            }

            //改回搜尋文字 及 恢復圖示
            if ((index + 1) == DropListTargetEvent.find('input[type="radio"],input[type="checkbox"]').length) {
                //DropListSearchInputEvent[0].value = TempSearch;
                $(Event).parent().parent().find('.DropListSearchInputBtn i').attr('class', 'fa fa-search fa-fw');
                //關鍵字輸入欄位失焦
                $(Event).parent().parent().find('.DropListSearchInput').blur();
            }

        });

        //顯示 DropListTarget 區塊
        if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {
            DropListTargetEvent.slideDown(200);
        }

        //若開啟群組清單 就自動執行 全部顯示
        if (DropListTempData[Name].GroupList == true) {
            //這裡抓到 table 這樣執行 DropListGroupListItemBtn() 函數時 就會指向到 DropListTarget
            DropListGroupListItemBtn($(Event).parent().parent().parent().parent(), Name, 'Search');
        }

    });

};
//搜尋優先專用功能
DropListSearchPriority = function (Event, Name, Type) {

    //簡寫物件
    var DropListSearchInputEvent = $(Event).parent().parent().parent().parent().parent().find('.DropListSearchInput');
    var DropListTargetEvent = $(Event).parent().parent().parent().parent().parent().parent().find('.DropListTarget');

    //搜尋欄位的值
    var TempSearch = DropListSearchInputEvent[0].value;


    //顯示搜尋文字 及 讀取圖示 (超過3000筆的話顯示)
    if (DropListTempData[Name].DataCount > 3000) {
        //修改為搜尋中
        //DropListSearchInputEvent[0].value = '搜尋中...';
        //顯示讀取圖示
        $(Event).parent().parent().find('.DropListSearchInputBtn i').attr('class', 'fa fa-spinner fa-pulse fa-fw');
    }

    //設定延遲 讓搜尋文字有顯示緩衝時間
    $('body').delay(10).show(1, function () {

        //var testcount = 0;

        //套用原始提示
        DropListTargetEvent.parent().find('.DropListSearchMemo').html('輸入關鍵字查詢出符合選項：');

        //清除未選取的選項
        DropListTargetEvent.find('.DropListOption').remove();

        //隱藏所有群組標題 (其中每個群組只要有一個選項 顯示 就打開)
        //DropListTargetEvent.find('.DropListOptgroupTitle').hide();

        //宣告 查詢筆數 變數
        var TempDropListNowCountSelect = 0;
        var TempDropListNowCountSearch = 0;
        var TempDropListNowCountSun = 0;

        //建立 比對 該項目有沒有被選取 專用的object
        DropListTempData[Name].SelectPriorityMatch = {};
        for (var i = 0; i < DropListTempData[Name].Select.length; i++) {
            DropListTempData[Name].SelectPriorityMatch[DropListTempData[Name].Select[i]] = true;
        }

        //執行查詢比對
        for (var i = 0; i < DropListTempData[Name].Data.length; i++) {
            for (var j = 0; j < DropListTempData[Name].Data[i].Option.length; j++) {

                //先確認該項目有沒有被選取 (改到直接在下面判斷)
                //var TempSearchCheck = false;
                //if (DropListTempData[Name].SelectPriorityMatch[DropListTempData[Name].Data[i].Option[j].Val]) {
                //    TempSearchCheck = true;
                //}

                //模糊比對 (轉文字)
                var TempMath = '' + DropListTempData[Name].Data[i].Option[j].Text;
                TempMath = TempMath.match(TempSearch);

                //判斷該項目有沒有被選取 沒被選取就比對是否符合關鍵字
                if (DropListTempData[Name].SelectPriorityMatch[DropListTempData[Name].Data[i].Option[j].Val]) {

                    var tempTitle = DropListTempData[Name].Data[i].Option[j].Title ? DropListTempData[Name].Data[i].Option[j].Title : DropListTempData[Name].Data[i].Option[j].Text;

                    //模式判斷 單選模式
                    if (DropListTempData[Name].Type == 'single') {
                        DropListTargetEvent.find(' .DropListOptgroup:eq(' + i + ')').append(
                            '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_radio" title="' + tempTitle + '" style="display:none">' +
                                '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="radio" name="' + Name + '" />' +
                                '<span class="label_icon"></span>' +
                                DropListTempData[Name].Data[i].Option[j].Text +
                            '</label>');
                    }
                    //模式判斷 複選模式
                    if (DropListTempData[Name].Type == 'multiple') {
                        DropListTargetEvent.find(' .DropListOptgroup:eq(' + i + ')').append(
                            '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_checkbox" title="' + tempTitle + '" style="display:none">' +
                                '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="checkbox" name="' + Name + '" />' +
                                '<span class="label_icon"></span>' +
                                DropListTempData[Name].Data[i].Option[j].Text +
                            '</label>');
                    }

                    //增加已選筆數
                    TempDropListNowCountSelect++;

                    //紀錄這次搜尋的筆數
                    if (TempMath) {
                        TempDropListNowCountSun++;
                    }

                } else {

                    if (TempMath) {

                        if (TempDropListNowCountSearch < DropListTempData[Name].SearchPriorityCount) {

                            var tempTitle = DropListTempData[Name].Data[i].Option[j].Title ? DropListTempData[Name].Data[i].Option[j].Title : DropListTempData[Name].Data[i].Option[j].Text;

                            //模式判斷 單選模式
                            if (DropListTempData[Name].Type == 'single') {
                                DropListTargetEvent.find(' .DropListOptgroup:eq(' + i + ')').append(
                                    '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_radio" title="' + tempTitle + '" style="display:none">' +
                                        '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="radio" name="' + Name + '" />' +
                                        '<span class="label_icon"></span>' +
                                        DropListTempData[Name].Data[i].Option[j].Text +
                                    '</label>');
                            }
                            //模式判斷 複選模式
                            if (DropListTempData[Name].Type == 'multiple') {
                                DropListTargetEvent.find(' .DropListOptgroup:eq(' + i + ')').append(
                                    '<label class="' + DropListTempData[Name].ItemButtonMode_OptionClass + ' label_checkbox" title="' + tempTitle + '" style="display:none">' +
                                        '<input onchange="DropListClick($(this),\'' + Name + '\')" optgroup-index="' + i + '" option-index="' + j + '" type="checkbox" name="' + Name + '" />' +
                                        '<span class="label_icon"></span>' +
                                        DropListTempData[Name].Data[i].Option[j].Text +
                                    '</label>');
                            }


                        }

                        //增加查詢筆數
                        TempDropListNowCountSearch++;

                        //紀錄這次搜尋的筆數
                        TempDropListNowCountSun++;
                    }

                }

            }
        }


        //判斷 預設選取 並套用文字
        if (DropListTempData[Name].Select.length != 0) {

            //判斷如果為單選模式 就只提取最後一個項目 (防呆功能)
            if (DropListTempData[Name].Type == 'single') {
                DropListTempData[Name].Select = [DropListTempData[Name].Select[DropListTempData[Name].Select.length - 1]];
            }

            DropListTargetEvent.find('input[type="radio"],input[type="checkbox"]').each(function (index, element) {
                for (var i = 0; i < DropListTempData[Name].Select.length; i++) {
                    var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
                    var TempOption = parseInt(element.attributes['option-index'].value);
                    if (DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Val == DropListTempData[Name].Select[i]) {
                        element.checked = true;
                        //改變背景顏色
                        DropListTargetEvent.find('.DropListOption:eq(' + index + ')').addClass('DropListOptionSelectBG');
                        //套用文字
                        DropListTempData[Name].SelectText.push(DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Text);
                    }

                }

            });

        }


        //若查詢筆數過大時 改變提示
        if (TempDropListNowCountSearch >= DropListTempData[Name].SearchPriorityCount) {

            DropListTargetEvent.parent().find('.DropListSearchMemo').html('<span style="color:#f00">符合筆數過多，除已選取項目外僅顯示前 ' + DropListTempData[Name].SearchPriorityCount + ' 筆！</span>');

        } else if (TempDropListNowCountSun == 0) {

            //若這次搜尋的筆數為0 就提示查無資料
            DropListTargetEvent.parent().find('.DropListSearchMemo').html('<span style="color:#f00">無資料符合查詢關鍵字！</span>');

        }


        //判斷 選取方塊 是否需要隱藏
        if (DropListTempData[Name].InputBox == false) {
            //隱藏單選及複選的方塊
            DropListTargetEvent.find('input[type="radio"]').hide();
            DropListTargetEvent.find('input[type="checkbox"]').hide();
        };


        //套用 選取筆數 文字
        DropListTargetEvent.parent().find('.DropListNowCountSelect').html(TempDropListNowCountSelect + ' 筆');
        //套用 查詢筆數 文字
        DropListTargetEvent.parent().find('.DropListNowCountSearch').html(TempDropListNowCountSearch + ' 筆');

        //結束後會回到 搜尋功能
        //去執行 "搜尋優先模式時 專用"

    });

};
//指定下拉選單選取
DropListSet = function (Name, Select) {

    var Event = '#' + DropListTempData[Name].ID;

    //套用資料
    DropListTempData[Name].Select = Select;
    DropListTempData[Name].SelectText = [];

    //改變 button 文字
    for (var s = 0; s < DropListTempData[Name].Select.length; s++) {

        for (var g = 0; g < DropListTempData[Name].Data.length; g++) {
            for (var i = 0; i < DropListTempData[Name].Data[g].Option.length; i++) {

                if (DropListTempData[Name].Data[g].Option[i].Val == DropListTempData[Name].Select[s]) {
                    DropListTempData[Name].SelectText.push(DropListTempData[Name].Data[g].Option[i].Text);
                }

            }
        }

    }

    if (DropListTempData[Name].Select.length == 0) {
        $(Event).find('.DropList_span').html(DropListTempData[Name].ButtonText);
    } else {

        if (DropListTempData[Name].SelectText.length > DropListTempData[Name].MultipleSelect && DropListTempData[Name].Type == 'multiple') {

            $(Event).find('.DropList_span').html('選取了 ' + DropListTempData[Name].Select.length + ' 個');

        } else {

            var TempMultipleSelect = [];
            for (var i = 0; i < DropListTempData[Name].SelectText.length; i++) {
                TempMultipleSelect.push(DropListTempData[Name].SelectText[i]);
            }
            $(Event).find('.DropList_span').html(TempMultipleSelect.join('、'));

        }

    }

    if (DropListTempData[Name].Mode == 'list') {
        //判斷如果為單選模式 就只提取最後一個項目 (防呆功能)
        if (DropListTempData[Name].Type == 'single') {
            DropListTempData[Name].Select = [DropListTempData[Name].Select[DropListTempData[Name].Select.length - 1]];
        }

        //先全部清除
        $(Event).find('.DropListTarget input[type="radio"],.DropListTarget input[type="checkbox"]').each(function (index, element) {
            element.checked = false;
            $(Event).find('.DropListTarget .DropListOption:eq(' + index + ')').removeClass('DropListOptionSelectBG');
        });

        //再去尋找選取的項目
        for (var i = 0; i < Select.length; i++) {
            $(Event).find('.DropListTarget input[type="radio"],.DropListTarget input[type="checkbox"]').each(function (index, element) {
                var TempOptgroup = parseInt(element.attributes['optgroup-index'].value);
                var TempOption = parseInt(element.attributes['option-index'].value);

                if (DropListTempData[Name].Data[TempOptgroup].Option[TempOption].Val == Select[i]) {
                    element.checked = true;
                    $(Event).find('.DropListTarget .DropListOption:eq(' + index + ')').addClass('DropListOptionSelectBG');
                }
            });
        }

    }

    //額外新增判斷 如果SelectText找不到任何資料 表示Select內的資料都沒意義 就顯示ButtonText文字 並清空Select
    if (DropListTempData[Name].SelectText.length == 0) {
        DropListTempData[Name].Select = [];
        $(Event).find('.DropList_span').html(DropListTempData[Name].ButtonText);
    }

};
//群組清單
DropListGroupListBtn = function (Event, Name) {

    //此區塊對筆數動畫卡頓影響不大

    //簡寫物件
    var DropListSelectEvent = $(Event).parent().parent();

    //顯示 DropListTarget 區塊
    DropListSelectEvent.find('.DropListTarget').slideDown(200);

    //判斷是否要顯示或隱藏 已選取項目 的群組按鈕
    if (DropListTempData[Name].GroupList == true && DropListTempData[Name].Select.length == 0) {
        DropListSelectEvent.find('.DropListGroupListItemSelectBtn').hide();
    } else {
        DropListSelectEvent.find('.DropListGroupListItemSelectBtn').show();
    }

    //關閉選項區塊
    DropListSelectEvent.find('.DropListOptgroup').slideUp(200);
    //打開群組清單
    DropListSelectEvent.find('.DropListGroupList').slideDown(200);

    //滑動條歸零置頂
    DropListSelectEvent.find('.DropListTarget')[0].scrollTop = 0;

};
//群組清單 項目按鈕
DropListGroupListItemBtn = function (Event, Name, Index) {

    //DropListTarget    $(Event).parent().parent()

    //此區塊對筆數動畫卡頓影響不大

    //簡寫物件
    var DropListTargetEvent = $(Event).parent().parent();

    //關閉群組清單
    DropListTargetEvent.find('.DropListGroupList').slideUp(200);

    if (Index == 'All') {

        //顯示所有標題 和選項
        DropListTargetEvent.find('.DropListOptgroupTitle').show();
        DropListTargetEvent.find('.DropListOption').show();

        //全部顯示
        DropListTargetEvent.find('.DropListOptgroup').slideDown(200);

    } else if (Index == 'Search') {

        //搜尋用全部顯示
        DropListTargetEvent.find('.DropListOptgroup').slideDown(200);

    } else if (Index == 'Select') {

        //已選取項目

        //利用搜尋去執行
        DropListSearch(DropListTargetEvent.parent().find('.DropListSearchInputBtn'), Name, 'GroupListSelect');

        ////若為搜尋優先模式 就要另外執行文字修改
        //if (DropListTempData[Name].Search == true && DropListTempData[Name].SearchPriority == true) {
        //    //套用原始提示
        //    DropListTargetEvent.parent().find('.DropListSearchMemo').html('已選取項目全部顯示：');
        //}

    } else {

        //顯示所有標題 和選項
        DropListTargetEvent.find('.DropListOptgroupTitle').show();
        DropListTargetEvent.find('.DropListOption').show();

        //群組顯示
        DropListTargetEvent.find('.DropListOptgroup:eq(' + Index + ')').slideDown(200);

    }

};
//設定下拉選單啟用/關閉
DropListEnabled = function (Event, Type) {

    //帶入設定變數
    DropListTempData[Event].Enabled = Type;

    //改變按鈕樣式
    var TempID = '#' + Event;

    if (Type == false) {
        $(TempID).find('button').addClass('DropListDisabled');
    } else {
        $(TempID).find('button').removeClass('DropListDisabled');
    }

};



//取得下拉選單選取數值
DropListGet = function (Name) {

    var tempValue = null;

    //判斷模式
    if (DropListTempData[Name].Type == 'single') {

        if (DropListTempData[Name].Select.length > 0 && DropListTempData[Name].SelectText.length > 0) {

            //取得群組名稱
            var tempBreak = false;
            var tempData = DropListTempData[Name].Data;

            for (var g = 0; g < tempData.length; g++) {
                for (var p = 0; p < tempData[g].Option.length; p++) {

                    if (tempData[g].Option[p].Val == DropListTempData[Name].Select[0]) {

                        //套用數值
                        tempValue = {
                            Group: tempData[g].Optgroup,
                            Text: DropListTempData[Name].SelectText[0],
                            Val: DropListTempData[Name].Select[0],
                        };

                        tempBreak = true;
                    }
                    if (tempBreak == true) { break; }
                }
                if (tempBreak == true) { break; }
            }

        }

    } else if (DropListTempData[Name].Type == 'multiple') {

        if (DropListTempData[Name].Select.length > 0 && DropListTempData[Name].SelectText.length > 0) {

            tempValue = [];

            for (var v = 0; v < DropListTempData[Name].Select.length; v++) {

                //取得群組名稱
                var tempBreak = false;
                var tempData = DropListTempData[Name].Data;

                for (var g = 0; g < tempData.length; g++) {
                    for (var p = 0; p < tempData[g].Option.length; p++) {

                        if (tempData[g].Option[p].Val == DropListTempData[Name].Select[v]) {

                            //套用數值
                            tempValue.push({
                                Group: tempData[g].Optgroup,
                                Text: DropListTempData[Name].SelectText[v],
                                Val: DropListTempData[Name].Select[v],
                            });

                            tempBreak = true;
                        }
                        if (tempBreak == true) { break; }
                    }
                    if (tempBreak == true) { break; }
                }

            }

        }

    }

    return tempValue;
};
//修改選填項目參數
DropListSettingChange = function (Name, Setting) {

    //先複製出目前的參數
    var tempSetting = DropListTempData[Name];

    //重新套用
    for (var i in Setting) {
        //排除 ID 項目
        if (i != 'ID') {
            //直接套用
            tempSetting[i] = Setting[i];
        }
    }

    //執行建立
    DropListSetting(tempSetting);

};
//箭頭切換功能
DropListArrowChange = function (Name, Type) {

    //先判斷是啟用還是關閉 (關閉就直接不執行 但是要跳過 list 模式)
    if (DropListTempData[Name].Enabled == false && DropListTempData[Name].Mode != 'list') {
        return;
    }



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



    //套用變數
    var tempData = DropListTempData[Name];

    //判斷有無項目資料 沒有的話就跳過
    if (tempData.DataCount == 0) { return; }

    //尋找目前變數位置
    var indexVal = null;
    if (tempData.Select.length > 0) {
        for (var i = 0; i < tempData.DataArray.length; i++) {
            if (tempData.DataArray[i] == tempData.Select[0]) {
                indexVal = i;
                break;
            }
        }
    }


    //判斷模式
    if (Type == 'left') {

        //如果尚未選取 或是在第一筆的時候 就不執行
        if (indexVal == null || indexVal == 0) {

            //不執行
            return;

        } else {

            //修改數值
            DropListSet(Name, [tempData.DataArray[indexVal - 1]]);
            //執行 OnEnd 函數
            if (DropListTempData[Name].OnEnd != null) {
                DropListTempData[Name].OnEnd(DropListTempData[Name].Select, Name);
            }
            //執行 OnChange 函數
            if (DropListTempData[Name].OnChange != null) {
                DropListTempData[Name].OnChange(DropListTempData[Name].Select, Name);
            }

        }

    } else if (Type == 'right') {

        //如果是在最後一筆的時候 就不執行
        if (indexVal + 1 == tempData.DataArray.length) {

            //不執行
            return;

        } else {

            //如果是尚未選取時 直接指定第一筆
            if (indexVal == null) {
                //修改數值
                DropListSet(Name, [tempData.DataArray[0]]);
                //執行 OnEnd 函數
                if (DropListTempData[Name].OnEnd != null) {
                    DropListTempData[Name].OnEnd(DropListTempData[Name].Select, Name);
                }
                //執行 OnChange 函數
                if (DropListTempData[Name].OnChange != null) {
                    DropListTempData[Name].OnChange(DropListTempData[Name].Select, Name);
                }
                return;
            }

            //修改數值
            DropListSet(Name, [tempData.DataArray[indexVal + 1]]);
            //執行 OnEnd 函數
            if (DropListTempData[Name].OnEnd != null) {
                DropListTempData[Name].OnEnd(DropListTempData[Name].Select, Name);
            }
            //執行 OnChange 函數
            if (DropListTempData[Name].OnChange != null) {
                DropListTempData[Name].OnChange(DropListTempData[Name].Select, Name);
            }

        }

    }

};



//資料製作 輔助函數 (來源資料陣列, 群組欄位名稱(可陣列設定), 選項欄位名稱(可陣列設定), 選項數值欄位名稱(可陣列設定), 選項文字提示(可陣列設定))
DropListDataHelp = function (dataArray, OptgroupText, OptionText, OptionVal, OptionTitle) {

    var Array = [];

    for (var i = 0; i < dataArray.length; i++) {

        //辨別群組key
        dataArray[i]['_OptgroupKey'] = '';
        if (OptgroupText != null && OptgroupText != undefined && OptgroupText != '') {
            if (typeof (OptgroupText) == 'string') {
                dataArray[i]['_OptgroupKey'] = dataArray[i][OptgroupText];
            } else {
                for (var t = 0; t < OptgroupText.length; t++) {
                    if (dataArray[i][OptgroupText[t]] != undefined) {
                        dataArray[i]['_OptgroupKey'] += dataArray[i][OptgroupText[t]];
                    } else {
                        dataArray[i]['_OptgroupKey'] += OptgroupText[t];
                    }
                }
            }
        }

        //辨別選項key
        dataArray[i]['_OptionKey'] = '';
        if (typeof (OptionText) == 'string') {
            dataArray[i]['_OptionKey'] = dataArray[i][OptionText];
        } else {
            for (var t = 0; t < OptionText.length; t++) {
                if (dataArray[i][OptionText[t]] != undefined) {
                    dataArray[i]['_OptionKey'] += dataArray[i][OptionText[t]];
                } else {
                    dataArray[i]['_OptionKey'] += OptionText[t];
                }
            }
        }

        //辨別數值key
        dataArray[i]['_OptionVal'] = '';
        if (typeof (OptionVal) == 'string') {
            dataArray[i]['_OptionVal'] = dataArray[i][OptionVal];
        } else {
            for (var t = 0; t < OptionVal.length; t++) {
                if (dataArray[i][OptionVal[t]] != undefined) {
                    dataArray[i]['_OptionVal'] += dataArray[i][OptionVal[t]];
                } else {
                    dataArray[i]['_OptionVal'] += OptionVal[t];
                }
            }
        }

        //辨別文字提示key
        dataArray[i]['_OptionTitle'] = '';
        if (OptionTitle == null || OptionTitle == undefined) {
            dataArray[i]['_OptionTitle'] = dataArray[i]['_OptionKey'];
        } else if (typeof (OptionTitle) == 'string') {
            dataArray[i]['_OptionTitle'] = dataArray[i][OptionTitle];
        } else {
            for (var t = 0; t < OptionTitle.length; t++) {
                if (dataArray[i][OptionTitle[t]] != undefined) {
                    dataArray[i]['_OptionTitle'] += dataArray[i][OptionTitle[t]];
                } else {
                    dataArray[i]['_OptionTitle'] += OptionTitle[t];
                }
            }
        }

    }


    //填入群組
    if (OptgroupText != null && OptgroupText != '') {
        var tempOptgroup = Enumerable.From(dataArray)
                           .Distinct(function (item) {
                               return item['_OptgroupKey'];
                           })
                           .Select(function (item) {
                               return item;
                           })
                           .ToArray();
        for (var g = 0; g < tempOptgroup.length; g++) {
            Array.push({ Optgroup: tempOptgroup[g]['_OptgroupKey'], Option: [] });
        }
    } else {
        Array = [{ Optgroup: '', Option: [] }];
    }


    //填入選項、文字提示
    for (var d = 0; d < dataArray.length; d++) {
        for (var a = 0; a < Array.length; a++) {
            if (dataArray[d]['_OptgroupKey'] == Array[a].Optgroup) {
                Array[a].Option.push({
                    Text: dataArray[d]['_OptionKey'],
                    Val: dataArray[d]['_OptionVal'],
                    Title: dataArray[d]['_OptionTitle'],
                });
                break;
            }
        }
    }


    return Array;
};



//防止點擊選項時關閉選單
$(document).on('click', '.DropList', function (event) {
    event.stopPropagation();

    //判斷關閉時間選擇器
    if ($('.TimePickSelect').length > 0) {

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
//點擊空白處隱藏選單
$(document).click(function () {

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

});
//手機專用 關閉選單按鈕
$(document).on('click', '.DropListClose', function (event) {

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
});
//ESC 關閉選單
$(document).on('keyup', 'body', function (key_event) {
    if (key_event.keyCode == 27 && $('.DropListSelect').not('.DropListSelect_List').length > 0) {
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
//搜尋確認
$(document).on('keypress', '.DropListSearchInput', function (key_event) {
    if (key_event.keyCode == 13) {
        DropListSearch($(this), $(this).attr('val-name'), 'KeySearch');
        return false;
    }
});



// jQuery 風格使用函數
$.fn.extend({
    //定義下拉選單
    DropSetting: function (Setting) {
        if ($(this).length > 0) {
            if ($(this)[0].id != '') {
                //有 id
                Setting['ID'] = $(this)[0].id;
                DropListSetting(Setting);
            } else {
                //無 id
                console.info('缺乏物件[ID]參數設定！');
            }
        }
    },
    //指定下拉選單選取
    DropSet: function (Val) {
        DropListSet($(this)[0].id, Val);
    },
    //取得下拉選單選取數值
    DropGet: function () {
        return DropListGet($(this)[0].id);
    },
    //設定下拉選單啟用/關閉
    DropEnabled: function (Type) {
        DropListEnabled($(this)[0].id, Type);
    },
    //修改{選填項目}參數
    DropSettingChange: function (Setting) {
        DropListSettingChange($(this)[0].id, Setting);
    },
});
