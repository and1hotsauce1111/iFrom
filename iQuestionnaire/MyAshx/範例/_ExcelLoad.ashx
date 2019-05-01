<%@ WebHandler Language="C#" Class="_ExcelLoad" %>

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
using ExtensionMethods;
using NPOI;
using NPOI.HPSF;
using NPOI.HSSF;
using NPOI.POIFS;
using NPOI.Util;
using System.Text;

public class _ExcelLoad : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        //規範讀取要使用哪一種格式 --- 這邊由 jQuery 自己判斷
        //context.Response.ContentType = "application/json";
        //context.Response.ContentEncoding = System.Text.Encoding.UTF8;

        //執行功能
        result rlt = new result();
        rlt = Main(context);

        //將資料轉成JSON格式匯出
        DataContractJsonSerializer json = new DataContractJsonSerializer(rlt.GetType());
        json.WriteObject(context.Response.OutputStream, rlt);
    }

    //取出JSON值
    public result Main(HttpContext context)
    {
        //資料回傳
        result rlt = new result();
        rlt.success = false;

        //處理取得的JSON資料
        string GetData = string.Empty;

        //處理取得的JSON資料
        GetData = context.Request.Form["JSON_data"];

        ObjectClass DataClass = new ObjectClass();

        if (GetData == "")
        {
            rlt.msg = "錯誤訊息：傳送格式非JSON！";
            return rlt;
        }

        try
        {
            DataClass = JsonConvert.DeserializeObject<ObjectClass>(GetData);
        }
        catch (Exception ex)
        {
            rlt.msg = "錯誤訊息：傳送格式非JSON!";
            return rlt;
        }






        //抽取傳送來的檔案資料
        HttpFileCollection files = context.Request.Files;
        //宣告 HttpFileCollection 轉型 Stream 變數
        HttpPostedFile S_files = null;
        //轉型 資料藏在 InputStream
        S_files = files[0];
        //將 EXCEL 資料導入 DataTable
        Stream temp_excel_dt = S_files.InputStream;
        // null 表示為第一個工作表，也可指定名稱，例："工作表1"
        DataTable excel_dt = NPOIHelper.NPOIHelperClass.StreamExcelToDataTable(temp_excel_dt, null);








        //取值方式 以欄位名稱抓取
        excel_dt.Rows[0]["欄位名稱"].ToString();
        //取值方式 以欄位順序抓取
        excel_dt.Rows[0].ItemArray[0].ToString();








        //回傳資料
        return rlt;
    }

    //回傳資料
    public class result
    {
        public bool success { get; set; }
        public string msg { get; set; }
    }

    //傳入資料
    public class ObjectClass
    {
        public string Path { get; set; }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}