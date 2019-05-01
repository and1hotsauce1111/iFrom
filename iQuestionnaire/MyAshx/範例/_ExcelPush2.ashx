<%@ WebHandler Language="C#" Class="_ExcelPush2" %>
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

public class _ExcelPush2 : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        //取得帳號uid
        string tempAccountUid = context.Request.QueryString["AccountUid"];


        //撈取轉出資料
        string sqlstr = @"SELECT * FROM [ExcelTemp] WHERE [AccountUid] = @AccountUid;";
        List<SqlParameter> parm = new List<SqlParameter>
        {
            new SqlParameter("@AccountUid", tempAccountUid) { SqlDbType = SqlDbType.NVarChar },
        };
        SQL_Connection.SQL_ConnectionClass.result rlt_temp = SQL_Connection.SQL_ConnectionClass.SelectToDataTable(sqlstr, parm.ToArray());




        ////建立固定的項目陣列
        //List<string> ItemTitle = new List<string>();
        //ItemTitle.Add("發生日期");
        //ItemTitle.Add("填寫人身分");
        //ItemTitle.Add("填寫人");
        //ItemTitle.Add("聯繫對象");
        //ItemTitle.Add("聯繫方式");
        //ItemTitle.Add("學生樣態與輔導類型");
        //ItemTitle.Add("事件陳述");
        //ItemTitle.Add("分析診斷");
        //ItemTitle.Add("輔導策略");
        //ItemTitle.Add("後續處理");




        //建立檔案
        HSSFWorkbook workbook = new HSSFWorkbook();
        MemoryStream ms = new MemoryStream();
        //新增試算表
        ISheet sheet = workbook.CreateSheet("匯出報表");



        ////建立標題列
        //sheet.CreateRow(0);
        ////動態填入標題
        //for (int i = 0; i < ItemTitle.Count; i++)
        //{
        //    sheet.GetRow(0).CreateCell(i).SetCellValue(ItemTitle[i]);
        //}




        //填入資料
        for (int i = 0; i < rlt_temp.DataTable_data.Rows.Count; i++)
        {
            //建立資料列
            sheet.CreateRow(i);

            for (int j = 0; j < rlt_temp.DataTable_data.Rows[i].ItemArray.Length; j++)
            {
                try
                {
                    sheet.GetRow(i).CreateCell(j).SetCellValue(rlt_temp.DataTable_data.Rows[i][j + 1].ToString());
                }
                catch (Exception ex) { }
            }
        }







        //輸出檔案
        workbook.Write(context.Response.OutputStream);
        //設定標頭 賦予檔案名稱
        context.Response.ContentType = "application/x-excel";
        context.Response.HeaderEncoding = System.Text.Encoding.Default; //加上這行才能避免用ie、edge開啟時，中文檔名無法顯示。
        context.Response.AddHeader("Content-Disposition", "attachment;filename=匯出報表.xls");

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