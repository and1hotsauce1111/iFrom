<%@ WebHandler Language="C#" Class="_ExcelPush1" %>
using System;
using System.Web;
using System.Linq;
using Newtonsoft.Json;
using System.Runtime.Serialization.Json;
using System.Web.SessionState;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using System.IO;
using System.Collections;
using System.Runtime.Serialization;
using Newtonsoft.Json.Serialization;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI;
using NPOI.HPSF;
using NPOI.HSSF;
using NPOI.POIFS;
using NPOI.Util;
using System.Threading;
using System.Text;
using ExtensionMethods;

public class _ExcelPush1 : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        //學生uid
        string tempStUid = context.Request.QueryString["StUid"];
        //帳號身份uid
        string tempStatusUid = context.Request.QueryString["StatusUid"];
        //帳號uid
        string tempAccountUid = context.Request.QueryString["AccountUid"];
        //區間參數
        string tempStart = context.Request.QueryString["Start"];
        string tempEnd = context.Request.QueryString["End"];

          



        //查詢出 設定可閱覽其他身分所編輯的B表資料權限
        string sqlstr2 = @"SELECT [SheetBView] FROM [Account_DBStatus] WHERE [Uid] = @StatusUid;";
        List<SqlParameter> parm2 = new List<SqlParameter>
        {
            new SqlParameter("@StatusUid", tempStatusUid) { SqlDbType = SqlDbType.NVarChar },
        };
        SQL_Connection.SQL_ConnectionClass.result rlt_temp2 = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr2, parm2.ToArray());
        //串出查詢文字
        string tempSheetBView = "";
        if (rlt_temp2.DataTable_data.Rows[0]["SheetBView"].ToString() != "")
        {
            tempSheetBView = " OR [DBS].[Uid] IN(" + rlt_temp2.DataTable_data.Rows[0]["SheetBView"].ToString() + ")";
        }



        //查詢出 可直接閱覽指定帳號的填寫資料設定
        string sqlstr3 = @"SELECT [AssignOtherData] FROM [Account_DB] WHERE [Uid] = @AccountUid;";
        List<SqlParameter> parm3 = new List<SqlParameter>
        {
            new SqlParameter("@AccountUid", tempAccountUid) { SqlDbType = SqlDbType.NVarChar },
        };
        SQL_Connection.SQL_ConnectionClass.result rlt_temp3 = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr3, parm3.ToArray());
        //串出查詢文字
        string tempAssignOtherData = "";
        if (rlt_temp3.DataTable_data.Rows[0]["AssignOtherData"].ToString() != "")
        {
            tempAssignOtherData = " OR [DB].[Uid] IN(" + rlt_temp3.DataTable_data.Rows[0]["AssignOtherData"].ToString() + ")";
        }






        //判斷 是否為最高權限 全查或是查自己這個帳號
        if (tempStatusUid == "1")
        {
            tempAccountUid = "%%";
        }



        //撈取輔導資料
        string sqlstr = @"SELECT [P].[系統日期],
                                 [P].[發生日期],
                                 REPLACE([P].[對象], ',', '、') AS [對象],
                                 [P].[方式],
                                 [P].[個案起源],
                                 REPLACE([P].[學生樣態與輔導類型], ',', '、') AS [學生樣態與輔導類型],
                                 [P].[其他對象],
                                 [P].[其他個案起源],
                                 [P].[事件陳述],
                                 [P].[分析與診斷],
                                 REPLACE([P].[輔導策略], ',', '、') AS [輔導策略],
                                 [P].[輔導策略描述],
                                 REPLACE([P].[後續處理], ',', '、') AS [後續處理],
                                 [P].[其他輔導策略],
                                 [P].[其他後續處理],
                                 [P].[後續處理轉介至專業醫療單位],
                                 [P].[填寫人代碼],
                                 [DB].[Name] AS [填寫人],
                                 [DBS].[Uid] AS [填寫人身分代碼],
                                 [DBS].[Name] AS [填寫人身分]
                          FROM
                          (
                              SELECT [V].[StUid],
                                     [V].[OrderBy],
                                     [T].[Title],
                                     [V].[Value]
                              FROM [Setting_ListValue] AS [V]
                                   LEFT JOIN [Setting_ListTitle] AS [T] ON [V].[ListTitleUid] = [T].[Uid]
                              WHERE [T].[Uid] IN(11, 12, 13, 14, 15, 16, 18, 19, 52, 53, 54, 55, 56, 57, 58, 59, 100)
                                   AND [StUid] = @StUid
                          ) AS [VT] PIVOT(MAX([Value]) FOR [Title] IN([系統日期],
                                                                      [發生日期],
                                                                      [對象],
                                                                      [方式],
                                                                      [個案起源],
                                                                      [學生樣態與輔導類型],
                                                                      [其他對象],
                                                                      [其他個案起源],
                                                                      [事件陳述],
                                                                      [分析與診斷],
                                                                      [輔導策略],
                                                                      [輔導策略描述],
                                                                      [後續處理],
                                                                      [其他輔導策略],
                                                                      [其他後續處理],
                                                                      [後續處理轉介至專業醫療單位],
                                                                      [填寫人代碼])) AS [P]
                          LEFT JOIN [Account_DB] AS [DB] ON [P].[填寫人代碼] = [DB].[Uid]
                          LEFT JOIN [Account_DBStatus] AS [DBS] ON [DB].[StatusUid] = [DBS].[Uid]
                          WHERE [P].[填寫人代碼] LIKE @tempAccountUid " + tempSheetBView + tempAssignOtherData + @"
                                AND [P].[發生日期] >= @tempStart AND [P].[發生日期] <= @tempEnd
                          ORDER BY [P].[系統日期] ASC;";
        List<SqlParameter> parm = new List<SqlParameter>
        {
            new SqlParameter("@StUid", tempStUid) { SqlDbType = SqlDbType.NVarChar },
            new SqlParameter("@tempAccountUid", tempAccountUid) { SqlDbType = SqlDbType.NVarChar },
            new SqlParameter("@tempStart", tempStart) { SqlDbType = SqlDbType.NVarChar },
            new SqlParameter("@tempEnd", tempEnd) { SqlDbType = SqlDbType.NVarChar },
        };
        SQL_Connection.SQL_ConnectionClass.result rlt_temp = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr, parm.ToArray());




        //建立固定的項目陣列
        List<string> ItemTitle = new List<string>();
        ItemTitle.Add("發生日期");
        ItemTitle.Add("填寫人身分");
        ItemTitle.Add("填寫人");
        ItemTitle.Add("聯繫對象");
        ItemTitle.Add("聯繫方式");
        ItemTitle.Add("學生樣態與輔導類型");
        ItemTitle.Add("事件陳述");
        ItemTitle.Add("分析診斷");
        ItemTitle.Add("輔導策略");
        ItemTitle.Add("後續處理");




        //建立檔案
        HSSFWorkbook workbook = new HSSFWorkbook();
        MemoryStream ms = new MemoryStream();
        //新增試算表
        ISheet sheet = workbook.CreateSheet("輔導紀錄歷史一覽表");



        //建立標題列
        sheet.CreateRow(0);
        //動態填入標題
        for (int i = 0; i < ItemTitle.Count; i++)
        {
            sheet.GetRow(0).CreateCell(i).SetCellValue(ItemTitle[i]);
        }




        //開始填入資料
        for (int i = 0; i < rlt_temp.DataTable_data.Rows.Count; i++)
        {
            int row = i + 1;

            //將 發生日期 轉民國年
            string dateROC = "";
            if (rlt_temp.DataTable_data.Rows[i]["發生日期"].ToString() != "")
            {
                string[] strArray = rlt_temp.DataTable_data.Rows[i]["發生日期"].ToString().Split(' ');
                string[] strArray2 = strArray[0].Split('-');
                dateROC = (int.Parse(strArray2[0]) - 1911) + "/" + strArray2[1] + "/" + strArray2[2];
            }

            //建立資料列
            sheet.CreateRow(row);

            //寫入固定的基本資料
            sheet.GetRow(row).CreateCell(0).SetCellValue(dateROC);
            sheet.GetRow(row).CreateCell(1).SetCellValue(rlt_temp.DataTable_data.Rows[i]["填寫人身分"].ToString());
            sheet.GetRow(row).CreateCell(2).SetCellValue(rlt_temp.DataTable_data.Rows[i]["填寫人"].ToString());

            //對象
            string[] tempArray3 = rlt_temp.DataTable_data.Rows[i]["對象"].ToString().Split('、');
            for (int x = 0; x < tempArray3.Length; x++)
            {
                if (tempArray3[x] == "其他" && rlt_temp.DataTable_data.Rows[i]["其他對象"].ToString() != "")
                {
                    tempArray3[x] = tempArray3[x] + "(" + rlt_temp.DataTable_data.Rows[i]["其他對象"].ToString() + ")";
                }
            }
            string tempString3 = string.Join("、", tempArray3);
            sheet.GetRow(row).CreateCell(3).SetCellValue(tempString3);

            sheet.GetRow(row).CreateCell(4).SetCellValue(rlt_temp.DataTable_data.Rows[i]["方式"].ToString());
            sheet.GetRow(row).CreateCell(5).SetCellValue(rlt_temp.DataTable_data.Rows[i]["學生樣態與輔導類型"].ToString());
            sheet.GetRow(row).CreateCell(6).SetCellValue(rlt_temp.DataTable_data.Rows[i]["事件陳述"].ToString());
            sheet.GetRow(row).CreateCell(7).SetCellValue(rlt_temp.DataTable_data.Rows[i]["分析與診斷"].ToString());

            //輔導策略
            string[] tempArray = rlt_temp.DataTable_data.Rows[i]["輔導策略"].ToString().Split('、');
            for (int x = 0; x < tempArray.Length; x++)
            {
                if (tempArray[x] == "其他" && rlt_temp.DataTable_data.Rows[i]["其他輔導策略"].ToString() != "")
                {
                    tempArray[x] = tempArray[x] + "(" + rlt_temp.DataTable_data.Rows[i]["其他輔導策略"].ToString() + ")";
                }
            }
            string tempString = string.Join("、", tempArray);
            sheet.GetRow(row).CreateCell(8).SetCellValue(tempString);

            //後續處理
            string[] tempArray2 = rlt_temp.DataTable_data.Rows[i]["後續處理"].ToString().Split('、');
            for (int x = 0; x < tempArray2.Length; x++)
            {
                if (tempArray2[x] == "轉介至專業醫療單位" && rlt_temp.DataTable_data.Rows[i]["後續處理轉介至專業醫療單位"].ToString() != "")
                {
                    tempArray2[x] = tempArray2[x] + "(" + rlt_temp.DataTable_data.Rows[i]["後續處理轉介至專業醫療單位"].ToString() + ")";
                }
                else if (tempArray2[x] == "其他" && rlt_temp.DataTable_data.Rows[i]["其他後續處理"].ToString() != "")
                {
                    tempArray2[x] = tempArray2[x] + "(" + rlt_temp.DataTable_data.Rows[i]["其他後續處理"].ToString() + ")";
                }
            }
            string tempString2 = string.Join("、", tempArray2);
            sheet.GetRow(row).CreateCell(9).SetCellValue(tempString2);


            //sheet.GetRow(row).CreateCell(10).SetCellValue(rlt_temp.DataTable_data.Rows[i]["後續處理"].ToString());


            //if (rlt_temp.DataTable_data.Rows[i]["其他輔導策略"].ToString() != "")
            //{
            //    sheet.GetRow(row).CreateCell(8).SetCellValue(rlt_temp.DataTable_data.Rows[i]["輔導策略"].ToString() + "(" + rlt_temp.DataTable_data.Rows[i]["其他輔導策略"].ToString() + ")");
            //}
            //else
            //{
            //    sheet.GetRow(row).CreateCell(8).SetCellValue(rlt_temp.DataTable_data.Rows[i]["輔導策略"].ToString());
            //}
            //
            //if (rlt_temp.DataTable_data.Rows[i]["後續處理轉介至專業醫療單位"].ToString() != "")
            //{
            //    sheet.GetRow(row).CreateCell(9).SetCellValue(rlt_temp.DataTable_data.Rows[i]["後續處理"].ToString() + "(" + rlt_temp.DataTable_data.Rows[i]["後續處理轉介至專業醫療單位"].ToString() + ")");
            //}
            //else if (rlt_temp.DataTable_data.Rows[i]["其他後續處理"].ToString() != "")
            //{
            //    sheet.GetRow(row).CreateCell(9).SetCellValue(rlt_temp.DataTable_data.Rows[i]["後續處理"].ToString() + "(" + rlt_temp.DataTable_data.Rows[i]["其他後續處理"].ToString() + ")");
            //}
            //else
            //{
            //    sheet.GetRow(row).CreateCell(9).SetCellValue(rlt_temp.DataTable_data.Rows[i]["後續處理"].ToString());
            //}

        }


        //輸出檔案
        workbook.Write(context.Response.OutputStream);
        //設定標頭 賦予檔案名稱
        context.Response.ContentType = "application/x-excel";
        context.Response.HeaderEncoding = System.Text.Encoding.Default; //加上這行才能避免用ie、edge開啟時，中文檔名無法顯示。
        context.Response.AddHeader("Content-Disposition", "attachment;filename=輔導紀錄歷史一覽表.xls");

        //釋放資源
        workbook = null;
        ms.Close();
        ms.Dispose();

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}