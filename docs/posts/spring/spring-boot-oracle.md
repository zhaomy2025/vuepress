---
title: SpringBoot集成Oracle
date: 2025-06-19T03:23:36.522Z
category:
  - spring
  - spring-boot-oracle
tags:
  - spring
  - spring-boot-oracle
---

# SpringBoot 集成 Oracle
[[toc]]

## JDBC、ORM、JPA、MyBatis对比
JDBC（Java Database Connectivity）是Java语言操作关系型数据库的标准API，它允许开发者通过Java程序（而非数据库控制台）执行SQL语句并处理结果。作为Java SE的一部分，JDBC提供了一套与数据库无关的通用接口，具体实现由各数据库厂商的驱动完成。

ORM（Object Relational Mapping，对象关系映射）通过元数据描述Java对象与数据库表之间的映射关系，实现数据的自动转换和持久化。ORM框架的核心价值在于：
- 自动将对象操作转换为SQL语句
- 简化数据在不同形式（对象/关系型）间的转换
- 减少样板代码，提高开发效率

JPA（Java Persistence API）是Java EE（现Jakarta EE）制定的ORM规范，Spring Data JPA是其实现之一（基于Hibernate）。技术特点：
- 标准化：JSR规范，确保不同实现间的兼容性
- 注解驱动：通过@Entity、@Table等注解定义映射
- 方法派生：根据方法名自动生成查询
- 全球主流：欧美企业级开发的事实标准

MyBatis作为半自动化的持久层框架，在国内开发市场占据主导地位，其特点包括：
- SQL可控性：保留原生SQL编写能力
- 灵活映射：通过XML或注解配置对象-关系映射
- 动态SQL：强大的`<if>/<foreach>`等标签
- 延伸生态：MyBatis-Plus在保留SQL控制力的同时增强CRUD功能

国内项目常采用混合架构：使用MyBatis处理复杂查询，同时借助MyBatis-Plus简化基础CRUD操作，在保证SQL可控性的前提下提升开发效率。而国际项目则更多采用符合JPA标准的全ORM方案，强调领域模型的一致性和数据库可移植性。

## SpringBoot集成Oracle - 基于JPA
1. 添加`spring-boot-starter-data-jpa`依赖
2. 配置数据源
3. 定义实体，添加@Entity注解，和@Table注解，属性配置如下：
   - 添加@Id注解，指定主键
   - 添加@Column注解，指定列名和类型
   - 添加@GeneratedValue注解，指定主键生成策略，比如IDENTITY、SEQUENCE、TABLE等
   - 添加@Temporal注解，指定日期类型，比如DATE、TIME、TIMESTAMP等
4. 定义dao层，集成JpaRepository，添加@Repository注解
5. 定义service层，定义接口及实现类，添加@Service注解，如需事务管理，添加@Transactional注解
   - 注入dao层的实现类，将数据查询更新任务委托给dao层
6. 定义controller层，添加@RestController注解，
   - 注入service层的实现类

::: tip
主要是定义实体和dao层不同，Controller层和Service层与普通的Spring项目没有区别。
:::
   
::: code-tabs#java
@tab pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
@tab application.yml
```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:orcl
    username: username
    password: password
    driver-class-name: oracle.jdbc.driver.OracleDriver
```
@tab User.java
```java
@Entity
@Table(name = "tb_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "emp_seq", sequenceName = "TS_USER_SEQ", allocationSize = 1)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;
    private String name;
    private Integer age;
}
```
@tab UserRepository.java
```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByNameContaining(String name);
    
    @Query("SELECT * FROM tb_user  WHERE age > :minAge")
    List<User> findByAgeGreaterThan(@Param("minAge") BigDecimal minAge);
}
```

@tab UserService.java
```java
@Service
@Transactional
public class UserService {
    @Autowired
    private final UserRepository repository;    
    
    public User saveUser(User user) {
        return repository.save(user);
    }
}
```

:::

## SpringBoot集成Oracle - 基于MyBatis
1. 添加依赖
2. 配置数据源和MyBatis
3. 定义实体，无特殊处理
4. 定义Mapper接口，添加@Mapper注解，对应方法上添加@Select、@Insert、@Update、@Delete注解
5. XML映射文件

::: code-tabs#java

@tab pom.xml
   
```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.0</version>
</dependency>
```

@tab application.yml

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:orcl
    username: username
    password: password
    driver-class-name: oracle.jdbc.driver.OracleDriver

