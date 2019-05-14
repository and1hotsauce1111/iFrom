$(function () {

    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
        LeftSelect: 'QuestionnaireList'
    });


    //取API
    var test = [];
    axios.get('http://localhost:3000/questionnaire').then(function (res) {
        res.data.forEach(function (item) {
            test.push({
                id: item.id,
                questionnaireDesc: item.questionnaireDesc,
                allQuestionnaireData: item.allQuestionnaireData,
                name: item.questionnaireTitle,
                start: item.questionnaireStartTime || '<span style="color:#f00">未設定起始日期</span>',
                end: item.questionnaireDeadline || '<span style="color:#f00">未設定截止日期</span>',
                repeat: item.repeatAnswer ? '<span style="color:#009149"><i class="fa fa-check"></i>可重複填答</span></span>' : '<span style="color:#f00"><i class="fa fa-times"></i>不行重複填答</span></span>'
            });
        });

        //建立列表
        listBuild('list'); //default以列表顯示
    });



    //列表元件
    //渲染用data
    //var test = [
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/10', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span></span>' },
    //    { name: '台北六年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span></span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台北六年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/5/20', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '台中九年級學習特質問卷', date: '2019/4/10', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台中九年級學習特質問卷', date: '2019/6/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台北六年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/6/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '台中九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台中九年級學習特質問卷', date: '2019/5/20', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台中九年級學習特質問卷', date: '2019/4/10', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '台南七年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台南七年級學習特質問卷', date: '2019/5/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台南七年級學習特質問卷', date: '2019/5/10', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '台南七年級學習特質問卷', date: '2019/6/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/6/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#f00">未發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '台南七年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#009149"><i class="fa fa-check"></i>可</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //    { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '<span style="color:#009149">已發佈</span>', repeat:'<span style="color:#f00"><i class="fa fa-times"></i>否</span>' },
    //];


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
                if (ReSearch) {
                    //$('#keyword').val(ReSearch.keyword);
                    //$('#keyword2').val(ReSearch.keyword2);
                    //$('#keyword3').val(ReSearch.keyword3);
                    //$('#keyword4').val(ReSearch.keyword4);
                }
                //讀取介面上的物件數值傳送到 Search 變數之中
                var Search = {
                    keyword: $('#keyword').val(),
                    keyword2: $('#keyword2').val(),
                    keyword3: $('#keyword3').val(),
                    keyword4: $('#keyword4').val(),
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
                    var checkC = false;
                    var checkD = false;

                    if (Option.Search['keyword'] == '' || test[i]['name'].match(Option.Search['keyword'])) {
                        checkA = true;
                    }
                    if (Option.Search['keyword2'] == '' || test[i]['start'].match(Option.Search['keyword2'])) {
                        checkB = true;
                    }
                    if (Option.Search['keyword3'] == '' || test[i]['end'].match(Option.Search['keyword3'])) {
                        checkC = true;
                    }
                    if (Option.Search['keyword4'] == '' || test[i]['repeat'].match(Option.Search['keyword4'])) {
                        checkD = true;
                    }


                    if (checkA && checkB && checkC && checkD) {
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
                    var checkC = false;
                    var checkD = false;

                    //未輸入搜尋條件默認為true
                    if (Option.Search['keyword'] == '' || test[i]['name'].match(Option.Search['keyword'])) {
                        checkA = true;
                    }
                    if (Option.Search['keyword2'] == '' || test[i]['start'].match(Option.Search['keyword2'])) {
                        checkB = true;
                    }
                    if (Option.Search['keyword3'] == '' || test[i]['end'].match(Option.Search['keyword3'])) {
                        checkC = true;
                    }
                    if (Option.Search['keyword4'] == '' || test[i]['repeat'].match(Option.Search['keyword4'])) {
                        checkD = true;
                    }

                    if (checkA && checkB && checkC && checkD) {
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

    //清空查詢列
    TableListClear = function () {

        $('#keyword').val('');
        $('#keyword2').val('');
        $('#keyword3').val('');
        $('#keyword4').val('');

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

    //編輯問卷
    editQuestionnaire = function (dom) {
        var id = $(dom).attr('data-index');
        window.location.href = 'AddQuestionnire.aspx?surveyId=' + id + '';
        //var id = '';
        ////找到相對應問卷id
        //for (var i = 0; i < test.length; i++) {
        //    if (test[i].id == array[0].id) {
        //        id = test[i].id;
        //        break;
        //    }
        //}
        //var array = TableListGetCheck('列表元件');
        //if (array.length === 0) {
        //    //不可同時編輯超過1筆
        //    alertBox({
        //        Mode: 'A',
        //        Title: '<i class="fa fa-times"></i>&nbsp;錯誤提示',
        //        Html: '<p style="font-size:18px;color:#ff6a00">尚未選擇問卷 !</p>'
        //    });
        //} else if (array.length > 1) {
        //    //不可同時編輯超過1筆
        //    alertBox({
        //        Mode: 'A',
        //        Title: '錯誤提示',
        //        Html: '<p style="font-size:18px;color:#ff6a00">不可同時編輯超過一筆!</p>'
        //    });
        //} else {
        //    var id = '';
        //    //找到相對應問卷id
        //    for (var i = 0; i < test.length; i++) {
        //        if (test[i].id == array[0].id) {
        //            id = test[i].id;
        //            break;
        //        }
        //    }

        //    window.location.href = 'AddQuestionnire.aspx?surveyId=' + id + '';
        //}
    };

    //刪除問卷
    delQuestionnaire = function (index) {
        var array = TableListGetCheck('列表元件');
        if (array.length === 0) {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-times"></i>&nbsp;錯誤提示',
                OutsideStyle: 'max-width:500px',
                Html: '<p style="font-size:18px;color:#ff6a00">尚未選擇問卷 !</p>',
            });
        } else {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;刪除問卷',
                OutsideStyle: 'max-width:500px',
                Html: '<p style="font-size:18px;color:#ff6a00">確定刪除問卷 ?</p>',
                OnOK: function () {

                    var array = TableListGetCheck('列表元件');

                    for (var i = 0; i < array.length; i++) {
                        axios.delete('http://localhost:3000/questionnaire/' + array[i].id + '').then(function (res) {
                            console.log(res.data);
                        });

                        //刪除test資料
                        for (var j = 0; j < test.length; j++) {
                            if (test[j].id == array[i].id) {
                                test.splice(j, 1);
                                break;
                            }
                        }

                    }

                    //呼叫TableListRun重新建立列表
                    //TableListRun('列表元件');
                    window.location.reload();

                }
            });
        }
    };

    //複製問卷
    copyQuestionnaire = function (index) {

        var array = TableListGetCheck('列表元件');
        if (array.length === 0) {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-times"></i>&nbsp;錯誤提示',
                OutsideStyle: 'max-width:500px',
                Html: '<p style="font-size:18px;color:#ff6a00">尚未選擇問卷 !</p>',
            });
        } else {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < test.length; j++) {

                    if (test[j].id == array[i].id) {
                        //重新設定問卷id和問題id
                        test[j].id = _uuid();
                        for (var k = 0; k < test[j].allQuestionnaireData.length; k++) {
                            for (var m = 0; m < test[j].allQuestionnaireData[k].questionDataPerPage.length; m++) {
                                for (var n = 0; n < test[j].allQuestionnaireData[k].questionDataPerPage[m].pageQuestionData.length; n++) {
                                    test[j].allQuestionnaireData[k].questionDataPerPage[m].pageQuestionData[n].id = _uuid();
                                }
                            }
                        }

                        //更新資料庫
                        var copy = {
                            id: test[j].id,
                            questionnaireTitle: test[j].name + ' - 副本',
                            questionnaireDesc: test[j].questionnaireDesc,
                            questionnaireDeadline: test[j].end,
                            questionnaireStartTime: test[j].start,
                            repeatAnswer: test[j].repeatAnswer,
                            allQuestionnaireData: test[j].allQuestionnaireData,
                        };

                        //更新列表
                        var newListData = {
                            id: test[j].id,
                            name: test[j].name + ' - 副本',
                            repeat: test[j].repeatAnswer ? '<span style="color:#009149"><i class="fa fa-check"></i>可重複填答</span></span>' : '<span style="color:#f00"><i class="fa fa-times"></i>不行重複填答</span></span>',
                            questionnaireDesc: test[j].questionnaireDesc,
                            allQuestionnaireData: test[j].allQuestionnaireData,
                            start: test[j].start || '<span style="color:#f00">未設定起始日期</span>',
                            end: test[j].end || '<span style="color:#f00">未設定截止日期</span>',
                        };

                        //更新到資料庫
                        axios.post('http://localhost:3000/questionnaire/', copy).then(function (res) {
                            console.log(res.data);
                        });

                        //更新test資料
                        test.push(newListData);

                        break;
                    }
                }
            }

            //呼叫TableListRun重新建立列表
            //TableListRun('列表元件');
            window.location.reload();
        }


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