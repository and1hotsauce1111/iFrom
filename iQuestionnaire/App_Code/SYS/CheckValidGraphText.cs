/*
 * 功能：驗證碼相關功能
 * 作者：Armstrong 
 * 時間：2016.07.27
 * 當前版本：v1.0
 * 參考資料：
 *  
 * 更新紀錄：
 */

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;

using System.Drawing;
using System.Text.RegularExpressions;
using System.Drawing.Imaging;

namespace ValidGraphText
{

    public static class ValidGraphTextClass
    {
        /// <summary>
        /// 確認驗證碼
        /// </summary>
        /// <param name="ValidGraphText">驗證碼</param>
        /// <param name="type">是否分大小寫(0：不分；1：要區分)</param>
        /// <returns></returns>
        public static result Check(string ValidGraphText,string type = "0")
        {
            result rlt = new result();
            rlt.success = false;

            try
            {
                string CtValImg = HttpContext.Current.Session["CtValImg"].ToString().ToUpper();
                string ValidGraphText_Temp = ValidGraphText;

                if(type == "0")
                {
                    CtValImg = CtValImg.ToUpper();
                    ValidGraphText_Temp = ValidGraphText_Temp.ToUpper();
                }


                if (CtValImg == ValidGraphText_Temp)
                {
                    rlt.success = true;
                }
                else
                {
                    rlt.Msg = "驗證碼錯誤！";
                }

                


            }
            catch (Exception ex)
            {
                rlt.Msg = ex.Message;
            }
            finally
            {
            }



            return rlt;
        }

        /// <summary>
        /// 產生驗證碼圖片
        /// </summary>
        /// <returns></returns>
        public static Bitmap createImage()
        {
            return createImage(generateCheckCode(4));
        }

        private static char[] generateCheckCode(int arg_intCodeLength)
        {
            string ReCrtStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            ReCrtStr = "ABCDEFGHIJKLMNPRSTUVWXYZ123456789";
            Random rd = new Random(unchecked((int)DateTime.Now.Ticks));
            string txtCtValImg = string.Empty;  //驗證碼

            //產生驗證碼
            for (int i = 0; i < arg_intCodeLength; i++)
                txtCtValImg += ReCrtStr.Substring(rd.Next(0, ReCrtStr.Length), 1);

            HttpContext.Current.Session["CtValImg"] = txtCtValImg;
            return txtCtValImg.ToCharArray();
        }

        //生成隨機顏色
        public static Color getRandomColor()
        {
            Random objRandom = new Random(unchecked((int)DateTime.Now.Ticks));
            //如果不讓Thread停止color會是相同，原因還在查
            System.Threading.Thread.Sleep(objRandom.Next(30));
            int intRed = objRandom.Next(255);
            int intGreen = objRandom.Next(255);
            int intBlue = (intRed + intGreen) % 255;
            return Color.FromArgb(intRed, intGreen, intBlue);
        }

        //製成圖檔
        public static Bitmap createImage(char[] aryChrValidateCode)
        {
            //圖寬
            int int_ImageWidth = (aryChrValidateCode.Length * 16) - 3;
            //圖高
            Bitmap objBitmap = new Bitmap(int_ImageWidth, 26);
            //作圖區
            Graphics objGraphics = Graphics.FromImage(objBitmap);
            //背景
            objGraphics.Clear(Color.White);
            //邊框
            objGraphics.DrawRectangle(new Pen(Color.Blue, 1), 0, 0, int_ImageWidth - 1, 25);

            Point[] pt1 = new Point[6];
            pt1[0].X = 1; pt1[0].Y = 5;
            pt1[1].X = int_ImageWidth - 1; pt1[1].Y = 5;

            pt1[2].X = 1; pt1[2].Y = 12;
            pt1[3].X = int_ImageWidth - 1; pt1[3].Y = 12;

            pt1[4].X = 1; pt1[4].Y = 22;
            pt1[5].X = int_ImageWidth - 1; pt1[5].Y = 22;

            objGraphics.DrawLine(new Pen(Color.FromArgb(210, 245, 163), 2), pt1[0], pt1[1]);
            objGraphics.DrawLine(new Pen(Color.FromArgb(210, 245, 163), 2), pt1[2], pt1[3]);
            objGraphics.DrawLine(new Pen(Color.FromArgb(210, 245, 163), 2), pt1[4], pt1[5]);
            //字體
            Font theFont = new Font("Times New Roman", 12, FontStyle.Bold);
            int intPosX, intPosY;
            for (int intIndex = 0; intIndex < aryChrValidateCode.Length; intIndex++)
            {
                intPosX = intIndex * 13;

                if (intPosX < 1) { intPosX = 1; }
                else { intPosX += 1; }

                Brush newBrush;
                //如果是數字將字設定靠下
                Regex objRegex = new Regex(@"\d");
                if (objRegex.IsMatch(aryChrValidateCode[intIndex].ToString()))
                {
                    intPosY = 4;
                    newBrush = new SolidBrush(Color.FromArgb(51, 153, 255));
                }
                else
                {
                    intPosY = 0;
                    newBrush = new SolidBrush(Color.FromArgb(0, 102, 255));
                }
                //定位
                Point thePos = new Point(intPosX, intPosY);
                //寫入圖片
                objGraphics.DrawString(aryChrValidateCode[intIndex].ToString(), theFont, newBrush, thePos);
            }

            //MemoryStream ms = new MemoryStream();

            //objBitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

            objGraphics.Dispose();
            //objBitmap.Dispose();

            return objBitmap;

            
        }


        public class result
        {
            public bool success { get; set; }
            public string Msg { get; set; }
        }
    }
}

