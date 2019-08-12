/*
 * 功能：加密 功能
 * 作者：Armstrong 
 * 時間：2014.04.14
 * 當前版本：v1.0
 * 參考資料：http://www.dotblogs.com.tw/jeff-yeh/archive/2008/06/25/4371.aspx
 *  
 * 更新紀錄：
 * 2016.04.28 Armstrong 增加 MD5Encrypt(DataSet Input, bool Half)
 */

using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography;
using System.IO;
using System.Data;

namespace Encryption
{
    public class MD5
    {
        static void Main(string[] args)
        {

        }
        
        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(string Input, bool Half)
        {
            byte[] Original = Encoding.UTF8.GetBytes(Input); //將來源轉為Byte[] 
            string output = MD5Encrypt(Original, Half);
            return output;
        }

        /// <summary>
        /// MD5加密
        /// 此方式是將DataTable轉成MemoryStream就製作成MD5，不是將DataTable轉成MemoryStream再轉byte[]製作成MD5!
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="TableName">TableName</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(DataTable Input, string TableName, bool Half)
        {
            Input.TableName = TableName;
            if (TableName == null || TableName.Trim() == "")
            {
                Input.TableName = "TableName";
            }
            var mstream = new MemoryStream();
            Input.WriteXml(mstream);
            string output = MD5Encrypt(mstream, Half);

            return output;
        }

        /// <summary>
        /// MD5加密
        /// 此方式是將DataTable轉成MemoryStream就製作成MD5，不是將DataTable轉成MemoryStream再轉byte[]製作成MD5!
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(DataSet Input, bool Half)
        {
            for(int i = 0;i<Input.Tables.Count;i++)
            {
                DataTable dt = Input.Tables[i];
                if (dt.TableName == null || dt.TableName.Trim() == "")
                {
                    dt.TableName = "TableName";
                }
            }

            var mstream = new MemoryStream();
            Input.WriteXml(mstream);
            string output = MD5Encrypt(mstream, Half);

            return output;
        }

        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(MemoryStream Input, bool Half)
        {
            Input.Position = 0;
            string output = "";
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                output = BitConverter.ToString(md5.ComputeHash(Input)).Replace("-", String.Empty);
            }

            if (Half)//16位MD5加密（取32位加密的9~25字元）
                output = output.Substring(8, 16);
            return output;
        }

        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(byte[] Input, bool Half)
        {
            string output = "";
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                output = BitConverter.ToString(md5.ComputeHash(Input)).Replace("-", String.Empty);
            }

            if (Half)//16位MD5加密（取32位加密的9~25字元）
                output = output.Substring(8, 16);
            return output;
        }


        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="salted">Salted Hash字串</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(string Input, string salted, bool Half)
        {
            byte[] Original = Encoding.UTF8.GetBytes(Input); //將來源轉為Byte[] 
            string output = MD5Encrypt(Original, salted, Half);
            return output;
        }

        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="salted">Salted Hash字串</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>        
        /// <returns>加密後的字串</returns>
        public static string MD5Encrypt(MemoryStream Input, string salted, bool Half)
        {
            Input.Position = 0;
            byte[] Original = Input.ToArray(); //將來源轉為Byte[] 
            string output = MD5Encrypt(Original, salted, Half);
            return output;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Input">來源</param>
        /// <param name="salted">Salted Hash字串</param>
        /// <param name="Half">加密是16位or32位；如果是true為16位</param>
        /// <returns></returns>
        public static string MD5Encrypt(byte[] Input, string salted , bool Half)
        {
            if (salted == null || salted.Length == 0)//如果使用者沒給Salt值,那給預設 
            {
                salted = "salted";
            }
            //byte[] Original = Encoding.Default.GetBytes(txt_Source.Text);//將來源字串轉為byte[] 
            byte[] SaltValue = Encoding.Default.GetBytes(salted);//將Salted Value轉為byte[] 
            byte[] ToSalt = new byte[Input.Length + SaltValue.Length]; //宣告新的byte[]來儲存加密後的值 
            Input.CopyTo(ToSalt, 0);//將來源字串複製到新byte[] 
            SaltValue.CopyTo(ToSalt, Input.Length);//將Salted Value複製到新byte[] 
            
            string output = "";
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] SaltPWD = md5.ComputeHash(ToSalt);//進行加密 
                byte[] PWD = new byte[SaltPWD.Length + SaltValue.Length];//宣告新byte[]儲存加密及Salted的值 
                SaltPWD.CopyTo(PWD, 0);//將加密後的值複製到新byte[] 
                SaltValue.CopyTo(PWD, SaltPWD.Length);//將Salted Value複製到新byte[] 
                output = BitConverter.ToString(PWD).Replace("-", String.Empty);
            }

            if (Half)//16位MD5加密（取32位加密的9~25字元）
                output = output.Substring(8, 16);
            return output;
        }


    }

    public class SHA1
    {
        static void Main(string[] args)
        {

        }

        public static byte[] GetSHA1Binary(string source)   //SHA1加密函數
        {
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();

            return sha1.ComputeHash(Encoding.UTF8.GetBytes(source));
        }

        /// <summary>
        /// SHA1加密算法
        /// </summary>
        /// <param name="PassWord">待加密的字串</param>
        /// <returns>加密後的字串</returns>
        public static string GetSHA1(string source)         //SHA1加密函數
        {
            return BitConverter.ToString(GetSHA1Binary(source)).Replace("-", string.Empty);
        }
        public static byte[] GetSHA256Binary(string source) //SHA256加密函數
        {
            SHA256Managed sha = new SHA256Managed();

            return sha.ComputeHash(Encoding.UTF8.GetBytes(source));
        }
        public static string GetSHA256(string source)       //SHA256加密函數
        {
            return BitConverter.ToString(GetSHA256Binary(source)).Replace("-", string.Empty);
        }
        public static byte[] GetSHA384Binary(string source) //SHA384加密函數
        {
            SHA384Managed sha = new SHA384Managed();

            return sha.ComputeHash(Encoding.UTF8.GetBytes(source));
        }
        public static string GetSHA384(string source)       //SHA384加密函數
        {
            return BitConverter.ToString(GetSHA384Binary(source)).Replace("-", string.Empty);
        }


    }
}
