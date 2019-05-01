$(function () {

    /* View */

    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
        LeftSelect: 'AddQuestionnaire'
    });

    //工具列選單

    $(document).scroll(function () {
        if ($(this).scrollTop() > 120) {
            $('.tools_bar_mini').css({ 'visibility': 'visible' });
        } else if ($(this).scrollTop() < 100) {
            $('.tools_bar_mini').css({ 'visibility': 'hidden' });
        }
    });

    /* 問卷編輯區塊 */


    //編輯單選題
    editRadio = function (event, status, dom) {

        if (status === 'add') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增單選題',
                OutsideStyle: 'max-width:770px',
                Html: $('#editRadio'),
                OnClose: function (Type) {
                    if (Type == 'ok') {
                        //存每個選項的值
                        var options = [];
                        $('.showEditOptions_radio .input_area input').each(function (index) {
                            options.push({
                                id: _uuid(),
                                val: $(this).val(),
                                jumpLogic: null
                            });
                        });

                        //重複選項的提示
                        var repeatResult = {};
                        options.forEach(function (option) {
                            repeatResult[option.val] = repeatResult[option.val] ? repeatResult[option.val] + 1 : 1;
                        });

                        for (var i in repeatResult) {
                            if (repeatResult[i] > 1) {
                                alertBox({
                                    Mode: 'A',
                                    Html:'<p style="color:#FF6A00">選項重複設定!</p>'
                                });
                                return false;
                            }
                        }
                    }

                    return true;
                },
                OnOK: function () {

                    //是否必填
                    var required = $('input[type="radio"][name="radio1"]:checked').val();

                    //存每個選項的值
                    var options = [];
                    $('.showEditOptions_radio .input_area input').each(function (index) {
                        options.push({
                            id: _uuid(),
                            val: $(this).val(),
                            jumpLogic: null
                        });
                    });


                    if (vm.nowPage === 1) {
                        //初始第一頁
                        vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                            type: 'radio',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#radio_question_title').val(),
                            options: options,
                            required: required,
                            showLogicCount: []
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });



                    } else {
                        vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageQuestionData"].push({
                            type: 'radio',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#radio_question_title').val(),
                            options: options,
                            required: required,
                            showLogicCount: []
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    }


                }
            });
        }

        if (status === 'edit') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯單選題',
                OutsideStyle: 'max-width:770px',
                Html: $('#edit_editRadio'),
                OnReady: function (Code) {

                    if (status == 'edit') {

                        var index = $(dom).attr('data-index');
                        //存問題index
                        $('#edit_eidtRadio_del').html(index);
                        $('#edit_eidtRadio_copy').html(index);

                        var data = {};
                        for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                            if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {
                                data = vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index];
                                break;
                            }
                        }

                        //更新必填
                        var requires = $('input[type="radio"][name="edit_radio1"]');
                        for (var k = 0; k < requires.length; k++) {
                            if (data.required === requires[k].value) {
                                requires[k].checked = 'checked';
                            }
                        }

                        //更新題目

                        $('#edit_radio_question_title').val(data['title']);

                        //存題號
                        //抓當前DOM父層的問題題號標題
                        var questionTitle = $(dom).parents('.showQuestions_unit_tools').siblings('.question_title').html();
                        $('#quesitonNum').html(questionTitle);

                        //更新選項
                        var option = $('.editOptions_wrap#edit_editOptions_wrap_radio').html();

                        $('.editOptions_wrap#edit_editOptions_wrap_radio').empty();


                        for (var j = 0; j < data['options'].length; j++) {
                            $('.editOptions_wrap#edit_editOptions_wrap_radio').append(option);
                        }

                        for (var k = 0; k < data['options'].length; k++) {
                            $('.editOptions_wrap#edit_editOptions_wrap_radio').find('.edit_editRadio_input')[k].value = data['options'][k].val;
                        }
                    }

                },
                OnClose: function (Type) {
                    if (Type == 'ok') {
                        //儲存新選項
                        var newOption = [];

                        var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_editRadio_input');


                        for (var j = 0; j < nodeList.length; j++) {
                            newOption.push({
                                id: _uuid(),
                                val: nodeList[j].value,
                                jumpLogic: null
                            });
                        }

                        //重複選項的提示
                        var repeatResult = {};
                        newOption.forEach(function (option) {
                            repeatResult[option.val] = repeatResult[option.val] ? repeatResult[option.val] + 1 : 1;
                        });


                        for (var i in repeatResult) {
                            if (repeatResult[i] > 1) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">選項重複設定!</p>'
                                });
                                return false;
                            }
                        }
                    }
                },
                OnOK: function () {


                    var index = $(dom).attr('data-index');

                    //是否必填
                    var required = $('input[type="radio"][name="edit_radio1"]:checked').val();

                    //儲存新選項
                    var newOption = [];

                    var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_editRadio_input');


                    for (var j = 0; j < nodeList.length; j++) {
                        newOption.push({
                            id: _uuid(),
                            val: nodeList[j].value,
                            jumpLogic: null
                        });
                    }

                    //更新問題

                    for (var k = 0; k < vm.allQuestionnaireData.length; k++) {
                        if (vm.allQuestionnaireData[k]['page'] == vm.nowPage) {
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].title = $('#edit_radio_question_title').val();
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].options = newOption;
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].required = required;
                            break;
                        }
                    }

                    //跳題題號重新排序
                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            question.options.forEach(function (option) {
                                if (option.jumpLogic !== null) {
                                    vm.allQuestionnaireData.forEach(function (data) {
                                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                            if (item.id == option.jumpLogic.jumpTo.id[0]) {
                                                option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    });

                }
            });
        }


    };

    //編輯多選題
    editCheckbox = function (event, status, dom) {

        if (status === 'add') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增多選題',
                OutsideStyle: 'max-width:770px',
                Html: $('#editCheckbox'),
                OnOK: function () {

                    //是否必填
                    var required = $('input[type="radio"][name="radio2"]:checked').val();

                    //存每個選項的值
                    var options = [];
                    $('.showEditOptions_checkbox .input_area input').each(function (index) {
                        options.push({
                            id: _uuid(),
                            val: $(this).val(),
                            jumpLogic: null
                        });
                    });

                    if (vm.nowPage === 1) {
                        //初始第一頁
                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                            type: 'checkbox',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#checkbox_question_title').val(),
                            options: options,
                            required: required,
                            jumpToQuestion: jumpToQuestion
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    } else {
                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageQuestionData"].push({
                            type: 'checkbox',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#checkbox_question_title').val(),
                            options: options,
                            required: required,
                            jumpToQuestion: jumpToQuestion
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    }

                }
            });

        }

        if (status === 'edit') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯多選題',
                OutsideStyle: 'max-width:770px',
                Html: $('#edit_editCheckbox'),
                OnReady: function (Code) {

                    if (status == 'edit') {

                        var index = $(dom).attr('data-index');
                        var data = {};
                        for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                            if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {
                                data = vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index];
                                break;
                            }
                        }

                        //更新必填
                        var requires = $('input[type="radio"][name="edit_radio2"]');
                        for (var n = 0; n < requires.length; n++) {
                            if (data.required === requires[n].value) {
                                requires[n].checked = 'checked';
                            }
                        }

                        $('#edit_checkbox_question_title').val(data['title']);

                        //存題號
                        //抓當前DOM父層的問題題號標題
                        var questionTitle = $(dom).parents('.showQuestions_unit_tools').siblings('.question_title').html();
                        $('#quesitonNum').html(questionTitle);

                        var option = $('.editOptions_wrap#edit_editOptions_wrap_checkbox').html();


                        $('.editOptions_wrap#edit_editOptions_wrap_checkbox').empty();

                        for (var j = 0; j < data['options'].length; j++) {
                            $('.editOptions_wrap#edit_editOptions_wrap_checkbox').append(option);
                            //console.log($('.editOptions_wrap#edit_editOptions_wrap_radio').find('.edit_editRadio_input'));
                        }

                        for (var k = 0; k < data['options'].length; k++) {
                            $('.editOptions_wrap#edit_editOptions_wrap_checkbox').find('.edit_editCheckbox_input')[k].value = data['options'][k].val;
                        }

                    }

                },
                OnOK: function () {

                    var index = $(dom).attr('data-index');

                    //是否必填
                    var required = $('input[type="radio"][name="edit_radio2"]:checked').val();

                    //儲存新選項
                    var newOption = [];

                    var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_checkbox .edit_editCheckbox_input');

                    for (var j = 0; j < nodeList.length; j++) {
                        newOption.push({
                            id: _uuid(),
                            val: nodeList[j].value,
                            jumpLogic: null
                        });
                    }



                    //更新問題

                    var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                    for (var k = 0; k < vm.allQuestionnaireData.length; k++) {
                        if (vm.allQuestionnaireData[k]['page'] == vm.nowPage) {
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].title = $('#edit_checkbox_question_title').val();
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].options = newOption;
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].required = required;
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].jumpToQuestion = jumpToQuestion;
                            break;
                        }
                    }

                }
            });
        }

    };

    //編輯下拉題
    editPulldown = function (event, status, dom) {

        if (status === 'add') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增下拉題',
                OutsideStyle: 'max-width:770px',
                Html: $('#editPulldown'),
                OnOK: function () {

                    //是否必填
                    var required = $('input[type="radio"][name="radio3"]:checked').val();

                    //存每個選項的值
                    var options = [];
                    $('.showEditOptions_pulldown .input_area input').each(function (index) {
                        options.push({
                            id: _uuid(),
                            val: $(this).val(),
                            jumpLogic: null
                        });
                    });

                    if (vm.nowPage === 1) {
                        //初始第一頁
                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                            type: 'pulldown',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#pulldown_question_title').val(),
                            options: options,
                            required: required,
                            jumpToQuestion: jumpToQuestion
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    } else {
                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageQuestionData"].push({
                            type: 'pulldown',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#pulldown_question_title').val(),
                            options: options,
                            required: required,
                            jumpToQuestion: jumpToQuestion
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    }
                }
            });
        }

        if (status === 'edit') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯下拉題',
                OutsideStyle: 'max-width:770px',
                Html: $('#edit_editPulldown'),
                OnReady: function (Code) {

                    if (status == 'edit') {

                        var index = $(dom).attr('data-index');
                        var data = {};
                        for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                            if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {
                                data = vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index];
                                break;
                            }
                        }

                        //更新必填
                        var requires = $('input[type="radio"][name="edit_radio3"]');
                        for (var n = 0; n < requires.length; n++) {
                            if (data.required === requires[n].value) {
                                requires[n].checked = 'checked';
                            }
                        }

                        $('#edit_pulldown_question_title').val(data['title']);

                        //存題號
                        //抓當前DOM父層的問題題號標題
                        var questionTitle = $(dom).parents('.showQuestions_unit_tools').siblings('.question_title').html();
                        $('#quesitonNum').html(questionTitle);

                        var option = $('.editOptions_wrap#edit_editOptions_wrap_pulldown').html();


                        $('.editOptions_wrap#edit_editOptions_wrap_pulldown').empty();

                        for (var j = 0; j < data['options'].length; j++) {
                            $('.editOptions_wrap#edit_editOptions_wrap_pulldown').append(option);
                        }

                        for (var k = 0; k < data['options'].length; k++) {
                            $('.editOptions_wrap#edit_editOptions_wrap_pulldown').find('.edit_editPulldown_input')[k].value = data['options'][k].val;
                        }

                    }

                },
                OnOK: function () {

                    var index = $(dom).attr('data-index');

                    //是否必填
                    var required = $('input[type="radio"][name="edit_radio3"]:checked').val();

                    //儲存新選項
                    var newOption = [];

                    var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_pulldown .edit_editPulldown_input');


                    for (var j = 0; j < nodeList.length; j++) {
                        newOption.push({
                            id: _uuid(),
                            val: nodeList[j].value,
                            jumpLogic: null
                        });
                    }



                    //更新問題
                    var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                    for (var k = 0; k < vm.allQuestionnaireData.length; k++) {
                        if (vm.allQuestionnaireData[k]['page'] == vm.nowPage) {
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].title = $('#edit_pulldown_question_title').val();
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].options = newOption;
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].required = required;
                            vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].jumpToQuestion = jumpToQuestion;
                            break;
                        }
                    }

                }
            });
        }

    };

    //編輯文本題
    editTextarea = function (event, status, dom) {
        if (status === 'add') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增文本題',
                OutsideStyle: 'max-width:700px',
                Html: $('#editTextarea'),
                OnOK: function () {
                    //過場loading

                    if (vm.nowPage === 1) {

                        //是否必填
                        var required = $('input[type="radio"][name="radio4"]:checked').val();

                        //初始第一頁
                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                            type: 'textarea',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#textarea_question_title').val(),
                            required: required,
                            jumpToQuestion: jumpToQuestion
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    } else {

                        //是否必填
                        var required = $('input[type="radio"][name="radio4"]:checked').val();

                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageQuestionData"].push({
                            type: 'textarea',
                            id: _uuid(),
                            questionNum: '',
                            title: $('#textarea_question_title').val(),
                            required: required,
                            jumpToQuestion: jumpToQuestion
                        });

                        //題號重新排序
                        var newIndex = 1;

                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.questionNum = newIndex;
                                newIndex++;
                            });
                        });
                    }

                }
            });
        }

        if (status === 'edit') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯文本題',
                OutsideStyle: 'max-width:700px',
                Html: $('#edit_editTextarea'),
                OnReady: function () {
                    //過場loading
                    var index = $(dom).attr('data-index');
                    var data = {};

                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {

                        if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {

                            data = vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index];
                            break;
                        }

                    }

                    //更新必填
                    var requires = $('input[type="radio"][name="radio4"]');
                    for (var j = 0; j < requires.length; j++) {
                        if (data.required === requires[j].value) {
                            requires[j].checked = 'checked';
                        }
                    }

                    //插入題目
                    $('#edit_textarea_question_title').val(data['title']);


                    //存題號
                    //抓當前DOM父層的問題題號標題
                    var questionTitle = $(dom).parents('.showQuestions_unit_tools').siblings('.question_title').html();
                    $('#quesitonNum').html(questionTitle);

                },
                OnOK: function () {

                    //是否必填
                    var required = $('input[type="radio"][name="radio4"]:checked').val();

                    var newTitle = $('#edit_textarea_question_title').val();

                    var index = $(dom).attr('data-index');

                    var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {

                        if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {

                            vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index].title = newTitle;
                            vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index].required = required;
                            vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index].jumpToQuestion = jumpToQuestion;
                            break;
                        }

                    }

                }
            });
        }

    };

    //編輯頁面說明
    editPageDesc = function (e, status, dom) {
        if (status === 'add') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增頁面說明',
                Html: $('#editPageDesc'),
                OnOK: function () {
                    //過場loading

                    if (vm.nowPage === 1) {
                        //初始第一頁
                        vm.allQuestionnaireData[0].questionDataPerPage["pageDesc"] = $('#editPageDescVal').val();

                    } else {
                        vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageDesc"] = $('#editPageDescVal').val();
                    }

                }
            });
        }

        if (status === 'edit') {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯頁面說明',
                Html: $('#editPageDesc'),
                OnReady: function () {
                    //過場loading

                    if (status === 'edit') {

                        var index = $(dom).attr('data-index');
                        var data = {};

                        for (var i = 0; i < vm.allQuestionnaireData.length; i++) {

                            if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {

                                data = vm.allQuestionnaireData[i].questionDataPerPage["pageDesc"];
                                break;
                            }

                        }

                        //插入題目
                        $('#editPageDescVal').val(data);

                    }

                },
                OnOK: function () {

                    var newTitle = $('#editPageDescVal').val();

                    var index = $(dom).attr('data-index');

                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {

                        if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {

                            vm.allQuestionnaireData[i].questionDataPerPage["pageDesc"] = newTitle;
                            break;
                        }

                    }

                }
            });
        }
    };

    //新增頁面
    addNewPage = function (e) {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增頁面',
            OutsideStyle: 'max-width:500px',
            Html: '<p style="font-size:18px;color:#ff6a00">確定新增頁面 ?</p>',
            OnOK: function () {
                vm.allQuestionnaireData.push({
                    page: vm.allQuestionnaireData.length + 1,
                    questionDataPerPage: {
                        pageDesc: '',
                        pageQuestionData: []
                    }
                });

                vm.nowPage = vm.allQuestionnaireData.length;

                //紀錄頁面跳轉選項
                //先清空預設選項
                vm.data[0].Option = [];
                vm.allQuestionnaireData.forEach(function (page) {
                    vm.data[0].Option.push({
                        Text: '第 ' + page.page + ' 頁',
                        Val: page.page
                    });
                });

                vm.currentPage = '第 ' + vm.allQuestionnaireData.length + ' 頁';

            }
        });
    };

    //刪除頁面
    deletePage = function (e, dom, type) {

        alertBox({
            Mode: 'C',
            Html: '<p style="font-size:18px;color:#ff6a00">確定刪除頁面 ?</p>',
            OnOK: function () {

                if (type === 'side') {

                    var delPage = parseInt($('.del_page').attr("data-page"));
                    console.log(delPage);
                    //刪除該頁面
                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                        if (vm.allQuestionnaireData[i].page === delPage) {
                            vm.allQuestionnaireData.splice(i, 1);
                            break;
                        }
                    }

                    //重排頁面
                    var newPage = 1;
                    for (var j = 0; j < vm.allQuestionnaireData.length; j++) {
                        vm.allQuestionnaireData[j].page = newPage;
                        newPage++;
                    }

                    //紀錄頁面跳轉選項
                    //先清空預設選項
                    vm.data[0].Option = [];
                    vm.allQuestionnaireData.forEach(function (page) {
                        vm.data[0].Option.push({
                            Text: '第 ' + page.page + ' 頁',
                            Val: page.page
                        });
                    });


                    //題號重新排序
                    var newIndex = 1;
                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            question.questionNum = newIndex;
                            newIndex++;
                        });
                    });

                    //跳轉至上頁
                    if (vm.nowPage === 1) {
                        return false;
                    } else {
                        vm.nowPage--;
                        vm.currentPage = '第 ' + vm.nowPage + ' 頁';
                    }

                    //刪除跳題邏輯

                }

                if (type === 'top') {
                    var delPage = parseInt($(dom).attr("data-page"));
                    //刪除該頁面
                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                        if (vm.allQuestionnaireData[i].page === delPage) {
                            vm.allQuestionnaireData.splice(i, 1);
                            break;
                        }
                    }

                    //重排頁面
                    var newPage = 1;
                    for (var j = 0; j < vm.allQuestionnaireData.length; j++) {
                        vm.allQuestionnaireData[j].page = newPage;
                        newPage++;
                    }

                    //紀錄頁面跳轉選項
                    //先清空預設選項
                    vm.data[0].Option = [];
                    vm.allQuestionnaireData.forEach(function (page) {
                        vm.data[0].Option.push({
                            Text: '第 ' + page.page + ' 頁',
                            Val: page.page
                        });
                    });


                    //題號重新排序
                    var newIndex = 1;
                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            question.questionNum = newIndex;
                            newIndex++;
                        });
                    });

                    //跳轉至上頁
                    if (vm.nowPage === 1) {
                        return false;
                    } else {
                        vm.nowPage--;
                        vm.currentPage = '第 ' + vm.nowPage + ' 頁';
                    }

                    //刪除跳題邏輯
                }

            }
        });
    };

    //保存問卷
    saveQuestionnaire = function () {
        //判斷是否為新增問卷

        //取得網址id
        getUrlVars();
        var surveyId = $.getUrlVar('surveyId');

        if (surveyId !== undefined) {
            //儲存編輯後問卷資料
            var questionnaire = {
                id: surveyId,
                questionnaireTitle: vm.questionnaireTitle,
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: pickTime || vm.deadline,
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
                publicQuestionnaire: vm.public
            };
            axios.patch('http://localhost:3000/questionnaire/' + surveyId + '', questionnaire).then(function (res) {
                window.location.href = 'QuestionnaireList.aspx';
            });

        } else {
            //儲存新建問卷
            var questionnaire = {
                id: _uuid(),
                questionnaireTitle: vm.questionnaireTitle,
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: pickTime || '',
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
                publicQuestionnaire: vm.public
            };
            console.log(questionnaire);

            axios.post('http://localhost:3000/questionnaire', questionnaire).then(function (res) {
                window.location.href = 'QuestionnaireList.aspx';
            });
        }



    };

    //取消編輯問卷
    cancelQuestionnaire = function () {
        window.location.href = 'QuestionnaireList.aspx';
    };



    /* Controller */



    //編輯問題選項

    var editRadioOptionTemplate = $('.editOptions_wrap#editOptions_wrap_radio').html(); //複製選項格式
    var editCheckboxOptionTemplate = $('.editOptions_wrap#editOptions_wrap_checkbox').html(); //複製選項格式
    var editPulldownOptionTemplate = $('.editOptions_wrap#editOptions_wrap_pulldown').html(); //複製選項格式

    //添加選項
    addOption = function (e, type, status) {

        if (status === 'add') {
            if (type === 'radio') {
                $(e.target).siblings('.showEditOptions_radio').append(editRadioOptionTemplate);
            } else if (type === 'checkbox') {
                $(e.target).siblings('.showEditOptions_checkbox').append(editCheckboxOptionTemplate);
            } else if (type === 'pulldown') {
                $(e.target).siblings('.showEditOptions_pulldown').append(editPulldownOptionTemplate);
            }
        }

        if (status === 'edit') {
            if (type === 'radio') {
                $(e.target).siblings('.editOptions_wrap#edit_editOptions_wrap_radio').append(editRadioOptionTemplate);
            } else if (type === 'checkbox') {
                $(e.target).siblings('.editOptions_wrap#edit_editOptions_wrap_checkbox').append(editCheckboxOptionTemplate);
            } else if (type === 'pulldown') {
                $(e.target).siblings('.editOptions_wrap#edit_editOptions_wrap_pulldown').append(editPulldownOptionTemplate);
            }

        }

    };

    //刪除選項
    deleteOption = function (e, status) {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯選項',
            Html: '<p style="font-size:18px;color:#ff6a00">確定刪除選項(若選項有設置跳題將一併刪除)?</p>',
            OnOK: function () {
                if (status === 'add') {
                    $(e.target).parents('.editOptions').remove();
                }

                if (status === 'edit') {

                    var index = $('#edit_eidtRadio_del').html();
                    var title = $(e.target).parents('.editOptions').find('.edit_editRadio_input').val();
                    //刪除跳題邏輯
                    //取移除選項的值，比對若有設置跳題則刪除
                    var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];
                    if (typeof (target.options) !== 'undefined') {
                        target.options.forEach(function (option) {
                            if (option.jumpLogic !== null) {
                                if (option.val == title) {
                                    option.jumpLogic = null;
                                }
                            }
                        });

                        //顯示跳題選項數目
                        //顯示跳題提示

                        //顯示設定跳題選項數目
                        var optionsLogic = [];
                        target.options.forEach(function (option) {
                            if (option.jumpLogic !== null) {
                                optionsLogic.push(option.jumpLogic);
                            }
                        });

                        target.showLogicCount = optionsLogic;

                        //跳題題號重新排序
                        vm.allQuestionnaireData.forEach(function (page) {
                            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                                question.options.forEach(function (option) {
                                    if (option.jumpLogic !== null) {
                                        vm.allQuestionnaireData.forEach(function (data) {
                                            data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                                if (item.id == option.jumpLogic.jumpTo.id[0]) {
                                                    option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                                }
                                            });
                                        });
                                    }
                                });

                                question.showLogicCount.forEach(function (logic) {
                                    if (logic !== null) {
                                        vm.allQuestionnaireData.forEach(function (data) {
                                            data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                                if (item.id == logic.jumpTo.id[0]) {
                                                    logic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                                }
                                            });
                                        });
                                    }
                                });

                            });
                        });

                        $(e.target).parents('.editOptions').remove();
                    }

                }
            }
        });
    };

    //複製選項
    copyOption = function (e) {

        var clone = $(e.target).parents('.editOptions').clone(true);
        $(e.target).parents('.editOptions').after(clone);
    };

    //刪除問題
    deleteQuestion = function (e, type, dom) {

        alertBox({
            Mode: 'C',
            Html: '<p style="font-size:18px;color:#ff6a00">確定刪除問題 (跳題設定將會一併刪除)?</p>',
            OnOK: function () {
                if (type === 'radio' || type === 'checkbox' || type === 'pulldown' || type === 'textarea') {
                    var currentIndex = $(dom).attr('data-index');
                    var delId;

                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                        if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {
                            delId = vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][currentIndex].id;
                            vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"].splice(currentIndex, 1);
                        }
                    }


                    //刪除跳題關聯設定
                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            question.options.forEach(function (option) {
                                if (option.jumpLogic !== null) {
                                    if (option.jumpLogic.jumpTo.id[0] === delId) {
                                        option.jumpLogic = null;

                                        //紀錄關聯問題的id
                                        question.showLogicCount.forEach(function (item, index) {
                                            if (item.jumpTo.id[0] == delId) {
                                                question.showLogicCount.splice(index, 1);
                                            }
                                        });
                                    }
                                }
                            });


                        });
                    });

                    //題號重新排序
                    var newIndex = 1;

                    vm.allQuestionnaireData.forEach(function (page) {
                        //重排題號
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            question.questionNum = newIndex;
                            newIndex++;
                        });
                    });

                    //跳題題號重新排序
                    vm.allQuestionnaireData.forEach(function (page) {
                        page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                            question.options.forEach(function (option) {
                                if (option.jumpLogic !== null) {
                                    vm.allQuestionnaireData.forEach(function (data) {
                                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                            if (item.id == option.jumpLogic.jumpTo.id[0]) {
                                                option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                            }
                                        });
                                    });
                                }
                            });

                            question.showLogicCount.forEach(function (logic) {
                                if (logic !== null) {
                                    vm.allQuestionnaireData.forEach(function (data) {
                                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                            if (item.id == logic.jumpTo.id[0]) {
                                                logic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                            }
                                        });
                                    });
                                }
                            });

                        });
                    });

                }

                if (type === 'pageDesc') {
                    var index = $(dom).attr('data-index');

                    for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                        if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {
                            vm.allQuestionnaireData[i].questionDataPerPage["pageDesc"] = '';
                        }
                    }
                }
            }
        });
    };

    //複製問題
    copyQuestion = function (e, dom) {
        var index = $(dom).attr('data-index');
        for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
            if (vm.allQuestionnaireData[i]["page"] == vm.nowPage) {

                //深拷貝物件
                //copyQuestion = $.extend(true, {}, vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index]);
                var copyQuestion = _.cloneDeep(vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index]);
                //重設問題id
                copyQuestion["id"] = _uuid();
                //重設選項id
                copyQuestion.options.forEach(function (option) {
                    option.id = _uuid();
                    option.jumpLogic = null;
                });
                //重設跳題提示數目
                copyQuestion["showLogicCount"] = [];
                vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"].push(copyQuestion);

            }
        }

        //題號重新排序
        var newIndex = 1;

        vm.allQuestionnaireData.forEach(function (page) {
            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                question.questionNum = newIndex;
                newIndex++;

            });
        });

        //跳題題號重新排序
        vm.allQuestionnaireData.forEach(function (page) {
            page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                question.options.forEach(function (option) {
                    if (option.jumpLogic !== null) {
                        vm.allQuestionnaireData.forEach(function (data) {
                            data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.id == option.jumpLogic.jumpTo.id[0]) {
                                    option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                }
                            });
                        });
                    }
                });

                question.showLogicCount.forEach(function (logic) {
                    if (logic !== null) {
                        vm.allQuestionnaireData.forEach(function (data) {
                            data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.id == logic.jumpTo.id[0]) {
                                    logic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                                }
                            });
                        });
                    }
                });

            });
        });


    };

    //邏輯跳題
    jumpQuestion = function (e, dom, type) {

        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-code-fork"></i>&nbsp;設定跳題邏輯',
            OutsideStyle: 'max-width:900px',
            Html: $('#jumpQuestion'),
            OnReady: function () {

                if (type === 'radio') {

                    var index = $(dom).attr('data-index');
                    var currentTitle = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].title;
                    var currentQuestionNum = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].questionNum;

                    $('#currentTitle').html('<span style="color:#FF6A00">Q' + currentQuestionNum + '&emsp;' + currentTitle + '</span>');

                    //存每個選項的值
                    var options = [];
                    vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].options.forEach(function (option) {
                        options.push({
                            Text: option.val,
                            Val: option.id,
                        });
                    });

                    var questions = [];
                    if (vm.allQuestionnaireData) {
                        vm.allQuestionnaireData.forEach(function (question) {
                            question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                questions.push({
                                    name: 'Q' + item.questionNum + ' ' + item.title + '',
                                    val: item.id,
                                    group: '第 ' + question.page + ' 頁'
                                });
                            });
                        });
                    }

                    //顯示編輯問題以後的題目
                    questions = questions.length === 1 ? [] : questions.slice(currentQuestionNum - 1);


                    DropListSetting({
                        ID: 'selected_option',
                        Data: [{ Optgroup: '', Option: options }],
                        Search: true,
                        ButtonText: '請選擇選項',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            //激活選項
                            vm.tempLogicSetting.triggerOption.id = Select;
                            vm.tempLogicSetting.triggerOption.val = DropListTempData['selected_option'].SelectText;
                        }
                    });

                    DropListSetting({
                        ID: 'jump_to_question',
                        Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                        Search: true,
                        GroupList: true,
                        ButtonText: '請選擇題目',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            //跳到此問題
                            vm.tempLogicSetting.jumpTo.id = Select;
                            vm.tempLogicSetting.jumpTo.val = DropListTempData['jump_to_question'].SelectText;
                        }
                    });

                }

                if (type === 'checkbox') {
                    if (status === 'add') {

                        //跳題編輯顯示當前題目
                        var currentTitle = $('#checkbox_question_title').val();
                        var currentQuestionNum = 1;
                        if (vm.allQuestionnaireData[0].questionDataPerPage.pageQuestionData.length !== 0) {
                            vm.allQuestionnaireData.forEach(function (item) {
                                var num = item.questionDataPerPage.pageQuestionData.length;
                                currentQuestionNum += num;
                            });
                        }

                        $('#currentTitle').html('<span style="color:#FF6A00">Q' + currentQuestionNum + '&emsp;' + currentTitle + '</span>');

                        //存每個選項的值
                        var options = [];
                        $('.showEditOptions_checkbox .input_area input').each(function (index) {
                            options.push({
                                Text: $(this).val(),
                                Val: $(this).val(),
                            });
                        });

                        var questions = [];
                        if (vm.allQuestionnaireData) {
                            vm.allQuestionnaireData.forEach(function (question) {
                                question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                    questions.push({
                                        name: '<span>Q' + item.questionNum + '&emsp;' + item.title + '</span>',
                                        val: item.questionNum,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                });
                            });
                        }

                        DropListSetting({
                            ID: 'selected_option',
                            Type: 'multiple',
                            Data: [{ Optgroup: '', Option: options }],
                            Search: true,
                            ButtonText: '請選擇選項',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.triggerOption = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'jump_to_question',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.jumpTo = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'no_jump_question',
                            Type: 'multiple',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.noSkip = Select;
                            },
                        });

                    }

                    if (status === 'edit') {

                        //跳題編輯顯示當前題目
                        var currentTitle = $('#quesitonNum').html();
                        $('#currentTitle').html('<span style="color:#FF6A00">' + currentTitle + '</span>');

                        //存每個選項的值
                        var options = [];
                        $('.editOptions_wrap#edit_editOptions_wrap_checkbox .editOptions .input_area input').each(function (index) {
                            options.push({
                                Text: $(this).val(),
                                Val: $(this).val(),
                            });
                        });

                        var questions = [];
                        if (vm.allQuestionnaireData) {
                            vm.allQuestionnaireData.forEach(function (question) {
                                question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                    questions.push({
                                        name: '<span>Q' + item.questionNum + '&emsp;' + item.title + '</span>',
                                        val: item.questionNum,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                });
                            });
                        }

                        DropListSetting({
                            ID: 'selected_option',
                            Type: 'multiple',
                            Data: [{ Optgroup: '', Option: options }],
                            Search: true,
                            ButtonText: '請選擇選項',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.triggerOption = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'jump_to_question',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.jumpTo = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'no_jump_question',
                            Type: 'multiple',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.noSkip = Select;
                            },
                        });
                    }
                }

                if (type === 'pulldown') {
                    if (status === 'add') {

                        //跳題編輯顯示當前題目
                        var currentTitle = $('#pulldown_question_title').val();
                        var currentQuestionNum = 1;
                        if (vm.allQuestionnaireData[0].questionDataPerPage.pageQuestionData.length !== 0) {
                            vm.allQuestionnaireData.forEach(function (item) {
                                var num = item.questionDataPerPage.pageQuestionData.length;
                                currentQuestionNum += num;
                            });
                        }

                        $('#currentTitle').html('<span style="color:#FF6A00">Q' + currentQuestionNum + '&emsp;' + currentTitle + '</span>');


                        //存每個選項的值
                        var options = [];
                        $('.showEditOptions_pulldown .input_area input').each(function (index) {
                            options.push({
                                Text: $(this).val(),
                                Val: $(this).val(),
                            });
                        });

                        var questions = [];
                        if (vm.allQuestionnaireData) {
                            vm.allQuestionnaireData.forEach(function (question) {
                                question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                    questions.push({
                                        name: '<span>Q' + item.questionNum + '&emsp;' + item.title + '</span>',
                                        val: item.questionNum,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                });
                            });
                        }

                        DropListSetting({
                            ID: 'selected_option',
                            Data: [{ Optgroup: '', Option: options }],
                            Search: true,
                            ButtonText: '請選擇選項',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.triggerOption = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'jump_to_question',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.jumpTo = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'no_jump_question',
                            Type: 'multiple',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.noSkip = Select;
                            },
                        });

                    }

                    if (status === 'edit') {

                        //跳題編輯顯示當前題目
                        var currentTitle = $('#quesitonNum').html();
                        $('#currentTitle').html('<span style="color:#FF6A00">' + currentTitle + '</span>');

                        //存每個選項的值
                        var options = [];
                        $('.editOptions_wrap#edit_editOptions_wrap_pulldown .editOptions .input_area input').each(function (index) {
                            options.push({
                                Text: $(this).val(),
                                Val: $(this).val(),
                            });
                        });

                        var questions = [];
                        if (vm.allQuestionnaireData) {
                            vm.allQuestionnaireData.forEach(function (question) {
                                question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                    questions.push({
                                        name: '<span>Q' + item.questionNum + '&emsp;' + item.title + '</span>',
                                        val: item.questionNum,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                });
                            });
                        }

                        DropListSetting({
                            ID: 'selected_option',
                            Data: [{ Optgroup: '', Option: options }],
                            Search: true,
                            ButtonText: '請選擇選項',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.triggerOption = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'jump_to_question',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.jumpTo = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'no_jump_question',
                            Type: 'multiple',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.noSkip = Select;
                            },
                        });
                    }
                }

                if (type === 'textarea') {
                    if (status === 'add') {

                        //跳題編輯顯示當前題目
                        var currentTitle = $('#textarea_question_title').val();
                        console.log(currentTitle);
                        var currentQuestionNum = 1;
                        if (vm.allQuestionnaireData[0].questionDataPerPage.pageQuestionData.length !== 0) {
                            vm.allQuestionnaireData.forEach(function (item) {
                                var num = item.questionDataPerPage.pageQuestionData.length;
                                currentQuestionNum += num;
                            });
                        }

                        $('#currentTitle').html('<span style="color:#FF6A00">Q' + currentQuestionNum + '&emsp;' + currentTitle + '</span>');


                        var questions = [];
                        if (vm.allQuestionnaireData) {
                            vm.allQuestionnaireData.forEach(function (question) {
                                question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                    questions.push({
                                        name: '<span>Q' + item.questionNum + '&emsp;' + item.title + '</span>',
                                        val: item.questionNum,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                });
                            });
                        }

                        DropListSetting({
                            ID: 'selected_option',
                            Data: [{ Optgroup: '', Option: [{ Text: '', Val: '', Title: '' }] }],
                            Search: true,
                            ButtonText: '請選擇選項',
                            Disabled: false,
                        });

                        DropListSetting({
                            ID: 'jump_to_question',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.jumpTo = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'no_jump_question',
                            Type: 'multiple',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.noSkip = Select;
                            },
                        });

                    }

                    if (status === 'edit') {

                        //跳題編輯顯示當前題目
                        var currentTitle = $('#quesitonNum').html();
                        $('#currentTitle').html('<span style="color:#FF6A00">' + currentTitle + '</span>');

                        //存每個選項的值
                        var questions = [];
                        if (vm.allQuestionnaireData) {
                            vm.allQuestionnaireData.forEach(function (question) {
                                question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                    questions.push({
                                        name: '<span>Q' + item.questionNum + '&emsp;' + item.title + '</span>',
                                        val: item.questionNum,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                });
                            });
                        }

                        DropListSetting({
                            ID: 'selected_option',
                            Data: [{ Optgroup: '', Option: [{ Text: '', Val: '', Title: '' }] }],
                            Search: true,
                            ButtonText: '請選擇選項',
                            Disabled: false,
                        });

                        DropListSetting({
                            ID: 'jump_to_question',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.jumpTo = Select;
                            },
                        });

                        DropListSetting({
                            ID: 'no_jump_question',
                            Type: 'multiple',
                            Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                            Search: true,
                            GroupList: true,
                            ButtonText: '請選擇題目',
                            Disabled: false,
                            OnEnd: function (Select, Name) {
                                vm.tempLogicSetting.noSkip = Select;
                            },
                        });
                    }
                }

            },
            OnOK: function () {

                //var result = '<i class="fa fa-code-fork"></i>&nbsp;若本題選擇【' + vm.tempLogicSetting.triggerOption.val + '】，則跳至第&nbsp;' + vm.tempLogicSetting.jumpTo.val + '&nbsp;題';

                if (type === 'radio') {

                    //取得當前編輯的問題
                    var index = $(dom).attr('data-index');
                    var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                    target.options.forEach(function (option) {
                        if (option.id == vm.tempLogicSetting.triggerOption.id[0]) {
                            //option.jumpLogic = $.extend(true, {}, vm.tempLogicSetting);
                            option.jumpLogic = _.cloneDeep(vm.tempLogicSetting);                           
                        }
                    });

                    //判斷是否同選項的設定
                    //清空顯示跳題提示data
                    target.showLogicCount = [];
                    target.options.forEach(function (option) {
                        if (option.jumpLogic !== null) {
                            target.showLogicCount.push(option.jumpLogic);
                        }
                    });
                }
                if (type === 'checkbox') {

                }
                if (type === 'pulldown') {

                }
                if (type === 'textarea') {

                }
            }
        });
    };

    //顯示跳題設定結果
    showLogicSetting = function (dom) {
        alertBox({
            Mode: 'C',
            Html: $('#show_logic_setting'),
            Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯跳題設定',
            OutsideStyle: 'max-width:750px',
            OnReady: function () {
                $('#show_logic_content').empty();
                var index = $(dom).attr("data-logic");
                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].showLogicCount;
                for (var i = 0; i < target.length; i++) {
                    if (target[i] !== null) {

                        $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[i].triggerOption.val[0] + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + target[i].jumpTo.val[0] + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[i].triggerOption.id[0] +'" onclick="delLogicSetting(event,'+ index + ',$(this))">刪除跳題設定</button></div>');
                    }
                }
            }
        });
    };

    //刪除邏輯跳題
    delLogicSetting = function (e, index, dom) {
        alertBox({
            Mode: 'C',
            Title: '刪除跳題設定',
            Html: '<p style="color:#FD6A4F">確定刪除跳題設定 ?</p>',
            OnOK: function () {
                //刪除畫面
                $(e.target).parent().parent().remove();
                //刪除資料
                var delId = $(dom).attr('data-delId');
                var item = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                item.options.forEach(function (option) {
                    if (option.id == delId) {
                        option.jumpLogic = null;
                    }
                });

                //更新顯示跳題提示
                item.showLogicCount.forEach(function (logic,index) {
                    if (logic.triggerOption.id[0] == delId) {
                        item.showLogicCount.splice(index, 1);
                    }
                });

            }
        });
    };





    //上一頁
    prevPage = function () {

        //刪除資料再重新渲染
        if (vm.nowPage === 1) {
            alertBox({
                Mode: 'A',
                Html: '<p style="font-size:18px;color:#ff6a00">已經為第一頁!</p>'
            });
            return false;
        } else {
            vm.nowPage--;
            vm.currentPage = '第 ' + vm.nowPage + ' 頁';
        }
    };

    //下一頁
    nextPage = function () {

        //刪除資料再重新渲染
        if (vm.nowPage >= vm.allQuestionnaireData.length) {

            vm.nowPage = vm.allQuestionnaireData.length;
            alertBox({
                Mode: 'A',
                Html: '<p style="font-size:18px;color:#ff6a00">已經為最後一頁!</p>'
            });
            return false;
        } else {
            vm.nowPage++;
            vm.currentPage = '第 ' + vm.nowPage + ' 頁';
        }
    };

    //跳頁
    jumpPage = function (e) {
        e.stopPropagation();
        $('.show_jump_page').toggle('fast');

    };

    jumpToPage = function (e, dom) {
        var jumpto = parseInt($(dom).attr("data-jump"));
        $('.show_jump_page').toggle('fast');
        vm.nowPage = jumpto;

        vm.currentPage = '第 ' + jumpto + ' 頁';
    };

    //點擊空白處關閉
    $(document).on('click', function (e) {
        var _target = $('.show_jump_page');
        if (!_target.is(e.target) && _target.has(e.target).length === 0) {
            $('.show_jump_page').hide();
        }
    });

    //側邊工具列
    $(document).scroll(function (e) {
        var contentHeight = $('.ContentBoxHtml#show_question').offset().top;
        if ($(this).scrollTop() > (contentHeight - 50)) {
            $('.page_side_tools').css({ 'opacity': 1 });
            $('.page_side_tools').css({ 'visibility': 'visible' });
        } else {
            $('.page_side_tools').css({ 'opacity': 0 });
            $('.page_side_tools').css({ 'visibility': 'hidden' });
        }
    });

    //選取時間
    var pickTime;
    TimePickSetting({
        ID: 'timepick',
        Format: 'yyyy-MM-dd HH:mm',
        TimePick: true,
        OnClose: function () {
            pickTime = TimePickGet('timepick').Format;
        }
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

        el: '#editQuestion',
        data: function () {
            //資料統一寫在vue實例裡面，外層用vm呼叫
            return {
                allQuestionnaireData: [{
                    page: 1,
                    questionDataPerPage: {
                        pageDesc: '',
                        pageQuestionData: []
                    }
                }], //每頁問題資料
                nowPage: 1,
                currentPage: '第 1 頁',
                showJumpPage: false,
                data: [{ Optgroup: '', Option: [{ Text: '第 1 頁', Val: 1 }] }], //頁面下拉選單資料
                questionnaireTitle: '', //問卷標題
                questionnaireDesc: '', //問卷說明
                deadline: '', //截止日期
                repeat: '', // 問卷可否重複填答
                public: '', //問卷是否發佈
                tempLogicSetting: {
                    triggerOption: {
                        id: '',
                        val: ''
                    },
                    jumpTo: {
                        id: '',
                        val: ''
                    },
                    noSkip: {
                        id: '',
                        val: ''
                    }
                } //暫存跳題設定
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
                    vm.deadline = res.data.questionnaireDeadline;
                    vm.repeat = res.data.repeatAnswer;
                    vm.public = res.data.publicQuestionnaire;
                });
            },
            resetDeadline: function () {
                this.deadline = '';
            }
        },
        mounted: function () {

        }

    });









});
