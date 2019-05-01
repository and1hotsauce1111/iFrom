/*
  Ver 1.4.5

  ★ 標籤語法：

      變數使用方式預設為：@變數名稱  @物件名稱-變數名稱  {@變數名稱}  {@物件名稱-變數名稱}  等四種方式，也可自由定義
                    範例：@row       @tablename-row      {@row}       {@tablename-row}

      tbl-repeat="物件名稱"           ※ 在需要複製的 DOM 物件上加上此標籤，可添加在複數物件上，物件之間必須緊貼並具連續性，
                                         以防止建立 DOM 時產生錯位的問題，帶參數時請使用 "@變數名稱" 或是 "@物件名稱-變數名稱" 帶入，
                                         範例如下：
                                         <tr tbl-repeat="物件名稱">
                                             <td rowspan="2">@row</td>
                                             <td>@value</td>
                                         </tr>
                                         <tr tbl-repeat="物件名稱">
                                             <td colspan="2">
                                                 <button onclick="自訂函數(TableListGetItem('物件名稱',@index))" type="button">按鈕</button>
                                             </td>
                                         </tr>

      tbl-build="物件名稱-NoData"     ※ 當查無資料時，所顯示之物件，此為唯一物件，範例如下：
                                         <tr tbl-build="物件名稱-NoData">
                                             <td colspan="2">查無資料</td>
                                         </tr>

      tbl-build="物件名稱-PageDrop"   ※ 換頁下拉選單容器，此為唯一物件，範例：<div tbl-build="物件名稱-PageDrop"></div>

      tbl-build="物件名稱-PerDrop"    ※ 每頁筆數下拉選單容器，此為唯一物件，範例：<div tbl-build="物件名稱-PerDrop"></div>

      tbl-build="物件名稱-Count"      ※ 查詢到的資料總筆數，此為唯一物件，範例：<span tbl-build="物件名稱-Count"></span>

      tbl-build="物件名稱-RunBtn"     ※ 執行按鈕，可複數添加，範例如下：
                                         <button tbl-build="物件名稱-RunBtn" type="button" class="button btn_miku">查詢</button>

      tbl-keep="物件名稱-Enter"       ※ 用於監視輸入欄位，在按下 Enter 時自動執行查詢功能，可複數添加，範例如下：
                                         <input tbl-keep="物件名稱-Enter" type="text" />

      tbl-keep="物件名稱-CheckAll"    ※ 用於流水號全選(勾選)元件的監視與功能響應，僅可用於流水號操作，範例如下：
                                         <input tbl-keep="物件名稱-CheckAll" type="checkbox" />

      tbl-keep="物件名稱-CheckBox"    ※ 用於流水號勾選元件的監視，僅可用於流水號操作，亦可用於單選 (radio)，範例如下：
                                         <input tbl-keep="物件名稱-CheckBox" type="radio" />
                                         <input tbl-keep="物件名稱-CheckBox" type="checkbox" />

      tbl-show="判斷式"               ※ 此為全域判斷功能，也可帶入函數使用回傳 true 或 false 即可，
                                         若需要判斷之變數格式為字串，必須在頭尾加上 ' 符號，範例如下：
                                         <td tbl-show="'@string'=='字串'">@string</td>
      
===================================================================================================================================

  ★ 調用函數：

      定義列表套件          >  TableListBuild({ 設定參數 })               ※ 設定參數在下一階段說明
      執行查詢              >  TableListRun('物件名稱')                   ※ 定義列表套件完成時就會自動執行
      前往指定頁數          >  TableListSetPage('物件名稱',頁數)          ※ 若超過最大頁數，就會到最後一頁
      取得指定位置資料      >  TableListGetItem('物件名稱', @index)       ※ 取得單筆資料，@index 也可為 @物件名稱-index (提供按鈕傳輸資料所使用)
      取得當前所勾選的資料  >  var array = TableListGetCheck('物件名稱')  ※ 資料以陣列 (array) 形式回傳
      執行全域顯示判斷      >  TableListApply()                           ※ 配合 tbl-show 所使用，通常放在 OnEnd 函數中做使用

===================================================================================================================================

  ★ 設定參數 (*為必填)：

      *物件名稱           Name       ※ 輸入字串名稱
      *取得查詢參數       GetSearch  ※ 請帶 function (ReSearch) { 還需判斷Recover功能之套用詳見範例 return Search; }
                                        此處 ReSearch 等同於 Search 參數
      *取得資料總筆數     GetCount   ※ 請帶 function (Option) { return Count; }
                                        此處 Option 變數僅包含 Search 參數
                                        執行 Ajax 時請使用同步調用 (async = false)
      *執行資料撈取       GetData    ※ 請帶 function (Option) { return DataArray; }
                                        此處 Option 變數包含 Offset、Fetch、NowPage、PerPage、Search 等參數
                                        執行 Ajax 時請使用同步調用 (async = false)
                                        回傳之 DataArray 陣列中資料須保留變數名稱供套件使用：{@row}、{@index}
      開始執行函數        OnStart    ※ 請帶 function () { }
      結束執行函數        OnEnd      ※ 請帶 function () { }

      起始所在頁數        NowPage (預設:1)                    ※ 若開啟 Recover 功能則此設定會優先 Recover 紀錄之參數
      預設每頁筆數        PerPage (預設:10)                   ※ 若開啟 Recover 功能則此設定會優先 Recover 紀錄之參數
      狀態還原功能開關    Recover (預設:false)                ※ 若開啟則使用者在返回頁面的時候會還原上一次的查詢狀態

      自定義換頁文字      PageFormat (預設:'第 Page 頁')      ※ 其中 Page 為固定參數不可移除
      自定義每頁文字      PerFormat (預設:'每頁顯示 Per 筆')  ※ 其中 Per 為固定參數不可移除
      設定每頁筆數結構    PerSet (預設:[10, 20, 30, 50, 100, 200, 500, 1000])
      自定義套用語法格式  StrFormat (預設:[{ Start: '{@', End: '}' }, { Start: '@', End: '' }])
                                    ※ 請注意陣列中之自定義語法，必須由複雜至精簡，才能正常運作

===================================================================================================================================

  ★ 定義語法範例： ( 請注意於內部函數所執行之 Ajax 都必須以同步方式執行 async = false )

      TableListBuild({
          Name: '變數名稱',
          NowPage: 1,
          PerPage: 10,
          PageFormat: '第 Page 頁',    
          PerFormat: '每頁顯示 Per 筆',
          PerSet: [10, 20, 30, 50, 100, 200, 500, 1000],
          Recover: true,
          OnStart: function () {
              //自動執行前執行之函數
              //執行讀取動畫 (範例)
              NProgress.start();
          },
          GetSearch: function (ReSearch) {
              //開啟 Recover 功能時需要將記錄的資料套用回介面上的物件
              if (ReSearch) {
                  $('#KeyWord').val(ReSearch.KeyWord);
                  $('#KeyWord2').val(ReSearch.KeyWord2);
              }
              //讀取介面上的物件數值傳送到 Search 變數之中
              var Search = {
                  KeyWord: $('#KeyWord').val(),
                  KeyWord2: $('#KeyWord2').val(),
              }
              return Search;
          },
          GetCount: function (Option) {
              //執行讀取動畫 (範例)
              NProgress.start();
              //設定Ajax要傳輸的資料 (此處須包含 Search 參數才會撈出正確的總筆數)
              var tempData = {
                  Type: 'GetCount',
                  KeyWord: Option.Search.KeyWord,
                  KeyWord2: Option.Search.KeyWord2,
              };
              var Count = tools.ajax(tempData, ashxPath).Count;
              return Count;
          },
          GetData: function (Option) {
              //執行讀取動畫 (範例)
              NProgress.start();
              //設定Ajax要傳輸的資料 (其中 Offset、Fetch 為 SQL 查詢資料時所需要之參數 )
              var tempData = {
                  Type: 'GetData',
                  Offset: Option.Offset,
                  Fetch: Option.Fetch,
                  KeyWord: Option.Search.KeyWord,
                  KeyWord2: Option.Search.KeyWord2,
              };
              var DataArray = tools.ajax(tempData, ashxPath).Data;
              return DataArray;
          },
          OnEnd: function () {
              //完成查詢時所執行之回調函數放此處
              //結束讀取動畫 (範例)
              NProgress.done();
          },
      });

===================================================================================================================================
*/


