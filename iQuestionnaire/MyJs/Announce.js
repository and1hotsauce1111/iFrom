$(function () {
    //UI
    VisualModule({
        LeftSelect: 'Index',
        //DeputyDisplay: false,
        LeftSelect: 'Announce'
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

                var data = CKEDITOR.instances.editor1.getData();

                var form = new FormData();
                var upload = $('#file-uploader')[0].files;
               
            }
        });
    };

    //測試用假資料

    var test = [
        { name: '桃園九年級學習特質問卷', date: '2019/4/10', status: '啟用' },
        { name: '台北六年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '台北六年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/5/20', status: '啟用' },
        { name: '台中九年級學習特質問卷', date: '2019/4/10', status: '未啟用' },
        { name: '台中九年級學習特質問卷', date: '2019/6/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '台北六年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/6/20', status: '啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '台中九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '台中九年級學習特質問卷', date: '2019/5/20', status: '啟用' },
        { name: '台中九年級學習特質問卷', date: '2019/4/10', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '台南七年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '台南七年級學習特質問卷', date: '2019/5/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '台南七年級學習特質問卷', date: '2019/5/10', status: '啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '台南七年級學習特質問卷', date: '2019/6/20', status: '啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '台南七年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/6/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '啟用' },
        { name: '台南七年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
        { name: '桃園九年級學習特質問卷', date: '2019/4/20', status: '未啟用' },
    ];

    TableListBuild({
        Name: '列表元件',
        Recover: true,
        GetSearch: function (ReSearch) {
            //開啟 Recover 功能時需要將記錄的資料套用回介面上的物件
            if (ReSearch) {
                $('#keyword').val(ReSearch.keyword);
                $('#keyword2').val(ReSearch.keyword2);
                $('#keyword3').val(ReSearch.keyword3);
            }
            //讀取介面上的物件數值傳送到 Search 變數之中
            var Search = {
                keyword: $('#keyword').val(),
                keyword2: $('#keyword2').val(),
                keyword3: $('#keyword3').val(),
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
                if (Option.Search['keyword3'] == '' || test[i]['status'].match(Option.Search['keyword3'])) {
                    checkC = true;
                }

                if (checkA && checkB && checkC) {
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
                if (Option.Search['keyword3'] == '' || test[i]['status'].match(Option.Search['keyword3'])) {
                    checkC = true;
                }

                if (checkA && checkB && checkC) {
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

    TableListClear = function () {

        $('#keyword').val('');
        $('#keyword2').val('');
        $('#keyword3').val('');

        TableListRun('列表元件');
    };
    

});