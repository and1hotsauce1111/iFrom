/*
  視覺化模組 Ver 1.7.15

  Setting 內可設定：置頂欄位顯示/隱藏               HeaderDisplay         (預設：true)
                    左側選單顯示/隱藏               LeftDisplay           (預設：true)
                    左側選單選取                    LeftSelect            (預設：'')    ※設定請帶入 select-val 的字串值
                    左側選單群組預設縮放            LeftToggle            (預設：true)  ※設定請帶入 true 全開、false 全關 或 index 陣列，例：[1,2,3] 或 ['select-val的字串值','select-val的字串值']
                    左側選單群組預設縮放圖示        LeftToggleIconCss     (預設：{ Open: 'fa-caret-down', Close: 'fa-caret-left' })
                    左側選單按鈕單獨顯示/隱藏       LeftBtnDisplay        (預設：true)  ※CloseMenuWidth 就會控制是否要顯示，此參數可自行斟酌活用
                    副選單顯示/隱藏                 DeputyDisplay         (預設：true)
                    副選單選取                      DeputySelect          (預設：'')    ※設定請帶入 select-val 的字串值
                    內容區塊顯示/隱藏               ContentDisplay        (預設：true)
                    宣告欄位顯示/隱藏               CopyrightDisplay      (預設：true)
                    內容區塊各個解析度外距尺寸      ContentBoxMargin      (預設：{ XXL: 300, XL: 200, L: 150, M: 100, S: 50 })
                    觸發關閉左側選單解析度(含以下)  CloseMenuWidth        (預設：1023)  ※設為 0 就表示任何解析度下都不隱藏左側選單，且會自動隱藏選單按鈕
                    自動運算 ContentBoxHtml 寬度    ContentBoxHtmlWidth   (預設：true)  ※若關閉則可經由 DOM 自身的 style 或 class 自行設定寬度
                    設定讀取進度條動畫樣式          NProgressEasing       (預設：'ease')
                    設定讀取進度條動畫速度          NProgressSpeed        (預設：300)
                    指定讀取進度條容器              NProgressParent       (預設：'#HeaderBox')
                    讀取進度 icon 顯示/隱藏         NProgressShowSpinner  (預設：false)

  ※左側選單及副選單，若超過可顯示範圍，分別將會出現直向及橫向滾動條，但目前不會自動調整位置

  ※左側選單及副選單，若要使用下拉選單的話，僅可使用內建的 select option 才可以，dropdown 套件的選單會被遮罩 (因為要產生滾動條的緣故)，
    左側選單基本上不會使用到，副選單一定要使用的話，可將最下方 "套用滑動條插件" 整個部分的程式碼註解掉，然後將 css 文件中 #DeputyBoxInset
    的 overflow-x 跟 overflow-y 屬性都註解掉即可，但同時也請注意製作網頁時副選單總按鈕寬度要考慮行動裝置顯示問題

  ※左側選單總寬度 (寬度+內距) 建議不超過 300px，在手機裝置上會有較好的視覺表現

  以下為可調用函數
  定義介面建立                 >  VisualModule({選填項目})
  重新綁定選單 Hover 動畫      >  VisualModuleHoverBuild()
  指定副選單選取               >  VisualModuleDeputySelect('select-val的字串值')
  指定左側選單選取             >  VisualModuleLeftSelect('select-val的字串值')
  重新整理自適應介面           >  VisualModuleResize()
  設定全局 alert 視窗按鈕樣式  >  VisualModuleAlertStyle('按鈕樣式css')
  控制左側選單群組縮放         >  VisualModuleLeftToggle(設定參數)  ※設定請帶入 true 全開、false 全關 或 index 陣列，例：[1,2,3] 或 ['select-val的字串值','select-val的字串值']
*/

