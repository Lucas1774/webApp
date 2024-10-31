BEGIN
    CREATE TABLE categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );
END;
GO

BEGIN
    CREATE TABLE products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        category_id INT NULL
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
        product_id INT NOT NULL,
        quantity INT NOT NULL
        CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
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
