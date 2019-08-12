/*
 * 功能：使用NPOI將Excel To DataTable
 * 作者：Armstrong 
 * 時間：2016.03.02
 * 當前版本：v1.0
 * 參考資料：
 *  
 * 更新紀錄：
 * 2014.03.28 
 */

using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using NPOI.HSSF.UserModel;
using System.Data;
using System.Collections;
using System.Drawing;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.HPSF;
using NPOI.XSSF.UserModel;

/// <summary>
/// LogAction 
/// </summary>
namespace NPOIHelper
{
    public class NPOIHelperClass
    {
        static void Main(string[] args)
        {

        }

        static XSSFWorkbook hssfworkbook;

        /// <summary>
        /// Excel To DataTabl
        /// </summary>
        /// <param name="xlsName">絕對路徑</param>
        /// <param name="SheetName">要取得的Sheet名稱</param>
        /// <returns></returns>
        public static DataTable ExcelToDataTable(string xlsName, string SheetName)
        {
            FileStream fs = null;
            DataTable dt = new DataTable();
            FileInfo myInfo = new FileInfo(xlsName);
            fs = myInfo.Open(FileMode.Open, FileAccess.Read);
            dt = StreamExcelToDataTable(fs, SheetName);


            return dt;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fs"></param>
        /// <param name="SheetName"></param>
        /// <returns></returns>
        public static DataTable StreamExcelToDataTable(Stream fs, string SheetName)
        {

            DataTable dt = new DataTable();
            try
            {

                //辯別是2007還是2003
                IWorkbook wb = WorkbookFactory.Create(fs);

                if (wb.NumberOfSheets > 0)
                {
                    //ISheet sheet = wb.GetSheetAt(0);
                    //若 sheet==null 則選第一個工作表

                    ISheet sheet;

                    if (SheetName == null)
                    {
                        sheet = wb.GetSheetAt(0);
                    }
                    else
                    {
                        sheet = wb.GetSheet(SheetName);
                    }

                    IRow headerRow = sheet.GetRow(0);

                    //處理標題列
                    for (int i = headerRow.FirstCellNum; i < headerRow.LastCellNum; i++)
                    {
                        dt.Columns.Add(headerRow.GetCell(i).StringCellValue.Trim());
                    }
                    IRow row = null;
                    DataRow dr = null;
                    CellType ct = CellType.Blank;
                    //標題列之後的資料
                    for (int i = sheet.FirstRowNum + 1; i <= sheet.LastRowNum; i++)
                    {
                        dr = dt.NewRow();
                        row = sheet.GetRow(i);
                        if (row == null) continue;
                        for (int j = row.FirstCellNum; j < row.LastCellNum; j++)
                        {
                            ICell IC = row.GetCell(j);
                            if (IC != null)
                            {
                                ct = row.GetCell(j).CellType;

                                //如果此欄位格式為公式 則去取得CachedFormulaResultType
                                //if (ct == CellType.Formula)
                                //{
                                //    ct = row.GetCell(j).CachedFormulaResultType;
                                //}
                                //if (ct == CellType.Numeric)
                                //{
                                //    dr[j] = row.GetCell(j).NumericCellValue;
                                //}
                                //else
                                //{
                                //    dr[j] = row.GetCell(j).ToString().Replace("$", "");
                                //}

                                dr[j] = row.GetCell(j).ToString().Replace("$", "");

                            }
                            else
                            {
                                dr[j] = "";
                            }



                        }
                        dt.Rows.Add(dr);
                    }
                }
                fs.Close();
            }
            finally
            {
                if (fs != null) fs.Dispose();
            }
            return dt;
        }

    }
}


