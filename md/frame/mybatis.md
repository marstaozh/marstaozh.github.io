

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



# 关联映射

## 1. 一对一

```

```



## 2. 一对多

```
1. 实体的属性设置：
	一方：实体中配置集合形式的多方
	多方：实体中配置一方的实体类属性
	如，一个班有多个学生，班级是一，学生是多，
	班级的实体中，配置 List<学生> 属性
	学生的实体中，配置 班级 属性
2. 配置文件：
	
```



## 3. 多对多

```
1. 实体的属性设置：
	多方：实体中配置另一多方的集合形式
	如，学生和课程的多对多关系
	学生实体中，配置 List<课程> 属性
	课程实体中，配置 List<学生> 属性
```



# 缓存+Mapper代理+逆向⼯程

## 1. Mybatis缓存

```
缓存的意义将⽤户经常查询的数据放在缓存（内存）中，⽤户去查询数据就不⽤从磁盘上(关系型数据库数据⽂件)查询，从缓存中查询，从⽽提⾼查询效率，解决了⾼并发系统的性能问题。
```

* Mybatis⼀级缓存

```
⼀个SqlSession级别，sqlsession只能访问⾃⼰的⼀级缓存的数据。
缓存使⽤的数据结构是⼀个map<key,value>
    key：hashcode+sql+sql输⼊参数+输出参数（sql的唯⼀标识）
    value：缓存数据
Mybatis默认就是⽀持⼀级缓存的，并不需要我们配置.
Mybatis和spring整合后进⾏mapper代理开发，不⽀持⼀级缓存，
    mybatis和spring整合，Spring按照mapper的模板去⽣成mapper代理对象，
    模板中在最后统⼀关闭sqlsession。
```

* Mybatis⼆级缓存

```xml
1. 是跨sqlSession，是mapper级别的缓存，
	对于mapper级别的缓存不同的sqlsession是可以共享的。
2. 缓存使用的数据结构是map<key、value>
3. 在Mybatis的配置⽂件中配置⼆级缓存
    <!-- 全局配置参数 -->
    <settings>
        <!-- 开启⼆级缓存 -->
        <setting name="cacheEnabled" value="true"/>
    </settings>
4. 在statement中设置useCache=false可以禁⽤当前select语句的⼆级缓存
<select id="findOrderListResultMap" resultMap="ordersUserMap"useCache="false">

5. 单独配置刷新缓存(但不建议使⽤)
<update id="updateUser" parameterType="cn.itcast.mybatis.po.User" flushCache="false">
```

* 查询结果映射的pojo序列化



# Mybatis整合Springboot

```
1. application.yml配置
    mybatis:
      # 所有POJO类所在包路径
      type-aliases-package: com.mars.minebatis.entity
      # mapper映射文件
      mapper-locations: classpath:mapper/*.xml
      configuration:
        # 将sql语句输出到控制台
        log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

2. 启动类添加注解
	@MapperScan("com.mars.minebatis.mapper")

3. Mapper类上添加注解
	@Repository
```



# Mybatis常⻅⾯试题

* #{}和${}的区别是什么？

```
在Mybatis中，有两种占位符
	#{} 解析传递进来的参数数据
	${}对传递进来的参数原样拼接在SQL中
	#{} 是预编译处理，${}是字符串替换。
	使⽤#{}可以有效的防⽌SQL注⼊，提⾼系统安全性。
```

* 当实体类中的属性名和表中的字段名不⼀样 ，怎么办 ？

```
第1种： 通过在查询的sql语句中定义字段名的别名，让字段名的别名和实体类的属性名⼀致
第2种： 通过 <resultMap> 来映射字段名和实体类属性名的⼀⼀对应的关系
```

* 如何获取⾃动⽣成的(主)键值?

```
mysql:
	通过LAST_INSERT_ID()获取刚插⼊记录的⾃增主键值，
	在insert语句执⾏后，执⾏select LAST_INSERT_ID()就可以获取⾃增主键。

oracle:
	先查询序列得到主键，将主键设置到user对象中，将user对象插⼊数据库。
```

* 在mapper中如何传递多个参数?

