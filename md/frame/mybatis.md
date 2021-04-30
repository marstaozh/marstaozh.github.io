

# Mybatis⼊⻔

## 1. 什么是MyBatis

```
MyBatis 本是apache的⼀个开源项⽬iBatis, 2010年这个项⽬由apache software foundation 迁移到了google code，并且改名为MyBatis。是⼀个基于Java的持久层框架。
```

## 2. Mybatis快速⼊⻔

### 2.1 导⼊开发包

```
maven下引入依赖：
	<dependency>
    	<groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.6</version>
    </dependency>
    <dependency>
    	<groupId>commons-logging</groupId>
    	<artifactId>commons-logging</artifactId>
    	<version>1.2</version>
    </dependency>
    <dependency>
    	<groupId>org.apache.logging.log4j</groupId>
    	<artifactId>log4j-core</artifactId>
    	<version>2.13.3</version>
    </dependency>
    <dependency>
        <groupId>cglib</groupId>
        <artifactId>cglib</artifactId>
        <version>3.3.0</version>
    </dependency>
    <dependency>
        <groupId>org.ow2.asm</groupId>
        <artifactId>asm</artifactId>
        <version>9.1</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.23</version>
    </dependency>


非maven导⼊Mybatis开发包
	mybatis-3.1.1.jar
	commons-logging-1.1.1.jar
	log4j-1.2.16.jar
	cglib-2.2.2.jar
	asm-3.3.1.jar
导⼊mysql/oracle开发包
	mysql-connector-java-5.1.7-bin.jar
	Oracle 11g 11.2.0.1.0 JDBC_ojdbc6.jar
```

### 2.2 准备测试⼯作

* 创建⼀张表

```sql
create table students(
    id int(5) primary key,
    name varchar(10),
    sal double(8,2)
);
```

* 创建实体

```java
@Data
public class Student {
    private Integer id;
    private String name;
    private Double sal;
}
```

* 创建mybatis.xml配置⽂件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 加载类路径下的属性⽂件 -->
    <properties resource="db.properties"/>
    <!-- 设置⼀个默认的连接环境信息 -->
    <environments default="mysql_developer">
        <!-- 连接环境信息，取⼀个任意唯⼀的名字 -->
        <environment id="mysql_developer">
            <!-- mybatis使⽤jdbc事务管理⽅式 -->
            <transactionManager type="jdbc"/>
            <!-- mybatis使⽤连接池⽅式来获取连接 -->
            <dataSource type="pooled">
                <!-- 配置与数据库交互的4个必要属性 -->
                <property name="driver" value="${mysql.driver}"/>
                <property name="url" value="${mysql.url}"/>
                <property name="username" value="${mysql.username}"/>
                <property name="password" value="${mysql.password}"/>
			</dataSource>
		</environment>
		<!-- 连接环境信息，取⼀个任意唯⼀的名字 -->
		<environment id="oracle_developer">
            <!-- mybatis使⽤jdbc事务管理⽅式 -->
            <transactionManager type="jdbc"/>
            <!-- mybatis使⽤连接池⽅式来获取连接 -->
            <dataSource type="pooled">
                <!-- 配置与数据库交互的4个必要属性 -->
                <property name="driver" value="${oracle.driver}"/>
                <property name="url" value="${oracle.url}"/>
                <property name="username" value="${oracle.username}"/>
                <property name="password" value="${oracle.password}"/>
			</dataSource>
		</environment>
	</environments>
    
    <!-- 将配置⽂件和映射⽂件关联起来 -->
    <mappers>
        <mapper resource="StudentMapper.xml"/>
    </mappers>
    
</configuration>
```

* 编写⼯具类测试是否获取到连接

```java
package cn.itcast.javaee.mybatis.util;

