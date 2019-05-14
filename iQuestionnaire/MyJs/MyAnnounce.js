$(function () {

    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
        LeftSelect: 'MyAnnounce'
    });

    //渲染列表data
    var test = [];
    //顯示公告用data
    var temp;
    axios.get('http://localhost:5566/announce').then(function (res) {

        temp = res.data;

        res.data.forEach(function (item) {
            test.push({
                id: item.id,
                name: item.type == '置頂消息' ? '<div><span style="display: inline-block;;width:40px;background-color:#F6A800;border-radius:7px 7px 7px 7px;color:#fff;font-size:14px;text-align:center">TOP</span>&nbsp;' + item.title + '</div>' : item.title,
                date: item.time,
                type: '<span style="color:#FF6A00">' + item.type + '</span>',
                status: item.status == '啟用' ? '<span style="color:#009149"><i class="fa fa-check"></i>啟用</span></span>' : '<span style="color:#f00"><i class="fa fa-times"></i>停用</span></span>',
                content:item.content
            });

        });

        myAnnounceListBuild();
    });

    var myAnnounceListBuild = function () {
        TableListBuild({
            Name: '列表元件',
            Recover: true,
            GetSearch: function (ReSearch) {
                //開啟 Recover 功能時需要將記錄的資料套用回介面上的物件
                if (ReSearch) {
                    //$('#announce_keyword').val(ReSearch.keyword);
                    //$('#announce_keyword2').val(ReSearch.keyword2);
                }
                //讀取介面上的物件數值傳送到 Search 變數之中
                var Search = {
                    keyword: $('#my_announce_keyword').val(),
                    keyword2: $('#my_announce_keyword2').val(),
                }

                return Search;
            },
            GetCount: function (Option) {
                //執行讀取動畫 (範例)
                //NProgress.start();
                //設定Ajax要傳輸的資料 (此處須包含 Search 參數才會撈出正確的總筆數)
                //var tempData = {
                //    Type: 'GetCount',
                //    //KeyWord: Option.Search.KeyWord,
                //    //KeyWord2: Option.Search.KeyWord2,
                //};


                var tempA = [];

                for (var i = 0; i < test.length; i++) {

                    var checkA = false;
                    var checkB = false;

                    if (Option.Search['keyword'] == '' || test[i]['name'].match(Option.Search['keyword'])) {
                        checkA = true;
                    }
                    if (Option.Search['keyword2'] == '' || test[i]['date'].match(Option.Search['keyword2'])) {
                        checkB = true;
                    }



                    if (checkA && checkB) {
                        tempA.push(test[i]);
                    }

                }


                return tempA.length;
            },
            GetData: function (Option) {
                //執行讀取動畫 (範例)
                //NProgress.start();
                //設定Ajax要傳輸的資料 (其中 Offset、Fetch 為 SQL 查詢資料時所需要之參數 )
                //var tempData = {
                //    Type: 'GetData',
                //    Offset: Option.Offset,
                //    Fetch: Option.Fetch,
                //    KeyWord: Option.Search.KeyWord,
                //    KeyWord2: Option.Search.KeyWord2,
                //};
                //var DataArray = tools.ajax(tempData, ashxPath).Data;

                var tempA = [];
                for (var i = 0; i < test.length; i++) {

                    //驗證的開關
                    var checkA = false;
                    var checkB = false;

                    //未輸入搜尋條件默認為true
                    if (Option.Search['keyword'] == '' || test[i]['name'].match(Option.Search['keyword'])) {
                        checkA = true;
                    }
                    if (Option.Search['keyword2'] == '' || test[i]['date'].match(Option.Search['keyword2'])) {
                        checkB = true;
                    }


                    if (checkA && checkB) {
                        tempA.push(test[i]);
                    }

                }

                var array = [];

                for (var i = 0; i < tempA.length; i++) {
                    var row = i + 1;
                    if (row > Option.Offset &&
                        row <= (Option.Offset + Option.Fetch)) {

                        array.push(tempA[i]);

                    }
                }

                return array;
            },
            OnEnd: function () {
                //完成查詢時所執行之回調函數放此處
                //結束讀取動畫 (範例)
                //NProgress.done();
                $('.tableDisplayNone').show();
                $('#LoadingBox').hide();
            },
        });

    };

    //清除查詢
    TableListClear = function () {

        $('#my_announce_keyword').val('');
        $('#my_announce_keyword2').val('');

        TableListRun('列表元件');
    };


    //顯示公告內容
    showAnnounce = function (index) {
        alertBox({
            Mode: 'A',
            Title: '<i class="fa fa-rss" style="padding-right:3px"></i>公告消息',
            OutsideStyle: 'max-width:850px',
            Html: $('#show_announce'),
            OnRun: function () {
                $('.AlertBoxDivHtml').addClass('adjust');
                $('#announce_title').html(temp[index].title);
                $('#announce_publish_time').html('發佈日期: ' + temp[index].time);
                $('#annoucne_content').append(temp[index].content);
            }
        });
    };





});