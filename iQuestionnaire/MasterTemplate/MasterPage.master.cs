using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web;

public partial class MasterTemplate_MasterPage : System.Web.UI.MasterPage
{
    public string publicModuleVersion = "?v=3.2.0";
    public string version = "?v=" + DateTime.Now.ToFileTimeUtc();
    protected void Page_Load(object sender, EventArgs e)
    {
        //清除快取資料
        HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        HttpContext.Current.Response.Cache.SetNoServerCaching();
        HttpContext.Current.Response.Cache.SetNoStore();
    }
}