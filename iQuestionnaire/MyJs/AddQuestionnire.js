﻿$(function () {
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

        //未添加頁面的提示
        var questionWrap = $('.showQuestions_wrap');
        if (questionWrap.length === 0) {
            alertBox({
                Mode: 'A',
                Title: '錯誤提示',
                Html: '<p style="color:#FF6A00">尚未添加頁面!</p>',
                OutsideStyle: 'max-width:700px'
            });
            return false;
        }

        var type = $(dom).attr('data-type');

        if (type === 'radio') {

            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增單選題',
                    OutsideStyle: 'max-width:800px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#editRadio'),
                    OnClose: function (Type) {
                        if (Type == 'ok') {

                            //存每個選項的值
                            var options = [];
                            var optionWeight = [];
                            $('.showEditOptions_radio .input_area input').each(function (index, val) {
                                options.push({
                                    id: _uuid(),
                                    val: $(this).val(),
                                    jumpLogic: null,
                                });
                            });


                            //存選項的題次
                            $('.showEditOptions_radio').find('input.radio_optionNum').each(function (index) {
                                var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                                options[index].optionNum = num;
                            });


                            //存選項權重
                            $('input.radio_option_weight_input').not(':first').each(function () {
                                optionWeight.push($(this).val());
                                console.dir(typeof $(this).val());
                            });

                            options.forEach(function (option, index) {
                                option.optionWeight = optionWeight[index];                               
                            });


                            //題目未添加的提示
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

                            //選項未添加的提示
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

                                for (var i = 0; i < options.length; i++) {
                                    if (options[i].val === '') {
                                        alertBox({
                                            Mode: 'A',
                                            Html: '<p style="color:#FF6A00">未添加選項</p>',
                                            OnOK: function () {
                                                $('#radio_options').addClass('warning');
                                            }
                                        });
                                        return false;
                                    }
                                }
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

                            //權重和題號未添加 / 格式錯誤的提示
                            var re = /^[0-9]+$/;
                            for (var i = 0; i < options.length; i++) {
                                if (options[i].optionWeight === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定權重!</p>',
                                        OnOK: function () {
                                            $('.showEditOptions_radio .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                } else if (options[i].optionWeight !== '' && !re.test(options[i].optionWeight)) {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">權重設定必須為數字!</p>',
                                        OnOK: function () {
                                            $('.showEditOptions_radio .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                }


                            }

                            for (var i = 0; i < options.length; i++) {
                                if (options[i].optionNum === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定選項題次!</p>'
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
                        var optionWeight = [];
                        $('.showEditOptions_radio .input_area input').each(function (index, val) {
                            options.push({
                                id: _uuid(),
                                val: $(this).val(),
                                jumpLogic: null,
                            });
                        });


                        //存選項的題次
                        $('.showEditOptions_radio').find('input.radio_optionNum').each(function (index) {
                            var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                            options[index].optionNum = num;
                        });


                        //存選項權重
                        $('input.radio_option_weight_input').not(':first').each(function () {
                            optionWeight.push($(this).val());
                        });

                        options.forEach(function (option, index) {
                            option.optionWeight = optionWeight[index];
                        });


                        if (vm.nowPage === 1) {
                            //清空預設提示
                            $('h4.page_desc').remove();
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

                            //選項計數歸0
                            optionNumCount = 0;
                            //題號重新排序
                            resetNum();

                        } else {
                            //清空預設提示
                            $('h4.page_desc').remove();
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

                            //選項計數歸0
                            optionNumCount = 0;
                            //題號重新排序
                            resetNum();
                        }


                    },
                    OnCancel: function () {
                        //選項計數歸0
                        optionNumCount = 0;
                    }
                });
            }

            if (status === 'edit') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯單選題',
                    OutsideStyle: 'max-width:800px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#edit_editRadio'),
                    OnRun: function () {
                        $('#LoadingBox').show();
                    },
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

                            //更新編輯選項計數
                            editOptionCount = data['options'].length;

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
                            //更新選項題次
                            //更新選項權重
                            var option = $('.editOptions_wrap#edit_editOptions_wrap_radio').html();

                            $('.editOptions_wrap#edit_editOptions_wrap_radio').empty();


                            for (var j = 0; j < data['options'].length; j++) {
                                $('.editOptions_wrap#edit_editOptions_wrap_radio').append(option);
                            }

                            for (var k = 0; k < data['options'].length; k++) {
                                $('.editOptions_wrap#edit_editOptions_wrap_radio').find('.edit_editRadio_input').eq(k).val(data['options'][k].val);
                                $('.editOptions_wrap#edit_editOptions_wrap_radio').find('.edit_radio_optionNum').eq(k).val(data['options'][k].optionNum + '、');
                                $('.editOptions_wrap#edit_editOptions_wrap_radio').find('input.edit_radio_option_weight_input').eq(k).val(data['options'][k].optionWeight);
                            }

                            $('#LoadingBox').hide();
                        }

                    },
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            //儲存新選項
                            //儲存新選項/權重
                            var newOption = [];
                            var optionWeight = [];

                            var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_editRadio_input');


                            for (var j = 0; j < nodeList.length; j++) {
                                newOption.push({
                                    id: _uuid(),
                                    val: nodeList[j].value,
                                    jumpLogic: null,
                                });
                            }

                            //存選項的題次
                            $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_radio_optionNum').each(function (index) {
                                var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                                newOption[index].optionNum = num;
                            });


                            //存選項權重
                            $('.editOptions_wrap#edit_editOptions_wrap_radio').find('input.edit_radio_option_weight_input').each(function (index) {
                                optionWeight.push($(this).val());
                            });


                            newOption.forEach(function (option, index) {
                                option.optionWeight = optionWeight[index];
                            });

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

                                for (var i = 0; i < newOption.length; i++) {
                                    if (newOption[i].val === '') {
                                        alertBox({
                                            Mode: 'A',
                                            Html: '<p style="color:#FF6A00">未添加選項</p>',
                                            OnOK: function () {
                                                $('#edit_radio_options').addClass('warning');
                                            }
                                        });
                                        return false;
                                    }
                                }
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

                            var re = /^[0-9]+$/;
                            for (var i = 0; i < newOption.length; i++) {

                                if (newOption[i].optionWeight === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定權重!</p>',
                                        OnOK: function () {
                                            $('#edit_editOptions_wrap_radio .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                } else if (newOption[i].optionWeight !== '' && !re.test(newOption[i].optionWeight)) {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">權重設定必須為數字!</p>',
                                        OnOK: function () {
                                            $('#edit_editOptions_wrap_radio .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                }
                            }

                            for (var i = 0; i < newOption.length; i++) {
                                if (newOption[i].optionNum === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定選項題次!</p>'
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

                        //儲存新選項/權重
                        var newOption = [];
                        var optionWeight = [];

                        var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_editRadio_input');


                        for (var j = 0; j < nodeList.length; j++) {
                            newOption.push({
                                id: _uuid(),
                                val: nodeList[j].value,
                                jumpLogic: null,
                            });
                        }

                        //存選項的題次
                        $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_radio_optionNum').each(function (index) {
                            var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                            newOption[index].optionNum = num;
                        });


                        //存選項權重
                        $('.editOptions_wrap#edit_editOptions_wrap_radio').find('input.edit_radio_option_weight_input').each(function (index) {
                            optionWeight.push($(this).val());
                        });


                        newOption.forEach(function (option, index) {
                            option.optionWeight = optionWeight[index];
                        });



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

                            //編輯選項計數歸0
                            editOptionCount = 0;
                            //跳題題號重新排序
                            resetOrder();

                        }

                    },
                    OnCancel: function () {
                        //編輯選項計數歸0
                        editOptionCount = 0;
                    }
                });
            }
        }

        if (type === 'checkbox') {

            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增多選題',
                    OutsideStyle: 'max-width:800px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#editCheckbox'),
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            var options = [];
                            var optionWeight = [];
                            $('.showEditOptions_checkbox .input_area input').each(function (index, val) {
                                options.push({
                                    id: _uuid(),
                                    val: $(this).val(),
                                    jumpLogic: null,
                                });
                            });

                            //存選項題次
                            $('.checkbox_optionNum').not(':first').each(function (index) {
                                var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                                options[index].optionNum = num;
                            });

                            $('input.checkbox_option_weight_input').not(':first').each(function () {
                                optionWeight.push($(this).val());
                            });

                            options.forEach(function (option, index) {
                                option.optionWeight = optionWeight[index];
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
                                for (var i = 0; i < options.length; i++) {
                                    if (options[i].val === '') {
                                        alertBox({
                                            Mode: 'A',
                                            Html: '<p style="color:#FF6A00">未添加選項</p>',
                                            OnOK: function () {
                                                $('#checkbox_options').addClass('warning');
                                            }
                                        });

                                        return false;
                                    }
                                }
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

                            var re = /^[0-9]+$/;
                            for (var i = 0; i < options.length; i++) {
                                if (options[i].optionWeight === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定權重!</p>',
                                        OnOK: function () {
                                            $('.showEditOptions_checkbox .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                } else if (options[i].optionWeight !== '' && !re.test(options[i].optionWeight)) {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">權重設定必須為數字!</p>',
                                        OnOK: function () {
                                            $('.showEditOptions_checkbox .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                }
                            }

                            for (var i = 0; i < options.length; i++) {
                                if (options[i].optionNum === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定選項題次!</p>'
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
                        var optionWeight = [];
                        $('.showEditOptions_checkbox .input_area input').each(function (index, val) {
                            options.push({
                                id: _uuid(),
                                val: $(this).val(),
                                jumpLogic: null,
                            });
                        });

                        //存選項題次
                        $('.checkbox_optionNum').not(':first').each(function (index) {
                            var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                            options[index].optionNum = num;
                        });

                        $('input.checkbox_option_weight_input').not(':first').each(function () {
                            optionWeight.push($(this).val());                            
                        });

                        options.forEach(function (option, index) {
                            option.optionWeight = optionWeight[index];
                        });

                        if (vm.nowPage === 1) {
                            //清空預設提示
                            $('h4.page_desc').remove();
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

                            //選項計數歸0
                            optionNumCount = 0;
                            //題號重新排序
                            resetNum();
                        } else {
                            //清空預設提示
                            $('h4.page_desc').remove();
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

                            //選項計數歸0
                            optionNumCount = 0;
                            //題號重新排序
                            resetNum();
                        }

                    },
                    OnCancel: function () {
                        //選項計數歸0
                        optionNumCount = 0;
                    }
                });

            }

            if (status === 'edit') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯多選題',
                    OutsideStyle: 'max-width:800px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#edit_editCheckbox'),
                    OnRun: function () {
                        $('#LoadingBox').show();
                    },
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

                            //更新編輯選項計數
                            editOptionCount = data['options'].length;

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
                            //更新選項題次
                            //更新選項權重
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
                                $('.edit_checkbox_optionNum').eq(k).val(data['options'][k].optionNum + '、');
                                $('.edit_checkbox_option_weight_input').eq(k).val(data['options'][k].optionWeight);
                            }

                            $('#LoadingBox').hide();
                        }

                    },
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            //儲存新選項/權重
                            var newOption = [];
                            var optionWeight = [];

                            var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_checkbox .edit_editCheckbox_input');

                            for (var j = 0; j < nodeList.length; j++) {
                                newOption.push({
                                    id: _uuid(),
                                    val: nodeList[j].value,
                                    jumpLogic: null,
                                });
                            }

                            //存選項的題次
                            $('.edit_checkbox_optionNum').each(function (index) {
                                var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                                newOption[index].optionNum = num;
                            });

                            //存選項權重
                            $('input.edit_checkbox_option_weight_input').each(function (index) {
                                optionWeight.push($(this).val());
                            });


                            newOption.forEach(function (option, index) {
                                option.optionWeight = optionWeight[index];
                            });

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
                                for (var i = 0; i < newOption.length; i++) {
                                    if (newOption[i].val === '') {
                                        alertBox({
                                            Mode: 'A',
                                            Html: '<p style="color:#FF6A00">未添加選項</p>',
                                            OnOK: function () {
                                                $('#edit_checkbox_options').addClass('warning');
                                            }
                                        });

                                        return false;
                                    }
                                }
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

                            var re = /^[0-9]+$/;
                            for (var i = 0; i < newOption.length; i++) {
                                if (newOption[i].optionWeight === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定權重!</p>',
                                        OnOK: function () {
                                            $('#edit_editOptions_wrap_checkbox .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                } else if (newOption[i].optionWeight !== '' && !re.test(newOption[i].optionWeight)) {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">權重設定必須為數字!</p>',
                                        OnOK: function () {
                                            $('#edit_editOptions_wrap_checkbox .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                }
                            }

                            for (var i = 0; i < newOption.length; i++) {
                                if (newOption[i].optionNum === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定選項題次!</p>'
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

                        //儲存新選項/權重
                        var newOption = [];
                        var optionWeight = [];

                        var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_checkbox .edit_editCheckbox_input');

                        for (var j = 0; j < nodeList.length; j++) {
                            newOption.push({
                                id: _uuid(),
                                val: nodeList[j].value,
                                jumpLogic: null,
                            });
                        }

                        //存選項的題次
                        $('.edit_checkbox_optionNum').each(function (index) {
                            var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                            newOption[index].optionNum = num;
                        });

                        //存選項權重
                        $('input.edit_checkbox_option_weight_input').each(function (index) {
                            optionWeight.push($(this).val());
                        });


                        newOption.forEach(function (option, index) {
                            option.optionWeight = optionWeight[index];
                        });



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

                            //選項計數歸0
                            optionNumCount = 0;

                            //跳題題號重新排序
                            resetOrder();


                        }

                    },
                    OnCancel: function () {
                        //選項計數歸0
                        optionNumCount = 0;
                    }
                });
            }
        }

        if (type === 'pulldown') {

            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增下拉題',
                    OutsideStyle: 'max-width:800px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#editPulldown'),
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            //存每個選項的值
                            //存選項題次
                            var options = [];
                            var optionWeight = [];
                            $('.showEditOptions_pulldown .input_area input').each(function (index, val) {
                                options.push({
                                    id: _uuid(),
                                    val: $(this).val(),
                                    jumpLogic: null,
                                });
                            });

                            $('.pulldown_optionNum').not(':first').each(function (index) {
                                var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                                options[index].optionNum = num;
                            });

                            $('input.pulldown_option_weight_input').not(':first').each(function () {
                                optionWeight.push($(this).val());
                            });

                            options.forEach(function (option, index) {
                                option.optionWeight = optionWeight[index];
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
                                for (var i = 0; i < options.length; i++) {
                                    if (options[i].val === '') {
                                        alertBox({
                                            Mode: 'A',
                                            Html: '<p style="color:#FF6A00">未添加選項</p>',
                                            OnOK: function () {
                                                $('#pulldown_options').addClass('warning');
                                            }
                                        });
                                        return false;
                                    }
                                }
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

                            var re = /^[0-9]+$/;
                            for (var i = 0; i < options.length; i++) {
                                if (options[i].optionWeight === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定權重!</p>',
                                        OnOK: function () {
                                            $('.showEditOptions_pulldown .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                } else if (options[i].optionWeight !== '' && !re.test(options[i].optionWeight)) {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">權重設定必須為數字!</p>',
                                        OnOK: function () {
                                            $('.showEditOptions_pulldown .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                }
                            }

                            for (var i = 0; i < options.length; i++) {
                                if (options[i].optionNum === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定選項題次!</p>'
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
                        //存選項題次
                        var options = [];
                        var optionWeight = [];
                        $('.showEditOptions_pulldown .input_area input').each(function (index, val) {
                            options.push({
                                id: _uuid(),
                                val: $(this).val(),
                                jumpLogic: null,
                            });
                        });

                        $('.pulldown_optionNum').not(':first').each(function (index) {
                            var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                            options[index].optionNum = num;
                        });

                        $('input.pulldown_option_weight_input').not(':first').each(function () {
                            optionWeight.push($(this).val());
                        });

                        options.forEach(function (option, index) {
                            option.optionWeight = optionWeight[index];
                        });


                        if (vm.nowPage === 1) {
                            //清空預設提示
                            $('h4.page_desc').remove();
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

                            //選項計數歸0
                            optionNumCount = 0;
                            //題號重新排序
                            resetNum();
                        } else {
                            //清空預設提示
                            $('h4.page_desc').remove();
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

                            //選項計數歸0
                            optionNumCount = 0;
                            //題號重新排序
                            resetNum();
                        }
                    },
                    OnCancel: function () {
                        //選項計數歸0
                        optionNumCount = 0;
                    }
                });
            }

            if (status === 'edit') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯下拉題',
                    OutsideStyle: 'max-width:800px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#edit_editPulldown'),
                    OnRun: function () {
                        $('#LoadingBox').show();
                    },
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

                            //更新編輯選項計數
                            editOptionCount = data['options'].length;

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
                            //更新選項題次
                            //更新選項權重
                            var questionTitle = $(dom).parents('.showQuestions_unit_tools').siblings('.question_title').html();
                            $('#quesitonNum').html(questionTitle);

                            var option = $('.editOptions_wrap#edit_editOptions_wrap_pulldown').html();


                            $('.editOptions_wrap#edit_editOptions_wrap_pulldown').empty();

                            for (var j = 0; j < data['options'].length; j++) {
                                $('.editOptions_wrap#edit_editOptions_wrap_pulldown').append(option);
                            }

                            for (var k = 0; k < data['options'].length; k++) {
                                $('.editOptions_wrap#edit_editOptions_wrap_pulldown').find('.edit_editPulldown_input')[k].value = data['options'][k].val;
                                $('.edit_pulldown_optionNum').eq(k).val(data['options'][k].optionNum + '、');
                                $('.edit_pulldown_option_weight_input').eq(k).val(data['options'][k].optionWeight);
                            }

                            $('#LoadingBox').hide();
                        }

                    },
                    OnClose: function (Type) {
                        if (Type == 'ok') {
                            //儲存新選項/權重
                            var newOption = [];
                            var optionWeight = [];

                            var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_pulldown .edit_editPulldown_input');


                            for (var j = 0; j < nodeList.length; j++) {
                                newOption.push({
                                    id: _uuid(),
                                    val: nodeList[j].value,
                                    jumpLogic: null,
                                });
                            }

                            //存選項的題次
                            $('.edit_pulldown_optionNum').each(function (index) {
                                var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                                newOption[index].optionNum = num;
                            });

                            //存選項權重
                            $('input.edit_pulldown_option_weight_input').each(function (index) {
                                optionWeight.push($(this).val());
                            });


                            newOption.forEach(function (option, index) {
                                option.optionWeight = optionWeight[index];
                            });

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
                                for (var i = 0; i < newOption.length; i++) {
                                    if (newOption[i].val === '') {
                                        alertBox({
                                            Mode: 'A',
                                            Html: '<p style="color:#FF6A00">未添加選項</p>',
                                            OnOK: function () {
                                                $('#edit_pulldown_options').addClass('warning');
                                            }
                                        });
                                        return false;
                                    }
                                }
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

                            var re = /^[0-9]+$/;
                            for (var i = 0; i < newOption.length; i++) {
                                if (newOption[i].optionWeight === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定權重!</p>',
                                        OnOK: function () {
                                            $('#edit_editOptions_wrap_pulldown .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                } else if (newOption[i].optionWeight !== '' && !re.test(newOption[i].optionWeight)) {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">權重設定必須為數字!</p>',
                                        OnOK: function () {
                                            $('#edit_editOptions_wrap_pulldown .editOptions').eq(i).addClass('warn');
                                        }
                                    });
                                    return false;
                                }
                            }

                            for (var i = 0; i < newOption.length; i++) {
                                if (newOption[i].optionNum === '') {
                                    alertBox({
                                        Mode: 'A',
                                        Html: '<p style="color:#FF6A00">未設定選項題次!</p>'
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

                        //儲存新選項/權重
                        var newOption = [];
                        var optionWeight = [];

                        var nodeList = $('.editOptions_wrap#edit_editOptions_wrap_pulldown .edit_editPulldown_input');


                        for (var j = 0; j < nodeList.length; j++) {
                            newOption.push({
                                id: _uuid(),
                                val: nodeList[j].value,
                                jumpLogic: null,
                            });
                        }

                        //存選項的題次
                        $('.edit_pulldown_optionNum').each(function (index) {
                            var num = $(this).val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\-|\_|\ |\=|\||\\|\[|\]|\{|\}|\;|\:|\”|\’|\、|\<|\.|\>|\/|\?]/g, '');
                            newOption[index].optionNum = num;
                        });

                        //存選項權重
                        $('input.edit_pulldown_option_weight_input').each(function (index) {
                            optionWeight.push($(this).val());
                        });


                        newOption.forEach(function (option, index) {
                            option.optionWeight = optionWeight[index];
                        });

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

                            //選項計數歸0
                            optionNumCount = 0;

                            //跳題題號重新排序
                            resetOrder();

                        }

                    },
                    OnCancel: function () {
                        //選項計數歸0
                        optionNumCount = 0;
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
                    InsideStyle: 'max-height:700px;overflow:auto',
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

                            //清空預設提示
                            $('h4.page_desc').remove();

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
                            resetNum();
                        } else {

                            //是否必填
                            var required = $('input[type="radio"][name="radio4"]:checked').val();
                            //清空預設提示
                            $('h4.page_desc').remove();

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
                            resetNum();
                        }

                    }
                });
            }

            if (status === 'edit') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯文本題',
                    OutsideStyle: 'max-width:700px',
                    InsideStyle: 'max-height:700px;overflow:auto',
                    Html: $('#edit_editTextarea'),
                    OnRun: function () {
                        $('#LoadingBox').show();
                    },
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

                        $('#LoadingBox').hide();

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
                            resetOrder();

                        }

                    }
                });
            }
        }

        if (type === 'pageDesc') {
            if (status === 'add') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;新增頁面說明',
                    Html: $('#editPageDesc'),
                    OutsideStyle: 'max-width:800px',
                    OnRun: function () {
                        //彈窗的物件build起來再呼叫CKEditor
                        CKEDITOR.replace('editor1');
                    },
                    OnOK: function () {
                        //過場loading

                        if (vm.nowPage === 1) {
                            //清空預設提示
                            $('h4.page_desc').remove();
                            //初始第一頁
                            vm.allQuestionnaireData[0].questionDataPerPage["pageQuestionData"].push({
                                type: 'pageDesc',
                                id: _uuid(),
                                val: CKEDITOR.instances.editor1.getData()
                            });

                        } else {
                            //清空預設提示
                            $('h4.page_desc').remove();
                            vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage["pageQuestionData"].push({
                                type: 'pageDesc',
                                id: _uuid(),
                                val: CKEDITOR.instances.editor1.getData()
                            });
                        }

                    }
                });
            }

            if (status === 'edit') {
                alertBox({
                    Mode: 'C',
                    Title: '<i class="fa fa-pencil-square-o"></i>&nbsp;編輯頁面說明',
                    Html: $('#editPageDesc'),
                    OutsideStyle: 'max-width:800px',
                    OnRun: function () {
                        $('#LoadingBox').show();
                        //彈窗的物件build起來再呼叫CKEditor
                        CKEDITOR.replace('editor1');
                    },
                    OnReady: function () {
                        //過場loading

                        var index = $(dom).attr('data-index');
                        var data = {};

                        data = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].val;

                        //插入題目
                        //$('#editPageDescVal').val(data);
                        CKEDITOR.instances.editor1.setData(data);

                        $('#LoadingBox').hide();

                    },
                    OnOK: function () {

                        var newTitle = CKEDITOR.instances.editor1.getData();

                        var index = $(dom).attr('data-index');

                        vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].val = newTitle;

                    }
                });
            }
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

                //移除未添加葉面的警語
                $('h4.page_desc').remove();
                //尚未添加任何問題的提示語
                window.setTimeout(function () {
                    if ($('.showQuestions_wrap').children().length === 0) {
                        $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                    }
                }, 100);

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
                                    if (data.showLogicCount) {
                                        data.showLogicCount = [];
                                    }

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
                    resetNum();

                    //跳轉至上頁
                    if (vm.nowPage === 1) {
                        $('#LoadingBox').hide();
                        if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                            window.setTimeout(function () {
                                if ($('.showQuestions_wrap').children().length === 0) {
                                    $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                                }
                            }, 100);
                        }
                        //刪除第一頁的提示
                        //if (vm.allQuestionnaireData.length === 0) {
                        //    $('#show_question').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加頁面</h4>');
                        //}
                        return false;
                    } else {
                        vm.nowPage--;
                        vm.currentPage = '第 ' + vm.nowPage + ' 頁';
                        $('#LoadingBox').hide();
                        //刪除最後一題時顯示提示語
                        //尚未添加任何問題的提示語
                        if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                            window.setTimeout(function () {
                                if ($('.showQuestions_wrap').children().length === 0) {
                                    $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                                }
                            }, 100);
                        }
                    }


                }

                if (type === 'top') {
                    var delPage = parseInt($(dom).attr("data-page"));
                    console.log(delPage);
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
                                    if (data.showLogicCount) {
                                        data.showLogicCount = [];
                                    }

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
                    resetNum();

                    //跳轉至上頁
                    if (vm.nowPage === 1) {
                        $('#LoadingBox').hide();
                        if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                            window.setTimeout(function () {
                                if ($('.showQuestions_wrap').children().length === 0) {
                                    $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                                }
                            }, 100);
                        }
                        //刪除第一頁的提示
                        //if (vm.allQuestionnaireData.length === 0) {
                        //    $('#show_question').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加頁面</h4>');
                        //}
                        return false;
                    } else {
                        vm.nowPage--;
                        vm.currentPage = '第 ' + vm.nowPage + ' 頁';
                        $('#LoadingBox').hide();
                        //刪除最後一題時顯示提示語
                        //尚未添加任何問題的提示語
                        if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                            window.setTimeout(function () {
                                if ($('.showQuestions_wrap').children().length === 0) {
                                    $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                                }
                            }, 100);
                        }
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

        if (surveyId !== '0') { //編輯問卷

            //未輸入問卷起訖時間
            //if (vm.startTimeVal === 0 && vm.deadlineVal === 0) {
            //    alertBox({
            //        Mode: 'A',
            //        Html: '<p style="color:#ff6a00">尚未設定問卷起訖時間！</p>'
            //    });

            //    return false;
            //}

            //未輸入開始時間
            if (vm.startTimeVal === 0 && vm.deadlineVal !== 0) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">尚未輸入問卷開始時間！</p>'
                });

                return false;
            }

            //未輸入結束時間
            if (vm.deadlineVal === 0 && vm.startTimeVal !== 0) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">尚未輸入問卷結束時間！</p>'
                });

                return false;
            }

            //問卷結束時間早於開放時間
            if (vm.startTimeVal > vm.deadlineVal) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">問卷結束時間早於開放時間！</p>'
                });

                //跳離頁面或刷新的提示
                window.onbeforeunload = function (event) {
                    var event = event || window.event;
                    if (event) {
                        event.returnValue = "確定要刷新頁面? 資料將不被保存";
                    }
                    return '確定要刷新頁面? 資料將不被保存';
                };

                return false;
            }

            var TimeNow = new Date();
            var year = TimeNow.getFullYear();
            var month = ('0' + (TimeNow.getMonth() + 1)).substr(-2);
            var date = ('0' + TimeNow.getDate()).substr(-2);
            var hour = ('0' + TimeNow.getHours()).substr(-2);
            var minute = ('0' + TimeNow.getMinutes()).substr(-2);

            //顯示現在時間
            var now = '' + year + '年' + month + '月' + date + '日' + ' ' + hour + ':' + minute;

            //儲存編輯後問卷資料
            var questionnaire = {
                id: surveyId,
                buildTime: now,
                questionnaireTitle: vm.questionnaireTitle || '未設定標題',
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: vm.deadline, //若無重新設定則存原本的值
                questionnaireStartTime: vm.startTime,//若無重新設定則存原本的值
                questionnaireDeadlineVal: vm.deadlineVal,//若無重新設定則存原本的值
                questionnaireStartTimeVal: vm.startTimeVal,//若無重新設定則存原本的值
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
            };

            axios.patch(getQuestionnaire + surveyId + '', questionnaire).then(function (res) {
                alertBox({
                    Mode: 'PR'
                });
                alertProgress(100);
            });

        } else { //新增問卷

            //是否未設定起訖時間
            //if (!vm.startTimeVal && !vm.deadlineVal) {
            //    alertBox({
            //        Mode: 'A',
            //        Html: '<p style="color:#ff6a00">尚未設定問卷起訖時間！</p>'
            //    });

            //    return false;
            //}

            //只設定開始時間
            if (vm.startTimeVal !== 0 && vm.deadlineVal === 0) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">尚未設定結束時間！</p>'
                });

                return false;
            }
            //只設定結束時間
            if (vm.deadlineVal !== 0 && vm.startTimeVal === 0) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">尚未設定開始時間！</p>'
                });

                return false;
            }

            //問卷結束時間早於開放時間
            if (vm.startTimeVal > vm.deadlineVal) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#ff6a00">問卷結束時間早於開放時間！</p>'
                });

                //跳離頁面或刷新的提示
                window.onbeforeunload = function (event) {
                    var event = event || window.event;
                    if (event) {
                        event.returnValue = "確定要刷新頁面? 資料將不被保存";
                    }
                    return '確定要刷新頁面? 資料將不被保存';
                };

                return false;
            }

            var TimeNow = new Date();
            var year = TimeNow.getFullYear();
            var month = ('0' + (TimeNow.getMonth() + 1)).substr(-2);
            var date = ('0' + TimeNow.getDate()).substr(-2);
            var hour = ('0' + TimeNow.getHours()).substr(-2);
            var minute = ('0' + TimeNow.getMinutes()).substr(-2);

            //顯示現在時間
            var now = '' + year + '年' + month + '月' + date + '日' + ' ' + hour + ':' + minute;

            //儲存編輯後問卷資料
            var questionnaire = {
                id: surveyId,
                buildTime: now,
                questionnaireTitle: vm.questionnaireTitle || '未設定標題',
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: vm.deadline, //若無重新設定則存原本的值
                questionnaireStartTime: vm.startTime,//若無重新設定則存原本的值
                questionnaireDeadlineVal: vm.deadlineVal,//若無重新設定則存原本的值
                questionnaireStartTimeVal: vm.startTimeVal,//若無重新設定則存原本的值
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
            };


            //儲存新建問卷
            var questionnaire = {
                id: _uuid(),
                buildTime: now,
                questionnaireTitle: vm.questionnaireTitle || '未設定標題',
                questionnaireDesc: vm.questionnaireDesc,
                questionnaireDeadline: vm.deadline,
                questionnaireStartTime: vm.startTime,
                questionnaireDeadlineVal: vm.deadlineVal,
                questionnaireStartTimeVal: vm.startTimeVal,
                allQuestionnaireData: vm.allQuestionnaireData,
                repeatAnswer: vm.repeat,
            };


            axios.post(postQuestionnaire, questionnaire).then(function (res) {
                alertBox({
                    Mode: 'PR'
                });
                alertProgress(100);
            });
        }



    };

    //取消編輯問卷
    cancelQuestionnaire = function () {
        window.location.href = 'QuestionnaireList.aspx?user=admin';
    };



    /* Controller */


    /* 編輯問題選項功能 */

    //添加選項
    addOption = function (e, type, status) {

        if (status === 'add') {
            optionNumCount++;
            if (type === 'radio') {
                orderOptionNum(e, 'add', 'radio', 'new');
            }

            if (type === 'checkbox') {
                orderOptionNum(e, 'add', 'checkbox', 'new');
            }

            if (type === 'pulldown') {
                orderOptionNum(e, 'add', 'pulldown', 'new');
            }
        }

        if (status === 'edit') {
            editOptionCount++;
            if (type === 'radio') {
                orderOptionNum(e, 'edit', 'radio', 'new');
            }

            if (type === 'checkbox') {
                orderOptionNum(e, 'edit', 'checkbox', 'new');
            }

            if (type === 'pulldown') {
                orderOptionNum(e, 'edit', 'pulldown', 'new');
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
                    //移除並重新排序
                    if (type === 'radio') {
                        orderOptionNum(e, 'add', 'radio', 'delete');
                    }
                    if (type === 'checkbox') {
                        orderOptionNum(e, 'add', 'checkbox', 'delete');
                    }
                    if (type === 'pulldown') {
                        orderOptionNum(e, 'add', 'pulldown', 'delete');
                    }


                    $('#LoadingBox').hide();
                }

                if (status === 'edit') {

                    if (type === 'radio') {
                        orderOptionNum(e, 'edit', 'radio', 'delete');
                    }

                    if (type === 'checkbox') {
                        orderOptionNum(e, 'edit', 'checkbox', 'delete');
                    }

                    if (type === 'pulldown') {
                        orderOptionNum(e, 'edit', 'pulldown', 'delete');
                    }

                    //刪除跳題邏輯
                    //取移除選項的值，比對若有設置跳題則刪除

                    $('#LoadingBox').hide();
                }
            }
        });
    };

    //複製選項
    copyOption = function (e, type, status) {

        if (status === 'add') {
            optionNumCount++;
            if (type === 'radio') {
                //改題次
                orderOptionNum(e, 'add', 'radio', 'copy');
            }
            if (type === 'checkbox') {
                //改題次
                orderOptionNum(e, 'add', 'checkbox', 'copy');
            }
            if (type === 'pulldown') {
                //改題次
                orderOptionNum(e, 'add', 'pulldown', 'copy');
            }

        }

        if (status === 'edit') {
            editOptionCount++;
            //改題次
            if (type === 'radio') {
                //改題次
                orderOptionNum(e, 'edit', 'radio', 'copy');
            }
            if (type === 'checkbox') {
                //改題次
                orderOptionNum(e, 'edit', 'checkbox', 'copy');
            }
            if (type === 'pulldown') {
                //改題次
                orderOptionNum(e, 'edit', 'pulldown', 'copy');
            }
        }

    };

    //選項題次計算功能
    var optionNumCount = 0; //新增選項計數器
    var editOptionCount = 0; //編輯選項計數器
    var editRadioTemplate = $('.editOptions_wrap#edit_editOptions_wrap_radio').html(); //單選編輯選項格式
    var editCheckboxTemplate = $('.editOptions_wrap#edit_editOptions_wrap_checkbox').html(); //多選編輯選項格式
    var editPulldownTemplate = $('.editOptions_wrap#edit_editOptions_wrap_pulldown').html(); //下拉編輯選項格式
    var chineseOrder = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var englishOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    orderOptionNum = function (evt, status, type, trigger) {

        //先等插入選項DOM再取選項題次的DOM
        window.setTimeout(function () {

            var optionNum = []; //選項題次格式
            var optionNumType = $('input[type="radio"][name="option"]:checked').val(); //取得題次格式

            //題次格式設定
            switch (optionNumType) {
                case '甲、乙、丙':
                    optionNum = chineseOrder;
                    break;

                case '(1)、(2)、(3)':
                    optionNum = null; //若為null則累加數字
                    break;

                case 'a、b、c':
                    optionNum = englishOrder;
                    break;

                case '自訂格式':
                    optionNum = []; //變undefined
                    break;
            }


            var orderNum = optionNum !== null ? optionNum[optionNumCount - 1] : '(' + optionNumCount + ')'; //新增的題次
            var editOrderNum = optionNum !== null ? optionNum[editOptionCount - 1] : '(' + editOptionCount + ')'; //編輯的題次
            var clone = $(evt.target).parents('.editOptions').clone(true); //複製選項

            //新增選項顯示題次
            if (trigger === 'new') {

                if (status === 'add' && type === 'radio') {
                    $(evt.target).siblings('.showEditOptions_radio').append($('.editOptions_wrap#editOptions_wrap_radio').html());
                    $('input.radio_optionNum').eq(optionNumCount).val((orderNum !== undefined ? orderNum + '、' : ''));
                    $('.radio_option_weight_input').eq(optionNumCount).val(0);
                }


                if (status === 'add' && type === 'checkbox') {
                    $(evt.target).siblings('.showEditOptions_checkbox').append($('.editOptions_wrap#editOptions_wrap_checkbox').html());
                    $('input.checkbox_optionNum').eq(optionNumCount).val((orderNum !== undefined ? orderNum + '、' : ''));
                    $('.checkbox_option_weight_input').eq(optionNumCount).val(0);
                }


                if (status === 'add' && type === 'pulldown') {
                    $(evt.target).siblings('.showEditOptions_pulldown').append($('.editOptions_wrap#editOptions_wrap_pulldown').html());
                    $('input.pulldown_optionNum').eq(optionNumCount).val((orderNum !== undefined ? orderNum + '、' : ''));
                    $('.pulldown_option_weight_input').eq(optionNumCount).val(0);
                }


                if (status === 'edit' && type === 'radio') {
                    $(evt.target).siblings('.editOptions_wrap#edit_editOptions_wrap_radio').append(editRadioTemplate);
                    $('.editOptions_wrap#edit_editOptions_wrap_radio input.edit_radio_optionNum').eq(editOptionCount - 1).val((editOrderNum !== undefined ? editOrderNum + '、' : ''));
                    $('#edit_editOptions_wrap_radio .edit_radio_option_weight_input').eq(editOptionCount - 1).val(0);
                }


                if (status === 'edit' && type === 'checkbox') {
                    $(evt.target).siblings('.editOptions_wrap#edit_editOptions_wrap_checkbox').append(editCheckboxTemplate);
                    $('input.edit_checkbox_optionNum').eq(editOptionCount - 1).val((editOrderNum !== undefined ? editOrderNum + '、' : ''));
                    $('#edit_editOptions_wrap_checkbox .edit_checkbox_option_weight_input').eq(editOptionCount - 1).val(0);
                }


                if (status === 'edit' && type === 'pulldown') {
                    var orderNum = optionNum !== null ? optionNum[editOptionCount - 1] : '(' + editOptionCount + ')';
                    $(evt.target).siblings('.editOptions_wrap#edit_editOptions_wrap_pulldown').append(editPulldownTemplate);
                    $('input.edit_pulldown_optionNum').eq(editOptionCount - 1).val((editOrderNum !== undefined ? editOrderNum + '、' : ''));
                    $('#edit_editOptions_wrap_pulldown .edit_pulldown_option_weight_input').eq(editOptionCount - 1).val(0);
                }

            }

            //複製選項顯示題次
            if (trigger === 'copy') {
                if (status === 'add' && type === 'radio') {
                    var selfOrder = $(clone[0]).find('.radio_optionNum').val();
                    $('.showEditOptions_radio').append($(clone[0]));
                    $(clone[0]).find('input.radio_optionNum').val((orderNum !== undefined ? orderNum + '、' : selfOrder));
                }


                if (status === 'add' && type === 'checkbox') {
                    var selfOrder = $(clone[0]).find('.checkbox_optionNum').val();
                    $('.showEditOptions_checkbox').append(clone[0]);
                    $(clone[0]).find('input.checkbox_optionNum').val((orderNum !== undefined ? orderNum + '、' : selfOrder));
                }


                if (status === 'add' && type === 'pulldown') {
                    var selfOrder = $(clone[0]).find('.pulldown_optionNum').val();
                    $('.showEditOptions_pulldown').append(clone[0]);
                    $(clone[0]).find('input.pulldown_optionNum').val((orderNum !== undefined ? orderNum + '、' : selfOrder));
                }


                if (status === 'edit' && type === 'radio') {
                    var selfOrder = $(clone[0]).find('.edit_radio_optionNum').val();
                    $('.editOptions_wrap#edit_editOptions_wrap_radio').append($(clone[0]));
                    $(clone[0]).find('input.edit_radio_optionNum').val((editOrderNum !== undefined ? editOrderNum + '、' : selfOrder));
                }


                if (status === 'edit' && type === 'checkbox') {
                    var selfOrder = $(clone[0]).find('.edit_checkbox_optionNum').val();
                    $('.editOptions_wrap#edit_editOptions_wrap_checkbox').append(clone[0]);
                    $(clone[0]).find('input.edit_checkbox_optionNum').val((editOrderNum !== undefined ? editOrderNum + '、' : selfOrder));
                }


                if (status === 'edit' && type === 'pulldown') {
                    var selfOrder = $(clone[0]).find('.edit_pulldown_optionNum').val();
                    $('.editOptions_wrap#edit_editOptions_wrap_pulldown').append(clone[0]);
                    $(clone[0]).find('input.edit_pulldown_optionNum').val((editOrderNum !== undefined ? editOrderNum + '、' : selfOrder));
                }

            }

            //刪除選項顯示題次
            if (trigger === 'delete') {
                if (status === 'add' && type === 'radio') {
                    optionNumCount = 0;
                    $(evt.target).parents('.editOptions').remove();
                    $('.showEditOptions_radio').find('input.radio_optionNum').each(function () {
                        optionNumCount++;
                        var newOrderNum = optionNum !== null ? optionNum[optionNumCount - 1] : '(' + optionNumCount + ')';
                        $(this).val((newOrderNum !== undefined ? newOrderNum + '、' : $(this).val()));
                    });
                }


                if (status === 'add' && type === 'checkbox') {
                    optionNumCount = 0;
                    $(evt.target).parents('.editOptions').remove();
                    $('.showEditOptions_checkbox').find('input.checkbox_optionNum').each(function () {
                        optionNumCount++;
                        var newOrderNum = optionNum !== null ? optionNum[optionNumCount - 1] : '(' + optionNumCount + ')';
                        $(this).val((newOrderNum !== undefined ? newOrderNum + '、' : $(this).val()));
                    });
                }


                if (status === 'add' && type === 'pulldown') {
                    optionNumCount = 0;
                    $(evt.target).parents('.editOptions').remove();
                    $('.showEditOptions_pulldown').find('input.pulldown_optionNum').each(function () {
                        optionNumCount++;
                        var newOrderNum = optionNum !== null ? optionNum[optionNumCount - 1] : '(' + optionNumCount + ')';
                        $(this).val((newOrderNum !== undefined ? newOrderNum + '、' : $(this).val()));
                    });
                }


                if (status === 'edit' && type === 'radio') {
                    editOptionCount = 0;
                    $(evt.target).parents('.editOptions').remove();
                    $('.editOptions_wrap#edit_editOptions_wrap_radio .edit_radio_optionNum').each(function () {
                        editOptionCount++;
                        var newOrderNum = optionNum !== null ? optionNum[editOptionCount - 1] : '(' + editOptionCount + ')';
                        $(this).val((newOrderNum !== undefined ? newOrderNum + '、' : $(this).val()));
                    });
                }


                if (status === 'edit' && type === 'checkbox') {
                    editOptionCount = 0;
                    $(evt.target).parents('.editOptions').remove();
                    $('.editOptions_wrap#edit_editOptions_wrap_checkbox .edit_checkbox_optionNum').each(function () {
                        editOptionCount++;
                        var newOrderNum = optionNum !== null ? optionNum[editOptionCount - 1] : '(' + editOptionCount + ')';
                        $(this).val((newOrderNum !== undefined ? newOrderNum + '、' : $(this).val()));
                    });
                }


                if (status === 'edit' && type === 'pulldown') {
                    editOptionCount = 0;
                    $(evt.target).parents('.editOptions').remove();
                    $('.editOptions_wrap#edit_editOptions_wrap_pulldown .edit_pulldown_optionNum').each(function () {
                        editOptionCount++;
                        var newOrderNum = optionNum !== null ? optionNum[editOptionCount - 1] : '(' + editOptionCount + ')';
                        $(this).val((newOrderNum !== undefined ? newOrderNum + '、' : $(this).val()));
                    });
                }

            }

        }, 100);

    };



    /* 問題設定功能 */
    //刪除問題
    deleteQuestion = function (e, dom, type) {

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
                                if (question.showLogicCount) {
                                    question.showLogicCount.forEach(function (logic, index) {
                                        if (logic.jumpTo.id[0] == delId) {
                                            question.showLogicCount = [];
                                        }
                                    });
                                }

                            }
                        });
                    });

                    //題號重新排序
                    resetNum();

                    //跳題題號重新排序
                    resetOrder();

                    $('#LoadingBox').hide();

                    //刪除最後一題時顯示提示語
                    //尚未添加任何問題的提示語
                    if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                        window.setTimeout(function () {
                            if ($('.showQuestions_wrap').children().length === 0) {
                                $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                            }
                        }, 100);
                    }

                }

                if (type === 'pageDesc') {
                    var index = $(dom).attr('data-index');
                    vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.splice(index, 1);

                    $('#LoadingBox').hide();

                    //刪除最後一題時顯示提示語
                    //尚未添加任何問題的提示語
                    if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                        window.setTimeout(function () {
                            if ($('.showQuestions_wrap').children().length === 0) {
                                $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                            }
                        }, 100);
                    }


                }
            }
        });
    };

    //複製問題
    copyQuestion = function (e, dom, type) {

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
                        if (copyQuestion.showLogicCount) {
                            copyQuestion["showLogicCount"] = [];
                        }
                        vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"].push(copyQuestion);
                        //vm.allQuestionnaireData[i].questionDataPerPage["pageQuestionData"].splice(index+1,0,copyQuestion);
                    }
                }

                //題號重新排序
                resetNum();

                //跳題題號重新排序
                resetOrder();

                $('#LoadingBox').hide();

            }
        });

    };

    //邏輯跳題
    var ifAddLogic = true; //判斷是添加還是刪除邏輯設定
    jumpQuestion = function (e, dom) {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-code-fork"></i>&nbsp;設定跳題邏輯',
            OutsideStyle: 'max-width:800px',
            Html: $('#jumpQuestion'),
            OnRun: function () {
                $('#LoadingBox').show();
            },
            OnReady: function () {

                $('#LoadingBox').hide();

                var type = $(dom).attr('data-type');
                var index = $(dom).attr('data-index');

                //載入選項及跳題題目
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
                            Text: option.optionNum + '、' + option.val,
                            Val: option.id,
                        });
                    });

                    //添加任意選項
                    options.unshift({
                        Text: '任意選項',
                        Val: '任意選項'
                    });

                    var questions = [];
                    if (vm.allQuestionnaireData) {
                        vm.allQuestionnaireData.forEach(function (question) {
                            question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.type !== 'pageDesc') {
                                    questions.push({
                                        name: 'Q' + item.questionNum + ' ' + item.title + '',
                                        val: item.id,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                }
                            });
                        });
                    }

                    //顯示當前問題下下一個題目
                    questions = questions.length === 1 ? [] : questions.slice(currentQuestionNum + 1);

                    DropListSetting({
                        ID: 'selected_option',
                        Data: [{ Optgroup: '', Option: options }],
                        Search: true,
                        ButtonText: '請選擇選項',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            ifAddLogic = true; //新增狀態
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
                            Text: option.optionNum + '、' + option.val,
                            Val: option.id,
                        });
                    });

                    //添加任意選項
                    options.unshift({
                        Text: '任意選項',
                        Val: '任意選項'
                    });

                    var questions = [];
                    if (vm.allQuestionnaireData) {
                        vm.allQuestionnaireData.forEach(function (question) {
                            question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.type !== 'pageDesc') {
                                    questions.push({
                                        name: 'Q' + item.questionNum + ' ' + item.title + '',
                                        val: item.id,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                }
                            });
                        });
                    }

                    //顯示當前問題下下一個題目
                    questions = questions.length === 1 ? [] : questions.slice(currentQuestionNum + 1);

                    DropListSetting({
                        ID: 'selected_option',
                        Type: 'multiple',
                        Data: [{ Optgroup: '', Option: options }],
                        Search: true,
                        ButtonText: '請選擇選項',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            ifAddLogic = true; //新增狀態
                            //激活選項

                            if (Select[0] == '任意選項') {
                                vm.tempLogicSetting.allJump = Select;
                            }

                            console.log(Select);
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
                            Text: option.optionNum + '、' + option.val,
                            Val: option.id,
                        });
                    });

                    //添加任意選項
                    options.unshift({
                        Text: '任意選項',
                        Val: '任意選項'
                    });

                    var questions = [];
                    if (vm.allQuestionnaireData) {
                        vm.allQuestionnaireData.forEach(function (question) {
                            question.questionDataPerPage.pageQuestionData.forEach(function (item) {
                                if (item.type !== 'pageDesc') {
                                    questions.push({
                                        name: 'Q' + item.questionNum + ' ' + item.title + '',
                                        val: item.id,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                }
                            });
                        });
                    }

                    //顯示當前問題下下一個題目
                    questions = questions.length === 1 ? [] : questions.slice(currentQuestionNum + 1);

                    DropListSetting({
                        ID: 'selected_option',
                        Data: [{ Optgroup: '', Option: options }],
                        Search: true,
                        ButtonText: '請選擇選項',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            ifAddLogic = true; //新增狀態
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
                                if (item.type !== 'pageDesc') {
                                    questions.push({
                                        name: 'Q' + item.questionNum + ' ' + item.title + '',
                                        val: item.id,
                                        group: '第 ' + question.page + ' 頁'
                                    });
                                }
                            });
                        });
                    }

                    //顯示編輯問題以後的題目
                    questions = questions.length === 1 ? [] : questions.slice(currentQuestionNum + 1);



                    DropListSetting({
                        ID: 'jump_to_question',
                        Data: DropListDataHelp(questions, ['★', 'group'], 'name', 'val', ['group', ' - ', 'name']),
                        Search: true,
                        GroupList: true,
                        ButtonText: '請選擇題目',
                        Disabled: false,
                        OnChange: function (Select, Name) {
                            ifAddLogic = true; //新增狀態
                            //跳到此問題
                            vm.tempLogicSetting.jumpTo.id = Select;
                            vm.tempLogicSetting.jumpTo.val = DropListTempData['jump_to_question'].SelectText;
                        }
                    });

                }

                //顯示跳題邏輯設定
                $('#show_logic_content').empty();
                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].showLogicCount;

                //未設定任何跳題選項
                if (target.length === 0) {
                    $('#show_logic_content').append('<h4 style="color:#FD6A4F;margin:0">尚未添加跳題設定</h4>')
                }

                if (type === 'radio' || type === 'pulldown') {

                    //判斷是否有任意選項
                    if (target.length === 1) {

                        //切割字串
                        var string = _.split(target[0].jumpTo.val[0], '');
                        var split;
                        if (string.length > 12) {
                            split = _.split(target[0].jumpTo.val[0], '', (string.length - 8)).join('') + '...';
                        } else {
                            split = target[0].jumpTo.val[0];
                        }

                        //只設定一個跳題選項或有設定任意選項跳題
                        if (target[0].allJump.length === 0) {
                            //沒有任意選項跳題

                            $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val[0] + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[0].triggerOption.id[0] + '" onclick="delLogicSetting(event,' + index + ',$(this))">刪除跳題設定</button></div>');
                        } else {
                            //有任意選項跳題
                            $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="任意選項" onclick="delLogicSetting(event,' + index + ',$(this))">刪除跳題設定</button></div>');
                        }
                    } else {
                        for (var i = 0; i < target.length; i++) {

                            //切割字串
                            var string = _.split(target[i].jumpTo.val[0], '');
                            var split;
                            if (string.length > 12) {
                                split = _.split(target[i].jumpTo.val[0], '', (string.length - 8)).join('') + '...';
                            } else {
                                split = target[i].jumpTo.val[0];
                            }

                            $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[i].triggerOption.val[0] + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[i].triggerOption.id[0] + '" onclick="delLogicSetting(event,' + index + ',$(this))">刪除跳題設定</button></div>');

                        }
                    }

                } else if (type === 'checkbox') {

                    //判斷是否有任意選項
                    if (target.length === 1) {

                        //切割字串
                        var string = _.split(target[0].jumpTo.val[0], '');
                        var split;
                        if (string.length > 12) {
                            split = _.split(target[0].jumpTo.val[0], '', (string.length - 8)).join('') + '...';
                        } else {
                            split = target[0].jumpTo.val[0];
                        }

                        //只設定一個跳題選項或有設定任意選項跳題
                        if (target[0].allJump.length === 0) {
                            //沒有任意選項跳題
                            $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[0].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="'+ target[0].triggerOption.id[0] + '" onclick="delLogicSetting(event,' + index + ',$(this),' + null + ')">刪除跳題設定</button></div>');
                        } else {
                            //有任意選項跳題
                            $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
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
                            if (string.length > 12) {
                                split = _.split(target[i].jumpTo.val[0], '', (string.length - 8)).join('') + '...';
                            } else {
                                split = target[i].jumpTo.val[0];
                            }

                            $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                        若本題選擇<span style="color:#FD6A4F">【' + target[i].triggerOption.val.join(', ') + '】</span>\
                        ，則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="多選跳題" data-val="'+ target[i].triggerOption.val + '" onclick="delLogicSetting(event,' + index + ',$(this))">刪除跳題設定</button></div>');

                        }
                    }
                } else {

                    //切割字串
                    //未設定任何跳題選項
                    if (target.length === 0) {
                        return;
                    } else {
                        var string = _.split(target[0].jumpTo.val[0], '');
                        var split;
                        if (string.length > 12) {
                            split = _.split(target[0].jumpTo.val[0], '', (string.length - 8)).join('') + '...';
                        } else {
                            split = target[0].jumpTo.val[0];
                        }

                        $('#show_logic_content').append('<div style="display:flex;margin:5px 0 5px 0"><div class="show_logic"><i class="fa fa-code-fork"></i>&nbsp;\
                         若有填答則跳至第&nbsp;<span style="color:#FD6A4F">【' + split + '】</span>&nbsp; 題\
                         <button style="margin-left:20px" type="button" class="button_o btn_blue_o btn_s" data-delId="文本跳題" onclick="delLogicSetting(event,' + index + ',$(this))">刪除跳題設定</button></div>');
                    }

                }

            },
            OnClose: function (Type) {
                if (Type === 'ok') {
                    if (ifAddLogic) {
                        if (vm.tempLogicSetting.jumpTo.val === '') {
                            alertBox({
                                Mode: 'A',
                                Html: '<p style="color:#FF6A00">未選擇轉跳題目</p>',
                            });

                            return false;
                        }

                        if (vm.tempLogicSetting.allJump.length !== 0) {
                            //有設定任意選項跳題
                            if (vm.tempLogicSetting.triggerOption.id.length > 1) { //選了任意跳題 + 任一選項
                                //跳提示
                                alertBox({
                                    Mode: 'A',
                                    Html: '<p style="color:#FF6A00">已選擇任意選項，不允許添加其他選項!</p>'
                                });

                                return false;
                            }
                        }
                    }

                    return true;
                }
            },
            OnOK: function () {

                var type = $(dom).attr('data-type');
                //var result = '<i class="fa fa-code-fork"></i>&nbsp;若本題選擇【' + vm.tempLogicSetting.triggerOption.val + '】，則跳至第&nbsp;' + vm.tempLogicSetting.jumpTo.val + '&nbsp;題';
                if (ifAddLogic) {
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
                            //清空選項跳題設定
                            target.options.forEach(function (option) {
                                if (option.jumpLogic !== null) {
                                    option.jumpLogic = null;
                                }
                            });
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
                                //存到各選項
                                target.options.forEach(function (option) {
                                    if (option.id == vm.tempLogicSetting.triggerOption.id[0]) {
                                        //option.jumpLogic = $.extend(true, {}, vm.tempLogicSetting);
                                        option.jumpLogic = _.cloneDeep(vm.tempLogicSetting);
                                    }
                                });

                                //判斷是否同選項的設定
                                var nullIndex = -1; //不存在的index，用來記錄相同的單選跳題選項
                                for (var i = 0; i < target.showLogicCount.length; i++) {
                                    if (_.isEqual(target.showLogicCount[i].triggerOption.val, vm.tempLogicSetting.triggerOption.val)) {

                                        nullIndex = i;
                                        break;
                                    }
                                }
                                if (nullIndex !== -1) { //匹配相同的多選跳題選項
                                    target.showLogicCount[nullIndex] = _.cloneDeep(vm.tempLogicSetting);
                                } else { //若無匹配則新增
                                    //若有任意跳題選項則刪除
                                    for (var i = 0; i < target.showLogicCount.length; i++) {
                                        if (target.showLogicCount[i].allJump[0] == '任意選項') {
                                            target.showLogicCount.splice(i, 1);
                                            break;
                                        }
                                    }
                                    target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                                }

                            } else {
                                //多選跳題
                                var nullIndex = -1; //不存在的index，用來記錄相同的多選跳題選項
                                for (var i = 0; i < target.showLogicCount.length; i++) {
                                    //若為單選跳題則跳過
                                    if (target.showLogicCount[i].triggerOption.val.length === 1) {
                                        continue;
                                    }

                                    if (_.isEqual(target.showLogicCount[i].triggerOption.val, vm.tempLogicSetting.triggerOption.val)) {

                                        nullIndex = i;
                                        break;
                                    }
                                }
                                if (nullIndex !== -1) { //匹配相同的多選跳題選項
                                    target.showLogicCount[nullIndex] = _.cloneDeep(vm.tempLogicSetting);
                                } else { //若無匹配則新增
                                    //若有任意跳題選項則刪除
                                    for (var i = 0; i < target.showLogicCount.length; i++) {
                                        if (target.showLogicCount[i].allJump[0] == '任意選項') {
                                            target.showLogicCount.splice(i, 1);
                                            break;
                                        }
                                    }
                                    target.showLogicCount.push(_.cloneDeep(vm.tempLogicSetting));
                                }

                            }
                        } else {
                            //有任意選項跳題
                            //清空選項跳題設定

                            target.options.forEach(function (option) {
                                if (option.jumpLogic !== null) {
                                    option.jumpLogic = null;
                                }
                            });
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
                            }
                        } else {
                            //有任意選項跳題
                            //清空選項跳題設定
                            target.options.forEach(function (option) {
                                if (option.jumpLogic !== null) {
                                    option.jumpLogic = null;
                                }
                            });
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

                ifAddLogic = true;

                //刪除暫存跳題選項
                vm.tempLogicSetting = {
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
                };

            }
        });
    };

    //刪除邏輯跳題
    delLogicSetting = function (e, index, dom) {
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
                var delVal = $(dom).attr('data-val');
                var item = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index];
                var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData[index].showLogicCount;

                //判斷是多選或單選跳題

                if (delId == '任意選項' || delId == '文本跳題') {
                    item.showLogicCount = [];
                    //未設定任何跳題選項
                    $('#show_logic_content').append('<h4 style="color:#FD6A4F;margin:0">尚未添加跳題設定</h4>')

                } else {
                    if (delId === '多選跳題') {
                        //刪完一筆後index有變化!!
                        item.showLogicCount.forEach(function (data, index) {
                            if (data.triggerOption.val == delVal) {
                                item.showLogicCount.splice(index, 1);
                            }
                        });
                        //未設定任何跳題選項
                        if (target.length === 0) {
                            $('#show_logic_content').append('<h4 style="color:#FD6A4F;margin:0">尚未添加跳題設定</h4>')
                        }
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
                        //未設定任何跳題選項
                        if (target.length === 0) {
                            $('#show_logic_content').append('<h4 style="color:#FD6A4F;margin:0">尚未添加跳題設定</h4>')
                        }
                    }

                }

                //刪除暫存跳題選項
                vm.tempLogicSetting = {
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
                };
                ifAddLogic = false;
                $('#LoadingBox').hide();
            }
        });
    };

    //題號重新排序function
    resetNum = function () {
        var newIndex = 1;
        vm.allQuestionnaireData.forEach(function (page) {
            for (var i = 0; i < page.questionDataPerPage.pageQuestionData.length; i++) {
                if (page.questionDataPerPage.pageQuestionData[i].type === 'pageDesc') continue;
                page.questionDataPerPage.pageQuestionData[i].questionNum = newIndex;
                newIndex++;
            }
        });
    };

    //跳題題號重新排序function
    resetOrder = function () {

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

                if (question.showLogicCount) {
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

            if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                window.setTimeout(function () {
                    if ($('.showQuestions_wrap').children().length === 0) {
                        $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                    }
                }, 100);
            }
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

            if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                window.setTimeout(function () {
                    if ($('.showQuestions_wrap').children().length === 0) {
                        $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                    }
                }, 100);
            }
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

        if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
            window.setTimeout(function () {
                if ($('.showQuestions_wrap').children().length === 0) {
                    $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                }
            }, 100);
        }
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
    TimePickSetting({
        ID: 'deadline',
        Format: 'yyyy-MM-dd HH:mm',
        TimePick: true,
        OnClose: function () {
            if (!TimePickGet('deadline')) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#FF6A00">尚未選擇結束時間!</p>',
                });

                return false;
            }
            vm.deadline = TimePickGet('deadline').Format;
            vm.deadlineVal = TimePickGet('deadline').Time;
        }
    });

    TimePickSetting({
        ID: 'startTime',
        Format: 'yyyy-MM-dd HH:mm',
        TimePick: true,
        OnClose: function () {
            if (!TimePickGet('startTime')) {
                alertBox({
                    Mode: 'A',
                    Html: '<p style="color:#FF6A00">尚未選擇開始時間!</p>',
                });

                return false;
            }
            vm.startTime = TimePickGet('startTime').Format;
            vm.startTimeVal = TimePickGet('startTime').Time;
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

    //問題上下移動功能
    moveUp = function (dom) {
        $('#LoadingBox').show();
        var index = parseInt($(dom).attr('data-index'));
        var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData;
        if (index === 0) {
            alertBox({
                Mode: 'A',
                Html: '<p style="color:#FF6A00">已經為第一項!</p>'
            });
            $('#LoadingBox').hide();
            return false;
        }

        window.setTimeout(function () {
            target.splice(index - 1, 2, target[index], target[index - 1]);
            //重排題號
            resetNum();
            $('#LoadingBox').hide();
            $('.showQuestions_unit').eq(index - 1).addClass('move_animate');
        }, 300);

        $('.showQuestions_unit').eq(index - 1).removeClass('move_animate');
    };

    moveDown = function (dom) {
        $('#LoadingBox').show();
        var index = parseInt($(dom).attr('data-index'));
        var target = vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData;
        if (index >= target.length - 1) {
            alertBox({
                Mode: 'A',
                Html: '<p style="color:#FF6A00">已經為最後一項!</p>'
            });
            $('#LoadingBox').hide();
            return false;
        }
        window.setTimeout(function () {
            target.splice(index, 2, target[index + 1], target[index]);
            //重排題號
            resetNum();
            $('#LoadingBox').hide();
            $('.showQuestions_unit').eq(index + 1).addClass('move_animate');
        }, 300);

        $('.showQuestions_unit').eq(index + 1).removeClass('move_animate');
    };


    //拖曳功能

    //Vue.nextTick(function () {
    //    var dragWrap = document.querySelector('.showQuestions_wrap');
    //    var dragItems = document.querySelectorAll('.question_wrap');
    //    console.log(dragItems);

    //});

    //拖曳功能

    //Vue.nextTick(function () {

    //    var el = document.querySelector('.showQuestions_wrap');
    //    var ids = []; //儲存問題id
    //    var newData = []; //儲存拖曳後的資料

    //    Sortable.create(el, {
    //        draggable: '.question_wrap',
    //        ghostClass: 'ghost',
    //        forceFallback: true,
    //        scroll: true,
    //        scrollSensitivity: 100,
    //        scrollSpeed: 30,
    //        bubbleScroll: true,
    //        onUpdate: function () {


    //        },
    //        onEnd: function (evt) {


    //        }
    //    });


    //});



    /* Vue */
    var vm = new Vue({

        el: '#editQuestion',
        data: function () {
            //資料統一寫在vue實例裡面，外層用vm呼叫
            return {
                allQuestionnaireData: [], //每頁問題資料
                nowPage: 1,
                currentPage: '第 1 頁',
                showJumpPage: false,
                data: [{ Optgroup: '', Option: [{ Text: '第 1 頁', Val: 1 }] }], //頁面下拉選單資料
                questionnaireTitle: '', //問卷標題
                questionnaireDesc: '', //問卷說明
                startTime: '', //開始時間
                deadline: '', //截止日期
                startTimeVal: 0, //開始時間值
                deadlineVal: 0, //截止日期值
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
                //帶入預設
                this.allQuestionnaireData.push({
                    page: 1,
                    questionDataPerPage: {
                        pageDesc: '',
                        pageQuestionData: []
                    }
                });
                //取得問卷名稱
                this.questionnaireTitle = window.sessionStorage.getItem('questionName');

                $('.tableDisplayNone').show();
                $('.questionDisplayNone').show();
                window.setTimeout(function () {
                    $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                }, 100);
                $('#LoadingBox').hide();
                return;
            }
            this.getData(surveyId);          


        },
        methods: {
            getData: function (id) {
                //取得問卷資料
                //非同步調用this會指向window，改用vm

                axios.get(getQuestionnaire + id + '').then(function (res) {
                    vm.allQuestionnaireData = res.data.allQuestionnaireData;
                    vm.questionnaireTitle = res.data.questionnaireTitle;
                    vm.questionnaireDesc = res.data.questionnaireDesc;
                    vm.deadline = res.data.questionnaireDeadline;
                    vm.startTime = res.data.questionnaireStartTime;
                    vm.deadlineVal = res.data.questionnaireDeadlineVal;
                    vm.startTimeVal = res.data.questionnaireStartTimeVal;
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

                    //尚未添加任何問題的提示語
                    if (vm.allQuestionnaireData[vm.nowPage - 1].questionDataPerPage.pageQuestionData.length === 0) {
                        window.setTimeout(function () {
                            $('.showQuestions_wrap').html('<h4 class="page_desc" style="text-align:center">請點選上方工具列添加問題</h4>');
                        }, 100);
                    }

                    $('#LoadingBox').hide();

                });
            },
            resetTime: function (type) {
                if (type === 'start') {
                    this.startTime = '';
                    this.startTimeVal = 0;
                }
                if (type === 'end') {
                    this.deadline = '';
                    this.deadlineVal = 0;
                }

            }
        },
        mounted: function () {
        }

    });


});
