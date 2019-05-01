//  jQuery  ※※※※※※※※※※※※※※※※※※※※※※※

//當 document 物件下所有 DOM 物件都可以正確取得時執行
$(function () { });
$(document).ready(function () { });

//當所有 DOM 物件下載完畢才執行 圖片等等之類的
$(window).load(function () { });

//嘗試存取
try { } catch (e) { };

//顯示與隱藏
$('#abc').show();
$('#abc').hide();

//清空項目內資料
$('#abc').empty();

//移除項目
$('#abc').remove();

//聚焦
$('#prompt_msg').focus();
//失焦
$('#prompt_msg').blur();
//目前正在聚焦的元件
document.activeElement

//取值
$('#abc').val();

//增加項目內資料並修改CSS樣式
$('#abc').append('文字內容').css("color", "#ff0000");
//append() - 在被選元素的結尾插入內容
//prepend() - 在被選元素的開頭插入內容
//after() - 在被選元素之後插入內容
//before() - 在被選元素之前插入內容

//轉JSON
JSON.stringify(變數)
// JSON 轉 物件
var temp_res = jQuery.parseJSON(res);
var temp_res = JSON.parser(變數);

//建立陣列帶入變數
var temp_data = [{ obj1: 變數 }]
var mydata = {
    //length: $scope.order_check_ok_shows.length,
    data: temp_data
}

//AJAX
var temp_data = [{ obj1: 變數 }]
var mydata = { data: temp_data }
$.ajax({
    url: 'MyAshx/程式名稱.ashx',
    data: JSON.stringify(mydata),
    type: 'post',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (rlt) {
        //rlt為回傳值
        //rlt.data為回傳陣列
        //rlt.data[0]為回傳陣列的第一筆
        //rlt.data.length
    },
    error: function (e) {
        ErrorMsgShow(e, 'PasswordChange_Check');
    }
});

//AJAX 含error 含進度監控
$.ajax({
    url: 'MyAshx/程式名稱.ashx',
    data: JSON.stringify(mydata),
    type: 'post',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (rlt) {
        //rlt為回傳值
        //rlt.data為回傳陣列
        //rlt.data[0]為回傳陣列的第一筆
    },
    error: function (e) {
        //e.statusText
        //e.status
        //alert_S('提取資料錯誤：<br/><span style="color: #d9534f">' + e.statusText + ' ' + e.status + '</span>');
    },
    xhrFields: { //下載監控
        onprogress: function (event) {
            //Download progress
            if (event.lengthComputable) {
                console.dir(event.loaded + '/' + event.total);
            }
        }
    },
    xhr: function () { //上傳監控
        // 建立 XHR 時，加掛 onprogress 事件
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                console.dir(event)
                console.dir(event.total + '/' + event.loaded)
            }
        };
        return xhr;
    }
});

//AJAX 含error 含進度監控 含檔案上傳
FilesUpLoad_OnChange = function (files) {

    ////判斷 是否為圖片格式
    //var TempCheckType = Enumerable.From(files[0].files)
    //                    .Where(function (item) {
    //                        return item.type != 'image/gif' &&
    //                               item.type != 'image/jpeg' &&
    //                               item.type != 'image/jpg' &&
    //                               item.type != 'image/png' &&
    //                               item.type != 'image/bmp';
    //                    })
    //                    .Select(function (item) {
    //                        return item;
    //                    })
    //                    .ToArray();
    //
    //if (TempCheckType.length != 0) {
    //    $(files).val('');
    //    alert_S('僅可上傳 gif、jpg、jpeg、png、bmp 等格式之圖片！請確認後再次嘗試。');
    //    return;
    //}

    //判斷是否有檔案
    if (files[0].files.length == 0) {
        alert_S('<error>尚未選擇任何上傳檔案，請選擇後再次嘗試上傳！</error>');
        return;
    }
    //查看檔案大小
    loading_S('<div id="ProgressTitle">檔案上傳中&nbsp;<i class="fa fa-spinner fa-pulse"></i></div>' +
              '<div class="ProgressBar">' +
                  '<div class="ProgressBar2" style="width: 0%"></div>' +
                  '<div class="ProgressBarWord">' +
                      '0%' +
                  '</div>' +
              '</div>'
    , function () {

        //宣告 formData 物件
        var formData = new FormData();
        //填入檔案
        for (i = 0; i < files[0].files.length; i++) {
            formData.append('fileupload', files[0].files[i]);
        }
        //填入參數
        var mydata = {
            Path: '~/FileUpload/StudentFile/' + GlobalStUid + '/Files/'
        }
        formData.append('JSON_data', JSON.stringify(mydata));
        $.ajax({
            url: 'MyAshx/FilesUpload.ashx',
            data: formData,
            method: 'post',
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (rlt) {

                $('#ProgressTitle').html('上傳完成！');
                $('.ProgressBar2').css('width', '100%');
                $('.ProgressBarWord').html('100%');

                $('body').delay(500).show(function () {

                    $(files).val('');

                    //完成後其他執行項目

                });

            },
            xhr: function () {
                // 建立 XHR 時，加掛 onprogress 事件
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        //換算成百分比
                        var ProgressValue = Math.round(event.loaded / event.total * 100);
                        if (ProgressValue > 100) { ProgressValue = 100; }

                        $('.ProgressBar2').css('width', ProgressValue + '%');
                        $('.ProgressBarWord').html(ProgressValue + '%');
                    }
                };
                return xhr;
            },
            error: function (e) {
                ErrorMsgShow(e);
            }
        });

    });

};

