package Lawyerai.Lawyer_ai.controller;

import Lawyerai.Lawyer_ai.model.User;
import Lawyerai.Lawyer_ai.service.UserEditService;
import Lawyerai.Lawyer_ai.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserEditController {
    private final UserEditService userEditService;

    public  UserEditController(UserEditService userEditService) {
        this.userEditService = userEditService;
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo() {
        // ✅ 로그인된 사용자의 username을 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("📌 현재 인증된 사용자: " + authentication.getName());
        String username = authentication.getName();

        if (username == null || username.equals("anonymousUser")) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Optional<User> user = userEditService.getUserByUsername(username);

        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "id", user.get().getId(),
                    "email", user.get().getEmail(),
                    "name", user.get().getName(),
                    "phone", user.get().getPhone()
            ));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
    }
}
