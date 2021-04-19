# 跨域CORS配置

### 当两个服务器不是同IP及端口时，会出现跨域问题。需要在被访问的服务器中配置如下代码即可。

```java
@Configuration
public class CorsConfig {

    public CorsConfig() {
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
		// 设置允许访问的地址
        configuration.addAllowedOrigin("http://localhost:8080");
        // 设置是否发送cookie信息
        configuration.setAllowCredentials(true);
        // 设置允许请求的方式
        configuration.addAllowedMethod("*");
        // 设置允许的header
        configuration.addAllowedHeader("*");

        // 为URL添加映射路径
        UrlBasedCorsConfigurationSource corsSource = new UrlBasedCorsConfigurationSource();
        // /**的意思是请求进来，适用于所有路由
        corsSource.registerCorsConfiguration("/**", configuration);

        return new CorsFilter(corsSource);
    }
}
```