//撈時間
var Today = new Date();
$scope.Today_time = '今天日期為 ' + Today.getFullYear() + ' 年 ' + (Today.getMonth() + 1) + ' 月 ' + Today.getDate() + ' 日';
//時間格式化
var Today = new Date();
var Today_time_yyyy_mm_dd = Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + Today.getDate();
var Today_time_hh_mm_ss = Today.getHours() + ':' + Today.getMinutes() + ':' + Today.getSeconds();
var Today_time = Today_time_yyyy_mm_dd + ' ' + Today_time_hh_mm_ss;

//撈時間2
var Today = new Date();
var user_today_confirm_time = Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + Today.getDate();

//時間格式化
Today.Format('yyyy-MM-dd HH:mm:ss');

//抽取陣列資料
var new_id;
var temp = Enumerable.From($scope.guests).OrderBy(x => x.id)
.Select(function (item) {
    new_id = (parseInt(item.id) + 1).toString();
})
.ToArray();

//轉換為數字
parseInt(item)
//轉換為數字 (含小數點)
parseFloat(item)

//傳換為文字
.toString();

//排序
OrderBy(x => x.id)

// localStorage 儲存
var local_save_set = JSON.stringify(想要儲存的變數);
localStorage.setItem("儲存檔名", local_save_set);
// localStorage 抽取
var local_save_get = localStorage.getItem("儲存檔名");
想要儲存的變數 = jQuery.parseJSON(local_save_get);

// sessionStorage 儲存
sessionStorage.setItem("Name", Value);
// sessionStorage 抽取
var Value = sessionStorage.getItem("Name");

// Storage 單筆清除
localStorage.removeItem("clickcount");
// Storage 完全清除
localStorage.clear();

//元素唯讀
$('#apply_order_btn').attr('disabled', true);

//控制 input 元件
$('input[name=ChangeRadio]').prop('checked', 'value');

//轉跳網址
document.location.href = 'AAA.aspx';

//轉跳網址 另開視窗
window.open('BBB.aspx');

//等待函數 執行
var t = setTimeout('function()', 300); //單次執行
var t = setInterval('function()', 300); //多次執行
//等待函數 關閉
clearTimeout(t); //單次執行關閉
window.clearInterval(t); //多次執行關閉

//取代 (範例為 \n 取代為 <br />)
$('#creat_message_user_content').val().replace(/\n/g, "<br/>");
$('#creat_message_user_content').val().replace(/<br\/>/g, "\n");

//取代 範圍內 <!--table_capture_temp_top--> 擷取內容 <!--table_capture_temp_bottom-->
var RefreshList_temp = $('#text_load').html().replace(/\r\n/g, "").match(/(<!--table_capture_temp_top-->.*?<!--table_capture_temp_bottom-->)/m)[0];

// eval() 可以帶入變數 match
var RefreshList_temp = eval("item.Job.match(/" + TempString + "/m)");

//取 txt 內容
$.get('text_load.txt', function (data) {
    console.dir(data)
});

//判斷瀏覽器解析度  $(window).width() 誤差 -17px
$(window).resize(function () { });

//回到置頂
$('html,body').animate({ scrollTop: 0 }, 300);

