-- MySQL dump 10.13  Distrib 8.0.21, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: training_database
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE training_database;

USE training_database;

--
-- Table structure for table `Plan`
--

DROP TABLE IF EXISTS `Plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Plan` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` tinytext NOT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plan`
--

LOCK TABLES `Plan` WRITE;
/*!40000 ALTER TABLE `Plan` DISABLE KEYS */;
INSERT INTO `Plan` VALUES (6,'12 Week Plan','2020-10-23 04:00:00');
/*!40000 ALTER TABLE `Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContentCycle`
--

DROP TABLE IF EXISTS `ContentCycle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContentCycle` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Cycle_Number` int NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `Plan_Id` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_ContentCycle_Plan1_idx` (`Plan_Id`),
  CONSTRAINT `fk_ContentCycle_Plan1` FOREIGN KEY (`Plan_Id`) REFERENCES `Plan` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContentCycle`
--

LOCK TABLES `ContentCycle` WRITE;
/*!40000 ALTER TABLE `ContentCycle` DISABLE KEYS */;
INSERT INTO `ContentCycle` VALUES (22,1,'2020-10-23 04:00:00',6);
/*!40000 ALTER TABLE `ContentCycle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Group`
--

DROP TABLE IF EXISTS `Group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Group` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `Active` tinyint(1) DEFAULT '1',
  `Plan_Id` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Group_Plan1_idx` (`Plan_Id`),
  CONSTRAINT `fk_Group_Plan1` FOREIGN KEY (`Plan_Id`) REFERENCES `Plan` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Group`
--

LOCK TABLES `Group` WRITE;
/*!40000 ALTER TABLE `Group` DISABLE KEYS */;
INSERT INTO `Group` VALUES (39,'Best Group Ever','2020-10-23 04:00:00',1,6);
/*!40000 ALTER TABLE `Group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupRole`
--

DROP TABLE IF EXISTS `GroupRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupRole` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupRole`
--

LOCK TABLES `GroupRole` WRITE;
/*!40000 ALTER TABLE `GroupRole` DISABLE KEYS */;
INSERT INTO `GroupRole` VALUES (3,'Admin'),(4,'User');
/*!40000 ALTER TABLE `GroupRole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Section`
--

DROP TABLE IF EXISTS `Section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Section` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` tinytext NOT NULL,
  `Passage_Paraphrased` text,
  `Passage_Reference` text,
  `Additional_Thoughts` text,
  `Order` int DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `ContentCycle_Id` int NOT NULL,
  `Main_Idea` text,
  `Song_Link` tinytext,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Section_ContentCycle1` (`ContentCycle_Id`),
  CONSTRAINT `fk_Section_ContentCycle1` FOREIGN KEY (`ContentCycle_Id`) REFERENCES `ContentCycle` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=845 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Section`
--

LOCK TABLES `Section` WRITE;
/*!40000 ALTER TABLE `Section` DISABLE KEYS */;
INSERT INTO `Section` VALUES (842,'Test Section 1','We do not have a high priest who is unable to sympathize with our weakness, but one who was tested in every way as we are yet without sin.','Hebrews 4:15','Additional thoughts on the test section. ',1,'2020-10-19 04:00:00',22,'Test Section',NULL),(843,'Test Section 2','For God so loved the world that He gave His only Son, that whoever believes in Him shall not perish but have eternal life. ','John 3:16','Additional thoughts on the second test section. ',NULL,'2020-10-24 04:00:00',22,'Test Section',NULL),(844,'Test Section 3',NULL,NULL,NULL,NULL,'2020-10-29 04:00:00',22,'Test Section',NULL);
/*!40000 ALTER TABLE `Section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'Admin'),(2,'Standard');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(45) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `FirstName` varchar(45) DEFAULT NULL,
  `LastName` varchar(45) DEFAULT NULL,
  `Active` tinyint DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `PhoneNumber` varchar(45) DEFAULT NULL,
  `Role_Id` int NOT NULL,
  `Username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  KEY `fk_User_Role1_idx` (`Role_Id`),
  CONSTRAINT `fk_User_Role1` FOREIGN KEY (`Role_Id`) REFERENCES `Role` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (3,'test@test.com','$2a$05$W/JXCSbP8VUbTiMCHMCom.ak8kzzbdZpnl4podTfDfuwU4KWnFVR.','John','Maddox',1,'2020-04-20 17:09:41','',2,NULL),(4,'test2@test2.com','$2a$05$Dy8MmBxi9spmVM08beGWpuiiCgv/qfEb9AFfsR1iAU.qI15l/aYRy','Emily','Vogt',1,'2020-04-20 17:13:18','',2,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Journal`
--

DROP TABLE IF EXISTS `Journal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Journal` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(45) DEFAULT NULL,
  `Body` text,
  `CreatedDate` datetime DEFAULT NULL,
  `User_Id` int NOT NULL,
  `Section_Id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Journal_User1_idx` (`User_Id`),
  KEY `fk_Journal_Section_idx` (`Section_Id`),
  CONSTRAINT `fk_Journal_Section` FOREIGN KEY (`Section_Id`) REFERENCES `Section` (`Id`),
  CONSTRAINT `fk_Journal_User1` FOREIGN KEY (`User_Id`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Journal`
--

LOCK TABLES `Journal` WRITE;
/*!40000 ALTER TABLE `Journal` DISABLE KEYS */;
INSERT INTO `Journal` VALUES (17,'Journal 1','This is the first journal entry. ',NULL,3,NULL),(18,'Journal 2','This is the second journal entry.','2020-10-23 04:00:00',4,NULL);
/*!40000 ALTER TABLE `Journal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_has_Plan`
--

DROP TABLE IF EXISTS `User_has_Plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_has_Plan` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `User_Id` int NOT NULL,
  `Plan_Id` int NOT NULL,
  `Current_Section_Id` int NOT NULL,
  `Active` tinyint DEFAULT '0',
  `Times_Completed` int DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_User_has_Cycle_User1_idx` (`User_Id`),
  KEY `fk_User_has_Plan_Plan1_idx` (`Plan_Id`),
  KEY `fk_User_has_Plan_Section1_idx` (`Current_Section_Id`),
  CONSTRAINT `fk_User_has_Cycle_User1` FOREIGN KEY (`User_Id`) REFERENCES `User` (`Id`),
  CONSTRAINT `fk_User_has_Plan_Plan1` FOREIGN KEY (`Plan_Id`) REFERENCES `Plan` (`Id`),
  CONSTRAINT `fk_User_has_Plan_Section1` FOREIGN KEY (`Current_Section_Id`) REFERENCES `Section` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_has_Plan`
--

LOCK TABLES `User_has_Plan` WRITE;
/*!40000 ALTER TABLE `User_has_Plan` DISABLE KEYS */;
INSERT INTO `User_has_Plan` VALUES (51,3,6,842,1,0),(52,4,6,843,0,3);
/*!40000 ALTER TABLE `User_has_Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_has_Group`
--

DROP TABLE IF EXISTS `User_has_Group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_has_Group` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Group_Id` int NOT NULL,
  `GroupRole_Id` int NOT NULL,
  `User_has_Plan_Id` int NOT NULL,
  `Active` tinyint DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_User_has_Group_Group1_idx` (`Group_Id`),
  KEY `fk_User_has_Group_GroupRole1_idx` (`GroupRole_Id`),
  KEY `fk_User_has_Group_User_has_Plan1_idx` (`User_has_Plan_Id`),
  CONSTRAINT `fk_User_has_Group_Group1` FOREIGN KEY (`Group_Id`) REFERENCES `Group` (`Id`),
  CONSTRAINT `fk_User_has_Group_GroupRole1` FOREIGN KEY (`GroupRole_Id`) REFERENCES `GroupRole` (`Id`),
  CONSTRAINT `fk_User_has_Group_User_has_Plan1` FOREIGN KEY (`User_has_Plan_Id`) REFERENCES `User_has_Plan` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_has_Group`
--

LOCK TABLES `User_has_Group` WRITE;
/*!40000 ALTER TABLE `User_has_Group` DISABLE KEYS */;
INSERT INTO `User_has_Group` VALUES (1,1,1,1,0),(2,2,1,2,0),(3,3,1,3,0),(4,4,1,4,0),(5,5,1,5,0),(6,6,1,6,0),(7,7,1,7,0),(8,8,1,8,0),(9,9,1,9,1),(10,10,1,10,0),(11,10,2,11,1),(12,11,1,12,1),(13,11,2,13,0),(14,12,1,14,1),(15,13,1,15,0),(16,14,1,16,1),(17,15,1,17,1),(18,16,1,18,1),(19,17,1,19,1),(20,18,1,20,0),(21,19,1,21,1),(22,20,1,22,0),(23,21,1,23,1),(24,22,1,24,0),(25,23,1,25,0),(26,24,1,26,0),(27,25,1,27,0),(28,26,1,28,0),(29,27,1,29,0),(30,28,1,30,0),(31,29,1,31,0),(32,30,1,32,0),(33,31,1,33,0),(34,32,1,34,1),(35,33,1,35,0),(36,34,1,36,0),(37,35,1,37,0),(38,19,2,38,0),(39,19,2,39,0),(40,19,2,40,0),(41,18,2,41,0),(42,18,2,42,0),(43,19,2,43,0),(44,19,2,44,0),(45,19,2,45,1),(46,36,1,46,0),(47,33,2,47,0),(48,19,2,48,1),(49,19,2,49,0),(50,37,1,50,1);
/*!40000 ALTER TABLE `User_has_Group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  `Active` tinyint DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES (5,'Tag 1',NULL),(6,'Tag 2',NULL),(7,'Tag 3',NULL),(8,'Tag 4',NULL);
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Section_has_Tag`
--

DROP TABLE IF EXISTS `Section_has_Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Section_has_Tag` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Section_Id` int NOT NULL,
  `Tag_Id` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Section_has_Tag_Tag1_idx` (`Tag_Id`),
  KEY `fk_Section_has_Tag_Section1_idx` (`Section_Id`),
  CONSTRAINT `fk_Section_has_Tag_Section1` FOREIGN KEY (`Section_Id`) REFERENCES `Section` (`Id`),
  CONSTRAINT `fk_Section_has_Tag_Tag1` FOREIGN KEY (`Tag_Id`) REFERENCES `Tag` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Section_has_Tag`
--

LOCK TABLES `Section_has_Tag` WRITE;
/*!40000 ALTER TABLE `Section_has_Tag` DISABLE KEYS */;
INSERT INTO `Section_has_Tag` VALUES (1,842,5),(2,843,6),(3,842,7),(4,843,8);
/*!40000 ALTER TABLE `Section_has_Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrayerRequest`
--

DROP TABLE IF EXISTS `PrayerRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PrayerRequest` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(45) DEFAULT NULL,
  `Body` tinytext,
  `Resolved` tinyint DEFAULT NULL,
  `IsPrivate` tinyint DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `User_Id` int NOT NULL,
  `Frequency` int DEFAULT NULL,
  `Section_Id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_PrayerRequest_User1_idx` (`User_Id`),
  KEY `fk_PrayerRequest_Section1_idx` (`Section_Id`),
  CONSTRAINT `fk_PrayerRequest_Section1` FOREIGN KEY (`Section_Id`) REFERENCES `Section` (`Id`),
  CONSTRAINT `fk_PrayerRequest_User1` FOREIGN KEY (`User_Id`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrayerRequest`
--

LOCK TABLES `PrayerRequest` WRITE;
/*!40000 ALTER TABLE `PrayerRequest` DISABLE KEYS */;
INSERT INTO `PrayerRequest` VALUES (31,'Prayer Request 1','This is a test prayer request.',0,1,'2020-10-21 04:00:00',3,NULL,NULL),(32,'Prayer Request 2','This is another test prayer request. It is public and resolved.',1,0,'2020-10-22 04:00:00',4,NULL,NULL),(33,'Prayer Request 3','This is the third prayer request. It is private and resolved. ',1,1,'2020-10-23 04:00:00',3,NULL,NULL);
/*!40000 ALTER TABLE `PrayerRequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prayer_has_Tag`
--

DROP TABLE IF EXISTS `Prayer_has_Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prayer_has_Tag` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Tag_Id` int NOT NULL,
  `PrayerRequest_Id` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Prayer_has_Tag_Tag1_idx` (`Tag_Id`),
  KEY `fk_Prayer_has_Tag_PrayerRequest1_idx` (`PrayerRequest_Id`),
  CONSTRAINT `fk_Prayer_has_Tag_PrayerRequest1` FOREIGN KEY (`PrayerRequest_Id`) REFERENCES `PrayerRequest` (`Id`),
  CONSTRAINT `fk_Prayer_has_Tag_Tag1` FOREIGN KEY (`Tag_Id`) REFERENCES `Tag` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prayer_has_Tag`
--

LOCK TABLES `Prayer_has_Tag` WRITE;
/*!40000 ALTER TABLE `Prayer_has_Tag` DISABLE KEYS */;
INSERT INTO `Prayer_has_Tag` VALUES (14,5,31),(15,6,32),(16,7,32),(17,8,33),(18,5,33);
/*!40000 ALTER TABLE `Prayer_has_Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification_Type`
--

DROP TABLE IF EXISTS `Notification_Type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification_Type` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  `Ion_Icon` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification_Type`
--

LOCK TABLES `Notification_Type` WRITE;
/*!40000 ALTER TABLE `Notification_Type` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notification_Type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` tinytext,
  `Body` text,
  `Completed` tinyint DEFAULT '0',
  `Read` tinyint DEFAULT '0',
  `CreatedDate` datetime DEFAULT NULL,
  `To_User_Id` int NOT NULL,
  `From_User_Id` int NOT NULL,
  `Notification_Type_Id` int NOT NULL,
  `Group_Id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `fk_Notification_User1_idx` (`To_User_Id`),
  KEY `fk_Notification_Group1_idx` (`Group_Id`),
  KEY `fk_Notification_Notification_Type1_idx` (`Notification_Type_Id`),
  KEY `fk_Notification_User2_idx` (`From_User_Id`),
  CONSTRAINT `fk_Notification_Group1` FOREIGN KEY (`Group_Id`) REFERENCES `Group` (`Id`),
  CONSTRAINT `fk_Notification_Notification_Type1` FOREIGN KEY (`Notification_Type_Id`) REFERENCES `Notification_Type` (`Id`),
  CONSTRAINT `fk_Notification_User1` FOREIGN KEY (`To_User_Id`) REFERENCES `User` (`Id`),
  CONSTRAINT `fk_Notification_User2` FOREIGN KEY (`From_User_Id`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Body` text,
  `CreatedDate` varchar(45) DEFAULT NULL,
  `Group_Id` int NOT NULL,
  `User_Id` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Message_Group1_idx` (`Group_Id`),
  KEY `fk_Message_User1_idx` (`User_Id`),
  CONSTRAINT `fk_Message_Group1` FOREIGN KEY (`Group_Id`) REFERENCES `Group` (`Id`),
  CONSTRAINT `fk_Message_User1` FOREIGN KEY (`User_Id`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-30 15:50:10
