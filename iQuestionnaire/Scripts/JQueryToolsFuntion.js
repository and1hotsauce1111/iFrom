/*
 * 常用JQuery 小工具
 * 此頁函數功能可支援jquery-1.10.2
 * 最後修改日期2015.11.07
  
  2016.09.10
  1. getUrlVars function修正變數的值有=會取值異常的問題
  2014.09.11
  1. getWindowsSize function增加
  2014.09.05
  1. JsWebPost function增加model參數
  
 */

//#region -- 取得網址列問號後(get)的參數 --
/* 使用方式：
1.取得單一參數的數值 var value_name = $.getUrlVar("vaJsWebPostlue_name");
*/
function getUrlVars() {

    $.extend({
        getUrlVars: function () {
            var vars = [], hash;
            var UrlVars = $(location).attr('search');

            if (UrlVars != "") {
                var hashes = UrlVars.slice(UrlVars.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {

                    var hashes_temp = hashes[i];
                    hash = hashes_temp.split('=');
                    var name = hash[0];
                    var value = hashes_temp.substr((name + '=').length);
                    vars.push(name);
                    //.replace(/#/g, "")解決網址有#的問題
                    vars[name] = value.replace(/#/g, "");
                }
            }

            return vars;
        },
        getUrlVar: function (name) {
            return $.getUrlVars()[name];
        }
    });

}
//#endregion

//#region -- 取得編輯頁面編輯完後回到對應的ListPage名稱 --
/*
範例：
編輯頁面檔名：OldExam.aspx
返回ListPage名稱：OldExamList.aspx
*/
function getListPageName() {

    var ListPageName = "";
    var pathname = $(location).attr('pathname');
    var pathname_arr = pathname.split('/');

    ListPageName = pathname_arr[pathname_arr.length - 1];
    var ListPageName_arr = ListPageName.split('.');
    ListPageName = ListPageName_arr[0] + "List." + ListPageName_arr[1];


    return ListPageName;

}
//#endregion

//#region -- 取得編輯頁面編輯完後回到對應的ListPage名稱 --
/*
範例：
編輯頁面檔名：OldExam.aspx
返回ListPage名稱：OldExamList.aspx
*/
function getPageName() {

    var ListPageName = "";
    var pathname = $(location).attr('pathname');
    var pathname_arr = pathname.split('/');

    ListPageName = pathname_arr[pathname_arr.length - 1];
    ListPageName = ListPageName.toLowerCase().replace('list', '');


    return ListPageName;

}
//#endregion

//#region -- 取得使用者瀏覽器 --
/* 使用方式：
1.取得單一參數的數值 var value_name = $.getUrlVar("value_name");
*/
function getBrowser() {

    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
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


}
//#endregion

//#region -- 取得指定日期(西元)為哪個學年度 --
/* 使用方式：
1.取得單一參數的數值 var value_name = $.getUrlVar("value_name");
*/
function getAcademicYear(DateTimeValue) {
    var AcademicYear = "";
    DateTimeValue = new Date(DateTimeValue);
    var year = DateTimeValue.getYear() + 1900;
    var year_ch = year - 1911;
    var month = DateTimeValue.getMonth() + 1;
    //console.dir(DateTimeValue);
    //console.dir(year_ch);
    //console.dir(month);

    if (month < 7)
        AcademicYear = year_ch - 1;
    else
        AcademicYear = year_ch;


    return AcademicYear;


}

//#endregion

//#region -- JS POST NEW window(JS透過POST方式傳送資料到新開視窗) --
/* 使用方式：
JsWebPost(url, ary);
url：要post的網址
object_array：要傳送的object id名稱陣列
*/
function JsWebPost(url, object_array, name, model) {
    var keys = [];
    var values = [];
    for (i = 0; i < object_array.length; i++) {
        keys[i] = object_array[i];
        values[i] = document.getElementById(keys[i]).value;
    }



    openWindowWithPost(url, name, keys, values, model);
}
function openWindowWithPost(url, name, keys, values, model) {


    var newWindow = window.open(url, name, model);
    if (!newWindow) return false;

    var html = "";
    html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";
    if (keys && values && (keys.length == values.length))
        for (var i = 0; i < keys.length; i++)
            html += "<input type='hidden' id='" + keys[i] + "' name='" + keys[i] + "' value='" + values[i] + "'/>";
    html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
    newWindow.document.write(html);

    return newWindow;
}

//#endregion

//#region -- 呼叫JS下載檔案 --
/* 
參考網址：http://www.codingforums.com/javascript-programming/285618-output-byte-array-pdf-javascript.html
使用方式：
download("hello world", "test.txt", "text/plain")
*/
function download_TXT(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) {
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function () {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    } /* end if('download' in a) */
    ; //end if a[download]?

    //do iframe dataURL download:
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function () {
        D.body.removeChild(f);
    }, 333);
    return true;
} /* end download() */

/* 
參考網址：https://sites.google.com/site/dineshkumarwin/convertbytearrayaspdf
使用方式：
download_PDF(Convert.ToBase64String(ms.GetBuffer()), "test.pdf", "application/pdf")
*/
function download_PDF(strData, strFileName, strMimeType) {
    var D = document, A = arguments, a = D.createElement("a"),
         d = A[0], n = A[1], t = A[2] || "application/pdf";
    alert("");
    var newdata = "data:" + strMimeType + ";base64," + escape(strData);

    //build download link:
    a.href = newdata;

    if ('download' in a) {
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function () {
            var e = D.createEvent("MouseEvents");

            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
        );
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    };
}

function newopen_PDF(strData, strMimeType) {
    var newdata = "data:" + strMimeType + ";base64," + escape(strData);
    //To open in new window
    window.open(newdata, "_blank");
    return true;
}


//#endregion

//#region -- DateTime Format --
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//#endregion

//#region -- 取得網頁頁面高寬 --
/* 使用方式：
1.;
*/
var MyWindowsWidth = 0, MyWindowsHeight = 0;
function getWindowsSize(value) {

    var myWidth = 0, myHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }

    MyWindowsWidth = myWidth;
    MyWindowsHeight = myHeight;

    if (value == 0 || value.toLowerCase() == "height") {
        return MyWindowsHeight;

    }
    else {
        return MyWindowsWidth;
    }

}
//#endregion

