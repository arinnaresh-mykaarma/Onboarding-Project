package com.example.server.service;

import com.example.server.dto.NewUserDto;
import com.example.server.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    UserDto createNewUser(NewUserDto newUserDto);

    void deleteUser(Long id);

    UserDto updateUser(Long id, NewUserDto newUserDto);
}