//宣告專用變數儲存物件
var TableListTempData = {};


//資料驗證/定義預設值/型態檢查
TableListSettingCheck = function (Setting) {

    Setting.Success = true;

    //必填項目檢查
    if (!Setting) { console.info('缺乏參數[Setting]設定！'); Setting.Success = false; };
    if (!Setting.Name) { console.info('缺乏參數[Name]設定！'); Setting.Success = false; };
    if (!Setting.GetCount) { console.info('缺乏函數[GetCount]設定！'); Setting.Success = false; };
    if (!Setting.GetSearch) { console.info('缺乏函數[GetSearch]設定！'); Setting.Success = false; };
    if (!Setting.GetData) { console.info('缺乏函數[GetData]設定！'); Setting.Success = false; };

    //定義預設值
    Setting.DataArray = Setting.DataArray ? Setting.DataArray : [];                            //撈取資料前先套用空白資料陣列
    Setting.Count = Setting.Count ? Setting.Count : 0;                                         //撈取資料前先套用 0
    Setting.AllPage = Setting.AllPage ? Setting.AllPage : 1;                                   //撈取資料前先套用 1
    Setting.DomHtml = Setting.DomHtml ? Setting.DomHtml : {};                                  //撈取資料前先套用空白物件
    Setting.Option = Setting.Option ? Setting.Option : {};                                     //撈取資料前先套用空白物件
    Setting.Search = Setting.Search ? Setting.Search : null;                                   //撈取資料前先套用空值
    Setting.NowPage = Setting.NowPage ? Setting.NowPage : 1;                                   //起始所在頁數
    Setting.PerPage = Setting.PerPage ? Setting.PerPage : 10;                                  //預設每頁筆數
    Setting.PageFormat = Setting.PageFormat ? Setting.PageFormat : '第 Page 頁';               //自定義 換頁文字
    Setting.PerFormat = Setting.PerFormat ? Setting.PerFormat : '每頁顯示 Per 筆';             //自定義 每頁文字
    Setting.PerSet = Setting.PerSet ? Setting.PerSet : [10, 20, 30, 50, 100, 200, 500, 1000];  //設定每頁筆數結構
    Setting.Recover = Setting.Recover ? Setting.Recover : false;                               //紀錄查詢及換頁狀態

    //定義預設值 自定義 套用語法格式
    Setting.StrFormat = Setting.StrFormat ? Setting.StrFormat : [
        { Start: '{@', End: '}' },
        { Start: '@', End: '' },
    ];

    //型態檢查
    if (typeof (Setting) != 'object') { console.info('參數[Setting]格式錯誤！必須為 object'); Setting.Success = false; };
    if (typeof (Setting.Name) != 'string') { console.info('參數[Name]格式錯誤！必須為 string'); Setting.Success = false; };
    if (typeof (Setting.GetCount) != 'function') { console.info('函數[GetCount]格式錯誤！必須為 function'); Setting.Success = false; };
    if (typeof (Setting.GetSearch) != 'function') { console.info('函數[GetSearch]格式錯誤！必須為 function'); Setting.Success = false; };
    if (typeof (Setting.GetData) != 'function') { console.info('函數[GetData]格式錯誤！必須為 function'); Setting.Success = false; };
    if (typeof (Setting.NowPage) != 'number') { console.info('參數[NowPage]格式錯誤！必須為 number'); Setting.Success = false; };
    if (typeof (Setting.PerPage) != 'number') { console.info('參數[PerPage]格式錯誤！必須為 number'); Setting.Success = false; };
    if (typeof (Setting.PageFormat) != 'string') { console.info('參數[PageFormat]格式錯誤！必須為 string'); Setting.Success = false; };
    if (typeof (Setting.PerFormat) != 'string') { console.info('參數[PerFormat]格式錯誤！必須為 string'); Setting.Success = false; };
    if (typeof (Setting.PerSet) != 'object') { console.info('參數[PerSet]格式錯誤！必須為 array'); Setting.Success = false; };
    if (typeof (Setting.Recover) != 'boolean') { console.info('參數[PerSet]格式錯誤！必須為 boolean'); Setting.Success = false; };

    //下拉選單ID設定
    Setting.PageDropID = Setting.PageDropID ? Setting.PageDropID : 'TableList_' + Setting.Name + '_PageDrop';
    Setting.PerDropID = Setting.PerDropID ? Setting.PerDropID : 'TableList_' + Setting.Name + '_PerDrop';

    //恢復記錄過的資料 ( Recover相關 )
    if (Setting.Recover == true && TableListRecoverLoad(Setting.Name) != null) {
        var StorageLoad = TableListRecoverLoad(Setting.Name);
        Setting.Count = StorageLoad.Count;
        Setting.AllPage = StorageLoad.AllPage;
        Setting.NowPage = StorageLoad.NowPage;
        Setting.PerPage = StorageLoad.PerPage;
    }

    return Setting;
};
//定義物件
TableListBuild = function (Setting) {

    //等待所有 js 檔案完全執行完畢才開始定義 防止跟其他架框模組相衝 (angularjs)
    $(function () {

        //資料驗證
        Setting = TableListSettingCheck(Setting);
        if (Setting.Success == false) { return; }


        //轉換替代名稱
        var Name = Setting.Name;


        //存入資料物件矩陣
        TableListTempData[Name] = Setting;


        //取得 Name 物件 DOM 的 Html (顯示判斷執行過查詢後才跑)
        var tempXPath = TableListGetXPath('repeat', Name, null);
        TableListGetDomHtml(Name, 'Data', tempXPath);


        //取得 NoData 擴充物件 DOM 的 Html (顯示判斷執行過查詢後才跑)
        tempXPath = TableListGetXPath('build', Name, 'NoData');
        TableListGetDomHtml(Name, 'NoData', tempXPath);


        //擴充物件 PageDrop 建立
        TableListPluginPageDrop(Name);
        //擴充物件 PerDrop 建立
        TableListPluginPerDrop(Name);


        //預先套用資料筆數 (這樣在執行前畫面的筆數上才不會出現空白無資料)
        tempXPath = TableListGetXPath('build', Name, 'Count');
        $(tempXPath).html(TableListTempData[Name].Count);


        //設置查詢按鈕 onclick 事件
        tempXPath = TableListGetXPath('build', Name, 'RunBtn');
        $(tempXPath).attr('onclick', "TableListRun('" + Name + "')");


        //勾選元件 CheckAll 全選按鈕 onchange 事件
        tempXPath = TableListGetXPath('keep', Name, 'CheckAll');
        $(tempXPath).attr('onchange', "TableListCheckAll('" + Name + "')");


        //設置鍵盤監視 (用在關鍵字查詢時的 Enter 事件)
        tempXPath = TableListGetXPath('keep', Name, 'Enter');
        $(tempXPath).keyup(function (event) {
            if (event.keyCode == 13) {
                TableListRun(Name);
            }
        });


        //執行開始函數
        if (typeof (TableListTempData[Name].OnStart) == 'function') {
            TableListTempData[Name].OnStart();
        }


        //主動執行
        TableListRun(Name, 'First');

    });

};
//執行查詢
TableListRun = function (Name, Type) {

    //換頁、切換每頁筆數 執行時，不執行取得總筆數(GetCount)以及關鍵字取得的函數(GetSearch)
    if (Type != 'DropSkip') {

        //取得查詢條件 若啟動 Recover 功能 則提供上一次的 Option.Search 紀錄 ( Recover相關 )
        if (Type == 'First' &&
            TableListTempData[Name].Recover == true &&
            TableListRecoverLoad(Name) != null) {

            TableListTempData[Name].Search = TableListTempData[Name].GetSearch(TableListRecoverLoad(Name).Search);

        } else {

            TableListTempData[Name].Search = TableListTempData[Name].GetSearch();

        }


        //執行函數 取得總筆數 (提供 Search 參數)
        TableListTempData[Name].Count = TableListTempData[Name].GetCount({
            Search: TableListTempData[Name].Search,
        });


        //正常查詢 非首次執行 且不是指定換頁時 需要強迫返回第1頁 ( Recover相關 )
        if (Type != 'First' && Type != 'SetPage') {
            TableListTempData[Name].NowPage = 1;
        }

    }


    //判斷是否超過最大頁數 超過就到最後一頁
    if (TableListTempData[Name].NowPage > TableListTempData[Name].AllPage) {
        TableListTempData[Name].NowPage = TableListTempData[Name].AllPage;
    }


    //執行資料撈取 (提供 Option 變數)
    TableListTempData[Name].Option = {
        Offset: (TableListTempData[Name].NowPage - 1) * TableListTempData[Name].PerPage,
        Fetch: TableListTempData[Name].PerPage,
        NowPage: TableListTempData[Name].NowPage,
        PerPage: TableListTempData[Name].PerPage,
        //AllPage: TableListTempData[Name].AllPage,
        //Count: TableListTempData[Name].Count,
        Search: TableListTempData[Name].Search,
    };
    TableListTempData[Name].DataArray = TableListTempData[Name].GetData(TableListTempData[Name].Option);
    //套用保留變數 ( 同時記錄最大的 row 讓後面的 Count 可以驗證 )
    var maxRow = 0;
    for (var i = 0; i < TableListTempData[Name].DataArray.length; i++) {

        TableListTempData[Name].DataArray[i]['row'] = (TableListTempData[Name].NowPage * TableListTempData[Name].PerPage) + (i + 1) - TableListTempData[Name].PerPage;
        TableListTempData[Name].DataArray[i]['index'] = i;

        //記錄最大的 row
        maxRow = TableListTempData[Name].DataArray[i]['row'];

    }


    //再次檢查 Count 總筆數是否正確 若不正確就同步
    if (maxRow > TableListTempData[Name].Count) {
        TableListTempData[Name].Count = maxRow;
    }


    //套用資料總筆數
    tempXPath = TableListGetXPath('build', Name, 'Count');
    $(tempXPath).html(TableListTempData[Name].Count);


    //計算頁數
    TableListTempData[Name].AllPage = Math.ceil(TableListTempData[Name].Count / TableListTempData[Name].PerPage)
    TableListTempData[Name].AllPage = TableListTempData[Name].AllPage == 0 ? 1 : TableListTempData[Name].AllPage;


    //擴充物件 PageDrop 建立
    TableListPluginPageDrop(Name);
    //擴充物件 PerDrop 建立
    TableListPluginPerDrop(Name);


    //渲染 DomHtml 函數
    TableListDomHtmlBuild(Name);


    //儲存查詢操作狀態 (不管有沒有開啟都記錄 才可以動態修改)
    TableListRecoverSave(Name);


    //擴充物件 NoData 顯示判斷
    TableListPluginNoData(Name);


    //還原勾選元件 CheckAll 的勾選狀態
    var EvenTag = TableListGetXPath('keep', Name, 'CheckAll');
    $(EvenTag).prop('checked', false);


    //執行結束函數
    if (typeof (TableListTempData[Name].OnEnd) == 'function') {
        TableListTempData[Name].OnEnd();
    }

};
//前往指定頁數
TableListSetPage = function (Name, Page) {

    //更改換頁下拉選單資訊
    DropListSet(TableListTempData[Name].PageDropID, [Page]);
    TableListTempData[Name].NowPage = Page;

    //執行查詢
    TableListRun(Name, 'SetPage');

};


