<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="Announce.aspx.cs" Inherits="Announce" %>


<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/Announce.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <link href="<%=ResolveClientUrl("~/MyCss/Announce.css") %>" rel="stylesheet" />
    <style type="text/css">
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">

    <div id="app">

        <div class="ContentBoxHtml">
            <div class="ContentBoxHeader">公告查詢</div>
            <table class="table">
                <tr>
                    <th>公告類型</th>
                    <td colspan="4">
                        <label class="label_radio">
                            <input type="radio" name="radio" value="全部查詢" checked="checked" />
                            <span class="label_icon"></span>
                            <span class="label_text">全部查詢</span>
                        </label>
                        <label class="label_radio">
                            <input type="radio" value="一般公告" name="radio" />
                            <span class="label_icon"></span>
                            <span class="label_text">一般公告</span>
                        </label>
                        <label class="label_radio">
                            <input type="radio" value="置頂消息" name="radio" />
                            <span class="label_icon"></span>
                            <span class="label_text">置頂消息</span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>公告標題</th>
                    <td>
                        <div>
                            <input id="announce_keyword" type="text" value="" placeholder="輸入..." />
                            <div class="inputLine"></div>
                        </div>
                    </td>
                    <th>啟用狀態</th>
                    <td>
                        <label class="label_radio">
                            <input type="radio" name="radio2" value="全部查詢" checked="checked" />
                            <span class="label_icon"></span>
                            <span class="label_text">全部查詢</span>
                        </label>
                        <label class="label_radio">
                            <input type="radio" value="啟用" name="radio2" />
                            <span class="label_icon"></span>
                            <span class="label_text">啟用</span>
                        </label>
                        <label class="label_radio">
                            <input type="radio" value="停用" name="radio2" />
                            <span class="label_icon"></span>
                            <span class="label_text">停用</span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>發佈人</th>
                    <td>
                        <div>
                            <input id="announce_keyword2" type="text" value="" placeholder="輸入..." />
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
        </div>

        <div class="ContentBoxHtml">
            <div class="ContentBoxHeader">操作功能</div>
            <div class="manipulate_btn">
                <button type="button" class="button btn_white" onclick="addAnnounce()"><i class="fa fa-plus" style="color: #1E9E74; padding-right: 3px"></i>新增公告</button>
                <button type="button" class="button btn_white" onclick="deleteAnnounce()"><i class="fa fa-trash-o" style="color: #f00; padding-right: 3px"></i>刪除公告</button>
                <%--<button type="button" class="button btn_white" onclick="copyAnnounce()"><i class="fa fa-clone" style="color: #0085E5; padding-right: 3px"></i>複製公告</button>--%>
            </div>
        </div>

        <div class="ContentBoxHtml">
            <div class="ContentBoxHeader">查詢結果</div>
            <%--<div class="noSearch"><span>尚未輸入搜尋條件</span></div>--%>
            <div class="tableDisplayNone" style="margin: 5px 0">
                <table class="table">
                    <tr>
                        <td>總共查詢到<span tbl-build="列表元件-Count"></span>筆&emsp;<div tbl-build="列表元件-PageDrop"></div>
                            <div tbl-build="列表元件-PerDrop"></div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="table_shadow table_shadowNoLine tableDisplayNone">
                <table class="table">
                    <tr>
                        <th style="width: 60px">
                            <label class="label_checkbox">
                                <input tbl-keep="列表元件-CheckAll" type="checkbox" />
                                <span class="label_icon"></span>
                                <span class="label_text">全選</span>
                            </label>
                        </th>
                        <th class="textL" style="font-weight: bold; font-size: 16px">公告標題</th>
                        <th style="font-weight: bold; font-size: 16px">更新日期</th>
                        <th style="font-weight: bold; font-size: 16px">公告類型</th>
                        <th style="font-weight: bold; font-size: 16px">公告狀態</th>
                        <th style="font-weight: bold; font-size: 16px">發佈人</th>
                        <th style="font-weight: bold; font-size: 16px">操作功能</th>
                    </tr>
                    <tr tbl-repeat="列表元件" class="trHover textC">
                        <td>
                            <label class="label_checkbox">
                                <input tbl-keep="列表元件-CheckBox" type="checkbox" />
                                <span class="label_icon"></span>
                                <span class="label_text">@row</span>
                            </label>
                        </td>
                        <td class="textL">@name</td>
                        <td>@date</td>
                        <td>@type</td>
                        <td>@status</td>
                        <td class="textC">招生委員會
                        </td>
                        <td>
                            <button type="button" data-id="@id" class="button btn_white" onclick="editAnnounce(@index,$(this))"><i class="fa fa-pencil-square-o" style="color: #F6A800; padding-right: 3px"></i>編輯公告</button>
                        </td>
                    </tr>
                    <tr tbl-build="列表元件-NoData">
                        <td colspan="4">查無資料</td>
                    </tr>
                </table>
            </div>

            <%-- loading --%>
            <div id="LoadingBox">
                <div class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#0960A6"></div>
            </div>

        </div>






        <%-- 新增公告模板 --%>
        <div id="add_new_announce" style="display: none">
            <table class="table tableDisplayNone2">
                <tr>
                    <th style="text-align: center"><span style="color: #f00">*</span>公告狀態</th>
                    <td>
                        <label class="label_radio">
                            <input type="radio" name="radio3" id="normal_announce" value="一般公告" />
                            <span class="label_icon"></span>
                            <span class="label_text">一般公告</span>
                        </label>
                        <label class="label_radio">
                            <input type="radio" name="radio3" id="new_announce" value="置頂消息" />
                            <span class="label_icon"></span>
                            <span class="label_text">置頂消息</span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: center"><span style="color: #f00">*</span>公告狀態</th>
                    <td>
                        <label class="label_radio">
                            <input type="radio" name="radio4" id="active_announce" value="啟用" />
                            <span class="label_icon"></span>
                            <span class="label_text">啟用</span>
                        </label>
                        <label class="label_radio">
                            <input type="radio" name="radio4" id="inactive_announce" value="停用" />
                            <span class="label_icon"></span>
                            <span class="label_text">停用</span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: center"><span style="color: #f00">*</span>標題</th>
                    <td>
                        <div>
                            <input type="text" value="" placeholder="輸入..." id="announce_title" />
                            <div class="inputLine"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: center"><span style="color: #f00">*</span>內容</th>
                    <td>
                        <div style="font-size: 0">
                            <textarea rows="6" placeholder="輸入內容..." name="editor1" id="editor1"></textarea>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: center">附加文件</th>
                    <td>
                        <form>
                            <input type="file" id="file-uploader" data-target="file-uploader" multiple="multiple" />
                        </form>
                    </td>
                </tr>
            </table>

            <div id="LoadingBox2">
                <div class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#0960A6"></div>
            </div>
        </div>

    </div>



</asp:Content>
