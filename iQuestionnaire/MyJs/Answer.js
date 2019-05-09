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
                select: ''
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
                axios.get('http://localhost:3000/questionnaire/' + id + '').then(function (res) {
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
                });
            },
            prevPage: function () {
                vm.nowPage--;
            },
            nextPage: function () {

                //判斷有沒有必填

                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData;
                for (var i = 0; i < target.length; i++) {
                    if (target[i].type !== 'textarea') {
                        if (target[i].required === 'true') {
                            if (target[i].isSelect === '' || target[i].isSelect.length === 0) {
                                $('#q-' + target[i].questionNum).addClass('warn');
                                continue;
                            }

                            vm.nowPage++;
                            break;

                        } else {
                            vm.nowPage++;
                            break;
                        }

                    } else {
                        if (target[i].required === 'true') {
                            if (target[i].answerVal === '') {
                                $('#q-' + target[i].questionNum).addClass('warn');
                                continue;
                            }

                            vm.nowPage++;
                            break;

                        } else {
                            vm.nowPage++;
                            break;
                        }


                    }
                }


            },
            singleInputVal: function (optionId, index, number) {

                //取消警告樣式
                if ($('#q-' + number).hasClass('warn')) {
                    console.log('cancel');
                    $('#q-' + number).removeClass('warn');
                }

                var logicSetting = this.allQuestionnaireData[this.nowPage - 1].questionDataPerPage.pageQuestionData[index].showLogicCount;

                if (logicSetting.length !== 0) {

                    //跳至該題的num
                    var jumpId = logicSetting[0].jumpTo.id[0];
                    var jumpNum;

                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (item) {
                            if (item.id == jumpId) jumpNum = item.questionNum;
                        });
                    });



                    if (optionId == logicSetting[0].triggerOption.id[0]) { //選到跳題選項
                        console.log('trigger');
                        //選到跳題選項
                        this.allQuestionnaireData.forEach(function (page) {
                            var data = page.questionDataPerPage.pageQuestionData;

                            for (var i = 0; i < data.length; i++) {

                                if (number < data[i].questionNum && data[i].questionNum < jumpNum) {

                                    if (data[i].type === 'radio') {
                                        $('#q-' + data[i].questionNum).find('input[type="radio"]').attr('disabled', true);
                                        data[i].isSelect = '';
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });
                                    }

                                    if (data[i].type === 'checkbox') {
                                        $('#q-' + data[i].questionNum).find('input[type="checkbox"]').attr('disabled', true);
                                        data[i].isSelect = [];
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });
                                    }

                                    if (data[i].type === 'pulldown') {
                                        $('#q-' + data[i].questionNum).find('button').attr('disabled', true);
                                        data[i].isSelect = '';
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });

                                    }

                                    if (data[i].type === 'textarea') {
                                        $('#q-' + data[i].questionNum).find('textarea').attr('disabled', true);
                                        data[i].answerVal = '';
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });

                                    }
                                }

                            }
                        });

                    } else { //選到非跳題選項
                        console.log('notrigger');

                        this.allQuestionnaireData.forEach(function (page) {
                            var data = page.questionDataPerPage.pageQuestionData;

                            for (var i = 0; i < data.length; i++) {

                                if (number < data[i].questionNum && data[i].questionNum < jumpNum) {

                                    if (data[i].type === 'radio') {
                                        $('#q-' + data[i].questionNum).find('input[type="radio"]').removeAttr('disabled');
                                        $('#q-' + data[i].questionNum).css({ 'color': '#505050' });
                                    }

                                    if (data[i].type === 'checkbox') {
                                        $('#q-' + data[i].questionNum).find('input[type="checkbox"]').removeAttr('disabled');
                                        $('#q-' + data[i].questionNum).css({ 'color': '#505050' });
                                    }

                                    if (data[i].type === 'pulldown') {
                                        $('#q-' + data[i].questionNum).find('button').removeAttr('disabled');
                                        $('#q-' + data[i].questionNum).css({ 'color': '#505050' });

                                    }

                                    if (data[i].type === 'textarea') {
                                        $('#q-' + data[i].questionNum).find('textarea').removeAttr('disabled');
                                        $('#q-' + data[i].questionNum).css({ 'color': '#505050' });

                                    }
                                }

                            }
                        });
                    }
                }


            },
            saveAnswer: function () {

                //移除頁面跳轉監聽
                window.onbeforeunload = null;

                var answer = [];

                vm.allQuestionnaireData.forEach(function (page) {
                    page.questionDataPerPage.pageQuestionData.forEach(function (item) {
                        if (item.type !== 'textarea') {
                            answer.push({
                                questionId: item.id,
                                page: page.page,
                                questionTitle: item.title,
                                selectVal: item.isSelect
                            });
                        } else {
                            answer.push({
                                questionId: item.id,
                                page: page.page,
                                questionTitle: item.title,
                                selectVal: item.answerVal
                            });
                        }

                    });
                });


                axios.post('http://localhost:53000/answer', answer).then(function (res) {
                    console.log('success');
                    window.location.href = 'AnswerQuestionnaireList.aspx?user=user';
                });

            }
        }
    });

});