//渲染 DomHtml 函數
TableListDomHtmlBuild = function (Name) {

    //先移除物件 (才不會重複置入)
    var tempXPath = TableListGetXPath('repeat', Name, null);
    $(tempXPath).remove();
    tempXPath = TableListGetXPath('build', Name, 'NoData');
    $(tempXPath).remove();


    //渲染資料陣列到畫面上 (取得父容器位置)
    var EvenTag = TableListGetParentXPath('Data', Name);


    //迴圈 資料陣列
    for (var d = 0; d < TableListTempData[Name].DataArray.length; d++) {

        //迴圈 DomHtml 模組
        for (var m = 0; m < TableListTempData[Name].DomHtml.Data.length; m++) {

            //擷取 Html
            var tempHtml = TableListTempData[Name].DomHtml.Data[m];

            //過濾資料陣列變數
            var tempStr = [];
            for (var str in TableListTempData[Name].DataArray[d]) {
                tempStr.push({
                    Str: str,
                    Length: str.length,
                });
            }
            //文字排序 由長至短
            tempStr.sort(function (a, b) { return b['Length'] - a['Length']; });

            //迴圈 資料陣列變數
            for (var i = 0; i < tempStr.length; i++) {

                //取出資料名稱
                var str = tempStr[i].Str;

                for (var s = 0; s < TableListTempData[Name].StrFormat.length; s++) {

                    //取出頭尾取代字串
                    var start = TableListTempData[Name].StrFormat[s].Start;
                    var end = TableListTempData[Name].StrFormat[s].End;

                    //製作標籤 (單純的標籤，例如：{@row})
                    var regex = new RegExp(start + str + end, 'g');
                    //取代資料
                    tempHtml = tempHtml.replace(regex, TableListTempData[Name].DataArray[d][str]);

                    //製作標籤 (複合式標籤，例如：{@物件名稱-row})
                    regex = new RegExp(start + Name + '-' + str + end, 'g');
                    //取代資料
                    tempHtml = tempHtml.replace(regex, TableListTempData[Name].DataArray[d][str]);

                }

            }

            //推入資料
            $(EvenTag).append(tempHtml);

        }

    }

};


