<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/Default.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <link href="<%=ResolveClientUrl("~/MyCss/Default.css") %>" rel="stylesheet" />


    <style type="text/css">
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">



        <div id="ContentBoxInset">
            <!--登入-->
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

                    <button onclick="document.location.href = 'QuestionnaireList.aspx?user=admin'" type="button" class="button btn_miku" style="width: 100%; height: 40px">管理者</button><br />
                    <br />
                    <button onclick="document.location.href = 'MyAnnounce.aspx?user=user'" type="button" class="button btn_miku" style="width: 100%; height: 40px">使用者</button><br />
                    <br />


                </div>

            </div>
        </div>


</asp:Content>
