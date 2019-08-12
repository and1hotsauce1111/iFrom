<%@ WebHandler Language="C#" Class="testAPI" %>

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
using System.Drawing;
using System.Drawing.Imaging;
using PublicFunction;
using SQL_Connection;

public class testAPI : IHttpHandler, IRequiresSessionState
{
    //宣告鎖住變數
    public static object lockCreatFiles = new object();

    public void ProcessRequest(HttpContext context)
    {
        //規範讀取要使用哪一種格式 --- 這邊由 jQuery 自己判斷
        //context.Response.ContentType = "application/json";
        //context.Response.ContentEncoding = System.Text.Encoding.UTF8;

        //執行功能
        result rlt = new result();
        rlt = Main(context);

        //將資料轉成JSON格式匯出
        HttpContext.Current.Response.Write(JsonConvert.SerializeObject(rlt, Newtonsoft.Json.Formatting.None));
        //DataContractJsonSerializer json = new DataContractJsonSerializer(rlt.GetType());
        //json.WriteObject(context.Response.OutputStream, rlt);
    }

    //取出JSON值
    public result Main(HttpContext context)
    {
        //資料回傳
        result rlt = new result();
        rlt.success = false;
        //抽取傳送來的檔案資料
        HttpFileCollection files = context.Request.Files;
        //檔案資訊儲存陣列
        rlt.Files = new List<object>();

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




        //取得 Web.config 的參數
        //ConfigurationManager.AppSettings["是否開啟科系評鑑功能"] == "true"





        //靜態方式寫入SQL (單筆交易時使用)
        if (DataClass.Type == "GetData")
        {
            string sqlstr1 = @"
            SELECT * FROM [測試];
            --SELECT * FROM [測試] WHERE [uid] = @uid;";
            List<SqlParameter> parm1 = new List<SqlParameter>
            {
                new SqlParameter("@uid", DataClass.目標uid ) { SqlDbType = SqlDbType.NVarChar }
            };
            SQL_ConnectionClass.result rlt_temp1 = SQL_ConnectionClass.SelectToDataSet(sqlstr1, parm1.ToArray());
            if (rlt_temp1.success == true)
            {
                DataSet ds = rlt_temp1.DataSet_data;
                if (ds != null && ds.Tables.Count == 1)
                {
                    rlt.全取 = ds.Tables[0];
                    //rlt.只要小明 = ds.Tables[1];
                }
            }
            ////使用 SelectToDataTable
            //if (rlt_temp1.success == true)
            //{
            //    rlt.Data = rlt_temp1.DataTable_data;
            //}

            //rlt.msg = rlt_temp1.msg;

        }


        if (DataClass.Type == "CreateData")
        {
            string sqlstr1 = @"INSERT INTO [測試] ([名稱],[備註]) VALUES (@名稱,@備註);";
            List<SqlParameter> parm1 = new List<SqlParameter>
            {
                new SqlParameter("@名稱", DataClass.名稱 ) { SqlDbType = SqlDbType.NVarChar },
                new SqlParameter("@備註", DataClass.備註 ) { SqlDbType = SqlDbType.NVarChar },
            };
            SQL_ConnectionClass.result rlt_temp1 = SQL_ConnectionClass.RunInsertSQL(sqlstr1, parm1.ToArray());
            rlt.key = rlt_temp1.key;
        }


        if (DataClass.Type == "DeleteData")
        {
            string sqlstr1 = @"DELETE FROM [測試] WHERE [uid] = @目標uid;";
            List<SqlParameter> parm1 = new List<SqlParameter>
            {
                new SqlParameter("@目標uid", DataClass.目標uid ) { SqlDbType = SqlDbType.NVarChar },
            };
            SQL_ConnectionClass.result rlt_temp1 = SQL_ConnectionClass.RunSQL(sqlstr1, parm1.ToArray());
        }

        if (DataClass.Type == "UpdateData")
        {
            string sqlstr1 = @"UPDATE [測試] SET [名稱] = @名稱, [備註] = @備註 WHERE [uid] = @目標uid;";
            List<SqlParameter> parm1 = new List<SqlParameter>
            {
                new SqlParameter("@目標uid", DataClass.目標uid ) { SqlDbType = SqlDbType.NVarChar },
                new SqlParameter("@名稱", DataClass.名稱 ) { SqlDbType = SqlDbType.NVarChar },
                new SqlParameter("@備註", DataClass.備註 ) { SqlDbType = SqlDbType.NVarChar },
            };
            SQL_ConnectionClass.result rlt_temp1 = SQL_ConnectionClass.RunSQL(sqlstr1, parm1.ToArray());
        }




        //回傳資料
        return rlt;
    }

    //回傳資料
    public class result
    {
        public bool success { get; set; }
        public string msg { get; set; }
        public object 全取 { get; set; }
        public object 只要小明 { get; set; }
        public List<object> Files { get; set; }
        public int key { get; set; }
    }

    //傳入資料
    public class ObjectClass
    {
        public string Type { get; set; }
        public string 目標uid { get; set; }
        public string 名稱 { get; set; }
        public string 備註 { get; set; }
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}