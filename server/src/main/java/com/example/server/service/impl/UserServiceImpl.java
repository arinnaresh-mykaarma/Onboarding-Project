package com.example.server.service.impl;

import com.example.server.dto.NewUserDto;
import com.example.server.dto.UserDto;
import com.example.server.entity.UserEntity;
import com.example.server.repository.UserRepository;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    public final UserRepository userRepository;
    public final ModelMapper modelMapper;

    @Override
    public List<UserDto> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
        .map(user -> modelMapper.map(user, UserDto.class))
        .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "users", key = "#id")
    public UserDto getUserById(Long id) {
        System.out.println("Fetching user from DATABASE");

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User Not Found"));

        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @CachePut(value = "users", key = "#result.id")
    public UserDto createNewUser(NewUserDto newUserDto) {
        UserEntity newUser = modelMapper.map(newUserDto, UserEntity.class);
        UserEntity user = userRepository.save(newUser);

        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("No such User");
        }

        userRepository.deleteById(id);
    }

    @Override
    @CachePut(value = "users", key = "#id")
    public UserDto updateUser(Long id, NewUserDto newUserDto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User Not Found"));

        modelMapper.map(newUserDto, user);

        UserEntity updatedUser = userRepository.save(user);

        return modelMapper.map(updatedUser, UserDto.class);
    }
}