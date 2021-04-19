## RabbitMQ核心API

	#### Exchange交换机

```
· Exchange: 接收消息，并根据路由键转发消息所绑定的队列
· Name: 交换机名称
· Type: 交换机类型
	direct: 精准匹配routingKey
	topic: 通配符模糊匹配，如，test.*, test.#
	fanout: 类似广播模式
	headers: 请求头模式
· Durability: 是否需要持久化，true为持久化
· Auto Delete: 当最后一个绑定到Exchange上的队列删除后，自动删除该Exchange
· Internal: 当前Exchange是否用于RabbitMQ内部使用，默认为false
· Arguments: 扩展参数，用户扩展AMQP协议自定制化使用
```



```java
### 核心api-玩转exchange的公用代码
ConnectionFactory connectionFactory = new ConnectionFactory();
connectionFactory.setHost("192.168.11.71");
connectionFactory.setPort(5672);
connectionFactory.setVirtualHost("/");
connectionFactory.setAutomaticRecoveryEnabled(true);
connectionFactory.setNetworkRecoveryInterval(3000);
Connection connection = connectionFactory.newConnection();
Channel channel = connection.createChannel();  
```



### 1. 核心API-Exchange之Direct

```
所有发送到Direct Exchange的消息被转发到RoutingKey中指定的Queue
注意: Direct模式可以使用RabbitMQ自带的Exchange--defaultExchange，所以不需要讲Exchange进行任何绑定操作，消息传递时，RoutingKey必须完全匹配队列的名称，才会被队列接收，否则该消息会被抛弃。
```

#### 1.1 消费者

```java
String exchangeName = "test_direct_exchange";
String exchangeType = "direct";
String queueName = "test_direct_queue";
String routingKey = "test_direct_routingKey";
// 声明exchange、exchange类型
channel.exchangeDeclare(exchangeName, exchangeType, true, false, false, null);
// 声明queue
channel.queueDeclare(queueName, false, false, false, null);
// 将exchange、queue和routingKey绑定
channel.queueBind(queueName, exchangeName, routingKey);
		
//durable 是否持久化消息
QueueingConsumer consumer = new QueueingConsumer(channel);
//参数：队列名称、是否自动ACK、Consumer
channel.basicConsume(queueName, true, consumer);  
//循环获取消息  
while(true){  
	//获取消息，如果没有消息，这一步将会一直阻塞  
	Delivery delivery = consumer.nextDelivery();  
	String msg = new String(delivery.getBody());    
	System.out.println("收到消息：" + msg);  
} 
```

### 1.2 生产者

```Java
//4 声明
String exchangeName = "test_direct_exchange";
String routingKey = "test_direct_routingKey";
//5 发送		
String msg = "Hello World RabbitMQ 4  Direct Exchange Message ... ";
channel.basicPublish(exchangeName, routingKey , null , msg.getBytes());
```



### 2. 核心API-Exchange之Topic

```
· 所有发送到Topic Exchange的消息被转发到所有关联RoutingKey中指定Topic的Queue上。
· Exchange将RoutingKey和某个Topic进行模糊匹配，此时队列需要绑定一个Topic
· 可以使用通配符进行模糊匹配
	符号"#"匹配一个或多个词；
	符号"*"匹配一个词；
	例如："log.#"能够匹配到"log.info.oa", "log.error.oa"
		 "log.*"能够匹配到"log.debug"
```

### 2.1 消费者A-使用通配符*

```java
//4 声明
String exchangeName = "test_topic_exchange";
String exchangeType = "topic";
String queueName = "test_topic_queue";
String routingKey = "user.*";
//String routingKey = "user.#";
channel.exchangeDeclare(exchangeName, exchangeType, true, false, false, null);
channel.queueDeclare(queueName, false, false, false, null);
channel.queueBind(queueName, exchangeName, routingKey);
		
//durable 是否持久化消息
QueueingConsumer consumer = new QueueingConsumer(channel);
//参数：队列名称、是否自动ACK、Consumer
channel.basicConsume(queueName, true, consumer); 
System.err.println("consumerA start .. ");
//	循环获取消息  
while(true){  
	//获取消息，如果没有消息，这一步将会一直阻塞  
	Delivery delivery = consumer.nextDelivery();  
	String msg = new String(delivery.getBody());    
	System.out.println("收到消息：" + msg + ", RoutingKey: " + 		
                       	delivery.getEnvelope().getRoutingKey());  
} 
```

