using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO.Ports;
namespace SerialTest
{
    [TestClass]
    public class TestRead
    {
        SerialPort sp;

        [TestInitialize]
        public void TestSetup()
        {
            sp = new SerialPort("COM8", 9600);
            sp.Open();
       }

        [TestCleanup]
        public void TestCleanup()
        {
            sp.DiscardInBuffer();
            sp.DiscardOutBuffer();
            sp.Close();
        }

        [TestMethod]
        public void TestMethod1()
        {
            write(new string[]{"7E"});
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(0, sp.BytesToRead);
        }
        
        [TestMethod]
        public void TestMethod2()
        {
            write(new string[] { "00", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(1, sp.BytesToRead);
            Assert.AreEqual("00".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod3()
        {
            write(new string[] { "FF", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(1, sp.BytesToRead);
            Assert.AreEqual("FF".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod4()
        {
            write(new string[] { "01", "02", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(2, sp.BytesToRead);
            Assert.AreEqual("01".ToByte(), sp.ReadByte());
            Assert.AreEqual("02".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod5()
        {
            write(new string[] { "00", "01", "02", "03", "04", "05", "06", "07", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(8, sp.BytesToRead);
            Assert.AreEqual("00".ToByte(), sp.ReadByte());
            Assert.AreEqual("01".ToByte(), sp.ReadByte());
            Assert.AreEqual("02".ToByte(), sp.ReadByte());
            Assert.AreEqual("03".ToByte(), sp.ReadByte());
            Assert.AreEqual("04".ToByte(), sp.ReadByte());
            Assert.AreEqual("05".ToByte(), sp.ReadByte());
            Assert.AreEqual("06".ToByte(), sp.ReadByte());
            Assert.AreEqual("07".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod6()
        {
            write(new string[] { "7D", "5D", "7D", "5D", "7D", "5D", "7D", "5D", "7D", "5E", "7D", "5E", "7D", "5E", "7D", "5E", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(8, sp.BytesToRead);
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod7()
        {
            write(new string[] { "7D", "5E", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(1, sp.BytesToRead);
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod8()
        {
            write(new string[] { "7D", "5D", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(1, sp.BytesToRead);
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod9()
        {
            write(new string[] { "7D", "5E", "7D", "5E", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(2, sp.BytesToRead);
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod10()
        {
            write(new string[] { "7D", "5D", "7D", "5D", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(2, sp.BytesToRead);
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod11()
        {
            write(new string[] { "7D", "5E", "7D", "5D", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(2, sp.BytesToRead);
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod12()
        {
            write(new string[] { "7D", "5D", "7D", "5E", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(2, sp.BytesToRead);
            Assert.AreEqual("7D".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod13()
        {
            write(new string[] { "00", "7D", "5E", "02", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(3, sp.BytesToRead);
            Assert.AreEqual("00".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("02".ToByte(), sp.ReadByte());
        }

        [TestMethod]
        public void TestMethod14()
        {
            write(new string[] { "00", "7D", "5E", "7D", "5E", "03", "7E" });
            System.Threading.Thread.Sleep(1000);
            Assert.AreEqual(4, sp.BytesToRead);
            Assert.AreEqual("00".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("7E".ToByte(), sp.ReadByte());
            Assert.AreEqual("03".ToByte(), sp.ReadByte());
        }

        public void write(string[] arr)
        {
            byte[] bytes = new byte[arr.Length];
            for(int i = 0; i < arr.Length; i++){
                bytes[i] = arr[i].ToByte();
            }
            sp.Write(bytes, 0, bytes.Length);
        }
    }

    public static class Converter
    {
        public static byte ToByte(this string hex)
        {
            return byte.Parse(hex, System.Globalization.NumberStyles.HexNumber);
        }
    }
}