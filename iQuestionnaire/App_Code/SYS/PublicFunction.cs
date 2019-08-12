// 需要在 Web.config 中添加 <appSettings> <add key="FilesPath" value="D:\"/> </appSettings> 的參數

using System;
using System.Web;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Data;
using System.Collections;
using System.Configuration;
using System.Net.Mail;
using SQL_Connection;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Linq;
using System.Threading;

namespace PublicFunction
{
    //檔案操作工具
    public static class FileTools
    {
        //宣告鎖住變數
        public static object lockCreatFiles = new object();

        //移除異常符號函數 (暫時沒再用)
        public static string removeClear(this string content)
        {
            string pattern = @"[\<\>\#\%\.\*\+\?\'""\:\|\\\/]";
            Regex rg = new Regex(pattern);
            return rg.Replace(content, "");
        }

        /// <summary>檔案上傳(批次)</summary>
        /// <param name="Path">路徑字串</param>
        /// <param name="files">檔案</param>
        /// <returns></returns>
        public static void FilesUpload(string Path, HttpFileCollection files)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
            }
            //判斷資料夾是否存在
            if (!Directory.Exists(strPath))
            {
                //若不存在 則新增資料夾
                Directory.CreateDirectory(strPath);
            }
            //判斷是否有檔案
            if (files.Count > 0)
            {
                //上傳檔案儲存 支援多檔案同時上傳
                for (int i = 0; i < files.Count; i++)
                {
                    //上傳檔案 (取副檔名 System.IO.Path.GetExtension(files[i].FileName) 斟酌使用)
                    files[i].SaveAs(strPath + files[i].FileName);
                }
            }

