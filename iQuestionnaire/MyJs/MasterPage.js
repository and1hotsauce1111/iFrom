$(function () {

    //麵包屑

    //本機
    //var path = window.location.pathname;
    //IIS
    getUrlVars();
    var surveyId = $.getUrlVar('surveyId'); //取得問卷uid
    var url = surveyId !== undefined ? window.location.pathname + '?surveyId=' + surveyId : window.location.pathname; //有call api帶uid
    var path = window.location.pathname == '/iQuestion/' ? '/iQuestion/Default.aspx' : url; //產生路徑

    $('#DeputyBoxInset .breadCrumbs').html(breadCrumbs(path)); //遞歸跑麵包屑

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