```
第⼀种：使⽤占位符的思想
	在映射⽂件中使⽤#{0},#{1}代表传递进来的第⼏个参数
	使⽤@param注解:来命名参数 #{0},#{1} ⽅式

第⼆种：使⽤Map集合作为参数来装载
```

* Mybatis动态sql是做什么的？都有哪些动态sql标签？能简述⼀下动态sql的执⾏原理不？

```
1. Mybatis动态sql可以让我们在Xml映射⽂件内，以标签的形式编写动态sql，完成逻辑判断和动态拼接sql的功能。

2. Mybatis提供了9种动态sql标签：			
	trim|where|set|foreach|if|choose|when|otherwise|bind。

3. 其执⾏原理为，使⽤OGNL从sql参数对象中计算表达式的值，根据表达式的值动态拼接sql，以此来完成动态sql的功能。
```

* Mybatis的Xml映射⽂件中，不同的Xml映射⽂件，id是否可以重复？

```
如果配置了namespace那么当然是可以重复的，因为我们的Statement实际上就是namespace+id
如果没有配置namespace的话，那么相同的id就会导致覆盖了。
```

* 为什么说Mybatis是半⾃动ORM映射⼯具？它与全⾃动的区别在哪⾥？

```
Hibernate属于全⾃动ORM映射⼯具，使⽤Hibernate查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全⾃动的。
⽽Mybatis在查询关联对象或关联集合对象时，需要⼿动编写sql来完成，所以，称之为半⾃动ORM映射⼯具。
```

* 通常⼀个Xml映射⽂件，都会写⼀个Dao接⼝与之对应，请问，这个Dao接⼝的⼯作原理是什么？Dao接⼝⾥的⽅法，参数不同时，⽅法能重载吗？

```
Dao接⼝，就是⼈们常说的Mapper接⼝，接⼝的全限名，就是映射⽂件中的namespace的值，接⼝的⽅法名，就是映射⽂件中MappedStatement的id值，接⼝⽅法内的参数，就是传递给sql的参数。

Mapper接⼝是没有实现类的，当调⽤接⼝⽅法时，接⼝全限名+⽅法名拼接字符串作为key值，可唯⼀定位⼀个MappedStatement。

Dao接⼝⾥的⽅法，是不能重载的，因为是全限名+⽅法名的保存和寻找策略。
Dao接⼝的⼯作原理是JDK动态代理，Mybatis运⾏时会使⽤JDK动态代理为Dao接⼝⽣成代理proxy对
象，代理对象proxy会拦截接⼝⽅法，转⽽执⾏MappedStatement所代表的sql，然后将sql执⾏结果
返回。
```

* Mybatis⽐IBatis⽐较⼤的⼏个改进是什么

```
a.有接⼝绑定,包括注解绑定sql和xml绑定Sql
b.动态sql由原来的节点配置变成OGNL表达式
c. 在⼀对⼀,⼀对多的时候引进了association,在⼀对多的时候引⼊了collection节点,不过都是在resultMap⾥⾯配置
```

* 接⼝绑定有⼏种实现⽅式,分别是怎么实现的?

```
1. ⼀种是通过注解绑定,就是在接⼝的⽅法上⾯加上@Select@Update等注解⾥⾯包含Sql语句来绑定
2. 另外⼀种就是通过xml⾥⾯写SQL来绑定,在这种情况下,要指定xml映射⽂件⾥⾯的namespace必须为接⼝的全路径名
```

* Mybatis是如何进⾏分⻚的？分⻚插件的原理是什么？

```
Mybatis使⽤RowBounds对象进⾏分⻚，它是针对ResultSet结果集执⾏的内存分⻚，⽽⾮物理分⻚，可以在sql内直接书写带有物理分⻚的参数来完成物理分⻚功能，也可以使⽤分⻚插件来完成物理分⻚。
分⻚插件的基本原理是使⽤Mybatis提供的插件接⼝，实现⾃定义插件，在插件的拦截⽅法内拦截待执⾏的sql，然后重写sql，根据dialect⽅⾔，添加对应的物理分⻚语句和物理分⻚参数。
```

* 简述Mybatis的插件运⾏原理，以及如何编写⼀个插件

