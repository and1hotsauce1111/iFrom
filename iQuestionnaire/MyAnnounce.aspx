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

        <table class="table search">
            <tr>
                <th style="width: 15%">關鍵字</th>
                <td>
                    <div>
                        <input id="my_announce_keyword" type="text" value="" placeholder="標題/發佈人/發佈日期..." />
                        <div class="inputLine"></div>
                    </div>
                </td>
                <td style="width: 100px; white-space: nowrap">
                    <button onclick="TableListClear()" type="button" class="button btn_white">重設</button>
                    <button tbl-build="列表元件-RunBtn" type="button" class="button btn_blue">查詢</button>
                </td>
            </tr>
        </table>

        <%-- 手機板查詢列 --%>
        <table class="table search_mobile">
            <tr>
                <th style="width:21%;font-size:10px">關鍵字</th>
                <td class="mobile_search_width">
                    <div>
                        <input style="font-size:10px" id="my_announce_keyword_mobile" type="text" value="" placeholder="標題/發佈人/發佈日期..." />
                        <div class="inputLine"></div>
                    </div>
                </td>
                <td style="width: 30px; white-space: nowrap; text-align: center">
                    <i class="fa fa-search" tbl-build="列表元件-RunBtn" id="search_mobile_btn"></i>
                    <i class="fa fa-undo" onclick="TableListClear()" id="reset_mobile_btn"></i>
                    <%--<button onclick="TableListClear()" type="button" class="button btn_white">重設</button>
                    <button tbl-build="列表元件-RunBtn" type="button" class="button btn_blue">查詢</button>--%>
                </td>
            </tr>
        </table>



        <div class="table_shadow tableDisplayNone" style="margin: 5px 0">
            <table class="table search_result">
                <tr>
                    <td>總共查詢到<span tbl-build="列表元件-Count"></span>筆&emsp;<div tbl-build="列表元件-PageDrop"></div>
                        <div tbl-build="列表元件-PerDrop"></div>
                    </td>
                </tr>
            </table>

            <%-- 手機板查詢結果列 --%>
            <div class="show_search_mobile">
                <div style="text-align: center;font-size: 14px;color: #bbb;margin-bottom:10px">總共查詢到<span tbl-build="列表元件-Count"></span>筆&emsp;</div>
                <div style="text-align:center">
                    <div style="margin-bottom:20px" tbl-build="列表元件-PageDrop"></div>
                    <div style="margin-bottom:20px" tbl-build="列表元件-PerDrop"></div>
                </div>
            </div>

        </div>




        <div class="table_shadow  table_shadowNoLine tableDisplayNone">

            <table class="table showlist mobile_text">
                <tr>
                    <th></th>
                    <th class="textL mobile_width"><span class="mobile_text" style="position:relative;top:4px;font-size:16px;border-bottom:2px solid #0072C4;padding:5px 0">公告標題</span></th>
                    <th class="textL"><span class="mobile_text" style="position:relative;top:4px;font-size:16px;border-bottom:2px solid #0072C4;padding:5px 0">發佈人</span></th>
                    <th class="textL mobile_displayNone"><span class="mobile_text" style="position:relative;top:4px;font-size:16px;border-bottom:2px solid #0072C4;padding:5px 0">發佈日期</span></th>
                </tr>
                <tr tbl-repeat="列表元件" class="trHover textC" onclick="showAnnounce(event,@index)" style="cursor: pointer">
                    <td>
                        <span class="label_text">@row</span>
                    </td>
                    <td class="textL">@name</td>
                    <td class="textL">招生委員會
                    </td>
                    <td class="textL mobile_displayNone">@date</td>
                </tr>
                <tr tbl-build="列表元件-NoData">
                    <td colspan="4">查無資料</td>
                </tr>
            </table>

        </div>

        <%-- loading --%>
        <div id="LoadingBox">
            <div class="fa fa-spinner fa-spin fa-3x fa-fw" style="color: #0960A6"></div>
        </div>


        <%-- 顯示公告模板 --%>
        <div id="show_announce" style="display: none">
            <h2 id="announce_title" style="color: #005DA8"></h2>
            <br />
            <h4 id="announce_publisher" style="color: #005DA8">發佈人：<span style="color: #FF6A00">招生委員會</span></h4>
            <h4 id="announce_publish_time" style="color: #005DA8"></h4>
            <br />
            <h4 style="color: #005DA8">公告內容: </h4>
            <div id="annoucne_content"></div>
            <br />
            <div style="color: #005DA8">附件下載: </div>
        </div>


    </div>




</asp:Content>
