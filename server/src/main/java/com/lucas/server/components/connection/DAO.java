package com.lucas.server.components.connection;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lucas.server.components.model.Category;
import com.lucas.server.components.model.ShoppingItem;
import com.lucas.server.components.sudoku.Sudoku;

@Repository
public class DAO {

    private NamedParameterJdbcTemplate jdbcTemplate;

    public DAO(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String getPassword(String username) throws DataAccessException {
        String sql = "SELECT password FROM users WHERE username = :username";
        MapSqlParameterSource parameters = new MapSqlParameterSource("username", username);
        return this.jdbcTemplate.queryForObject(sql, parameters, String.class);
    }

    public void insert(Double number) throws DataAccessException {
        String sql = "UPDATE my_table SET ans = :number, text_mode = 0 WHERE id = 1";
        MapSqlParameterSource parameters = new MapSqlParameterSource("number", number);
        this.jdbcTemplate.update(sql, parameters);
    }

    public void insertString(String text) throws DataAccessException {
        String sql = "UPDATE my_table SET text = :text, text_mode = 1 WHERE id = 1";
        MapSqlParameterSource parameters = new MapSqlParameterSource("text", text);
        this.jdbcTemplate.update(sql, parameters);
    }

    public String get() throws DataAccessException {
        String sql = "SELECT * FROM my_table WHERE id = 1";
        return this.jdbcTemplate.queryForObject(sql, new MapSqlParameterSource(),
                (rs, rowNum) -> rs.getBoolean("text_mode")
                        ? Optional.ofNullable(rs.getString("text")).orElse("Nothing here yet")
                        : Optional.ofNullable(rs.getString("ans")).orElse("0"));
    }

    public void insertSudokus(List<Sudoku> sudokus) throws DataAccessException {
        String sql = "INSERT INTO sudokus (state) "
                + "SELECT :state "
                + "WHERE NOT EXISTS (SELECT 1 FROM sudokus WHERE state = :state)";
        MapSqlParameterSource[] params = sudokus.stream()
                .map(sudoku -> new MapSqlParameterSource("state", sudoku.serialize()))
                .toArray(MapSqlParameterSource[]::new);
        this.jdbcTemplate.batchUpdate(sql, params);
    }

    public List<Sudoku> getSudokus() throws DataAccessException {
        String sql = "SELECT state FROM sudokus";
        return this.jdbcTemplate.query(sql,
                (resultSet, rowNum) -> Sudoku.withValues(
                        resultSet.getString("state").replace("\"", "")
                                .chars()
                                .map(Character::getNumericValue)
                                .toArray()));
    }

    public List<ShoppingItem> getShoppingItems(String username) throws DataAccessException {
        String sql = "SELECT a.id, a.name, c.id AS category_id, c.name AS category_name, s.quantity "
                + "FROM products a "
                + "LEFT JOIN categories c ON c.id = a.category_id "
                + "INNER JOIN shopping s ON s.product_id = a.id "
                + "WHERE s.user_id = (SELECT id FROM users WHERE username = :username)";
        MapSqlParameterSource params = new MapSqlParameterSource("username", username);
        return this.jdbcTemplate.query(
                sql,
                params,
                (resultSet, rowNum) -> new ShoppingItem(
                        resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getObject("category_id", Integer.class),
                        Optional.ofNullable(resultSet.getString("category_name")).orElse(""),
                        resultSet.getInt("quantity")));
    }

    public List<Category> getPossibleCategories() throws DataAccessException {
        String sql = "SELECT * FROM categories";
        return this.jdbcTemplate.query(
                sql,
                (resultSet, rowNum) -> new Category(
                        resultSet.getInt("id"),
                        Optional.ofNullable(resultSet.getString("name")).orElse("")));
    }

    @Transactional
    public void insertProduct(String product, String username) throws DataAccessException {
        String insertProductSql = "INSERT INTO products (name) "
                + "SELECT :product "
                + "WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = :product)";
        String assignProductSql = "INSERT INTO shopping (product_id, user_id, quantity) "
                + "VALUES ("
                + "(SELECT id FROM products WHERE name = :product),"
                + "(SELECT id FROM users WHERE username = :username),"
                + "0)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("product", product);
        parameters.addValue("username", username);
        this.jdbcTemplate.update(insertProductSql, parameters);
        this.jdbcTemplate.update(assignProductSql, parameters);
    }

    @Transactional
    public void updateProduct(int id, String productName, Optional<Object> categoryId, String categoryName)
            throws DataAccessException {
        Integer categoryIdInt;
        if (!categoryId.isPresent()) {
            String insertCategorySql = "INSERT INTO categories (name) VALUES (:category)";
            String getCategoryIdSql = "SELECT id FROM categories WHERE name = :category";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("category", categoryName);
            this.jdbcTemplate.update(insertCategorySql, parameters);
            categoryIdInt = this.jdbcTemplate.queryForObject(getCategoryIdSql, parameters, Integer.class);
        } else {
            categoryIdInt = (Integer) categoryId.get();
        }
        String updateProductSql = "UPDATE products SET name = :productName, category_id = :categoryId "
                + "WHERE id = :id";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("id", id);
        parameters.addValue("productName", productName);
        parameters.addValue("categoryId", categoryIdInt);
        this.jdbcTemplate.update(updateProductSql, parameters);
    }

    public void updateProductQuantity(int id, int quantity, String username) throws DataAccessException {
        String sql = "UPDATE shopping SET quantity = :quantity "
                + "WHERE product_id = :id "
                + "AND user_id = (SELECT id FROM users WHERE username = :username)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("id", id);
        parameters.addValue("quantity", quantity);
        parameters.addValue("username", username);
        this.jdbcTemplate.update(sql, parameters);
    }

    public void updateAllProductQuantity(String username) throws DataAccessException {
        String sql = "UPDATE shopping SET quantity = 0 "
                + "WHERE user_id = (SELECT id FROM users WHERE username = :username)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", username);
        this.jdbcTemplate.update(sql, parameters);
    }

    @Transactional
    public void removeProduct(int id, String username) throws DataAccessException {
        String removeFromShoppingSql = "DELETE FROM shopping "
                + "WHERE product_id = :product "
                + "AND user_id = (SELECT id FROM users WHERE username = :username)";
        String removeFromProductsSql = "DELETE FROM products "
                + "WHERE id = :product AND NOT EXISTS ( "
                + "    SELECT 1 FROM shopping "
                + "    WHERE product_id = :product)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("product", id);
        parameters.addValue("username", username);
        this.jdbcTemplate.update(removeFromShoppingSql, parameters);
        this.jdbcTemplate.update(removeFromProductsSql, parameters);
    }
}
