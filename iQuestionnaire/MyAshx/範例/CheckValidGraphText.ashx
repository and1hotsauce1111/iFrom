<%@ WebHandler Language="C#" Class="CheckValidGraphText" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Runtime.Serialization.Json;
using System.Web.SessionState;

using System.Web.Script.Serialization;
using System.Collections.Generic;
using System.IO;
using System.Collections;



public class CheckValidGraphText : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        //規範讀取要使用哪一種格式
        context.Response.ContentType = "application/json";
        context.Response.ContentEncoding = System.Text.Encoding.UTF8;

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
        using (StreamReader sr = new StreamReader(context.Request.InputStream))
        {
            GetData = sr.ReadToEnd();
        }
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


        ValidGraphText.ValidGraphTextClass.result rlt1 = new ValidGraphText.ValidGraphTextClass.result();
        rlt1 = ValidGraphText.ValidGraphTextClass.Check(DataClass.ValidGraphText);

        rlt.success = rlt1.success;
        rlt.msg = rlt1.Msg;



        if (HttpContext.Current.Request.UserHostAddress == "127.0.0.1" || HttpContext.Current.Request.UserHostAddress == "::1")
        {
            rlt.success = true;
        }



        //回傳資料
        return rlt;
    }

    public class result
    {
        public bool success { get; set; }
        public string msg { get; set; }
    }

    //格式規範
    public class ObjectClass
    {
        public string ValidGraphText { get; set; }
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}