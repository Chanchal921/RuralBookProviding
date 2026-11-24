package com.ruraledu.service.impl;

import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.UpdateUserRequest;
import com.ruraledu.dto.UserResponse;
import com.ruraledu.entity.User;
import com.ruraledu.enums.Role;
import com.ruraledu.exception.ResourceNotFoundException;
import com.ruraledu.mapper.UserMapper;
import com.ruraledu.repository.UserRepository;
import com.ruraledu.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(Role role, String search, Pageable pageable) {
        Page<User> page = userRepository.searchUsers(role, search, pageable);
        return PageResponse.from(page.map(userMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getOrganizationName() != null) {
            user.setOrganizationName(request.getOrganizationName().trim());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        User updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }
}

