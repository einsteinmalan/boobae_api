-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 11, 2019 at 02:12 AM
-- Server version: 5.6.43
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `boobae`
--
-- CREATE DATABASE IF NOT EXISTS `boobae` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- CREATE DATABASE IF NOT EXISTS `boobae` DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `boobae` DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_general_ci;
USE `boobae`;

-- --------------------------------------------------------

--  ---------->ADDED BY ME ##BEGINING##


-- --------------------------------------------------------

--
-- Table structure for table `promoteself`
--

CREATE TABLE `promoteself` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4,
  `description` longtext CHARACTER SET utf8mb4,
  `image_url` varchar(255) NOT NULL DEFAULT 'N/A',
  `everybody_see` tinyint(1) DEFAULT 1,
  `lon` int(11) NOT NULL DEFAULT 0,
  `lat` int(11) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------------

--
-- Table structure for table `educationals`
--

CREATE TABLE `educationals` (
  `id` int(11) NOT NULL,
  `tag_id` varchar(255) NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) NOT NULL DEFAULT 'N/A',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tag_id` int(5) DEFAULT NULL,
  `min_color` int(5) NOT NULL DEFAULT 0,
  `max_color` int(5) NOT NULL DEFAULT 0,
  `image_url` varchar(255) NOT NULL DEFAULT 'N/A',
  `message_text` text CHARACTER SET utf8mb4,
  `lon` int(11) NOT NULL DEFAULT 0,
  `lat` int(11) NOT NULL DEFAULT 0,
  `everybody_see` tinyint(1) DEFAULT 1,
   `chat_request` tinyint(1) DEFAULT 0,
   `show_to` enum('Men','Women','Both') NOT NULL DEFAULT 'Both',

  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `configurations`
--

CREATE TABLE `configurations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_id` varchar(255) NOT NULL,
   `from` enum('quiz','story','N/A') NOT NULL DEFAULT 'N/A',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------
--
-- Table structure for table `seens`
--

CREATE TABLE `seens` (
  `id` int(11) NOT NULL,
    `status_id` int(11) NOT NULL,
   `user_id` int(11) NOT NULL,
   `author_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboards` (
  `id` int(11) NOT NULL,
   `user_id` int(11) NOT NULL,
   `silver_medal` int(11) NOT NULL DEFAULT 0,
       `copper_medal` int(11) NOT NULL DEFAULT 0,
   `gold_medal` int(11) NOT NULL DEFAULT 0,
   `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rank`
--

CREATE TABLE `ranks` (
  `id` int(11) NOT NULL,
   `user_id` int(11) NOT NULL,
   `leaderboard_id` int(11) NOT NULL DEFAULT 0,
   `total_points` int(5) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `daily`
--

CREATE TABLE `daily` (
  `id` int(11) NOT NULL AUTO_INCREMENT ,
   `user_id` int(11) NOT NULL,
   `leaderboard_id` int(11) NOT NULL DEFAULT 0,
   `total_points` int(5) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `weekly`
--

CREATE TABLE `weekly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
   `user_id` int(11) NOT NULL,
   `leaderboard_id` int(11) NOT NULL DEFAULT 0,
   `total_points` int(5) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------


--
-- Table structure for table `monthly`
--

CREATE TABLE `monthly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
   `user_id` int(11) NOT NULL,
   `leaderboard_id` int(11) NOT NULL DEFAULT 0,
   `total_points` int(5) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------



--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
   `last_seen` enum('everyone','contact','nobody') NOT NULL DEFAULT 'everyone',
   `profile_photo` enum('everyone','contact','nobody') NOT NULL DEFAULT 'everyone',
   `about` enum('everyone','contact','nobody') NOT NULL DEFAULT 'everyone',
   `story` enum('everyone','contact','nobody') NOT NULL DEFAULT 'everyone',
   `enter_be_send` enum('yes','no') NOT NULL DEFAULT 'no',
   `auto_delete_chat` enum('yes','no') NOT NULL DEFAULT 'no',
   `activate_social` enum('yes','no') NOT NULL DEFAULT 'yes',
   `disable_account` enum('yes','no') NOT NULL DEFAULT 'no',
   `status` longtext CHARACTER SET utf8mb4,
   `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- --------------------------------------------------------

-- --------------------------------------------------------

-- -------> ADDED BY ME ##END##

--
-- Table structure for table `block`
--

