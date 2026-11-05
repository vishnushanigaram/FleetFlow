package com.fleetflow.service;

import com.fleetflow.model.User;
import com.fleetflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        // Mock token for demonstration
        String token = "jwt_" + user.getId() + "_" + System.currentTimeMillis();

        Map<String, Object> res = new HashMap<>();
        res.put("user", user);
        res.put("token", token);
        return res;
    }

    public Map<String, Object> register(User user) {
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        if (user.getId() == null) {
            user.setId("USR-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        if (user.getJoinedDate() == null) {
            user.setJoinedDate(LocalDate.now());
        }
        if (user.getStatus() == null) {
            user.setStatus("Active");
        }
        if (user.getAvatar() == null) {
            user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
        }

        User saved = userRepository.save(user);
        String token = "jwt_" + saved.getId() + "_" + System.currentTimeMillis();

        Map<String, Object> res = new HashMap<>();
        res.put("user", saved);
        res.put("token", token);
        return res;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

