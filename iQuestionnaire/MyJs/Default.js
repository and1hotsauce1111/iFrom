$(function () {

    //UI
    VisualModule({
        LeftSelect: 'Index',
        LeftDisplay: false,
        DeputyDisplay: false,
    });

    /* API練習 */
    //var ashxPath = 'testAPI.ashx';

    //getData = function () {

    //    //同步
    //    var temp = {
    //        Type: 'GetData',
    //        目標uid: 1,
    //    };
    //    var rlt = tools.ajax(temp, ashxPath);

    //    var array = rlt['全取'] ? rlt['全取'] : [];

    //    $('#api練習').empty();
    //    for (var i = 0; i < array.length; i++) {
    //        //array[i]['uid']
    //        $('#api練習').append(
    //            (i + 1) + '. ' + array[i]['名稱'] + '(' + array[i]['備註'] + ') \
    //            <button onclick="delData(' + array[i]['uid'] + ')">del</button> \
    //            <button onclick="updateData(' + array[i]['uid'] + ')">update</button><br>');
    //    }

    //};
    //getData();

    //delData = function (uid) {
    //    var temp = {
    //        Type: 'DeleteData',
    //        目標uid: uid,
    //    };
    //    var rlt = tools.ajax(temp, ashxPath);
    //    getData();
    //};

    //createData = function () {
    //    var temp = {
    //        Type: 'CreateData',
    //        名稱: filter.numberRandom(4),
    //        備註: filter.numberRandom(6),
    //    };
    //    var rlt = tools.ajax(temp, ashxPath);
    //    getData();
    //};

    //updateData = function (uid) {
    //    var temp = {
    //        Type: 'UpdateData',
    //        目標uid: uid,
    //        名稱: filter.numberRandom(4),
    //        備註: filter.numberRandom(6),
    //    };
    //    var rlt = tools.ajax(temp, ashxPath);
    //    getData();
    //};

    ////非同步
    //tools.ajax(temp, 'testAPI.ashx', function (rlt) {
    //
    //    var array2 = rlt['只要小明'] ? rlt['只要小明'][0] : [];
    //    $('#api練習').append(array2['uid'] + '. ' + array2['名稱'] + '(' + array2['備註'] + ')');
    //
    //});



});