//滑鼠移動判斷改變BG
$(document).mousemove(function (e) {
    $('#all_body_table_title_BG').css('background-position-x', 0 - e.pageX / 50);
    $('#all_body_table_title_BG').css('background-position-y', 0 - e.pageY / 100);
});

//元件座標取得
var position = $('#headshot-img').offset();
var x = position.left;
var y = position.top;

//滑鼠在頁面的座標取得
$(document).mousemove(function (e) {
    sx = e.pageX + document.documentElement.scrollTop;
    sy = e.pageY + document.documentElement.scrollLeft;
});

//陣列排序 數字用
$scope.SurveyEdit.content.drag_box_lg.sort(function (a, b) { return a['page'] - b['page']; });
//陣列排序 文字用
$scope.EditBox_2_Data.ElectiveSubject.sort(function (a, b) { return a['SubjectID'].localeCompare(b['SubjectID']) });

//抽取陣列+刪除  新增 
var move_temp = $scope.SurveyEdit.content.drag_box_lg[drag_box_lg_index_old].drag_box.splice(drag_box_index_old, 1);

//移除指定陣列
TempValue.splice(index, 1);

//視窗移動
$('html,body').animate({ scrollTop: 0 }, 300);
$('html,body').animate({ scrollTop: $('#single_search_show').offset().top + 10 }, 300);
$('html,body').animate({ scrollTop: $(document).height() }, 300);

//瀏覽器位置判斷
$(window).scroll(function () {
    if ($(this).scrollTop() > 132) {

    } else {

    }
});

//前端的資料庫語法 linq
var TempArray = Enumerable.From($scope.TransferCourses)
                .Where(function (item, index) {
                    return item.Sch_Dep_uid == Sch_Dep_uid;
                })
                .Distinct(function (item) {
                    return item.Class_UID;
                })
                .GroupBy(function (item) {

                    return item.Teacher;
                })
                .OrderBy(function (item) {
                    return item.user;
                })
                .ThenBy(function (item) {
                    return item.user;
                })
                .Select(function (item) {
                    return item;
                })
                .ToArray();

//消除前後空白字串
字串.trim();

//鍵盤判斷 (13=enter, 27=esc)
$('.key_enter').keyup(function (key_event) {
    if (key_event.which == 13) {

    }
});
$(document).on('keyup', '.key_enter', function (key_event) {
    // keyCode 或是 which 都可以
    if (key_event.keyCode == 13) {

    }
    if (key_event.which == 13) {

    }
});

//字符運算
eval();

//重新整理
window.location.reload();

