---
title: JavaMailSender
date: 2025-07-28T07:13:15.813Z
category:
  - java
  - module
  - JavaMailSender

tags:
  - java
  - module
  - JavaMailSender

---

# JavaMailSender
[[toc]]

JavaMailSender 是Spring Framework提供的邮件发送接口，对JavaMail API进行了封装，简化了邮件发送流程，支持Spring依赖注入和配置文件管理，是企业级Java应用的首选方案。  
以下是使用 JavaMail 发送邮件的步骤：
1. 获取邮件服务器信息
2. 引入`spring-boot-starter-mail`依赖
3. 配置文件
4. 创建会话
    1. 继承Authenticator，重写getPasswordAuthentication()方法，用于登陆校验
    2. 创建一个Properties对象，用于存放SMTP服务器地址、端口号
    3. 用步骤1和2得到的对象创建一个Session对象，相当于邮箱登录
5. 创建邮件消息（MimeMessage）
    1. 创建MimeMessage，设置发件人、收件人、抄送人、主题、内容，添加附件
6. 发送邮件
    1. 使用Transport发送邮件

## 引入依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

## 配置文件（application.yml）
```yaml
spring:
  mail:
    host: smtp.qq.com
    port: 587
    username: your-qq@qq.com
    password: your-authorization-code # QQ邮箱需使用授权码而非登录密码
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

## 发送简单附件
```java
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;  // Spring自动配置的发送器

    // 发送HTML邮件
    public void sendHtmlEmail() {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@example.com");  // 发件人
        helper.setTo("to@example.com"); // 收件人
        helper.setCc("cc@example.com"); // 抄送人
        helper.setBcc("bcc@example.com"); // 密送人
        helper.setSubject("测试邮件"); // 邮件主题
        helper.setText("<h1>这是一封测试邮件，请勿回复。</h1>", true);  // 第二个参数true表示HTML内容
        mailSender.send(message); // 发送邮件
    }
}
```

## 发送带附件的邮件
```java
public void sendEmailWithAttachment() {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setFrom("sender@example.com");
    helper.setTo("to@example.com");
    helper.setSubject("测试邮件");
    helper.setText("这是一封测试邮件，请勿回复。");
    FileSystemResource file = new FileSystemResource(new File("test.pdf"));
    helper.addAttachment("附件名称.pdf", file);  // 添加附件
    mailSender.send(message);
}
```

## 抄送与密送
```java
// 抄送
helper.setCc("cc@example.com");
helper.setCc(new InternetAddress("cc@example.com", "张三")); // 支持带个人名称的抄送
// 设置多个抄送人
helper.setCc(String[] cc);
helper.setCc(InternetAddress[] cc);
// 逐个添加抄送人
helper.addCc(String cc);
helper.addCc(InternetAddress cc);

// 密送
helper.setBcc(String bcc);
helper.setBcc(InternetAddress bcc);
// 设置多个密送人
helper.setBcc(String[] bcc);
helper.setBcc(InternetAddress[] bcc);
// 逐个添加密送人
helper.addBcc(String bcc);
helper.addBcc(InternetAddress bcc);
```

## 连接池和配置
```java
@Bean
public JavaMailSender javaMailSender() {
    JavaMailSenderImpl sender = new JavaMailSenderImpl();
    // 其他基础配置...
    Properties props = sender.getJavaMailProperties();
    props.put("mail.smtp.connectiontimeout", 5000);  // 连接超时
    props.put("mail.smtp.timeout", 3000);             // 发送超时
    return sender;
}
```

## 关键类说明
- JavaMailSender 核心发送接口，提供创建消息、发送邮件等方法 
- MimeMessageHelper 辅助类，简化复杂邮件构建（支持HTML、附件等） 
- MimeMessage 表示一封MIME邮件，支持多部分内容

## 代码示例

@[code](../../../code/src/main/java/site/zmyblog/mail/EmailService.java)