//擴充物件 NoData 顯示判斷
TableListPluginNoData = function (Name) {

    //使用 XPath 選取 DOM 物件 (包含父容器)
    var ParentEvenTag = TableListGetParentXPath('NoData', Name);
    var EvenTag = TableListGetXPath('build', Name, 'NoData');

    if (TableListTempData[Name].DataArray.length == 0) {
        $(ParentEvenTag).append(TableListTempData[Name].DomHtml.NoData);
    } else {
        $(EvenTag).remove();
    }

};
//擴充物件 PageDrop 建立
TableListPluginPageDrop = function (Name) {

    //使用 XPath 選取 DOM 物件
    var EvenTag = TableListGetXPath('build', Name, 'PageDrop');
    if ($(EvenTag).length == 0) { return; }


    //容器設定 (須配合套件 _dropdown2.js)
    $(EvenTag).attr('id', TableListTempData[Name].PageDropID);
    $(EvenTag).addClass('DropList');


    //若超過300頁 就開啟查詢優先模式
    var TempSearchPriority = false;
    if (TableListTempData[Name].AllPage >= 300) {
        TempSearchPriority = true;
    }


    //取得自定義文字設定
    var TempFormat = TableListTempData[Name].PageFormat.split('Page');
    var TempFormatA = '';
    var TempFormatB = '';
    TempFormatA = TempFormat[0];
    TempFormatB = TempFormat[1];


    //製作下拉選單變數
    var TempData = [{ Optgroup: '', Option: [] }];
    for (var i = 0; i < TableListTempData[Name].AllPage; i++) {
        TempData[0].Option.push({
            Text: TempFormatA + (i + 1) + TempFormatB,
            Val: (i + 1)
        });
    }


    ////超過300頁 就開啟群組模式 --- 暫時不使用
    //var CheckGroupList = false;
    //var TempData = [];
    //if (TableListTempData[Name].AllPage >= 300) {
    //
    //    //超過300筆就使用群組分組
    //    CheckGroupList = true;
    //
    //    var tempRange = 100;
    //    var tempCount = Math.ceil(TableListTempData[Name].AllPage / tempRange);
    //
    //    for (var g = 1; g <= tempCount; g++) {
    //
    //        var tempStart = g * tempRange - tempRange + 1;
    //        var tempEnd = ((g + 1) * tempRange - tempRange) >= TableListTempData[Name].AllPage ? TableListTempData[Name].AllPage : ((g + 1) * tempRange - tempRange);
    //
    //        var tempOption = [];
    //        for (var i = 0; i < TableListTempData[Name].AllPage; i++) {
    //            if ((i + 1) >= tempStart && (i + 1) <= tempEnd) {
    //                tempOption.push({
    //                    Text: TempFormatA + (i + 1) + TempFormatB,
    //                    Val: (i + 1)
    //                });
    //            }
    //        }
    //
    //        TempData.push({
    //            Optgroup: tempStart + ' 至 ' + tempEnd,
    //            Option: tempOption
    //        })
    //
    //    }
    //
    //} else {
    //
    //    //沒超過就正常套用
    //    TempData = [{ Optgroup: '', Option: [] }];
    //    for (var i = 0; i < TableListTempData[Name].AllPage; i++) {
    //        TempData[0].Option.push({
    //            Text: TempFormatA + (i + 1) + TempFormatB,
    //            Val: (i + 1)
    //        });
    //    }
    //
    //}


    //建立下拉選單
    DropListSetting({
        ID: TableListTempData[Name].PageDropID,
        Data: TempData,
        Select: [TableListTempData[Name].NowPage],
        Class: 'button btn_white',
        ArrowChange: true,
        ArrowClass: 'button btn_white',
        Search: true,
        //GroupList: CheckGroupList,
        //GroupListStart: CheckGroupList,
        SearchPriority: TempSearchPriority,
        OnEnd: function (Select) {

            //套用資料
            TableListTempData[Name].NowPage = Select[0];

            //執行 Run 函數 (換頁也必須跑 GetCount 不然可能跟真實資料有差異)
            TableListRun(Name, 'DropSkip');

        }
    });

};
//擴充物件 PerDrop 建立
TableListPluginPerDrop = function (Name) {

    //使用 XPath 選取 DOM 物件
    var EvenTag = TableListGetXPath('build', Name, 'PerDrop');
    if ($(EvenTag).length == 0) { return; }


    //容器設定 (須配合套件 _dropdown2.js)
    $(EvenTag).attr('id', TableListTempData[Name].PerDropID);
    $(EvenTag).addClass('DropList');


    //取得自定義文字設定
    var TempFormat = TableListTempData[Name].PerFormat.split('Per');
    var TempFormatA = '';
    var TempFormatB = '';
    TempFormatA = TempFormat[0];
    TempFormatB = TempFormat[1];


    //製作下拉選單變數
    var TempData = [{ Optgroup: '', Option: [] }];
    for (var i = 0; i < TableListTempData[Name].PerSet.length; i++) {
        TempData[0].Option.push({
            Text: TempFormatA + TableListTempData[Name].PerSet[i] + TempFormatB,
            Val: TableListTempData[Name].PerSet[i]
        });
    }


    //檢查 PerPage 是否有在 PerSet 設定之中
    var tempCheck = false;
    for (var i = 0; i < TableListTempData[Name].PerSet.length; i++) {
        if (TableListTempData[Name].PerPage == TableListTempData[Name].PerSet[i]) {
            tempCheck = true;
            break;
        }
    }
    TableListTempData[Name].PerPage = tempCheck ? TableListTempData[Name].PerPage : TableListTempData[Name].PerSet[0]


    //建立下拉選單
    DropListSetting({
        ID: TableListTempData[Name].PerDropID,
        Data: TempData,
        Select: [TableListTempData[Name].PerPage],
        Class: 'button btn_white',
        OnEnd: function (Select) {

            //回到第一頁
            TableListTempData[Name].NowPage = 1;
            //套用資料
            TableListTempData[Name].PerPage = Select[0];

            //執行 Run 函數
            TableListRun(Name, 'DropSkip');

        }
    });

};


