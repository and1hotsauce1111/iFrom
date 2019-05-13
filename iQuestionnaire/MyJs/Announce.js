$(function () {
    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
        LeftSelect: 'Announce'
    });


    //渲染列表data
    var test = [];
    axios.get('http://localhost:5566/announce').then(function (res) {
        res.data.forEach(function (item) {
            test.push({
                id: item.id,
                name: item.title,
                date: item.time,
                type: item.type == undefined ? '<span style="color:#FF6A00">一般公告</span>' : '<span style="color:#FF6A00">' + item.type + '</span>',
                status: item.status == '啟用' || item.status == undefined ? '<span style="color:#009149"><i class="fa fa-check"></i>啟用</span></span>' : '<span style="color:#f00"><i class="fa fa-times"></i>停用</span></span>'
            });
        });

        listBuild();
    });

    //新增公告
    addAnnounce = function () {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-plus" style="padding-right:3px"></i>新增公告',
            OutsideStyle: 'max-width:850px',
            Html: $('#add_new_announce'),
            OnReady: function () {
                //彈窗的物件build起來再呼叫CKEditor
                CKEDITOR.replace('editor1');
            },
            OnOK: function () {

                var title = $('#announce_title').val();
                var data = CKEDITOR.instances.editor1.getData();
                var type = $('input[type="radio"][name="radio3"]:checked').val();
                var status = $('input[type="radio"][name="radio4"]:checked').val();

                var TimeNow = new Date();
                var year = TimeNow.getFullYear();
                var month = ('0' + (TimeNow.getMonth() + 1)).substr(-2);
                var date = ('0' + TimeNow.getDate()).substr(-2);
                var hour = ('0' + TimeNow.getHours()).substr(-2);
                var minute = ('0' + TimeNow.getMinutes()).substr(-2);

                //顯示現在時間
                var now = '' + year + '年' + month + '月' + date + '日' + ' ' + hour + ':' + minute;

                var announceData = {
                    id: _uuid(),
                    type: type,
                    status: status,
                    title: title,
                    content: data,
                    time: now
                };


                //上傳的資料
                var form = new FormData();
                var upload = $('#file-uploader')[0].files;

                axios.post('http://localhost:5566/announce', announceData).then(function (res) {

                    test.push({
                        id: res.data.id,
                        name: res.data.title,
                        date: res.data.time,
                        type: '<span style="color:#FF6A00">' + res.data.type + '</span>',
                        status: res.data.status == '啟用' ? '<span style="color:#009149"><i class="fa fa-check"></i>啟用</span></span>' : '<span style="color:#f00"><i class="fa fa-times"></i>停用</span></span>'
                    });

                });

                window.location.reload();

            }
        });
    };

    //編輯公告
    editAnnounce = function (index, dom) {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-pencil-square-o" style="padding-right:3px"></i>編輯公告',
            OutsideStyle: 'max-width:850px',
            Html: $('#add_new_announce'),
            OnRun: function () {


                //彈窗的物件build起來再呼叫CKEditor
                CKEDITOR.replace('editor1');

                $('#announce_title').val(vm.renderData[index].title);
                $('input[type="radio"][name="radio3"][value="' + vm.renderData[index].type + '"]').prop("checked", true);
                $('input[type="radio"][name="radio4"][value="' + vm.renderData[index].status + '"]').prop("checked", true);
                $('textarea#editor1').val(vm.renderData[index].content);

            },
            OnOK: function () {

                var id = $(dom).attr('data-id');
                var title = $('#announce_title').val();
                var data = CKEDITOR.instances.editor1.getData();
                var type = $('input[type="radio"][name="radio3"]:checked').val();
                var status = $('input[type="radio"][name="radio4"]:checked').val();


                var TimeNow = new Date();
                var year = TimeNow.getFullYear();
                var month = ('0' + TimeNow.getMonth()).substr(-2);
                var date = ('0' + TimeNow.getDate()).substr(-2);
                var hour = ('0' + TimeNow.getHours()).substr(-2);
                var minute = ('0' + TimeNow.getMinutes()).substr(-2);

                //顯示現在時間
                var now = '' + year + '年' + month + '月' + date + '日' + ' ' + hour + ':' + minute;


                var announceData = {
                    id: id,
                    type: type,
                    status: status,
                    title: title,
                    content: data,
                    time: now
                };

                axios.patch('http://localhost:5566/announce/' + id, announceData).then(function (res) {

                    test[index] = announceData;
                });

                window.location.reload();


                //上傳的資料
                var form = new FormData();
                var upload = $('#file-uploader')[0].files;

            }
        });
    };

    //刪除公告
    deleteAnnounce = function () {
        alertBox({
            Mode: 'C',
            Title: '<i class="fa fa-trash-o" style="padding-right:3px"></i>刪除公告',
            Html: '<p style="font-size:18px;color:#ff6a00">確定刪除公告 ?</p>',
            OnOK: function () {
                var array = TableListGetCheck('列表元件');
                if (array.length === 0) {
                    alertBox({
                        Mode: 'C',
                        Title: '<i class="fa fa-times"></i>&nbsp;錯誤提示',
                        OutsideStyle: 'max-width:500px',
                        Html: '<p style="font-size:18px;color:#ff6a00">尚未選擇公告 !</p>',
                    });
                } else {
                    //目前只能先刪除一筆
                    var targetId = array[0].id;
                    axios.delete('http://localhost:5566/announce/' + targetId).then(function (res) {
                        window.location.reload();
                    });
                }
            }
        });
    };

    //複製公告
    copyAnnounce = function () {
        var array = TableListGetCheck('列表元件');
        if (array.length === 0) {
            alertBox({
                Mode: 'C',
                Title: '<i class="fa fa-times"></i>&nbsp;錯誤提示',
                OutsideStyle: 'max-width:500px',
                Html: '<p style="font-size:18px;color:#ff6a00">尚未選擇公告 !</p>',
            });
        } else {
            //目前只能先複製一筆
            var targetId = array[0].id;
            var temp;
            vm.renderData.forEach(function (data) {
                if (data.id == targetId) {
                    temp = data;
                }
            });
            var copy = _(temp).cloneDeep();
            copy.id = _uuid();
            axios.post('http://localhost:5566/announce/', copy).then(function (res) {
                window.location.reload();
            });
        }
    };



    var listBuild = function () {
        TableListBuild({
            Name: '列表元件',
            Recover: true,
            GetSearch: function (ReSearch) {
                //開啟 Recover 功能時需要將記錄的資料套用回介面上的物件
                if (ReSearch) {
                    $('#keyword').val(ReSearch.keyword);
                    $('#keyword2').val(ReSearch.keyword2);
                }
                //讀取介面上的物件數值傳送到 Search 變數之中
                var Search = {
                    keyword: $('#keyword').val(),
                    keyword2: $('#keyword2').val(),
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
                    var checkC = false;

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
            },
        });

    };


    TableListClear = function () {

        $('#keyword').val('');
        $('#keyword2').val('');

        TableListRun('列表元件');
    };



    var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                renderData:null
            }
        },
        created: function () {
            this.getData();
        },
        watch: {
            renderData: function (value) {
                this.getData();
            }
        },
        methods: {
            getData: function () {
                //取得問卷資料
                //非同步調用this會指向window，改用vm
                axios.get('http://localhost:5566/announce').then(function (res) {
                    vm.renderData = res.data;
                });
            },
        }


    });






});