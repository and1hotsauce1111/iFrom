<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/Default.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/useJs/alert2.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>

    <style type="text/css">
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">

    <div class="ContentBoxHtml">
        


    </div>

</asp:Content>
