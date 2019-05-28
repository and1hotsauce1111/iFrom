$(function () {

    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
    });


    //監聽頁面刷新
    window.onbeforeunload = function (event) {
        var event = event || window.event;
        if (event) {
            event.returnValue = "確定要刷新頁面? 資料將不被保存";
        }
        return '確定要刷新頁面? 資料將不被保存';
    };


    /* Vue */

    var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                allQuestionnaireData: '',
                questionnaireTitle: '',
                questionnaireDesc: '',
                dropSetting: {
                    ID: '',
                    Data: [],
                    Search: false,
                    ButtonText: '請選擇一個選項',
                },
                dropVal: [],
                dropData: {},
                nowPage: 1, //當前頁面
                select: '',
                ifJump: false, //是否啟動跳題
                check: true //是否有選擇必填題
            }
        },
        created: function () {
            //取得網址id
            getUrlVars();
            var surveyId = $.getUrlVar('surveyId');
            if (surveyId !== undefined) {
                this.getData(surveyId);
            }
        },
        methods: {
            getData: function (id) {

                //取得問卷資料
                //非同步調用this會指向window，改用vm
                axios.get(getQuestionnaire + id + '').then(function (res) {
                    vm.allQuestionnaireData = res.data.allQuestionnaireData;
                    vm.questionnaireTitle = res.data.questionnaireTitle;
                    vm.questionnaireDesc = res.data.questionnaireDesc;

                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            if (question.type === 'pulldown') {

                                var data = [{ Optgroup: '', Option: [] }];

                                question.options.forEach(function (option) {
                                    data[0].Option.push({ Text: option.val, Val: option.val });
                                });

                                vm.dropData[question.id] = data;

                            }
                        });
                    });

                    axios.get(getAnswer + id + '').then(function (res2) {
                        console.log(res2.data.answer);
                        // 回填答案
                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                res2.data.answer.forEach(function (data) {
                                    if (data.questionId == question.id) {
                                        if (question.type !== 'textarea') {
                                            question.isSelect = data.selectVal;
                                        }
                                        if (question.type === 'textarea') {
                                            question.answerVal = data.selectVal;
                                        }
                                    }
                                });
                            });
                        });

                        //disable下拉選單
                        $('.question_content_pulldown button').attr('disabled', true);
                    });

                    

                    $('.answerDisplayNone').show();
                    $('#LoadingBox').hide();


                });
            },
            prevPage: function () {
                this.check = true;
                vm.nowPage--;
                //移到最上方
                $('html,body').animate({
                    scrollTop: 0
                }, 300);
            },
            nextPage: function () {

                //條件單獨拉出來判斷
                if (this.check == true) {
                    vm.nowPage++;
                    //移到最上方
                    $('html,body').animate({
                        scrollTop: 0
                    }, 300);
                }
            },
            cancelView: function () {
                //移除頁面跳轉監聽
                window.onbeforeunload = null;
                window.location.href = 'AnswerQuestionnaireList.aspx?user=user';
            }
        }
    });

});