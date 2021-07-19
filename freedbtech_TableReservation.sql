-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th7 05, 2021 lúc 05:31 AM
-- Phiên bản máy phục vụ: 5.7.34-0ubuntu0.18.04.1
-- Phiên bản PHP: 7.2.24-0ubuntu0.18.04.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `freedbtech_TableReservation`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `AddRating` (IN `rid` INT, IN `newRating` INT)  NO SQL
BEGIN 

DECLARE numOfRv INT (11) DEFAULT 0;

    SET numOfRv = (SELECT NumOfReviewers FROM Rating WHERE Rating.rid = rid);
    
    UPDATE Rating SET Rating.NumOfReviewers = numOfRv +1, Rating.rating = (SELECT getRating(rid,newRating)) WHERE Rating.rid = rid;
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `AddRevenues` (IN `rid` INT, IN `month` INT)  NO SQL
BEGIN
	DECLARE curQty INT DEFAULT 0;
    SET curQty = (SELECT quantity FROM revenues r WHERE r.rid = rid AND r.month = month);
     UPDATE revenues r SET r.quantity = (curQty + 1) WHERE r.rid = rid AND r.month = month;
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `deleteRes` (IN `id` INT)  Delete from restaurant  where resID=id$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `getBookingList` (IN `managerID` INT, IN `status` BOOLEAN)  NO SQL
SELECT * FROM Reservation rs
LEFT JOIN voucher v
ON v.vouID = rs.vouID
LEFT JOIN restaurant r
ON r.resID = rs.rid
LEFT JOIN users u
ON u.userID = rs.uid
WHERE r.managerID = managerID
AND rs.status = status
ORDER BY rs.ReserveTime$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `getFavoriteList` (IN `uid` INT)  NO SQL
BEGIN
	SELECT * FROM favorites,restaurant
    WHERE favorites.uid = uid
    AND   favorites.rid = restaurant.resID;
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `ResetRevenues` (IN `rid` INT)  NO SQL
BEGIN
	DECLARE counter INT(11) DEFAULT 1;
	WHILE counter<=12 DO
        UPDATE revenues SET quantity=0 WHERE revenues.rid = rid AND revenues.month = counter;
        SET counter = counter +1;
        END WHILE;
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` PROCEDURE `USP_ResSearching` (IN `info` VARCHAR(20))  BEGIN
SELECT * FROM restaurant WHERE  resName LIKE CONCAT('%',info,'%') or resID LIKE CONCAT('%',info,'%') ;
END$$

--
-- Các hàm
--
CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `getRating` (`rid` INT, `newRating` INT) RETURNS FLOAT NO SQL
BEGIN
    DECLARE numOfRv INT (11) DEFAULT 0;
	DECLARE curRating float (11) DEFAULT 0;
    DECLARE setRating float (11) DEFAULT 0;
     SET numOfRv = (SELECT NumOfReviewers FROM Rating WHERE Rating.rid = rid);
     SET curRating = (SELECT rating FROM Rating WHERE Rating.rid = rid);
    
    IF (numOfRv != 0) THEN
    	SET setRating = (curRating * numOfRv + newRating)/(numOfRv +1);
    ELSE 
    	SET setRating = newRating;
    END IF;
    RETURN (SELECT format(setRating,1));
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `numOfDiners` () RETURNS INT(11) NO SQL
RETURN (SELECT COUNT(userID) FROM users WHERE userType = 3)$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `numOfFemales` () RETURNS INT(11) NO SQL
BEGIN
	RETURN (SELECT COUNT(userID) FROM users WHERE users.userGender = 1);
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `numOfMales` () RETURNS INT(11) NO SQL
BEGIN
	RETURN (SELECT COUNT(userID) FROM users WHERE users.userGender = 0);
END$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `numOfManagers` () RETURNS INT(11) NO SQL
RETURN (SELECT COUNT(userID) FROM users WHERE userType =2)$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `numOfResByManager` (`id` INT) RETURNS INT(11) NO SQL
RETURN (SELECT COUNT(resID) FROM restaurant r WHERE r.managerID = id)$$

CREATE DEFINER=`freedbtech_lequanghuy`@`%` FUNCTION `numOfRestaurants` () RETURNS INT(11) NO SQL
RETURN (SELECT COUNT(resID) from restaurant)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `uid` int(11) NOT NULL,
  `rid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `favorites`