CREATE TABLE `block` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blocking_id` int(11) NOT NULL,
   `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
   `reason` varchar(255) NOT NULL DEFAULT 'Add me please',
   `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` int(5) NOT NULL,
  `room_id` varchar(255) NOT NULL,
  `user_1` int(11) NOT NULL,
  `user_2` int(11) NOT NULL,
  `username_1` varchar(255) NOT NULL,
  `username_2` varchar(255) NOT NULL,
  `last_message` timestamp NULL DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(5) NOT NULL,
  `content` mediumtext CHARACTER SET utf8mb4 NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` varchar(255) NOT NULL,
  `image` longtext,
  `tag_id` int(11) NOT NULL DEFAULT -1,
  `is_replied` int(15) NOT NULL DEFAULT 0,
  `replied_to` int(11) NOT NULL DEFAULT -1,
  `sticker_id` int(11) NOT NULL DEFAULT -1,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_username` varchar(255) DEFAULT NULL,
  `type` enum('like','message','visit','dislike','like_back') NOT NULL,
  `data` varchar(255) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `isRead` tinyint(4) NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pictures`
--

CREATE TABLE `pictures` (
  `id` int(5) NOT NULL,
  `user_id` int(11) NOT NULL,
  `url` longtext NOT NULL,
  `pic_index` int(11) NOT NULL,
  `profile_picture` tinyint(1) NOT NULL DEFAULT '0',
   `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pictures`
--

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reporting_id` int(11) NOT NULL,
  `reason` enum('rude','racist','pervert','sexual_harrassment','insolent','threats','boring') DEFAULT 'rude'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tags`
--

-- INSERT INTO `configurations` (`name`, `value`) VALUES ("Free Request", "3"), ("VIP Request", "50"),("Tag Max", "20");

INSERT INTO `tags` (`tag_id`, `value`) VALUES
(1, 'Jackhammer'),
(2, 'Out of Sight'),
(3, 'Sword Swallower'),
(4, 'Double Dare'),
(5, 'Up Against The Wall'),
(6, 'The Tipster'),
(7, 'Two-4-One'),
(8, 'The Chin Rest'),
(9, 'Hold The Pickle'),
(10, 'Ladies First'),
(11, 'Lady in Waiting'),
(12, 'All Hands On Deck'),
(13, 'Happy Hands'),
(14, 'The Vibe'),
(15, 'Good Vibrations'),
(16, 'Footsie'),
(17, 'Tango'),
(18, 'Love Bug'),
(19, 'Missionary'),
(20, 'Butter Churner'),
(21, 'Spread Eagle'),
(22, 'The Snow Angel'),
(23, 'The Spork'),
(24, 'Over The Edge'),
(25, 'Hot And Spicy'),
(26, 'The Cuddler'),
(27, 'The Wow Wow'),
(28, 'Doggy Style'),
(29, 'Spooning'),
(30, 'CEO'),
(31, 'Sleeping Beauty'),
(32, 'Body Booster'),
(33, 'Ladies’ Choice'),
(34, 'Chair Lift'),
(35, 'Desk Set'),
(36, 'From Ball to Wall'),
(37, 'Hula Girl'),
(38, 'Back Bend'),
(39, 'The Tumbler'),
(40, 'The Headlock'),
(41, 'The Pin-Up'),
(42, 'Dirty Doggy'),
(43, 'The Flat Back'),
(44, 'The Buffet'),
(45, 'Kissing The Pink'),
(46, 'Head Rush'),
(47, 'Stand and Deliver'),
(48, 'Takeoff'),
(49, 'Wheelbarrow'),
(50, 'Superman'),
(51, 'Elephant'),
(52, 'Wall'),
(53, 'The Swing'),
(54, 'Stand and Carry'),
(55, 'The Bodyguard'),
(56, 'Upside Down'),
(57, 'Spiderman'),
(58, 'Amazon'),
(59, 'Cowgirl'),
(60, 'Full Nelson'),
(61, 'The Crab'),
(62, 'Reverse Cowgirl'),
(63, 'Squat'),
(64, 'Seesaw'),
(65, 'Airplane'),
(66, 'The Acrobat'),
(67, 'Boys On The Side'),
(68, 'Lotus'),
(69, 'Scissor'),
(70, 'Spider'),
(71, 'Face-to-Face'),
(72, 'Side Saddle'),
(73, 'Pretzel'),
(74, 'Trampoline'),
(75, 'Sitting Bull'),
(76, 'Man Trap'),
(77, 'The Firm'),
(78, 'Heaven Knows'),
(79, 'Highway To Moon'),
(80, 'The Anchor'),
(81, 'Piledriver'),
(82, 'Butterfly'),
(83, 'Speed Bump'),
(84, 'Eiffel Tower'),
(85, 'Cowboy'),
(86, 'Sideways'),
(87, 'Frog'),
(88, 'The Crab'),
(89, 'Flatiron'),
(90, 'Anvil'),
(91, 'Prone Bone'),
(92, 'Legs Up'),
(93, 'Turtle'),
(94, 'Deep Impact'),
(95, 'Launch Pad'),
(96, 'Roller Coaster'),
(97, 'Corkscrew'),
(98, "Aphrodite's Delight"),
(99, 'Aquarius'),
(100, 'Back Up'),
(101, 'Belly Flop'),
(102, 'Body Booster'),
(103, 'Boot it Up'),
(104, 'Buckin’ Bronco'),
(105, 'Crossed Spoons'),
(106, 'Crouching Tiger'),
(107, 'Downward Dog'),
(108, 'Dutch Pretzel'),
(109, 'Easy Rider'),
(110, 'Electric Slide'),
(111, 'Evolved Dog'),
(112, 'Fetch'),
(113, 'Fill Her Up'),
(114, 'Foot in Mouth'),
(115, 'He Is Man'),
(116, 'Hideaway'),
(117, 'Inside Out'),
(118, 'Lock and Load'),
(119, 'Love Pump'),
(120, 'Man Overboard'),
(121, 'Manual Control'),
(122, 'Nutcracker'),
(123, 'On a Deadline'),
(124, 'On a Tilt'),
(125, 'Overtime'),
(126, 'Reverse Missionary'),
(127, 'Tetherball'),
(128, 'The Big Bounce'),
(129, 'The X Factor'),
(130, '69'),
(131, 'On The Level'),
(132, 'Ottoman Emperor'),
(133, 'Passion Press'),
(134, 'Power Pumper'),
(135, 'Raise the Mast'),
(136, 'Rapunzel'),
(137, 'Reverse 69 Back'),
(138, 'Reverse Jockey'),
(139, 'Reverse The Ride'),
(140, 'Row Row Row'),
(141, 'Screw-it-Tight'),
(142, 'Sidewinder'),
(143, 'Sinkhole'),
(144, 'Tantalizing Tee-off'),
(145, 'Tantric Cuddle'),
(146, 'Bicyclist'),
(147, 'The Bridge'),
(148, 'The Crankshaft'),
(149, 'The Crazy Cat'),
(150, 'The Down Low'),
(151, 'The Dumbbell'),
(152, 'The Love Seat'),
(153, 'The Magic Slide'),
(154, 'The Panorama'),
(155, 'The Rev-it-Up Rub'),
(156, 'The Rocker'),
(157, 'The Sitting Cat'),
(158, 'The Speed Racer'),
(159, 'The Spotter'),
(160, 'The Stallion'),
(161, 'The Straddle'),
(162, 'The Surprise'),
(163, 'The Tender Embrace'),
(164, 'The Wave'),
(165, 'Three-Finger Thrill'),
(166, 'Tilt-a-Girl'),
(167, 'Waterfall'),
(168, 'Waterslide'),
(169, 'Windmill'),
(170, 'Yawning'),
(171, 'Butterfly in Flight'),
(172, 'Chair Tryst'),
(173, 'Starfish'),
(174, 'Stretch it Out'),
(175, 'Sun Salutation'),
(176, 'Surprise Party'),
(177, 'Sweet Seat'),
(178, 'Play Ball'),
(179, 'Spider Monkey'),
(180, 'Sneaky Girl'),
(181, 'Raunchy Wrestler'),
(182, 'Table Top'),
(183, 'Necking'),
(184, 'Butter Churner');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(5) NOT NULL,
  `lastname` varchar(255) NOT NULL DEFAULT 'N/A',
  `firstname` varchar(255) NOT NULL DEFAULT 'N/A',
  `username` varchar(255) NOT NULL,
  `gender` enum('man','woman') DEFAULT NULL,
  `sexual_orientation` enum('bi','homo','hetero') NOT NULL DEFAULT 'bi',
  `mail` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `profile_picture_url` longtext,
  `pop_score` int(11) NOT NULL DEFAULT '0',
  `geo_lat` float DEFAULT NULL,
  `geo_long` float DEFAULT NULL,
  `age_min` int(11) NOT NULL DEFAULT '18',
  `age_max` int(11) NOT NULL DEFAULT '99',
  `distance_max` int(11) NOT NULL DEFAULT '5',
  `pop_min` int(11) NOT NULL DEFAULT '0',
  `pop_max` int(11) NOT NULL DEFAULT '1000',
  `tag_min` int(11) NOT NULL DEFAULT '1',
  `tag_max` int(11) NOT NULL DEFAULT '25',
  `tags` tinyint(1) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `account_type` enum('fake','real') NOT NULL DEFAULT 'real',
  `password_key` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `online` tinyint(1) NOT NULL DEFAULT '0',
  `setup_completed` tinyint(1) NOT NULL DEFAULT '0',
  `is_pro` tinyint(1) NOT NULL DEFAULT '0',
  `subscription_date` datetime DEFAULT NULL,
  `subscription_package` enum('monthly','trimestrial','semestrial','annual','trial','free') DEFAULT 'free',
  `signup_progress` int(5) NOT NULL DEFAULT 1,
  `last_connexion` datetime DEFAULT NULL,
  `is_accountActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_tags`
--

CREATE TABLE `user_tags` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_tags`
--

--
-- Indexes for dumped tables
--

-- --------------------------> ADDED BY FRED #BEGIN

--
-- Indexes for statuses
--

ALTER TABLE `configurations`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `seens`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `leaderboards`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ranks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

-- ------------------------------> ADDED By FRED --END#
--
-- Indexes for table `block`
--
ALTER TABLE `block`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pictures`
--
ALTER TABLE `pictures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_tags`
--
ALTER TABLE `user_tags`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- ADDED BY ME  -------------------------------> BEGINNING
--

ALTER TABLE `configurations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `seens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `leaderboards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ranks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;





-- ADDED BY ME  -------------------------------------> END

--
-- AUTO_INCREMENT for table `block`
--
ALTER TABLE `block`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requests`
--

ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `pictures`
--
ALTER TABLE `pictures`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `user_tags`
--
ALTER TABLE `user_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;




  ALTER TABLE `configurations`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;




COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
