/*
 * 功能：自訂常用類別
 * 作者：Armstrong / Duke
 * 時間：2018.11.02
 * 當前版本：v1.2
 * 參考資料：
 *  
 * 更新紀錄：
 * 2018.11.02 新增 RunSQL2() 函式，解決 Parameters 單次傳送不得超過 2100 筆的問題
 * 2018.11.02 新增 GoSQL() 函式，解決 Parameters 單次傳送不得超過 2100 筆的問題
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

namespace SQL_Connection
{

    public static class SQL_ConnectionClass
    {
        public static string ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["SQLConnectionString"].ToString();
        public static string ConnectionString2 = "";// System.Web.Configuration.WebConfigurationManager.ConnectionStrings["SQLConnectionString2"].ToString();

        public static result SelectToDataTable(string Sql_Str, SqlParameter[] parm)
        {
            result rlt = new result();
            rlt.success = false;

            try
            {
                SqlConnection conn = new SqlConnection(ConnectionString);
                SqlCommand cmd = new SqlCommand(Sql_Str, conn);


                //List<SqlParameter> parm = new List<SqlParameter>
                //{
                //new SqlParameter("@Sch_No", Sch_No) { SqlDbType = SqlDbType.VarChar } ,
                //new SqlParameter("@St_No", St_No) { SqlDbType = SqlDbType.VarChar } ,
                //};

                cmd.Parameters.AddRange(parm);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                DataTable dt = new DataTable();
                dt.BeginLoadData();
                da.Fill(dt);
                dt.EndLoadData();

                rlt.DataTable_data = dt;
                rlt.success = true;


            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }



            return rlt;
        }

        public static result SelectToDataSet(string Sql_Str, SqlParameter[] parm)
        {
            result rlt = new result();
            rlt.success = false;

            try
            {
                SqlConnection conn = new SqlConnection(ConnectionString);
                SqlCommand cmd = new SqlCommand(Sql_Str, conn);

                //List<SqlParameter> parm = new List<SqlParameter>
                //{
                //new SqlParameter("@Sch_No", Sch_No) { SqlDbType = SqlDbType.VarChar } ,
                //new SqlParameter("@St_No", St_No) { SqlDbType = SqlDbType.VarChar } ,
                //};

                cmd.Parameters.AddRange(parm);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                DataSet ds = new DataSet();
                da.Fill(ds, "Results");

                rlt.DataSet_data = ds;
                rlt.success = true;


            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }



            return rlt;
        }

        //Update Delete
        public static result RunSQL(string Sql_Str, SqlParameter[] parm)
        {
            result rlt = new result();
            rlt.success = false;



            try
            {

                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    SqlTransaction trans = conn.BeginTransaction();

                    //Sql_Str += " ; SELECT CAST(scope_identity() AS int) ; ";

                    using (SqlCommand cmd = new SqlCommand(Sql_Str, conn))
                    {
                        cmd.Transaction = trans;
                        //cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddRange(parm);
                        rlt.CompleteCount = cmd.ExecuteNonQuery();

                        rlt.success = true;

                    }

                    trans.Commit();

                }


            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }

            return rlt;
        }

        public static result RunInsertSQL(string Sql_Str, SqlParameter[] parm)
        {
            result rlt = new result();
            rlt.success = false;

            try
            {

                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    SqlTransaction trans = conn.BeginTransaction();
                    Sql_Str += " ; SELECT CAST(scope_identity() AS int) ; ";
                    using (SqlCommand cmd = new SqlCommand(Sql_Str, conn))
                    {
                        cmd.Transaction = trans;
                        //cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddRange(parm);
                        //rlt.CompleteCount = cmd.ExecuteNonQuery();

                        object ExecuteScalar = cmd.ExecuteScalar();
                        int temp = -1;
                        if (ExecuteScalar != null)
                            int.TryParse(ExecuteScalar.ToString(), out temp);
                        rlt.key = temp;

                        rlt.success = true;

                    }

                    trans.Commit();

                }


            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }

            return rlt;
        }

        public static result RunStoredProcedure(string StoredProcedureName, SqlParameter[] parm)
        {
            result rlt = new result();
            rlt.success = false;
            try
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    SqlTransaction trans = conn.BeginTransaction();
                    using (SqlCommand cmd = new SqlCommand(StoredProcedureName, conn))
                    {

                        cmd.Transaction = trans;

                        cmd.CommandType = CommandType.StoredProcedure;
                        //SqlParameter retVal = cmd.Parameters.Add("@O_MESSAGE", SqlDbType.NVarChar);

                        cmd.Parameters.AddRange(parm);

                        SqlDataAdapter da = new SqlDataAdapter(cmd);

                        DataTable dt = new DataTable();
                        dt.BeginLoadData();
                        da.Fill(dt);
                        dt.EndLoadData();

                        rlt.DataTable_data = dt;

                        //rlt.CompleteCount = cmd.ExecuteNonQuery();

                        rlt.success = true;

                    }

                    trans.Commit();

                }

            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }


            return rlt;
        }

        //解決 parm 超過 2100 會出錯的問題
        public static result RunSQL2(sqllist sl)
        {
            result rlt = new result();
            rlt.success = false;

            try
            {

                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    SqlTransaction trans = conn.BeginTransaction();

                    for (int i = 0; i < sl.sqldata.Count; i++)
                    {
                        using (SqlCommand cmd = new SqlCommand(sl.sqldata[i].sql, conn))
                        {
                            cmd.Transaction = trans;
                            cmd.Parameters.AddRange(sl.sqldata[i].parm.ToArray());

                            rlt.CompleteCount += cmd.ExecuteNonQuery();
                        }
                    }

                    rlt.success = true;

                    trans.Commit();

                }

            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }

            return rlt;
        }

        public static result GoSQL(sqllist sl)
        {
            result rlt = new result();
            rlt.success = false;

            try
            {
                DataSet ds = new DataSet();

                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    SqlTransaction trans = conn.BeginTransaction();

                    for (int i = 0; i < sl.sqldata.Count; i++)
                    {
                        using (SqlCommand cmd = new SqlCommand(sl.sqldata[i].sql, conn))
                        {
                            cmd.Transaction = trans;
                            cmd.Parameters.AddRange(sl.sqldata[i].parm.ToArray());

                            SqlDataAdapter da = new SqlDataAdapter(cmd);
                            DataSet tempDs = new DataSet();
                            da.Fill(tempDs, "Results" + i.ToString());

                            for (int j = 0; j < tempDs.Tables.Count; j++)
                            {
                                ds.Tables.Add(tempDs.Tables[j].Copy());
                            }

                        }
                    }

                    rlt.DataSet_data = ds;
                    rlt.success = true;

                    trans.Commit();

                }

            }
            catch (Exception ex)
            {
                rlt.msg = ex.Message;
            }
            finally
            {
            }

            return rlt;
        }

        public class result
        {
            public bool success { get; set; }
            public string msg { get; set; }
            public System.Data.DataTable DataTable_data { get; set; }
            public System.Data.DataSet DataSet_data { get; set; }
            public int CompleteCount { get; set; }
            public int key { get; set; }
        }

        public class sqllist
        {
            public List<sqldata> sqldata { get; set; }
        }

        public class sqldata
        {
            public string sql { get; set; }
            public List<SqlParameter> parm { get; set; }
        }
    }
}

