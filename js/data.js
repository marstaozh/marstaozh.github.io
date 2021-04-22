var treeJson = [
	{
		"id": "Java",
		"name": "Java",
		"menuArr": [
			{
				"id": "base",
				"name": "Java基础",
				"menuArr": [
					{
						"href": "md/java/collection.md",
						"name": "集合",
						"dataModuleId": "0"
					},
					{
						"href": "md/java/BIO.md",
						"name": "同步与异步&阻塞与非阻塞",
						"dataModuleId": "1"
					},
					{
						"href": "md/java/netty.md",
						"name": "Netty",
						"dataModuleId": "2"
					},
					{
						"href": "md/java/transaction.md",
						"name": "事务",
						"dataModuleId": "3"
					}
				]
			},
			{
				"id": "tread",
				"name": "多线程",
				"menuArr": [
					{
						"href": "thread.md",
						"name": "基础知识",
						"dataModuleId": "0"
					},
					{
						"href": "treadLocal.md",
						"name": "ThreadLocal",
						"dataModuleId": "1"
					}
				]
			},
			{
				"id": "designModel",
				"name": "设计模式",
				"menuArr": [
					{
						"href": "factory.md",
						"name": "工厂模式",
						"dataModuleId": "0"
					}
				]
			},
			{
				"href": "lambda.md",
				"name": "lambda",
				"dataModuleId": "0"
			}
		]
	},
	{
		"id": "frame",
		"name": "框架",
		"menuArr": [
			{
				"href": "md/frame/configCORS.md",
				"name": "跨域配置",
				"dataModuleId": "0"
			},
			{
				"href": "md/frame/swagger2.md",
				"name": "swagger2",
				"dataModuleId": "1"
			}
		]
	},
	{
		"id": "middleWare",
		"name": "中间件",
		"menuArr": [
			{
				"id": "elasticsearch",
				"name": "全文检索ES",
				"menuArr": [
					{
						"href": "md/middleWare/elasticsearch/installElasticsearch.md",
						"name": "安装ES",
						"dataModuleId": "0"
					},
					{
						"href": "md/middleWare/elasticsearch/intrudceES.md",
						"name": "简单介绍ES",
						"dataModuleId": "0"
					},
					{
						"href": "md/middleWare/elasticsearch/dslSearch.md",
						"name": "DSL搜索",
						"dataModuleId": "0"
					},
					{
						"href": "md/middleWare/elasticsearch/installLogstatsh.md",
						"name": "Logstatsh介绍",
						"dataModuleId": "0"
					}
				]
			},
			{
				"id": "weblogic",
				"name": "weblogic",
				"menuArr": [
					{
						"href": "md/middleWare/weblogic/installWeblogicWithSlient.md",
                        "name": "weblogic",
                        "dataModuleId": "0"
					}
				]
			},
			{				
				"href": "md/middleWare/fastDFS/fastDFS.md",
				"name": "分布式文件系统",
				"dataModuleId": "0"
			}
		]
	},
	{
		"id": "database",
		"name": "数据库",
		"menuArr": [
			{
				"href": "md/database/mariaDB/installMariaDB104InCentOS7.md",
				"name": "mariaDB",
				"dataModuleId": "0"
			}
		]
	},
	{
		"id": "messageQueue",
		"name": "消息中间件",
		"menuArr": [
			{
				"id": "activeMQ",
				"name": "activeMQ",
				"menuArr": [
					{
						"href": "md/mq/activeMQ/activeMQsCluster.md",
						"name": "ActiveMQ集群架构与原理解析",
						"dataModuleId": "0"
					}
				]
			},
			{
				"id": "kafka",
				"name": "kafka",
				"menuArr": []
			},
			{
				"id": "rabbitMQ",
				"name": "rabbitMQ",
				"menuArr": [
					{
						"href": "md/mq/rabbitMQ/initEnv4RabbitMQ.md",
						"name": "rabbitMQ环境搭建",
						"dataModuleId": "0"
					},
					{
						"href": "md/mq/rabbitMQ/firstMeetRabbitMQ.md",
						"name": "初识RabbitMQ",
						"dataModuleId": "1"
					},
					{
						"href": "md/mq/rabbitMQ/rabbitMQsAPI.md",
						"name": "RabbitMQ核心API",
						"dataModuleId": "1"
					},
					{
						"href": "md/mq/rabbitMQ/RabbitMQAdvancedFeatures.md.md",
						"name": "RabbitMQ的高级特性",
						"dataModuleId": "1"
					},
					{
						"href": "md/mq/rabbitMQ/RabbitMQsCluster.md",
						"name": "RabbitMQ集群环境搭建",
						"dataModuleId": "1"
					}
				]
			},
			{
				"id": "rocketMQ",
				"name": "rocketMQ",
				"menuArr": [
					{
						"href": "md/mq/rocketMQ/rocketMQsCluster.md",
						"name": "RocketMQ集群架构与原理解析",
						"dataModuleId": "0"
					}
				]
			}
		]
	}
];