//定義介面建立
var tempVisualModuleLeftToggleIconCss;
VisualModule = function (Setting) {

    //=================================== 基礎設定 ===================================
    //預設值賦予
    if (!Setting) {
        Setting = {};
    }
    //置頂欄位顯示/隱藏
    if (Setting.HeaderDisplay == undefined) { Setting.HeaderDisplay = true; }
    //左側選單顯示/隱藏
    if (Setting.LeftDisplay == undefined) { Setting.LeftDisplay = true; }
    //左側選單選取
    if (Setting.LeftSelect == undefined) { Setting.LeftSelect = ''; }
    //左側選單群組預設縮放
    if (Setting.LeftToggle == undefined) { Setting.LeftToggle = true; }
    //左側選單群組預設縮放圖示
    if (Setting.LeftToggleIconCss == undefined) {
        Setting.LeftToggleIconCss = { Open: 'fa-caret-down', Close: 'fa-caret-left' };
        tempVisualModuleLeftToggleIconCss = { Open: 'fa-caret-down', Close: 'fa-caret-left' };
    }
    //左側選單按鈕單獨顯示/隱藏
    if (Setting.LeftBtnDisplay == undefined) { Setting.LeftBtnDisplay = true; }
    //副選單顯示/隱藏
    if (Setting.DeputyDisplay == undefined) { Setting.DeputyDisplay = true; }
    //副選單選取
    if (Setting.DeputySelect == undefined) { Setting.DeputySelect = ''; }
    //內容區塊顯示/隱藏
    if (Setting.ContentDisplay == undefined) { Setting.ContentDisplay = true; }
    //宣告欄位顯示/隱藏
    if (Setting.CopyrightDisplay == undefined) { Setting.CopyrightDisplay = true; }
    //內容區塊各個解析度外距尺寸
    if (Setting.ContentBoxMargin == undefined) { Setting.ContentBoxMargin = { XXL: 300, XL: 200, L: 150, M: 100, S: 50 }; }
    //觸發關閉左側選單解析度
    if (Setting.CloseMenuWidth == undefined) { Setting.CloseMenuWidth = 1023; }
    //自動運算 ContentBoxHtml 總寬度
    if (Setting.ContentBoxHtmlWidth == undefined) { Setting.ContentBoxHtmlWidth = true; }

    //設定讀取進度條動畫樣式
    if (Setting.NProgressEasing == undefined) { Setting.NProgressEasing = 'ease'; }
    //設定讀取進度條動畫速度
    if (Setting.NProgressSpeed == undefined) { Setting.NProgressSpeed = 300; }
    //指定讀取進度條容器
    if (Setting.NProgressParent == undefined) { Setting.NProgressParent = '#HeaderBox'; }
    //讀取進度 icon 顯示/隱藏
    if (Setting.NProgressShowSpinner == undefined) { Setting.NProgressShowSpinner = false; }



    //針對行動裝置 監控螢幕是否翻轉 的變數
    var TempWindowWidth = 0;


    //================================ 套用及開啟設定 ================================

    //判斷 左側選單 hover 樣式，若為電腦版時則套用
    if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
        $('#LeftMenuInset .LeftMenuBtn').addClass('LeftMenuBtnHover');
        $('#DeputyBoxInset .DeputyBoxBtn').addClass('DeputyBoxBtnHover');
    }
    //左側選單 縮放函數
    LeftMenuGroupToggle = function (Event) {
        if ($(Event).parent().find('.LeftMenuList').css('display') != 'none') {
            $(Event).parent().find('.LeftMenuList').slideUp(300);
            $(Event).parent().find('.LeftMenuFloat').removeClass(Setting.LeftToggleIconCss.Open);
            $(Event).parent().find('.LeftMenuFloat').not('span.LeftMenuSpan').addClass(Setting.LeftToggleIconCss.Close);
        } else {
            $(Event).parent().find('.LeftMenuList').slideDown(300);
            $(Event).parent().find('.LeftMenuFloat').removeClass(Setting.LeftToggleIconCss.Close);
            $(Event).parent().find('.LeftMenuFloat').not('span.LeftMenuSpan').addClass(Setting.LeftToggleIconCss.Open);
        }
    };
    //左側選單群組預設縮放 依照設定調整縮放狀態
    if (typeof (Setting.LeftToggle) == 'object') {
        //icon先全套用關閉的
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuFloat').addClass(Setting.LeftToggleIconCss.Close);
        //先全關 然後再跑開放
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuList').hide();
        for (var i = 0; i < Setting.LeftToggle.length; i++) {
            if (typeof (Setting.LeftToggle[i]) == 'number') {
                $('#LeftMenuInset .LeftMenuGroup:eq(' + Setting.LeftToggle[i] + ') .LeftMenuFloat').removeClass(Setting.LeftToggleIconCss.Close);
                $('#LeftMenuInset .LeftMenuGroup:eq(' + Setting.LeftToggle[i] + ') .LeftMenuFloat').not('span.LeftMenuSpan').addClass(Setting.LeftToggleIconCss.Open);
                $('#LeftMenuInset .LeftMenuGroup:eq(' + Setting.LeftToggle[i] + ') .LeftMenuList').show();
            } else if (typeof (Setting.LeftToggle[i]) == 'string') {
                $('#LeftMenuInset .LeftMenuGroup').each(function (index, element) {
                    if ($(element).attr('select-val') == Setting.LeftToggle[i]) {
                        $('#LeftMenuInset .LeftMenuGroup:eq(' + index + ') .LeftMenuFloat').removeClass(Setting.LeftToggleIconCss.Close);
                        $('#LeftMenuInset .LeftMenuGroup:eq(' + index + ') .LeftMenuFloat').not('span.LeftMenuSpan').addClass(Setting.LeftToggleIconCss.Open);
                        $('#LeftMenuInset .LeftMenuGroup:eq(' + index + ') .LeftMenuList').show();
                    }
                });
            }
        }
    } else if (Setting.LeftToggle == true) {
        //全開
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuFloat').not('span.LeftMenuSpan').addClass(Setting.LeftToggleIconCss.Open);
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuList').show();
    } else if (Setting.LeftToggle == false) {
        //全關
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuFloat').not('span.LeftMenuSpan').addClass(Setting.LeftToggleIconCss.Close);
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuList').hide();
    }
    //左側選單 指定選取
    if (Setting.LeftSelect != null) {
        $('#LeftMenuInset .LeftMenuBtn').each(function (index, element) {
            if ($(element).attr('select-val') == Setting.LeftSelect) {
                $('#LeftMenuInset .LeftMenuBtn:eq(' + index + ')').addClass('LeftMenuBtnSelect');
            }
        });
    }
    //副選單 指定選取
    if (Setting.DeputySelect != null) {
        $('#DeputyBoxInset .DeputyBoxBtn').each(function (index, element) {
            if ($(element).attr('select-val') == Setting.DeputySelect) {
                $('#DeputyBoxInset .DeputyBoxBtn:eq(' + index + ')').addClass('DeputyBoxBtnSelect');
            }
        });
    }



    //=================================== 動態開關 ===================================

    //設定動畫速度
    var TempSpeed = 0;
    //設定動畫方式
    var TempTransition = '';
    //左側選單 開關
    LeftMenuViewToggle = function (Type) {

        if ($('#LeftMenu').css('display') != 'none') {

            //隱藏左側選單
            $('#LeftMenu').hide(TempSpeed, TempTransition);

            //浮動窗口運算
            MathematicalOperation('ViewToggle', 'ToggleBtn');

        } else {

            //顯示左側選單
            $('#LeftMenu').show(TempSpeed, TempTransition);

            //浮動窗口運算
            MathematicalOperation('', 'ToggleBtn');

        }

    };



    //================================ 位置及大小運算 ================================

    //判斷是否為 firefox 瀏覽器 如果是就多帶數值 (要加回去抵銷扣除的外距)
    var Browser = tools.getBrowser();
    var FireFoxHtmlMargin = 0;
    if (Browser.firefox) {
        FireFoxHtmlMargin = parseInt($('#ContentBoxInset .ContentBoxHtml').css('margin-bottom').replace('px', ''));
    }
    //模組數值變數 ------------ 改變解析度需要計算
    var ModuleConfig = {};
    ModuleConfigGet = function () {
        ModuleConfig = {
            WindowOrientation: window.orientation,                //螢幕旋轉角度 (暫時沒用到)
            WindowWidth: window.innerWidth,                       //螢幕寬度
            WindowHeight: window.innerHeight,                     //螢幕高度
            HeaderHeight: $('#HeaderBox').height(),               //置頂欄位高度
            LeftWidth: $('#LeftMenu').width(),                    //左側選單寬度
            DeputyHeight: $('#DeputyBox').height(),               //副選單高度
            CopyrightHeight: $('#ContentBoxCopyRight').height(),  //宣告欄位高度
            FireFoxHtmlMargin: FireFoxHtmlMargin,                 //firefox專用墊高
            ContentHtmlMargin: parseInt($('#ContentBoxInset .ContentBoxHtml').css('margin-bottom').replace('px', '')),  //內容Html區塊外距
            LeftPaddingTop: parseInt($('#LeftMenuInset').css('padding-top').replace('px', '')),                         //左側選單上內距
            LeftPaddingBottom: parseInt($('#LeftMenuInset').css('padding-bottom').replace('px', '')),                   //左側選單上內距
            CopyRightPaddingRight: parseInt($('#ContentBoxCopyRightInset').css('padding-right').replace('px', '')),     //宣告欄位右內距 (因為左邊會一直變動只能抓右邊)
        };
    };
    ModuleConfigGet();
    //判斷區塊顯示 ------------ 改變解析度需要計算
    BoxDisplayCheck = function (Type) {
        if (Setting.HeaderDisplay == true) {
            $('#HeaderBox').show();
        } else {
            ModuleConfig.HeaderHeight = 0;
            $('#HeaderBox').hide();
        }
        if (Setting.CloseMenuWidth != 0) {
            $('#HeaderBoxInset .HeaderBoxMenuBtn').show();
            $('#HeaderBoxInset table tr td:nth-child(1)').css('width', '54px');
        } else {
            $('#HeaderBoxInset .HeaderBoxMenuBtn').hide();
            $('#HeaderBoxInset table tr td:nth-child(1)').css('width', '1px');
        }
        if (Setting.LeftBtnDisplay == true) {
            $('#HeaderBoxInset .HeaderBoxMenuBtn').show();
            $('#HeaderBoxInset table tr td:nth-child(1)').css('width', '54px');
        } else {
            $('#HeaderBoxInset .HeaderBoxMenuBtn').hide();
            $('#HeaderBoxInset table tr td:nth-child(1)').css('width', '1px');
        }
        if (Setting.LeftDisplay == true) {
            //這個項目 在改變解析度時 不執行
            if (Type != 'Resize') {
                $('#LeftMenu').show();
            }
        } else {
            ModuleConfig.LeftWidth = 0;
            $('#LeftMenu').hide();
            //還要隱藏選單按鈕
            $('#HeaderBoxInset .HeaderBoxMenuBtn').hide();
            $('#HeaderBoxInset table tr td:nth-child(1)').css('width', '1px');
        }
        if (Setting.DeputyDisplay == true) {
            $('#DeputyBox').show();
        } else {
            ModuleConfig.DeputyHeight = 0;
            $('#DeputyBox').hide();
        }
        if (Setting.ContentDisplay == true) {
            $('#ContentBox').show();
        } else {
            ModuleConfig.ContentHeight = 0;
            $('#ContentBox').hide();
        }
        if (Setting.CopyrightDisplay == true) {
            $('#ContentBoxCopyRight').show();
        } else {
            ModuleConfig.CopyrightHeight = 0;
            $('#ContentBoxCopyRight').hide();
        }
    };
    BoxDisplayCheck();
    //浮動窗口運算 ------------ 改變解析度需要計算
    var FirstLoadRun = true; //開啟網頁變數
    MathematicalOperation = function (Type, Mod) {

        //以設定觸發解析度為分界，較高則開啟，較低則關閉
        if (ModuleConfig.WindowWidth > Setting.CloseMenuWidth) {

            $('#LeftMenuInset').css('box-shadow', '0 0 0 0 rgba(0, 0, 0, 0)');

            //顯示左側選單 (按鈕訪問時不執行)
            if (Mod != 'ToggleBtn') {
                //行動裝置 若寬度變化或開啟網頁時 要執行
                if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
                    if (Setting.LeftDisplay == true && (TempWindowWidth != ModuleConfig.WindowWidth || FirstLoadRun == true)) {
                        $('#LeftMenu').show(TempSpeed, TempTransition);
                    }
                } else {
                    //電腦就直接執行 (要確認左側選單是有使用的才可以執行)
                    if (Setting.LeftDisplay == true) {
                        $('#LeftMenu').show(TempSpeed, TempTransition);
                    }
                }
            }

        } else {

            $('#LeftMenuInset').css('box-shadow', '2px 20px 20px 0 rgba(0, 0, 0, 0.2)');
            Type = 'ViewToggle';

            //隱藏左側選單 (按鈕訪問時不執行)
            if (Mod != 'ToggleBtn') {
                if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
                    //行動裝置 若寬度變化或開啟網頁時 要執行
                    if (TempWindowWidth != ModuleConfig.WindowWidth || FirstLoadRun == true) {
                        $('#LeftMenu').hide(TempSpeed, TempTransition);
                    }
                } else {
                    //電腦就直接執行
                    $('#LeftMenu').hide(TempSpeed, TempTransition);
                }
            }

        }
        //關閉開啟網頁變數
        FirstLoadRun = false;


        //計算左側選單位置
        $('#LeftMenu').css({
            'top': ModuleConfig.HeaderHeight + 'px'
        });
        //計算左側選單內部高度
        $('#LeftMenuInset').css({
            'height': ModuleConfig.WindowHeight - ModuleConfig.HeaderHeight - ModuleConfig.LeftPaddingTop - ModuleConfig.LeftPaddingBottom + 'px'
        });


        //alert(TempWindowWidth + '/' + ModuleConfig.WindowWidth)
        //計算副選單 (只有寬改變或按鈕訪問時才需要運算)
        if (TempWindowWidth != ModuleConfig.WindowWidth || Mod == 'ToggleBtn') {
            if (Type == 'ViewToggle') {
                //位置
                $('#DeputyBox').css({
                    'top': ModuleConfig.HeaderHeight + 'px',
                    'left': '0px'
                });
                //寬度
                $('#DeputyBoxInset').css({
                    'width': ModuleConfig.WindowWidth + 'px'
                });
            } else {
                //位置
                $('#DeputyBox').css({
                    'top': ModuleConfig.HeaderHeight + 'px',
                    'left': ModuleConfig.LeftWidth + 'px'
                });
                //寬度
                $('#DeputyBoxInset').css({
                    'width': ModuleConfig.WindowWidth - ModuleConfig.LeftWidth + 'px'
                });
            }
        }



        //依照解析度調整左右留邊寬度
        var TempWindowRange = 0;
        if (ModuleConfig.WindowWidth >= 1920) {
            TempWindowRange = Setting.ContentBoxMargin.XXL;
        } else if (ModuleConfig.WindowWidth >= 1600 && ModuleConfig.WindowWidth < 1920) {
            TempWindowRange = Setting.ContentBoxMargin.XL;
        } else if (ModuleConfig.WindowWidth >= 1280 && ModuleConfig.WindowWidth < 1599) {
            TempWindowRange = Setting.ContentBoxMargin.L;
        } else if (ModuleConfig.WindowWidth >= 1024 && ModuleConfig.WindowWidth < 1279) {
            TempWindowRange = Setting.ContentBoxMargin.M;
        } else {
            TempWindowRange = Setting.ContentBoxMargin.S;
        }



        //計算內容區塊 (只有寬改變或按鈕訪問時才需要運算)
        if (TempWindowWidth != ModuleConfig.WindowWidth || Mod == 'ToggleBtn') {
            if (Type == 'ViewToggle') {
                //內距
                $('#ContentBoxInset').css({
                    'padding-top': ModuleConfig.HeaderHeight + ModuleConfig.DeputyHeight + 'px',
                    'padding-left': '0px',
                });
                //寬度 (要判斷是否需要)
                if (Setting.ContentBoxHtmlWidth == true) {
                    $('#ContentBoxInset .ContentBoxHtml').css({
                        'width': ModuleConfig.WindowWidth - TempWindowRange + 'px'
                    });
                }
            } else {

                //內距
                $('#ContentBoxInset').css({
                    'padding-top': ModuleConfig.HeaderHeight + ModuleConfig.DeputyHeight + 'px',
                    'padding-left': ModuleConfig.LeftWidth + 'px',
                });
                //寬度 (要判斷是否需要)
                if (Setting.ContentBoxHtmlWidth == true) {
                    $('#ContentBoxInset .ContentBoxHtml').css({
                        'width': ModuleConfig.WindowWidth - ModuleConfig.LeftWidth - TempWindowRange + 'px'
                    });
                }
            }
        }



        //計算內容最小高度 才能定義宣告欄位的位置 (若為 firefox 瀏覽器則需要再多增加指定的墊高) (Header隱藏的時候有誤差 直接扣除掉)
        var tempRange = Setting.HeaderDisplay == false && Setting.DeputyDisplay == false ? 15 : 0;
        $('#ContentBoxInset').css({
            'min-height': ModuleConfig.WindowHeight - ModuleConfig.HeaderHeight - ModuleConfig.DeputyHeight - ModuleConfig.CopyrightHeight - ModuleConfig.ContentHtmlMargin + ModuleConfig.FireFoxHtmlMargin - tempRange + 'px'
        });


        //計算宣告欄位 (只有寬改變或按鈕訪問時才需要運算)
        if (TempWindowWidth != ModuleConfig.WindowWidth || Mod == 'ToggleBtn') {
            if (Type == 'ViewToggle') {

                //外距
                $('#ContentBoxCopyRightInset').css({
                    'margin-left': '0px'
                });

                ////內距
                //$('#ContentBoxCopyRightInset').css({
                //    'padding-left': ModuleConfig.CopyRightPaddingRight + 'px'
                //});

            } else {

                //外距
                $('#ContentBoxCopyRightInset').css({
                    'margin-left': ModuleConfig.LeftWidth + 'px'
                });

                ////內距
                //$('#ContentBoxCopyRightInset').css({
                //    'padding-left': ModuleConfig.LeftWidth + ModuleConfig.CopyRightPaddingRight + 'px'
                //});

            }
        }

    }
    MathematicalOperation();
    //每次改變視窗大小時跟著改變 (行動裝置要等到翻轉完畢才執行)
    $(window).resize(function () {

        if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {

            //紀錄目前寬度
            TempWindowWidth = ModuleConfig.WindowWidth;

            //行動裝置需延遲 500 毫秒後 再執行
            clearTimeout(ResizeSetTimeout);
            ResizeSetTimeout = setTimeout('MobileDelayResize()', 500);

        } else {

            //電腦版需延遲 100 毫秒後 再執行
            clearTimeout(ResizeSetTimeout);
            ResizeSetTimeout = setTimeout('MobileDelayResize()', 100);

            ////重新套用參數
            //ModuleConfigGet();
            ////判斷區塊顯示
            //BoxDisplayCheck('Resize');
            ////電腦版高度寬度都監控
            //MathematicalOperation();

        }

    });
    var ResizeSetTimeout;
    MobileDelayResize = function () {
        //重新套用參數
        ModuleConfigGet();
        //判斷區塊顯示
        BoxDisplayCheck('Resize');
        //電腦版高度寬度都監控
        MathematicalOperation();
    };



    //首次執行後 導入動畫樣式 (延遲後執行 這樣開網頁才不會跑版)
    FirstLoadEnd = function () {

        //延遲執行
        $('body').delay(500).show(1, function () {

            //設定動畫速度
            TempSpeed = 300;

            //統一動畫樣式 (css程式碼)
            var TempProperty = 'ease 0.3s'

            //副選單
            $('#DeputyBox').css('transition', TempProperty);
            $('#DeputyBoxInset').css('transition', TempProperty);
            //左側選單
            $('#LeftMenuInset').css('transition', TempProperty);
            //內容區塊
            $('#ContentBoxInset').css('transition', TempProperty);
            $('#ContentBoxInset .ContentBoxHtml').css('transition', TempProperty);
            //宣告欄位
            $('#ContentBoxCopyRightInset').css('transition', TempProperty);

        });

    };
    FirstLoadEnd();



    //=============================== 監控關閉左側選單 ===============================

    //監控關閉左側選單
    if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {

        //關閉觸發touchstart
        $(document).on('touchstart', '#HeaderBoxInset .HeaderBoxMenuBtn,#LeftMenu', function (event) {
            event.stopPropagation();
        });

        //以設定觸發解析度為分界，較高則開啟，較低則關閉，並放棄考慮左側選單寬度
        $(document).on('touchstart', 'html', function (event) {
            if (ModuleConfig.WindowWidth > Setting.CloseMenuWidth) {
            } else {
                $('#LeftMenu').hide(TempSpeed, TempTransition);
            }
        });

    } else {

        //關閉觸發click
        $(document).on('click', '#HeaderBoxInset .HeaderBoxMenuBtn,#LeftMenu', function (event) {
            event.stopPropagation();
        });

        //以設定觸發解析度為分界，較高則開啟，較低則關閉，並放棄考慮左側選單寬度
        $(document).on('click', 'html', function (event) {
            if (ModuleConfig.WindowWidth > Setting.CloseMenuWidth) {
            } else {
                $('#LeftMenu').hide(TempSpeed, TempTransition);
            }
        });

    }

    //================================ 套用滑動條插件 ================================

    var setTop = 0;
    var setLeft = 0;
    if ($('.LeftMenuBtnSelect').length > 0) {
        setTop = '-' + ($('.LeftMenuBtnSelect').offset().top - ($('#LeftMenu').height() / 3)) + 'px';
    }
    if ($('.DeputyBoxBtnSelect').length > 0) {
        setLeft = '-' + ($('.DeputyBoxBtnSelect').offset().left - ($('#DeputyBox').width() / 2)) + 'px';
    }

    //套用滑動條插件
    $(document).ready(function () {
        //非行動裝置 設定滑動條定義
        if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
            //左側選單
            $('#LeftMenuInset').mCustomScrollbar({
                theme: 'minimal-dark',
                mouseWheel: { preventDefault: false },
                autoDraggerLength: false,
                mouseWheel: { scrollAmount: 200 },
                setTop: setTop,
            });
            //副選單
            $('#DeputyBoxInset').mCustomScrollbar({
                axis: 'x',
                theme: 'dark-3',
                mouseWheel: { invert: true },
                mouseWheel: { preventDefault: false },
                scrollButtons: { enable: true },
                autoDraggerLength: false,
                mouseWheel: { scrollAmount: 200 },
                autoHideScrollbar: true,
                setLeft: setLeft,
            });
        }
    });

    //=================================== 其他設定 ===================================

    //填入副選單墊磚
    $('#DeputyBoxInset').append('<span style="margin-right:15px"></span>');

    //讀取進度條樣式設定
    try {
        NProgress.configure({
            easing: Setting.NProgressEasing,
            speed: Setting.NProgressSpeed,
            parent: Setting.NProgressParent,
            showSpinner: Setting.NProgressShowSpinner,
        });
    } catch (e) { };

    //添加置頂按鈕
    $('body').append('<div id="gotop"><i class="fa fa-arrow-up"></i><br />Top</div>');

    //宣告置頂按鈕動作 (行動裝置不顯示)
    if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
        $('#gotop').click(function () {
            $('html,body').animate({
                scrollTop: 0
            }, 300);
        });
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                $('#gotop').fadeIn(200);
            } else {
                $('#gotop').stop().fadeOut(200);
            }
        });
    }

};

