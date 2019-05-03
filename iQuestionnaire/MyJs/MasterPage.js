$(function () {

    //麵包屑

    //本機
    //var path = window.location.pathname;
    //IIS
    var path = window.location.pathname == '/iQuestionnaire/' ? '/iQuestionnaire/Default.aspx' : window.location.pathname;
    $('#DeputyBoxInset .breadCrumbs').html(breadCrumbs(path));

    //本機
    //if (window.location.pathname == 'AddQuestionnire.aspx') {
    //    $('.LeftMenuBtn#questionnaireList').addClass('LeftMenuBtnSelect');
    //}

    //IIS
    if (window.location.pathname == '/iQuestionnaire/AddQuestionnire.aspx') {
        $('.LeftMenuBtn#questionnaireList').addClass('LeftMenuBtnSelect');
    }

});