package com.lucas.server.components.connection;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    @PostMapping("/login")
    public ResponseEntity<String> handleLogin(@RequestBody String password, HttpServletResponse response) {
        String correctPassword;
        try {
            correctPassword = dao.getPassword(ADMIN);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        if (!correctPassword.equals(password.replace("\"", ""))) {
            return ResponseEntity.ok().body("Wrong password. Continuing as guest");
        } else {
            String token = jwtUtil.generateToken();
            Cookie cookie = new Cookie("authToken", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(31536000);
            cookie.setSecure(this.secure);
            if (this.secure) {
                cookie.setAttribute("SameSite", "None");
            }
            response.addCookie(cookie);
            return ResponseEntity.ok("Granted admin access");
        }
    }

    @GetMapping("/check-auth")
    public ResponseEntity<String> checkAuth(HttpServletRequest request) {
        return this.handleRequest(() -> this.retrieveAuthCookie(request.getCookies()) != null
                ? "1"
                : "Not authenticated");
    }

    @GetMapping("/shopping")
    public ResponseEntity<String> getShoppingItems(HttpServletRequest request) {
        return this.handleRequest(
                () -> {
                    List<ShoppingItem> items = dao
                            .getShoppingItems(this.retrieveUsername(request.getCookies()));
                    return new ObjectMapper().writeValueAsString(items);
                });
    }

    @PostMapping("/new-product")
    public ResponseEntity<String> postProduct(HttpServletRequest request, @RequestBody String item) {
        return this.handleRequest(() -> {
            dao.insertProduct(item.replace("\"", ""), this.retrieveUsername(request.getCookies()));
            return "Product added";
        });
    }

    @PostMapping("/update-product-quantity")
    public ResponseEntity<String> updateProductQuantity(HttpServletRequest request,
            @RequestBody Map<String, Object> data) {
        return this.handleRequest(() -> {
            dao.updateProductQuantity((int) data.get("id"), (int) data.get("quantity"),
                    this.retrieveUsername(request.getCookies()));
            return "Product " + data.get("name") + " updated";
        });
    }

    @PostMapping("/update-all-product-quantity")
    public ResponseEntity<String> updateAllProductQuantity(HttpServletRequest request) {
        return this.handleRequest(() -> {
            dao.updateAllProductQuantity(this.retrieveUsername(request.getCookies()));
            return "All quantities were set to 0";
        });
    }

    @PostMapping("/remove-product")
    public ResponseEntity<String> removeProduct(HttpServletRequest request, @RequestBody Map<String, Object> data) {
        return this.handleRequest(() -> {
            dao.removeProduct((int) data.get("id"), this.retrieveUsername(request.getCookies()));
            return "Product " + data.get("name") + " removed";
        });
    }

    @PostMapping("/ans")
    public ResponseEntity<String> post(@RequestBody String number) {
        if (number.length() > 200) {
            return ResponseEntity.ok().body("Stop");
        } else {
            return this.handleRequest(() -> {
                String result = solver.solveExpression(number);
                if (!"Invalid expression".equals(result)) {
                    dao.insert(Double.parseDouble(result));
                } else {
                    dao.insertString(number);
                }
                return result;
            });
        }
    }

    @GetMapping("/ans")
    public ResponseEntity<String> get() {
        return this.handleRequest(() -> dao.get());
    }

    @PostMapping("/upload/sudokus")
    public ResponseEntity<String> handleFileUpload(@RequestBody String file) {
        if (file.length() > 10000) {
            return ResponseEntity.ok().body("Stop");
        } else {
            return this.handleRequest(() -> {
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
            });
        }
    }

    @GetMapping("fetch/sudoku")
    public ResponseEntity<String> getRandom() {
        return this.handleRequest(() -> {
            List<Sudoku> sudokus = dao.getSudokus();
            if (sudokus.isEmpty()) {
                return "No sudokus found";
            } else {
                return sudokus.get(new Random().nextInt(sudokus.size())).serialize();
            }
        });
    }

    @GetMapping("generate/sudoku")
    public ResponseEntity<String> generateRandom(@RequestParam("difficulty") int difficulty) {
        return this.handleRequest(() -> generator.generate(difficulty).serialize());
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
    public ResponseEntity<String> checkSudoku(@RequestParam String initialSudoku, @RequestParam String currentSudoku) {
        return this.handleRequest(() -> {
            int[] values = Sudoku.deserialize(initialSudoku);
            Sudoku s;
            s = Sudoku.withValues(values);
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
        });
    }

    private ResponseEntity<String> handleRequest(Callable<String> action) {
        try {
            return ResponseEntity.ok(action.call());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
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

    private String retrieveUsername(Cookie[] cookies) {
        return this.retrieveAuthCookie(cookies) != null ? ADMIN : DEFAULT;
    }
}