//重新綁定選單 Hover 動畫
VisualModuleHoverBuild = function () {

    if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) {
        //先全部移除
        $('#LeftMenuInset .LeftMenuBtn').removeClass('LeftMenuBtnHover');
        $('#DeputyBoxInset .DeputyBoxBtn').removeClass('DeputyBoxBtnHover');
        //再去綁定
        $('#LeftMenuInset .LeftMenuBtn').addClass('LeftMenuBtnHover');
        $('#DeputyBoxInset .DeputyBoxBtn').addClass('DeputyBoxBtnHover');
    }

};

//指定副選單選取
VisualModuleDeputySelect = function (selectVal) {

    $('#DeputyBoxInset .DeputyBoxBtn').each(function (index, element) {
        if ($(element).attr('select-val') == selectVal) {
            $('#DeputyBoxInset .DeputyBoxBtn:eq(' + index + ')').addClass('DeputyBoxBtnSelect');
        } else {
            $('#DeputyBoxInset .DeputyBoxBtn:eq(' + index + ')').removeClass('DeputyBoxBtnSelect');
        }
    });

};

//指定左側選單選取
VisualModuleLeftSelect = function (selectVal) {

    $('#LeftMenuInset .LeftMenuBtn').each(function (index, element) {
        if ($(element).attr('select-val') == selectVal) {
            $('#LeftMenuInset .LeftMenuBtn:eq(' + index + ')').addClass('LeftMenuBtnSelect');
        } else {
            $('#LeftMenuInset .LeftMenuBtn:eq(' + index + ')').removeClass('LeftMenuBtnSelect');
        }
    });

};