mybatis:
  type-aliases-package: com.example.demo.entity
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
```

@tab User.java
```java
public class User {
    private Long id;
    private String name;
    private Integer age;
}
```
@tab UserMapper.java
```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM TS_USER WHERE ID = #{id}")
    User findById(Long id);
    
    @Insert("INSERT INTO TS_USER(NAME, AGE) VALUES(#{name}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "ID")
    void insert(User user);
    
    @Update("UPDATE TS_USER SET NAME=#{name}, AGE=#{age} WHERE ID=#{id}")
    void update(User user);
    
    @Delete("DELETE FROM TS_USER WHERE ID=#{id}")
    void delete(Long id);
}
```

@tab UserMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    <resultMap id="userResultMap" type="com.example.model.User">
        <id property="id" column="ID"/>
        <result property="name" column="NAME"/>
        <result property="age" column="AGE"/>
    </resultMap>
    
    <select id="findAll" resultMap="userResultMap">
        SELECT * FROM TS_USER
    </select>
</mapper>
```
:::

## SpringBoot集成Oracle - 基于MyBatis-Plus
1. 添加`spring-boot-starter-jdbc`和`mybatis-plus-boot-starter`依赖
2. 配置数据源和MyBatis-Plus
3. 定义实体，添加@Data、@TableName注解，属性配置如下：
   - 添加@TableId注解，指定主键
   - 添加@TableField注解，指定列名和类型
4. 定义Mapper接口，继承`BaseMapper`
   - 简单查询直接使用方法名派生查询
   - 复杂查询通过QueryWrapper条件构造器处理

::: code-tabs#java
@tab pom.xml
```xml
<!-- Spring Boot Starter JDBC -->
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

  <!-- MyBatis-Plus Starter -->
<dependency>
   <groupId>com.baomidou</groupId>
   <artifactId>mybatis-plus-boot-starter</artifactId>
   <version>3.5.3.1</version>
</dependency>
```

@tab application.yml
```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:orcl
    username: username
    password: password
    driver-class-name: oracle.jdbc.driver.OracleDriver

mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.demo.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto # 全局主键生成策略
      logic-delete-field: deleted # 逻辑删除字段名
      logic-delete-value: 1 # 逻辑删除值
      logic-not-delete-value: 0 # 逻辑未删除值
```

@tab User.java
```java
@TableName("user")
public class User {
    @TableId(value = "user_id")
    private Long id;
    
    @TableField("user_name")
    private String name;
}
```

@tab Mapper.java
```java
public interface UserMapper extends BaseMapper<User> {
    // 自定义方法
    List<User> selectByName(@Param("name") String name);
    List<User> selectByNameAndAge(String name, Integer age){
        return selectList(new QueryWrapper<User>().like("NAME", name).gt("AGE", age));
    }
}
```

:::

::: tip
MyBatis-Plus是 MyBatis 的增强工具，重点介绍MyBatis-Plus的增强的功能，其他配置和MyBatis相同，不再赘述。
- 内置CRUD方法，无需编写SQL
- 内置条件构造器，无需编写SQL
- 内置分页支持，无需额外引入分页插件
- 查询结果自动映射实体类属性，无需使用@Results注解
:::
  
### 查询方法及参数
MyBatis-Plus的Mapper接口继承`BaseMapper`，提供了丰富的查询方法：
- 简单查询直接使用方法名派生查询
- 复杂查询通过QueryWrapper条件构造器处理
- 无需使用@Param注解，直接使用参数名

### 分页
Mybatis需要手动编写分页查询的sql语句，Mybatis-Plus则可以自动生成分页查询的sql语句，并将分页结果封装成Page对象返回。
::: code-tabs#java
@tab Mybatis 注解方式
```java
@Select("SELECT * FROM (SELECT T.*,ROWNUM AS RN FROM TS_USER T ORDER BY ID) WHERE  RN >= #{startRow} AND RN < #{endRow}")
List<User> selectPage(@Param("startRow") int startRow, @Param("endRow") int endRow);
```
@tab Mybatis XML方式
```xml
<select id="selectPage" resultMap="userResultMap">
SELECT a.*, ROWNUM RN FROM (
    SELECT * FROM TS_USER
    <where>
        <if test="name != null and name != ''">
            NAME LIKE '%'||#{name}||'%'
        </if>
    </where>
    ORDER BY ID
) a WHERE RN &lt;= #{page.endRow} AND RN &gt;= #{page.startRow}
</select>
```
@tab MyBatis-Plus
```java
Page<User> page = new Page<>(1, 10);
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.like("NAME", "张");
Page<User> result = userMapper.selectPage(page, wrapper);
```
:::

### 结果映射
```java
// MyBatis方式
@Results({
    @Result(property = "id", column = "user_id"),
    @Result(property = "name", column = "user_name")
})
@Select("SELECT user_id, user_name FROM user")
List<User> selectAll();

// MyBatis-Plus方式
@TableName("user")
public class User {
    @TableId(value = "user_id")
    private Long id;
    
    @TableField("user_name")
    private String name;
}
```

