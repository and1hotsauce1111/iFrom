<%@ Page Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/MasterTemplate/MasterPage_Basic.master" AutoEventWireup="true" CodeFile="Answer.aspx.cs" Inherits="_Default" %>

<asp:Content ID="MsBady" ContentPlaceHolderID="PlaceHolderHead2" runat="Server">

    <!--creat專用css跟js-->
    <script type="text/javascript" src="<%=this.ResolveUrl("~/MyJs/Answer.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <script type="text/javascript" src="<%=this.ResolveUrl("~/useJs/alert2.js") + "?v=" + DateTime.Now.ToFileTimeUtc() %>"></script>
    <link href="<%=ResolveClientUrl("~/MyCss/Answer.css") %>" rel="stylesheet" />

    <style type="text/css">
    </style>
    <script type="text/javascript">
</script>

</asp:Content>

<asp:Content ID="Bady1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">

    <div id="app">

        <div class="extra_blank"></div>

        <div class="ContentBoxHtml">

            <div class="question_title">
                <h3>{{ questionnaireTitle }}</h3>
                <p>{{ questionnaireDesc }}</p>
                <span style="display: inline-block; width: 100%; height: 2px; background-color: #3388FF"></span>
            </div>

            <%-- 依每頁問題渲染 --%>
            <template v-for="page in allQuestionnaireData">

                <div class="question_wrap" v-if="page.page == nowPage">

                    <p class="page_desc" v-if="page.questionDataPerPage.pageDesc">{{ page.questionDataPerPage.pageDesc }}</p>

                    <div class="question_type" v-for="question in page.questionDataPerPage.pageQuestionData">

                        <div class="question_title_radio" v-if="question.type === 'radio'">
                            <h4>{{ question.questionNum }}.&emsp;{{ question.title }}&nbsp;<span v-if="question.required == 'true'" style="color: #FF6A00">(必填)</span></h4>
                            <div class="question_content_radio" v-for="option in question.options">
                                <label class="label_radio">
                                    <input type="radio" :value="option.id" v-model="question.isSelect"/>
                                    <span class="label_icon"></span>
                                    <span class="label_text">{{ option.val }}</span>
                                </label>
                            </div>
                        </div>

                        <div class="question_title_checkbox" v-if="question.type === 'checkbox'">
                            <h4>{{ question.questionNum }}.&emsp;{{ question.title }}&nbsp;<span v-if="question.required == 'true'" style ="color: #FF6A00">(必填)</span></h4>
                            <div class="question_content_checkbox" v-for="option in question.options">
                                <label class="label_checkbox">
                                    <input type="checkbox" :value="option.id" v-model="question.isSelect"/>
                                    <span class="label_icon"></span>
                                    <span class="label_text">{{ option.val }}</span>
                                </label>
                            </div>

                        </div>

                        <div class="question_title_pulldown" v-if="question.type === 'pulldown'">
                            <h4>{{ question.questionNum }}.&emsp;{{ question.title }}&nbsp;<span v-if="question.required == 'true'" style="color: #FF6A00">(必填)</span></h4>
                            <div class="question_content_pulldown">
                                <v-dropdown :id="question.id" :setting="dropSetting" :data="dropData[question.id]" v-model="question.isSelect"><v-dropdown>
                            </div>
                        </div>

                        <div class="question_title_textarea" v-if="question.type === 'textarea'">
                            <h4>{{ question.questionNum }}.&emsp;{{ question.title }}&nbsp;<span v-if="question.required == 'true'" style="color: #FF6A00">(必填)</span></h4>
                            <div class="question_content_textarea">
                                <div style="font-size: 0">
                                    <textarea rows="3" placeholder="輸入內容..."></textarea>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="change_page">
                        <button type="button" class="button btn_blue" style="margin-right: 10px" v-if="nowPage !== 1" @click="prevPage">上一頁</button>
                        <button type="button" class="button btn_blue" @click="nextPage" v-if="nowPage !== allQuestionnaireData.length">下一頁</button>
                        <button type="button" class="button btn_miku" v-if="nowPage == allQuestionnaireData.length">提交填答</button>
                    </div>

                </div>

            </template>


        </div>

        <div class="extra_blank"></div>


    </div>




</asp:Content>
