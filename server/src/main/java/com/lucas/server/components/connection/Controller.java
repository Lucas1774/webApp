package com.lucas.server.components.connection;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lucas.server.components.calculator.Solver;
import com.lucas.server.components.model.ShoppingItem;
import com.lucas.server.components.security.JwtUtil;
import com.lucas.server.components.sudoku.Generator;
import com.lucas.server.components.sudoku.Sudoku;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class Controller {
    private JwtUtil jwtUtil;
    private DAO dao;
    private Generator generator;
    private Solver solver;
    private SudokuParser sudokuParser;
    private boolean secure;
    private static final String ADMIN = "admin";
    private static final String DEFAULT = "default";

    public Controller(JwtUtil jwtUtil, DAO dao, Generator generator, Solver solver, SudokuParser sudokuParser,
            @Value("${spring.security.jwt.secure}") boolean secure) {
        this.dao = dao;
        this.generator = generator;
        this.solver = solver;
        this.sudokuParser = sudokuParser;
        this.jwtUtil = jwtUtil;
        this.secure = secure;
    }

    @GetMapping("/check-auth")
    public ResponseEntity<String> checkAuth(HttpServletRequest request) {
        return this.retrieveAuthCookie(request.getCookies()) != null
                ? ResponseEntity.ok("Authenticated")
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not Authenticated");
    }

    @PostMapping("/login")
    public ResponseEntity<String> handleLogin(@RequestBody String password, HttpServletResponse response) {
        String correctPassword;
        try {
            correctPassword = dao.getPassword(ADMIN);
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        if (correctPassword.equals(password.replace("\"", ""))) {
            String token = correctPassword.equals(password.replace("\"", "")) ? jwtUtil.generateToken() : "-1";
            Cookie cookie = new Cookie("authToken", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(31536000);
            cookie.setSecure(this.secure);
            response.addCookie(cookie);
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.ok("-1");
        }
    }

    @GetMapping("/shopping")
    public List<ShoppingItem> getShoppingItems(HttpServletRequest request) {
        return dao.getShoppingItems(this.retrieveAuthCookie(request.getCookies()) != null ? ADMIN : DEFAULT);
    }

    @PostMapping("/new-aliment")
    public String postAliment(HttpServletRequest request, @RequestBody String item) {
        try {
            dao.insertAliment(item.replace("\"", ""),
                    this.retrieveAuthCookie(request.getCookies()) != null ? ADMIN : DEFAULT);
            return "1";
        } catch (DataAccessException e) {
            return e.getMessage();
        }
    }

    @PostMapping("/update-aliment-quantity")
    public ResponseEntity<String> updateAlimentQuantity(@RequestBody Map<String, Object> data) {
        try {
            dao.updateAlimentQuantity((int) data.get("id"), (int) data.get("quantity"));
            return ResponseEntity.ok("Aliment quantity updated successfully");
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/ans")
    public String post(@RequestBody String number) {
        if (number.length() > 200) {
            return "Stop";
        } else {
            String result = solver.solveExpression(number);
            if (!"Invalid expression".equals(result)) {
                dao.insert(Double.parseDouble(result));
            } else {
                dao.insertString(number);
            }
            return result;
        }
    }

    @GetMapping("/ans")
    public String get() {
        try {
            return dao.get();
        } catch (DataAccessException e) {
            return e.getMessage();
        }
    }

    @PostMapping("/upload/sudokus")
    public String handleFileUpload(@RequestBody String file) {
        if (file.length() > 10000) {
            return "Stop";
        } else {
            try {
                List<Sudoku> sudokus = sudokuParser.fromString(file.replace("\"", "")).stream()
                        .filter(s -> {
                            Sudoku copy = Sudoku.withValues(s.get());
                            return s.isValid(-1) && copy.solveWithTimeout();
                        })
                        .collect(Collectors.toList());
                if (!sudokus.isEmpty()) {
                    dao.insertSudokus(sudokus);
                    return "1";
                } else {
                    return "No sudokus were inserted";
                }
            } catch (DataAccessException e) {
                return e.getMessage();
            }
        }
    }

    @GetMapping("fetch/sudoku")
    public String getRandom() {
        try {
            List<Sudoku> sudokus = dao.getSudokus();
            if (sudokus.isEmpty()) {
                return "No sudokus found";
            } else {
                return sudokus.get(new Random().nextInt(sudokus.size())).serialize();
            }
        } catch (DataAccessException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    @GetMapping("generate/sudoku")
    public String generateRandom(@RequestParam("difficulty") int difficulty) {
        if (difficulty < 1 || difficulty > 9) {
            return "Invalid difficulty";
        } else {
            return generator.generate(difficulty).serialize();
        }
    }

    @GetMapping("/solve/sudoku")
    public String solveSudoku(@RequestParam String sudoku) {
        int[] values = Sudoku.deserialize(sudoku);
        if (0 == values.length) {
            return "Invalid sudoku";
        } else {
            Sudoku s = Sudoku.withValues(values);
            if (!s.isValid(-1)) {
                return "Sudoku might have more than one solution";
            } else {
                if (!s.solveWithTimeout()) {
                    return "Unsolvable sudoku";
                } else {
                    return s.serialize();
                }
            }
        }
    }

    @GetMapping("/check/sudoku")
    public String checkSudoku(@RequestParam String initialSudoku, @RequestParam String currentSudoku) {
        int[] values = Sudoku.deserialize(initialSudoku);
        if (0 == values.length) {
            return "Invalid sudoku";
        } else {
            Sudoku s = Sudoku.withValues(values);
            if (!s.isValid(-1)) {
                return "Sudoku might have more than one solution";
            } else {
                if (!s.solveWithTimeout()) {
                    return "Unsolvable sudoku";
                } else {
                    String serialized = s.serialize().replace("\"", "");
                    String solvable = "1";
                    for (int i = 0; i < Sudoku.NUMBER_OF_CELLS; i++) {
                        if (currentSudoku.charAt(i) != '0' && serialized.charAt(i) != currentSudoku.charAt(i)) {
                            solvable = "0";
                            break;
                        }
                    }
                    return solvable;
                }
            }
        }
    }

    private String retrieveAuthCookie(Cookie[] cookies) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("authToken".equals(cookie.getName()) && jwtUtil.isTokenValid(cookie.getValue())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
