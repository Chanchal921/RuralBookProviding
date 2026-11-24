package com.ruraledu.service;

import com.ruraledu.dto.AuthResponse;
import com.ruraledu.dto.LoginRequest;
import com.ruraledu.dto.RegisterRequest;
import com.ruraledu.dto.UserResponse;
import com.ruraledu.entity.User;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getCurrentUser();
    UserResponse getCurrentUserProfile();
}