            return;
        }

        /// <summary>檔案上傳(單一)</summary>
        /// <param name="Path">路徑字串</param>
        /// <param name="files">檔案</param>
        /// <returns></returns>
        public static void FileUpload(string Path, HttpPostedFile file)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
            }
            //判斷資料夾是否存在
            if (!Directory.Exists(strPath))
            {
                //若不存在 則新增資料夾
                Directory.CreateDirectory(strPath);
            }
            //上傳檔案
            try
            {
                file.SaveAs(strPath + file.FileName);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>圖片上傳(包含壓縮功能、批次)</summary>
        /// <param name="srcPath">路徑字串</param>
        /// <param name="files">檔案</param>
        /// <param name="maxWidth">最大寬</param>
        /// <param name="maxHeight">最大高</param>
        /// <returns></returns>
        public static void ImageFilesUpload(string srcPath, HttpFileCollection files, int maxWidth, int maxHeight)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + srcPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + srcPath);
            }
            //判斷資料夾是否存在
            if (!Directory.Exists(strPath))
            {
                //若不存在 則新增資料夾
                Directory.CreateDirectory(strPath);
            }
            //判斷是否有檔案
            if (files.Count > 0)
            {
                //設定寬高最大值
                int temp_MaxWidth = maxWidth;
                int temp_MaxHeight = maxHeight;
                //賦予運算變數
                int fixWidth = 0;
                int fixHeight = 0;

                //上傳檔案儲存 支援多檔案同時上傳
                for (int i = 0; i < files.Count; i++)
                {
                    //製作縮圖
                    System.Drawing.Image TempImage = System.Drawing.Image.FromStream(files[i].InputStream);
                    //System.Drawing.Image TempImage = System.Drawing.Image.FromFile(strPath + files[i].FileName); //這個是取的已經在伺服器的檔案來修改

                    //判斷若圖片大於 1920x1080 就改變大小，如果沒有超過就原圖上傳
                    if (TempImage.Width >= temp_MaxWidth || TempImage.Height >= temp_MaxHeight)
                    {
                        //取得檔案類型
                        ImageFormat format = TempImage.RawFormat;

                        //圖片的寬大於圖片的高
                        if (TempImage.Width >= TempImage.Height)
                        {
                            //設定修改後的圖寬
                            fixWidth = temp_MaxWidth;
                            //設定修改後的圖高
                            fixHeight = Convert.ToInt32((Convert.ToDouble(fixWidth) / Convert.ToDouble(TempImage.Width)) * Convert.ToDouble(TempImage.Height));
                        }
                        else
                        {
                            //設定修改後的圖高
                            fixHeight = temp_MaxHeight;
                            //設定修改後的圖寬
                            fixWidth = Convert.ToInt32((Convert.ToDouble(fixHeight) / Convert.ToDouble(TempImage.Height)) * Convert.ToDouble(TempImage.Width));
                        }

                        //輸出一個新圖片 (圖片,寬,高)
                        Bitmap imgoutput = new Bitmap(TempImage, fixWidth, fixHeight);

                        //存檔 (路徑,格式) 這段程式於 Edge 和 IE 環境不能再 localhost 底下執行，必須經過 IIS 才可以正常執行
                        imgoutput.Save(strPath + files[i].FileName, format);

                        //釋放資源
                        imgoutput.Dispose();

                    }
                    else
                    {
                        //上傳檔案 (取副檔名 System.IO.Path.GetExtension(files[i].FileName) 斟酌使用)
                        files[i].SaveAs(strPath + files[i].FileName);
                    }

                    //釋放資源
                    TempImage.Dispose();

                }

            }

            return;
        }

        /// <summary>圖片上傳(包含壓縮功能、單一)</summary>
        /// <param name="srcPath">路徑字串</param>
        /// <param name="files">檔案</param>
        /// <param name="maxWidth">最大寬</param>
        /// <param name="maxHeight">最大高</param>
        /// <returns></returns>
        public static void ImageFileUpload(string srcPath, HttpPostedFile file, int maxWidth, int maxHeight)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + srcPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + srcPath);
            }
            //判斷資料夾是否存在
            if (!Directory.Exists(strPath))
            {
                //若不存在 則新增資料夾
                Directory.CreateDirectory(strPath);
            }

            try
            {
                //設定寬高最大值
                int temp_MaxWidth = maxWidth;
                int temp_MaxHeight = maxHeight;
                //賦予運算變數
                int fixWidth = 0;
                int fixHeight = 0;

                //製作縮圖
                System.Drawing.Image TempImage = System.Drawing.Image.FromStream(file.InputStream);
                //System.Drawing.Image TempImage = System.Drawing.Image.FromFile(strPath + files[i].FileName); //這個是取的已經在伺服器的檔案來修改

                //判斷若圖片大於 1920x1080 就改變大小，如果沒有超過就原圖上傳
                if (TempImage.Width >= temp_MaxWidth || TempImage.Height >= temp_MaxHeight)
                {
                    //取得檔案類型
                    ImageFormat format = TempImage.RawFormat;

                    //圖片的寬大於圖片的高
                    if (TempImage.Width >= TempImage.Height)
                    {
                        //設定修改後的圖寬
                        fixWidth = temp_MaxWidth;
                        //設定修改後的圖高
                        fixHeight = Convert.ToInt32((Convert.ToDouble(fixWidth) / Convert.ToDouble(TempImage.Width)) * Convert.ToDouble(TempImage.Height));
                    }
                    else
                    {
                        //設定修改後的圖高
                        fixHeight = temp_MaxHeight;
                        //設定修改後的圖寬
                        fixWidth = Convert.ToInt32((Convert.ToDouble(fixHeight) / Convert.ToDouble(TempImage.Height)) * Convert.ToDouble(TempImage.Width));
                    }

                    //輸出一個新圖片 (圖片,寬,高)
                    Bitmap imgoutput = new Bitmap(TempImage, fixWidth, fixHeight);

                    //存檔 (路徑,格式) 這段程式於 Edge 和 IE 環境不能再 localhost 底下執行，必須經過 IIS 才可以正常執行
                    imgoutput.Save(strPath + file.FileName, format);

                    //釋放資源
                    imgoutput.Dispose();

                }
                else
                {
                    //上傳檔案
                    file.SaveAs(strPath + file.FileName);
                }

                //釋放資源
                TempImage.Dispose();

            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>刪除指定檔案</summary>
        /// <param name="Path">檔案路徑字串</param>
        /// <returns></returns>
        public static void FileDelete(string Path)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
            }
            //移除檔案
            try
            {
                File.Delete(strPath);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>刪除指定資料夾內所有檔案</summary>
        /// <param name="Path">路徑字串</param>
        /// <returns></returns>
        public static void FilesDelete(string Path)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
            }
            //判斷資料夾是否存在
            if (Directory.Exists(strPath))
            {
                //若資料夾存在 則找出所有的檔案
                string[] filesDelete = Directory.GetFiles(strPath);
                //迴圈刪除裡面所有檔案
                foreach (string fd in filesDelete)
                {
                    File.Delete(fd);
                }
            }

            return;
        }

        /// <summary>刪除資料夾</summary>
        /// <param name="Path">路徑字串</param>
        /// <returns></returns>
        public static void FolderDelete(string Path)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
            }
            //移除資料夾
            try
            {
                Directory.Delete(strPath, true);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>檔案路徑讀取(可疊加)</summary>
        /// <param name="Path">路徑字串</param>
        /// <param name="MatchUid">對應資料</param>
        /// <returns>Files[a][b] (格式string[])</returns>
        /// 可用以下方式疊加
        /// rlt.Files = new List<object>();
        /// rlt.Files.Add(此函數);
        public static FileClass[] FilesLoad(string tPath, string MatchUid)
        {
            string[] FileCollection;
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            string viewPath = "";
            if (Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + tPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + tPath);
            }
            //輸出閱覽路徑
            viewPath = ConfigurationManager.AppSettings["FilesViewPath"] + tPath;

            FileInfo theFileInfo;
            List<FileClass> dataList = new List<FileClass>();
            //判斷檔案資料夾是否存在
            if (Directory.Exists(strPath))
            {
                //若存在則開始擷取檔案
                FileCollection = Directory.GetFiles(strPath, "*.*");
                //迴圈塞入名稱跟副檔名
                for (int i = 0; i < FileCollection.Length; i++)
                {
                    theFileInfo = new FileInfo(FileCollection[i]);

                    FileClass data = new FileClass();

                    data.MatchUid = MatchUid;                                                                 //對應資料
                    data.FilePath = viewPath;                                                                 //顯示路徑
                    data.FileName = theFileInfo.Name.ToString();                                              //檔案名稱(包含附檔名)
                    data.FileNameNoExtension = Path.GetFileNameWithoutExtension(theFileInfo.Name.ToString()); //檔案名稱(去除附檔名)
                    data.FileSize = theFileInfo.Length.ToString();                                            //檔案大小
                    data.FileExtension = theFileInfo.Extension.ToString().ToLower();                          //副檔名(轉小寫)
                    data.FileLastWriteTime = theFileInfo.LastWriteTime.ToString();                            //最後一次存取的時間
                    data.FileLastWriteTimeUtc = theFileInfo.LastWriteTimeUtc.ToFileTimeUtc().ToString();      //最後一次存取的時間

                    dataList.Add(data);
                }
            }

            return dataList.ToArray();
        }

        /// <summary>資料夾路徑讀取(可疊加)</summary>
        /// <param name="tempPath">路徑字串</param>
        /// <param name="MatchUid">對應資料</param>
        /// <returns>Folders[a][b] (格式string[])</returns>
        /// 可用以下方式疊加
        /// rlt.Folders = new List<object>();
        /// rlt.Folders.Add(此函數);
        public static FolderClass[] FolderLoad(string tempPath, string MatchUid)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            string viewPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + tempPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + tempPath);
            }
            //輸出閱覽路徑
            viewPath = ConfigurationManager.AppSettings["FilesViewPath"] + tempPath;


            List<FolderClass> dataList = new List<FolderClass>();


            //判斷檔案資料夾是否存在
            if (Directory.Exists(strPath))
            {
                //目錄(含路徑)的陣列
                string[] dirs = Directory.GetDirectories(strPath);
                //用來儲存只有目錄名的集合
                ArrayList dirlist = new System.Collections.ArrayList();
                foreach (string item in dirs)
                {
                    //走訪每個元素只取得目錄名稱(不含路徑)並加入dirlist集合中
                    dirlist.Add(Path.GetFileNameWithoutExtension(item));
                }
                //填入資訊
                foreach (var item in dirlist)
                {
                    DirectoryInfo theFolderInfo = new DirectoryInfo(strPath + item.ToString());

                    FolderClass data = new FolderClass();

                    data.MatchUid = MatchUid;                                           //對應資料
                    data.FolderPath = viewPath;                                         //瀏覽路徑
                    data.FolderName = item.ToString();                                  //資料夾名稱
                    data.FolderLastWriteTime = theFolderInfo.LastWriteTime.ToString();  //最後一次存取的時間

                    dataList.Add(data);
                }
            }

            return dataList.ToArray();
        }

        /// <summary>複製資料夾(來源 > 目的)</summary>
        /// <param name="Path">來源路徑字串</param>
        /// <param name="targetPath">目的路徑字串</param>
        /// <returns></returns>
        public static void CopyFolder(string Path, string targetPath)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string srcDir = "";
            string dstDir = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                srcDir = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
                dstDir = ConfigurationManager.AppSettings["FilesPath"] + targetPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                srcDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
                dstDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + targetPath);
            }

            //確認來源資料夾是否存在
            if (Directory.Exists(srcDir))
            {
                //建立目的資料夾
                if (!Directory.Exists(dstDir))
                {
                    Directory.CreateDirectory(dstDir);
                }

                //複製內部檔案
                DirectoryInfo sdir = new DirectoryInfo(srcDir);
                foreach (FileInfo fi in sdir.GetFiles())
                {
                    File.Copy(fi.FullName, dstDir + fi.Name);
                }
            }

            return;
        }

        /// <summary>修改檔案名稱</summary>
        /// <param name="Path">路徑字串</param>
        /// <param name="oldName">原始檔名</param>
        /// <param name="newName">修改後檔名</param>
        /// <returns></returns>
        public static void UpdateFileName(string rePath, string oldName, string newName)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + rePath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + rePath);
            }

            //利用移動檔案的特性更改名稱 (原始位置, 目標位置)
            try
            {
                File.Move(strPath + oldName, strPath + newName);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>檔案搬移</summary>
        /// <param name="Path">來源路徑字串</param>
        /// <param name="targetPath">目的路徑字串</param>
        /// <param name="FileName">檔名</param>
        /// <returns></returns>
        public static void FileMove(string Path, string targetPath, string FileName)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string srcDir = "";
            string dstDir = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                srcDir = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
                dstDir = ConfigurationManager.AppSettings["FilesPath"] + targetPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                srcDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
                dstDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + targetPath);
            }
            //移動檔案 (原始位置, 目標位置)
            try
            {
                //判斷有無資料夾
                if (!Directory.Exists(dstDir))
                {
                    Directory.CreateDirectory(dstDir);
                }

                File.Move(srcDir + FileName, dstDir + FileName);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>檔案更名</summary>
        /// <param name="Path">路徑字串</param>
        /// <param name="oldName">舊名稱</param>
        /// <param name="newName">新名稱</param>
        /// <returns></returns>
        public static void FileRename(string Path, string oldName, string newName)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
            }
            //利用移動檔案重新命名 (舊名稱, 新名稱)
            try
            {
                File.Move(strPath + oldName, strPath + newName);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>檔案複製</summary>
        /// <param name="Path">來源路徑字串</param>
        /// <param name="targetPath">目的路徑字串</param>
        /// <param name="FileName">檔名</param>
        /// <returns></returns>
        public static void FileCopy(string Path, string targetPath, string FileName)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string srcDir = "";
            string dstDir = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                srcDir = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
                dstDir = ConfigurationManager.AppSettings["FilesPath"] + targetPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                srcDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
                dstDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + targetPath);
            }
            //移動檔案 (原始位置, 目標位置)
            try
            {
                //判斷資料夾是否存在
                if (!Directory.Exists(dstDir))
                {
                    //若不存在 則新增資料夾
                    Directory.CreateDirectory(dstDir);
                }

                File.Copy(srcDir + FileName, dstDir + FileName, true);
            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>取得資料夾所有檔案加總容量</summary>
        /// <param name="Path">路徑字串</param>
        /// <returns>加總大小 (格式int)</returns>
        //public static int FolderSize(string Path)
        //{
        //    //轉換路徑 (需判斷是絕對路徑還是相對路徑)
        //    string strPath = "";
        //    if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
        //    {
        //        //絕對路徑
        //        strPath = ConfigurationManager.AppSettings["FilesPath"] + Path.Replace("/", @"\");
        //    }
        //    else
        //    {
        //        //相對路徑
        //        strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + Path);
        //    }
        //
        //    //計算並回傳
        //    return (int)(new Scripting.FileSystemObjectClass()).GetFolder(strPath).Size;
        //}

        /// <summary>計算上傳檔案的大小</summary>
        /// <param name="Path">檔案</param>
        /// <returns>檔案大小 (格式int)</returns>
        public static int FilesSize(HttpFileCollection files)
        {
            int tempSize = 0;
            for (int s = 0; s < files.Count; s++)
            {
                tempSize = tempSize + files[s].ContentLength;
            }

            return tempSize;
        }

        /// <summary>遞迴讀取完整資料夾所有目錄(可疊加)</summary>
        /// <param name="tempPath">路徑字串</param>
        /// <param name="ParentGuid">最頂端父層對應guid</param>
        /// <returns>Folders[a][b] (格式string[])</returns>
        /// 可用以下方式疊加
        /// rlt.Folders = new List<object>();
        /// rlt.Folders.Add(此函數);
        public static FolderDirectory[] FolderRecursive(string tempPath, string ParentGuid, string FullPath)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            string viewPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + tempPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + tempPath);
            }
            //輸出閱覽路徑
            viewPath = ConfigurationManager.AppSettings["FilesViewPath"] + tempPath;


            List<FolderDirectory> dataList = new List<FolderDirectory>();


            //判斷檔案資料夾是否存在
            if (Directory.Exists(strPath))
            {
                //目錄(含路徑)的陣列
                string[] dirs = Directory.GetDirectories(strPath);
                //用來儲存只有目錄名的集合
                ArrayList dirlist = new ArrayList();
                foreach (string item in dirs)
                {
                    //走訪每個元素只取得目錄名稱(不含路徑)並加入dirlist集合中
                    dirlist.Add(Path.GetFileNameWithoutExtension(item));
                }

                //有資料就填入資訊
                foreach (var item in dirlist)
                {
                    DirectoryInfo theFolderInfo = new DirectoryInfo(strPath + item.ToString());

                    FolderDirectory data = new FolderDirectory();

                    string guid = Guid.NewGuid().ToString("N");

                    data.Guid = guid;                                                   //編寫對應guid
                    data.ParentGuid = ParentGuid;                                       //對應父層guid
                    data.FolderPath = viewPath;                                         //瀏覽路徑
                    data.FolderName = item.ToString();                                  //資料夾名稱
                    data.FolderLastWriteTime = theFolderInfo.LastWriteTime.ToString();  //最後一次存取的時間
                    data.FullPath = FullPath + item.ToString() + "/";                   //資料夾自己的路徑

                    dataList.Add(data);

                    //遞迴自己這個函數
                    dataList.AddRange(FolderRecursive(tempPath + "/" + item, guid, FullPath + item.ToString() + "/"));
                }
            }

            return dataList.ToArray();
        }

        //檔案容器格式
        public class FileClass
        {
            public string MatchUid { get; set; }
            public string FilePath { get; set; }
            public string FileName { get; set; }
            public string FileNameNoExtension { get; set; }
            public string FileSize { get; set; }
            public string FileExtension { get; set; }
            public string FileLastWriteTime { get; set; }
            public string FileLastWriteTimeUtc { get; set; }
        }
        public class FolderClass
        {
            public string MatchUid { get; set; }
            public string FolderPath { get; set; }
            public string FolderName { get; set; }
            public string FolderLastWriteTime { get; set; }
        }
        public class FolderDirectory
        {
            public string Guid { get; set; }
            public string ParentGuid { get; set; }
            public string FolderPath { get; set; }
            public string FolderName { get; set; }
            public string FolderLastWriteTime { get; set; }
            public string FullPath { get; set; }
        }

    }

    //圖片處理工具
    public static class PhotoTools
    {
        /// <summary>建立預覽圖</summary>
        /// <param name="srcPath">路徑字串</param>
        /// <param name="targetPath">目標路徑</param>
        /// <param name="imageName">圖片名稱</param>
        /// <param name="maxWidth">最大寬</param>
        /// <param name="maxHeight">最大高</param>
        /// <returns></returns>
        public static void ImagePreview(string srcPath, string targetPath, string imageName, int maxWidth, int maxHeight)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string strPath = "";
            string tagPath = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                strPath = ConfigurationManager.AppSettings["FilesPath"] + srcPath.Replace("/", @"\");
                tagPath = ConfigurationManager.AppSettings["FilesPath"] + targetPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                strPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + srcPath);
                tagPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + targetPath);
            }
            //判斷資料夾是否存在
            if (!Directory.Exists(tagPath))
            {
                //若不存在 則新增資料夾
                Directory.CreateDirectory(tagPath);
            }

            try
            {
                //設定寬高最大值
                int temp_MaxWidth = maxWidth;
                int temp_MaxHeight = maxHeight;
                //賦予運算變數
                int fixWidth = 0;
                int fixHeight = 0;

                //製作縮圖 (取已經在伺服器的檔案來修改)
                System.Drawing.Image TempImage = System.Drawing.Image.FromFile(strPath + imageName);

                //取得檔案類型
                ImageFormat format = TempImage.RawFormat;

                //圖片的寬大於圖片的高
                if (TempImage.Width >= TempImage.Height)
                {
                    //設定修改後的圖寬
                    fixWidth = temp_MaxWidth;
                    //設定修改後的圖高
                    fixHeight = Convert.ToInt32((Convert.ToDouble(fixWidth) / Convert.ToDouble(TempImage.Width)) * Convert.ToDouble(TempImage.Height));
                }
                else
                {
                    //設定修改後的圖高
                    fixHeight = temp_MaxHeight;
                    //設定修改後的圖寬
                    fixWidth = Convert.ToInt32((Convert.ToDouble(fixHeight) / Convert.ToDouble(TempImage.Height)) * Convert.ToDouble(TempImage.Width));
                }

                //輸出一個新圖片 (圖片,寬,高)
                Bitmap imgoutput = new Bitmap(TempImage, fixWidth, fixHeight);

                ////設定品質
                //EncoderParameter p;
                //EncoderParameters ps;
                //ps = new EncoderParameters(1);
                //p = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 0);  //設定為0 不壓縮
                //ps.Param[0] = p;

                //存檔 (路徑,格式) 這段程式於 Edge 和 IE 環境不能再 localhost 底下執行，必須經過 IIS 才可以正常執行
                imgoutput.Save(tagPath + imageName, format);
                //imgoutput.Save(tagPath + imageName, ImageFormat.Png);

                //釋放資源
                imgoutput.Dispose();
                TempImage.Dispose();

            }
            catch (Exception ex) { }

            return;
        }

        /// <summary>  
        /// 剪去圖片空餘白邊 (不可同路徑)
        /// </summary>  
        /// <param name="srcPath">來源路徑</param>  
        /// <param name="tagPath">去除後儲存路徑</param>  
        /// <param name="imageName">圖片名稱</param>  
        /// <param name="WhiteBarRate">保留白邊比例</param>  
        public static string CutImageWhitePart(string srcPath, string tagPath, string imageName, int WhiteBarRate)
        {
            //轉換路徑 (需判斷是絕對路徑還是相對路徑)
            string srcDir = "";
            string tagDir = "";
            if (System.IO.Path.IsPathRooted(ConfigurationManager.AppSettings["FilesPath"]) == true)
            {
                //絕對路徑
                srcDir = ConfigurationManager.AppSettings["FilesPath"] + srcPath.Replace("/", @"\");
                tagPath = ConfigurationManager.AppSettings["FilesPath"] + tagPath.Replace("/", @"\");
            }
            else
            {
                //相對路徑
                srcDir = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + srcPath);
                tagPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FilesPath"] + tagPath);
            }
            //判斷資料夾是否存在
            if (!Directory.Exists(tagDir))
            {
                //若不存在 則新增資料夾
                Directory.CreateDirectory(tagDir);
            }

            Bitmap bmp = new Bitmap(srcDir + imageName);
            int top = 0, left = 0;
            int right = bmp.Width, bottom = bmp.Height;
            Color white = Color.White;
            //尋找最上面的標線,從左(0)到右，從上(0)到下
            //行
            bool findAll = false;
            for (int i = 0; i < bmp.Height; i++)
            {
                bool find = false;
                //列
                for (int j = 0; j < bmp.Width; j++)
                {
                    Color c = bmp.GetPixel(j, i);
                    if (IsWhite(c))
                    {
                        top = i;
                        find = true;
                        findAll = true;
                        break;
                    }
                }
                if (find) break;
            }
            //判斷如果完全沒找到 就釋放資源並離開
            if (findAll == false)
            {
                bmp.Dispose();
                return "此圖片無範圍可裁切";
            }
            //尋找最左邊的標線，從上（top位）到下，從左到右
            //列
            for (int i = 0; i < bmp.Width; i++)
            {
                bool find = false;
                //行
                for (int j = top; j < bmp.Height; j++)
                {
                    Color c = bmp.GetPixel(i, j);
                    if (IsWhite(c))
                    {
                        left = i;
                        find = true;
                        break;
                    }
                }
                if (find) break; ;
            }
            //尋找最下邊標線，從下到上，從左到右
            //行
            for (int i = bmp.Height - 1; i >= 0; i--)
            {
                bool find = false;
                //列
                for (int j = left; j < bmp.Width; j++)
                {
                    Color c = bmp.GetPixel(j, i);
                    if (IsWhite(c))
                    {
                        bottom = i;
                        find = true;
                        break;
                    }
                }
                if (find) break;
            }
            //尋找最右邊的標線，從上到下，從右往左
            //列
            for (int i = bmp.Width - 1; i >= 0; i--)
            {
                bool find = false;
                //行
                for (int j = 0; j <= bottom; j++)
                {
                    Color c = bmp.GetPixel(i, j);
                    if (IsWhite(c))
                    {
                        right = i;
                        find = true;
                        break;
                    }
                }
                if (find) break;
            }
            int iWidth = right - left;
            int iHeight = bottom - left;
            int blockWidth = Convert.ToInt32(iWidth * WhiteBarRate / 100);
            Bitmap bmp2 = Cut(bmp, left - blockWidth, top - blockWidth, right - left + 2 * blockWidth, bottom - top + 2 * blockWidth);
            if (bmp2 != null)
            {
                bmp2.Save(tagDir + Path.ChangeExtension(imageName, ".png"), ImageFormat.Png);
            }
            bmp.Dispose();
            bmp2.Dispose();

            return "success";
        }

        /// <summary>  
        /// 裁切函數  
        /// </summary>  
        /// <param name="b"></param>  
        /// <param name="StartX"></param>  
        /// <param name="StartY"></param>  
        /// <param name="iWidth"></param>  
        /// <param name="iHeight"></param>  
        /// <returns></returns>  
        public static Bitmap Cut(Bitmap b, int StartX, int StartY, int iWidth, int iHeight)
        {
            if (b == null)
            {
                return null;
            }
            int w = b.Width;
            int h = b.Height;
            if (StartX >= w || StartY >= h)
            {
                return null;
            }
            if (StartX + iWidth > w)
            {
                iWidth = w - StartX;
            }
            if (StartY + iHeight > h)
            {
                iHeight = h - StartY;
            }
            try
            {
                Bitmap bmpOut = new Bitmap(iWidth, iHeight, PixelFormat.Format24bppRgb);
                Graphics g = Graphics.FromImage(bmpOut);
                g.DrawImage(b, new System.Drawing.Rectangle(0, 0, iWidth, iHeight), new System.Drawing.Rectangle(StartX, StartY, iWidth, iHeight), GraphicsUnit.Pixel);
                g.Dispose();
                return bmpOut;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>  
        /// 判斷白色與否 (非純白色)
        /// </summary>  
        /// <param name="c"></param>  
        /// <returns></returns>  
        public static bool IsWhite(Color c)
        {
            if (c.R < 245 || c.G < 245 || c.B < 245)
                return true;
            else return false;
        }
    }

    //資料處理工具
    public static class DataTools
    {
        /// <summary>產生亂數字串 ( 沒有 o 跟 0 防止錯亂)</summary>
        /// <param name="Number">字元數</param>
        /// <returns></returns>
        public static string CreateRandomCode(int Number)
        {
            //string allChar = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";  //去除 o 跟 0 防止錯亂
            string allChar = "1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,p,q,r,s,t,u,v,w,x,y,z";
            string[] allCharArray = allChar.Split(',');
            string randomCode = "";
            int temp = -1;

            Random rand = new Random();
            for (int i = 0; i < Number; i++)
            {
                if (temp != -1)
                {
                    rand = new Random(i * temp * ((int)DateTime.Now.Ticks));
                }
                //int t = rand.Next(36);  //去除 o 跟 0 防止錯亂
                int t = rand.Next(34);
                if (temp != -1 && temp == t)
                {
                    return CreateRandomCode(Number);
                }
                temp = t;
                randomCode += allCharArray[t];
            }
            return randomCode;
        }

        /// <summary>寄信功能 單次寄件 (需要將設定放在 Web.config)</summary>
        /// <param name="userMail">目標信箱</param>
        /// <param name="mailTitle">信件標題</param>
        /// <param name="mailHtml">信件內容</param>
        /// <returns></returns>
        public static bool sendMail(string userMail, string mailTitle, string mailHtml)
        {
            //使用 Google 寄信需要 開啟帳號內的 低安全性應用程式 > 安全性較低的應用程式存取權限 的設定，網址如下
            //https://www.google.com/settings/security/lesssecureapps


            //套用資料
            string MailList = userMail;                                                     //目標信箱
            string AutoMailSender = ConfigurationManager.AppSettings["AutoMailSender"];     //寄件人名稱
            string AutoMailAddress = ConfigurationManager.AppSettings["AutoMailAddress"];   //寄件人信箱
            string AutoMailPassword = ConfigurationManager.AppSettings["AutoMailPassword"]; //信箱密碼
            string AutoMailTitle = mailTitle;                                               //信件標題名稱
            string AutoMailSmtp = ConfigurationManager.AppSettings["AutoMailSmtp"];         //Smtp網址
            string AutoMailPort = ConfigurationManager.AppSettings["AutoMailPort"];         //Port


            MailMessage msg = new MailMessage();
            //收件者，以逗號分隔不同收件者 ex "test@gmail.com,test2@gmail.com"
            //msg.To.Add(string.Join(",", MailList.ToArray()));
            try
            {
                msg.To.Add(MailList);
            }
            catch (Exception ex)
            {
                return false;
            }
            msg.From = new MailAddress(AutoMailAddress, AutoMailSender, System.Text.Encoding.UTF8);
            //郵件標題 
            msg.Subject = AutoMailTitle;
            //郵件標題編碼  
            msg.SubjectEncoding = System.Text.Encoding.UTF8;

            //郵件內容
            msg.Body = mailHtml;

            msg.IsBodyHtml = true;
            msg.BodyEncoding = System.Text.Encoding.UTF8;   //郵件內容編碼 
            msg.Priority = MailPriority.Normal;             //郵件優先級

            //建立 SmtpClient 物件 並設定 Gmail的smtp主機及Port 

            //#region 其它 Host
            ///*
            // *  outlook.com smtp.live.com port:25
            // *  yahoo smtp.mail.yahoo.com.tw port:465
            //*/
            //#endregion

            try
            {
                SmtpClient MySmtp = new SmtpClient(AutoMailSmtp, Convert.ToInt32(AutoMailPort));
                //設定你的帳號密碼
                MySmtp.Credentials = new System.Net.NetworkCredential(AutoMailAddress, AutoMailPassword);
                //Gmial 的 smtp 使用 SSL
                MySmtp.EnableSsl = true;
                MySmtp.Send(msg);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        /// <summary>取得 時間戳記 + Guid 字串 (紀錄到毫秒後3位數，剛好50個字元)</summary>
        /// <returns></returns>
        /// 參考：http://createps.pixnet.net/blog/post/32803311-c%23-guid%E7%94%A2%E7%94%9F%E4%BA%82%E6%95%B8%E5%AD%97%E4%B8%B2-record
        public static string getGuid()
        {
            //return DateTime.Now.ToString("yyyyMMddHHmmssfff") + "-" + Guid.NewGuid().ToString("N");
            return DateTime.Now.ToString("yyyyMMdd") + Guid.NewGuid().ToString("N");
        }

    }

}


