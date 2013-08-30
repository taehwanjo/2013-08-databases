CREATE DATABASE chat;

USE chat;

CREATE TABLE `messages` (
  `id` INT NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(20) NOT NULL,
  `text` MEDIUMTEXT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
