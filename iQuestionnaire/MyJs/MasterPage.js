$(function () {

    //麵包屑

    //本機
    //var path = window.location.pathname;
    //IIS
    var path = window.location.pathname == '/iQuestion/' ? '/iQuestion/Default.aspx' : window.location.pathname;
    $('#DeputyBoxInset .breadCrumbs').html(breadCrumbs(path));

    //本機
    //if (window.location.pathname == 'AddQuestionnire.aspx') {
    //    $('.LeftMenuBtn#questionnaireList').addClass('LeftMenuBtnSelect');
    //}

    //if (window.location.pathname == 'answer.aspx') {
    //    $('.LeftMenuBtn#answerQuestionnaireList').addClass('LeftMenuBtnSelect');
    //}

    //IIS
    if (window.location.pathname == '/iQuestion/AddQuestionnire.aspx') {
        $('.LeftMenuBtn#questionnaireList').addClass('LeftMenuBtnSelect');
    }

    if (window.location.pathname == '/iQuestion/Answer.aspx') {
        $('.LeftMenuBtn#answerQuestionnaireList').addClass('LeftMenuBtnSelect');
    }

});