<%@ WebHandler Language="C#" Class="_WordPush" %>
using System;
using System.Web;
using System.Web.SessionState;
using System.Collections.Generic;
using System.IO;
using System.Data.SqlClient;
using System.Data;
using Novacode;
using PublicFunction;


public class _WordPush : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        //帳號uid
        string accountUid = context.Request.QueryString["a"];
        //評鑑類型uid
        string sheetUid = context.Request.QueryString["s"];
        //目前網址 處理格式後為：http://127.0.0.1/iSchoolEvaluation/
        string pathUri = context.Request.Url.ToString().Replace("MyAshx/Dp_DataExport_WordPush.ashx?a=" + accountUid + "&s=" + sheetUid, "");


        //讀取範本檔案 (*.docx)
        DocX wordDocument = DocX.Load(context.Server.MapPath("~/Template/ExportTemplate.docx"));

        //讀取評鑑項目檔案
        DocX wdTitle = DocX.Load(context.Server.MapPath("~/Template/ExportTemplate_Title.docx"));
        //取出段落範本
        Novacode.Paragraph ph = wdTitle.Paragraphs[0];

        //讀取表格檔案
        DocX wdTable = DocX.Load(context.Server.MapPath("~/Template/ExportTemplate_Table.docx"));
        //取出表格範本
        Novacode.Table dt = wdTable.Tables[0];

        //讀取自我陳述
        DocX wdText = DocX.Load(context.Server.MapPath("~/Template/ExportTemplate_Text.docx"));
        //取出層級範本
        Novacode.Paragraph lv1 = wdText.Paragraphs[0];
        Novacode.Paragraph lv2 = wdText.Paragraphs[1];
        Novacode.Paragraph lv3 = wdText.Paragraphs[2];
        Novacode.Paragraph lv1c = wdText.Paragraphs[3];
        Novacode.Paragraph lv2c = wdText.Paragraphs[4];
        Novacode.Paragraph lv3c = wdText.Paragraphs[5];
        Novacode.Paragraph pic1 = wdText.Paragraphs[6];
        Novacode.Paragraph pic2 = wdText.Paragraphs[7];
        Novacode.Paragraph pic3 = wdText.Paragraphs[8];
        Novacode.Paragraph pic1c = wdText.Paragraphs[9];
        Novacode.Paragraph pic2c = wdText.Paragraphs[10];
        Novacode.Paragraph pic3c = wdText.Paragraphs[11];

        //讀取自評分數
        DocX wdScore = DocX.Load(context.Server.MapPath("~/Template/ExportTemplate_Score.docx"));
        //取出分數範本
        Novacode.Paragraph scT = wdScore.Paragraphs[0];
        Novacode.Paragraph sc00 = wdScore.Paragraphs[1];
        Novacode.Paragraph sc10 = wdScore.Paragraphs[2];
        Novacode.Paragraph sc15 = wdScore.Paragraphs[3];
        Novacode.Paragraph sc20 = wdScore.Paragraphs[4];
        Novacode.Paragraph sc25 = wdScore.Paragraphs[5];
        Novacode.Paragraph sc30 = wdScore.Paragraphs[6];
        Novacode.Paragraph sc35 = wdScore.Paragraphs[7];
        Novacode.Paragraph sc40 = wdScore.Paragraphs[8];
        Novacode.Paragraph sc45 = wdScore.Paragraphs[9];
        Novacode.Paragraph sc50 = wdScore.Paragraphs[10];



        //宣告表格計數器
        int tableCount = 0;



        //查詢出評鑑類型名稱
        string sqlstr1 = @"SELECT [名稱] FROM [評鑑類型] WHERE [uid] = @sheetUid;";
        List<SqlParameter> parm1 = new List<SqlParameter>
        {
            new SqlParameter("@sheetUid", sheetUid) { SqlDbType = SqlDbType.NVarChar },
        };
        SQL_Connection.SQL_ConnectionClass.result rlt_temp1 = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr1, parm1.ToArray());
        if (rlt_temp1.success == true)
        {
            //取代標題
            wordDocument.Paragraphs[1].ReplaceText("[$評鑑類型$]",
                                                   rlt_temp1.DataTable_data.Rows[0]["名稱"].ToString(),
                                                   false, System.Text.RegularExpressions.RegexOptions.None);
        }



        //查詢所屬評鑑項目
        string sqlstr2 = @"SELECT * FROM [評鑑項目] WHERE [評鑑類型uid] = @sheetUid ORDER BY [排序];";
        List<SqlParameter> parm2 = new List<SqlParameter>
        {
            new SqlParameter("@sheetUid", sheetUid) { SqlDbType = SqlDbType.NVarChar },
        };
        SQL_Connection.SQL_ConnectionClass.result rlt_temp2 = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr2, parm2.ToArray());
        if (rlt_temp2.success == true)
        {
            System.Data.DataTable dtTable = rlt_temp2.DataTable_data;

            for (int t = 0; t < dtTable.Rows.Count; t++)
            {
                //插入項目名稱
                wordDocument.InsertParagraph(ph)
                        .ReplaceText("[$評鑑項目$]",
                                     dtTable.Rows[t]["排序文字"].ToString() + dtTable.Rows[t]["名稱"].ToString(),
                                     false, System.Text.RegularExpressions.RegexOptions.None);



                //查詢所屬評鑑指標
                string sqlstr3 = @"SELECT * FROM [評鑑指標] WHERE [評鑑項目uid] = @tableUid ORDER BY [排序];";
                List<SqlParameter> parm3 = new List<SqlParameter>
                {
                    new SqlParameter("@tableUid", dtTable.Rows[t]["uid"].ToString()) { SqlDbType = SqlDbType.NVarChar },
                };
                SQL_Connection.SQL_ConnectionClass.result rlt_temp3 = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr3, parm3.ToArray());
                if (rlt_temp3.success == true)
                {
                    System.Data.DataTable dtCell = rlt_temp3.DataTable_data;

                    for (int c = 0; c < dtCell.Rows.Count; c++)
                    {
                        //插入表格
                        wordDocument.InsertTable(dt);
                        //填入評鑑指標名稱
                        wordDocument.Tables[tableCount].Rows[1].Cells[0]
                                .ReplaceText("[$評鑑指標$]",
                                             dtCell.Rows[c]["排序文字"].ToString() + dtCell.Rows[c]["名稱"].ToString(),
                                             false, System.Text.RegularExpressions.RegexOptions.None);
                        //填入指標說明
                        wordDocument.Tables[tableCount].Rows[1].Cells[1]
                                .ReplaceText("[$指標說明$]",
                                             dtCell.Rows[c]["指標說明"].ToString(),
                                             false, System.Text.RegularExpressions.RegexOptions.None);


                        //取得段落資料
                        string sqlstr4 = @"SELECT * FROM [轉出暫存資料表]
                                           WHERE [帳號uid] = @accountUid AND [評鑑指標uid] = @cellUid
                                           ORDER BY [整體排序];";
                        List<SqlParameter> parm4 = new List<SqlParameter>
                        {
                            new SqlParameter("@accountUid", accountUid) { SqlDbType = SqlDbType.NVarChar },
                            new SqlParameter("@cellUid", dtCell.Rows[c]["uid"].ToString()) { SqlDbType = SqlDbType.NVarChar },
                        };
                        SQL_Connection.SQL_ConnectionClass.result rlt_temp4 = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr4, parm4.ToArray());
                        if (rlt_temp4.success == true)
                        {
                            System.Data.DataTable pData = rlt_temp4.DataTable_data;


                            //宣告標籤屬性
                            string pType = "";


                            for (int p = 0; p < pData.Rows.Count; p++)
                            {
                                //標籤屬性判讀 =========================================================================== text
                                if (pData.Rows[p]["標籤屬性"].ToString() == "text")
                                {
                                    //階層判讀
                                    if (pData.Rows[p]["階層"].ToString() == "1")
                                    {
                                        //段落排序判讀
                                        if (pData.Rows[p]["段落排序"].ToString() == "1")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv1)
                                                    .ReplaceText("[$自我陳述LV1$]",
                                                                 pData.Rows[p]["排序文字"].ToString() + pData.Rows[p]["內容"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv1c)
                                                    .ReplaceText("[$自我陳述LV1內容$]", pData.Rows[p]["內容"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                    }
                                    else if (pData.Rows[p]["階層"].ToString() == "2")
                                    {
                                        //段落排序判讀
                                        if (pData.Rows[p]["段落排序"].ToString() == "1")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv2)
                                                    .ReplaceText("[$自我陳述LV2$]",
                                                                 pData.Rows[p]["排序文字"].ToString() + pData.Rows[p]["內容"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv2c)
                                                    .ReplaceText("[$自我陳述LV2內容$]", pData.Rows[p]["內容"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                    }
                                    else if (pData.Rows[p]["階層"].ToString() == "3")
                                    {
                                        //段落排序判讀
                                        if (pData.Rows[p]["段落排序"].ToString() == "1")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv3)
                                                    .ReplaceText("[$自我陳述LV3$]",
                                                                 pData.Rows[p]["排序文字"].ToString() + pData.Rows[p]["內容"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv3c)
                                                    .ReplaceText("[$自我陳述LV3內容$]", pData.Rows[p]["內容"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                    }
                                    //紀錄標籤屬性
                                    pType = "text";
                                }
                                //標籤屬性判讀 =========================================================================== link、files
                                else if (pData.Rows[p]["標籤屬性"].ToString() == "link" ||
                                         pData.Rows[p]["標籤屬性"].ToString() == "files")
                                {
                                    //判斷是否第一個段落就是連結
                                    if (pData.Rows[p]["段落排序"].ToString() == "1")
                                    {
                                        //階層判讀
                                        if (pData.Rows[p]["階層"].ToString() == "1")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv1)
                                                    .ReplaceText("[$自我陳述LV1$]", pData.Rows[p]["排序文字"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else if (pData.Rows[p]["階層"].ToString() == "2")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv2)
                                                .ReplaceText("[$自我陳述LV2$]", pData.Rows[p]["排序文字"].ToString(),
                                                             false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else if (pData.Rows[p]["階層"].ToString() == "3")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv3)
                                                .ReplaceText("[$自我陳述LV3$]", pData.Rows[p]["排序文字"].ToString(),
                                                             false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                    }
                                    else
                                    {
                                        //階層判讀
                                        if (pData.Rows[p]["階層"].ToString() == "1")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv1c)
                                                    .ReplaceText("[$自我陳述LV1內容$]", "",
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else if (pData.Rows[p]["階層"].ToString() == "2")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv2c)
                                                .ReplaceText("[$自我陳述LV2內容$]", "",
                                                             false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                        else if (pData.Rows[p]["階層"].ToString() == "3")
                                        {
                                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(lv3c)
                                                .ReplaceText("[$自我陳述LV3內容$]", "",
                                                             false, System.Text.RegularExpressions.RegexOptions.None);
                                        }
                                    }


                                    //建立超連結
                                    string tempName = "";
                                    string tempUri = "";


                                    if (pData.Rows[p]["標籤屬性"].ToString() == "link")
                                    {
                                        tempName = pData.Rows[p]["內容"].ToString();
                                        tempUri = pData.Rows[p]["參數"].ToString();
                                    }
                                    else if (pData.Rows[p]["標籤屬性"].ToString() == "files")
                                    {
                                        tempName = pData.Rows[p]["參數"].ToString();
                                        tempUri = pathUri + "FileUpload/EvaluationFiles/" +
                                                  dtCell.Rows[c]["uid"].ToString() + "/Files/" + pData.Rows[p]["參數"].ToString();
                                    }


                                    //取得超連結範本
                                    Novacode.Hyperlink hLink = wdText.Hyperlinks[0];
                                    //替換網址
                                    hLink.Uri = new Uri(tempUri);


                                    //找出最後一筆段落的 index
                                    int pCount = wordDocument.Tables[tableCount].Rows[2].Cells[0].Paragraphs.Count - 1;
                                    //插入連結 並替換文字
                                    wordDocument.Tables[tableCount].Rows[2].Cells[0].Paragraphs[pCount].AppendHyperlink(hLink)
                                            .ReplaceText("[$超連結$]", tempName,
                                                         false, System.Text.RegularExpressions.RegexOptions.None);


                                    //紀錄標籤屬性
                                    pType = "link";
                                }
                                //標籤屬性判讀 =========================================================================== image、photo、word
                                else if (pData.Rows[p]["標籤屬性"].ToString() == "image" ||
                                         pData.Rows[p]["標籤屬性"].ToString() == "photo" ||
                                         pData.Rows[p]["標籤屬性"].ToString() == "word")
                                {
                                    //設定路徑
                                    string strPath = "";


                                    //判斷標籤屬性
                                    if (pData.Rows[p]["標籤屬性"].ToString() == "image")
                                    {
                                        //取得網址 以及設定存放路徑
                                        Uri uri = new Uri(pData.Rows[p]["參數"].ToString());
                                        string saveDir = "~/FileUpload/temp/";
                                        string fileName = accountUid + "_tempImage.png";
                                        string savePath = HttpContext.Current.Server.MapPath(saveDir + fileName);

                                        //判斷資料夾是否存在
                                        if (!Directory.Exists(HttpContext.Current.Server.MapPath(saveDir)))
                                        {
                                            //若不存在 則新增資料夾
                                            Directory.CreateDirectory(HttpContext.Current.Server.MapPath(saveDir));
                                        }

                                        //嘗試存取圖片
                                        try
                                        {
                                            System.Net.WebRequest request = System.Net.WebRequest.Create(uri);
                                            System.Net.WebResponse response = request.GetResponse();
                                            System.IO.Stream stream = response.GetResponseStream();
                                            System.Drawing.Image img = System.Drawing.Image.FromStream(stream);
                                            //儲存到暫存資料夾
                                            img.Save(savePath);
                                        }
                                        catch (Exception ex)
                                        {
                                            //若無法存取就顯示錯誤圖片
                                            savePath = HttpContext.Current.Server.MapPath("~/images/document_error.png");
                                        }

                                        //套用路徑
                                        strPath = savePath;
                                    }
                                    else if (pData.Rows[p]["標籤屬性"].ToString() == "photo")
                                    {
                                        strPath = HttpContext.Current.Server.MapPath("~/FileUpload/EvaluationFiles/" + dtCell.Rows[c]["uid"].ToString() + "/Photo/" + pData.Rows[p]["參數"].ToString());
                                    }
                                    else if (pData.Rows[p]["標籤屬性"].ToString() == "word")
                                    {
                                        strPath = HttpContext.Current.Server.MapPath("~/FileUpload/EvaluationFiles/" + dtCell.Rows[c]["uid"].ToString() + "/Word/Photo/" + Path.ChangeExtension(pData.Rows[p]["參數"].ToString(), ".png"));
                                    }


                                    //讀取圖片
                                    Novacode.Image image = wordDocument.AddImage(strPath);
                                    Novacode.Picture picture = image.CreatePicture();


                                    //修改圖片大小
                                    int tempWidth = HeightZoomWidth(picture.Height, picture.Width, 160);
                                    picture.Height = 160;
                                    //如果太寬就強制縮小
                                    if (tempWidth > 590)
                                    {
                                        picture.Width = 590;
                                    }
                                    else
                                    {
                                        picture.Width = tempWidth;
                                    }


                                    //判斷是否第一個段落就是圖片
                                    if (pData.Rows[p]["段落排序"].ToString() == "1")
                                    {
                                        //先清空標籤屬性才能插入段落
                                        pType = "";
                                        //插入段落 (如果前一筆資料相同就不額外插入段落)
                                        if (pType != "image")
                                        {
                                            //階層判讀
                                            if (pData.Rows[p]["階層"].ToString() == "1")
                                            {
                                                wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(pic1)
                                                        .ReplaceText("[$插入圖片LV1$]", pData.Rows[p]["排序文字"].ToString(),
                                                                     false, System.Text.RegularExpressions.RegexOptions.None);
                                            }
                                            else if (pData.Rows[p]["階層"].ToString() == "2")
                                            {
                                                wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(pic2)
                                                    .ReplaceText("[$插入圖片LV2$]", pData.Rows[p]["排序文字"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                            }
                                            else if (pData.Rows[p]["階層"].ToString() == "3")
                                            {
                                                wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(pic3)
                                                    .ReplaceText("[$插入圖片LV3$]", pData.Rows[p]["排序文字"].ToString(),
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                            }
                                            //紀錄標籤屬性
                                            pType = "image";
                                        }
                                    }
                                    else
                                    {
                                        //插入段落 (如果前一筆資料相同就不額外插入段落)
                                        if (pType != "image")
                                        {
                                            //階層判讀
                                            if (pData.Rows[p]["階層"].ToString() == "1")
                                            {
                                                wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(pic1c)
                                                        .ReplaceText("[$插入圖片LV1內容$]", "",
                                                                     false, System.Text.RegularExpressions.RegexOptions.None);
                                            }
                                            else if (pData.Rows[p]["階層"].ToString() == "2")
                                            {
                                                wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(pic2c)
                                                    .ReplaceText("[$插入圖片LV2內容$]", "",
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                            }
                                            else if (pData.Rows[p]["階層"].ToString() == "3")
                                            {
                                                wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(pic3c)
                                                    .ReplaceText("[$插入圖片LV3內容$]", "",
                                                                 false, System.Text.RegularExpressions.RegexOptions.None);
                                            }
                                            //紀錄標籤屬性
                                            pType = "image";
                                        }
                                    }


                                    //找出最後一筆段落的 index
                                    int pCount = wordDocument.Tables[tableCount].Rows[2].Cells[0].Paragraphs.Count - 1;
                                    //插入圖片
                                    wordDocument.Tables[tableCount].Rows[2].Cells[0].Paragraphs[pCount].AppendPicture(picture);
                                    //插入空格
                                    wordDocument.Tables[tableCount].Rows[2].Cells[0].Paragraphs[pCount].InsertText(" ");
                                }
                            }
                        }



                        //清除暫存圖片
                        FileTools.FileDelete("~/FileUpload/temp/" + accountUid + "_tempImage.png");



                        //插入換行
                        wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph("");
                        //填入自評分數
                        wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(scT);
                        if (dtCell.Rows[c]["自評分數"].ToString() == "0.0")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc00);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "1.0")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc10);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "1.5")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc15);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "2.0")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc20);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "2.5")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc25);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "3.0")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc30);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "3.5")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc35);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "4.0")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc40);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "4.5")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc45);
                        }
                        else if (dtCell.Rows[c]["自評分數"].ToString() == "5.0")
                        {
                            wordDocument.Tables[tableCount].Rows[2].Cells[0].InsertParagraph(sc50);
                        }



                        //插入換行
                        wordDocument.InsertParagraph("");
                        //增加計數器
                        tableCount++;
                    }
                }
            }
        }



        ////宣告字體
        //System.Drawing.FontFamily fontTW = new System.Drawing.FontFamily("微軟正黑體");
        //System.Drawing.FontFamily fontEN = new System.Drawing.FontFamily("Times New Roman");
        ////插入大標題
        //wordDocument.InsertParagraph("107年上半年度高級中等學校評鑑表").FontSize(26).Font(fontTW).Alignment = Alignment.center;
        //wordDocument.InsertParagraph("校務評鑑部分").FontSize(26).Font(fontTW).Alignment = Alignment.center;
        ////移除最一開始的段落
        //wordDocument.RemoveParagraphAt(0);




        //將檔案轉化為記憶體
        MemoryStream ms = new MemoryStream();
        wordDocument.SaveAs(ms);
        wordDocument.Dispose();
        wdTitle.Dispose();
        wdTable.Dispose();
        wdText.Dispose();
        wdScore.Dispose();



        //輸出直接讓使用者下載
        //先清空暫存
        context.Response.Clear();
        context.Response.ClearContent();
        context.Response.ClearHeaders();
        //設定表頭
        context.Response.ContentType = "application/octet-stream";
        context.Response.HeaderEncoding = System.Text.Encoding.Default; //加上這行才能避免用ie、edge開啟時，中文檔名無法顯示。
        context.Response.AddHeader("content-disposition", "attachment;filename=" + rlt_temp1.DataTable_data.Rows[0]["名稱"].ToString() + ".docx");
        //輸出
        context.Response.OutputStream.Write(ms.ToArray(), 0, ms.ToArray().Length);
        context.Response.End();
    }

    /// <summary>轉出時縮放圖片使用函數---以圖高為主</summary>
    /// <param name="Height">圖片高度</param>
    /// <param name="Width">圖片寬度</param>
    /// <param name="Reference">參考值</param>
    /// <returns>圖寬 (格式int)</returns>
    public static int HeightZoomWidth(int Height, int Width, int Reference)
    {
        int fixHeight = Reference;
        int fixWidth = Convert.ToInt32((Convert.ToDouble(fixHeight) / Convert.ToDouble(Height)) * Convert.ToDouble(Width));
        return fixWidth;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}