//重新整理自適應介面
VisualModuleResize = function () {
    $(document).ready(function () {
        MobileDelayResize();
    });
};

//設定全局 alert 視窗按鈕樣式
VisualModuleAlertStyle = function (style) {
    buttonClass.ok = style;
};

//控制左側選單群組縮放
VisualModuleLeftToggle = function (setting) {

    //左側選單群組預設縮放 依照設定調整縮放狀態
    if (typeof (setting) == 'object') {
        //icon先全套用關閉的
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuFloat').addClass(tempVisualModuleLeftToggleIconCss.Close);
        //先全關 然後再跑開放
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuList').hide();
        for (var i = 0; i < setting.length; i++) {
            if (typeof (setting[i]) == 'number') {
                $('#LeftMenuInset .LeftMenuGroup:eq(' + setting[i] + ') .LeftMenuFloat').removeClass(tempVisualModuleLeftToggleIconCss.Close);
                $('#LeftMenuInset .LeftMenuGroup:eq(' + setting[i] + ') .LeftMenuFloat').not('span.LeftMenuSpan').addClass(tempVisualModuleLeftToggleIconCss.Open);
                $('#LeftMenuInset .LeftMenuGroup:eq(' + setting[i] + ') .LeftMenuList').show();
            } else if (typeof (setting[i]) == 'string') {
                $('#LeftMenuInset .LeftMenuGroup').each(function (index, element) {
                    if ($(element).attr('select-val') == setting[i]) {
                        $('#LeftMenuInset .LeftMenuGroup:eq(' + index + ') .LeftMenuFloat').removeClass(tempVisualModuleLeftToggleIconCss.Close);
                        $('#LeftMenuInset .LeftMenuGroup:eq(' + index + ') .LeftMenuFloat').not('span.LeftMenuSpan').addClass(tempVisualModuleLeftToggleIconCss.Open);
                        $('#LeftMenuInset .LeftMenuGroup:eq(' + index + ') .LeftMenuList').show();
                    }
                });
            }
        }
    } else if (setting == true) {
        //全開
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuFloat').not('span.LeftMenuSpan').addClass(tempVisualModuleLeftToggleIconCss.Open);
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuList').show();
    } else if (setting == false) {
        //全關
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuFloat').not('span.LeftMenuSpan').addClass(tempVisualModuleLeftToggleIconCss.Close);
        $('#LeftMenuInset .LeftMenuGroup .LeftMenuList').hide();
    }

};
