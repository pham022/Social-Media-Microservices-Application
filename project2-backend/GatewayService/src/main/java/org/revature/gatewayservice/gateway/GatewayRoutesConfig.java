package org.revature.gatewayservice.gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {

        return builder.routes()
                .route("AuthService", r -> r.path("/register", "/login", "/validate", "/user-info")
                        .uri("lb://auth"))
                .route("ProfileService", r -> r.path("/register", "/page/**", "/search/**", "/**")
                        .uri("lb://profiles"))
                .route("post-service", r -> r.path("/feed", "/user/**", "**")
                        .uri("lb://api/posts"))
                .route("ComReactService", r -> r.path("/comments", "/comments/**", "/comments/posts/**", "/reactions", "/reactions/**", "/reactions/posts/**")
                        .uri("lb://api"))
                .route("follow-service", r -> r.path("/**", "/me/following", "/**/followers", "/me/is-following/**", "/**/counts")
                        .uri("lb://follows"))
                .build();
    }
}
