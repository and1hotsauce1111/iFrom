<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="AnswerQuestionnaireList .aspx.cs" Inherits="Announce" %>

<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/QuestionnaireList.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <link href="<%=ResolveClientUrl("~/MyCss/QuestionnaireList.css") %>" rel="stylesheet" />

    <style type="text/css">
        
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">

    <div class="ContentBoxHtml">
        <div class="ContentBoxHeader">問卷查詢</div>
        <div class="list_tools">
            <div class="addNewQuestionnaire">

                <%--<button type="button" class="button btn_miku btn-lg" id="addQuestionnaire"><i class="fa fa-plus" style="padding-right: 5px"></i>新建問卷</button>--%>
            </div>
            <div class="change_list">
                <i class="fa fa-th-list" onclick="listModeBtn('block')"></i>
                <i class="fa fa fa-th" onclick="listModeBtn('list')"></i>
            </div>
        </div>
        <div style="margin: 5px 0">
            <table class="table">
                <tr>
                    <th>問卷名稱</th>
                    <td>
                        <input id="keyword" tbl-keep="列表元件-Enter" type="text" value="" placeholder="輸入問卷名稱..." />
                        <div class="inputLine"></div>
                    </td>
                    <th>截止日期</th>
                    <td>
                        <input id="keyword2" tbl-keep="列表元件-Enter" type="text" value="" placeholder="輸入截止日期..." />
                        <div class="inputLine"></div>
                    </td>
                </tr>
                <tr>
                    <th>發佈狀態</th>
                    <td>
                        <input id="keyword3" tbl-keep="列表元件-Enter" type="text" value="" placeholder="輸入發佈狀態..." />
                        <div class="inputLine"></div>
                    </td>
                    <th>問卷填答設置</th>
                    <td>
                        <input id="keyword4" tbl-keep="列表元件-Enter" type="text" value="" placeholder="輸入問卷填答設置..." />
                        <div class="inputLine"></div>
                    </td>
                </tr>
            </table>
            <div class="search_btn">
                <button onclick="TableListClear()" type="button" class="button btn_white">清空</button>
                <button tbl-build="列表元件-RunBtn" type="button" class="button btn_miku">查詢</button>
            </div>
        </div>
    </div>


    <%-- 問卷操作功能 --%>
    <div class="ContentBoxHtml">
        <div class="ContentBoxHeader">操作功能</div>
        <a href="AddQuestionnire.aspx" class="button btn_white"><i class="fa fa-plus" style="color: #1E9E74; padding-right: 3px"></i>新增問卷</a>
        <button type="button" class="button btn_white" onclick="delQuestionnaire()"><i class="fa fa-trash-o" style="color: #f00; padding-right: 3px"></i>刪除問卷</button>
        <button type="button" class="button btn_white" onclick="editQuestionnaire()"><i class="fa fa-pencil-square-o" style="color: #F6A800; padding-right: 3px"></i>編輯問卷</button>
        <button type="button" class="button btn_white" onclick="copyQuestionnaire()"><i class="fa fa-clone" style="color: #0085E5; padding-right: 3px"></i>複製問卷</button>
    </div>


    <%-- 顯示問卷列表 --%>
    <div class="ContentBoxHtml" id="show_list">
        <div class="ContentBoxHeader">查詢結果</div>
        <div style="margin-bottom: 20px">
            總共查詢到&nbsp;<span tbl-build="列表元件-Count"></span>&nbsp;筆&emsp;<div tbl-build="列表元件-PageDrop"></div>
            <div tbl-build="列表元件-PerDrop"></div>
        </div>
        <%-- 顯示列表區塊，一開始都先隱藏 --%>
        <div id="listView"></div>

        <%-- 列表式template --%>
        <%-- 最外面多一層，塞DOM比較方便 --%>
        <div id="listType">
            <div class="table_shadow  table_shadowNoLine">
                <table class="table">
                    <tr>
                        <th style="width: 60px">
                            <label class="label_checkbox">
                                <input tbl-keep="列表元件-CheckAll" type="checkbox" />
                                <span class="label_icon"></span>
                                <span class="label_text">全選</span>
                            </label>
                        </th>
                        <th>問卷名稱</th>
                        <th>問卷截止日期</th>
                        <th>發佈狀態</th>
                        <th>問卷填答設置</th>
                    </tr>
                    <tr tbl-repeat="列表元件" class="trHover textC">
                        <td>
                            <label class="label_checkbox">
                                <input tbl-keep="列表元件-CheckBox" type="checkbox" />
                                <span class="label_icon"></span>
                                <span class="label_text">@row</span>
                            </label>
                        </td>
                        <td>@name</td>
                        <td>@date</td>
                        <td>@status</td>
                        <td>@repeat</td>
                    </tr>
                    <tr tbl-build="列表元件-NoData">
                        <td colspan="4">查無資料</td>
                    </tr>
                </table>
            </div>
        </div>

        <%-- 方塊式template --%>
        <div id="squareType">
            <div class="question_list_square">
                <ul class="question_list_square_list">
                    <li tbl-repeat="列表元件">
                        <div class="show_questionnaire">
                            <div class="show_questionnaire_content">
                                <i class="fa fa-file-text-o" id="question_icon"></i>
                                <span class="questionnaire_name">@name</span>
                            </div>
                            <div class="show_questionnaire_tools" onclick="showEidtTools(event)"><i class="fa fa-ellipsis-v"></i></div>
                            <div class="show_questionnaire_tools_options">
                                <ul class="show_questionnaire_tools_options_list">
                                    <li>
                                        <div class="show_questionnaire_tools_options_edit">
                                            <i class="fa fa-pencil-square-o"></i>編輯問卷
                                        </div>
                                    </li>
                                    <li>
                                        <div class="show_questionnaire_tools_options_copy">
                                            <i class="fa fa-clone"></i>複製問卷
                                        </div>
                                    </li>
                                    <li>
                                        <div class="show_questionnaire_tools_options_delete">
                                            <i class="fa fa-trash-o"></i>刪除問卷
                                        </div>
                                    </li>
                                    <li>
                                        <hr style="border: 0; border-bottom: 1px solid #f1f1f1" />
                                    </li>
                                    <li>
                                        <div class="show_questionnaire_tools_options_close" onclick="closeEditTools(event)">
                                            <i class="fa fa-times"></i>關閉選單
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

    </div>

</asp:Content>