## 总结
以下是Spring Boot集成Oracle时，JPA、MyBatis和MyBatis-Plus的详细对比表格：

| **对比项**               | **JPA/Hibernate**                                   | **MyBatis**                                        | **MyBatis-Plus**                                   |
|--------------------------|----------------------------------------------------|---------------------------------------------------|---------------------------------------------------|
| **ORM级别**              | 全自动ORM                                          | 半自动SQL映射                                     | 增强型MyBatis（保留SQL控制+简化CRUD）             |
| **实体类注解**           | `@Entity`<br>`@Table(name="表名")`<br>`@Column`    | 无需注解（XML/注解配置字段映射）                  | `@TableName`<br>`@TableField`                     |
| **主键策略**             | `@Id`<br>`@GeneratedValue`<br>(支持序列/自增)      | `@Id`（需手动配置）                               | `@TableId`<br>(内置多种主键策略)                  |
| **CRUD方法**             | 继承`JpaRepository`自动获得                        | 手动编写SQL（XML/注解）                           | 继承`BaseMapper`获得通用方法                      |
| **查询语句定义**         | `@Query("JPQL")`<br>方法名派生查询                 | `@Select`/`@Insert`<br>`@Update`/`@Delete`       | `@Select`等注解<br>+Wrapper条件构造器             |
| **动态SQL**              | Criteria API（复杂）                               | XML中`<if>`/`<foreach>`标签                      | `Wrapper`条件构造器                               |
| **关联关系**             | `@OneToMany`<br>`@ManyToOne`等                     | 需手动处理（ResultMap嵌套）                       | 需手动处理（同MyBatis）                           |
| **分页支持**             | `Pageable`+`Page`                                  | 手动编写SQL或插件                                   | 内置`Page`+`IPage`                                |
| **事务管理**             | `@Transactional`                                   | `@Transactional`                                  | `@Transactional`                                  |
| **缓存机制**             | 一级/二级缓存                                      | 基本缓存                                          | 同MyBatis                                         |
| **复杂查询灵活性**       | 中等（JPQL限制）                                   | 极高（原生SQL）                                   | 高（Wrapper+原生SQL）                             |
| **代码生成工具**         | 有限支持                                           | MyBatis Generator                                 | MyBatis-Plus Generator                            |
| **多数据源支持**         | 需额外配置                                         | 需额外配置                                        | 需额外配置                                        |
| **适用场景**             | 标准CRUD<br>领域模型复杂                           | 复杂SQL/报表<br>遗留系统                          | 需要平衡SQL控制与开发效率                         |

### 典型代码示例对比：

:::code-tabs#java
@tab 实体类/模型定义
```java
// JPA
@Entity
@Table(name = "USER")
public class Employee {
    @Id
    @GeneratedValue(strategy = SEQUENCE)
    private Long id;
    @Column(name = "NAME")
    private String name;
}

// MyBatis
public class User {
    private Long id;
    private String name; // 字段映射通过XML或注解
}

// MyBatis-Plus
@TableName("USER")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    @TableField("EMP_NAME")
    private String name;
}
```

@tab 查询示例
```java
// JPA
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT e FROM User e WHERE e.name LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
}

// MyBatis
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM USER WHERE NAME LIKE CONCAT('%',#{name},'%')")
    List<User> selectByName(@Param("name") String name);
}

// MyBatis-Plus
public interface UserMapper extends BaseMapper<User> {
    // 内置selectByMap/wrapper方法
    default List<User> selectByName(String name) {
        return selectList(new QueryWrapper<User>()
            .like("EMP_NAME", name));
    }
}
```

@tab 分页对比
```java
// JPA
Page<User> findAll(Pageable pageable);

// MyBatis
@Select("SELECT * FROM (SELECT T.*,RUWNUM AS RN FROM USER ) WHERE RN>=#{offset} AND RN<#{offset}+#{size}")
List<User> selectPage(@Param("offset") int offset, @Param("size") int size);

// MyBatis-Plus
Page<User> page = new Page<>(1, 10);
mapper.selectPage(page, wrapper);
```
:::
### 关键结论：
1. **开发效率**：JPA > MyBatis-Plus > MyBatis（标准CRUD场景）
2. **灵活性**：MyBatis ≈ MyBatis-Plus > JPA（复杂SQL场景）
3. **学习成本**：MyBatis最低，JPA最高（需理解Hibernate特性）
4. **维护性**：MyBatis-Plus在SQL可控性和代码简洁性上取得平衡