//使用 XPath 選取 DOM 物件函數
TableListGetXPath = function (Mode, Name, XPath) {

    var tempXPath = XPath ? '-' + XPath : '';

    var EvenTag = "[tbl-" + Mode + "='" + Name + tempXPath + "'],[data-tbl-" + Mode + "='" + Name + tempXPath + "']";

    return EvenTag;
};
//使用 XPath 選取父容器 DOM 物件函數
TableListGetParentXPath = function (ObjectName, Name) {

    var EvenTag = "[tbl-parent-" + ObjectName.toLowerCase() + "='" + Name + "'],[data-tbl-parent-" + ObjectName.toLowerCase() + "='" + Name + "']";

    return EvenTag;
};
//取得物件 DOM 的 Html 套用至矩資料物件陣中
TableListGetDomHtml = function (Name, ObjectName, EvenTag) {

    var EvenArray = $(EvenTag);

    if (EvenArray.length > 0) {

        //添加父容器標籤
        $(EvenTag).parent().attr('tbl-parent-' + ObjectName, Name);

        //宣告容器
        TableListTempData[Name].DomHtml[ObjectName] = [];

        //擷取 Html
        for (var i = 0; i < EvenArray.length; i++) {
            TableListTempData[Name].DomHtml[ObjectName].push(EvenArray[i].outerHTML);
        }

        //移除物件
        EvenArray.remove();

    } else {

        //返回空值
        TableListTempData[Name].DomHtml[ObjectName] = null;

    }

};


