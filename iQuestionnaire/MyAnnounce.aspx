<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="MyAnnounce.aspx.cs" Inherits="_Default" %>

<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/MyAnnounce.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <link href="<%=ResolveClientUrl("~/MyCss/MyAnnounce.css") %>" rel="stylesheet" />

    <style type="text/css">
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">

    <div id="app">

        <div class="extra_blank"></div>

        <div class="ContentBoxHtml">

            


        </div>

        <div class="extra_blank"></div>


    </div>




</asp:Content>