```
Mybatis仅可以编写针对ParameterHandler、ResultSetHandler、StatementHandler、Executor这4种接⼝的插件，Mybatis使⽤JDK的动态代理，为需要拦截的接⼝⽣成代理对象以实现接⼝⽅法拦截功能，每当执⾏这4种接⼝对象的⽅法时，就会进⼊拦截⽅法，具体就是InvocationHandler的invoke()⽅法，当然，只会拦截那些你指定需要拦截的⽅法。
实现Mybatis的Interceptor接⼝并复写intercept()⽅法，然后在给插件编写注解，指定要拦截哪⼀个接⼝的哪些⽅法即可，记住，别忘了在配置⽂件中配置你编写的插件。
```

* Mybatis是否⽀持延迟加载？如果⽀持，它的实现原理是什么？

```
Mybatis仅⽀持association关联对象和collection关联集合对象的延迟加载，association指的就是⼀对⼀，collection指的就是⼀对多查询。在Mybatis配置⽂件中，可以配置是否启⽤延迟加载lazyLoadingEnabled=true|false。

它的原理是，使⽤CGLIB创建⽬标对象的代理对象，当调⽤⽬标⽅法时，进⼊拦截器⽅法，⽐如调⽤a.getB().getName()，拦截器invoke()⽅法发现a.getB()是null值，那么就会单独发送事先保存好的查询关联B对象的sql，把B查询上来，然后调⽤a.setB(b)，于是a的对象b属性就有值了，接着完成
a.getB().getName()⽅法的调⽤。这就是延迟加载的基本原理。

当然了，不光是Mybatis，⼏乎所有的包括Hibernate，⽀持延迟加载的原理都是⼀样的。
```

* Mybatis都有哪些Executor执⾏器？它们之间的区别是什么？

```
Mybatis有三种基本的Executor执⾏器，SimpleExecutor、ReuseExecutor、BatchExecutor。

SimpleExecutor：每执⾏⼀次update或select，就开启⼀个Statement对象，⽤完⽴刻关闭
Statement对象。

ReuseExecutor：执⾏update或select，以sql作为key查找Statement对象，存在就使⽤，不存在
就创建，⽤完后，不关闭Statement对象，⽽是放置于Map<String, Statement>内，供下⼀次使⽤。简⾔之，就是重复使⽤Statement对象。

BatchExecutor：执⾏update（没有select，JDBC批处理不⽀持select），将所有sql都添加到批处
理中（addBatch()），等待统⼀执⾏（executeBatch()），它缓存了多个Statement对象，每个Statement对象都是addBatch()完毕后，等待逐⼀执⾏executeBatch()批处理。与JDBC批处理相同。

作⽤范围：Executor的这些特点，都严格限制在SqlSession⽣命周期范围内。
```

* MyBatis与Hibernate有哪些不同？

```
Mybatis和hibernate不同:
	它不完全是⼀个ORM框架，因为MyBatis需要程序员⾃⼰编写Sql语句，不过mybatis可以通过XML或注解⽅式灵活配置要运⾏的sql语句，并将java对象和sql语句映射⽣成最终执⾏的sql，最后将sql执⾏的结果再映射⽣成java对象。

	Mybatis学习⻔槛低，简单易学，程序员直接编写原⽣态sql，可严格控制sql执⾏性能，灵活度⾼，⾮常适合对关系数据模型要求不⾼的软件开发，例如互联⽹软件、企业运营类软件等，因为这类软件需求变
化频繁，⼀但需求变化要求成果输出迅速。但是灵活的前提是mybatis⽆法做到数据库⽆关性，如果需
要实现⽀持多种数据库的软件则需要⾃定义多套sql映射⽂件，⼯作量⼤。
	Hibernate对象/关系映射能⼒强，数据库⽆关性好，对于关系模型要求⾼的软件（例如需求固定的定制化软件）如果⽤hibernate开发可以节省很多代码，提⾼效率。但是Hibernate的缺点是学习⻔槛⾼，要
精通⻔槛更⾼，⽽且怎么设计O/R映射，在性能和对象模型之间如何权衡，以及怎样⽤好Hibernate需要具有很强的经验和能⼒才⾏。

总之，按照⽤户的需求在有限的资源环境下只要能做出维护性、扩展性良好的软件架构都是好架构，所
以框架只有适合才是最好。
```

