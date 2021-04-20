## 1. Elasticsearch 核心术语

```
核心概念
	ES				 -> 数据库
	索引 index 		-> 表
	文档 document 	-> 行（记录）
	字段 fields 		-> 列

集群相关
	分片（shard）：把索引库拆分为多份，分别放在不同的节点上，比如有3个节点，3个节点的所有数据内容加在一起是一个完整的索引库。
		分别保存到三个节点上，目的为了水平扩展，提高吞吐量。
	备份（replica）：每个shard的备份。

简称
	shard = primary shard（主分片）
	replica = replica shard（备份节点）
```



## 2. 索引相关操作

### 2.1 基本操作

```
1. 集群健康
   GET     /_cluster/health

2. 创建索引
	PUT     /mineIndex
	{
   		"settings": {
   			"index": {
                "number_of_shards": "2",	// 主分片
                "number_of_replicas": "0"	// 备份节点
   			}
   		}
   	}

3. 查看索引
   GET     _cat/indices?v

4. 删除索引
   DELETE      /mineIndex
```

### 2.2 索引的mappings映射

```
1. 索引分词概念
   index：默认true，设置为false的话，那么这个字段就不会被索引
   
2. 创建索引的同时创建mappings
   PUT     /index_str
   {
   	"mappings": {
   		"properties": {
   			"realname": {
   				"type": "text",
   				"index": true
   			},
   			"username": {
   				"type": "keyword",
   				"index": false
   			}
   		}
   	}
   }

2.查看分词效果
	GET         /index_mapping/_analyze
	{
		"field": "realname",
		"text": "imooc is good"
	}
	

3. 尝试修改
   POST        /index_str/_mapping
   {
   	"properties": {
   		"name": {
   			"type": "long"
   		}
   	}
   }

4. 为已存在的索引创建或创建mappings
   POST        /index_str/_mapping
   {
   	"properties": {
   		"id": {
   			"type": "long"
   		},
   		"age": {
   			"type": "integer"
   		},
   		"nickname": {
   			"type": "keyword"
   		},
   		"money1": {
   			"type": "float"
   		},
   		"money2": {
   			"type": "double"
   		},
   		"sex": {
   			"type": "byte"
   		},
   		"score": {
   			"type": "short"
   		},
   		"is_teenager": {
   			"type": "boolean"
   		},
   		"birthday": {
   			"type": "date"
   		},
   		"relationship": {
   			"type": "object"
   		}
   	}
   }
   注：某个属性一旦被建立，就不能修改了，但是可以新增额外属性
   	主要数据类型
   	text, keyword, string
   	long, integer, short, byte
   	double, float
   	boolean
   	date
   	object
   	数组不能混，类型一致
   字符串
   text：文字类需要被分词被倒排索引的内容，比如商品名称，商品详情，商品介绍，使用text。
   keyword：不会被分词，不会被倒排索引，直接匹配搜索，比如订单状态，用户qq，微信号，手机号等，这些精确匹配，无需分词。
```