import java.io.IOException;
import java.io.Reader;
import java.sql.Connection;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
* ⼯具类
* @author AdminTC
*/
public class MybatisUtil {
	private static ThreadLocal<SqlSession> threadLocal = new ThreadLocal<SqlSession>();
	private static SqlSessionFactory sqlSessionFactory;
    /**
    * 加载位于src/mybatis.xml配置⽂件
    */
    static{
		try {
			Reader reader = Resources.getResourceAsReader("mybatis.xml");
			sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
    
    /**
    * 禁⽌外界通过new⽅法创建
    */
    private MybatisUtil(){}
    
    /**
    * 获取SqlSession
    */
    public static SqlSession getSqlSession(){
        //从当前线程中获取SqlSession对象
        SqlSession sqlSession = threadLocal.get();
        //如果SqlSession对象为空
        if(sqlSession == null){
            //在SqlSessionFactory⾮空的情况下，获取SqlSession对象
            sqlSession = sqlSessionFactory.openSession();
            //将SqlSession对象与当前线程绑定在⼀起
            threadLocal.set(sqlSession);
		}
        //返回SqlSession对象
        return sqlSession;
	}
    
    /**
    * 关闭SqlSession与当前线程分开
    */
    public static void closeSqlSession(){
        //从当前线程中获取SqlSession对象
        SqlSession sqlSession = threadLocal.get();
        //如果SqlSession对象⾮空
        if(sqlSession != null){
            //关闭SqlSession对象
            sqlSession.close();
            //分开当前线程与SqlSession对象的关系，⽬的是让GC尽早回收
            threadLocal.remove();
        }
	}
    
    /**
    * 测试
    */
    public static void main(String[] args) {
        Connection conn = MybatisUtil.getSqlSession().getConnection();
        System.out.println(conn!=null?"连接成功":"连接失败");
	}
}
```

* 创建实体与映射关系⽂件 - StudentMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- namespace属性是名称空间，必须唯⼀ -->
<mapper namespace="cn.javaee.mybatis.Student">
	<!-- 
		resultMap标签:映射实体与表
		type属性：表示实体全路径名
		id属性：为实体与表的映射取⼀个任意的唯⼀的名字
    -->
    <resultMap type="student" id="studentMap">
        <!-- 
            id标签:映射主键属性
            result标签：映射⾮主键属性
            property属性:实体的属性名
            column属性：表的字段名
        -->
		<id property="id" column="id"/>
		<result property="name" column="name"/>
		<result property="sal" column="sal"/>
	</resultMap>
    
    <!--
    	在JDBC中我们通常使⽤?号作为占位符，⽽在Mybatis中，我们是使⽤#{}作为占位符
		parameterType我们指定了传⼊参数的类型
		#{}实际上就是调⽤了Student属性的get⽅法
	-->
    <insert id="add" parameterType="Student">
        INSERT INTO ZHONGFUCHENG.STUDENTS (ID, NAME, SAL) VALUES (#{id},#{name},#
        {sal});
    </insert>
    
</mapper>
```

* 在程序中调⽤映射⽂件的SQL代码⽚段

```java
public void add(Student student) throws Exception {
    //得到连接对象
    SqlSession sqlSession = MybatisUtil.getSqlSession();
    try{
        //映射⽂件的命名空间.SQL⽚段的ID，就可以调⽤对应的映射⽂件中的SQL
        sqlSession.insert("StudentID.add", student);
        sqlSession.commit();
	}catch(Exception e){
        e.printStackTrace();
        sqlSession.rollback();
        throw e;
	}finally{
		MybatisUtil.closeSqlSession();
	}
}
```

【注意】：Mybatis中的事务是默认开启的，因此我们在完成操作以后，需要我们⼿动去提交事务！

## 3. Mybatis⼯作流程

```
1. 通过Reader对象读取Mybatis映射⽂件
2. 通过SqlSessionFactoryBuilder对象创建SqlSessionFactory对象
3. 获取当前线程的SQLSession
4. 事务默认开启
5. 通过SQLSession读取映射⽂件中的操作编号，从⽽读取SQL语句
6. 提交事务
7. 关闭资源
```

## 4. 动态SQL

```xml
<!--多条件查询【动态SQL】-->
<!--会⾃动组合成⼀个正常的WHERE字句-->
<!--name值会从map中寻找-->
<select id="findByCondition" resultMap="studentMap" parameterType="map">
	select * from students
    <where>
        <if test="name!=null">
        	and name=#{name}
        </if>
        <if test="sal!=null">
        	and sal < #{sal}
        </if>
    </where>
</select>
    
<!--动态更新-->
<!--不要忘了逗号-->
<update id="updateByConditions" parameterType="map">
    update students
    <set>
        <if test="name!=null">
        	name = #{name},
        </if>
        <if test="sal!=null">
        	sal = #{sal},
        </if>
    </set>
    where id = #{id}
</update>
    
<!--动态删除-->
<delete id="deleteByConditions" parameterType="int">
    <!-- 
        foreach⽤于迭代数组元素
        open表示开始符号
        close表示结束符合
        separator表示元素间的分隔符
        item表示迭代的数组，属性值可以任意，但提倡与⽅法的数组名相同
        #{ids}表示数组中的每个元素值
    -->
	delete from students where id in
	<foreach collection="array" open="(" close=")" separator="," item="ids">
		#{ids}
	</foreach>
</delete>
    
    
<!--SQL⽚段默认是不帮我们⾃动⽣成合适的SQL，因此需要我们⾃⼰⼿动除去逗号-->
<sql id="key">
	<trim suffixOverrides=",">
        <if test="id!=null">
            id,
        </if>
        <if test="id!=null">
            name,
        </if>
        <if test="id!=null">
            sal,
        </if>
    </trim>
</sql>
<sql id="value">
    <trim suffixOverrides=",">
        <if test="id!=null">
        	#{id},
        </if>
        <if test="id!=null">
        	#{name},
        </if>
        <if test="id!=null">
        	#{sal},
        </if>
    </trim>
</sql>

<!--动态插⼊-->
<insert id="insertByConditions" parameterType="zhongfucheng.Student">
	insert into students (<include refid="key"/>) values (<include refid="value"/>)
</insert>
```

## 5. ⼊⻔总结

```
1. Mybatis的准备⼯作与Hibernate差不多，都需要⼀个总配置⽂件、⼀个映射⽂件。
2. Mybatis的SQLSession⼯具类使⽤ThreadLocal来对线程中的Session来进⾏管理。
3. Mybatis的事务默认是开启的，需要我们⼿动去提交事务。
4. Mybatis的SQL语句是需要⼿写的，在程序中通过映射⽂件的命名空间.sql语句的id来进⾏调⽤!
5. Mybatis中，增删改查都是Mybatis需要我们⾃⼰写SQL语句的，然后在程序中调⽤即可了。SQL
	由于是我们⾃⼰写的，于是就相对Hibernate灵活⼀些。
6. 如果需要传⼊多个参数的话，那么我们⼀般在映射⽂件中⽤Map来接收。
	由于我们在开发中会经常⽤到条件查询，在之前，我们是使⽤查询助⼿来帮我们完成对SQL的拼接的。⽽Mybatis的话，我们是⾃⼰⼿写SQL代码的。
7. Mybatis也⽀持⼀些判断标签，于是我们就可以通过这些标签来完成动态CRUD的操作了。
8. 值得注意的是，我们的sql⽚段代码是需要我们⾃⼰⼿动去分割，号的。
```



# Mybatis配置信息

## 1. 映射⽂件

```
在mapper.xml⽂件中配置很多的sql语句，执⾏每个sql语句时，封装为MappedStatement对象，
mapper.xml以statement为单位管理sql语句，Statement的实际位置就等于namespace+StatementId
```

* 占位符

```
在Mybatis中，有两种占位符
    #{} 解析传递进来的参数数据
    ${} 对传递进来的参数原样拼接在SQL中
```

* 主键⽣成策略

```xml
1. UUID
<!-- mysql的uuid⽣成主键 -->
<insert id="insertUser" parameterType="cn.mybatis.po.User">
	<selectKey keyProperty="id" order="BEFORE" resultType="string">
		select uuid()
	</selectKey>
	INSERT INTO USER(id,username,birthday,sex,address) VALUES(#{id},#{username},#{birthday},#{sex},#{address})
</insert>
```

* 主键返回

```xml
mysql: 
<insert id="insertUser" parameterType="cn.mybatis.po.User">
	<selectKey keyProperty="id" order="AFTER" resultType="int">
		select LAST_INSERT_ID()
	</selectKey>
	INSERT INTO USER(username,birthday,sex,address) VALUES(#{username},#{birthday},#{sex},#{address})
</insert>

oracle: 
<!-- oracle在执⾏insert之前执⾏select 序列.nextval() from dual取出序列最⼤值，将值设置到user对象的id属性-->
<insert id="insertUser" parameterType="cn.mybatis.po.User">
	<selectKey keyProperty="id" order="BEFORE" resultType="int">
		select 序列.nextval() from dual
	</selectKey>
	INSERT INTO USER(id,username,birthday,sex,address) VALUES( 序列.nextval(),#{username},#{birthday},#{sex},#{address})
</insert>
```

* resultMap

```xml
数据表的字段和JavaBean的属性名称是不相同时，需要使用resultMap来进⾏封装成JavaBean
<resultMap id="userListResultMap" type="user" >
<!-- 列名
    id_,username_,birthday_
    id：要映射结果集的唯 ⼀标识 ，称为主键
    column：结果集的列名
    property：type指定的哪个属性中
-->
	<id column="id_" property="id"/>
    <!-- result就是普通列的映射配置 -->
    <result column="username_" property="username"/>
    <result column="birthday_" property="birthday"/>
</resultMap>
```

* resultMap和resultType区别

```xml
resultType：
	指定输出结果的类型（pojo、简单类型、hashmap..），将sql查询结果映射为java对象。
	注意：sql查询的列名要和resultType指定pojo的属性名相同，指定相同 属性⽅可映射成功，如果sql查询的列名要和resultType指定pojo的属性名全部不相同，list中⽆法创建pojo对象的。
resultMap：
	将sql查询结果映射为java对象。
	如果sql查询列名和最终要映射的pojo的属性名不⼀致，使⽤resultMap将列名和pojo的属性名做⼀个对应关系 （列名和属性名映射配置）
```

* 使⽤resultMap

```xml
```

* resultType和resultMap⽤法总结

```xml
resultType：
    作⽤：将查询结果按照sql列名pojo属性名⼀致性映射到pojo中。
    场合：常⻅⼀些明细记录的展示，将关联查询信息全部展示在⻚⾯时，此时可直接使⽤resultType将每⼀条记录映射到pojo中，在前端⻚⾯遍历list（list中是pojo）即可。
resultMap：
	使⽤association和collection完成⼀对⼀和⼀对多⾼级映射。
association：
    作⽤：将关联查询信息映射到⼀个pojo类中。
    场合：为了⽅便获取关联信息可以使⽤association将关联订单映射为pojo，⽐如：查询订单及关联⽤户信息。
collection：
    作⽤：将关联查询信息映射到⼀个list集合中。
    场合：为了⽅便获取关联信息可以使⽤collection将关联信息映射到list集合中，⽐如：查询⽤户权限范围模块和功能，可使⽤collection将模块和功能列表映射到list中。
```

* Mybatis映射⽂件处理特殊字符

```xml
第⼀种⽅法：
	⽤了转义字符把 '>' 和 '<' 替换掉
第⼆种⽅法：
<![CDATA[ ]]>
```





## 2. 配置⽂件

2.1别名
2.2Mapper加载
2.3延迟加载
2.4 延迟加载测试



## 3. 配置相关总结







# 关联映射



# 缓存+Mapper代理+逆向⼯程



# Mybatis整合Spring



# Mybatis常⻅⾯试题

