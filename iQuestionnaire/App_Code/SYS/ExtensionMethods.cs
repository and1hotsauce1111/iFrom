/*
 * 功能：自訂常用類別
 * 作者：Armstrong 
 * 時間：2015.10.27
 * 當前版本：v1.0
 * 參考資料：
 *  
 * 更新紀錄：
 * 2014.09.18：增加 JSON字串轉成DataTable
 * 2015.10.27：增加 檢查值是不是存在DropDownList，以防止系統出錯
 * 2015.11.16：增加 檢查小數點位數
 * 2015.11.18：增加 尋找頁面上的Control
 */

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ExtensionMethods
{
    public static class MyExtensions
    {
        /// <summary>
        /// LINQ To DataTable
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        /// //REF: http://3.ly/y8rA
        /// //註: .NET 3.5有個IEnumerable.CopyToDataTable<T>()，但T只接受DataRow(感覺有點莊孝維)        
        public static DataTable LinqQueryToDataTable<T>(IEnumerable<T> query)
        {
            DataTable tbl = new DataTable();
            PropertyInfo[] props = null;
            foreach (T item in query)
            {
                if (props == null) //尚未初始化
                {
                    Type t = item.GetType();
                    props = t.GetProperties();
                    foreach (PropertyInfo pi in props)
                    {
                        Type colType = pi.PropertyType;
                        //針對Nullable<>特別處理
                        if (colType.IsGenericType
                            && colType.GetGenericTypeDefinition() == typeof(Nullable<>))
                            colType = colType.GetGenericArguments()[0];
                        //建立欄位
                        tbl.Columns.Add(pi.Name, colType);
                    }
                }
                DataRow row = tbl.NewRow();
                foreach (PropertyInfo pi in props)
                    row[pi.Name] = pi.GetValue(item, null) ?? DBNull.Value;
                tbl.Rows.Add(row);
            }
            return tbl;
        }

        /// <summary>
        /// DataTable轉成JSON字串
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static string DataTableToJSONstr(DataTable dt)
        {
            string str_json = JsonConvert.SerializeObject(dt, Formatting.Indented);

            return str_json;
        }

        /// <summary>
        /// JSON字串轉成DataTable
        /// </summary>
        /// <param name="str_json"></param>
        /// <returns></returns>
        public static DataTable JSONstrToDataTable(string str_json)
        {
            DataTable dt = JsonConvert.DeserializeObject<DataTable>(str_json);

            return dt;
        }

        public static DataTable ClassToDataTable<T>(IEnumerable<T> list)
        {
            Type type = typeof(T);
            var properties = type.GetProperties();

            DataTable dataTable = new DataTable();
            foreach (PropertyInfo info in properties)
            {
                dataTable.Columns.Add(new DataColumn(info.Name, Nullable.GetUnderlyingType(info.PropertyType) ?? info.PropertyType));
            }

            foreach (T entity in list)
            {
                object[] values = new object[properties.Length];
                for (int i = 0; i < properties.Length; i++)
                {
                    values[i] = properties[i].GetValue(entity, null);
                }

                dataTable.Rows.Add(values);
            }

            return dataTable;
        }

        public static IList<T> ToList<T>(this DataTable table) where T : new()
        {
            IList<PropertyInfo> properties = typeof(T).GetProperties().ToList();
            IList<T> result = new List<T>();

            //取得DataTable所有的row data
            foreach (var row in table.Rows)
            {
                var item = MappingItem<T>((DataRow)row, properties);
                result.Add(item);
            }



            return result;
        }

        public static IList<T> ToList<T>(this DataRow row) where T : new()
        {
            IList<PropertyInfo> properties = typeof(T).GetProperties().ToList();
            IList<T> result = new List<T>();

            var item = MappingItem<T>((DataRow)row, properties);
            result.Add(item);

            return result;
        }

        private static T MappingItem<T>(DataRow row, IList<PropertyInfo> properties) where T : new()
        {
            T item = new T();
            int i = 0;
            try
            {
                foreach (var property in properties)
                {
                    i = i+1;

                    if(property.Name == "Exam_No")
                    {
                        string b = "";
                    }

                    if (row.Table.Columns.Contains(property.Name))
                    {
                        //針對欄位的型態去轉換
                        if (property.PropertyType == typeof(DateTime) || property.PropertyType == typeof(Nullable<DateTime>))
                        {
                            DateTime dt = new DateTime();
                            if (DateTime.TryParse(row[property.Name].ToString(), out dt))
                            {
                                property.SetValue(item, dt, null);
                            }
                            else
                            {
                                property.SetValue(item, null, null);
                            }
                        }
                        else if (property.PropertyType == typeof(decimal) || property.PropertyType == typeof(Nullable<decimal>))
                        {
                            decimal val = new decimal();
                            decimal.TryParse(row[property.Name].ToString(), out val);
                            property.SetValue(item, val, null);
                        }
                        else if (property.PropertyType == typeof(double) || property.PropertyType == typeof(Nullable<double>))
                        {
                            double val = new double();
                            double.TryParse(row[property.Name].ToString(), out val);
                            property.SetValue(item, val, null);
                        }
                        else if (property.PropertyType == typeof(Int16) || property.PropertyType == typeof(Int32)
                              || property.PropertyType == typeof(Nullable<Int16>) || property.PropertyType == typeof(Nullable<Int32>))
                        {
                            int val = new int();
                            int.TryParse(row[property.Name].ToString(), out val);
                            property.SetValue(item, val, null);
                        }
                        else if (property.PropertyType == typeof(Boolean) || property.PropertyType == typeof(Nullable<Boolean>))
                        {
                            Boolean val = new Boolean();
                            if(Boolean.TryParse(row[property.Name].ToString(), out val) == false)
                            {
                                if (row[property.Name].ToString() == "1")
                                {
                                    val = true;
                                }
                                else if (row[property.Name].ToString() == "0")
                                {
                                    val = false;
                                }
                            }
                            
                            property.SetValue(item, val, null);
                        }
                        else
                        {
                            if (row[property.Name] != DBNull.Value)
                            {
                                if(property.PropertyType != row[property.Name].GetType()
                                    && (property.PropertyType == typeof(string))
                                    || property.PropertyType == typeof(String))
                                {
                                    property.SetValue(item, row[property.Name].ToString(), null);
                                }
                                else
                                {
                                    property.SetValue(item, row[property.Name], null);
                                }



                                
                            }
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                string a = ex.Message;
                a = i.ToString();
            }
            
            return item;
        }

        /// <summary>
        /// Returns the last few characters of the string with a length
        /// specified by the given parameter. If the string's length is less than the 
        /// given length the complete string is returned. If length is zero or 
        /// less an empty string is returned
        /// </summary>
        /// <param name="s">the string to process/// <param name="length">Number of characters to return/// <returns></returns>
        public static string Right(this string s, int length)
        {
            length = Math.Max(length, 0);

            if (s.Length > length)
            {
                return s.Substring(s.Length - length, length);
            }
            else
            {
                return s;
            }
        }

        /// <summary>
        /// Returns the first few characters of the string with a length
        /// specified by the given parameter. If the string's length is less than the 
        /// given length the complete string is returned. If length is zero or 
        /// less an empty string is returned
        /// </summary>
        /// <param name="s">the string to process</param>
        /// <param name="length">Number of characters to return</param>
        /// <returns></returns>
        public static string Left(this string s, int length)
        {
            length = Math.Max(length, 0);

            if (s.Length > length)
            {
                return s.Substring(0, length);
            }
            else
            {
                return s;
            }
        }

        /// <summary>
        /// 取得網站的根目錄的URL
        /// </summary>
        /// <param name="Req"></param>
        /// <returns></returns>
        public static string GetRootURI(HttpRequest Req)
        {
            string AppPath = "";
            if (Req != null)
            {
                string UrlAuthority = Req.Url.GetLeftPart(UriPartial.Authority);
                if (Req.ApplicationPath == null || Req.ApplicationPath == "/")
                    //直接安裝在   Web   網站   
                    AppPath = UrlAuthority;
                else
                    //安裝在虛擬子目錄下   
                    AppPath = UrlAuthority + Req.ApplicationPath;
            }
            return AppPath;
        }
        /// <summary>
        /// 取得網站根目錄的物理路徑
        /// </summary>
        /// <returns></returns>
        public static string GetRootPath()
        {
            string AppPath = "";
            HttpContext HttpCurrent = HttpContext.Current;
            if (HttpCurrent != null)
            {
                AppPath = HttpCurrent.Server.MapPath("~");
            }
            else
            {
                AppPath = AppDomain.CurrentDomain.BaseDirectory;
                if (Regex.Match(AppPath, @"\\$", RegexOptions.Compiled).Success)
                    AppPath = AppPath.Substring(0, AppPath.Length - 1);
            }
            return AppPath;
        }

        /// <summary>
        /// 將null轉成""
        /// </summary>
        /// <returns></returns>
        public static string NullToString(this object Value)
        {
            return Value == null || Value == DBNull.Value ? "" : Value.ToString();
        }

        /// <summary>
        /// 檢查值是不是存在DropDownList，以防止系統出錯
        /// </summary>
        /// <returns></returns>
        public static string CheckDropDownListItem(this System.Web.UI.WebControls.DropDownList ddl, string value, string DefaultValue)
        {
            if (ddl.Items.FindByValue(value) == null)
            {
                if (DefaultValue != null)
                    return DefaultValue;
                else
                    return ddl.Items[0].Value;
            }
            else
            {
                return value;
            }


        }

        /// <summary>
        /// 檢查小數點的位數符不符標準
        /// </summary>
        /// <param name="value">數值</param>
        /// <param name="Point">允許小數點位數</param>
        /// <returns></returns>
        public static bool CheckDecimalPoint(string value, int SPoint, int EPoint)
        {
            Regex RegNumber = new Regex(@"^[0-9]+(.[0-9]{0,2})?$");


            //RegexOptions opt = new RegexOptions();
            //opt = RegexOptions.IgnoreCase | RegexOptions.Multiline;

            //Regex reg;
            ////reg = new Regex(@"^[0-9]{1,8}+(.[0-9]{" + SPoint + "," + EPoint + "})?$", opt);
            //reg = new Regex(@"^[0-9]+(.[0-9]{0,2})?$", opt);
            Match m = RegNumber.Match(value);

            return m.Success;
        }

        /// <summary>
        /// 尋找頁面上的Control
        /// http://weblog.west-wind.com/posts/2006/Apr/09/ASPNET-20-MasterPages-and-FindControl
        /// </summary>
        /// <param name="Root">this.Master</param>
        /// <param name="Id"></param>
        /// <returns></returns>
        public static Control FindControlRecursive(Control Root, string Id)
        {
            if (Root.ID == Id)
                return Root;

            foreach (Control Ctl in Root.Controls)
            {
                Control FoundCtl = FindControlRecursive(Ctl, Id);
                if (FoundCtl != null)
                    return FoundCtl;
            }

            return null;
        }

        /// <summary>
        /// Disable該頁面所有物件
        /// </summary>
        /// <param name="Root"></param>
        /// <param name="State"></param>
        public static void DisableControls(Control Root, bool State)
        {
            foreach (Control c in Root.Controls)
            {
                if (c is DropDownList)
                {
                    ((DropDownList)(c)).Enabled = State;
                }
                else if (c is TextBox)
                {
                    ((TextBox)(c)).Enabled = State;
                }
                else if (c is RadioButton)
                {
                    ((RadioButton)(c)).Enabled = State;
                }
                else if (c is CheckBox)
                {
                    ((CheckBox)(c)).Enabled = State;
                }
                else if (c is Panel)
                {
                    DisableControls(c, State);
                }

                DisableControls(c, State);
            }
        }

        /// <summary>
        /// Disable該頁面所有物件
        /// </summary>
        /// <param name="Root"></param>
        /// <param name="State"></param>
        public static void DisableThisControls(Control Root, bool State)
        {
            if (Root is DropDownList)
            {
                ((DropDownList)(Root)).Enabled = State;
            }
            else if (Root is TextBox)
            {
                ((TextBox)(Root)).Enabled = State;
            }
            else if (Root is RadioButton)
            {
                ((RadioButton)(Root)).Enabled = State;
            }
            else if (Root is CheckBox)
            {
                ((CheckBox)(Root)).Enabled = State;
            }
            else if (Root is Panel)
            {
                DisableControls(Root, State);
            }
        }

        /// <summary>
        /// 檢查欄位名稱是否有在DataRow裡面
        /// </summary>
        /// <param name="Root"></param>
        /// <param name="State"></param>
        public static bool CheckColumns(this DataRow dr, string ColumnsName)
        {
            return dr.Table.Columns.Contains(ColumnsName);
        }


        /// <summary>
        /// 數字轉中文大寫
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static string GetChineseNumber(int number)
        {
            string[] chineseNumber = { "零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖" };
            string[] unit = { "", "拾", "佰", "仟", "萬", "拾", "佰", "仟", "億", "拾", "佰", "仟", "兆", "拾", "佰", "仟" };
            StringBuilder ret = new StringBuilder();
            string inputNumber = number.ToString();
            int idx = inputNumber.Length;
            bool needAppendZero = false;
            foreach (char c in inputNumber)
            {
                idx--; string un = unit[idx];
                if (c > '0')
                {
                    if (needAppendZero)
                    {
                        if (idx % 4 != 3) ret.Append(chineseNumber[0]);
                        needAppendZero = false;
                    }
                    ret.Append(chineseNumber[(int)(c - '0')] + un);
                }
                else {
                    needAppendZero = true;
                    if (idx % 4 == 0) ret.Append(un);
                }
            }
            return ret.Length == 0 ? chineseNumber[0] : ret.ToString();
        }

    }
}


