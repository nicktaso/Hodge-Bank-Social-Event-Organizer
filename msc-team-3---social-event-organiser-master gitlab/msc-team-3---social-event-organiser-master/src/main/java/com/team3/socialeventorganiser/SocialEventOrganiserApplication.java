package com.team3.socialeventorganiser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class SocialEventOrganiserApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialEventOrganiserApplication.class, args);
    }

}
