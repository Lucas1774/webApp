package com.lucas.server.components.connection;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lucas.server.components.model.ShoppingItem;
import com.lucas.server.components.sudoku.Sudoku;

@Repository
public class DAO {

    private String schemaName;
    private NamedParameterJdbcTemplate jdbcTemplate;

    public DAO(NamedParameterJdbcTemplate jdbcTemplate, @Value("${spring.datasource.url}") String datasourceUrl) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemaName = this.extractSchemaFromUrl(datasourceUrl);
    }

    public String getPassword(String string) {
        try {
            String sql = "{call " + this.sanitizePorcedureName("get_password") + "(:p_username)}";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("p_username", string);
            return this.jdbcTemplate.queryForObject(sql, parameters, String.class);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void insert(Double number) {
        try {
            String sql = "{call " + this.sanitizePorcedureName("update_ans") + "(:number)}";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("number", number);
            this.jdbcTemplate.update(sql, parameters);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public void insertString(String string) {
        try {
            String sql = "{call " + this.sanitizePorcedureName("update_text") + "(:p_string)}";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("p_string", string);
            this.jdbcTemplate.update(sql, parameters);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public String get() {
        try {
            String sql = "{call " + this.sanitizePorcedureName("get_calculator_data") + "}";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            return this.jdbcTemplate.queryForObject(sql, parameters,
                    (rs, rowNum) -> rs.getBoolean("text_mode")
                            ? Optional.ofNullable(rs.getString("text")).orElse("Nothing here yet")
                            : Optional.ofNullable(rs.getString("ans")).orElse(String.valueOf(0)));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void insertSudokus(List<Sudoku> sudokus) {
        try {
            String sql = "{call " + this.sanitizePorcedureName("insert_sudoku") + "(:p_state)}";
            MapSqlParameterSource[] params = sudokus.stream()
                    .map(sudoku -> new MapSqlParameterSource("p_state", sudoku.serialize()))
                    .toArray(MapSqlParameterSource[]::new);
            this.jdbcTemplate.batchUpdate(sql, params);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<Sudoku> getSudokus() {
        try {
            return this.jdbcTemplate.query("{call " + sanitizePorcedureName("get_sudokus") + "}",
                    (resultSet, rowNum) -> Sudoku.withValues(resultSet.getString("state").replace("\"", "")
                            .chars()
                            .map(Character::getNumericValue)
                            .toArray()));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<ShoppingItem> getShoppingItems(String string) {
        try {
            String sql = "CALL " + this.sanitizePorcedureName("get_user_aliments") + "(:p_user_name)";
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("p_user_name", string);
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

    public void insertAliment(String item) {
        try {
            String sql = "{call " + this.sanitizePorcedureName("insert_aliment") + "(:p_aliment_name)}";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("p_aliment_name", item);
            this.jdbcTemplate.update(sql, parameters);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    private String extractSchemaFromUrl(String url) {
        String[] parts = url.split(";database=");
        if (parts.length > 1) {
            return parts[1].split(";")[0];
        } else {
            return null;
        }
    }

    private String sanitizePorcedureName(String procName) {
        if (this.schemaName == null) {
            return procName;
        } else {
            return this.schemaName + "." + procName;
        }
    }
}
