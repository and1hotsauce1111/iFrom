$(function () {

    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
        LeftSelect: 'AnswerQuestionnaireList'
    });


    //取API
    var test = [];
    axios.get(getQuestionnaire).then(function (res) {
        res.data.forEach(function (item) {
            test.push({
                id: item.id,
                questionnaireDesc: item.questionnaireDesc,
                allQuestionnaireData: item.allQuestionnaireData,
                repeatAnswer: item.repeatAnswer,
                publicQuestionnaire: item.publicQuestionnaire,
                name: item.questionnaireTitle,
                start: item.questionnaireStartTime || '<span style="color:#f00">未設定起始日期</span>',
                end: item.questionnaireDeadline || '<span style="color:#f00">未設定截止日期</span>',
                status: item.publicQuestionnaire == 'true' ? '<span style="color:#009149">已發佈</span>' : '<span style="color:#f00">未發佈</span>',
                repeat: item.repeatAnswer ? '<span style="color:#009149"><i class="fa fa-check"></i>可重複填答</span></span>' : '<span style="color:#f00"><i class="fa fa-times"></i>不行重複填答</span></span>'
            });
        });

        //建立列表
        listBuild('list'); //default以列表顯示
    });



    //列表元件
    //渲染用data

    //選取要複製的列表模板
    var listHtml = $('#listType').html();
    var squareHtml = $('#squareType').html();

    //初始化確定innerHTML為空
    $('#listType').empty();
    $('#squareType').empty();

    //建立查詢列表
    var listBuild = function (type) {

        //清空渲染列表的容器
        $('#listView').empty();
        if (type == 'list') {
            $('#listView').html(listHtml);
        }
        if (type == 'block') {
            $('#listView').html(squareHtml);
        }


        TableListBuild({
            Name: '列表元件',
            Recover: true,
            GetSearch: function (ReSearch) {
                //開啟 Recover 功能時需要將記錄的資料套用回介面上的物件

                //讀取介面上的物件數值傳送到 Search 變數之中
                var Search = {
                    keyword: $('#keyword').val() || $('#keyword_mobile').val()
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

                    if (Option.Search['keyword'] == '' ||
                        test[i]['name'].match(Option.Search['keyword']) ||
                        test[i]['end'].match(Option.Search['keyword']) ||
                        test[i]['repeat'].match(Option.Search['keyword'])) {
                        checkA = true;
                    }


                    if (checkA) {
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

                    //未輸入搜尋條件默認為true
                    if (Option.Search['keyword'] == '' ||
                        test[i]['name'].match(Option.Search['keyword']) ||
                        test[i]['end'].match(Option.Search['keyword']) ||
                        test[i]['repeat'].match(Option.Search['keyword'])) {
                        checkA = true;
                    }

                    if (checkA) {
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

    //監聽mobile search event
    $('#search_mobile_btn').click(function () {
        $(this).hide();
        $('#reset_mobile_btn').show();
    })

    //清空查詢列
    TableListClear = function () {

        $('#keyword').val('');
        $('#keyword_mobile').val('');

        //隱藏/顯示mobile btn
        $('#reset_mobile_btn').hide();
        $('#search_mobile_btn').show();

        TableListRun('列表元件');
    };

    //改變列表形式
    listModeBtn = function (type) {
        if (type == 'list') {
            listBuild('block');
        }
        if (type == 'block') {
            listBuild('list');
        }
    };

    /* 問卷操作功能 */

    //填答問卷
    answerQuestion = function (dom) {
        var id = $(dom).attr('data-index');
        window.location.href = 'Answer.aspx?surveyId=' + id + '';
    };

    //預覽問卷
    viewAnswer = function (dom) {
        var id = $(dom).attr('data-index');
        window.location.href = 'viewAnswer.aspx?surveyId=' + id + '';
    };

    //手機板問卷資訊
    mobileInfo = function (dom) {
        alertBox({
            Mode: 'A',
            Title: '<i class="fa fa-exclamation-circle"></i>&nbsp;問卷資訊',
            Html: $('#mobile_info'),
            OnRun: function () {
                var id = $(dom).attr('data-index');
                var target = test.filter(function (item) {
                    return item.id == id;
                });

                $('#deadline').html('截止日期: ' + target[0].end);
                $('#repeat').html('問卷設置: ' + target[0].repeat);
            }
        });
    };



    /* 方塊列表 */
    //顯示編輯選項
    showEidtTools = function (e) {
        e.stopPropagation();
        if ($(e.target).parent().siblings('.show_questionnaire_tools_options').css('display') == 'none') {
            $(e.target).parent().siblings('.show_questionnaire_tools_options').css({ 'display': 'block' });
            $(e.target).parent().siblings('.show_questionnaire_tools_options').css({ 'top': e.offsetY + 'px' });
            $(e.target).parent().siblings('.show_questionnaire_tools_options').css({ 'right': (e.offsetX - 100) + 'px' });
        } else {
            $(e.target).parent().siblings('.show_questionnaire_tools_options').css({ 'display': 'none' });
        }
    };

    //關閉編輯選項
    closeEditTools = function (e) {
        $(e.target).parent().parent().parent().css({ 'display': 'none' });
    };

    //點擊空白處關閉
    $(document).on('click', function (e) {
        var _target = $('.show_questionnaire_tools_options');
        if (!_target.is(e.target) && _target.has(e.target).length === 0) {
            $('.show_questionnaire_tools_options').css({ 'display': 'none' });
        }
    });


});