//Recover儲存功能
TableListRecoverSave = function (Name) {
    var StorageSave = TableListTempData[Name].Option;
    sessionStorage.setItem('TableListRecoverSave' + Name, JSON.stringify(StorageSave));
};
//Recover讀取功能
TableListRecoverLoad = function (Name) {
    var StorageLoad = jQuery.parseJSON(sessionStorage.getItem('TableListRecoverSave' + Name));
    return StorageLoad;
};


//取得指定位置資料
TableListGetItem = function (Name, Index) {
    return TableListTempData[Name].DataArray[Index];
};
//勾選元件 CheckAll 全選監視
TableListCheckAll = function (Name) {

    //取得全選元件的勾選狀態
    var EvenTag = TableListGetXPath('keep', Name, 'CheckAll');
    var tempAllCheck = $(EvenTag).prop('checked');

    //將當前所有 CheckBox 元件與自身同步
    EvenTag = TableListGetXPath('keep', Name, 'CheckBox');
    $(EvenTag).each(function (index, element) {
        element.checked = tempAllCheck;
    });

};
//取得所有有勾選的 CheckBox 資料
TableListGetCheck = function (Name) {

    var tempArray = [];

    var EvenTag = TableListGetXPath('keep', Name, 'CheckBox');

    $(EvenTag).each(function (index, element) {
        if (element.checked) {
            tempArray.push(TableListTempData[Name].DataArray[index]);
        }
    });

    return tempArray;
};

//全域功能 判斷顯示 ( 目前只支援 tbl-show )
TableListApply = function () {

    //取得畫面上所有 tbl-show 物件
    var EvenTag = "[tbl-show],[data-tbl-show]";

    $(EvenTag).each(function (index, element) {

        var check = '';

        if ($(element).attr('tbl-show')) {
            check = $(element).attr('tbl-show');
        } else if ($(element).attr('data-tbl-show')) {
            check = $(element).attr('data-tbl-show');
        }

        if (eval(check)) {
            $(element).show();
        } else {
            $(element).hide();
        }

    });

};