package Lawyerai.Lawyer_ai.service;

import Lawyerai.Lawyer_ai.model.User;
import Lawyerai.Lawyer_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        String rawPassword = user.getPassword(); // 원본 비밀번호
        String encodedPassword = passwordEncoder.encode(rawPassword); // 암호화된 비밀번호
        user.setPassword(encodedPassword); // 암호화된 비밀번호 저장
        System.out.println("저장 전 사용자 데이터: " + user);
        return userRepository.save(user);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}