//過濾函式
filter = {
    //數字驗證
    number: function (str) {
        var regExp = /^[0-9]+$/;
        if (regExp.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    //數字驗證 允許小數點 
    number2: function (str) {
        var regExp = /^[0-9]+$/;
        var regExp2 = /^[0-9]+\.[0-9]+$/;
        var tempCheck = false;
        if (regExp.test(str)) {
            tempCheck = true;
        }
        if (regExp2.test(str)) {
            tempCheck = true;
        }
        return tempCheck;
    },
    //成績驗證 (接受-1)
    score: function (str) {
        //接受 -1
        if (str == '-1') {
            return true;
        }
        if (parseFloat(str) >= 0) {
            return true;
        } else {
            return false;
        }
    },
    //僅接受英文及數字檢查
    englishNumber: function (str) {
        var regExp = /^[0-9a-zA-Z]+$/;
        if (regExp.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    //中華民國身分證格式驗證
    twID: function (value) {
        var pidAlpha = {
            char: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            name: ['臺北市', '臺中市', '基隆市', '臺南市', '高雄市', '新北市', '宜蘭縣', '桃園縣', '嘉義市', '新竹縣', '苗栗縣', '臺中縣', '南投縣', '彰化縣', '新竹市', '雲林縣', '嘉義縣', '臺南縣', '高雄縣', '屏東縣', '花蓮縣', '臺東縣', '金門縣', '澎湖縣', '陽明山管理局', '連江縣'],
            value: ['10', '11', '12', '13', '14', '15', '16', '17', '34', '18', '19', '20', '21', '22', '35', '23', '24', '25', '26', '27', '28', '29', '32', '30', '31', '33']
        }
        var weight = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

        var pid = value.toUpperCase();;

        var patt = /^([A-Z]{1})([0-9]{9})$/;
        if (!patt.test(pid)) {
            return false;
        }

        var index = pidAlpha.char.indexOf(pid.charAt(0));
        if (index == -1) {
            return false;
        }

        var resultSex = '';

        switch (pid.charAt(1)) {
            case '1': resultSex = '男性'; break;
            case '2': resultSex = '女性'; break;
            default:
                return false;
        }

        var npid = pidAlpha.value[index] + pid.substring(1, 10);
        var sum = 0;
        for (var i = 0; i < 11; i++) {
            sum += weight[i] * parseInt(npid.charAt(i));
        }

        if (sum % 10 == 0) {
            return true;
        } else {
            return false;
        }
    },
    //email格式驗證
    email: function (email) {
        reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
        if (reg.test(email)) {
            return true;
        } else {
            return false;
        }
    },
    //市內電話格式驗證
    telephone: function (tel) {
        var regExp = /^0\d{1,3}-\d{6,10}$/;
        if (regExp.test(tel)) {
            return true;
        } else {
            return false;
        }
    },
    //手機格式驗證
    phone: function (tel) {
        var regExp = /^09\d{8}$/;
        if (regExp.test(tel)) {
            return true;
        } else {
            return false;
        }
    },


    //取小數點後N位四捨五入
    formatFloat: function (num, pos) {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    },
    //移除特殊ASCII字元 會造成 WORD轉出錯誤的字碼 (找到之後取代為空白)
    removeSpecialASCII: function (str) {
        var reArray = [
            /\x00/g, /\x01/g, /\x02/g, /\x03/g, /\x04/g, /\x05/g, /\x06/g, /\x07/g, /\x08/g,
            /\x0B/g, /\x0C/g, /\x0E/g, /\x0F/g,
            /\x10/g, /\x11/g, /\x12/g, /\x13/g, /\x14/g, /\x15/g, /\x16/g, /\x17/g, /\x18/g, /\x19/g,
            /\x1A/g, /\x1B/g, /\x1C/g, /\x1D/g, /\x1E/g, /\x1F/g,
        ];
        for (var r = 0; r < reArray.length; r++) {
            if (reArray[r].test(str)) {
                str = str.replace(reArray[r], '');
            }
        }
        return str;
    },
    //產生隨機數字 (pos帶入想要的位數)
    numberRandom: function (pos) {
        var intR = Math.floor(Math.random() * parseInt('1' + new Array(pos + 1).join('0')));
        if (intR.toString().length < pos) {
            return new Array(pos - intR.toString().length + 1).join('0') + intR.toString();
        } else {
            return intR.toString();
        }
    },


    //去除file副檔名
    removeExtension: function (str) {
        if (str) {
            var tempStr = str.split('.');
            tempStr.splice((tempStr.length - 1), 1);
        }
        if (tempStr) {
            return tempStr.join('.');
        } else {
            return '';
        }
    },
    //取得file副檔名
    getExtension: function (filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    //將Ajax功能函數取出的files資料 巢狀結構解析成單一陣列
    filesArrayAnalyze: function (filesArray) {
        var tempArray = [];
        for (var a = 0; a < filesArray.length; a++) {
            for (var b = 0; b < filesArray[a].length; b++) {
                tempArray.push(filesArray[a][b]);
            }
        }
        return tempArray;
    },
};

//工具函式
tools = {
    //Ajax調用函數 (包含檔案上傳、同步、非同步)
    ajax: function (data, ashxPath, callback, progressCallback) {

        // data 放入 object，若資料中有 files 這個項目也可上傳檔案，使用方式 > files: $(fileupload_even)
        // files2 放入 files 陣列，使用方式 > files: $(fileupload_even)[0].files
        // ashxPath 放入 string，例如：yourCode.ashx，或是：yourCode.ashx?a=123&b=456
        // callback 放入 function (rlt) { }
        // progressCallback 放入 function (progress) { } ※ 此為上傳進度
        // async 狀態，若有設定 callback 則為非同步，反之沒有 callback 則為同步

        //非同步判斷
        var async = false;
        if (typeof (callback) == 'function') {
            async = true;
        }
        //宣告同步容器
        var asyncRlt;

        //宣告 formData 物件
        var formData = new FormData();
        //填入檔案
        if (data.files) {
            for (i = 0; i < data.files[0].files.length; i++) {
                formData.append('fileupload', data.files[0].files[i]);
            }
        }
        //填入檔案2
        if (data.files2) {
            for (i = 0; i < data.files2.length; i++) {
                formData.append('fileupload', data.files2[i]);
            }
        }
        //填入參數
        formData.append('JSON_data', JSON.stringify(data));
        //執行調用
        $.ajax({
            url: 'MyAshx/' + ashxPath,
            data: formData,
            method: 'post',
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            async: async,
            success: function (rlt) {
                //執行回傳函數
                if (typeof (callback) == 'function') {
                    callback(rlt);
                } else {
                    asyncRlt = rlt;
                }
            },
            xhr: function () {
                // 建立 XHR 時，加掛 onprogress 事件
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        //執行回傳函數
                        if (typeof (progressCallback) == 'function') {
                            //計算百分比率
                            var progressValue = Math.round(event.loaded / event.total * 100);
                            var tempEvent = {
                                loaded: event.loaded,                                   //上傳量
                                total: event.total,                                     //總計容量
                                percentage: progressValue >= 100 ? 100 : progressValue, //百分比進度
                            };
                            progressCallback(tempEvent);
                        }
                    }
                };
                return xhr;
            },
            error: function (e) {
                console.dir('ajax 連接 ' + ashxPath + ' 時發生錯誤，下列為送入變數以及回傳訊息：')
                console.dir(data)
                console.dir(e)
            },
        });

        return asyncRlt;
    },


    //取得網址參數
    getUrlVar: function (nameKey) {
        var vars = {}, hash;
        var UrlVars = $(location).attr('search');
        if (UrlVars != '') {
            var hashes = UrlVars.slice(UrlVars.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                var hashes_temp = hashes[i];
                hash = hashes_temp.split('=');
                var name = hash[0];
                var value = hashes_temp.substr((name + '=').length);
                //vars.push(name);
                //解決網址有#的問題
                vars[name] = value.replace(/#/g, '');
            }
        }
        return vars[nameKey] ? vars[nameKey] : null;
    },
    //取得使用者瀏覽器
    getBrowser: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        return Sys;
    },


    //日期格式化
    dateFormat: function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,                    //月份 
            "d+": date.getDate(),                         //日 
            "H+": date.getHours(),                        //小时 
            "m+": date.getMinutes(),                      //分 
            "s+": date.getSeconds(),                      //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3),  //季度 
            "S": date.getMilliseconds()                   //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
};

//日期格式化
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
};