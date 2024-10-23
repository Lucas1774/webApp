BEGIN
    CREATE TABLE aliments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );
END;
GO

BEGIN
    CREATE TABLE my_table (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ans VARCHAR(50) NULL,
        text VARCHAR(255) NULL,
        text_mode BIT NOT NULL DEFAULT 0
    );
END;
GO
INSERT INTO my_table (ans, text) VALUES (NULL, NULL);
GO

BEGIN
    CREATE TABLE shopping (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        aliment_id INT NOT NULL,
        quantity INT NOT NULL
    );
END;
GO

BEGIN
    CREATE TABLE sudokus (
        id INT IDENTITY(1,1) PRIMARY KEY,
        state VARCHAR(255) NOT NULL
    );
END;
GO

BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(50) NOT NULL
    );
END;
GO

INSERT INTO users (username, password) VALUES ('admin', 'admin');
INSERT INTO users (username, password) VALUES ('default', 'default');
GO

CREATE PROCEDURE get_calculator_data
AS
BEGIN
    SELECT * FROM my_table WHERE id = 1;
END;
GO

CREATE PROCEDURE get_password
    @p_username VARCHAR(50)
AS
BEGIN
    SELECT password FROM users WHERE username = @p_username;
END;
GO

CREATE PROCEDURE get_sudokus
AS
BEGIN
    SELECT state FROM sudokus;
END;
GO

CREATE PROCEDURE get_user_aliments
    @p_user_name VARCHAR(50)
AS
BEGIN
    SELECT a.id, a.name, s.quantity
    FROM aliments a
    INNER JOIN shopping s ON s.aliment_id = a.id
    WHERE s.user_id IN (SELECT id FROM users WHERE username = @p_user_name);
END;
GO

CREATE PROCEDURE insert_aliment
    @p_aliment_name VARCHAR(50)
AS
BEGIN
    INSERT INTO aliments (name) VALUES (@p_aliment_name);
END;
GO

CREATE PROCEDURE insert_sudoku
    @p_state VARCHAR(255)
AS
BEGIN
    DECLARE @rowCount INT;

    SELECT @rowCount = COUNT(*) FROM sudokus WHERE state = @p_state;

    IF @rowCount = 0
    BEGIN
        INSERT INTO sudokus (state) VALUES (@p_state);
    END;
END;
GO

CREATE PROCEDURE update_ans
    @p_number VARCHAR(50)
AS
BEGIN
    UPDATE my_table SET ans = @p_number, text_mode = 0 WHERE id = 1;
END;
GO

CREATE PROCEDURE update_text
    @p_string VARCHAR(255)
AS
BEGIN
    UPDATE my_table SET text = @p_string, text_mode = 1 WHERE id = 1;
END;
GO

CREATE PROCEDURE assign_aliment_to_users
    @p_aliment_name VARCHAR(255)
AS
BEGIN
    INSERT INTO shopping (aliment_id, user_id, quantity)
    SELECT a.id, u.id, 0
    FROM aliments a
    JOIN users u ON a.name = @p_aliment_name;
END;
GO
