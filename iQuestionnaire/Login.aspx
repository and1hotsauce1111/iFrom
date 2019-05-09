<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Default2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" http-equiv="Content-Type" charset="UTF-8" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />

    <title>問卷系統</title>

    <!--輔助工具-->
    <link href="<%=ResolveClientUrl("~/IncludeCss/jquery.mCustomScrollbar.min.css")%>" rel="stylesheet" />
    <link href="<%=ResolveClientUrl("~/IncludeCss/nprogress.css")%>" rel="stylesheet" />
    <link href="<%=ResolveClientUrl("~/useCss/visualmodule.css")%>" rel="stylesheet" />
    <link href="<%=ResolveClientUrl("~/useCss/button2.css")%>" rel="stylesheet" />
    <link href="<%=ResolveClientUrl("~/useCss/input2.css")%>" rel="stylesheet" />

    <script type="text/javascript" src="<%=this.ResolveUrl("~/IncludeJs/jquery-3.3.1.min.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/IncludeJs/jquery.easing.1.3.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/IncludeJs/jquery.mCustomScrollbar.concat.min.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/IncludeJs/nprogress.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/IncludeJs/autosize.min.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/IncludeJs/linq.min.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/Scripts/vue.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/Scripts/lodash.min.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/Scripts/v-dropdown.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/Scripts/v-pager.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/Scripts/JQueryToolsFuntion.js")%>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/Scripts/uuid.js")%>"></script>


    <!--icon套件-->
    <link href="<%=ResolveClientUrl("~/IncludeCss/font-awesome-4.7.0/css/font-awesome.min.css")%>" rel="stylesheet" />


    <style type="text/css">
    </style>
    <script type="text/javascript">

</script>

    <!-- favicon.ico 語法-->
    <link class="faviconLink" rel="shortcut icon" href="<%=ResolveClientUrl("~/Favicon/Jhenggao.ico")%>" />
    <link class="faviconLink" rel="bookmark" href="<%=ResolveClientUrl("~/Favicon/Jhenggao.ico")%>" />

</head>
<body>
    <div id="ContentBoxInset">
        <div class="ContentBoxHtml" id="login" style="max-width: 600px">

            <div class="ContentBoxHeaderText">登入</div>

            <div style="max-width: 400px; margin: auto; padding: 20px">
                <br />

                <div onclick="$('#LoginAccount').focus()">
                    <i class="fa fa-user fa-fw"></i>帳號
                </div>
                <div>
                    <input id="LoginAccount" type="text" placeholder="輸入..." /><br />
                    <div class="inputLine"></div>
                </div>
                <br />
                <br />

                <div onclick="$('#LoginPassword').focus()">
                    <i class="fa fa-lock fa-fw"></i>密碼
                </div>
                <div>
                    <input id="LoginPassword" type="password" placeholder="輸入..." /><br />
                    <div class="inputLine"></div>
                </div>
                <br />
                <br />
                <br />

                <button onclick="document.location.href = 'QuestionnaireList.aspx?admin'" type="button" class="button btn_miku" style="width: 100%; height: 40px">管理者</button><br />
                <br />
                <button onclick="document.location.href = 'QuestionnaireList.aspx?user'" type="button" class="button btn_miku" style="width: 100%; height: 40px">使用者</button><br />
                <br />

            </div>

        </div>

    </div>

</body>
</html>
