# Swagger2

### 1. 引入依赖

```xml-dtd
<!-- swagger2 配置 -->
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger2</artifactId>
	<version>2.4.0</version>
</dependency>
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger-ui</artifactId>
	<version>2.4.0</version>
</dependency>
<dependency>
	<groupId>com.github.xiaoymin</groupId>
	<artifactId>swagger-bootstrap-ui</artifactId>
	<version>1.6</version>
</dependency>
```

### 2. 编写配置类

```java
@Configuration
@EnableSwagger2
public class Swagger2 {
	
    // http://localhost:8088/swagger-ui.html        原路径
    // http://localhost:8088/doc.html               文档路径-经常使用
	
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)										// 指定api类型为swagger2
            .apiInfo(apiInfo())																// 用于定义api文档汇总信息
            .select().apis(RequestHandlerSelector.basePackage("com.mars.controller"))		// 指定controller路径
            .paths(PathSelector.any())														// 所有controller
            .build();
    }

    public ApiInfo apiInfo() {

        return new ApiInfoBuilder()
            .title("架构师进阶之路-单体电商项目")												// 文档页标题
            .contact(new Contact("mars_tjz", "http://marstjz.com", "mars_tjz@163.com"))		// 联系人
            .description("架构师进阶之路-单体电商项目描述")										// 详细信息
            .version("1.0.0")																// 版本号
            .termsOfServiceUrl("http://marstjz.com")										// 网站地址
            .build();

    }
	
}
```

### 3. 项目启动后，使用官方提供路径，即可查看相应接口

```
// http://localhost:8088/swagger-ui.html        原路径
// http://localhost:8088/doc.html               文档路径-经常使用
```

### 4. 优化Swagger2显示

```markdown
4.1 将不需要的接口隐藏，在controller类上使用@ApiIgnore注解即可
4.2 描述controller类，在controller类上使用@Api(value = "注册登录接口", tags = {"用于注册登录的接口"})
4.3 描述具体接口方法，在方法上使用@ApiOperation(value = "用户名是否存在", notes = "用户名是否存在", httpMethod = "GET")
4.4 描述参数，在自定义参数类型上使用@ApiModule(value = "用户对象BO", description = "从客户端，由用户传入的数据封装在此entity中")
4.5 描述自定义类型属性，在自定义参数类型的属性上使用@ApiModuleProperty(value = "用户名", name = "用户名", example = "mars", required = true)
```



#### 	