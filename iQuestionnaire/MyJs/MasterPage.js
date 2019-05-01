$(function () {

    //麵包屑
    var path = window.location.pathname == '/iQuestionnaire/' ? '/iQuestionnaire/Default.aspx' : window.location.pathname;
    $('#DeputyBoxInset .breadCrumbs').html(breadCrumbs(path));

    if (window.location.pathname == '/iQuestionnaire/AddQuestionnire.aspx') {
        $('.LeftMenuBtn#questionnaireList').addClass('LeftMenuBtnSelect');
    }

});