//#region -- 移動陣列 --
/* 使用方式：
 [1,2,3,4,5].move(0,3) gives [2,3,4,1,5].
 [1, 2, 3, 4, 5].move(-1, -2) gives [1, 2, 3, 5, 4].
教學：http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
*/
Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
//#endregion

//#region -- 移動陣列 --
/* 使用方式：
 [1,2,3,4,5].move(0,3) gives [4,2,3,1,5].
*/
Array.prototype.move_jump = function (old_index, new_index) {

    var old_temp = this[old_index];
    var new_temp = this[new_index];

    this.splice(old_index, 1, new_temp);
    this.splice(new_index, 1, old_temp);


    return this; // for testing purposes
};
//#endregion

//#region -- 表格上下合併相同值的欄位(限HTML樣式) --
/* 使用方式：
 $('td[dt="c1"]').rowspan();
 http://www.dotblogs.com.tw/topcat/archive/2009/11/24/12139.aspx
*/
jQuery.fn.rowspan = function (color1, color2) {

    color1 = color1 || '';
    color2 = color2 || '';
    var col = [color1, color2];
    var i = 0;
    var pText = '';
    var sObj;	//預計進行RowSpan物件
    var rcnt = 0;	//計算rowspan的數字
    var tlen = this.length;
    var spancnt = 0;	//計算有幾個做了span
    return this.each(function () {
        i = i + 1;
        rcnt = rcnt + 1;
        //與前項不同
        if (pText != $(this).text()) {
            if (i != 1) {
                //不是剛開始，進行rowspan
                sObj.attr('rowspan', rcnt - 1);
                rcnt = 1;
            }
            //設定要rowspan的物件
            sObj = $(this);
            pText = $(this).text();
            sObj.css('background-color', col[spancnt % 2]);
            spancnt++;
        }
        else {
            $(this).hide();
        }

        if (i == tlen) {
            sObj.attr('rowspan', rcnt + 1);
        }
    });
};
//#endregion

//#region -- 網頁編碼加密 --
/* 使用方式：
1.;
*/
function htmlEncode(value) {
    "use strict";
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}
//#endregion

//#region -- 網頁編碼解密 --
/* 使用方式：
1.;
*/
function htmlDecode(value) {
    "use strict";
    return $('<div/>').html(value).text();
}
//#endregion