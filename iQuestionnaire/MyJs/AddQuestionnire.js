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

    editQuestion = function (event, status, dom) {

        var type = $(dom).attr('data-type');

        if (type === 'radio') {

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

                            //未添加題目的提示
                            if ($('#radio_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#radio_title').addClass('warning');
                                        if ($('#radio_options').hasClass('warning')) {
                                            $('#radio_options').removeClass('warning');
                                        }
                                    }
                                });
                                return false;
                            } else {
                                if ($('#radio_title').hasClass('warning')) {
                                    $('#radio_title').removeClass('warning');
                                }

                                //因為彈窗後會先return false，會忽略掉data的判斷
                                if ($('#radio_options').hasClass('warning')) {
                                    $('#radio_options').removeClass('warning');
                                }
                            }

                            //未添加選項的提示
                            if (options.length === 0) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加選項</p>',
                                    OnOK: function () {
                                        $('#radio_options').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#radio_options').hasClass('warning')) {
                                    $('#radio_options').removeClass('warning');
                                }
                            }

                            //重複選項的提示
                            var repeatResult = {};
                            options.forEach(function (option) {
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
                                jumpLogic: null,
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
                                showLogicCount: [],
                                isSelect: ''
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
                                showLogicCount: [],
                                isSelect: ''
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

                            //未添加題目的提示
                            if ($('#edit_radio_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#edit_radio_title').addClass('warning');

                                        if ($('#edit_radio_options').hasClass('warning')) {
                                            $('#edit_radio_options').removeClass('warning');
                                        }
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_radio_title').hasClass('warning')) {
                                    $('#edit_radio_title').removeClass('warning');
                                }

                                if ($('#edit_radio_options').hasClass('warning')) {
                                    $('#edit_radio_options').removeClass('warning');
                                }

                            }

                            //未添加選項的提示
                            if (newOption.length === 0) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加選項</p>',
                                    OnOK: function () {
                                        $('#edit_radio_options').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_radio_options').hasClass('warning')) {
                                    $('#edit_radio_options').removeClass('warning');
                                }
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
                                jumpLogic: null,
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

                        //刪除跳題
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
                                    if (question.options) {
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
                                    }


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

                        //跳題題號重新排序
                        //vm.allQuestionnaireData.forEach(function (page) {
                        //    page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                        //        if (question.options) {
                        //            question.options.forEach(function (option) {
                        //                if (option.jumpLogic !== null) {
                        //                    vm.allQuestionnaireData.forEach(function (data) {
                        //                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                        //                            if (item.id == option.jumpLogic.jumpTo.id[0]) {
                        //                                option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                        //                            }
                        //                        });
                        //                    });
                        //                }
                        //            });
                        //        }

                        //    });
                        //});

                    }
                });
            }
        }

        if (type === 'checkbox') {

            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增多選題',
                    OutsideStyle: 'max-width:770px',
                    Html: $('#editCheckbox'),
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            //存每個選項的值
                            var options = [];
                            $('.showEditOptions_checkbox .input_area input').each(function (index) {
                                options.push({
                                    id: _uuid(),
                                    val: $(this).val(),
                                    jumpLogic: null
                                });
                            });

                            //未添加題目的提示
                            if ($('#checkbox_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#checkbox_title').addClass('warning');
                                        if ($('#checkbox_options').hasClass('warning')) {
                                            $('#checkbox_options').removeClass('warning');
                                        }
                                    }
                                });
                                return false;
                            } else {

                                if ($('#checkbox_title').hasClass('warning')) {
                                    $('#checkbox_title').removeClass('warning');
                                }
                                if ($('#checkbox_options').hasClass('warning')) {
                                    $('#checkbox_options').removeClass('warning');
                                }

                            }

                            //未添加選項的提示
                            if (options.length === 0) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加選項</p>',
                                    OnOK: function () {
                                        $('#checkbox_options').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#checkbox_options').hasClass('warning')) {
                                    $('#checkbox_options').removeClass('warning');
                                }
                            }


                            //重複選項的提示
                            //篩選重複的選項
                            var repeatResult = {};
                            options.forEach(function (option) {
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

                        return true;
                    },
                    OnOK: function () {

                        //是否必填
                        var required = $('input[type="radio"][name="radio2"]:checked').val();

                        //存每個選項的值
                        var options = [];
                        $('.showEditOptions_checkbox .input_area input').each(function (index) {
                            options.push({
                                id: _uuid(),
                                val: $(this).val(),
                                jumpLogic: null,
                            });
                        });

                        if (vm.nowPage === 1) {
                            //初始第一頁
                            vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                                type: 'checkbox',
                                id: _uuid(),
                                questionNum: '',
                                title: $('#checkbox_question_title').val(),
                                options: options,
                                required: required,
                                showLogicCount: [],
                                isSelect: []
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
                                type: 'checkbox',
                                id: _uuid(),
                                questionNum: '',
                                title: $('#checkbox_question_title').val(),
                                options: options,
                                required: required,
                                showLogicCount: [],
                                isSelect: []
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
                            //存問題index
                            $('#edit_eidtCheckbox_del').html(index);
                            $('#edit_eidtCheckbox_copy').html(index);

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
                    OnClose: function (Type) {
                        if (Type == 'ok') {
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

                            //未添加題目的提示
                            if ($('#edit_checkbox_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#edit_checkbox_title').addClass('warning');
                                        if ($('#edit_checkbox_options').hasClass('warning')) {
                                            $('#edit_checkbox_options').removeClass('warning');
                                        }
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_checkbox_title').hasClass('warning')) {
                                    $('#edit_checkbox_title').removeClass('warning');
                                }

                                if ($('#edit_checkbox_options').hasClass('warning')) {
                                    $('#edit_checkbox_options').removeClass('warning');
                                }
                            }

                            //未添加選項的提示
                            if (newOption.length === 0) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加選項</p>',
                                    OnOK: function () {
                                        $('#edit_checkbox_options').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_checkbox_options').hasClass('warning')) {
                                    $('#edit_checkbox_options').removeClass('warning');
                                }
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
                        var required = $('input[type="radio"][name="edit_radio2"]:checked').val();

                        //儲存新選項
                        var newOption = [];

                        var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_checkbox .edit_editCheckbox_input');

                        for (var j = 0; j < nodeList.length; j++) {
                            newOption.push({
                                id: _uuid(),
                                val: nodeList[j].value,
                                jumpLogic: null,
                            });
                        }



                        //更新問題

                        var jumpToQuestion = vm.tempLogicSetting.jumpTo !== '' ? $.extend(true, {}, vm.tempLogicSetting) : [];
                        for (var k = 0; k < vm.allQuestionnaireData.length; k++) {
                            if (vm.allQuestionnaireData[k]['page'] == vm.nowPage) {
                                vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].title = $('#edit_checkbox_question_title').val();
                                vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].options = newOption;
                                vm.allQuestionnaireData[k].questionDataPerPage["pageQuestionData"][index].required = required;
                                break;
                            }
                        }

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
                                    if (question.options) {
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
                                    }


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

                        //跳題題號重新排序
                        //vm.allQuestionnaireData.forEach(function (page) {
                        //    page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                        //        if (question.options) {
                        //            question.options.forEach(function (option) {
                        //                if (option.jumpLogic !== null) {
                        //                    vm.allQuestionnaireData.forEach(function (data) {
                        //                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                        //                            if (item.id == option.jumpLogic.jumpTo.id[0]) {
                        //                                option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                        //                            }
                        //                        });
                        //                    });
                        //                }
                        //            });
                        //        }
                        //    });
                        //});


                    }
                });
            }
        }

        if (type === 'pulldown') {

            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增下拉題',
                    OutsideStyle: 'max-width:770px',
                    Html: $('#editPulldown'),
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            //存每個選項的值
                            var options = [];
                            $('.showEditOptions_pulldown .input_area input').each(function (index) {
                                options.push({
                                    id: _uuid(),
                                    val: $(this).val(),
                                    jumpLogic: null
                                });
                            });

                            //未添加題目的提示
                            if ($('#pulldown_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#pulldown_title').addClass('warning');
                                        if ($('#pulldown_options').hasClass('warning')) {
                                            $('#pulldown_options').removeClass('warning');
                                        }
                                    }
                                });
                                return false;
                            } else {
                                if ($('#pulldown_title').hasClass('warning')) {
                                    $('#pulldown_title').removeClass('warning');
                                }
                                if ($('#pulldown_options').hasClass('warning')) {
                                    $('#pulldown_options').removeClass('warning');
                                }
                            }

                            //未添加選項的提示
                            if (options.length === 0) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加選項</p>',
                                    OnOK: function () {
                                        $('#pulldown_options').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#pulldown_options').hasClass('warning')) {
                                    $('#pulldown_options').removeClass('warning');
                                }
                            }

                            //重複選項的提示
                            var repeatResult = {};
                            options.forEach(function (option) {
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

                        return true;
                    },
                    OnOK: function () {

                        //是否必填
                        var required = $('input[type="radio"][name="radio3"]:checked').val();

                        //存每個選項的值
                        var options = [];
                        $('.showEditOptions_pulldown .input_area input').each(function (index) {
                            options.push({
                                id: _uuid(),
                                val: $(this).val(),
                                jumpLogic: null,
                            });
                        });

                        if (vm.nowPage === 1) {
                            //初始第一頁
                            vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                                type: 'pulldown',
                                id: _uuid(),
                                questionNum: '',
                                title: $('#pulldown_question_title').val(),
                                options: options,
                                required: required,
                                showLogicCount: [],
                                isSelect: ''
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
                                type: 'pulldown',
                                id: _uuid(),
                                questionNum: '',
                                title: $('#pulldown_question_title').val(),
                                options: options,
                                required: required,
                                showLogicCount: [],
                                isSelect: ''
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
                            //存問題index
                            $('#edit_eidtPulldown_del').html(index);
                            $('#edit_eidtPulldown_copy').html(index);

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
                    OnClose: function (Type) {
                        if (Type == 'ok') {
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

                            //未添加題目的提示
                            if ($('#edit_pulldown_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#edit_pulldown_title').addClass('warning');
                                        if ($('#edit_pulldown_options').hasClass('warning')) {
                                            $('#edit_pulldown_options').removeClass('warning');
                                        }
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_pulldown_title').hasClass('warning')) {
                                    $('#edit_pulldown_title').removeClass('warning');
                                }
                                if ($('#edit_pulldown_options').hasClass('warning')) {
                                    $('#edit_pulldown_options').removeClass('warning');
                                }
                            }

                            //未添加選項的提示
                            if (newOption.length === 0) {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加選項</p>',
                                    OnOK: function () {
                                        $('#edit_pulldown_options').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_pulldown_options').hasClass('warning')) {
                                    $('#edit_pulldown_options').removeClass('warning');
                                }
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
                        var required = $('input[type="radio"][name="edit_radio3"]:checked').val();

                        //儲存新選項
                        var newOption = [];

                        var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_pulldown .edit_editPulldown_input');


                        for (var j = 0; j < nodeList.length; j++) {
                            newOption.push({
                                id: _uuid(),
                                val: nodeList[j].value,
                                jumpLogic: null,
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
                                    if (question.options) {
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
                                    }


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

                        //跳題題號重新排序
                        //vm.allQuestionnaireData.forEach(function (page) {
                        //    page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                        //        if (question.options) {
                        //            question.options.forEach(function (option) {
                        //                if (option.jumpLogic !== null) {
                        //                    vm.allQuestionnaireData.forEach(function (data) {
                        //                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                        //                            if (item.id == option.jumpLogic.jumpTo.id[0]) {
                        //                                option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                        //                            }
                        //                        });
                        //                    });
                        //                }
                        //            });
                        //        }
                        //    });
                        //});

                    }
                });
            }
        }

        if (type === 'textarea') {

            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增文本題',
                    OutsideStyle: 'max-width:700px',
                    Html: $('#editTextarea'),
                    OnClose: function (Type) {
                        if (Type === 'ok') {
                            //未添加題目的提示
                            if ($('#textarea_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#textarea_title').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#textarea_title').hasClass('warning')) {
                                    $('#textarea_title').removeClass('warning');
                                }
                            }
                        }
                    },
                    OnOK: function () {
                        //過場loading

                        if (vm.nowPage === 1) {

                            //是否必填
                            var required = $('input[type="radio"][name="radio4"]:checked').val();

                            //初始第一頁
                            vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                                type: 'textarea',
                                id: _uuid(),
                                questionNum: '',
                                title: $('#textarea_question_title').val(),
                                required: required,
                                showLogicCount: [],
                                answerVal: ''
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

                            vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageQuestionData"].push({
                                type: 'textarea',
                                id: _uuid(),
                                questionNum: '',
                                title: $('#textarea_question_title').val(),
                                required: required,
                                showLogicCount: [],
                                answerVal: ''
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
                    OnClose: function (Type) {
                        if (Type === 'ok') {
                            //未添加題目的提示
                            if ($('#edit_textarea_question_title').val() == '') {
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">未添加題目</p>',
                                    OnOK: function () {
                                        $('#edit_textarea_title').addClass('warning');
                                    }
                                });
                                return false;
                            } else {
                                if ($('#edit_textarea_title').hasClass('warning')) {
                                    $('#edit_textarea_title').removeClass('warning');
                                }
                            }
                        }
                    },
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

                        for (var i = 0; i < vm.allQuestionnaireData.length; i++) {

                            if (vm.allQuestionnaireData[i]['page'] == vm.nowPage) {

                                vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index].title = newTitle;
                                vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index].required = required;
                                break;
                            }

                        }

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
                                    if (question.options) {
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
                                    }


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



                        //跳題題號重新排序
                        //vm.allQuestionnaireData.forEach(function (page) {
                        //    page.questionDataPerPage.pageQuestionData.forEach(function (question) {
                        //        if (question.options) {
                        //            question.options.forEach(function (option) {
                        //                if (option.jumpLogic !== null) {
                        //                    vm.allQuestionnaireData.forEach(function (data) {
                        //                        data.questionDataPerPage.pageQuestionData.forEach(function (item) {
                        //                            if (item.id == option.jumpLogic.jumpTo.id[0]) {
                        //                                option.jumpLogic.jumpTo.val = ['Q' + item.questionNum + ' ' + item.title + ''];
                        //                            }
                        //                        });
                        //                    });
                        //                }
                        //            });
                        //        }

                        //    });
                        //});

                    }
                });
            }
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
            OnClose: function (Type) {
                if (Type === 'ok') {
                    $('#LoadingBox').show();
                }
            },
            OnOK: function () {

                if (type === 'side') {

                    var delPage = parseInt($('.del_page').attr("data-page"));

                    //刪除跳題邏輯
                    vm.allQuestionnaireData[delPage - 1].questionDataPerPage.pageQuestionData.forEach(function (question) {
                        //找被刪頁面的題目是否有跳至的問題
                        vm.allQuestionnaireData.forEach(function (item) {

                            item.questionDataPerPage.pageQuestionData.forEach(function (data) {
                                //刪除顯示跳題提示資料
                                if (data.options) {
                                    data.options.forEach(function (option) {
                                        if (option.jumpLogic !== null) {
                                            if (option.jumpLogic.jumpTo.id[0] == question.id) {
                                                option.jumpLogic = null;
                                            }
                                        }
                                    });
                                    //刪除選項跳題設定
                                    data.showLogicCount = [];
                                    data.options.forEach(function (option) {
                                        if (option.jumpLogic !== null) {
                                            data.showLogicCount.push(option.jumpLogic);
                                        }
                                    });
                                } else {
                                    data.showLogicCount = [];
                                }

                            });
                        });
                    });

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
                        $('#LoadingBox').hide();
                        return false;
                    } else {
                        vm.nowPage--;
                        vm.currentPage = '第 ' + vm.nowPage + ' 頁';
                        $('#LoadingBox').hide();
                    }


                }

                if (type === 'top') {
                    var delPage = parseInt($(dom).attr("data-page"));
                    //刪除跳題邏輯
                    vm.allQuestionnaireData[delPage - 1].questionDataPerPage.pageQuestionData.forEach(function (question) {
                        //找被刪頁面的題目是否有跳至的問題
                        vm.allQuestionnaireData.forEach(function (item) {

                            item.questionDataPerPage.pageQuestionData.forEach(function (data) {
                                //刪除顯示跳題提示資料
                                if (data.options) {
                                    data.options.forEach(function (option) {
                                        if (option.jumpLogic !== null) {
                                            if (option.jumpLogic.jumpTo.id[0] == question.id) {
                                                option.jumpLogic = null;
                                            }
                                        }
                                    });
                                    //刪除選項跳題設定
                                    data.showLogicCount = [];
                                    data.options.forEach(function (option) {
                                        if (option.jumpLogic !== null) {
                                            data.showLogicCount.push(option.jumpLogic);
                                        }
                                    });
                                } else {
                                    data.showLogicCount = [];
                                }
                            });
                        });
                    });


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
                        $('#LoadingBox').hide();
                        return false;
                    } else {
                        vm.nowPage--;
                        vm.currentPage = '第 ' + vm.nowPage + ' 頁';
                        $('#LoadingBox').hide();
                    }

                    //刪除跳題邏輯


                }

            }
        });
    };

    //保存問卷
    saveQuestionnaire = function () {

        //移除頁面跳轉監聽
        window.onbeforeunload = null;

        //判斷是否為新增問卷

        //取得網址id
        getUrlVars();
        var surveyId = $.getUrlVar('surveyId');

        if (surveyId !== '0') {

            //判斷問卷開放時間是否有誤
            if (startTimeVal > deadlineVal) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">問卷結束時間早於開放時間！</p>'
                });

                return false;
            }

            //儲存編輯後問卷資料
            var questionnaire = {
                id: surveyId,
                questionnaireTitle: vm.questionnaireTitle,
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: deadline || vm.deadline,
                questionnaireStartTime: startTime || vm.startTime,
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
            };

            axios.patch('http://localhost:3000/questionnaire/' + surveyId + '', questionnaire).then(function (res) {
                window.location.href = 'QuestionnaireList.aspx?user=admin';
            });

        } else {

            //判斷問卷開放時間是否有誤
            if (startTimeVal > deadlineVal) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">問卷結束時間早於開放時間！</p>'
                });

                return false;
            }

            //儲存新建問卷
            var questionnaire = {
                id: _uuid(),
                questionnaireTitle: vm.questionnaireTitle,
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: deadline || '',
                questionnaireStartTime: startTime || '',
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
            };


            axios.post('http://localhost:3000/questionnaire', questionnaire).then(function (res) {
                window.location.href = 'QuestionnaireList.aspx?user=admin';
            });
        }



    };

    //取消編輯問卷
    cancelQuestionnaire = function () {
        window.location.href = 'QuestionnaireList.aspx?user=admin';
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
    deleteOption = function (e, type, status) {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯選項',
            Html: '<p style="font-size:18px;color:#ff6a00">確定刪除選項(若選項有設置跳題將一併刪除)?</p>',
            OnClose: function (Type) {
                if (Type === 'ok') {
                    $('#LoadingBox').show();
                }
            },
            OnOK: function () {
                if (status === 'add') {
                    $(e.target).parents('.editOptions').remove();
                    $('#LoadingBox').hide();
                }

                if (status === 'edit') {

                    if (type === 'radio') {
                        var index = $('#edit_eidtRadio_del').html();
                        var title = $(e.target).parents('.editOptions').find('.edit_editRadio_input').val();
                    }

                    if (type === 'checkbox') {
                        var index = $('#edit_eidtCheckbox_del').html();
                        var title = $(e.target).parents('.editOptions').find('.edit_editCheckbox_input').val();
                    }

                    if (type === 'pulldown') {
                        var index = $('#edit_eidtPulldown_del').html();
                        var title = $(e.target).parents('.editOptions').find('.edit_editPulldown_input').val();
                    }

                    $(e.target).parents('.editOptions').remove();
                    //刪除跳題邏輯
                    //取移除選項的值，比對若有設置跳題則刪除

                    $('#LoadingBox').hide();
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
    deleteQuestion = function (e, dom) {

        alertBox({
            Mode: 'C',
            Html: '<p style="font-size:18px;color:#ff6a00">確定刪除問題 (跳題設定將會一併刪除)?</p>',
            OnClose: function (Type) {
                if (Type === 'ok') {
                    $('#LoadingBox').show();
                }
            },
            OnOK: function () {

                var type = $(dom).attr('data-type');

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
                            if (question.options) {
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
                            } else {
                                //文本題的狀況

                                question.showLogicCount.forEach(function (logic, index) {
                                    if (logic.jumpTo.id[0] == delId) {
                                        question.showLogicCount = [];
                                    }
                                });
                            }
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
                            if (question.options) {
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

                            }

                            //若有跳題設定
                            if (question.showLogicCount.length !== 0) {
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
                            }


                        });
                    });

                    $('#LoadingBox').hide();

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

        alertBox({
            Mode: 'C',
            Title: '複製問題',
            Html: '<p style="color:#FD6A4F">確定複製問題?</p>',
            OnClose: function (Type) {
                if (Type === 'ok') {
                    $('#LoadingBox').show();
                }
            },
            OnOK: function () {
                var index = $(dom).attr('data-index');
                for (var i = 0; i < vm.allQuestionnaireData.length; i++) {
                    if (vm.allQuestionnaireData[i]["page"] == vm.nowPage) {

                        //深拷貝物件
                        //copyQuestion = $.extend(true, {}, vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index]);
                        var copyQuestion = _.cloneDeep(vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"][index]);
                        //重設問題id
                        copyQuestion["id"] = _uuid();
                        //重設選項id
                        if (copyQuestion.options) {
                            copyQuestion.options.forEach(function (option) {
                                option.id = _uuid();
                                option.jumpLogic = null;
                            });
                        }
                        //重設跳題提示數目
                        copyQuestion["showLogicCount"] = [];
                        vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"].push(copyQuestion);
                        //vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"].splice(index+1,0,copyQuestion);
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
                        if (question.options) {
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
                        }

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

                $('#LoadingBox').hide();

            }
        });




    };

    //邏輯跳題
    jumpQuestion = function (e, dom) {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-code-fork"></i>&nbsp;設定跳題邏輯',
            OutsideStyle: 'max-width:900px',
            Html: $('#jumpQuestion'),
            OnReady: function () {

                var type = $(dom).attr('data-type');

                if (type === 'radio') {

                    //顯示當前題目
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

                    //添加任意選項
                    options.push({
                        Text: '任意選項',
                        Val: '任意選項'
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
                            if (Select[0] == '任意選項') {
                                vm.tempLogicSetting.allJump = Select;
                            }
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
                    //顯示當前題目
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

                    //添加任意選項
                    options.push({
                        Text: '任意選項',
                        Val: '任意選項'
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
                        Type: 'multiple',
                        Data: [{ Optgroup: '', Option: options }],
                        Search: true,
                        ButtonText: '請選擇選項',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            //激活選項
                            if (Select[0] == '任意選項') {
                                vm.tempLogicSetting.allJump = Select;
                            }
                            vm.tempLogicSetting.triggerOption.id = Select;
                            vm.tempLogicSetting.triggerOption.val = DropListTempData['selected_option'].SelectText;
                            console.log(vm.tempLogicSetting.triggerOption.val);

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

                if (type === 'pulldown') {

                    //顯示當前題目
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

                    //添加任意選項
                    options.push({
                        Text: '任意選項',
                        Val: '任意選項'
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
                            if (Select[0] == '任意選項') {
                                vm.tempLogicSetting.allJump = Select;
                            }
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

                if (type === 'textarea') {

                    //顯示當前題目
                    var index = $(dom).attr('data-index');
                    var currentTitle = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].title;
                    var currentQuestionNum = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].questionNum;

                    $('#currentTitle').html('<span style="color:#FF6A00">Q' + currentQuestionNum + '&emsp;' + currentTitle + '</span>');

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

            },
            OnOK: function () {

                var type = $(dom).attr('data-type');
                //var result = '<i class="fa fa-code-fork"></i>&nbsp;若本題選擇【' + vm.tempLogicSetting.triggerOption.val + '】，則跳至第&nbsp;' + vm.tempLogicSetting.jumpTo.val + '&nbsp;題';

                if (type === 'radio') {

                    //取得當前編輯的問題
                    var index = $(dom).attr('data-index');
                    var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                    //是否選擇任意選項跳題
                    if (vm.tempLogicSetting.allJump.length === 0) {
                        //沒有任意選項跳題
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
                    } else {
                        //有任意選項跳題
                        //清空顯示跳題提示data
                        target.showLogicCount = [];
                        target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                    }

                }
                if (type === 'checkbox') {
                    //取得當前編輯的問題
                    var index = $(dom).attr('data-index');
                    var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                    //是否選擇任意選項跳題
                    if (vm.tempLogicSetting.allJump.length === 0) {
                        //沒有任意選項跳題
                        //是否為多選跳題
                        if (vm.tempLogicSetting.triggerOption.val.length === 1) {
                            //單選跳題
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
                        } else {
                            //多選跳題
                            //有任意選項跳題

                            var index = -1; //不存在的index，用來記錄相同的多選跳題選項
                            for (var i = 0; i < target.showLogicCount.length; i++) {
                                //若為單選跳題則跳過
                                if (target.showLogicCount[i].triggerOption.val.length === 1) {
                                    continue;
                                }

                                if (_.isEqual(target.showLogicCount[i].triggerOption.val, vm.tempLogicSetting.triggerOption.val)) {

                                    index = i;
                                    break;
                                }
                            }

                            if (index !== -1) { //匹配相同的多選跳題選項
                                target.showLogicCount[index] = _.cloneDeep(vm.tempLogicSetting);
                            } else { //若無匹配則新增
                                target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                            }

                        }
                    } else {
                        //有任意選項跳題
                        //清空顯示跳題提示data
                        target.showLogicCount = [];
                        target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                    }

                }
                if (type === 'pulldown') {
                    //取得當前編輯的問題
                    var index = $(dom).attr('data-index');
                    var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                    //是否選擇任意選項跳題
                    if (vm.tempLogicSetting.allJump.length === 0) {
                        //沒有任意選項跳題
                        //是否為多選跳題
                        if (vm.tempLogicSetting.triggerOption.val.length === 1) {
                            //單選跳題
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
                        } else {
                            //多選跳題
                            //有任意選項跳題

                            var index = -1; //不存在的index，用來記錄相同的多選跳題選項
                            for (var i = 0; i < target.showLogicCount.length; i++) {
                                //若為單選跳題則跳過
                                if (target.showLogicCount[i].triggerOption.val.length === 1) {
                                    continue;
                                }

                                if (_.isEqual(target.showLogicCount[i].triggerOption.val, vm.tempLogicSetting.triggerOption.val)) {

                                    index = i;
                                    break;
                                }
                            }

                            if (index !== -1) { //匹配相同的多選跳題選項
                                target.showLogicCount[index] = _.cloneDeep(vm.tempLogicSetting);
                            } else { //若無匹配則新增
                                target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                            }

                        }
                    } else {
                        //有任意選項跳題
                        //清空顯示跳題提示data
                        target.showLogicCount = [];
                        target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                    }
                }
                if (type === 'textarea') {
                    //取得當前編輯的問題
                    var index = $(dom).attr('data-index');
                    var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                    target.showLogicCount = [(_.cloneDeep(vm.tempLogicSetting))];
                }
            }
        });
    };

    //顯示跳題設定結果
    showLogicSetting = function (dom, type) {
        alertBox({
            Mode: 'C',
            Html: $('#show_logic_setting'),
            Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯跳題設定',
            OutsideStyle: 'max-width:750px',
            OnReady: function () {
                $('#show_logic_content').empty();
                var index = $(dom).attr("data-logic");
                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].showLogicCount;
                console.log(target);
                if (type === 'radio') {

                    //判斷是否有任意選項
                    if (target.length === 1) {

                        //切割字串
                        var string = _.split(target[0].jumpTo.val[0], '');
                        var split;
                        if (string.length > 20) {
                            split = _.split(target[0].jumpTo.val[0], '', (string.length - 10)).join('') + '...';
                            console.log(split);
                        } else {
                            split = target[0].jumpTo.val[0];
                        }

                        //只設定一個跳題選項或有設定任意選項跳題
                        if (target[0].allJump.length === 0) {
                            //沒有任意選項跳題

                            $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val[0] + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[0].triggerOption.id[0] + '" onclick="delLogicSetting(event,' + index + ',$(this),' + null + ')">刪除跳題設定</button></div>');
                        } else {
                            //有任意選項跳題
                            $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="任意選項" onclick="delLogicSetting(event,' + index + ',$(this),' + null + ')">刪除跳題設定</button></div>');
                        }
                    } else {
                        for (var i = 0; i < target.length; i++) {

                            //切割字串
                            var string = _.split(target[i].jumpTo.val[0], '');
                            var split;
                            if (string.length > 20) {
                                split = _.split(target[i].jumpTo.val[0], '', (string.length - 10)).join('') + '...';
                                console.log(split);
                            } else {
                                split = target[i].jumpTo.val[0];
                            }

                            $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[i].triggerOption.val[0] + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[i].triggerOption.id[0] + '" onclick="delLogicSetting(event,' + index + ',$(this),' + null + ')">刪除跳題設定</button></div>');

                        }
                    }

                } else if (type === 'checkbox' || type === 'pulldown') {

                    //判斷是否有任意選項
                    if (target.length === 1) {

                        //切割字串
                        var string = _.split(target[0].jumpTo.val[0], '');
                        var split;
                        if (string.length > 20) {
                            split = _.split(target[0].jumpTo.val[0], '', (string.length - 10)).join('') + '...';
                            console.log(split);
                        } else {
                            split = target[0].jumpTo.val[0];
                        }

                        //只設定一個跳題選項或有設定任意選項跳題
                        if (target[0].allJump.length === 0) {
                            //沒有任意選項跳題
                            $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[0].triggerOption.id[0] + '" onclick="delLogicSetting(event,' + index + ',$(this),' + null + ')">刪除跳題設定</button></div>');
                        } else {
                            //有任意選項跳題
                            $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="任意選項" onclick="delLogicSetting(event,' + index + ',$(this),' + null + ')">刪除跳題設定</button></div>');
                        }

                    } else {
                        //多選跳題
                        for (var i = 0; i < target.length; i++) {

                            //切割字串
                            var string = _.split(target[i].jumpTo.val[0], '');
                            var split;
                            if (string.length > 20) {
                                split = _.split(target[i].jumpTo.val[0], '', (string.length - 10)).join('') + '...';
                                console.log(split);
                            } else {
                                split = target[i].jumpTo.val[0];
                            }

                            $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[i].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="多選跳題" onclick="delLogicSetting(event,' + index + ',$(this), ' + i + ')">刪除跳題設定</button></div>');

                        }
                    }
                } else {

                    //切割字串
                    var string = _.split(target[0].jumpTo.val[0], '');
                    var split;
                    if (string.length > 20) {
                        split = _.split(target[0].jumpTo.val[0], '', (string.length - 10)).join('') + '...';
                        console.log(split);
                    } else {
                        split = target[0].jumpTo.val[0];
                    }

                    $('#show_logic_content').append('<div style="display:flex;margin-bottom:20px"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                         若有填答則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="文本跳題" onclick="delLogicSetting(event,' + index + ',$(this), ' + null + ')">刪除跳題設定</button></div>');
                }

            }
        });
    };

    //刪除邏輯跳題
    delLogicSetting = function (e, index, dom, multi) {
        alertBox({
            Mode: 'C',
            Title: '刪除跳題設定',
            Html: '<p style="color:#FD6A4F">確定刪除跳題設定 ?</p>',
            OnClose: function (Type) {
                if (Type === 'ok') {
                    $('#LoadingBox').show();
                }
            },
            OnOK: function () {
                //刪除畫面
                $(e.target).parent().parent().remove();

                //刪除資料
                var delId = $(dom).attr('data-delId');
                var item = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];

                //判斷是多選或單選跳題

                if (delId == '任意選項' || delId == '文本跳題') {
                    item.showLogicCount = [];
                    $('#LoadingBox').hide();
                } else {
                    if (delId === '多選跳題') {
                        item.showLogicCount.splice(multi, 1);
                        $('#LoadingBox').hide();
                    } else {
                        item.options.forEach(function (option) {
                            if (option.id == delId) {
                                option.jumpLogic = null;
                            }
                        });

                        //更新顯示跳題提示
                        item.showLogicCount.forEach(function (logic, index) {
                            if (logic.triggerOption.id[0] == delId) {
                                item.showLogicCount.splice(index, 1);
                            }
                        });
                        $('#LoadingBox').hide();
                    }

                }



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
        //$('body').delay(500).show(1, function () {
        //    $('.showQuestions_unit_tools').show();
        //});
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
    var startTime;
    var deadline;
    var startTimeVal;
    var deadlineVal;
    TimePickSetting({
        ID: 'deadline',
        Format: 'yyyy-MM-dd HH:mm',
        TimePick: true,
        OnClose: function () {
            deadlineVal = TimePickGet('deadline').Time;
            deadline = TimePickGet('deadline').Format;
        }
    });

    TimePickSetting({
        ID: 'startTime',
        Format: 'yyyy-MM-dd HH:mm',
        TimePick: true,
        OnClose: function () {
            startTimeVal = TimePickGet('startTime').Time;
            startTime = TimePickGet('startTime').Format;
        }
    });



    //跳離頁面或刷新的提示
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
                startTime: '', //開始時間
                deadline: '', //截止日期
                repeat: '', // 問卷可否重複填答
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
                    },
                    allJump: []
                } //暫存跳題設定
            }
        },
        created: function () {
            //隱藏顯示區塊
            //取得網址id
            getUrlVars();
            var surveyId = $.getUrlVar('surveyId');

            if (surveyId === '0' || surveyId == undefined) {// 新增問卷
                $('.tableDisplayNone').show();
                $('.questionDisplayNone').show();
                $('#LoadingBox').hide();
                return;
            }
            this.getData(surveyId);
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
                    vm.startTime = res.data.questionnaireStartTime;
                    vm.repeat = res.data.repeatAnswer;

                    //紀錄頁面跳轉選項
                    //先清空預設選項
                    vm.data[0].Option = [];
                    vm.allQuestionnaireData.forEach(function (page) {
                        vm.data[0].Option.push({
                            Text: '第 ' + page.page + ' 頁',
                            Val: page.page
                        });
                    });

                    $('.tableDisplayNone').show();
                    $('.questionDisplayNone').show();
                    $('#LoadingBox').hide();

                });
            },
            resetTime: function (type) {
                if (type === 'start') {
                    this.startTime = '';
                }
                if (type === 'end') {
                    this.deadline = '';
                }

            }
        }

    });

});