//正規式 取網址
var temp_Url = location.href.match(/.*\//)[0];

//移動到 name="名稱" 的錨點
location.hash = '名稱';

//瀏覽器判斷 更換支援的字型
var Browser = getBrowser();
if (Browser.chrome || Browser.firefox || Browser.safari) {
    $('body').css('font-family', '\'cwTeXHei\',\'Arial\',\'微軟正黑體\'');
}
else //支援就更換使用字型  
{
    $('body').css('font-family', '\'微軟正黑體\'');
}

//判斷是否為手機系統
if (navigator.userAgent.toLowerCase().match(/(android|iphone|ipad|ipod);?/i)) { };

//返回上一頁
history.go(-1);
history.back();

// Css 套用跟移除
$('.NavBox').addClass('NavBox_Phone');
$('.NavBox').removeClass('NavBox_Phone');

//Ajax動態改變網址 不刷新頁面 但有歷史紀錄 ie10以上支援
history.pushState(0, 'url', '?e=12345');

//除去副檔名
var TempExtIndex = TempName.lastIndexOf('.');

//取得副檔名 引用 getFileExtension()
var TempExtIndex = getFileExtension('abcd.jpg');
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
//console.log(getFileExtension(''));                            // ''
//console.log(getFileExtension('filename'));                    // ''
//console.log(getFileExtension('filename.txt'));                // 'txt'
//console.log(getFileExtension('.hiddenfile'));                 // ''
//console.log(getFileExtension('filename.with.many.dots.ext')); // 'ext'

//只允許輸入數字
// <input type="text" onkeyup="ValidateNumber($(this),value)" />
function ValidateNumber(e, pnumber) {
    if (!/^\d+$/.test(pnumber)) {
        $(e).val(/^\d+/.exec($(e).val()));
    }
    return false;
}

//只允許輸入英文和數字 並轉大寫
//onkeyup = "value=value.toUpperCase();value=value.replace(/[^-_A-Z0-9]/g,'')"

//只允許輸入數字與1個小數點
function ValidateNumber2(e, pnumber) {
    if (!/^\d+[.]?\d*$/.test(pnumber)) {
        $(e).val(/^\d+[.]?\d*/.exec($(e).val()));
    }
    return false;
}

//常用的取整數方法
Math.ceil(a);  //強制進位
Math.floor(a); //無條件舍去
Math.round(a); //四捨五入

//數字驗證 檢查傳進的參數是否是數字或者可否轉換為數字
jQuery.isNumeric(Value);
$.isNumeric(Value);

//字串 轉 陣列
'1,2,3,4,5'.split(',');
//陣列 轉 字串
Array.join(',');

//取得上一層的父元素
$(obj).parent()
//取得上一層的所有父元素
$(obj).parents()
//取得上一層第一個符合的父元素，等同於parents().eq(0)
$(obj).closest()

//資料類型判斷
if (typeof (DateVal) == 'string') { }

//取得網址參數
getUrlVars();
var GlobalStUid = $.getUrlVar('s');

//轉大寫
String.toUpperCase();
//轉小寫
String.toLowerCase();

//合併陣列
var arr1 = ["a", "b"];
var arr2 = ["b", "c"];
var arr3 = arr1.concat(arr2);//合併後得到["a","b","b","c"]

//判斷 input checkbox 數值 (回傳 true 或 false)
$('#InSchoolState').prop('checked');

//防止瀏覽器默認行為
event.preventDefault();
//防止瀏覽器其他冒泡事件
event.stopPropagation();






//  AngularJS  ※※※※※※※※※※※※※※※※※※※※※※

//HTML標籤
//  ng-app="域名"
//  ng-controller="控制項名"
//  ng-model="變數名"
//  ng-click="變數名(變數)"
//  ng-change="變數名(變數)"
//  ng-hide="變數名"
//  ng-show="變數名"
//  ng-repeat="子變數名 in 母變數名"
//  ng-repeat-start="子變數名 in 母變數名 | filter:過濾項"
//  ng-repeat-end
//  {{變數名}} or <span ng-bind="變數"></span> 此寫法可解決醜醜的 {{ }} 出現
//  ng-if="子條件==母條件"
//  ng-options="值 as 顯示 for 子變數名 in 母變數名"

//宣告指定域名
var app = angular.module('域名', []);

//function
app.controller('控制項名', function 控制項名($scope) { });

//陣列
$scope.變數名 = [];

//動態套用
$scope.$apply();

//父層變數應用
$scope.Test = $scope.$parent.Hello + '嘎！';

//新增資料進入陣列
$scope.變數名.push({
    id: 變數,
    company: '來賓',
    department: 123
});

//刪除陣列內資料
$scope.按鈕變數名 = function (傳入變數) {
    $scope.陣列變數名.splice(傳入變數, 1);
};

//轉譯 html
//<div ng-bind-html="變數 | to_trusted"></div>
app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

// ng 的 style 控制
// ng-style="{'border-top': drag_box.style}"

//利用複製 解除雙向綁定
angular.copy(obj);

//換頁規則
// 宣告變數
// $scope.PageCtrl = { NowPage: 1, PerPage: 10, AllPage: 0 }
// 需要 NowPage 當前頁數 以及 PerPage 每頁顯示筆數，最後配合 AllPage 總頁數 做處裡
// ng-if="$index<PageCtrl.NowPage*PageCtrl.PerPage && $index>=PageCtrl.NowPage*PageCtrl.PerPage-PageCtrl.PerPage"
// 取得總頁數 (無條件進位)
// $scope.PageCtrl.AllPage = Math.ceil(rlt.data.length / $scope.PageCtrl.PerPage)

//取 dom物件 $(this)
// 在物件上 變數使用 $event
// 取值時 使用 $(event.target)





//  ASPX  ※※※※※※※※※※※※※※※※※※※※※※

//取 text 欄位值
//  string temp_account = Request.Form["account_text"];

//後臺 Session 暫存功能
Session["temp_account"] = temp_account;

//轉字串
//  (string)
//  .ToString()

//轉跳頁面
Response.Redirect("~/Result_show.aspx");

//文字顯示
Label1.Text = "資料驗證錯誤！請確認後重新輸入";

//抽取網址參數
//  string temp_PJUID = context.Request.QueryString["PJUID"];

//後臺插入使用 JS (1)
//  string someScript = "";
//  someScript = @"<script language='javascript'>
//                 $('.alert_S_msg').html("+ Msg + @");
//                 $('#alert_S_div').css('visibility', 'visible');
//                 $('#alert_S_alert').show();
//                 $('#alert_S_div_shadow').slideDown(300);
//                 </script>";
//  Page.ClientScript.RegisterStartupScript(this.GetType(), "onload2", someScript);

//後臺插入使用 JS (2)
//  using System.Text;
//  StringBuilder sb = new StringBuilder();
//  sb.Append("<script language='javascript'>");
//  sb.Append("downloag_link_show_creat_have_delete('" + temp_P_No + "','" + theFileInfo.Name.ToString() + "');");
//  sb.Append("</script>");
//  ClientScript.RegisterStartupScript(this.GetType(), "LoadPicScript", sb.ToString());

//等待
System.Threading.Thread.Sleep(1000);

//C# 的 null 轉換成 SQL 的 null 寫入資料庫
//(object) 數值 ?? DBNull.Value
//new SqlParameter("@temp_ActivitySortUid", (object)DataClass.data[0].ActivitySortUid ?? DBNull.Value) { SqlDbType = SqlDbType.NVarChar }

//設定 runat="server" 就可以從後臺控制 DOM 物件
//  <div id="div1" runat="server">haha</div>

//強迫後端把 Cache 的功能關掉 再次執行 Page_Load 機制
//  先 using System.Web;
//  然後在 Page_Load() 加入下列語法即可
//  HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
//  HttpContext.Current.Response.Cache.SetNoServerCaching();
//  HttpContext.Current.Response.Cache.SetNoStore();

//解析陣列
//  string TempYear = string.Join(",", DataClass.Year.Select(it => it.Val).ToArray());
//  string TempSemester = string.Join(",", DataClass.Semester.Select(it => it.Val).ToArray());

//字串轉陣列
//  string[] temp = String.Split(',');

//取代
//  TempYear.Replace(";", "");
//  TempSemester.Replace(";", "");

//調用 Web.config 的變數
//  System.Configuration.ConfigurationManager.AppSettings["KeyName"]







//  Css  ※※※※※※※※※※※※※※※※※※※※※※※

//參考 https://www.puritys.me/docs-blog/article-31-CSS-%E8%AA%9E%E6%B3%95%EF%BC%8C%E6%96%87%E5%AD%97%E6%8F%9B%E8%A1%8C%EF%BC%8C%E5%BC%B7%E8%BF%AB%E4%B8%8D%E6%8F%9B%E8%A1%8C%E3%80%82.html
//  文字強迫換行 word-break: break-all;
//  依單字換行   word-wrap: break-word;
//  死都不換行   white-space: nowrap;

//文字點點點隱藏(需要指定寬度)
//  white-space: nowrap;
//  text-overflow: ellipsis;
//  overflow: hidden;

//背景常用語法
//  background-color: rgba(0, 0, 0, 0.5);
//  background-image: url('../images/ImageViewShadow.png');
//  background-repeat: no-repeat;
//  background-size: cover;
//  background-position: center center;

//防止行動裝置浮動視窗抖動
//  -webkit-transform: translateZ(0);
//  -moz-transform: translateZ(0);
//  -ms-transform: translateZ(0);
//  transform: translateZ(0);




//  SQL  ※※※※※※※※※※※※※※※※※※※※※※※

//時間格式化
//  FORMAT([DateStart], 'yyyy-MM-dd HH:mm:ss') AS [DateStart]

//計算使用時間
//  declare @T1 datetime;
//  set @T1 = GETDATE();
//  
//  要查的語法
//
//  select DATEDIFF(ms,@T1,GETDATE());






//  HTML  ※※※※※※※※※※※※※※※※※※※※※※※

//div模擬textarea
//  <div contenteditable="true" style="border: 1px solid #000"></div>

//textarea套件應用 (16px的文字 行高22px)

//  <textarea id="test" rows="1" style="width: 100%; resize: none; max-height: 88px"></textarea>
//  autosize($('#test'));
//  autosize(document.querySelector('#test'));
