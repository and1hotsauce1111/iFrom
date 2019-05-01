<%@ WebHandler Language="C#" Class="_SQL" %>

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

public class _SQL : IHttpHandler, IRequiresSessionState
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
            string sqlstr1 = @"SELECT TOP 1 [數值] AS [是否使用啟用頁] FROM [系統設定] WHERE [設定類型] = '是否使用啟用頁';";
            List<SqlParameter> parm1 = new List<SqlParameter>
            {
                new SqlParameter("@Value", DataClass.Value) { SqlDbType = SqlDbType.NVarChar }
            };
            SQL_Connection.SQL_ConnectionClass.result rlt_temp1 = SQL_Connection.SQL_ConnectionClass.SelectToDataSet(sqlstr1, parm1.ToArray());
            //使用 SelectToDataSet
            if (rlt_temp1.success == true)
            {
                DataSet ds = rlt_temp1.DataSet_data;
                if (ds != null && ds.Tables.Count == 1)
                {
                    rlt.Data = ds.Tables[0];
                }
            }
            ////使用 SelectToDataTable
            //if (rlt_temp1.success == true)
            //{
            //    rlt.Data = rlt_temp1.DataTable_data;
            //}
        }





        //動態方式寫入SQL (多筆交易時使用)
        if (DataClass.Type == "GetData")
        {
            //建立命令字串
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.Append(@"DELETE FROM [DataScore] WHERE [StudentID] = @StudentID;");
            //給予帶入值
            List<SqlParameter> parm = new List<SqlParameter>
            {
                new SqlParameter("@Value", DataClass.Value) { SqlDbType = SqlDbType.NVarChar },
            };
            //循環寫入動態字串
            for (int i = 0; i < DataClass.ValueData.Length; i++)
            {
                sqlstr.Append(@"INSERT INTO [DataScore] 
                                ([StUid], [StudentID], [DepartmentMatchID], [SubjectID], [ScoreYear], [ScoreSemester], [Score], [OrderBy]) VALUES 
                                (@StUid, 
                                 @StudentID, 
                                 @DepartmentMatchID, 
                                 @SubjectID" + i.ToString() + @", 
                                 @ScoreYear" + i.ToString() + @", 
                                 @ScoreSemester" + i.ToString() + @", 
                                 @Score" + i.ToString() + @", 
                                 @OrderBy" + i.ToString() + ");");
                parm.Add(new SqlParameter("@SubjectID" + i.ToString(), DataClass.ValueData[i].Value) { SqlDbType = SqlDbType.NVarChar });
                parm.Add(new SqlParameter("@ScoreYear" + i.ToString(), DataClass.ValueData[i].Value) { SqlDbType = SqlDbType.NVarChar });
                parm.Add(new SqlParameter("@Score" + i.ToString(), DataClass.ValueData[i].Value) { SqlDbType = SqlDbType.NVarChar });
            }
            //執行SQL (RunSQL 的部分，可經由 App_Code/SYS/SQL_Connection.cs 自由調整)
            SQL_Connection.SQL_ConnectionClass.result rlt_temp = SQL_Connection.SQL_ConnectionClass.RunSQL(sqlstr.ToString(), parm.ToArray());
        }





        //實體檔案操作 (參照 PublicFunction.cs 使用)
        if (DataClass.Type == "GetFiles")
        {
            //取得檔案
            rlt.Files.Add(FileTools.FilesLoad("~/FileUpload/", null));
        }










        //回傳資料
        return rlt;
    }

    //回傳資料
    public class result
    {
        public bool success { get; set; }
        public string msg { get; set; }
        public object Data { get; set; }
        public List<object> Files { get; set; }
        public List<object> Photo { get; set; }
    }

    //傳入資料
    public class ObjectClass
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public ValueData[] ValueData { get; set; }
    }
    //定義陣列 ( 也可經由 App_Code/SYS/PublicClass.cs 去定義共用的陣列 )
    public class ValueData
    {
        public int Uid { get; set; }
        public int TitleUid { get; set; }
        public string StUid { get; set; }
        public string Value { get; set; }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}