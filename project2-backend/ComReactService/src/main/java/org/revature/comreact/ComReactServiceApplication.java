package org.revature.comreact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan("org.revature.comreact.repositories")
@SpringBootApplication
public class ComReactServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComReactServiceApplication.class, args);
    }

}
