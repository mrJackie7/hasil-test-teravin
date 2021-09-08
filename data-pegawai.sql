-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.22 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for pegawai-db
CREATE DATABASE IF NOT EXISTS `pegawai-db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pegawai-db`;

-- Dumping structure for table pegawai-db.alamat
CREATE TABLE IF NOT EXISTS `alamat` (
  `idAlamat` int NOT NULL AUTO_INCREMENT,
  `idPegawai` varchar(50) NOT NULL,
  `alamat` varchar(100) NOT NULL,
  PRIMARY KEY (`idAlamat`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table pegawai-db.alamat: ~0 rows (approximately)
/*!40000 ALTER TABLE `alamat` DISABLE KEYS */;
INSERT INTO `alamat` (`idAlamat`, `idPegawai`, `alamat`) VALUES
	(1, '13130001', 'jl. ini dirumah'),
	(2, '13130002', 'jl. itu rumah'),
	(3, '21084xx9', 'Permata Tangerang'),
	(4, '21084x71', 'jl. Bersahaja 1'),
	(6, '2108b4bm', 'Jl. Meroya 3');
/*!40000 ALTER TABLE `alamat` ENABLE KEYS */;

-- Dumping structure for table pegawai-db.pegawai
CREATE TABLE IF NOT EXISTS `pegawai` (
  `idPegawai` varchar(8) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(14) DEFAULT NULL,
  `birthdate` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idPegawai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table pegawai-db.pegawai: ~0 rows (approximately)
/*!40000 ALTER TABLE `pegawai` DISABLE KEYS */;
INSERT INTO `pegawai` (`idPegawai`, `nama`, `email`, `mobile`, `birthdate`) VALUES
	('13130001', 'Admin1', 'admin@mail.com', '081299880011', '2021-12-31'),
	('21084x71', 'Jamie Oliver', 'jamie@mail.com', '087886854199', '1998-11-21'),
	('21084xx9', 'Joshua Christianto', 'joshuac@mail.com', '081218158551', '1997-12-28'),
	('2108b4bm', 'Jakson Pierce', 'jakson@mail.com', '082199657711', '0009-04-12');
/*!40000 ALTER TABLE `pegawai` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
