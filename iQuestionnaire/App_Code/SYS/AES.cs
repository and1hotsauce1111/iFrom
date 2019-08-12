using System;
using System.IO;
using System.Security.Cryptography;

/// <summary>AES加密演算法（使用128，192，和256位元密鑰的版本）的安全性，在設計結構及密鑰的長度上俱已到達保護機密資訊的標準
/// 此版本使用.NET FrameWork 3.5</summary>
public class CheckUserEncrypt_AES
{
    public CheckUserEncrypt_AES() { }

    static Aes myAes = Aes.Create();
    //默認向量，需16位元
    //private byte[] IVs = { 0x24, 0xDF, 0xAA, 0x7C, 0x20, 0xF4, 0xCD, 0xE9, 0xF5, 0xDF, 0xA6, 0x6B, 0x21, 0xF4, 0xCD, 0xAF };
    private byte[] IVs = System.Text.Encoding.UTF8.GetBytes((System.Configuration.ConfigurationManager.AppSettings["PublicKey"] != null ? System.Configuration.ConfigurationManager.AppSettings["PublicKey"].ToString() : "%rT22*gTZf$@07*m").Substring(0, 16));

    /// <summary>AES加密，該方法為亂數決定</summary>
    /// <param name="EncryptText">欲加密字串</param>
    /// <returns></returns>
    public string EncryptAES(string EncryptText)
    {
        return EncryptAES(EncryptText, string.Empty);
    }

    /// <summary>AES加密</summary>
    /// <param name="EncryptText">欲加密字串</param>
    /// <param name="encryptKey">加密字串需32位元，英數符號組成32個字</param>
    /// <returns></returns>
    public string EncryptAES(string EncryptText, string encryptKey)
    {
        byte[] Key = (encryptKey != string.Empty) ? System.Text.Encoding.UTF8.GetBytes(encryptKey.Substring(0, 32)) : myAes.Key;
        byte[] IV = (encryptKey != string.Empty) ? IVs : myAes.IV;
       
        // Check arguments.
        if (EncryptText == null || EncryptText.Length <= 0)
            return "無加密字串！";
        if (Key == null || Key.Length <= 0)
            return "密鑰長度錯誤！";
        if (IV == null || IV.Length <= 0)
            return "向量長度錯誤！";

        // Declare the streams used
        // to encrypt to an in memory
        // array of bytes.
        MemoryStream msEncrypt = null;
        CryptoStream csEncrypt = null;
        StreamWriter swEncrypt = null;

        // Declare the Aes object
        // used to encrypt the data.
        Aes aesAlg = null;

        try
        {
            // Create an Aes object
            // with the specified key and IV.
            aesAlg = Aes.Create();
            aesAlg.Key = Key;
            aesAlg.IV = IV;

            // Create a decrytor to perform the stream transform.
            ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

            // Create the streams used for encryption.
            msEncrypt = new MemoryStream();
            csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
            swEncrypt = new StreamWriter(csEncrypt);

            //Write all data to the stream.
            swEncrypt.Write(EncryptText);
        }
        catch(Exception ex)
        {
            string msg = ex.Message.ToString();
        }
        finally
        {
            // Close the streams.
            if (swEncrypt != null)
                swEncrypt.Close();
            if (csEncrypt != null)
                csEncrypt.Close();
            if (msEncrypt != null)
                msEncrypt.Close();

            // Clear the Aes object.
            if (aesAlg != null)
                aesAlg.Clear();
        }

        // Return the encrypted bytes from the memory stream.
        //return msEncrypt.ToArray();
        return Convert.ToBase64String(msEncrypt.ToArray());
    }

    /// <summary>AES解密，該方法為亂數決定</summary>
    /// <param name="DecryptText">欲解密字串</param>
    /// <returns></returns>
    public string DecryptAES(string DecryptText)
    {
        return DecryptAES(DecryptText, string.Empty);
    }

    /// <summary>AES解密，該方法為亂數決定</summary>
    /// <param name="DecryptText">欲解密字串</param>
    /// <param name="decryptKey">解密字串需32位元，英數符號組成32個字(需與加密字串一致)</param>
    /// <returns></returns>
    public string DecryptAES(string DecryptText, string decryptKey)
    {         
        byte[] cipherText = Convert.FromBase64String(DecryptText);
        byte[] Key = (decryptKey != string.Empty) ? System.Text.Encoding.UTF8.GetBytes(decryptKey.Substring(0, 32)) : myAes.Key;
        byte[] IV = (decryptKey != string.Empty) ? IVs : myAes.IV;

        // Check arguments.
        if (cipherText == null || cipherText.Length <= 0)
            return "無解密字串！";
        if (Key == null || Key.Length <= 0)
            return "密鑰長度錯誤！";
        if (IV == null || IV.Length <= 0)
            return "向量長度錯誤！";

        // TDeclare the streams used
        // to decrypt to an in memory
        // array of bytes.
        MemoryStream msDecrypt = null;
        CryptoStream csDecrypt = null;
        StreamReader srDecrypt = null;

        // Declare the Aes object
        // used to decrypt the data.
        Aes aesAlg = null;

        // Declare the string used to hold
        // the decrypted text.
        string EncryptText = null;

        try
        {
            // Create an Aes object
            // with the specified key and IV.
            aesAlg = Aes.Create();
            aesAlg.Key = Key;
            aesAlg.IV = IV;

            // Create a decrytor to perform the stream transform.
            ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

            // Create the streams used for decryption.
            msDecrypt = new MemoryStream(cipherText);
            csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
            srDecrypt = new StreamReader(csDecrypt);

            // Read the decrypted bytes from the decrypting stream
            // and place them in a string.
            EncryptText = srDecrypt.ReadToEnd();
        }
        finally
        {
            //Close the streams.
            if (srDecrypt != null)
                srDecrypt.Close();
            if (csDecrypt != null)
                csDecrypt.Close();
            if (msDecrypt != null)
                msDecrypt.Close();

            // Clear the Aes object.
            if (aesAlg != null)
                aesAlg.Clear();
        }

        return EncryptText;
    }
}