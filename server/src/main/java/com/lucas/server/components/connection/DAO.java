package com.lucas.server.components.connection;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
        String sql = "SELECT a.id, a.name, s.quantity "
                + "FROM aliments a "
                + "INNER JOIN shopping s ON s.aliment_id = a.id "
                + "WHERE s.user_id = (SELECT id FROM users WHERE username = :username)";
        MapSqlParameterSource params = new MapSqlParameterSource("username", username);
        return this.jdbcTemplate.query(
                sql,
                params,
                (resultSet, rowNum) -> new ShoppingItem(
                        resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getInt("quantity")));
    }

    @Transactional
    public void insertAliment(String aliment, String username) throws DataAccessException {
        String insertAlimentSql = "INSERT INTO aliments (name) "
                + "SELECT :aliment "
                + "WHERE NOT EXISTS (SELECT 1 FROM aliments WHERE name = :aliment)";
        String assignAlimentSql = "INSERT INTO shopping (aliment_id, user_id, quantity) "
                + "VALUES ("
                + "(SELECT id FROM aliments WHERE name = :aliment),"
                + "(SELECT id FROM users WHERE username = :username),"
                + "0)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("aliment", aliment);
        parameters.addValue("username", username);
        this.jdbcTemplate.update(insertAlimentSql, parameters);
        this.jdbcTemplate.update(assignAlimentSql, parameters);
    }

    public void updateAlimentQuantity(int id, int quantity) throws DataAccessException {
        String sql = "UPDATE shopping SET quantity = :quantity WHERE aliment_id = :id";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("id", id);
        parameters.addValue("quantity", quantity);
        this.jdbcTemplate.update(sql, parameters);
    }

    @Transactional
    public void removeAliment(int id, String username) throws DataAccessException {
        String removeFromShoppingSql = "DELETE FROM shopping "
                + "WHERE aliment_id = :aliment "
                + "AND user_id = (SELECT id FROM users WHERE username = :username)";
        String removeFromAlimentsSql = "DELETE FROM aliments "
                + "WHERE id = :aliment AND NOT EXISTS ( "
                + "    SELECT 1 FROM shopping "
                + "    WHERE aliment_id = :aliment)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("aliment", id);
        parameters.addValue("username", username);
        this.jdbcTemplate.update(removeFromShoppingSql, parameters);
        this.jdbcTemplate.update(removeFromAlimentsSql, parameters);
    }
}
