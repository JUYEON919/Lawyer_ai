package Lawyerai.Lawyer_ai.service;

import Lawyerai.Lawyer_ai.model.User;
import Lawyerai.Lawyer_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserEditService {
    private final UserRepository userRepository;

    @Autowired
    public UserEditService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
