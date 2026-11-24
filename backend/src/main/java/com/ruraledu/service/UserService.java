package com.ruraledu.service;

import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.UpdateUserRequest;
import com.ruraledu.dto.UserResponse;
import com.ruraledu.enums.Role;
import org.springframework.data.domain.Pageable;

public interface UserService {
    PageResponse<UserResponse> getUsers(Role role, String search, Pageable pageable);
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UpdateUserRequest request);
}