### 2.2 消费者B-使用通配符#

```java
//4 声明
String exchangeName = "test_topic_exchange";
String exchangeType = "topic";
String queueName = "test_topic_queue";
//String routingKey = "user.*";
String routingKey = "user.#";
channel.exchangeDeclare(exchangeName, exchangeType, true, false, false, null);
channel.queueDeclare(queueName, false, false, false, null);
channel.queueBind(queueName, exchangeName, routingKey);
		
//durable 是否持久化消息
QueueingConsumer consumer = new QueueingConsumer(channel);
//参数：队列名称、是否自动ACK、Consumer
channel.basicConsume(queueName, true, consumer); 
System.err.println("consumerB start .. ");
//	循环获取消息  
while(true){  
	//获取消息，如果没有消息，这一步将会一直阻塞  
	Delivery delivery = consumer.nextDelivery();  
	String msg = new String(delivery.getBody());    
	System.out.println("收到消息：" + msg + ", RoutingKey: " + 		
                       	delivery.getEnvelope().getRoutingKey());  
} 
```

### 2.3 生产者

```java
//4 声明
String exchangeName = "test_topic_exchange";
String routingKey1 = "user.save";
String routingKey2 = "user.update";
String routingKey3 = "user.delete.abc";
//5 发送
String msg = "Hello World RabbitMQ 4 Topic Exchange Message ...";
channel.basicPublish(exchangeName, routingKey1 , null , msg.getBytes()); 
channel.basicPublish(exchangeName, routingKey2 , null , msg.getBytes()); 	
channel.basicPublish(exchangeName, routingKey3 , null , msg.getBytes()); 
channel.close();  
connection.close(); 
```



### 3. 核心API-Exchange之Fanout

```
· 不处理路由键，只需要简单的将队列绑定到交换机上
· 发送到交换机的消息兜回被转发到与该交换机绑定的所有队列上
· Fanout交换机转发消息是最快的
```

### 3.1 消费者

```java
//4 声明
String exchangeName = "test_fanout_exchange";
String exchangeType = "fanout";
String queueName = "test_fanout_queue";
String routingKey = "";	//	不设置路由键
channel.exchangeDeclare(exchangeName, exchangeType, true, false, false, null);
channel.queueDeclare(queueName, false, false, false, null);
channel.queueBind(queueName, exchangeName, routingKey);
		
//durable 是否持久化消息
QueueingConsumer consumer = new QueueingConsumer(channel);
//参数：队列名称、是否自动ACK、Consumer
channel.basicConsume(queueName, true, consumer); 
System.err.println("--------------- consumer 1 --------------");
//循环获取消息  
while(true){  
	//获取消息，如果没有消息，这一步将会一直阻塞  
	Delivery delivery = consumer.nextDelivery();  
	String msg = new String(delivery.getBody());    
	System.out.println("收到消息：" + msg);  
} 
```

### 3.2 生产者

```java
//4 声明
String exchangeName = "test_fanout_exchange";
//5 发送
for(int i = 0; i < 10; i ++) {
	String msg = "Hello World RabbitMQ 4 FANOUT Exchange Message ...";
	channel.basicPublish(exchangeName, "11" , null , msg.getBytes()); 			
}
channel.close();  
connection.close();  
```



### 4. 核心API之其他概念

### 4.1 Binding-绑定

```
· Exchange和Exchange、Queue之间的连接关系
· Binding中可以包含RoutingKey或者参数
```

### 4.2 Queue-消息队列

```
· 消息队列，实际存储消息数据
· Durability: 是否持久化; Durable: 持久化, Transient: 非持久化
· Auto Delete: 如选yes，代表当最后一个监听被移除之后，该Queue会自动被删除。
```

### 4.3 Message-消息

```
· 服务器和应用程序之间传送的数据
· 本质上就是一段数据，由Properties和PayLoad(Body)组成
· 常用属性: delivery mode, headers(自定义属性)
```

### 4.4  VirtualHost-虚拟主机

```
· 虚拟地址，用户进行逻辑隔离，最上层的消息路由
· 一个VirtualHost里面可以由若干个Exchange和Queue
· 同一个VirtualHost里面不能有相同名称的Exchange或Queue
```



