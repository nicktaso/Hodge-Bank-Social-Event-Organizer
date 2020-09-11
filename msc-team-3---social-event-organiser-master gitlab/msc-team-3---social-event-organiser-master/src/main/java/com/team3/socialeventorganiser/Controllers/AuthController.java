package com.team3.socialeventorganiser.Controllers;

import com.team3.socialeventorganiser.Models.User;
import com.team3.socialeventorganiser.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;

@RestController
public class AuthController {
    private UserRepository userRepository;

    @Autowired
    public AuthController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @PostMapping("/auth")
    public String auth(@RequestParam(name="email", required = true) String email) {

        System.out.println(email);
        User user = userRepository.findUserByEmail(email);

        return HomeController.toJson(user);
    }

}
