-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: dashb_monitoring
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_periods`
--

DROP TABLE IF EXISTS `academic_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year` varchar(20) NOT NULL,
  `semester` varchar(10) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_periods`
--

LOCK TABLES `academic_periods` WRITE;
/*!40000 ALTER TABLE `academic_periods` DISABLE KEYS */;
INSERT INTO `academic_periods` VALUES (1,'2023/2024','Ganjil',0,'2026-07-15 17:18:31'),(2,'2023/2024','Genap',0,'2026-07-15 17:18:31'),(3,'2024/2025','Ganjil',0,'2026-07-15 17:18:31'),(4,'2024/2025','Genap',0,'2026-07-15 17:18:31'),(6,'2026/2027','Ganjil',0,'2026-07-15 18:34:29'),(8,'2026/2027','Genap',0,'2026-07-15 18:59:41'),(9,'2027/2028','Ganjil',0,'2026-07-15 21:58:42'),(10,'2027/2028','Genap',0,'2026-07-15 22:19:35'),(11,'2028/2029','Ganjil',1,'2026-07-16 01:43:04');
/*!40000 ALTER TABLE `academic_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(100) NOT NULL,
  `target` varchar(100) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,'Menambahkan Guru','Budi Darmawan',NULL,'Menambahkan data pendidik baru ke database','2026-07-12 12:28:34'),(2,'Ubah Jadwal Pelajaran','Bahasa Inggris',NULL,'Mengubah waktu belajar untuk kelas 4-C','2026-07-12 12:28:34'),(3,'Presensi Siswa','Kelas 1-A',NULL,'Mencatat kehadiran siswa kelas Kelas 1-A untuk tanggal 2026-07-13','2026-07-12 18:28:04'),(4,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-12','2026-07-12 18:28:37'),(5,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-12','2026-07-12 18:28:51'),(6,'Presensi Ekskul','BTQ',NULL,'Mencatat kehadiran siswa ekskul BTQ untuk tanggal 2026-07-12','2026-07-12 18:29:03'),(7,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-13','2026-07-12 18:41:30'),(8,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-13','2026-07-12 18:41:54'),(9,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-11','2026-07-12 18:46:40'),(10,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-12 18:54:55'),(11,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-12','2026-07-12 18:55:02'),(12,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-12 18:56:13'),(13,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-12 18:57:02'),(14,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-13','2026-07-12 23:00:06'),(15,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-12 23:00:53'),(16,'Presensi Ekskul','Karate',NULL,'Mencatat kehadiran siswa ekskul Karate untuk tanggal 2026-07-13','2026-07-12 23:05:06'),(17,'Presensi Siswa','Kelas 1-A',NULL,'Mencatat kehadiran siswa kelas Kelas 1-A untuk tanggal 2026-07-13','2026-07-13 01:27:08'),(18,'Presensi Siswa','Kelas 1-A',NULL,'Mencatat kehadiran siswa kelas Kelas 1-A untuk tanggal 2026-07-13','2026-07-13 01:27:46'),(19,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-13','2026-07-13 01:32:12'),(20,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-13 01:33:20'),(21,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-13 01:33:24'),(22,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-13','2026-07-13 01:33:57'),(23,'Presensi Ekskul','Karate',NULL,'Mencatat kehadiran siswa ekskul Karate untuk tanggal 2026-07-13','2026-07-13 01:36:27'),(24,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-15','2026-07-15 16:23:53'),(25,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-15','2026-07-15 16:25:08'),(26,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-16','2026-07-15 22:03:06'),(27,'Presensi Ekskul','Robotik',NULL,'Mencatat kehadiran siswa ekskul Robotik untuk tanggal 2026-07-16','2026-07-15 22:04:46'),(28,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-16','2026-07-15 22:04:59'),(29,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-16','2026-07-15 22:05:02'),(30,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-16','2026-07-15 22:05:16'),(31,'Presensi Siswa','Kelas 1-C',NULL,'Mencatat kehadiran siswa kelas Kelas 1-C untuk tanggal 2026-07-16','2026-07-15 22:05:37'),(32,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-16','2026-07-15 22:42:30'),(33,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-15','2026-07-15 22:58:01'),(34,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-15','2026-07-15 22:58:07'),(35,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-15','2026-07-15 22:58:14'),(36,'Presensi Siswa','Kelas 1-A',NULL,'Mencatat kehadiran siswa kelas Kelas 1-A untuk tanggal 2026-07-16','2026-07-15 23:36:25'),(37,'Presensi Siswa','Kelas 1-C',NULL,'Mencatat kehadiran siswa kelas Kelas 1-C untuk tanggal 2026-07-16','2026-07-15 23:37:35'),(38,'Presensi Siswa','Kelas 1-A',NULL,'Mencatat kehadiran siswa kelas Kelas 1-A untuk tanggal 2026-07-16','2026-07-16 01:46:58'),(39,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-16','2026-07-16 01:47:03'),(40,'Presensi Ekskul','GAME ONLINE',NULL,'Mencatat kehadiran siswa ekskul GAME ONLINE untuk tanggal 2026-07-16','2026-07-16 01:52:29'),(41,'Presensi Coach','Semua Coach',NULL,'Mencatat kehadiran coach untuk tanggal 2026-07-16','2026-07-16 01:54:22'),(42,'Presensi Siswa','Kelas 1-A',NULL,'Mencatat kehadiran siswa kelas Kelas 1-A untuk tanggal 2026-07-16','2026-07-16 06:08:30'),(43,'Presensi Guru','Semua Guru',NULL,'Mencatat kehadiran guru untuk tanggal 2026-07-16','2026-07-16 06:14:27');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_periods`
--

DROP TABLE IF EXISTS `class_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_id` int(11) NOT NULL,
  `period_id` int(11) NOT NULL,
  `homeroom_teacher_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_period` (`class_id`,`period_id`),
  KEY `fk_clp_class` (`class_id`),
  KEY `fk_clp_period` (`period_id`),
  KEY `fk_clp_homeroom` (`homeroom_teacher_id`),
  CONSTRAINT `fk_clp_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clp_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_periods`
--

LOCK TABLES `class_periods` WRITE;
/*!40000 ALTER TABLE `class_periods` DISABLE KEYS */;
INSERT INTO `class_periods` VALUES (1,1,1,NULL,'2026-07-15 21:43:32'),(2,2,1,NULL,'2026-07-15 21:43:32'),(3,3,1,NULL,'2026-07-15 21:43:32'),(4,4,1,NULL,'2026-07-15 21:43:32'),(5,5,2,NULL,'2026-07-15 21:43:32'),(6,6,2,NULL,'2026-07-15 21:43:32'),(7,7,2,NULL,'2026-07-15 21:43:32'),(8,8,2,NULL,'2026-07-15 21:43:32'),(9,9,3,NULL,'2026-07-15 21:43:32'),(10,10,3,NULL,'2026-07-15 21:43:32'),(11,11,3,NULL,'2026-07-15 21:43:32'),(12,12,3,NULL,'2026-07-15 21:43:32'),(13,13,4,NULL,'2026-07-15 21:43:32'),(14,14,4,NULL,'2026-07-15 21:43:32'),(15,15,4,NULL,'2026-07-15 21:43:32'),(16,16,4,NULL,'2026-07-15 21:43:32'),(19,19,6,NULL,'2026-07-15 21:43:32'),(20,20,8,1,'2026-07-15 21:43:32'),(21,22,8,NULL,'2026-07-15 21:43:32'),(40,1,3,NULL,'2026-07-15 21:47:21'),(41,2,3,NULL,'2026-07-15 21:47:21'),(42,3,3,NULL,'2026-07-15 21:47:21'),(43,4,3,NULL,'2026-07-15 21:47:21'),(44,5,4,NULL,'2026-07-15 21:47:21'),(45,6,4,NULL,'2026-07-15 21:47:21'),(46,7,4,NULL,'2026-07-15 21:47:21'),(47,8,4,NULL,'2026-07-15 21:47:21'),(53,23,9,94,'2026-07-15 22:00:40'),(63,25,10,NULL,'2026-07-15 22:32:14'),(64,26,10,NULL,'2026-07-15 22:32:22'),(65,27,8,NULL,'2026-07-16 01:27:41'),(68,27,11,98,'2026-07-16 01:44:09'),(71,27,9,100,'2026-07-16 03:02:56'),(72,29,11,101,'2026-07-16 04:32:43'),(73,30,11,NULL,'2026-07-16 04:32:51'),(74,31,11,NULL,'2026-07-16 04:35:41');
/*!40000 ALTER TABLE `class_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_subjects`
--

DROP TABLE IF EXISTS `class_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `schedule_day` varchar(50) DEFAULT NULL,
  `start_time` varchar(20) DEFAULT NULL,
  `end_time` varchar(20) DEFAULT NULL,
  `class_period_id` int(11) DEFAULT NULL,
  `subject_period_id` int(11) DEFAULT NULL,
  `teacher_period_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_subject_teacher` (`class_period_id`,`subject_period_id`,`teacher_period_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_subjects`
--

LOCK TABLES `class_subjects` WRITE;
/*!40000 ALTER TABLE `class_subjects` DISABLE KEYS */;
INSERT INTO `class_subjects` VALUES (1,'2026-07-15 17:52:58',NULL,NULL,NULL,1,1,NULL),(2,'2026-07-15 17:52:58',NULL,NULL,NULL,1,2,NULL),(3,'2026-07-15 17:52:58',NULL,NULL,NULL,1,3,NULL),(4,'2026-07-15 17:52:58',NULL,NULL,NULL,1,4,NULL),(5,'2026-07-15 17:52:58',NULL,NULL,NULL,1,5,NULL),(6,'2026-07-15 17:52:58',NULL,NULL,NULL,2,1,NULL),(7,'2026-07-15 17:52:58',NULL,NULL,NULL,2,2,NULL),(8,'2026-07-15 17:52:58',NULL,NULL,NULL,2,3,NULL),(9,'2026-07-15 17:52:58',NULL,NULL,NULL,2,4,NULL),(10,'2026-07-15 17:52:58',NULL,NULL,NULL,2,5,NULL),(11,'2026-07-15 17:52:58',NULL,NULL,NULL,3,1,NULL),(12,'2026-07-15 17:52:58',NULL,NULL,NULL,3,2,NULL),(13,'2026-07-15 17:52:58',NULL,NULL,NULL,3,3,NULL),(14,'2026-07-15 17:52:58',NULL,NULL,NULL,3,4,NULL),(15,'2026-07-15 17:52:58',NULL,NULL,NULL,3,5,NULL),(16,'2026-07-15 17:52:58',NULL,NULL,NULL,4,1,NULL),(17,'2026-07-15 17:52:58',NULL,NULL,NULL,4,2,NULL),(18,'2026-07-15 17:52:58',NULL,NULL,NULL,4,3,NULL),(19,'2026-07-15 17:52:58',NULL,NULL,NULL,4,4,NULL),(20,'2026-07-15 17:52:58',NULL,NULL,NULL,4,5,NULL),(21,'2026-07-15 17:52:58',NULL,NULL,NULL,5,6,NULL),(22,'2026-07-15 17:52:58',NULL,NULL,NULL,5,7,NULL),(23,'2026-07-15 17:52:58',NULL,NULL,NULL,5,8,NULL),(24,'2026-07-15 17:52:58',NULL,NULL,NULL,5,9,NULL),(25,'2026-07-15 17:52:58',NULL,NULL,NULL,5,10,NULL),(26,'2026-07-15 17:52:58',NULL,NULL,NULL,6,6,NULL),(27,'2026-07-15 17:52:58',NULL,NULL,NULL,6,7,NULL),(28,'2026-07-15 17:52:58',NULL,NULL,NULL,6,8,NULL),(29,'2026-07-15 17:52:58',NULL,NULL,NULL,6,9,NULL),(30,'2026-07-15 17:52:58',NULL,NULL,NULL,6,10,NULL),(31,'2026-07-15 17:52:58',NULL,NULL,NULL,7,6,NULL),(32,'2026-07-15 17:52:58',NULL,NULL,NULL,7,7,NULL),(33,'2026-07-15 17:52:58',NULL,NULL,NULL,7,8,NULL),(34,'2026-07-15 17:52:58',NULL,NULL,NULL,7,9,NULL),(35,'2026-07-15 17:52:58',NULL,NULL,NULL,7,10,NULL),(36,'2026-07-15 17:52:58',NULL,NULL,NULL,8,6,NULL),(37,'2026-07-15 17:52:58',NULL,NULL,NULL,8,7,NULL),(38,'2026-07-15 17:52:58',NULL,NULL,NULL,8,8,NULL),(39,'2026-07-15 17:52:58',NULL,NULL,NULL,8,9,NULL),(40,'2026-07-15 17:52:58',NULL,NULL,NULL,8,10,NULL),(41,'2026-07-15 17:52:58',NULL,NULL,NULL,9,11,NULL),(42,'2026-07-15 17:52:58',NULL,NULL,NULL,9,12,NULL),(43,'2026-07-15 17:52:58',NULL,NULL,NULL,9,13,NULL),(44,'2026-07-15 17:52:58',NULL,NULL,NULL,9,14,NULL),(45,'2026-07-15 17:52:58',NULL,NULL,NULL,9,15,NULL),(46,'2026-07-15 17:52:58',NULL,NULL,NULL,10,11,NULL),(47,'2026-07-15 17:52:58',NULL,NULL,NULL,10,12,NULL),(48,'2026-07-15 17:52:58',NULL,NULL,NULL,10,13,NULL),(49,'2026-07-15 17:52:58',NULL,NULL,NULL,10,14,NULL),(50,'2026-07-15 17:52:58',NULL,NULL,NULL,10,15,NULL),(51,'2026-07-15 17:52:58',NULL,NULL,NULL,11,11,NULL),(52,'2026-07-15 17:52:58',NULL,NULL,NULL,11,12,NULL),(53,'2026-07-15 17:52:58',NULL,NULL,NULL,11,13,NULL),(54,'2026-07-15 17:52:58',NULL,NULL,NULL,11,14,NULL),(55,'2026-07-15 17:52:58',NULL,NULL,NULL,11,15,NULL),(56,'2026-07-15 17:52:58',NULL,NULL,NULL,12,11,NULL),(57,'2026-07-15 17:52:58',NULL,NULL,NULL,12,12,NULL),(58,'2026-07-15 17:52:58',NULL,NULL,NULL,12,13,NULL),(59,'2026-07-15 17:52:58',NULL,NULL,NULL,12,14,NULL),(60,'2026-07-15 17:52:58',NULL,NULL,NULL,12,15,NULL),(61,'2026-07-15 17:52:58',NULL,NULL,NULL,13,16,NULL),(62,'2026-07-15 17:52:58',NULL,NULL,NULL,13,17,NULL),(63,'2026-07-15 17:52:58',NULL,NULL,NULL,13,18,NULL),(64,'2026-07-15 17:52:58',NULL,NULL,NULL,13,19,NULL),(65,'2026-07-15 17:52:58',NULL,NULL,NULL,13,20,NULL),(66,'2026-07-15 17:52:58',NULL,NULL,NULL,14,16,NULL),(67,'2026-07-15 17:52:58',NULL,NULL,NULL,14,17,NULL),(68,'2026-07-15 17:52:58',NULL,NULL,NULL,14,18,NULL),(69,'2026-07-15 17:52:58',NULL,NULL,NULL,14,19,NULL),(70,'2026-07-15 17:52:58',NULL,NULL,NULL,14,20,NULL),(71,'2026-07-15 17:52:58',NULL,NULL,NULL,15,17,NULL),(72,'2026-07-15 17:52:58',NULL,NULL,NULL,15,18,NULL),(73,'2026-07-15 17:52:58',NULL,NULL,NULL,15,20,NULL),(74,'2026-07-15 17:52:58',NULL,NULL,NULL,16,16,NULL),(75,'2026-07-15 17:52:58',NULL,NULL,NULL,16,17,NULL),(76,'2026-07-15 17:52:58',NULL,NULL,NULL,16,18,NULL),(77,'2026-07-15 17:52:58',NULL,NULL,NULL,16,19,NULL),(78,'2026-07-15 17:52:58',NULL,NULL,NULL,16,20,NULL),(79,'2026-07-15 19:20:24','[\"Selasa\"]','09:00','09:30',51,21,1),(80,'2026-07-15 20:17:08','[\"Senin\"]','08:00','09:30',21,21,NULL),(81,'2026-07-15 22:02:47','[\"Senin\"]','08:00','09:30',NULL,NULL,NULL),(82,'2026-07-15 23:36:00','[\"Senin\"]','08:00','09:30',55,55,96),(83,'2026-07-15 23:37:27','[\"Senin\"]','08:00','09:30',53,53,94),(85,'2026-07-16 03:10:23','[{\"day\":\"Senin\",\"startTime\":\"08:00\",\"endTime\":\"09:','08:00','09:30',68,56,98),(86,'2026-07-16 03:15:42','[{\"day\":\"Senin\",\"startTime\":\"08:00\",\"endTime\":\"09:','08:00','09:30',68,59,98);
/*!40000 ALTER TABLE `class_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,
  `capacity` int(11) DEFAULT 30,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'Kelas 4-A (Ganjil)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(2,'Kelas 4-B (Ganjil)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(3,'Kelas 5-A (Ganjil)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(4,'Kelas 5-B (Ganjil)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(5,'Kelas 4-A (Genap)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(6,'Kelas 4-B (Genap)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(7,'Kelas 5-A (Genap)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(8,'Kelas 5-B (Genap)',32,'2026-07-15 17:52:58','2026-07-15 17:52:58'),(23,'Kelas 1-C',32,'2026-07-15 22:00:40','2026-07-15 22:00:40'),(25,'Kelas 2',32,'2026-07-15 22:32:14','2026-07-15 22:32:14'),(26,'Kelas 3',32,'2026-07-15 22:32:22','2026-07-15 22:32:22'),(27,'Kelas 1-A',32,'2026-07-16 01:27:41','2026-07-16 01:30:58'),(29,'Kelas 1-B',32,'2026-07-16 04:32:43','2026-07-16 04:32:43'),(30,'Kelas 2-A',32,'2026-07-16 04:32:51','2026-07-16 04:32:51'),(31,'Kelas 2=B',32,'2026-07-16 04:35:41','2026-07-16 04:35:41');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_attendance`
--

DROP TABLE IF EXISTS `coach_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coach_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `check_in_time` varchar(20) DEFAULT NULL,
  `check_out_time` varchar(20) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `coach_period_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_attendance`
--

LOCK TABLES `coach_attendance` WRITE;
/*!40000 ALTER TABLE `coach_attendance` DISABLE KEYS */;
INSERT INTO `coach_attendance` VALUES (1,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(2,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(3,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(4,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(5,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(6,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(7,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(8,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(9,'15:00 WIB','17:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(10,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(11,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(12,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(13,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(14,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(15,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(16,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(17,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(18,'15:00 WIB','17:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(19,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(20,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(21,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(22,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(23,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(24,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(25,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(26,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(27,'15:00 WIB','17:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(28,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(29,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(30,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(31,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(32,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(33,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(34,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(35,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(36,'15:00 WIB','17:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(37,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(38,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(39,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(40,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(41,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(42,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(43,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(44,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(45,'15:00 WIB','17:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(46,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(47,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(48,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(49,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(50,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(51,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(52,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(53,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(54,'15:00 WIB','17:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(55,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(56,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(57,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(58,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(59,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(60,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(61,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(62,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(63,'15:00 WIB','17:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(64,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(65,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(66,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(67,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(68,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(69,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(70,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(71,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(72,'15:00 WIB','17:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(73,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(74,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(75,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(76,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(77,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(78,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(79,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(80,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(81,'15:00 WIB','17:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(82,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(83,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(84,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(85,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(86,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(87,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(88,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(89,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(90,'15:00 WIB','17:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(91,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(92,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(93,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(94,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(95,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(96,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(97,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(98,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(99,'15:00 WIB','17:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(100,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(101,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(102,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(103,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(104,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(105,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(106,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(107,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(108,'15:00 WIB','17:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(109,'05:05 WIB','05:05 WIB','Hadir','2026-07-16','2026-07-15 22:05:16',42),(110,'15:00','17:00','Hadir','2026-07-16','2026-07-16 01:54:22',43);
/*!40000 ALTER TABLE `coach_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_periods`
--

DROP TABLE IF EXISTS `coach_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coach_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coach_id` int(11) NOT NULL,
  `period_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coach_period` (`coach_id`,`period_id`),
  KEY `fk_cp_coach` (`coach_id`),
  KEY `fk_cp_period` (`period_id`),
  CONSTRAINT `fk_cp_coach` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_periods`
--

LOCK TABLES `coach_periods` WRITE;
/*!40000 ALTER TABLE `coach_periods` DISABLE KEYS */;
INSERT INTO `coach_periods` VALUES (1,26,8,1,'2026-07-15 21:43:32'),(2,7,6,1,'2026-07-15 21:43:32'),(3,17,8,1,'2026-07-15 21:43:32'),(4,8,6,1,'2026-07-15 21:43:32'),(5,18,8,1,'2026-07-15 21:43:32'),(6,9,6,1,'2026-07-15 21:43:32'),(7,19,8,1,'2026-07-15 21:43:32'),(8,10,6,1,'2026-07-15 21:43:32'),(9,20,8,1,'2026-07-15 21:43:32'),(10,11,6,1,'2026-07-15 21:43:32'),(11,21,8,1,'2026-07-15 21:43:32'),(12,12,6,1,'2026-07-15 21:43:32'),(13,22,8,1,'2026-07-15 21:43:32'),(14,13,6,1,'2026-07-15 21:43:32'),(15,23,8,1,'2026-07-15 21:43:32'),(16,14,6,1,'2026-07-15 21:43:32'),(17,24,8,1,'2026-07-15 21:43:32'),(18,15,6,1,'2026-07-15 21:43:32'),(19,25,8,1,'2026-07-15 21:43:32'),(42,27,9,1,'2026-07-15 21:59:55'),(43,28,11,1,'2026-07-16 01:49:30');
/*!40000 ALTER TABLE `coach_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coaches`
--

DROP TABLE IF EXISTS `coaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coaches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `id_number` varchar(50) NOT NULL,
  `specialization` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `schedule` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coach_email` (`email`),
  UNIQUE KEY `unique_coach_id_number` (`id_number`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coaches`
--

LOCK TABLES `coaches` WRITE;
/*!40000 ALTER TABLE `coaches` DISABLE KEYS */;
INSERT INTO `coaches` VALUES (7,'Nurhasanah','nurhasanah@sekolah.sch.id','LC-2026-001','BTQ','+62 812-0000-0001','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(8,'Qulu Bunur Heruni','qulu.bunur.heruni@sekolah.sch.id','LC-2026-002','BTQ','+62 812-0000-0002','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(9,'Tata','tata@sekolah.sch.id','LC-2026-003','Tari','+62 812-0000-0003','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(10,'Arsyiah','arsyiah@sekolah.sch.id','LC-2026-004','Pramuka','+62 812-0000-0004','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(11,'Hafidz','hafidz@sekolah.sch.id','LC-2026-005','Pramuka','+62 812-0000-0005','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(12,'Ghina','ghina@sekolah.sch.id','LC-2026-006','Karate','+62 812-0000-0006','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(13,'Banu Abidul','banu.abidul.ms.se@sekolah.sch.id','LC-2026-007','Pramuka & Mini Soccer','+62 812-0000-0007','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(14,'Defi Apriyadi','defi.apriyadi@sekolah.sch.id','LC-2026-008','Karate & Mini Soccer','+62 812-0000-0008','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(15,'Linda Sari','linda.sari.spd@sekolah.sch.id','LC-2026-009','Pramuka','+62 812-0000-0009','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44',NULL,NULL),(26,'ipan','qwe@qwe','15123123','Game Online','0812761237','Aktif','2026-07-15 20:29:54','2026-07-15 20:29:54','Selasa, Kamis','Lab Komputer 2'),(27,'koced','koced@qwe','123123','Robotik','','Aktif','2026-07-15 21:59:55','2026-07-15 21:59:55',NULL,NULL),(28,'UJANG','DISINI@DINSIN','0127371','GAME ONLINE','','Aktif','2026-07-16 01:49:30','2026-07-16 01:49:30',NULL,NULL);
/*!40000 ALTER TABLE `coaches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extracurricular_coaches`
--

DROP TABLE IF EXISTS `extracurricular_coaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extracurricular_coaches` (
  `extracurricular_period_id` int(11) NOT NULL,
  `coach_period_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`extracurricular_period_id`,`coach_period_id`),
  KEY `fk_ec_ekskul_period` (`extracurricular_period_id`),
  KEY `fk_ec_coach_period` (`coach_period_id`),
  CONSTRAINT `fk_ec_coach_period` FOREIGN KEY (`coach_period_id`) REFERENCES `coach_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ec_ekskul_period` FOREIGN KEY (`extracurricular_period_id`) REFERENCES `extracurricular_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extracurricular_coaches`
--

LOCK TABLES `extracurricular_coaches` WRITE;
/*!40000 ALTER TABLE `extracurricular_coaches` DISABLE KEYS */;
INSERT INTO `extracurricular_coaches` VALUES (17,1,'2026-07-15 21:43:32'),(49,42,'2026-07-15 22:04:30'),(55,43,'2026-07-16 01:52:17');
/*!40000 ALTER TABLE `extracurricular_coaches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extracurricular_grades`
--

DROP TABLE IF EXISTS `extracurricular_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extracurricular_grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extracurricular_period_id` int(11) NOT NULL,
  `student_period_id` int(11) NOT NULL,
  `score` decimal(5,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_ekskul` (`extracurricular_period_id`,`student_period_id`),
  KEY `student_period_id` (`student_period_id`),
  CONSTRAINT `extracurricular_grades_ibfk_1` FOREIGN KEY (`extracurricular_period_id`) REFERENCES `extracurricular_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `extracurricular_grades_ibfk_2` FOREIGN KEY (`student_period_id`) REFERENCES `student_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extracurricular_grades`
--

LOCK TABLES `extracurricular_grades` WRITE;
/*!40000 ALTER TABLE `extracurricular_grades` DISABLE KEYS */;
INSERT INTO `extracurricular_grades` VALUES (1,55,113,77.00,'asd','2026-07-16 05:23:51','2026-07-16 05:24:04');
/*!40000 ALTER TABLE `extracurricular_grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extracurricular_periods`
--

DROP TABLE IF EXISTS `extracurricular_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extracurricular_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extracurricular_id` int(11) NOT NULL,
  `period_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ekskul_period` (`extracurricular_id`,`period_id`),
  KEY `fk_ep_ekskul` (`extracurricular_id`),
  KEY `fk_ep_period` (`period_id`),
  CONSTRAINT `fk_ep_ekskul` FOREIGN KEY (`extracurricular_id`) REFERENCES `extracurriculars` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ep_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extracurricular_periods`
--

LOCK TABLES `extracurricular_periods` WRITE;
/*!40000 ALTER TABLE `extracurricular_periods` DISABLE KEYS */;
INSERT INTO `extracurricular_periods` VALUES (1,1,1,1,'2026-07-15 21:43:32'),(2,2,1,1,'2026-07-15 21:43:32'),(3,3,1,1,'2026-07-15 21:43:32'),(4,4,1,1,'2026-07-15 21:43:32'),(5,5,2,1,'2026-07-15 21:43:32'),(6,6,2,1,'2026-07-15 21:43:32'),(7,7,2,1,'2026-07-15 21:43:32'),(8,8,2,1,'2026-07-15 21:43:32'),(9,9,3,1,'2026-07-15 21:43:32'),(10,10,3,1,'2026-07-15 21:43:32'),(11,11,3,1,'2026-07-15 21:43:32'),(12,12,3,1,'2026-07-15 21:43:32'),(13,13,4,1,'2026-07-15 21:43:32'),(14,14,4,1,'2026-07-15 21:43:32'),(15,15,4,1,'2026-07-15 21:43:32'),(16,16,4,1,'2026-07-15 21:43:32'),(17,17,8,1,'2026-07-15 21:43:32'),(36,1,2,1,'2026-07-15 21:47:21'),(37,2,2,1,'2026-07-15 21:47:21'),(38,3,2,1,'2026-07-15 21:47:21'),(39,4,2,1,'2026-07-15 21:47:21'),(40,1,3,1,'2026-07-15 21:47:21'),(41,2,3,1,'2026-07-15 21:47:21'),(42,3,3,1,'2026-07-15 21:47:21'),(43,4,3,1,'2026-07-15 21:47:21'),(44,1,4,1,'2026-07-15 21:47:21'),(45,2,4,1,'2026-07-15 21:47:21'),(46,3,4,1,'2026-07-15 21:47:21'),(47,4,4,1,'2026-07-15 21:47:21'),(49,18,9,1,'2026-07-15 22:04:21'),(51,17,9,1,'2026-07-15 23:53:22'),(55,20,11,1,'2026-07-16 01:52:17');
/*!40000 ALTER TABLE `extracurricular_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extracurricular_students`
--

DROP TABLE IF EXISTS `extracurricular_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extracurricular_students` (
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `extracurricular_period_id` int(11) NOT NULL,
  `student_period_id` int(11) NOT NULL,
  PRIMARY KEY (`extracurricular_period_id`,`student_period_id`),
  KEY `fk_es_student_period` (`student_period_id`),
  CONSTRAINT `fk_es_ekskul_period` FOREIGN KEY (`extracurricular_period_id`) REFERENCES `extracurricular_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_es_student_period` FOREIGN KEY (`student_period_id`) REFERENCES `student_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extracurricular_students`
--

LOCK TABLES `extracurricular_students` WRITE;
/*!40000 ALTER TABLE `extracurricular_students` DISABLE KEYS */;
INSERT INTO `extracurricular_students` VALUES ('Aktif','2026-07-15 17:52:58',1,1),('Aktif','2026-07-15 17:52:58',1,4),('Aktif','2026-07-15 17:52:58',1,5),('Aktif','2026-07-15 17:52:58',1,6),('Aktif','2026-07-15 17:52:58',1,9),('Aktif','2026-07-15 17:52:58',2,3),('Aktif','2026-07-15 17:52:58',2,6),('Aktif','2026-07-15 17:52:58',2,9),('Aktif','2026-07-15 17:52:58',3,1),('Aktif','2026-07-15 17:52:58',3,2),('Aktif','2026-07-15 17:52:58',3,3),('Aktif','2026-07-15 17:52:58',3,5),('Aktif','2026-07-15 17:52:58',3,7),('Aktif','2026-07-15 17:52:58',4,2),('Aktif','2026-07-15 17:52:58',4,8),('Aktif','2026-07-16 01:21:57',17,40),('Aktif','2026-07-16 01:21:52',17,41),('Aktif','2026-07-15 17:52:58',36,10),('Aktif','2026-07-15 17:52:58',36,11),('Aktif','2026-07-15 17:52:58',36,12),('Aktif','2026-07-15 17:52:58',36,15),('Aktif','2026-07-15 17:52:58',36,17),('Aktif','2026-07-15 17:52:58',36,18),('Aktif','2026-07-15 17:52:58',37,15),('Aktif','2026-07-15 17:52:58',38,13),('Aktif','2026-07-15 17:52:58',38,14),('Aktif','2026-07-15 17:52:58',38,17),('Aktif','2026-07-15 17:52:58',38,19),('Aktif','2026-07-15 17:52:58',39,12),('Aktif','2026-07-15 17:52:58',39,14),('Aktif','2026-07-15 17:52:58',39,16),('Aktif','2026-07-15 17:52:58',39,18),('Aktif','2026-07-15 17:52:58',40,21),('Aktif','2026-07-15 17:52:58',40,23),('Aktif','2026-07-15 17:52:58',40,24),('Aktif','2026-07-15 17:52:58',40,26),('Aktif','2026-07-15 17:52:58',40,29),('Aktif','2026-07-15 17:52:58',41,24),('Aktif','2026-07-15 17:52:58',41,26),('Aktif','2026-07-15 17:52:58',41,27),('Aktif','2026-07-15 17:52:58',41,29),('Aktif','2026-07-15 17:52:58',42,21),('Aktif','2026-07-15 17:52:58',42,25),('Aktif','2026-07-15 17:52:58',42,27),('Aktif','2026-07-15 17:52:58',42,28),('Aktif','2026-07-15 17:52:58',43,20),('Aktif','2026-07-15 17:52:58',43,22),('Aktif','2026-07-15 17:52:58',43,23),('Aktif','2026-07-15 17:52:58',43,25),('Aktif','2026-07-15 17:52:58',43,28),('Aktif','2026-07-15 17:52:58',44,31),('Aktif','2026-07-15 17:52:58',44,33),('Aktif','2026-07-15 17:52:58',44,35),('Aktif','2026-07-15 17:52:58',44,38),('Aktif','2026-07-15 17:52:58',44,39),('Aktif','2026-07-15 17:52:58',45,33),('Aktif','2026-07-15 17:52:58',45,34),('Aktif','2026-07-15 17:52:58',45,36),('Aktif','2026-07-15 17:52:58',45,39),('Aktif','2026-07-15 17:52:58',46,32),('Aktif','2026-07-15 17:52:58',46,35),('Aktif','2026-07-15 17:52:58',46,37),('Aktif','2026-07-15 17:52:58',47,30),('Aktif','2026-07-15 17:52:58',47,32),('Aktif','2026-07-15 17:52:58',47,34),('Aktif','2026-07-15 17:52:58',47,36),('Aktif','2026-07-15 22:04:34',49,106),('Aktif','2026-07-15 23:53:22',51,111),('Aktif','2026-07-15 23:53:42',51,112),('Aktif','2026-07-16 01:52:21',55,113);
/*!40000 ALTER TABLE `extracurricular_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extracurriculars`
--

DROP TABLE IF EXISTS `extracurriculars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extracurriculars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `schedule` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extracurriculars`
--

LOCK TABLES `extracurriculars` WRITE;
/*!40000 ALTER TABLE `extracurriculars` DISABLE KEYS */;
INSERT INTO `extracurriculars` VALUES (1,'Pramuka Wajib','Olahraga','Sabtu, 08:00 - 10:00','Lapangan Utama','0812-1111-2222','2026-07-15 17:52:58','2026-07-15 17:52:58'),(2,'Futsal Club','Olahraga','Kamis, 15:30 - 17:00','Lapangan Futsal','0812-2222-3333','2026-07-15 17:52:58','2026-07-15 17:52:58'),(3,'Seni Tari','Seni','Rabu, 14:00 - 16:00','Aula Sekolah','0812-3333-4444','2026-07-15 17:52:58','2026-07-15 17:52:58'),(4,'English Club','Sains & Teknologi','Jumat, 14:00 - 15:30','Laboratorium Bahasa','0812-4444-5555','2026-07-15 17:52:58','2026-07-15 17:52:58'),(17,'Sepak Bola','Olahraga','Kamis','Lapangan Benteng','081274612','2026-07-15 20:28:59','2026-07-15 20:30:05'),(18,'Robotik','Seni','Selasa & Kamis','Lapangan Utama','23123','2026-07-15 22:04:21','2026-07-15 22:04:21'),(20,'GAME ONLINE','Seni','Jumat','Lab','0812673712','2026-07-16 01:52:17','2026-07-16 01:52:17');
/*!40000 ALTER TABLE `extracurriculars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `daily_assignment` decimal(5,2) DEFAULT 0.00,
  `daily_status` varchar(50) DEFAULT NULL,
  `uts` decimal(5,2) DEFAULT 0.00,
  `uas` decimal(5,2) DEFAULT 0.00,
  `average` decimal(5,2) DEFAULT 0.00,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `student_period_id` int(11) DEFAULT NULL,
  `class_subject_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_subject_grade` (`student_period_id`,`class_subject_id`),
  KEY `fk_grades_class_subject` (`class_subject_id`),
  CONSTRAINT `fk_grades_class_subject` FOREIGN KEY (`class_subject_id`) REFERENCES `class_subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (2,90.67,NULL,83.00,81.00,86.33,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',1,NULL),(3,85.33,NULL,76.00,77.00,80.92,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',2,NULL),(4,88.00,NULL,92.00,82.00,87.50,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',3,NULL),(5,88.67,NULL,99.00,94.00,92.58,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',4,NULL),(6,93.67,NULL,89.00,81.00,89.33,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',5,NULL),(7,82.67,NULL,88.00,90.00,85.83,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',6,NULL),(8,95.00,NULL,91.00,96.00,94.25,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',7,NULL),(9,87.33,NULL,88.00,90.00,88.17,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',8,NULL),(10,81.00,NULL,89.00,85.00,84.00,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',9,NULL),(11,82.67,NULL,98.00,92.00,88.83,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',10,NULL),(12,79.33,NULL,72.00,89.00,79.92,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',11,NULL),(13,89.67,NULL,86.00,94.00,89.83,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',12,NULL),(14,92.00,NULL,71.00,86.00,85.25,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',13,NULL),(15,83.00,NULL,72.00,95.00,83.25,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',14,NULL),(16,92.00,NULL,94.00,98.00,94.00,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',15,NULL),(17,88.67,NULL,98.00,89.00,91.08,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',16,NULL),(18,79.33,NULL,78.00,81.00,79.42,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',17,NULL),(19,91.33,NULL,79.00,96.00,89.42,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',18,NULL),(20,84.00,NULL,93.00,94.00,88.75,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',19,NULL),(21,86.00,NULL,95.00,98.00,91.25,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',20,NULL),(22,88.33,NULL,89.00,78.00,85.92,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',21,NULL),(23,82.67,NULL,73.00,93.00,82.83,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',22,NULL),(24,82.67,NULL,86.00,86.00,84.33,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',23,NULL),(25,95.67,NULL,90.00,83.00,91.08,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',24,NULL),(26,84.67,NULL,99.00,97.00,91.33,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',25,NULL),(27,89.00,NULL,90.00,98.00,91.50,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',26,NULL),(28,89.33,NULL,92.00,97.00,91.92,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',27,NULL),(29,87.67,NULL,97.00,87.00,89.83,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',28,NULL),(30,78.00,NULL,99.00,76.00,82.75,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',29,NULL),(31,79.33,NULL,90.00,90.00,84.67,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',30,NULL),(32,84.33,NULL,77.00,89.00,83.67,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',31,NULL),(33,90.33,NULL,76.00,96.00,88.17,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',32,NULL),(34,90.00,NULL,89.00,86.00,88.75,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',33,NULL),(35,87.00,NULL,99.00,94.00,91.75,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',34,NULL),(36,81.67,NULL,73.00,78.00,78.58,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',35,NULL),(37,88.67,NULL,79.00,82.00,84.58,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',36,NULL),(38,83.67,NULL,91.00,98.00,89.08,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',37,NULL),(39,89.67,NULL,71.00,81.00,82.83,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',38,NULL),(40,95.33,NULL,81.00,88.00,89.92,'Lulus','2026-07-15 17:52:58','2026-07-15 21:47:21',39,NULL),(42,85.00,NULL,80.00,90.00,85.00,'Lulus','2026-07-16 03:10:56','2026-07-16 03:11:20',113,85),(43,80.00,NULL,0.00,0.00,40.00,'Remedial','2026-07-16 03:16:50','2026-07-16 03:16:50',113,86);
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_attendance`
--

DROP TABLE IF EXISTS `student_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `student_period_id` int(11) DEFAULT NULL,
  `class_subject_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sa_class_subject` (`class_subject_id`),
  CONSTRAINT `fk_sa_class_subject` FOREIGN KEY (`class_subject_id`) REFERENCES `class_subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance`
--

LOCK TABLES `student_attendance` WRITE;
/*!40000 ALTER TABLE `student_attendance` DISABLE KEYS */;
INSERT INTO `student_attendance` VALUES (2,'Sakit','2023-09-10','2026-07-15 17:52:58',1,NULL),(3,'Alfa','2023-09-10','2026-07-15 17:52:58',2,NULL),(4,'Hadir','2023-09-10','2026-07-15 17:52:58',3,NULL),(5,'Hadir','2023-09-10','2026-07-15 17:52:58',4,NULL),(6,'Hadir','2023-09-10','2026-07-15 17:52:58',5,NULL),(7,'Hadir','2023-09-10','2026-07-15 17:52:58',6,NULL),(8,'Hadir','2023-09-10','2026-07-15 17:52:58',7,NULL),(9,'Alfa','2023-09-10','2026-07-15 17:52:58',8,NULL),(10,'Hadir','2023-09-10','2026-07-15 17:52:58',9,NULL),(12,'Hadir','2023-09-11','2026-07-15 17:52:58',1,NULL),(13,'Sakit','2023-09-11','2026-07-15 17:52:58',2,NULL),(14,'Hadir','2023-09-11','2026-07-15 17:52:58',3,NULL),(15,'Alfa','2023-09-11','2026-07-15 17:52:58',4,NULL),(16,'Hadir','2023-09-11','2026-07-15 17:52:58',5,NULL),(17,'Izin','2023-09-11','2026-07-15 17:52:58',6,NULL),(18,'Hadir','2023-09-11','2026-07-15 17:52:58',7,NULL),(19,'Hadir','2023-09-11','2026-07-15 17:52:58',8,NULL),(20,'Izin','2023-09-11','2026-07-15 17:52:58',9,NULL),(22,'Hadir','2023-09-12','2026-07-15 17:52:58',1,NULL),(23,'Hadir','2023-09-12','2026-07-15 17:52:58',2,NULL),(24,'Hadir','2023-09-12','2026-07-15 17:52:58',3,NULL),(25,'Hadir','2023-09-12','2026-07-15 17:52:58',4,NULL),(26,'Hadir','2023-09-12','2026-07-15 17:52:58',5,NULL),(27,'Hadir','2023-09-12','2026-07-15 17:52:58',6,NULL),(28,'Izin','2023-09-12','2026-07-15 17:52:58',7,NULL),(29,'Sakit','2023-09-12','2026-07-15 17:52:58',8,NULL),(30,'Izin','2023-09-12','2026-07-15 17:52:58',9,NULL),(31,'Sakit','2024-02-15','2026-07-15 17:52:58',10,NULL),(32,'Hadir','2024-02-15','2026-07-15 17:52:58',11,NULL),(33,'Hadir','2024-02-15','2026-07-15 17:52:58',12,NULL),(34,'Sakit','2024-02-15','2026-07-15 17:52:58',13,NULL),(35,'Alfa','2024-02-15','2026-07-15 17:52:58',14,NULL),(36,'Hadir','2024-02-15','2026-07-15 17:52:58',15,NULL),(37,'Hadir','2024-02-15','2026-07-15 17:52:58',16,NULL),(38,'Izin','2024-02-15','2026-07-15 17:52:58',17,NULL),(39,'Sakit','2024-02-15','2026-07-15 17:52:58',18,NULL),(40,'Sakit','2024-02-15','2026-07-15 17:52:58',19,NULL),(41,'Hadir','2024-02-16','2026-07-15 17:52:58',10,NULL),(42,'Alfa','2024-02-16','2026-07-15 17:52:58',11,NULL),(43,'Hadir','2024-02-16','2026-07-15 17:52:58',12,NULL),(44,'Hadir','2024-02-16','2026-07-15 17:52:58',13,NULL),(45,'Hadir','2024-02-16','2026-07-15 17:52:58',14,NULL),(46,'Izin','2024-02-16','2026-07-15 17:52:58',15,NULL),(47,'Izin','2024-02-16','2026-07-15 17:52:58',16,NULL),(48,'Hadir','2024-02-16','2026-07-15 17:52:58',17,NULL),(49,'Hadir','2024-02-16','2026-07-15 17:52:58',18,NULL),(50,'Hadir','2024-02-16','2026-07-15 17:52:58',19,NULL),(51,'Hadir','2024-02-17','2026-07-15 17:52:58',10,NULL),(52,'Izin','2024-02-17','2026-07-15 17:52:58',11,NULL),(53,'Alfa','2024-02-17','2026-07-15 17:52:58',12,NULL),(54,'Hadir','2024-02-17','2026-07-15 17:52:58',13,NULL),(55,'Hadir','2024-02-17','2026-07-15 17:52:58',14,NULL),(56,'Izin','2024-02-17','2026-07-15 17:52:58',15,NULL),(57,'Hadir','2024-02-17','2026-07-15 17:52:58',16,NULL),(58,'Sakit','2024-02-17','2026-07-15 17:52:58',17,NULL),(59,'Hadir','2024-02-17','2026-07-15 17:52:58',18,NULL),(60,'Sakit','2024-02-17','2026-07-15 17:52:58',19,NULL),(61,'Izin','2024-09-15','2026-07-15 17:52:58',20,NULL),(62,'Hadir','2024-09-15','2026-07-15 17:52:58',21,NULL),(63,'Sakit','2024-09-15','2026-07-15 17:52:58',22,NULL),(64,'Alfa','2024-09-15','2026-07-15 17:52:58',23,NULL),(65,'Sakit','2024-09-15','2026-07-15 17:52:58',24,NULL),(66,'Hadir','2024-09-15','2026-07-15 17:52:58',25,NULL),(67,'Hadir','2024-09-15','2026-07-15 17:52:58',26,NULL),(68,'Izin','2024-09-15','2026-07-15 17:52:58',27,NULL),(69,'Hadir','2024-09-15','2026-07-15 17:52:58',28,NULL),(70,'Sakit','2024-09-15','2026-07-15 17:52:58',29,NULL),(71,'Izin','2024-09-16','2026-07-15 17:52:58',20,NULL),(72,'Sakit','2024-09-16','2026-07-15 17:52:58',21,NULL),(73,'Hadir','2024-09-16','2026-07-15 17:52:58',22,NULL),(74,'Hadir','2024-09-16','2026-07-15 17:52:58',23,NULL),(75,'Alfa','2024-09-16','2026-07-15 17:52:58',24,NULL),(76,'Sakit','2024-09-16','2026-07-15 17:52:58',25,NULL),(77,'Hadir','2024-09-16','2026-07-15 17:52:58',26,NULL),(78,'Hadir','2024-09-16','2026-07-15 17:52:58',27,NULL),(79,'Hadir','2024-09-16','2026-07-15 17:52:58',28,NULL),(80,'Sakit','2024-09-16','2026-07-15 17:52:58',29,NULL),(81,'Hadir','2024-09-17','2026-07-15 17:52:58',20,NULL),(82,'Hadir','2024-09-17','2026-07-15 17:52:58',21,NULL),(83,'Hadir','2024-09-17','2026-07-15 17:52:58',22,NULL),(84,'Alfa','2024-09-17','2026-07-15 17:52:58',23,NULL),(85,'Hadir','2024-09-17','2026-07-15 17:52:58',24,NULL),(86,'Hadir','2024-09-17','2026-07-15 17:52:58',25,NULL),(87,'Izin','2024-09-17','2026-07-15 17:52:58',26,NULL),(88,'Hadir','2024-09-17','2026-07-15 17:52:58',27,NULL),(89,'Hadir','2024-09-17','2026-07-15 17:52:58',28,NULL),(90,'Hadir','2024-09-17','2026-07-15 17:52:58',29,NULL),(91,'Sakit','2025-02-10','2026-07-15 17:52:58',30,NULL),(92,'Hadir','2025-02-10','2026-07-15 17:52:58',31,NULL),(93,'Hadir','2025-02-10','2026-07-15 17:52:58',32,NULL),(94,'Hadir','2025-02-10','2026-07-15 17:52:58',33,NULL),(95,'Izin','2025-02-10','2026-07-15 17:52:58',34,NULL),(96,'Izin','2025-02-10','2026-07-15 17:52:58',35,NULL),(97,'Hadir','2025-02-10','2026-07-15 17:52:58',36,NULL),(98,'Hadir','2025-02-10','2026-07-15 17:52:58',37,NULL),(99,'Izin','2025-02-10','2026-07-15 17:52:58',38,NULL),(100,'Alfa','2025-02-10','2026-07-15 17:52:58',39,NULL),(101,'Izin','2025-02-11','2026-07-15 17:52:58',30,NULL),(102,'Hadir','2025-02-11','2026-07-15 17:52:58',31,NULL),(103,'Hadir','2025-02-11','2026-07-15 17:52:58',32,NULL),(104,'Hadir','2025-02-11','2026-07-15 17:52:58',33,NULL),(105,'Hadir','2025-02-11','2026-07-15 17:52:58',34,NULL),(106,'Sakit','2025-02-11','2026-07-15 17:52:58',35,NULL),(107,'Hadir','2025-02-11','2026-07-15 17:52:58',36,NULL),(108,'Hadir','2025-02-11','2026-07-15 17:52:58',37,NULL),(109,'Hadir','2025-02-11','2026-07-15 17:52:58',38,NULL),(110,'Hadir','2025-02-11','2026-07-15 17:52:58',39,NULL),(111,'Hadir','2025-02-12','2026-07-15 17:52:58',30,NULL),(112,'Hadir','2025-02-12','2026-07-15 17:52:58',31,NULL),(113,'Hadir','2025-02-12','2026-07-15 17:52:58',32,NULL),(114,'Izin','2025-02-12','2026-07-15 17:52:58',33,NULL),(115,'Hadir','2025-02-12','2026-07-15 17:52:58',34,NULL),(116,'Izin','2025-02-12','2026-07-15 17:52:58',35,NULL),(117,'Hadir','2025-02-12','2026-07-15 17:52:58',36,NULL),(118,'Sakit','2025-02-12','2026-07-15 17:52:58',37,NULL),(119,'Izin','2025-02-12','2026-07-15 17:52:58',38,NULL),(120,'Hadir','2025-02-12','2026-07-15 17:52:58',39,NULL),(121,'Hadir','2026-07-16','2026-07-15 22:04:46',106,NULL),(122,'Hadir','2026-07-16','2026-07-15 23:36:25',107,NULL),(123,'Hadir','2026-07-16','2026-07-16 01:46:58',113,NULL),(124,'Hadir','2026-07-16','2026-07-16 06:08:30',113,85);
/*!40000 ALTER TABLE `student_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_daily_grades`
--

DROP TABLE IF EXISTS `student_daily_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_daily_grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `student_period_id` int(11) NOT NULL,
  `class_subject_id` int(11) DEFAULT NULL,
  `assignment_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_subject_assignment` (`student_period_id`,`class_subject_id`,`assignment_id`),
  KEY `fk_sdg_class_subject` (`class_subject_id`),
  KEY `fk_sdg_student_period_idx` (`student_period_id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `fk_sdg_class_subject` FOREIGN KEY (`class_subject_id`) REFERENCES `class_subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sdg_student_period` FOREIGN KEY (`student_period_id`) REFERENCES `student_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_daily_grades_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `subject_assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_daily_grades`
--

LOCK TABLES `student_daily_grades` WRITE;
/*!40000 ALTER TABLE `student_daily_grades` DISABLE KEYS */;
INSERT INTO `student_daily_grades` VALUES (1,80.00,'2026-07-16 03:10:56',113,85,22),(2,90.00,'2026-07-16 03:11:02',113,85,21),(3,80.00,'2026-07-16 03:16:50',113,86,23),(4,80.00,'2026-07-16 03:16:54',113,86,24);
/*!40000 ALTER TABLE `student_daily_grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_periods`
--

DROP TABLE IF EXISTS `student_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `period_id` int(11) NOT NULL,
  `class_period_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_period` (`student_id`,`period_id`),
  KEY `fk_sp_student` (`student_id`),
  KEY `fk_sp_period` (`period_id`),
  KEY `fk_sp_class_period` (`class_period_id`),
  CONSTRAINT `fk_sp_class_period` FOREIGN KEY (`class_period_id`) REFERENCES `class_periods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sp_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sp_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_periods`
--

LOCK TABLES `student_periods` WRITE;
/*!40000 ALTER TABLE `student_periods` DISABLE KEYS */;
INSERT INTO `student_periods` VALUES (1,2,1,NULL,1,'2026-07-15 21:43:32'),(2,3,1,NULL,1,'2026-07-15 21:43:32'),(3,4,1,NULL,1,'2026-07-15 21:43:32'),(4,5,1,NULL,1,'2026-07-15 21:43:32'),(5,6,1,NULL,1,'2026-07-15 21:43:32'),(6,7,1,NULL,1,'2026-07-15 21:43:32'),(7,8,1,NULL,1,'2026-07-15 21:43:32'),(8,9,1,NULL,1,'2026-07-15 21:43:32'),(9,10,1,NULL,1,'2026-07-15 21:43:32'),(10,11,2,NULL,1,'2026-07-15 21:43:32'),(11,12,2,NULL,1,'2026-07-15 21:43:32'),(12,13,2,NULL,1,'2026-07-15 21:43:32'),(13,14,2,NULL,1,'2026-07-15 21:43:32'),(14,15,2,NULL,1,'2026-07-15 21:43:32'),(15,16,2,NULL,1,'2026-07-15 21:43:32'),(16,17,2,NULL,1,'2026-07-15 21:43:32'),(17,18,2,NULL,1,'2026-07-15 21:43:32'),(18,19,2,NULL,1,'2026-07-15 21:43:32'),(19,20,2,NULL,1,'2026-07-15 21:43:32'),(20,21,3,NULL,1,'2026-07-15 21:43:32'),(21,22,3,NULL,1,'2026-07-15 21:43:32'),(22,23,3,NULL,1,'2026-07-15 21:43:32'),(23,24,3,NULL,1,'2026-07-15 21:43:32'),(24,25,3,NULL,1,'2026-07-15 21:43:32'),(25,26,3,NULL,1,'2026-07-15 21:43:32'),(26,27,3,NULL,1,'2026-07-15 21:43:32'),(27,28,3,NULL,1,'2026-07-15 21:43:32'),(28,29,3,NULL,1,'2026-07-15 21:43:32'),(29,30,3,NULL,1,'2026-07-15 21:43:32'),(30,31,4,NULL,1,'2026-07-15 21:43:32'),(31,32,4,NULL,1,'2026-07-15 21:43:32'),(32,33,4,NULL,1,'2026-07-15 21:43:32'),(33,34,4,NULL,1,'2026-07-15 21:43:32'),(34,35,4,NULL,1,'2026-07-15 21:43:32'),(35,36,4,NULL,1,'2026-07-15 21:43:32'),(36,37,4,NULL,1,'2026-07-15 21:43:32'),(37,38,4,NULL,1,'2026-07-15 21:43:32'),(38,39,4,NULL,1,'2026-07-15 21:43:32'),(39,40,4,NULL,1,'2026-07-15 21:43:32'),(40,41,8,65,1,'2026-07-15 21:43:32'),(41,42,8,20,1,'2026-07-15 21:43:32'),(42,43,6,NULL,1,'2026-07-15 21:43:32'),(106,44,9,53,1,'2026-07-15 22:00:30'),(107,45,10,NULL,1,'2026-07-15 22:33:11'),(111,41,9,53,1,'2026-07-15 23:53:22'),(112,42,9,71,1,'2026-07-15 23:53:42'),(113,44,11,68,1,'2026-07-16 01:44:56'),(116,48,11,72,1,'2026-07-16 08:38:40');
/*!40000 ALTER TABLE `student_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `gender_text` varchar(20) NOT NULL,
  `gender_code` char(1) NOT NULL,
  `nisn` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nisn` (`nisn`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (2,'Bunga Lestari','Perempuan','P','10021','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(3,'Candra Wijaya','Laki-laki','L','10031','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(4,'Dodi Hermawan','Laki-laki','L','10041','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(5,'Eka Saputra','Laki-laki','L','10051','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(6,'Fitri Handayani','Perempuan','P','10061','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(7,'Gilang Ramadhan','Laki-laki','L','10071','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(8,'Hana Nabila','Perempuan','P','10081','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(9,'Indra Lesmana','Laki-laki','L','10091','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(10,'Jasmine Putri','Perempuan','P','10101','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(11,'Aditya Pratama','Laki-laki','L','10012','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(12,'Bunga Lestari','Perempuan','P','10022','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(13,'Candra Wijaya','Laki-laki','L','10032','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(14,'Dodi Hermawan','Laki-laki','L','10042','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(15,'Eka Saputra','Laki-laki','L','10052','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(16,'Fitri Handayani','Perempuan','P','10062','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(17,'Gilang Ramadhan','Laki-laki','L','10072','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(18,'Hana Nabila','Perempuan','P','10082','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(19,'Indra Lesmana','Laki-laki','L','10092','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(20,'Jasmine Putri','Perempuan','P','10102','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(21,'Aditya Pratama','Laki-laki','L','10013','Aktif','2026-07-15 17:52:58','2026-07-15 19:29:24'),(22,'Bunga Lestari','Perempuan','P','10023','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(23,'Candra Wijaya','Laki-laki','L','10033','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(24,'Dodi Hermawan','Laki-laki','L','10043','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(25,'Eka Saputra','Laki-laki','L','10053','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(26,'Fitri Handayani','Perempuan','P','10063','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(27,'Gilang Ramadhan','Laki-laki','L','10073','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(28,'Hana Nabila','Perempuan','P','10083','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(29,'Indra Lesmana','Laki-laki','L','10093','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(30,'Jasmine Putri','Perempuan','P','10103','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(31,'Aditya Pratama','Laki-laki','L','10014','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(32,'Bunga Lestari','Perempuan','P','10024','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(33,'Candra Wijaya','Laki-laki','L','10034','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(34,'Dodi Hermawan','Laki-laki','L','10044','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(35,'Eka Saputra','Laki-laki','L','10054','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(36,'Fitri Handayani','Perempuan','P','10064','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(37,'Gilang Ramadhan','Laki-laki','L','10074','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(38,'Hana Nabila','Perempuan','P','10084','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(39,'Indra Lesmana','Laki-laki','L','10094','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(40,'Jasmine Putri','Perempuan','P','10104','Aktif','2026-07-15 17:52:58','2026-07-15 17:52:58'),(41,'ipan','Laki-laki','L','15123','Aktif','2026-07-15 20:08:19','2026-07-15 20:13:18'),(42,'ipan2','Laki-laki','L','151233','Aktif','2026-07-15 20:12:52','2026-07-15 20:13:23'),(43,'ipan','Laki-laki','L','214wr25','Aktif','2026-07-15 20:15:13','2026-07-15 20:15:13'),(44,'adit sopo','Laki-laki','L','123123','Aktif','2026-07-15 22:00:30','2026-07-16 01:45:04'),(45,'Saipudin ituloh','Laki-laki','L','8124182312973123','Aktif','2026-07-15 22:33:11','2026-07-15 22:33:20'),(48,'sopo jarwo','Laki-laki','L','124124123','Aktif','2026-07-16 08:38:40','2026-07-16 08:38:40');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_assignments`
--

DROP TABLE IF EXISTS `subject_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_subject_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `task_name_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_subject_task` (`class_subject_id`,`task_name_id`),
  KEY `task_name_id` (`task_name_id`),
  CONSTRAINT `subject_assignments_ibfk_1` FOREIGN KEY (`task_name_id`) REFERENCES `task_names` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_assignments`
--

LOCK TABLES `subject_assignments` WRITE;
/*!40000 ALTER TABLE `subject_assignments` DISABLE KEYS */;
INSERT INTO `subject_assignments` VALUES (2,83,'2026-07-16 02:35:07',2),(4,1,'2026-07-16 02:39:36',3),(5,1,'2026-07-16 02:39:36',4),(6,6,'2026-07-16 02:39:36',3),(7,6,'2026-07-16 02:39:36',4),(8,11,'2026-07-16 02:39:36',3),(9,11,'2026-07-16 02:39:36',4),(10,16,'2026-07-16 02:39:36',3),(11,16,'2026-07-16 02:39:36',4),(19,83,'2026-07-16 02:44:09',5),(20,84,'2026-07-16 03:09:25',6),(21,85,'2026-07-16 03:10:23',6),(22,85,'2026-07-16 03:10:46',7),(23,86,'2026-07-16 03:16:06',8),(24,86,'2026-07-16 03:16:16',9);
/*!40000 ALTER TABLE `subject_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_periods`
--

DROP TABLE IF EXISTS `subject_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `period_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_subject_period` (`subject_id`,`period_id`),
  KEY `fk_subp_subject` (`subject_id`),
  KEY `fk_subp_period` (`period_id`),
  CONSTRAINT `fk_subp_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subp_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_periods`
--

LOCK TABLES `subject_periods` WRITE;
/*!40000 ALTER TABLE `subject_periods` DISABLE KEYS */;
INSERT INTO `subject_periods` VALUES (1,1,1,1,'2026-07-15 21:43:32'),(2,2,1,1,'2026-07-15 21:43:32'),(3,3,1,1,'2026-07-15 21:43:32'),(4,4,1,1,'2026-07-15 21:43:32'),(5,5,1,1,'2026-07-15 21:43:32'),(6,6,2,1,'2026-07-15 21:43:32'),(7,7,2,1,'2026-07-15 21:43:32'),(8,8,2,1,'2026-07-15 21:43:32'),(9,9,2,1,'2026-07-15 21:43:32'),(10,10,2,1,'2026-07-15 21:43:32'),(11,11,3,1,'2026-07-15 21:43:32'),(12,12,3,1,'2026-07-15 21:43:32'),(13,13,3,1,'2026-07-15 21:43:32'),(14,14,3,1,'2026-07-15 21:43:32'),(15,15,3,1,'2026-07-15 21:43:32'),(16,16,4,1,'2026-07-15 21:43:32'),(17,17,4,1,'2026-07-15 21:43:32'),(18,18,4,1,'2026-07-15 21:43:32'),(19,19,4,1,'2026-07-15 21:43:32'),(20,20,4,1,'2026-07-15 21:43:32'),(21,21,8,1,'2026-07-15 21:43:32'),(53,22,9,1,'2026-07-15 22:01:47'),(55,23,10,1,'2026-07-15 23:35:43'),(56,24,11,1,'2026-07-16 01:46:02'),(58,25,9,1,'2026-07-16 02:51:40'),(59,26,11,1,'2026-07-16 03:15:33');
/*!40000 ALTER TABLE `subject_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'Matematika Ganjil','MAT-1','Mata pelajaran Matematika Ganjil untuk tahun ajaran 2023/2024 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(2,'Bahasa Inggris Ganjil','BING-1','Mata pelajaran Bahasa Inggris Ganjil untuk tahun ajaran 2023/2024 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(3,'Ilmu Pengetahuan Alam Ganjil','IPA-1','Mata pelajaran Ilmu Pengetahuan Alam Ganjil untuk tahun ajaran 2023/2024 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(4,'Bahasa Indonesia Ganjil','BIND-1','Mata pelajaran Bahasa Indonesia Ganjil untuk tahun ajaran 2023/2024 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(5,'Pendidikan Agama Ganjil','PAGM-1','Mata pelajaran Pendidikan Agama Ganjil untuk tahun ajaran 2023/2024 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(6,'Matematika Genap','MAT-2','Mata pelajaran Matematika Genap untuk tahun ajaran 2023/2024 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(7,'Bahasa Inggris Genap','BING-2','Mata pelajaran Bahasa Inggris Genap untuk tahun ajaran 2023/2024 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(8,'Ilmu Pengetahuan Alam Genap','IPA-2','Mata pelajaran Ilmu Pengetahuan Alam Genap untuk tahun ajaran 2023/2024 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(9,'Bahasa Indonesia Genap','BIND-2','Mata pelajaran Bahasa Indonesia Genap untuk tahun ajaran 2023/2024 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(10,'Pendidikan Agama Genap','PAGM-2','Mata pelajaran Pendidikan Agama Genap untuk tahun ajaran 2023/2024 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(11,'Matematika Ganjil','MAT-3','Mata pelajaran Matematika Ganjil untuk tahun ajaran 2024/2025 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(12,'Bahasa Inggris Ganjil','BING-3','Mata pelajaran Bahasa Inggris Ganjil untuk tahun ajaran 2024/2025 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(13,'Ilmu Pengetahuan Alam Ganjil','IPA-3','Mata pelajaran Ilmu Pengetahuan Alam Ganjil untuk tahun ajaran 2024/2025 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(14,'Bahasa Indonesia Ganjil','BIND-3','Mata pelajaran Bahasa Indonesia Ganjil untuk tahun ajaran 2024/2025 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(15,'Pendidikan Agama Ganjil','PAGM-3','Mata pelajaran Pendidikan Agama Ganjil untuk tahun ajaran 2024/2025 Ganjil','2026-07-15 17:52:58','2026-07-15 17:52:58'),(16,'Matematika Genap','MAT-4','Mata pelajaran Matematika Genap untuk tahun ajaran 2024/2025 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(17,'Bahasa Inggris Genap','BING-4','Mata pelajaran Bahasa Inggris Genap untuk tahun ajaran 2024/2025 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(18,'Ilmu Pengetahuan Alam Genap','IPA-4','Mata pelajaran Ilmu Pengetahuan Alam Genap untuk tahun ajaran 2024/2025 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(19,'Bahasa Indonesia Genap','BIND-4','Mata pelajaran Bahasa Indonesia Genap untuk tahun ajaran 2024/2025 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(20,'Pendidikan Agama Genap','PAGM-4','Mata pelajaran Pendidikan Agama Genap untuk tahun ajaran 2024/2025 Genap','2026-07-15 17:52:58','2026-07-15 17:52:58'),(21,'MATEMATIKA','mtk','124123','2026-07-15 19:15:59','2026-07-15 19:16:15'),(22,'IPAA','ipa-12','wq','2026-07-15 22:01:47','2026-07-15 22:01:47'),(23,'ipk','ipl','lpo','2026-07-15 23:35:43','2026-07-15 23:35:43'),(24,'IPA','ipa1','IPA','2026-07-16 01:46:02','2026-07-16 01:46:02'),(25,'MATEMATIKA','MTK1','MATEMATIKA MENGHITUNG','2026-07-16 02:51:40','2026-07-16 02:51:40'),(26,'IPS','IPS1','IPS','2026-07-16 03:15:33','2026-07-16 03:15:33');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_names`
--

DROP TABLE IF EXISTS `task_names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_names` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `task_names_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_names`
--

LOCK TABLES `task_names` WRITE;
/*!40000 ALTER TABLE `task_names` DISABLE KEYS */;
INSERT INTO `task_names` VALUES (2,22,'MENYUMBLIM','KERTAS','2026-07-16 02:35:07'),(3,1,'Tugas 1: Persamaan Linier','Menghitung variabel x','2026-07-16 02:39:36'),(4,1,'Tugas 2: Kuadrat','Menghitung akar kuadrat','2026-07-16 02:39:36'),(5,22,'MEMBACA','MEMBACA LKS HALAMAN 12','2026-07-16 02:44:09'),(6,24,'MEMBACA','12312','2026-07-16 03:09:25'),(7,24,'ihgyu','oijon','2026-07-16 03:10:46'),(8,26,'MEMBACA','LKS HALAMAN 3','2026-07-16 03:16:06'),(9,26,'PIDATO','1231','2026-07-16 03:16:16');
/*!40000 ALTER TABLE `task_names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_attendance`
--

DROP TABLE IF EXISTS `teacher_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `check_in_time` varchar(20) DEFAULT NULL,
  `check_out_time` varchar(20) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `teacher_period_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=367 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_attendance`
--

LOCK TABLES `teacher_attendance` WRITE;
/*!40000 ALTER TABLE `teacher_attendance` DISABLE KEYS */;
INSERT INTO `teacher_attendance` VALUES (1,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(2,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(3,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(4,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(5,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(6,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(7,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(8,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(9,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(10,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(11,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(12,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(13,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(14,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(15,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(16,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(17,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(18,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(19,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(20,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(21,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(22,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(23,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(24,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(26,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(27,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(28,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(29,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(30,'07:00 WIB','14:00 WIB','Hadir','2023-09-10','2026-07-15 17:52:58',NULL),(31,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(32,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(33,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(34,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(35,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(36,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(37,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(38,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(39,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(40,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(41,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(42,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(43,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(44,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(45,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(46,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(47,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(48,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(49,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(50,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(51,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(52,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(53,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(54,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(56,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(57,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(58,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(59,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(60,'07:00 WIB','14:00 WIB','Hadir','2023-09-11','2026-07-15 17:52:58',NULL),(61,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(62,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(63,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(64,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(65,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(66,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(67,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(68,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(69,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(70,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(71,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(72,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(73,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(74,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(75,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(76,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(77,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(78,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(79,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(80,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(81,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(82,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(83,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(84,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(86,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(87,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(88,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(89,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(90,'07:00 WIB','14:00 WIB','Hadir','2023-09-12','2026-07-15 17:52:58',NULL),(91,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(92,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(93,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(94,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(95,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(96,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(97,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(98,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(99,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(100,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(101,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(102,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(103,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(104,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(105,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(106,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(107,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(108,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(109,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(110,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(111,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(112,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(113,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(114,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(116,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(117,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(118,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(119,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(120,'07:00 WIB','14:00 WIB','Hadir','2024-02-15','2026-07-15 17:52:58',NULL),(121,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(122,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(123,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(124,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(125,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(126,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(127,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(128,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(129,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(130,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(131,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(132,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(133,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(134,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(135,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(136,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(137,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(138,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(139,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(140,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(141,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(142,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(143,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(144,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(146,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(147,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(148,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(149,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(150,'07:00 WIB','14:00 WIB','Hadir','2024-02-16','2026-07-15 17:52:58',NULL),(151,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(152,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(153,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(154,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(155,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(156,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(157,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(158,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(159,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(160,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(161,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(162,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(163,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(164,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(165,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(166,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(167,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(168,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(169,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(170,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(171,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(172,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(173,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(174,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(176,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(177,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(178,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(179,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(180,'07:00 WIB','14:00 WIB','Hadir','2024-02-17','2026-07-15 17:52:58',NULL),(181,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(182,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(183,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(184,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(185,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(186,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(187,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(188,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(189,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(190,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(191,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(192,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(193,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(194,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(195,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(196,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(197,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(198,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(199,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(200,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(201,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(202,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(203,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(204,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(206,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(207,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(208,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(209,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(210,'07:00 WIB','14:00 WIB','Hadir','2024-09-15','2026-07-15 17:52:58',NULL),(211,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(212,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(213,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(214,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(215,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(216,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(217,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(218,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(219,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(220,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(221,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(222,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(223,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(224,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(225,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(226,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(227,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(228,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(229,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(230,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(231,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(232,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(233,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(234,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(236,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(237,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(238,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(239,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(240,'07:00 WIB','14:00 WIB','Hadir','2024-09-16','2026-07-15 17:52:58',NULL),(241,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(242,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(243,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(244,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(245,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(246,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(247,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(248,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(249,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(250,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(251,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(252,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(253,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(254,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(255,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(256,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(257,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(258,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(259,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(260,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(261,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(262,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(263,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(264,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(266,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(267,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(268,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(269,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(270,'07:00 WIB','14:00 WIB','Hadir','2024-09-17','2026-07-15 17:52:58',NULL),(271,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(272,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(273,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(274,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(275,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(276,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(277,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(278,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(279,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(280,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(281,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(282,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(283,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(284,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(285,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(286,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(287,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(288,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(289,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(290,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(291,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(292,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(293,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(294,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(296,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(297,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(298,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(299,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(300,'07:00 WIB','14:00 WIB','Hadir','2025-02-10','2026-07-15 17:52:58',NULL),(301,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(302,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(303,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(304,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(305,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(306,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(307,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(308,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(309,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(310,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(311,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(312,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(313,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(314,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(315,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(316,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(317,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(318,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(319,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(320,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(321,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(322,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(323,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(324,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(326,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(327,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(328,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(329,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(330,'07:00 WIB','14:00 WIB','Hadir','2025-02-11','2026-07-15 17:52:58',NULL),(331,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(332,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(333,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(334,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(335,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(336,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(337,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(338,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(339,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(340,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(341,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(342,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(343,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(344,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(345,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(346,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(347,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(348,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(349,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(350,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(351,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(352,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(353,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(354,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(356,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(357,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(358,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(359,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(360,'07:00 WIB','14:00 WIB','Hadir','2025-02-12','2026-07-15 17:52:58',NULL),(361,'-- : --','-- : --','Absen','2026-07-16','2026-07-15 22:03:06',94),(362,'05:42 WIB','05:42 WIB','Hadir','2026-07-16','2026-07-15 22:42:30',96),(363,'-- : --','-- : --','Izin','2026-07-16','2026-07-15 22:42:30',95),(364,'2026-07-16 05:57','2026-07-16 09:57','Hadir','2026-07-15','2026-07-15 22:58:01',95),(365,'-- : --','-- : --','Terlambat','2026-07-15','2026-07-15 22:58:01',96),(366,'2026-07-16 07:00','2026-07-16 14:00','Hadir','2026-07-16','2026-07-16 01:47:03',98);
/*!40000 ALTER TABLE `teacher_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_periods`
--

DROP TABLE IF EXISTS `teacher_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) NOT NULL,
  `period_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_period` (`teacher_id`,`period_id`),
  KEY `fk_tp_teacher` (`teacher_id`),
  KEY `fk_tp_period` (`period_id`),
  CONSTRAINT `fk_tp_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tp_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_periods`
--

LOCK TABLES `teacher_periods` WRITE;
/*!40000 ALTER TABLE `teacher_periods` DISABLE KEYS */;
INSERT INTO `teacher_periods` VALUES (1,98,8,1,'2026-07-15 21:43:32'),(2,4,6,1,'2026-07-15 21:43:32'),(3,71,8,1,'2026-07-15 21:43:32'),(4,1,6,1,'2026-07-15 21:43:32'),(5,68,8,1,'2026-07-15 21:43:32'),(6,2,6,1,'2026-07-15 21:43:32'),(7,69,8,1,'2026-07-15 21:43:32'),(8,3,6,1,'2026-07-15 21:43:32'),(9,70,8,1,'2026-07-15 21:43:32'),(10,6,6,1,'2026-07-15 21:43:32'),(11,72,8,1,'2026-07-15 21:43:32'),(12,7,6,1,'2026-07-15 21:43:32'),(13,73,8,1,'2026-07-15 21:43:32'),(14,8,6,1,'2026-07-15 21:43:32'),(15,74,8,1,'2026-07-15 21:43:32'),(16,9,6,1,'2026-07-15 21:43:32'),(17,75,8,1,'2026-07-15 21:43:32'),(18,10,6,1,'2026-07-15 21:43:32'),(19,76,8,1,'2026-07-15 21:43:32'),(20,11,6,1,'2026-07-15 21:43:32'),(21,77,8,1,'2026-07-15 21:43:32'),(22,12,6,1,'2026-07-15 21:43:32'),(23,78,8,1,'2026-07-15 21:43:32'),(24,13,6,1,'2026-07-15 21:43:32'),(25,79,8,1,'2026-07-15 21:43:32'),(26,14,6,1,'2026-07-15 21:43:32'),(27,80,8,1,'2026-07-15 21:43:32'),(28,15,6,1,'2026-07-15 21:43:32'),(29,81,8,1,'2026-07-15 21:43:32'),(30,16,6,1,'2026-07-15 21:43:32'),(31,82,8,1,'2026-07-15 21:43:32'),(32,17,6,1,'2026-07-15 21:43:32'),(33,83,8,1,'2026-07-15 21:43:32'),(34,18,6,1,'2026-07-15 21:43:32'),(35,84,8,1,'2026-07-15 21:43:32'),(36,19,6,1,'2026-07-15 21:43:32'),(37,85,8,1,'2026-07-15 21:43:32'),(38,20,6,1,'2026-07-15 21:43:32'),(39,86,8,1,'2026-07-15 21:43:32'),(40,21,6,1,'2026-07-15 21:43:32'),(41,87,8,1,'2026-07-15 21:43:32'),(42,22,6,1,'2026-07-15 21:43:32'),(43,88,8,1,'2026-07-15 21:43:32'),(44,23,6,1,'2026-07-15 21:43:32'),(45,89,8,1,'2026-07-15 21:43:32'),(46,24,6,1,'2026-07-15 21:43:32'),(47,90,8,1,'2026-07-15 21:43:32'),(48,25,6,1,'2026-07-15 21:43:32'),(49,91,8,1,'2026-07-15 21:43:32'),(50,27,6,1,'2026-07-15 21:43:32'),(51,92,8,1,'2026-07-15 21:43:32'),(52,28,6,1,'2026-07-15 21:43:32'),(53,93,8,1,'2026-07-15 21:43:32'),(54,29,6,1,'2026-07-15 21:43:32'),(55,94,8,1,'2026-07-15 21:43:32'),(56,30,6,1,'2026-07-15 21:43:32'),(57,95,8,1,'2026-07-15 21:43:32'),(58,31,6,1,'2026-07-15 21:43:32'),(59,96,8,1,'2026-07-15 21:43:32'),(94,6,9,1,'2026-07-15 21:59:21'),(95,99,10,1,'2026-07-15 22:20:13'),(96,6,10,1,'2026-07-15 22:20:31'),(98,98,11,1,'2026-07-16 01:43:24'),(100,102,9,1,'2026-07-16 03:02:37'),(101,103,11,1,'2026-07-16 08:09:58'),(102,104,11,1,'2026-07-16 08:22:36');
/*!40000 ALTER TABLE `teacher_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nip` varchar(50) NOT NULL,
  `specialization` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_email` (`email`),
  UNIQUE KEY `unique_teacher_nip` (`nip`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'Siti Aminahsssss, S.Pd.asfzxzc','siti.aminah@lumina.sch.id','198503122010012003','Akademik','Aktif','2026-07-12 12:28:33','2026-07-15 18:49:44'),(2,'Budi Darmawan, S.Pd.','budi.darmawan@lumina.sch.id','198801152012011004','Akademik','Aktif','2026-07-12 12:28:33','2026-07-15 18:49:44'),(3,'Rina Kartika, S.Si.','rina.kartika@lumina.sch.id','199005202015012008','Akademik','Aktif','2026-07-12 12:28:33','2026-07-15 18:49:44'),(4,'Sarah Wijaya, M.Pd','sarah.wijaya@lumina.sch.id','198207102008012001','Akademik','Aktif','2026-07-12 12:28:33','2026-07-15 18:49:44'),(6,'Sarden Kotak','saidina.sos@sekolah.sch.id','1990101012022031001','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 22:20:43'),(7,'Tri Hastuti, S.Pd','tri.hastuti.spd@sekolah.sch.id','1990201012022032002','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(8,'Elmida, S.Pd','elmida.spd@sekolah.sch.id','1990301012022031003','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(9,'Zubaidah, S.Pd','zubaidah.spd@sekolah.sch.id','1990401012022032004','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(10,'Nursa\'adah, S.Pd','nursaadah.spd@sekolah.sch.id','1990501012022031005','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(11,'Novianti P, S.Pd.sd','novianti.spdsd@sekolah.sch.id','1990601012022032006','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(12,'Yenita, S.Pd.I','yenita.spdi@sekolah.sch.id','1990701012022031007','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(13,'Abdul Rahman, S.Pd','abdul.rahman.spd@sekolah.sch.id','1990801012022032008','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(14,'M. Syafe\'i, S.Pd.I','syafei.spdi@sekolah.sch.id','1990901012022031009','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(15,'Pungky Lestari, S.Pd','pungky.lestari.spd@sekolah.sch.id','1991001012022032010','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(16,'Eti Suarti, S.Pd','eti.suarti.spd@sekolah.sch.id','1991101012022031011','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(17,'Rama Safitri, S.Pd','rama.safitri.spd@sekolah.sch.id','1991201012022032012','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(18,'Dedy Apriyanto, S.Pd','dedy.apriyanto.spd@sekolah.sch.id','1991301012022031013','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(19,'Uki Maulana SH, S.Kom','uki.maulana.sh.skom@sekolah.sch.id','1991401012022032014','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(20,'Nurmala Paisani S.Pd','nurmala.paisani.spd@sekolah.sch.id','1991501012022031015','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(21,'Kiki Rahayu, S.Pd','kiki.rahayu.spd@sekolah.sch.id','1991601012022032016','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(22,'Linda Sari, S.Pd','linda.sari.spd@sekolah.sch.id','1991701012022031017','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(23,'Banu Abidul M.S, S.E','banu.abidul.ms.se@sekolah.sch.id','1991801012022032018','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(24,'Nurhasanah','nurhasanah@sekolah.sch.id','1991901012022031019','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(25,'Qulu Bunur Heruni','qulu.bunur.heruni@sekolah.sch.id','1992001012022032020','Akademik','Aktif','2026-07-12 13:05:16','2026-07-15 18:49:44'),(27,'Tata','tata@sekolah.sch.id','199210102022032021','Non-Akademik','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44'),(28,'Arsyiah','arsyiah@sekolah.sch.id','199210102022032022','Non-Akademik','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44'),(29,'Hafidz','hafidz@sekolah.sch.id','199210102022032023','Non-Akademik','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44'),(30,'Ghina','ghina@sekolah.sch.id','199210102022032024','Non-Akademik','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44'),(31,'Defi Apriyadi','defi.apriyadi@sekolah.sch.id','199210102022032025','Non-Akademik','Aktif','2026-07-12 17:42:09','2026-07-15 18:49:44'),(98,'ipansyah keren','qwe1@qwe','125123123','Akademik','Aktif','2026-07-15 19:02:37','2026-07-16 01:43:39'),(99,'Irfan','irfanuyeh@gmail.com','12471239','Akademik','Aktif','2026-07-15 22:20:13','2026-07-15 22:20:13'),(102,'UJANG','DISINI@DINSIN','0127371','Akademik','Aktif','2026-07-16 03:02:37','2026-07-16 03:02:37'),(103,'Doni Dono','Dono@gmail.com','12345678','Akademik','Aktif','2026-07-16 08:09:58','2026-07-16 08:09:58'),(104,'Santoso','Santoso@gmail.com','087123518','Akademik','Aktif','2026-07-16 08:22:35','2026-07-16 08:22:35');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'sarah.j@lumina.edu','$2b$10$hElfpA3AGH3X2RYNFK8PLOYp7EZ6IOSRhInsEMM8I3584vogyktgm','Sarah Jenkins, M.Pd','admin','2026-07-12 12:28:33','2026-07-12 12:41:39'),(3,'budi.santoso@lumina.sch.id','$2b$10$hElfpA3AGH3X2RYNFK8PLOYp7EZ6IOSRhInsEMM8I3584vogyktgm','Budi Santoso, S.Pd.','teacher','2026-07-12 12:28:33','2026-07-12 12:41:39'),(4,'admin1@gmail.com','$2b$10$hElfpA3AGH3X2RYNFK8PLOYp7EZ6IOSRhInsEMM8I3584vogyktgm','admin1','admin','2026-07-12 12:39:17','2026-07-12 12:41:39'),(6,'kepsek1@gmail.com','$2b$10$W/V1zo2uHqcWzK6HGVFtw.04xYmM90v7dtindKYqyKcLLaGzHqiVm','Saidina','kepala_sekolah','2026-07-16 07:30:07','2026-07-16 07:30:07'),(7,'guru1@gmail.com','$2b$10$IQV1WPXOyPQ0.3LBuvLFw.6k4TC1VmZ7gOp/8dZV8Y07XCeg0hZhK','Doni Dono','teacher','2026-07-16 07:54:24','2026-07-16 07:54:24'),(8,'coach1@gmail.com','$2b$10$saLkFkdOBkvSZLDaMSS6UesEXWFJbAEZ6lRrJOys0BvoAAwAZ7UwS','Coach Indra','coach','2026-07-16 07:55:18','2026-07-16 07:55:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-16 17:54:24
