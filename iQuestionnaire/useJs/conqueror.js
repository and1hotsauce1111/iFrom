/* 
 ConquerorJS Ver 1.0.0

 取名為 conqueror 並不是想征服誰
 只是想強迫自己去學習、理解平時很少會用到的東西
 征服自己的惰性XDDDD
*/

$(function () {
    $.cq.compiler();
});

//架框核心
$.extend({
    cq: {

        //物件編譯 (使用方式：$.cq.compiler('#conqueror'))
        compiler: function (scope) {

            //若無設定範圍 就預設為 body
            scope = scope ? scope : 'body';


            var start = $.cq.setting.strFormat.start;
            var end = $.cq.setting.strFormat.end;


            if (start != '' && end != '') {

                // str 編譯
                var regex = new RegExp(start + '.*?' + end, 'g');
                //抓取所有標籤
                var strArray = $(scope).html().match(regex);
                if (strArray) {
                    for (var j = 0; j < strArray.length; j++) {

                        //容器計數器++
                        $.cq.count++;

                        var path = '<!--$cqStart:' + $.cq.count + '-->' + '<!--$cqEnd:' + $.cq.count + '-->';
                        var regex2 = $.cq.regExp(strArray[j], 'g');

                        //賦予地址
                        $(scope).html($(scope).html().replace(regex2, path));

                        //儲存變數
                        $.cq.container[$.cq.count] = {
                            type: 'str',                                                //類別
                            tag: strArray[j],                                           //標籤
                            variable: strArray[j].replace(start, '').replace(end, '')   //變數 (要處理htmlcode)
                                                 .replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'),
                        };

                    }
                }

            } else {
                console.info('[$.cq.setting.strFormat]設定錯誤!!');
            }


            //主動執行 畫面渲染
            $.cq.apply(scope);

            //console.dir($.cq.container)

        },
        //畫面渲染
        apply: function (scope) {

            //若無設定範圍 就預設為 body
            scope = scope ? scope : 'body';


            //依序渲染所有物件
            var array = $.cq.container;
            for (var i in array) {

                // str 渲染
                if (array[i].type === 'str') {

                    var regex2 = new RegExp('<!--\\$cqStart:' + i + '-->.*?<!--\\$cqEnd:' + i + '-->', 'g');

                    //預設為空白
                    var variable = undefined;
                    //嘗試取得變數
                    try { variable = $.cq.eval($.cq.eval('$.cq.container[' + i + '].variable')); } catch (e) { }

                    //套用
                    $(scope).html($(scope).html().replace(regex2, '<!--$cqStart:' + i + '-->' + variable + '<!--$cqEnd:' + i + '-->'));

                }

            }

        },

        //==========================================================================

        //設定檔
        setting: {
            //自定義套用語法格式
            strFormat: { start: '{{', end: '}}' },
        },
        //容器計數器
        count: 0,
        //變數容器
        container: {},

        //==========================================================================

        //包含特殊符號過濾 的 正規式宣告 (抓取標籤專用)
        regExp: function (regex, type) {
            return new RegExp(regex.replace(/\\/g, '\\\\').replace(/\//g, '\\/').replace(/\^/g, '\\^').replace(/\$/g, '\\$')
                                   .replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
                                   .replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\./g, '\\.').replace(/\*/g, '\\*')
                                   .replace(/\+/g, '\\+').replace(/\?/g, '\\?').replace(/\|/g, '\\|'), type);
        },
        //自訂 eval
        eval: function (str) {
            var fn = Function;
            return new fn('return ' + str)();
        },
    },
});
