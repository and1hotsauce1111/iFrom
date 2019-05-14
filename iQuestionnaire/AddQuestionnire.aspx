<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="AddQuestionnire.aspx.cs" Inherits="AddQuestionnire" %>

<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/AddQuestionnire.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <link href="<%=ResolveClientUrl("~/MyCss/AddQuestionnire.css") %>" rel="stylesheet" />

    <style type="text/css">
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">
    <div id="editQuestion">

        <%-- 選擇題型工具列 --%>

        <div class="tools_bar">
            <div class="tools_bar_up"></div>
            <div class="tools_bar_items">
                <div class="tools_bar_items_basic">
                    <div class="tool_items">
                        <ul class="tool_items_list">
                            <li onclick="editQuestion(event,'add',$(this))" data-type="radio">
                                <div class="radio_icon"><i class="fa fa-dot-circle-o"></i></div>
                                <div class="radio_text">單選題</div>
                            </li>
                            <li onclick="editQuestion(event,'add',$(this))" data-type="checkbox">
                                <div class="checkbox_icon"><i class="fa fa-check-square-o"></i></div>
                                <div class="checkbox_text">多選題</div>
                            </li>
                            <li onclick="editQuestion(event,'add',$(this))" data-type="pulldown">
                                <div class="pulldown_icon"><i class="fa fa-caret-square-o-down"></i></div>
                                <div class="pulldown_text">下拉單選題</div>
                            </li>
                            <li onclick="editQuestion(event,'add',$(this))" data-type="textarea">
                                <div class="textarea_icon"><i class="fa fa-file-text-o"></i></div>
                                <div class="textarea_text">文本題</div>
                            </li>
                            <li onclick="editPageDesc(event,'add')">
                                <div class="textarea_icon"><i class="fa fa-quote-right"></i></div>
                                <div class="textarea_text">頁面說明</div>
                            </li>
                            <li onclick="addNewPage(event,'add')">
                                <div class="textarea_icon"><i class="fa fa-file-o"></i></div>
                                <div class="textarea_text">新增頁面</div>
                            </li>
                        </ul>
                    </div>
                    <div class="tool_type">
                        <span style="display: inline-block; background-color: #3388ff; flex: 0 0 50.1%">選擇題</span>
                        <span style="display: inline-block; background-color: #EA4335; flex: 0 0 16.5%">填空題</span>
                        <span style="display: inline-block; background-color: #FFD04A; flex: 0 0 33.4%">備註說明</span>
                    </div>
                </div>
                <div class="save_items">
                    <button type="button" class="button btn_miku" id="saveQuestionnaire" onclick="saveQuestionnaire()"><i class="fa fa-floppy-o" style="padding-right: 6px"></i>儲存問卷</button>
                    <button type="button" class="button btn_white" id="cancelQuestionniare" onclick="cancelQuestionnaire()"><i class="fa fa-reply" style="padding-right: 6px"></i>返回列表</button>
                </div>
            </div>
        </div>

        <%-- 工具列縮小版 --%>

        <div class="tools_bar_mini">
            <div class="basic_tools">
                <ul class="basic_tools_list">
                    <li onclick="editQuestion(event,'add',$(this))" data-type="radio">
                        <div class="radio_icon" title="單選題"><i class="fa fa-dot-circle-o"></i></div>
                    </li>
                    <li onclick="editQuestion(event,'add',$(this))" data-type="checkbox">
                        <div class="checkbox_icon" title="多選題"><i class="fa fa-check-square-o"></i></div>
                    </li>
                    <li onclick="editQuestion(event,'add',$(this))" data-type="pulldown">
                        <div class="pulldown_icon" title="下拉題"><i class="fa fa-caret-square-o-down"></i></div>
                    </li>
                    <li onclick="editQuestion(event,'add',$(this))" data-type="textarea">
                        <div class="textarea_icon" title="文本題"><i class="fa fa-file-text-o"></i></div>
                    </li>
                    <li onclick="editPageDesc(event,'add')">
                        <div class="textarea_icon" title="頁面說明"><i class="fa fa-quote-right"></i></div>
                    </li>
                    <li onclick="addNewPage(event, 'add')">
                        <div class="textarea_icon" title="新增頁面"><i class="fa fa-file-o"></i></div>
                    </li>
                </ul>
            </div>
            <div class="save">
                <ul class="save_list">
                    <li id="saveIcon" title="儲存問卷" style="color:#008991" onclick="saveQuestionnaire()"><i class="fa fa-floppy-o"></i></li>
                    <li id="returnIcon" title="返回列表"><i class="fa fa-reply" onclick="cancelQuestionnaire()"></i></li>
                </ul>
            </div>
        </div>

        <%-- 插入問題編輯Html --%>
        <div style="display: none">

            <%-- 頁面說明編輯模版 --%>
            <div id="editPageDesc">
                <span style="display: inline-block; margin: 20px 0"><span style="color: #FF6A00">*&nbsp;</span>請輸入頁面說明內容: </span>
                <div style="font-size: 0">
                    <textarea rows="3" placeholder="輸入內容..." id="editPageDescVal"></textarea>
                </div>
            </div>

            <%-- 單選題編輯模板(新增) --%>
            <div id="editRadio">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="radio1" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="radio1" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="radio_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="radio_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>                    
                    <tr>
                        <th style="width: 30%" class="textC" id="radio_options"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題選項</th>
                        <td style="padding: 10px">
                            <button type="button" class="button btn_blue" id="show_radio_edit" onclick="addOption(event,'radio','add')"><i class="fa fa-plus"></i>&nbsp;新增選項</button>
                            <div class="editOptions_wrap" id="editOptions_wrap_radio">
                                <div class="editOptions">
                                    <div class="radio_icon"><i class="fa fa-dot-circle-o"></i>&emsp;</div>
                                    <div class="input_area">
                                        <input type="text" value="" placeholder="輸入..." class="edit_editRadio_input" />
                                        <div class="inputLine"></div>
                                    </div>
                                    <div class="editOptions_tools">
                                        <ul class="editOptions_tools_list">
                                            <li onclick="deleteOption(event,'radio','add')">
                                                <span title="刪除">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                            </li>
                                            <li onclick="copyOption(event,'radio')">
                                                <span title="複製">
                                                    <i class="fa fa-clone"></i>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="showEditOptions_radio"></div>

                        </td>
                    </tr>
                    <%--<tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>請設定跳題邏輯</th>
                        <td style="padding: 10px;">
                            <button type="button" class="button btn_white" onclick="jumpQuestion(event,'radio','add')"><i class="fa fa-code-fork"></i>&nbsp;邏輯設置</button>
                            <p style="color:#FD6A4F" id="radio_logic_show"></p>
                        </td>
                    </tr>--%>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <i class="fa fa-minus"></i>&nbsp;:&nbsp;<span>刪除單一筆選項(若該選項有設置跳題邏輯將會一併刪除)&emsp;</span>
                    <i class="fa fa-clone"></i>&nbsp;:&nbsp;<span>插入新選項至當前選項下方</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>

            </div>

            <%-- 單選題編輯樣板(編輯) --%>
            <div id="edit_editRadio" style="display: none">

                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="edit_radio1" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="edit_radio1" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_radio_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="edit_radio_question_title" />
                            <div class="inputLine"></div>
                            <span id="quesitonNum" style="display:none"></span>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_radio_options"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題選項</th>
                        <td style="padding: 10px">
                            <button type="button" class="button btn_blue" id="edit_show_radio_edit" onclick="addOption(event,'radio','edit')">新增選項</button>

                            <div class="editOptions_wrap" id="edit_editOptions_wrap_radio" style="display: block">
                                <div class="editOptions">
                                    <div class="radio_icon"><i class="fa fa-dot-circle-o"></i>&emsp;</div>
                                    <div class="input_area">
                                        <input type="text" value="" placeholder="輸入..." class="edit_editRadio_input" />
                                        <div class="inputLine"></div>
                                    </div>
                                    <div class="editOptions_tools">
                                        <ul class="editOptions_tools_list">
                                            <li onclick="deleteOption(event,'radio','edit')">
                                                <span title="刪除">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                                <span style="display:none" id="edit_eidtRadio_del"></span>
                                            </li>
                                            <li onclick="copyOption(event)">
                                                <span title="複製">
                                                    <i class="fa fa-clone"></i>
                                                </span>
                                                <span style="display:none" id="edit_eidtRadio_copy"></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" aria-hidden="true" style="padding-right: 10px"></i>
                    <i class="fa fa-minus"></i>&nbsp;:&nbsp;<span>刪除單一筆選項(若該選項有設置跳題邏輯將會一併刪除)&emsp;</span>
                    <i class="fa fa-clone"></i>&nbsp;:&nbsp;<span>插入新選項至當前選項下方</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>

            </div>

            <%-- 多選題編輯模板(新增) --%>
            <div id="editCheckbox">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="radio2" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="radio2" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="checkbox_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="checkbox_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="checkbox_options"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題選項</th>
                        <td style="padding: 10px">
                            <button type="button" class="button btn_blue" id="show_checkbox_edit" onclick="addOption(event,'checkbox','add')">新增選項</button>
                            <div class="editOptions_wrap" id="editOptions_wrap_checkbox">
                                <div class="editOptions">
                                    <div class="checkbox_icon"><i class="fa fa-check-square-o"></i>&emsp;</div>
                                    <div class="input_area">
                                        <input type="text" value="" placeholder="輸入..." class="edit_editCheckbox_input" />
                                        <div class="inputLine"></div>
                                    </div>
                                    <div class="editOptions_tools">
                                        <ul class="editOptions_tools_list">
                                            <%--<li onclick="addOption(event,'checkbox')">
                                                <span title="新增">
                                                    <i class="fa fa-plus"></i>
                                                </span>
                                            </li>--%>
                                            <li onclick="deleteOption(event,'checkbox','add')">
                                                <span title="刪除">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                            </li>
                                            <li onclick="copyOption(event,'checkbox')">
                                                <span title="複製">
                                                    <i class="fa fa-clone"></i>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="showEditOptions_checkbox"></div>

                        </td>
                    </tr>
                    <%--<tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>請設定跳題邏輯</th>
                        <td style="padding: 10px;">
                            <button type="button" class="button btn_white" onclick="jumpQuestion(event,'checkbox','add')"><i class="fa fa-code-fork"></i>&nbsp;邏輯設置</button>
                            <p style="color:#FD6A4F">** 若本題選擇aaa，則跳至第7題，不略過第3題</p>
                        </td>
                    </tr>--%>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" aria-hidden="true" style="padding-right: 10px"></i>
                    <i class="fa fa-minus"></i>&nbsp;:&nbsp;<span>刪除單一筆選項(若該選項有設置跳題邏輯將會一併刪除)&emsp;</span>
                    <i class="fa fa-clone"></i>&nbsp;:&nbsp;<span>插入新選項至當前選項下方</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>

            </div>

            <%-- 多選題編輯模板(編輯) --%>
            <div id="edit_editCheckbox" style="display: none">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="edit_radio2" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="edit_radio2" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_checkbox_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="edit_checkbox_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_checkbox_options"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題選項</th>
                        <td style="padding: 10px">
                            <button type="button" class="button btn_blue" id="edit_show_checkbox_edit" onclick="addOption(event,'checkbox','edit')">新增選項</button>
                            <div class="editOptions_wrap" id="edit_editOptions_wrap_checkbox" style="display: block">
                                <div class="editOptions">
                                    <div class="checkbox_icon"><i class="fa fa-check-square-o"></i>&emsp;</div>
                                    <div class="input_area">
                                        <input type="text" value="" placeholder="輸入..." class="edit_editCheckbox_input" />
                                        <div class="inputLine"></div>
                                    </div>
                                    <div class="editOptions_tools">
                                        <ul class="editOptions_tools_list">
                                            <%--<li onclick="addOption(event,'checkbox')">
                                                <span title="新增">
                                                    <i class="fa fa-plus"></i>
                                                </span>
                                            </li>--%>
                                            <li onclick="deleteOption(event,'checkbox','edit')">
                                                <span title="刪除">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                                <span style="display:none" id="edit_eidtCheckbox_del"></span>
                                            </li>
                                            <li onclick="copyOption(event)">
                                                <span title="複製">
                                                    <i class="fa fa-clone"></i>
                                                </span>
                                                <span style="display:none" id="edit_eidtCheckbox_copy"></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </td>
                    </tr>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" aria-hidden="true" style="padding-right: 10px"></i>
                    <i class="fa fa-minus"></i>&nbsp;:&nbsp;<span>刪除單一筆選項(若該選項有設置跳題邏輯將會一併刪除)&emsp;</span>
                    <i class="fa fa-clone"></i>&nbsp;:&nbsp;<span>插入新選項至當前選項下方</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>

            </div>

            <%-- 下拉題編輯模板(新增) --%>
            <div id="editPulldown">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="radio3" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="radio3" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="pulldown_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="pulldown_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="pulldown_options"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題選項</th>
                        <td style="padding: 10px">
                            <button type="button" class="button btn_blue" id="show_pulldown_edit" onclick="addOption(event,'pulldown','add')">新增選項</button>
                            <div class="editOptions_wrap" id="editOptions_wrap_pulldown">
                                <div class="editOptions">
                                    <div class="pulldown_icon"><i class="fa fa-caret-square-o-down"></i>&emsp;</div>
                                    <div class="input_area">
                                        <input type="text" value="" placeholder="輸入..." class="edit_editPulldown_input" />
                                        <div class="inputLine"></div>
                                    </div>
                                    <div class="editOptions_tools">
                                        <ul class="editOptions_tools_list">
                                            <%--<li onclick="addOption(event,'pulldown')">
                                                <span title="新增">
                                                    <i class="fa fa-plus"></i>
                                                </span>
                                            </li>--%>
                                            <li onclick="deleteOption(event,'pulldown','add')">
                                                <span title="刪除">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                            </li>
                                            <li onclick="copyOption(event,'pulldown')">
                                                <span title="複製">
                                                    <i class="fa fa-clone"></i>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="showEditOptions_pulldown"></div>

                        </td>
                    </tr>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" aria-hidden="true" style="padding-right: 10px"></i>
                    <i class="fa fa-minus"></i>&nbsp;:&nbsp;<span>刪除單一筆選項(若該選項有設置跳題邏輯將會一併刪除)&emsp;</span>
                    <i class="fa fa-clone"></i>&nbsp;:&nbsp;<span>插入新選項至當前選項下方</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>

            </div>

            <%-- 下拉題編輯模板(編輯) --%>
            <div id="edit_editPulldown" style="display: none">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="edit_radio3" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="edit_radio3" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_pulldown_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="edit_pulldown_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_pulldown_options"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題選項</th>
                        <td style="padding: 10px">
                            <button type="button" class="button btn_blue" id="edit_show_pulldown_edit" onclick="addOption(event,'pulldown','edit')">新增選項</button>
                            <div class="editOptions_wrap" id="edit_editOptions_wrap_pulldown" style="display: block">
                                <div class="editOptions">
                                    <div class="checkbox_icon"><i class="fa fa-caret-square-o-down"></i>&emsp;</div>
                                    <div class="input_area">
                                        <input type="text" value="" placeholder="輸入..." class="edit_editPulldown_input" />
                                        <div class="inputLine"></div>
                                    </div>
                                    <div class="editOptions_tools">
                                        <ul class="editOptions_tools_list">
                                            <%--<li onclick="addOption(event,'checkbox')">
                                                <span title="新增">
                                                    <i class="fa fa-plus"></i>
                                                </span>
                                            </li>--%>
                                            <li onclick="deleteOption(event,'pulldown','edit')">
                                                <span title="刪除">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                                <span style="display:none" id="edit_eidtPulldown_del"></span>
                                            </li>
                                            <li onclick="copyOption(event)">
                                                <span title="複製">
                                                    <i class="fa fa-clone"></i>
                                                </span>
                                                <span style="display:none" id="edit_eidtPulldown_copy"></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </td>
                    </tr>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" aria-hidden="true" style="padding-right: 10px"></i>
                    <i class="fa fa-minus"></i>&nbsp;:&nbsp;<span>刪除單一筆選項(若該選項有設置跳題邏輯將會一併刪除)&emsp;</span>
                    <i class="fa fa-clone"></i>&nbsp;:&nbsp;<span>插入新選項至當前選項下方</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>

            </div>

            <%-- 文本題(新增) --%>
            <div id="editTextarea">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="radio4" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="radio4" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="textarea_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="textarea_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>
                </table>

                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>
            </div>

            <%-- 文本題(編輯) --%>
            <div id="edit_editTextarea">
                <table class="table">
                    <tr>
                        <th style="width: 30%" class="textC"><span style="color: #FF6A00"></span>是否必填</th>
                        <td>
                            <label class="label_radio">
                                <input type="radio" name="radio4" value="true"/>
                                <span class="label_icon"></span>
                                <span class="label_text">是</span>
                            </label>
                            <label class="label_radio">
                                <input type="radio" name="radio4" value="false"/>
                                <span class="label_icon"></span>
                                <span class="label_text">否</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 30%" class="textC" id="edit_textarea_title"><span style="color: #FF6A00">*&nbsp;</span>請輸入問題標題</th>
                        <td>
                            <input type="text" value="" placeholder="輸入內容..." id="edit_textarea_question_title" />
                            <div class="inputLine"></div>
                        </td>
                    </tr>
                </table>
                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i>
                    <span>若未選擇是否為必填題，預設為非必填</span>
                </div>
            </div>

            <%-- 邏輯跳題模板 --%>
            <div id="jumpQuestion">
                <%--<div style="border-bottom: 1px solid #ddd;padding-bottom: 20px">                      
                    <span style="color:#FF6A00">如果本題選中&emsp;&emsp;</span><span id="selected_option"></span><span style="color:#FF6A00">&emsp;&emsp;則跳轉到&emsp;&emsp;</span><span id="jump_to_question"></span>
                    <br />
                    <br />
                    <span style="display:inline-block;color:#FF6A00">不略過&emsp;&emsp;</span><span id="no_jump_question"></span>
                </div>--%>
                <table class="table">
                    <tr>
                        <th class="textC">當前題目</th>
                        <td><p id="currentTitle"></p></td>
                    </tr>
                    <tr>
                        <th class="textC">設置跳題</th>
                        <td>
                            <span style="color:#FF6A00">如果本題選中&emsp;&emsp;</span><span id="selected_option"></span><span style="color:#FF6A00">&emsp;&emsp;則跳轉到&emsp;&emsp;</span><span id="jump_to_question"></span>
                        </td>
                    </tr>
                </table>
                
                <div class="toolsDesc">
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i><span>&nbsp;添加問卷題目及選項後，可依據填答的選項跳轉至某道題目。</span>
                    <br />
                    <i class="fa fa-exclamation-circle" style="padding-right: 10px"></i><span style="display:inline-block">文本題型無須設定填答選項。</span>
                </div>
            </div>

            <%-- 顯示跳題設定結果 --%>
            <div id="show_logic_setting">
                <div id="show_logic_content"></div>
            </div>


        </div>

        <div class="clear"></div>

        <%-- loading --%>
        <div id="LoadingBox">
            <div class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#0960A6"></div>
        </div>

        <div class="ContentBoxHtml tableDisplayNone">
            <div class="ContentBoxHeader">問卷設置</div>
            <table class="table">
                <tr>
                    <th style="font-size: 18px">標題</th>
                    <td colspan="4">
                        <div>
                            <input type="text" v-model="questionnaireTitle" placeholder="輸入..." />
                            <div class="inputLine"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style="font-size: 18px">問卷說明</th>
                    <td colspan="2">
                        <div style="font-size: 0">
                            <textarea rows="5" v-model="questionnaireDesc" placeholder="輸入內容..."></textarea>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style="width: 30%;font-size: 18px" class="textC">問卷填答設置</th>
                    <td colspan="2">
                        <label class="label_checkbox">
                            <input type="checkbox" value="重複填答" v-model="repeat"/>
                            <span class="label_icon"></span>
                            <span class="label_text">重複填答</span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th style="font-size: 18px">問卷開放期間</th>
                    <td>
                        <span style="color:#ff6a00">起: </span>
                        <div v-if="startTime === ''" id="startTime" style="margin-right:15px"></div>
                        <div v-else>{{ startTime }} &emsp;<button type="button" class="button btn_blue" @click="resetTime('start')">重新設定</button></div>               
                    </td>
                    <td>
                        <span style="color:#ff6a00">迄: </span>
                        <div v-if="deadline === ''" id="deadline"></div>
                        <div v-else>{{ deadline }} &emsp;<button type="button" class="button btn_blue" @click="resetTime('end')">重新設定</button></div>
                    </td>
                </tr>
            </table>
            
        </div>

        <%-- 渲染頁面資料 --%>
        <div class="ContentBoxHtml questionDisplayNone" id="show_question">


            <div v-for="(page,i) in allQuestionnaireData">

                <template v-if="page.page === nowPage">                         
                        <div class="ContentBoxHeader" style="display:flex;justify-content:space-between;align-items:center">
                            <div>問卷內容: [{{ page.page }} / {{ allQuestionnaireData.length }} 頁]</div>
                            <div class="page_move">
                                <span style="display:inline-block;font-size:20px;height:32px;line-height:32px">頁面操作功能:&emsp;</span>                               
                                <button title="上一頁" id="tableListPageLeft" onclick="prevPage()" type="button" class="button btn_white" style="padding: 5px 9px"><i class="fa fa-chevron-left"></i></button>
                                <button class="button btn_white" onclick="jumpPage(event)">{{ currentPage }}&emsp;<i class="fa fa-caret-down"></i></button>    
                                <button title="下一頁" id="tableListPageRight" onclick="nextPage()" type="button" class="button btn_white" style="padding: 5px 9px"><i class="fa fa-chevron-right"></i></button>
                                <span title="刪除頁面" class="del_page" onclick="deletePage(event,$(this),'top')" :data-page="page.page"><i class="fa fa-trash-o" style="font-size:27px"></i></span>
                                <div class="show_jump_page">
                                    <ul>
                                        <li v-for="num in data[0].Option" :key="num.Val" onclick="jumpToPage(event,$(this))" :data-jump="num.Val">{{ num.Text }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="showQuestions_wrap">

                            <div class="showQuestions_pageDesc_wrap">
                                <div class="showQuestions_pageDesc" v-if="page.questionDataPerPage.pageDesc !== ''">
                                    <div style="font-size: 0">
                                        <textarea rows="3" placeholder="輸入內容..." class="show_page_desc" :data-index="i" disabled="disabled">{{ page.questionDataPerPage.pageDesc }}</textarea>
                                    </div>                             
                                </div>

                                <div class="showQuestions_unit_tools_pageDesc">
                                    <ul class="showQuestions_unit_tools_list">
                                        <li>
                                            <span title="編輯" onclick="editPageDesc(event,'edit',$(this))" :data-index="i">
                                                <i class="fa fa-pencil-square-o"></i>
                                            </span>
                                        </li>
                                        <li>
                                            <span title="刪除" onclick="deleteQuestion(event,'pageDesc',$(this))" :data-index="i">
                                                <i class="fa fa-trash-o"></i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            


                            <div class="clear"></div>


                            <%-- 顯示問題區塊 --%>

                            <div class="question_wrap" v-for="(question,index) in page.questionDataPerPage.pageQuestionData">

                                <%-- 單選題 --%>

                                    <div class="showQuestions_unit" v-if="question.type === 'radio'">
                                        <h1 style="font-size: 18px;margin:0" class="question_title"><span class="show_question_title" v-if="question.required === 'true'" style="display:inline-block;background-color:#EA4335;color: #fff;padding: 2px;border-radius: 2px;">必填</span>&emsp;Q&nbsp;{{ question.questionNum }}&emsp;</h1>
                                        <span style="display: inline-block; padding: 20px;word-wrap: break-word;font-size: 18px">{{ question.title }}</span>
                                        <div class="showQuestions_unit_options" v-for="option in question.options">

                                            <label class="label_radio">
                                                <input type="radio" disabled="disabled" />
                                                <span class="label_icon"></span>
                                                <span class="label_text">{{ option.val }}</span>
                                            </label>
                                            
                                        </div>
                                  
                                        <div class="show_logic_setting" onclick="showLogicSetting($(this),'radio')" :data-logic="index" v-if="question.showLogicCount.length !== 0">
                                            <span style="font-size:35px" title="顯示跳題設定"><i class="fa fa-code-fork"></i></span>
                                            <span class="logic_count">{{ question.showLogicCount.length }}</span>
                                        </div>
                                    
                                        
                                    
                                    </div> 
                          
                                <!-- end of 單選題 -->        


                                <%-- 多選題 --%>

                                    <div class="showQuestions_unit" v-if="question.type === 'checkbox'">
                                        <h1 style="font-size: 18px;margin:0" class="question_title"><span class="show_question_title" v-if="question.required === 'true'" style="display:inline-block;background-color:#EA4335;color: #fff;padding: 2px;border-radius: 2px;">必填</span>&emsp;Q&nbsp;{{ question.questionNum }}&emsp;</h1>
                                        <span style="display: inline-block; padding: 20px;word-wrap: break-word;font-size: 18px">{{ question.title }}</span>
                                        <div class="showQuestions_unit_options" v-for="option in question.options">
                                            <label class="label_checkbox">
                                                <input type="checkbox" disabled="disabled"/>
                                                <span class="label_icon"></span>
                                                <span class="label_text">{{ option.val }}</span>
                                            </label>
                                        </div>

                                       

                                        <div class="show_logic_setting" onclick="showLogicSetting($(this),'checkbox')" :data-logic="index" v-if="question.showLogicCount.length !== 0">
                                            <span style="font-size:35px" title="顯示跳題設定"><i class="fa fa-code-fork"></i></span>
                                            <span class="logic_count">{{ question.showLogicCount.length }}</span>
                                        </div>

                                    </div> 
                            
                                <!-- end of 多選題 --> 
                       

                                <%-- 下拉題 --%>

                                    <div class="showQuestions_unit" v-if="question.type === 'pulldown'">
                                        <h1 style="font-size: 18px;margin:0" class="question_title"><span class="show_question_title" v-if="question.required === 'true'" style="display:inline-block;background-color:#EA4335;color: #fff;padding: 2px;border-radius: 2px;">必填</span>&emsp;Q&nbsp;{{ question.questionNum }}&emsp;</h1>
                                        <span style="display: inline-block; padding: 20px;word-wrap: break-word;font-size: 18px">{{ question.title }}</span>
                                        <div class="showQuestions_unit_options" v-for="option in question.options">
                                            <span style="display:flex;align-items:center">
                                                <i class="fa fa-caret-square-o-down" style="font-size:18px"></i>&nbsp;
                                                <span>{{ option.val }}</span>
                                            </span>                                    
                                        </div>

                                        

                                        <div class="show_logic_setting" onclick="showLogicSetting($(this),'pulldown')" :data-logic="index" v-if="question.showLogicCount.length !== 0">
                                            <span style="font-size:35px" title="顯示跳題設定"><i class="fa fa-code-fork"></i></span>
                                            <span class="logic_count">{{ question.showLogicCount.length }}</span>
                                        </div>

                                    </div>
                            
                                <!-- end of 下拉題 --> 

                        

                                <%-- 文本題 --%>

                                    <div class="showQuestions_unit" v-if="question.type === 'textarea'">
                                        <h1 style="font-size: 18px;margin:0" class="question_title"><span class="show_question_title" v-if="question.required === 'true'" style="display:inline-block;background-color:#EA4335;color: #fff;padding: 2px;border-radius: 2px;">必填</span>&emsp;Q&nbsp;{{ question.questionNum }}&emsp;</h1>
                                        <span style="display: inline-block; padding: 20px;word-wrap: break-word;font-size: 18px">{{ question.title }}</span>
                                        <div class="showQuestions_unit_options">
                                            <div style="font-size: 0">
                                                <textarea rows="5" placeholder="" disabled></textarea>
                                            </div>                                    
                                        </div>

                                        

                                        <div class="show_logic_setting" onclick="showLogicSetting($(this),'textarea')" :data-logic="index" v-if="question.showLogicCount.length !== 0">
                                            <span style="font-size:35px" title="顯示跳題設定"><i class="fa fa-code-fork"></i></span>
                                            <span class="logic_count">{{ question.showLogicCount.length }}</span>
                                        </div>

                                    </div> 
                            
                                <!-- end of 文本題 -->

                                <%-- 題目編輯面板 --%>
                                <div class="showQuestions_unit_tools">
                                    <ul class="showQuestions_unit_tools_list">
                                        <li onclick="jumpQuestion(event, $(this))" :data-index="index" :data-type="question.type">
                                            <span title="跳題設定">
                                                <i class="fa fa-code-fork"></i>
                                            </span>
                                        </li>
                                        <li onclick="editQuestion(event,'edit',$(this))" :data-type="question.type" :data-index="index">
                                            <span title="編輯">
                                                <i class="fa fa-pencil-square-o"></i>
                                            </span>
                                        </li>
                                        <li onclick="copyQuestion(event,$(this))" :data-index="index">
                                            <span title="複製">
                                                <i class="fa fa-clone"></i>
                                            </span>
                                        </li>
                                        <li onclick="deleteQuestion(event,$(this))" :data-index="index" :data-type="question.type">
                                            <span title="刪除">
                                                <i class="fa fa-trash-o"></i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>



                            </div> <%-- end顯示問題區塊 --%>
                    
                        </div>
                </template>

            </div>

        </div>

        


        <%-- 頁面編輯side tools --%>

        <div class="page_side_tools">
            <div class="page_side_tools_prev" onclick="prevPage()">
                <div>
                    <i class="fa fa-chevron-left"></i>
                    <br />
                    上一頁
                </div>
            </div>

            <div class="page_side_tools_next" onclick="nextPage()">
                <div>
                    <i class="fa fa-chevron-right"></i>
                    <br />
                    下一頁
                </div>
            </div>

            <div class="page_side_tools_next" onclick="deletePage(event,'$(this)','side')">
                <div>
                    <i class="fa fa-trash-o"></i>
                    <br />
                    刪除頁面
                </div>
            </div>
        </div>


        <div class="ContentBoxHtml" style="height: 50px; visibility: hidden"></div>

    </div>



</asp:Content>
