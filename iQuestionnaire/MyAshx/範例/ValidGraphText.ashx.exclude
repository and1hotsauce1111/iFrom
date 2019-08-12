<%@ WebHandler Language="C#" Class="GetValidGraphText" %>

using System;
using System.Web;
using System.Linq;
using Newtonsoft.Json;
using System.Runtime.Serialization.Json;
using System.Web.SessionState;

using System.Drawing;

public class GetValidGraphText : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        Bitmap objBitmap = ValidGraphText.ValidGraphTextClass.createImage();
        objBitmap.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
        objBitmap.Dispose();
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}