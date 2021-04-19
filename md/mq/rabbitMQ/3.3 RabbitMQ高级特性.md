## RabbitMQ高级特性

### 1. 消息如何保障100%的投递成功

#### 1.1. 什么是生产端的可靠性投递？

```
· 保障消息的成功发出
· 保障MQ节点的成功接收
· 发送端收到MQ节点(Broker)确认应答
```

#### 1.2. BAT/TMD 互联网大厂的解决方案：

```
·消息信息落库，对消息状态进行打标
step1：业务数据落库
step2：消息信息落库
step3：发送消息到MQ
step4：Broker应答收到消息
step5：组件更新消息在数据库中的状态
step6：分布式定时任务查看消息的状态
step7：定时任务发现后重发消息
step8：重复定时器
```

### 2. 幂等性概念详解

#### 2.1. 幂等性是什么？

```
· 可以借鉴数据库的乐观锁机制
· 执行数据库更新sql
	update table_name set filed = 'value', version = version + 1 where version = 1
```

### 3. 在海量订单产生的业务高峰期，如何避免消息的重复消费问题？

```
· 消费端实现幂等性，就意味着，我们的消息永远不会消费多次，即使收到了多条一样的消息
```

#### 3.1. 业界主流的幂等性操作

```
· 业务唯一ID or 指纹码机制，利用数据库主键去重
· 
```

### 4. Confirm确认消息、Return返回消息

#### 4.1. Confirm消息确认机制

```
· 消息的确认，是指生产者投递消息后，如果Broker收到消息，则会给我们生产者一个应答
· 生产者进行接收应答，用来确定这条消息是否正常发送到Broker，这种发试也是消息的可靠性投递的核心保障
```

#### 4.2. 何如实现Confirm确认消息？

```
1. 在channel开启确认模式，channel.confirmSelect()
2. 在channel上添加监听：channel.addConfirmListener(new ConfirmListener() {...})，监听成功喝失败的返回结果，根据具体的结果对消息进行重新发送、记录日志等后续处理。
```

### 4.3. Return消息机制

```
· Return Listener用于处理一些不可路由的消息
· 消息的生产者，通过指定一个Exchange喝RoutingKey，把消息送达到某一个队列中去，然后消费者监听队列，机型消费处理。
· 在某些情况下，如果发送消息的时候，当前的Exchange不存在或者指定的RoutingKey路由不到，这个时候如果需要监听这种不可达的消息，就要使用Return Listener！
```

#### 4.4. 如何实现Return返回消息？

```
· 关键配置项：Mandatory，如果为true，则监听器会接收多熬路由不可达的消息，进行后续处理；如果为false，那么broker端自动删除该消息！
· channel.basicPublish("exchange", "routingKey", mandatory, null, msg.getBytes());
· channel.addReturnListener(new ReturnListener(){...})
```

### 5. 消息的ACK与重回队列

#### 5.1. 消费端的手工ACK和NACK

```
· 消费端进行消费的时候，如果由于业务异常，可以进行日志的记录，然后进行补偿！
· 如果由于服务器宕机等严重问题，就需要手工进行ACknowledge保障消费端消费成功！
```

#### 5.2. 消费端的重回队列

```
· 消费端重回队列是为了对没有处理陈工的消息，把消息重新递给Broker！
· 一般在实际应用中，都会关闭重回队列，设置成false
```

### 6. 消息的限流

```
· RabbitMQ提供了一种qos(服务质量保证)功能，即在非自动确认消息的前提下，如果一定数目的消息(通过基于consume或channel设置qos的值)未被确认前，不消费新的消息。
· void BasicQos(uint prefetchSize, ushort prefetchCount, bool global);
  prefetchSize：0
  prefetchCount: 告诉RabbitMQ不要同时给一个消费者推送多于N个消息，即一旦有N个消息还没有ACK，则该消费者将暂停接收消息，直到有消息ACK。
  global：true/false，是否将上面设置的限制，应用到channel/消费者。
注意：prefetchSize和global这两项，RabbitMQ还没有实现，暂且不研究。
	而prefetchCount在no_ask=false的情况下生效，即在自动应答的情况下不生效。
```

### 7. TTL队列/消息

```
· TTL是Time To Live的缩写，也就是生存时间
· RabbitMQ支持消息的过期时间，在消息发送时可以指定
· RabbitMQ支持队列的过期时间，在消息入队列开始计算，只要超过了队列的超时时间配置，消息会自动被清楚
```

### 8. 死信队列

```
· 死信队列：DLX, Dead-Letter-Exchange
· 利用DLX，当消息在一个队列中变成死信(dead message)之后，它能被重新publish倒另一个Exchange，这个Exchange就是DLX
· 消息变成死信有以下几种情况：
	· 消息被拒绝(basic.reject/basic.nack)，并且requeue=false(不重回队列)
	· 消息TTL过期
	· 队列达到最大长度
· DLX也是一个正常的Exchange，和一般的Exchange没有区别，它能在任何的队列上被指定，实际上就是设置某个队列的属性
· 当这个列队中有死信时，RabbitMQ就会自动的将这个消息重新发布倒设置的Exchange上去，进而被路由倒另一个队列
· 可以监听这个队列中消息做相应的处理，这个特性可以弥补RabbitMQ3.0以前支持的immediate参数功能
· 死信队列的配置实现：
	· Exchange Name: dlx.exchange
	· Queue Name: dlx.queue
	· RoutingKey: #
	· 在正常的队列的正常流程中，多设置一个参数即可
		arguments.put("x-dead=letter-exchange", "dlx.exchange");
```

