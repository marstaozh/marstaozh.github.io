## 初识RabbitMQ

* RabbitMQ是一个开源的消息代理和队列服务器，用来通过普通协议在完全不同的应用之间共享数据，RabbitMQ是使用Erlang语言来编写的，并且RabbitMQ是基于AMQP协议的。

### 1. 什么是AMQP协议

* AMQP全称：Advanced Message Queuing Protocol(高级消息队列协议)
* AMQP定义：是具有现代特征的二进制协议。是一个提供统一消息服务的应用层标准高级消息队列协议，是应用层协议的一个开放标准，为面向消息的中间件设计。
* AMQP协议模型：

```
						+-----------Server------------------+
						|	+----Virtual-Host-----------+	|
+-------------+			|	|	+---------------+		|	|
|Publisher	  |	--------|---|-->| Exchange		|		|	|
|Application  |			|	|	+-------+-------+		|	|
+-------------+			|	|			|				|	|
						|	|			|				|	|
						|	|			|				|	|
+-------------+			|	|	+-------+-------+		|	|
|Counsumer	  | <-------|---|-- +-----Message---+		|	|
|Application  |			|	|	+------Queue----+		|	|
+-------------+			|	|	+---------------+		|	|
						|	+---------------------------+	|
						+-----------------------------------+
```

### 2. AMQP核心概念

* Server：又称Broker，接受客户端的连接，实现AMQP实体服务
* Connection：连接，应用程序与Broker的网络连接
* Channel：网络信道，几乎所有的操作都在Channel中进行，Channel是进行消息读写的通道。客户端可建立多个Channel，每个Channel代表一个会话任务。
* Message：消息，服务器和应用程序之间传输的数据，由Properties和Body组成。Properties可以对消息进行修饰，比如消息的优先级，延迟等高级特性；Body则就是消息体内容。
* Virtual Host：虚拟地址，用于进行逻辑隔离，最上层的消息路由。一个Virtual Host里面可以由若干个Exchange和Queue，同一个Virtual Host里面不能有相同名称的Exchange和Queue。
* Exchange：交换机，接收消息，根据路由键转发消息到绑定的队列。
* Binding：绑定，Exchange和Queue之间的虚拟连接，Binding中可以包含RountingKey。
* Rounting Key：路由规则，虚拟机可以用它来确定如何路由一个特定消息。
* Queue：也称Message Queue，消息队列，保存消息并将它们转发给消费者。

### 3. RabbitMQ的整体架构

```
Applications		Exchanges					Queues								Applications
Produce				Route and Filter			Store and Forware					Consume
Messages			Messages					Messages							Messages

+---+				+---+						+---++---++---+						+---+
| P | ------+-----> | X |	----+---------->	| Q || Q || Q | ----+------------->	| C |
+---+		|		+---+		|				+---++---++---+		↓				+---+
			↑					↓									|				+---+
			|					|									+----->-------> | C |
		+---+					+-->----+							|				+---+
+---+	↑			+---+				↓		+---++---++---+		↑				+---+
| P |---+---------> | X |	------------+-->	| Q || Q || Q | ----+------------>	| C |
+---+				+---+						+---++---++---+						+---+

Clients				Servers															Clients
```

### 4. RabbitMQ的消息流转

```
+------------+														+------------+
|Publisher	 |	--------------------------------------------------> |  Message	 |
|Application |														+-------+----+
+------------+																↓
																			|
																	+-------+----+
                                                                    |  Exchange  |
                                                                    +-------+----+
                                                                    		↓
											+------------<--------------+---------------------------+
											↓							|							|
										+--------+					+--------+					+--------+
                                        | Message|					| Message|					| Message|
+-------------------+                   | Queue	 |					| Queue	 |					| Queue	 |
|	Consumer        |                   +--------+ 					+--------+					+--------+ 
|	Application		| <---------------- | Message|					| 		 |					| 		 |
+-------------------+                   +--------+					+--------+					+--------+
```

![mindMapping](mindMapping.png)

