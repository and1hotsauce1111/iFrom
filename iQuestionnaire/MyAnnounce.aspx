<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="MyAnnounce.aspx.cs" Inherits="Announce" %>

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

    <div class="ContentBoxHtml">
        <div class="ContentBoxHeader">公告消息</div>

        <table class="table">
            <tr>
                <th>公告標題</th>
                <td colspan="4">
                    <div>
                        <input id="my_announce_keyword" type="text" value="" placeholder="輸入..." />
                        <div class="inputLine"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>發佈人</th>
                <td>
                    <div>
                        <input id="my_announce_keyword2" type="text" value="" placeholder="輸入..." />
                        <div class="inputLine"></div>
                    </div>
                </td>
                <th>操作</th>
                <td>
                    <button onclick="TableListClear()" type="button" class="button btn_white">重設</button>
                    <button tbl-build="列表元件-RunBtn" type="button" class="button btn_blue">查詢</button>
                </td>
            </tr>
        </table>

        <%--<div class="noSearch"><span>尚未輸入搜尋條件</span></div>--%>
        <div style="margin: 5px 0">
            <table class="table">
                <tr>
                    <td>總共查詢到<span tbl-build="列表元件-Count"></span>筆&emsp;<div tbl-build="列表元件-PageDrop"></div>
                        <div tbl-build="列表元件-PerDrop"></div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="table_shadow  table_shadowNoLine">
            <table class="table">
                <tr>
                    <th></th>
                    <th class="textL" style="font-weight: bold; font-size: 18px">公告標題</th>
                    <th style="font-weight: bold; font-size: 18px">發佈人</th>
                    <th style="font-weight: bold; font-size: 18px">發佈日期</th>
                </tr>
                <tr tbl-repeat="列表元件" class="trHover textC" onclick="showAnnounce(@index)" style="cursor: pointer">
                    <td>
                        <span class="label_text">@row</span>
                    </td>
                    <td class="textL">@name</td>
                    <td class="textC">招生委員會
                    </td>
                    <td>@date</td>
                </tr>
                <tr tbl-build="列表元件-NoData">
                    <td colspan="4">查無資料</td>
                </tr>
            </table>
        </div>

        <%-- 顯示公告模板 --%>
        <div id="show_announce" style="display: none">
            <h2 id="announce_title" style="color: #005DA8"></h2>
            <br />
            <h4 id="announce_publisher" style="color: #005DA8">發佈人：<span style="color:#FF6A00">招生委員會</span></h4>
            <h4 id="announce_publish_time" style="color: #005DA8"></h4>
            <br />
            <h4 style="color: #005DA8">公告內容: </h4>
            <div id="annoucne_content"></div>
            <br />
            <div style="color: #005DA8">附件下載: </div>
        </div>


    </div>




</asp:Content>
