var treeJson = [
	{
		"id": "Java",
		"name": "Java",
		"visible": true,
		"menuArr": [
			{
				"id": "base",
				"name": "Java基础",
				"visible": true,
				"menuArr": [
					{
						"href": "md/java/collection.md",
						"name": "集合",
						"visible": true,
						"dataModuleId": "0"
					},
					{
						"href": "md/java/BIO.md",
						"name": "同步与异步&阻塞与非阻塞",
						"visible": true,
						"dataModuleId": "1"
					},
					{
						"href": "md/java/netty.md",
						"name": "Netty",
						"visible": true,
						"dataModuleId": "2"
					},
					{
						"href": "md/java/transaction.md",
						"name": "事务",
						"visible": true,
						"dataModuleId": "3"
					}
				]
			},
			{
				"id": "tread",
				"name": "算法",
				"visible": true,
				"menuArr": [
				{				
					"href": "md/java/algorithm/Search.md",
					"name": "查找",
					"visible": true,
					"dataModuleId": "0"
				},
				{				
					"href": "md/java/algorithm/StraightInsertSort.md",
					"name": "直接插入排序",
					"visible": true,
					"dataModuleId": "1"
				}]
			},
			{
				"id": "tread",
				"name": "多线程",
				"visible": false,
				"menuArr": [
					{
						"href": "thread.md",
						"name": "基础知识",
						"visible": true,
						"dataModuleId": "0"
					},
					{
						"href": "treadLocal.md",
						"name": "ThreadLocal",
						"visible": true,
						"dataModuleId": "1"
					}
				]
			},
			{
				"id": "designModel",
				"name": "设计模式",
				"visible": false,
				"menuArr": [
					{
						"href": "factory.md",
						"name": "工厂模式",
						"visible": true,
						"dataModuleId": "0"
					}
				]
			},
			{
				"href": "lambda.md",
				"name": "lambda",
				"visible": false,
				"dataModuleId": "0"
			}
		]
	},
	{
		"id": "frame",
		"name": "框架",
		"visible": false,
		"menuArr": [
			{
				"href": "md/frame/configCORS.md",
				"name": "跨域配置",
				"visible": true,
				"dataModuleId": "0"
			},
			{
				"href": "md/frame/swagger2.md",
				"name": "swagger2",
				"visible": true,
				"dataModuleId": "1"
			}
		]
	},
	{
		"id": "middleWare",
		"name": "中间件",
		"visible": true,
		"menuArr": [
			{
				"id": "elasticsearch",
				"name": "全文检索ES",
				"visible": true,
				"menuArr": [
					{
						"href": "md/middleWare/elasticsearch/installElasticsearch.md",
						"name": "安装ES",
						"visible": true,
						"dataModuleId": "0"
					},
					{
						"href": "md/middleWare/elasticsearch/intrudceES.md",
						"name": "简单介绍ES",
						"visible": true,
						"dataModuleId": "0"
					},
					{
						"href": "md/middleWare/elasticsearch/dslSearch.md",
						"name": "DSL搜索",
						"visible": true,
						"dataModuleId": "0"
					},
					{
						"href": "md/middleWare/elasticsearch/installLogstatsh.md",
						"name": "Logstatsh介绍",
						"visible": true,
						"dataModuleId": "0"
					}
				]
			},
			{
				"id": "weblogic",
				"name": "weblogic",
				"visible": true,
				"menuArr": [
					{
						"href": "md/middleWare/weblogic/installWeblogicWithSlient.md",
                        "name": "weblogic",
						"visible": true,
                        "dataModuleId": "0"
					}
				]
			},
			{				
				"href": "md/middleWare/fastDFS/fastDFS.md",
				"name": "分布式文件系统",
				"visible": true,
				"dataModuleId": "0"
			}
		]
	},
	{
		"id": "database",
		"name": "数据库",
		"visible": true,
		"menuArr": [
			{
				"href": "md/database/mariaDB/installMariaDB104InCentOS7.md",
				"name": "mariaDB",
				"visible": true,
				"dataModuleId": "0"
			}
		]
	},
	{
		"id": "messageQueue",
		"name": "消息中间件",
		"visible": true,
		"menuArr": [
			{
				"id": "activeMQ",
				"name": "activeMQ",
				"visible": true,
				"menuArr": [
					{
						"href": "md/mq/activeMQ/activeMQsCluster.md",
						"name": "ActiveMQ集群架构与原理解析",
						"visible": true,
						"dataModuleId": "0"
					}
				]
			},
			{
				"id": "kafka",
				"name": "kafka",
				"visible": false,
				"menuArr": []
			},
			{
				"id": "rabbitMQ",
				"name": "rabbitMQ",
				"visible": true,
				"menuArr": [
					{
						"href": "md/mq/rabbitMQ/initEnv4RabbitMQ.md",
						"name": "rabbitMQ环境搭建",
						"visible": true,
						"dataModuleId": "0"
					},
					{
						"href": "md/mq/rabbitMQ/firstMeetRabbitMQ.md",
						"name": "初识RabbitMQ",
						"visible": true,
						"dataModuleId": "1"
					},
					{
						"href": "md/mq/rabbitMQ/rabbitMQsAPI.md",
						"name": "RabbitMQ核心API",
						"visible": true,
						"dataModuleId": "1"
					},
					{
						"href": "md/mq/rabbitMQ/RabbitMQAdvancedFeatures.md.md",
						"name": "RabbitMQ的高级特性",
						"visible": true,
						"dataModuleId": "1"
					},
					{
						"href": "md/mq/rabbitMQ/RabbitMQsCluster.md",
						"name": "RabbitMQ集群环境搭建",
						"visible": true,
						"dataModuleId": "1"
					}
				]
			},
			{
				"id": "rocketMQ",
				"name": "rocketMQ",
				"visible": true,
				"menuArr": [
					{
						"href": "md/mq/rocketMQ/rocketMQsCluster.md",
						"name": "RocketMQ集群架构与原理解析",
						"visible": true,
						"dataModuleId": "0"
					}
				]
			}
		]
	}
];