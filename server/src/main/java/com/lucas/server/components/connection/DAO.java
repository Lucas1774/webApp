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

    public String getPassword(String username) {
        try {
            String sql = "SELECT password FROM users WHERE username = :username";
            MapSqlParameterSource parameters = new MapSqlParameterSource("username", username);
            return this.jdbcTemplate.queryForObject(sql, parameters, String.class);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void insert(Double number) {
        try {
            String sql = "UPDATE my_table SET ans = :number, text_mode = 0 WHERE id = 1";
            MapSqlParameterSource parameters = new MapSqlParameterSource("number", number);
            this.jdbcTemplate.update(sql, parameters);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public void insertString(String text) {
        try {
            String sql = "UPDATE my_table SET text = :text, text_mode = 1 WHERE id = 1";
            MapSqlParameterSource parameters = new MapSqlParameterSource("text", text);
            this.jdbcTemplate.update(sql, parameters);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public String get() {
        try {
            String sql = "SELECT * FROM my_table WHERE id = 1";
            return this.jdbcTemplate.queryForObject(sql, new MapSqlParameterSource(),
                    (rs, rowNum) -> rs.getBoolean("text_mode")
                            ? Optional.ofNullable(rs.getString("text")).orElse("Nothing here yet")
                            : Optional.ofNullable(rs.getString("ans")).orElse("0"));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void insertSudokus(List<Sudoku> sudokus) {
        try {
            String sql = "INSERT INTO sudokus (state) "
                    + "SELECT :state "
                    + "WHERE NOT EXISTS (SELECT 1 FROM sudokus WHERE state = :state)";
            MapSqlParameterSource[] params = sudokus.stream()
                    .map(sudoku -> new MapSqlParameterSource("state", sudoku.serialize()))
                    .toArray(MapSqlParameterSource[]::new);
            this.jdbcTemplate.batchUpdate(sql, params);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<Sudoku> getSudokus() {
        try {
            String sql = "SELECT state FROM sudokus";
            return this.jdbcTemplate.query(sql,
                    (resultSet, rowNum) -> Sudoku.withValues(
                            resultSet.getString("state").replace("\"", "")
                                    .chars()
                                    .map(Character::getNumericValue)
                                    .toArray()));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<ShoppingItem> getShoppingItems(String username) {
        try {
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
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void insertAliment(String aliment) {
        try {
            String insertAlimentSql = "INSERT INTO aliments (name) VALUES (:aliment)";
            MapSqlParameterSource parameters = new MapSqlParameterSource("aliment", aliment);
            this.jdbcTemplate.update(insertAlimentSql, parameters);

            String assignAlimentSql = "INSERT INTO shopping (aliment_id, user_id, quantity) "
                    + "SELECT a.id, u.id, 0 "
                    + "FROM aliments a "
                    + "JOIN users u ON a.name = :aliment";
            this.jdbcTemplate.update(assignAlimentSql, parameters);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }
}
