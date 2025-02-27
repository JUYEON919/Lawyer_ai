package Lawyerai.Lawyer_ai.controller;

import Lawyerai.Lawyer_ai.model.User;
import Lawyerai.Lawyer_ai.service.UserService;
import Lawyerai.Lawyer_ai.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;


    @PostMapping("/Signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        System.out.println("받은 사용자 데이터: " + user);
        userService.registerUser(user);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findUserByUsername(user.getUsername());
        if (existingUser.isPresent() && userService.validatePassword(user.getPassword(), existingUser.get().getPassword())) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String token = jwtUtil.generateToken(userDetails.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("user_id", String.valueOf(existingUser.get().getId()));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }
}
