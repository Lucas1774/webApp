CREATE SCHEMA `my_first_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `my_first_database` ;


CREATE TABLE `my_first_database`.`aliments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `my_first_database`.`my_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ans` VARCHAR(50) NULL DEFAULT NULL,
  `text` VARCHAR(255) NULL DEFAULT NULL,
  `text_mode` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=493 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `my_first_database`.`my_table` (`id`, `ans`, `text`) VALUES (1, NULL, NULL);


CREATE TABLE `my_first_database`.`shopping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `aliment_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `my_first_database`.`sudokus` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `state` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `my_first_database`.`users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `my_first_database`.`users` (`username`, `password`) VALUES ('admin', 'admin');

INSERT INTO `my_first_database`.`users` (`username`, `password`) VALUES ('default', 'default');


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `get_calculator_data`()
BEGIN
	SELECT * FROM my_table WHERE id = 1;
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `get_password`(
    IN p_username VARCHAR(50)
)
BEGIN
	SELECT password FROM users WHERE username = p_username;
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `get_sudokus`()
BEGIN
	SELECT state FROM sudokus;
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `get_user_aliments`(IN p_user_name VARCHAR(50))
BEGIN
	select a.id, a.name, s.quantity from aliments a INNER JOIN shopping s on s.aliment_id = a.id where s.user_id in (select id FROM users WHERE username = p_user_name);
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `insert_aliment`(IN p_aliment_name VARCHAR(50))
BEGIN
	INSERT INTO aliments (name) VALUES (p_aliment_name);
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `insert_sudoku`(
    IN p_state VARCHAR(255)
)
BEGIN
    DECLARE rowCount INT;
    
    SELECT COUNT(*) INTO rowCount FROM sudokus WHERE state = p_state;
    
    IF rowCount = 0 THEN
        INSERT INTO sudokus (state) VALUES (p_state);
    END IF;
    
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `update_ans`(IN p_number VARCHAR(50))
BEGIN
	UPDATE my_table SET ans = p_number, text_mode = 0 WHERE id = 1;
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `update_text`(IN p_string VARCHAR(255))
BEGIN
	UPDATE my_table SET text = p_string, text_mode = 1 WHERE id = 1;
END $$
DELIMITER ;


DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `assign_aliment_to_users`(IN p_aliment_name VARCHAR(255))
BEGIN
    INSERT INTO shopping (aliment_id, user_id, quantity)
    SELECT a.id, u.id, 0
    FROM aliments a
    JOIN users u ON a.name = p_aliment_name;
END $$
DELIMITER ;
