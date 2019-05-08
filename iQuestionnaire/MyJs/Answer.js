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
                select:''
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
            prevPage() {
                vm.nowPage--;
            },
            nextPage() {
                vm.nowPage++;
            }
        }
    });

});