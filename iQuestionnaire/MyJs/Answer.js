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

                //判斷有沒有必填

                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData;
                for (var i = 0; i < target.length; i++) {
                    if (target[i].type !== 'textarea') {
                        if (target[i].required === 'true') {

                            if (target[i].isSelect === '' || target[i].isSelect.length === 0) {
                                $('#q-' + target[i].questionNum).addClass('warn');
                                //減去頂部menu的高度
                                var top = $('#q-' + target[i].questionNum).offset().top - 150;
                                $('body,html').animate({
                                    scrollTop: top
                                }, 300);
                                this.check = false;
                                break;
                            }
                        }

                    } else {
                        if (target[i].required === 'true') {
                            if (target[i].answerVal === '') {
                                $('#q-' + target[i].questionNum).addClass('warn');
                                //減去頂部menu的高度
                                var top = $('#q-' + target[i].questionNum).offset().top - 150;
                                $('body,html').animate({
                                    scrollTop: top
                                }, 300);
                                this.check = false;
                                break;
                            }

                        }

                    }
                }

                //條件單獨拉出來判斷
                if (this.check == true) {
                    vm.nowPage++;
                    //移到最上方
                    $('html,body').animate({
                        scrollTop: 0
                    }, 300);
                }
            },
            singleInputVal: function (optionId, index, number, type) {

                //取消警告樣式
                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData;
                for (var i = 0; i < target.length; i++) {
                    if (target[i].type !== 'textarea') {
                        if (target[i].required === 'true') {
                            if (target[i].isSelect !== '' || target[i].isSelect.length !== 0) {
                                $('#q-' + target[i].questionNum).removeClass('warn');
                                this.check = true;
                                continue;
                            }
                        }

                    } else {
                        if (target[i].required === 'true') {
                            if (target[i].answerVal !== '') {
                                $('#q-' + target[i].questionNum).removeClass('warn');
                                this.check = true;
                                continue;
                            }

                        }

                    }
                }

                //取的該題的邏輯設定
                var logicSetting = this.allQuestionnaireData[this.nowPage - 1].questionDataPerPage.pageQuestionData[index].showLogicCount;

                if (logicSetting.length !== 0) {

                    var jumpId = ''; //跳至題目的id
                    var jumpNum = 0; //跳至題目的num
                    var jumpToPage = 0; //要跳至的頁面
                    var jumpAll = null; //有設定任意跳題


                    if (type === 'pulldown') {

                        //取得下拉和文本題的id
                        if (logicSetting[0].allJump[0] == '任意選項') { //任意選項跳題
                            jumpAll = true;
                            jumpId = logicSetting[0].jumpTo.id[0];
                        } else {
                            for (var i = 0; i < logicSetting.length; i++) {
                                if (logicSetting[i].triggerOption.val[0] == optionId) {
                                    jumpId = logicSetting[i].jumpTo.id[0];
                                    break;
                                }
                            }
                        }

                        //取得跳至題目的num,page
                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.id == jumpId) {
                                    jumpNum = item.questionNum;
                                    jumpToPage = page.page;
                                }
                            });
                        });

                    }


                    if (type === 'checkbox') {

                        //取得多選題的id
                        if (logicSetting[0].allJump[0] == '任意選項') {//任意選項跳題
                            jumpAll = true;
                            jumpId = logicSetting[0].jumpTo.id[0];
                        } else {
                            //重新排序陣列
                            var newArr = optionId.sort().toString();
                            for (var i = 0; i < logicSetting.length; i++) {
                                if (logicSetting[i].triggerOption.id.sort().toString() === newArr) {
                                    jumpId = logicSetting[i].jumpTo.id[0];
                                    break;
                                }
                            }
                        }

                        //取得跳至題目的num,page
                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.id == jumpId) {
                                    jumpNum = item.questionNum;
                                    jumpToPage = page.page;
                                }
                            });
                        });
                    }


                    if (type === 'radio') {
                        //任意選項跳題
                        if (logicSetting[0].allJump[0] == '任意選項') {
                            jumpAll = true;
                            jumpId = logicSetting[0].jumpTo.id[0];
                        } else {
                            for (var i = 0; i < logicSetting.length; i++) {
                                if (logicSetting[i].triggerOption.id[0] == optionId) {
                                    jumpId = logicSetting[i].jumpTo.id[0];
                                    break;
                                }
                            }
                        }

                        //取得跳至題目的num,page
                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.id == jumpId) {
                                    jumpNum = item.questionNum;
                                    jumpToPage = page.page;
                                }
                            });
                        });

                    }

                    //判斷是否選到跳題
                    //任意選項跳題
                    if (jumpNum !== 0 || jumpAll == true) {
                        vm.allQuestionnaireData.forEach(function (page) {
                            var data = page.questionDataPerPage.pageQuestionData;

                            for (var i = 0; i < data.length; i++) {

                                if (number < data[i].questionNum && data[i].questionNum < jumpNum) {
                                    console.log('jump');
                                    //移除提示紅框
                                    if ($('#q-' + data[i].questionNum).hasClass('warn')) {
                                        $('#q-' + data[i].questionNum).removeClass('warn');
                                    }

                                    if (data[i].type === 'radio') {
                                        $('#q-' + data[i].questionNum).find('input[type="radio"]').attr('disabled', true);
                                        data[i].isSelect = 'jump';
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });
                                    }

                                    if (data[i].type === 'checkbox') {
                                        $('#q-' + data[i].questionNum).find('input[type="checkbox"]').attr('disabled', true);
                                        data[i].isSelect = ['jump'];
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });
                                    }

                                    if (data[i].type === 'pulldown') {
                                        $('#q-' + data[i].questionNum).find('button').attr('disabled', true);
                                        data[i].isSelect = 'jump';
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });

                                    }

                                    if (data[i].type === 'textarea') {
                                        $('#q-' + data[i].questionNum).find('textarea').attr('disabled', true);
                                        data[i].answerVal = 'jump';
                                        $('#q-' + data[i].questionNum).css({ 'color': '#ccc' });

                                    }
                                }

                            }

                        });

                        //跳至跳題頁
                        vm.nowPage = jumpToPage;
                        var top = document.querySelector('#q-' + jumpNum).offsetTop - 100;
                        $('body,html').animate({ scrollTop: top }, 500);
                        window.setTimeout(function () {                       
                            //Highlight動畫
                            $('#q-' + jumpNum).removeClass('highlight');
                        }, 800);

                        //先加class, setTimeout後取消
                        $('#q-' + jumpNum).addClass('highlight');

                        return false;
                    }

                    //取消該選項題目的跳題
                    //找跳題題號
                    var cancelJumpNum = [];
                    for (var n = 0; n < vm.allQuestionnaireData.length; n++) {
                        var item = vm.allQuestionnaireData[n].questionDataPerPage.pageQuestionData;
                        for (var m = 0; m < logicSetting.length; m++) {
                            for (var j = 0; j < item.length; j++) {
                                if (logicSetting[m].jumpTo.id[0] == item[j].id) {
                                    cancelJumpNum.push(item[j].questionNum);
                                }
                            }
                        }
                    }
                    //取jumpNum最大值
                    var max = cancelJumpNum.reduce(function (prev, cur) {
                        return prev > cur ? prev : cur;
                    });

                    vm.allQuestionnaireData.forEach(function (page) {
                        var data = page.questionDataPerPage.pageQuestionData;

                        for (var i = 0; i < data.length; i++) {

                            if (number < data[i].questionNum && data[i].questionNum < max) {

                                if (data[i].type === 'radio') {
                                    $('#q-' + data[i].questionNum).find('input[type="radio"]').removeAttr('disabled');
                                    $('#q-' + data[i].questionNum).removeClass('highlight');
                                    data[i].isSelect = '';
                                    $('#q-' + data[i].questionNum).css({ 'color': '#505050' });
                                }

                                if (data[i].type === 'checkbox') {
                                    $('#q-' + data[i].questionNum).find('input[type="checkbox"]').removeAttr('disabled');
                                    $('#q-' + data[i].questionNum).removeClass('highlight');
                                    data[i].isSelect = [];
                                    $('#q-' + data[i].questionNum).css({ 'color': '#505050' });
                                }

                                if (data[i].type === 'pulldown') {
                                    $('#q-' + data[i].questionNum).find('button').removeAttr('disabled');
                                    $('#q-' + data[i].questionNum).removeClass('highlight');
                                    data[i].isSelect = '';
                                    $('#q-' + data[i].questionNum).css({ 'color': '#505050' });

                                }

                                if (data[i].type === 'textarea') {
                                    $('#q-' + data[i].questionNum).find('textarea').removeAttr('disabled');
                                    $('#q-' + data[i].questionNum).removeClass('highlight');
                                    data[i].isSelect = '';
                                    $('#q-' + data[i].questionNum).css({ 'color': '#505050' });

                                }
                            }

                        }
                    });

                }

            },
            saveAnswer: function () {

                //只有一頁時判斷有無必填
                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData;
                for (var i = 0; i < target.length; i++) {
                    if (target[i].type !== 'textarea') {
                        if (target[i].required === 'true') {

                            if (target[i].isSelect === '' || target[i].isSelect.length === 0) {
                                $('#q-' + target[i].questionNum).addClass('warn');
                                //減去頂部menu的高度
                                var top = $('#q-' + target[i].questionNum).offset().top - 150;
                                $('body,html').animate({
                                    scrollTop: top
                                }, 300);
                                this.check = false;
                                break;
                            }
                        }

                    } else {
                        if (target[i].required === 'true') {
                            if (target[i].answerVal === '') {
                                $('#q-' + target[i].questionNum).addClass('warn');
                                //減去頂部menu的高度
                                var top = $('#q-' + target[i].questionNum).offset().top - 150;
                                $('body,html').animate({
                                    scrollTop: top
                                }, 300);
                                this.check = false;
                                break;
                            }

                        }

                    }
                }

                //必填都填答完畢
                if (this.check == true) {
                    //移除頁面跳轉監聽
                    window.onbeforeunload = null;
                    var surveyId = $.getUrlVar('surveyId');
                    var answers = { id: surveyId, answer: [] };

                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (item) {
                            
                            if (item.type !== 'textarea') {
                                answers.answer.push({
                                    questionId: item.id,
                                    page: page.page,
                                    questionTitle: item.title,
                                    selectVal: item.isSelect
                                });
                            } else {
                                answers.answer.push({
                                    questionId: item.id,
                                    page: page.page,
                                    questionTitle: item.title,
                                    selectVal: item.answerVal
                                });
                            }

                        });
                    });

                    axios.get(getAnswer + surveyId)
                        .then(function (res) {
                            if (res.data != undefined) {
                                axios.patch(postAnswer + surveyId, answers).then(function (res) {
                                    console.log(res);
                                    //window.location.href = 'AnswerQuestionnaireList.aspx?user=user';
                                });
                            }
                        })
                        .catch(function (error) {
                            //找不到資料表示第一次填答
                            axios.post(postAnswer, answers).then(function (res) {
                                window.location.href = 'AnswerQuestionnaireList.aspx?user=user';
                            });
                        });
                }


            }
        }
    });

});