--

INSERT INTO `favorites` (`uid`, `rid`) VALUES
(1, 38),
(3, 38),
(29, 38),
(2, 39),
(10, 39),
(29, 39),
(38, 39),
(1, 40),
(10, 40);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedBack`
--

CREATE TABLE `feedBack` (
  `feedbackID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `resID` int(11) DEFAULT NULL,
  `fbContent` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `fbDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `feedBack`
--

INSERT INTO `feedBack` (`feedbackID`, `userID`, `resID`, `fbContent`, `fbDate`) VALUES
(16, 1, 40, 'nhà hàng ngon ổn áp', '2021-05-31'),
(17, 1, 40, '1\r\n', '2021-05-31'),
(18, 29, 38, 'aaa', '2021-06-17'),
(19, 1, 40, 'Ước gì được ai bao', '2021-06-19'),
(20, 1, 42, 'a', '2021-06-20'),
(21, 1, 39, 'ngon so 1', '2021-06-21'),
(22, 1, 39, 'không hiểu sao ăn lần 1 lại muốn đi lần 2', '2021-06-21'),
(23, 10, 40, 'alo\r\n', '2021-06-22'),
(24, 29, 42, 'good', '2021-06-22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Rating`
--

CREATE TABLE `Rating` (
  `rid` int(11) NOT NULL,
  `NumOfReviewers` int(11) NOT NULL,
  `rating` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `Rating`
--

INSERT INTO `Rating` (`rid`, `NumOfReviewers`, `rating`) VALUES
(38, 10, 8.1),
(39, 12, 7),
(40, 1, 5),
(41, 0, 0),
(42, 0, 0),
(51, 0, 0),
(54, 0, 0);

--
-- Bẫy `Rating`
--
DELIMITER $$
CREATE TRIGGER `AddRating` AFTER UPDATE ON `Rating` FOR EACH ROW BEGIN
	UPDATE restaurant SET restaurant.rating = NEW.rating WHERE restaurant.resID = NEW.rid;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Reply`
--

CREATE TABLE `Reply` (
  `replyID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `resID` int(11) NOT NULL,
  `fbID` int(11) NOT NULL,
  `repContent` varchar(100) CHARACTER SET utf8 NOT NULL,
  `repDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `Reply`
--

INSERT INTO `Reply` (`replyID`, `userID`, `resID`, `fbID`, `repContent`, `repDate`) VALUES
(2, 2, 40, 19, 'Ok để Huy', '2021-06-19'),
(3, 1, 42, 20, 'b', '2021-06-20'),
(4, 1, 39, 21, 'a', '2021-06-21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `resCategory`
--

CREATE TABLE `resCategory` (
  `cateID` int(11) NOT NULL,
  `cateName` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `resCategory`
--

INSERT INTO `resCategory` (`cateID`, `cateName`) VALUES
(1, 'Buffet'),
(2, 'Món Hàn'),
(3, 'Món Nhật'),
(4, 'Món Âu');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Reservation`
--

CREATE TABLE `Reservation` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `ReserveTime` datetime NOT NULL,
  `NumOfDiners` int(11) NOT NULL,
  `Note` text CHARACTER SET utf8 COLLATE utf8_vietnamese_ci,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `vouID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `Reservation`
--

INSERT INTO `Reservation` (`id`, `uid`, `rid`, `ReserveTime`, `NumOfDiners`, `Note`, `status`, `vouID`) VALUES
(1, 1, 38, '2012-02-05 00:00:00', 3, 'a', 1, NULL),
(27, 1, 40, '2021-06-23 16:18:00', 1, 'abc', 0, NULL),
(28, 1, 40, '2021-06-14 13:00:00', 2, '', 1, NULL),
(31, 1, 38, '2021-06-25 16:15:00', 3, '', 0, NULL),
(33, 10, 38, '2021-06-09 16:28:00', 23, '', 1, NULL),
(35, 10, 38, '2021-06-30 20:00:00', 5, 'hello', 0, NULL),
(37, 3, 38, '2021-06-22 21:32:00', 3, '', 0, NULL),
(38, 3, 38, '2021-06-29 10:20:00', 3, '', 0, NULL),
(39, 3, 38, '2021-06-29 10:20:00', 3, '', 0, NULL),
(40, 38, 39, '2021-06-22 13:00:00', 2, '', 0, 3),
(42, 39, 39, '2021-07-01 11:41:00', 2, '', 0, 3),
(44, 29, 38, '2021-06-25 16:03:00', 2, 'abc', 0, 4);

--
-- Bẫy `Reservation`
--
DELIMITER $$
CREATE TRIGGER `updateVoucherQuantity` BEFORE INSERT ON `Reservation` FOR EACH ROW BEGIN
    DECLARE voucherID integer;
    SET voucherID=NEW.vouID;

 update  voucher set vouQuantity=vouQuantity-1 where vouID =voucherID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `resImage`
--

CREATE TABLE `resImage` (
  `imageID` int(11) NOT NULL,
  `resID` int(11) DEFAULT NULL,
  `resImage` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `resImage`
--

INSERT INTO `resImage` (`imageID`, `resID`, `resImage`) VALUES
(51, 38, '1622348314327--h1.jpg'),
(52, 38, '1622348314328--h2.jpg'),
(53, 38, '1622348314591--h3.jpg'),
(54, 38, '1622348314640--h4.jpg'),
(55, 38, '1622348314681--h5.jpg'),
(56, 39, '1622348520255--dk1.jpg'),
(57, 39, '1622348520368--dk2.jpg'),
(58, 39, '1622348520523--dk3.jpg'),
(59, 39, '1622348520535--dk4.jpg'),
(60, 39, '1622348520573--dk5.jpg'),
(61, 40, '1622348654219--h1.jpg'),
(62, 40, '1622348654329--h2.jpg'),
(63, 40, '1622348654331--h3.jpg'),
(64, 40, '1622348654362--h4.jpg'),
(65, 40, '1622348654384--h5.jpg'),
(66, 41, '1622348846054--k1.png'),
(67, 41, '1622348846073--k2.jpg'),
(68, 41, '1622348846227--k3.jpg'),
(69, 41, '1622348846252--k4.png'),
(70, 41, '1622348846278--k5.jpg'),
(71, 42, '1622348903199--g4.jpg'),
(72, 42, '1622348903253--g5.jpg'),
(73, 42, '1622348903373--gg1.png'),
(74, 42, '1622348903405--gg2.jpg'),
(75, 42, '1622348903408--gg3.jpg'),
(89, 51, '1624176283656--k1.jpg'),
(90, 51, '1624176283658--k2.jpg'),
(91, 51, '1624176283706--k3.jpg'),
(92, 51, '1624176283713--k4.jpg'),
(93, 51, '1624176283718--k5.jpg'),
(112, 54, '1624349284789--foody-mobile-pdin-jpg.jpg'),
(113, 54, '1624349284821--foody-mobile-uraetei-jpg-738-635671245515629361.jpg'),
(114, 54, '1624349285112--MENU-WEBSITE-02.jpg'),
(115, 54, '1624349286593--MENU-WEBSITE-03.jpg'),
(116, 54, '1624349287581--uraetei-bbq-japan-nha-hang-pho-dinh-324710.jpg'),
(117, 54, '1624349287734--vpg1587613843.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `resMenu`
--

CREATE TABLE `resMenu` (
  `id` int(11) NOT NULL,
  `menu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `resMenu`
--

INSERT INTO `resMenu` (`id`, `menu`) VALUES
(38, '{\"starters\":[{\"type\":\"separator\",\"description\":\"APPETIZERS\"},{\"type\":\"food\",\"name\":\"CAESAR`S SALAD\",\"description\":\"Lettuce with fried baconstrips, croûtons, Grana Padano, egg and Caesar Dressing\",\"price\":\"16.00\"},{\"type\":\"food\",\"name\":\"Gỏi\",\"description\":\"Tôm, mực, salad\"}],\"mains\":[{\"type\":\"separator\",\"description\":\"PIZZA\"},{\"type\":\"food\",\"name\":\"MARGHERITA\",\"description\":\"Tomato sauce, mozzarella, organic oregano\",\"price\":\"18.00\"},{\"type\":\"food\",\"name\":\"PROSCIUTTO\",\"description\":\"Tomato sauce, mozzarella, ham, organic oregano\",\"price\":\"21.50\"},{\"type\":\"food\",\"name\":\"RAVIOLI\",\"description\":\"filled with truffle-ricotta and hazelnuts butter\",\"price\":\"28.50\"},{\"type\":\"food\",\"name\":\"Lẩu cua bể\",\"description\":\"Cua đồng, rau, mỳ\"}],\"desserts\":[{\"type\":\"separator\",\"description\":\"SWEETS\"},{\"type\":\"food\",\"name\":\"FRUIT SALAD\",\"description\":\"exotic fruits with tapioca pearls mango sorbet and homemade coconut liqueur\",\"price\":\"10.50\"}],\"drinks\":[{\"type\":\"separator\",\"description\":\"WATER & SODA\"},{\"type\":\"drink\",\"name\":\"SPARKLING WATER\",\"description\":\"5dl\",\"price\":\"4.50\"},{\"type\":\"drink\",\"name\":\"TEA\",\"description\":\"\",\"price\":\"5.00\"},{\"type\":\"drink\",\"name\":\"Bia tiger\",\"description\":\"lon\"}]}'),
(39, '{\"starters\":[{\"type\":\"food\",\"name\":\"Khoai tây chiên\",\"description\":\"Khoai tây\"},{\"type\":\"food\",\"name\":\"Salad sốt mè\",\"description\":\"Salad tươi xanh\"}],\"mains\":[{\"type\":\"food\",\"name\":\"Sheep Baby\",\"description\":\"Thịt tươi\"}],\"desserts\":[],\"drinks\":[]}'),
(40, '{\"starters\":[],\"mains\":[],\"desserts\":[],\"drinks\":[]}');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `restaurant`
--

CREATE TABLE `restaurant` (
  `resID` int(11) NOT NULL,
  `resName` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `resAddress` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `resPhone` varchar(15) DEFAULT NULL,
  `resThumbnail` varchar(50) NOT NULL,
  `resOpen` varchar(20) NOT NULL,
  `resClose` varchar(20) NOT NULL,
  `resPrice` float NOT NULL,
  `rating` float DEFAULT '0',
  `managerID` int(11) NOT NULL,
  `resCate` int(11) DEFAULT NULL,
  `resDescription` varchar(1000) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `restaurant`
--

INSERT INTO `restaurant` (`resID`, `resName`, `resAddress`, `resPhone`, `resThumbnail`, `resOpen`, `resClose`, `resPrice`, `rating`, `managerID`, `resCate`, `resDescription`) VALUES
(38, 'Halidao', 'Tháp Bitexco Financial Tower', '028 7300 6642', '1622348314640--h4.jpg', '8:00', '22:00', 400000, 8.1, 1, 1, 'Haidilao là một trong những thương hiệu lẩu nổi tiếng hàng đầu ở Trung Quốc. Và hiện nay đã du nhập vào nước ta. Mang lại một trải nghiệm thú vị thu hút rất nhiều tín đồ ẩm thực tìm đến thưởng thức. Chắc hẳn bạn đã nghe về “Tinh hoa lẩu Trung Quốc”. Vậy thì bạn đừng bỏ qua Hailidao Hotpot nhé.Haidilao là một trong những thương hiệu lẩu nổi tiếng hàng đầu ở Trung Quốc. Và hiện nay đã du nhập vào nước ta. Mang lại một trải nghiệm thú vị thu hút rất nhiều tín đồ ẩm thực tìm đến thưởng thức. Chắc hẳn bạn đã nghe về “Tinh hoa lẩu Trung Quốc”. Vậy thì bạn đừng bỏ qua Hailidao Hotpot nhé.'),
(39, 'Dokki', '101 Tôn Dật Tiên, Quận 7', '028 7300 6642', '1622348520255--dk1.jpg', '8:00', '22:30', 150000, 7, 1, 2, 'Dookki Việt Nam như phát súng nổ cho sự kết hợp giữa buffet và lẩu topokki, thay vì chỉ phục vụ kinh doanh các món tokbokki riêng lẻ. Tạo nên xu thế mới trong phong cách thưởng thức món Hàn dành cho giới trẻ Việt Nam.'),
(40, 'Hotpot', 'Crescent Mall. Quận 7, Thành phô Hồ Chí Minh', '098 813 55 11', '1622348654219--h1.jpg', '8:00', '22:00', 150000, 5, 1, 3, 'Chuc quy khach ngon mieng'),
(41, 'Kichi', '816 Sư Vạn Hạnh, Quận 10', '028 7300 0097', '1622348846054--k1.png', '8:00', '22:30', 200000, 0, 1, 4, 'Chuc quy khach ngon mieng'),
(42, 'Gogi ', ' Lê Lợi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', '098 813 55 11', '1622348903199--g4.jpg', '8:00', '22:30', 300000, 0, 3, 1, 'Chuc quy khach ngon mieng'),
(51, 'King BBQ', '101 Tôn Dật Tiên, Tân Phú, Quận 7, Thành phố Hồ Chí Minh', '028 7300 6642', '1624175930368--k1.jpg', '8:00', '22:00', 300000, 0, 1, 2, 'Chuc quy khach ngon mieng'),
(54, 'Phổ Đình', 'AEON MALL Tân phú, quận Tân Phú, Thành Phố Hồ Chí Minh', '07862919939', '1624349284789--foody-mobile-pdin-jpg.jpg', '9:00', '23:00', 500000, 0, 1, 1, NULL);

--
-- Bẫy `restaurant`
--
DELIMITER $$
CREATE TRIGGER `AddRestaurant` AFTER INSERT ON `restaurant` FOR EACH ROW BEGIN 
DECLARE counter INT(11) DEFAULT 1;
    	UPDATE statistic SET statistic.quantity = (SELECT numOfRestaurants()) WHERE staName = 'restaurants';
        INSERT INTO Rating VALUES(NEW.resID,0,0); 
        WHILE counter<=12 DO
        INSERT INTO revenues VALUES(NEW.resID,counter,0);
        SET counter = counter +1;
        END WHILE;
        
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `ResQuantityAfterDelete` AFTER DELETE ON `restaurant` FOR EACH ROW BEGIN 
    	UPDATE statistic SET statistic.quantity = (SELECT numOfRestaurants()) WHERE staName = 'restaurants';
        DELETE FROM Rating WHERE Rating.rid = OLD.resID;
        DELETE FROM revenues WHERE revenues.rid = OLD.resID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `revenues`
--

CREATE TABLE `revenues` (
  `rid` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `revenues`
--

INSERT INTO `revenues` (`rid`, `month`, `quantity`) VALUES
(38, 1, 10),
(38, 2, 6),
(38, 3, 8),
(38, 4, 22),
(38, 5, 4),
(38, 6, 6),
(38, 7, 0),
(38, 8, 0),
(38, 9, 0),
(38, 10, 0),
(38, 11, 0),
(38, 12, 0),
(39, 1, 12),
(39, 2, 20),
(39, 3, 40),
(39, 4, 28),
(39, 5, 15),
(39, 6, 5),
(39, 7, 0),
(39, 8, 0),
(39, 9, 0),
(39, 10, 0),
(39, 11, 0),
(39, 12, 0),
(40, 1, 30),
(40, 2, 60),
(40, 3, 80),
(40, 4, 82),
(40, 5, 78),
(40, 6, 11),
(40, 7, 0),
(40, 8, 0),
(40, 9, 0),
(40, 10, 0),
(40, 11, 0),
(40, 12, 0),
(41, 1, 50),
(41, 2, 60),
(41, 3, 58),
(41, 4, 30),
(41, 5, 70),
(41, 6, 7),
(41, 7, 0),
(41, 8, 0),
(41, 9, 0),
(41, 10, 0),
(41, 11, 0),
(41, 12, 0),
(42, 1, 6),
(42, 2, 5),
(42, 3, 2),
(42, 4, 3),
(42, 5, 4),
(42, 6, 5),
(42, 7, 0),
(42, 8, 0),
(42, 9, 0),
(42, 10, 0),
(42, 11, 0),
(42, 12, 0),
(51, 1, 0),
(51, 2, 0),
(51, 3, 0),
(51, 4, 0),
(51, 5, 0),
(51, 6, 0),
(51, 7, 0),
(51, 8, 0),
(51, 9, 0),
(51, 10, 0),
(51, 11, 0),
(51, 12, 0),
(54, 1, 0),
(54, 2, 0),
(54, 3, 0),
(54, 4, 0),
(54, 5, 0),
(54, 6, 0),
(54, 7, 0),
(54, 8, 0),
(54, 9, 0),
(54, 10, 0),
(54, 11, 0),
(54, 12, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `statistic`
--

CREATE TABLE `statistic` (
  `id` int(11) NOT NULL,
  `staName` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `statistic`
--

INSERT INTO `statistic` (`id`, `staName`, `quantity`) VALUES
(1, 'diners', 11),
(2, 'managers', 2),
(3, 'restaurants', 7),
(4, 'male', 12),
(5, 'female', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `userFName` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `userNameID` varchar(40) NOT NULL,
  `userPassword` varchar(50) DEFAULT NULL,
  `userType` int(11) NOT NULL DEFAULT '3',
  `userPhone` varchar(20) NOT NULL DEFAULT '0',
  `userPic` varchar(100) DEFAULT NULL,
  `userBirth` varchar(20) DEFAULT NULL,
  `userEmail` varchar(50) DEFAULT NULL,
  `userGender` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`userID`, `userFName`, `userNameID`, `userPassword`, `userType`, `userPhone`, `userPic`, `userBirth`, `userEmail`, `userGender`) VALUES
(1, 'Truong Minh Hoang', 'tmh', '1', 2, '09090909090', 'wallpaperflare.com_wallpaper (6).jpg', '12-6-2000', 'tmhoang126@gmail.com', 0),
(2, 'huy', 'admin', '1', 1, '0376758217', 'My_new_project.png', NULL, NULL, 0),
(3, 'tu', 'tunguyen', '1', 2, '0376758217', 'images (4).jpg', NULL, 'yahoo', 1),
(10, 'khang', 'hmk', '1', 3, '12345', 'bn.jpg', '0', 'gmail', 0),
(29, 'Trương Minh Hoàng', 'tmhoangs1206@gmail.com', '1728672587328472', 3, '0', 'HD wallpaper_ shade of green landscape wallpaper, forest, Firewatch, nature.jpg', NULL, 'tmhoangs1206@gmail.com', 0),
(30, 'Huy Lê', 'lequanghuy2909@gmail.com', NULL, 3, '0', NULL, NULL, 'lequanghuy2909@gmail.com', 0),
(31, 'Truong Minh Hoang', '18110016@student.hcmute.edu.vn', NULL, 3, '0', NULL, NULL, '18110016@student.hcmute.edu.vn', 0),
(32, 'Lee Huy', 'lucky_boy0002002@yahoo.com', '2034444343370167', 3, '0', NULL, NULL, 'lucky_boy0002002@yahoo.com', 0),
(38, 'Cam Tu', 'camtunguyen', '1111111', 3, '0376758217', '106507914_3094717650609382_8575248962534251903_o.jpg', '13/12/2000', 'camtu.nguyenthi1312200079@gmail.com', 0),
(39, 'Nguyen Thi Cam Tu', 'cmt', '111111', 3, '0376758217', '116521848_3187833644631115_2995975669461646214_o.jpg', '13/12/2000', 'camtu.nguyenthi1312200079@gmail.com.vn', 0),
(40, 'Nairubi Cẩm Tú', 'camtu.nguyenthi1312200079@gmail.com', '1407385026283814', 3, '0376758217', '165095892_1350644398624544_1626193699204963435_n.jpg', NULL, 'camtu.nguyenthi1312200079@gmail.com', 1),
(41, 'Nguyen Thi Cam Tu', '18110063@student.hcmute.edu.vn', NULL, 3, '0376758217', 'student_1.Jpeg', NULL, '18110063@student.hcmute.edu.vn', 0),
(44, 'Nguyen Thi Cam Tu', 'ctmn', '111111', 3, '0376758217', '116584491_3193142290766917_597171109094102690_o.jpg', '13/12/2000', 'gmail', 0),
(45, 'Khang Hoang', 'khanghoang1702@gmail.com', '1074447803087393', 3, '0', NULL, NULL, 'khanghoang1702@gmail.com', 0);

--
-- Bẫy `users`
--
DELIMITER $$
CREATE TRIGGER `UserQuantityAfterDelete` AFTER DELETE ON `users` FOR EACH ROW BEGIN 
    IF OLD.userType = 3 THEN
    	UPDATE statistic SET statistic.quantity = (SELECT numOfDiners()) WHERE staName = 'diners';
    ELSEIF OLD.userType = 2 THEN
    	UPDATE statistic SET statistic.quantity= (SELECT numOfManagers()) WHERE staName = 'managers';
    END IF;
    IF OLD.userGender = 0 THEN
    UPDATE statistic SET statistic.quantity = (SELECT numOfMales()) WHERE staName = "male";
    ELSE
      UPDATE statistic SET statistic.quantity = (SELECT numOfFemales()) WHERE staName = "female";
     END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updateNumUsers` AFTER INSERT ON `users` FOR EACH ROW BEGIN 
    IF NEW.userType = 3 THEN
    	UPDATE statistic SET statistic.quantity = (SELECT numOfDiners()) WHERE staName = 'diners';
    ELSEIF NEW.userType = 2 THEN
    	UPDATE statistic SET statistic.quantity= (SELECT numOfManagers()) WHERE staName = 'managers';
    END IF;
    IF NEW.userGender = 0 THEN
    UPDATE statistic SET statistic.quantity = (SELECT numOfMales()) WHERE staName = "male";
    ELSE
      UPDATE statistic SET statistic.quantity = (SELECT numOfFemales()) WHERE staName = "female";
     END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_type`
--

CREATE TABLE `user_type` (
  `id` int(11) NOT NULL,
  `typeName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `user_type`
--

INSERT INTO `user_type` (`id`, `typeName`) VALUES
(1, 'admin'),
(2, 'manager'),
(3, 'user');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

CREATE TABLE `voucher` (
  `vouID` int(11) NOT NULL,
  `vouValue` varchar(10) NOT NULL,
  `vouQuantity` int(11) DEFAULT '1',
  `resID` int(11) NOT NULL,
  `vouKey` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`vouID`, `vouValue`, `vouQuantity`, `resID`, `vouKey`) VALUES
(3, '10', 2, 39, 'I9VdQ8a'),
(4, '10', 2, 38, 'qjVVNOG'),
(6, '15', 3, 39, 'D063UlY'),
(7, '20', 5, 54, 'E19PiIr'),
(8, '15', 5, 51, 'Qpk3Pmu');

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `vwListRestaurant`
-- (See below for the actual view)
--
CREATE TABLE `vwListRestaurant` (
`resID` int(11)
,`resName` varchar(100)
,`resAddress` varchar(100)
,`resPhone` varchar(15)
,`resThumbnail` varchar(50)
,`resOpen` varchar(20)
,`resClose` varchar(20)
,`resPrice` float
,`rating` float
,`managerID` int(11)
);

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `vwListUser`
-- (See below for the actual view)
--
CREATE TABLE `vwListUser` (
`userID` int(11)
,`userFName` varchar(20)
,`userNameID` varchar(40)
,`userPassword` varchar(50)
,`userType` int(11)
,`userPhone` varchar(20)
,`userPic` varchar(100)
,`userBirth` varchar(20)
,`userEmail` varchar(50)
,`userGender` int(11)
);

-- --------------------------------------------------------

--
-- Cấu trúc cho view `vwListRestaurant`
--
DROP TABLE IF EXISTS `vwListRestaurant`;

CREATE ALGORITHM=UNDEFINED DEFINER=`freedbtech_lequanghuy`@`%` SQL SECURITY DEFINER VIEW `vwListRestaurant`  AS  select `restaurant`.`resID` AS `resID`,`restaurant`.`resName` AS `resName`,`restaurant`.`resAddress` AS `resAddress`,`restaurant`.`resPhone` AS `resPhone`,`restaurant`.`resThumbnail` AS `resThumbnail`,`restaurant`.`resOpen` AS `resOpen`,`restaurant`.`resClose` AS `resClose`,`restaurant`.`resPrice` AS `resPrice`,`restaurant`.`rating` AS `rating`,`restaurant`.`managerID` AS `managerID` from `restaurant` ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `vwListUser`
--
DROP TABLE IF EXISTS `vwListUser`;

CREATE ALGORITHM=UNDEFINED DEFINER=`freedbtech_lequanghuy`@`%` SQL SECURITY DEFINER VIEW `vwListUser`  AS  select `users`.`userID` AS `userID`,`users`.`userFName` AS `userFName`,`users`.`userNameID` AS `userNameID`,`users`.`userPassword` AS `userPassword`,`users`.`userType` AS `userType`,`users`.`userPhone` AS `userPhone`,`users`.`userPic` AS `userPic`,`users`.`userBirth` AS `userBirth`,`users`.`userEmail` AS `userEmail`,`users`.`userGender` AS `userGender` from `users` ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`uid`,`rid`),
  ADD KEY `rid` (`rid`);

--
-- Chỉ mục cho bảng `feedBack`
--
ALTER TABLE `feedBack`
  ADD PRIMARY KEY (`feedbackID`),
  ADD KEY `feedBack_ibfk_1` (`userID`),
  ADD KEY `feedBack_ibfk_2` (`resID`);

--
-- Chỉ mục cho bảng `Rating`
--
ALTER TABLE `Rating`
  ADD PRIMARY KEY (`rid`);

--
-- Chỉ mục cho bảng `Reply`
--
ALTER TABLE `Reply`
  ADD PRIMARY KEY (`replyID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `resID` (`resID`),
  ADD KEY `fbID` (`fbID`);

--
-- Chỉ mục cho bảng `resCategory`
--
ALTER TABLE `resCategory`
  ADD PRIMARY KEY (`cateID`);

--
-- Chỉ mục cho bảng `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `rid` (`rid`),
  ADD KEY `Reservation_ibfk_3` (`vouID`);

--
-- Chỉ mục cho bảng `resImage`
--
ALTER TABLE `resImage`
  ADD PRIMARY KEY (`imageID`),
  ADD KEY `resImage_ibfk_1` (`resID`);

--
-- Chỉ mục cho bảng `resMenu`
--
ALTER TABLE `resMenu`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`resID`),
  ADD KEY `fk_managerID` (`managerID`),
  ADD KEY `restaurant_ibfk_1` (`resCate`);

--
-- Chỉ mục cho bảng `revenues`
--
ALTER TABLE `revenues`
  ADD PRIMARY KEY (`rid`,`month`);

--
-- Chỉ mục cho bảng `statistic`
--
ALTER TABLE `statistic`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `userType` (`userType`);

--
-- Chỉ mục cho bảng `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`vouID`),
  ADD KEY `voucher_ibfk_1` (`resID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `feedBack`
--
ALTER TABLE `feedBack`
  MODIFY `feedbackID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT cho bảng `Reply`
--
ALTER TABLE `Reply`
  MODIFY `replyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT cho bảng `resCategory`
--
ALTER TABLE `resCategory`
  MODIFY `cateID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT cho bảng `Reservation`
--
ALTER TABLE `Reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT cho bảng `resImage`
--
ALTER TABLE `resImage`
  MODIFY `imageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;
--
-- AUTO_INCREMENT cho bảng `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `resID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
--
-- AUTO_INCREMENT cho bảng `statistic`
--
ALTER TABLE `statistic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
--
-- AUTO_INCREMENT cho bảng `user_type`
--
ALTER TABLE `user_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `vouID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `feedBack`
--
ALTER TABLE `feedBack`
  ADD CONSTRAINT `feedBack_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedBack_ibfk_2` FOREIGN KEY (`resID`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `Rating`
--
ALTER TABLE `Rating`
  ADD CONSTRAINT `Rating_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `Reply`
--
ALTER TABLE `Reply`
  ADD CONSTRAINT `Reply_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Reply_ibfk_2` FOREIGN KEY (`resID`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Reply_ibfk_3` FOREIGN KEY (`fbID`) REFERENCES `feedBack` (`feedbackID`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Reservation_ibfk_3` FOREIGN KEY (`vouID`) REFERENCES `voucher` (`vouID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `resImage`
--
ALTER TABLE `resImage`
  ADD CONSTRAINT `resImage_ibfk_1` FOREIGN KEY (`resID`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `resMenu`
--
ALTER TABLE `resMenu`
  ADD CONSTRAINT `resMenu_ibfk_1` FOREIGN KEY (`id`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `restaurant`
--
ALTER TABLE `restaurant`
  ADD CONSTRAINT `fk_managerID` FOREIGN KEY (`managerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`resCate`) REFERENCES `resCategory` (`cateID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userType`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD CONSTRAINT `voucher_ibfk_1` FOREIGN KEY (`resID`) REFERENCES `restaurant` (`resID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
