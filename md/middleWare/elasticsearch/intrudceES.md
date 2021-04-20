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

* **索引分词概念**
```
index：默认true，设置为false的话，那么这个字段就不会被索引
text：文字类需要被分词被倒排索引的内容，比如商品名称，商品详情，商品介绍，使用text。
keyword：不会被分词，不会被倒排索引，直接匹配搜索，比如订单状态，用户qq，微信号，手机号等，这些精确匹配，无需分词。
主要数据类型：
	text, keyword, string
	long, integer, short, byte
	double, float
	boolean
	date
	object
数组不能混，类型一致
字符串
```
* **创建索引的同时创建mappings**

```json
PUT		/index_str
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
```

* **查看分词效果**

```json
GET		/index_mapping/_analyze
{
    "field": "realname",
    "text": "imooc is good"
}
```

* **尝试修改**

```
POST	/index_str/_mapping
{
	"properties": {
   		"name": {
   			"type": "long"
   		}
   	}
}
```

* **为已存在的索引创建或更新mappings**

```json
POST	/index_str/_mapping
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
```



## 3. 文档的基本操作

* **添加文档数据**

```json
POST	/mineIndex/_doc/索引ID
{
	"id": 1001,
	"name": "imooc-1",
	"desc": "imooc is very good, 慕课网非常牛！",
	"create_date": "2019-12-24"
}

注：如果索引没有手动建立mappings，那么当插入文档数据的时候，会根据文档类型自动设置属性类型。
	这个就是es的动态映射，帮我们在index索引库中去建立数据结构的相关配置信息。
	“fields”: {“type”: “keyword”}
	对一个字段设置多种索引模式，使用text类型做全文检索，也可使用keyword类型做聚合和排序
	“ignore_above” : 256
	设置字段索引和存储的长度最大值，超过则被忽略
```

* **删除文档**

```json
DELETE	/mineIndex/_doc/索引ID

注：文档删除不是立即删除，文档还是保存在磁盘上，索引增长越来越多，才会把那些曾经标识过删除的，进行清理，从磁盘上移出去。
```

* **修改文档**

```
局部：
POST	/mineIndex/_doc/索引ID/_update
{
	"doc": {
		"name": "慕课"
	}
}

全量替换：
PUT		/mineIndex/_doc/索引ID
{
	"id": 1001,
	"name": "imooc-1",
	"desc": "imooc is very good, 慕课网非常牛！",
	"create_date": "2019-12-24"
}
注：每次修改后，version会更改
```

* **查询文档**

  * **常规查询**

  ```
  GET		/mineIndex/_doc/索引ID
  GET		/mineIndex/_doc/_search
  ```

  * **查询结果**

  ```
  {
      "_index": "my_doc",
      "_type": "_doc",
      "_id": "2",
      "_score": 1.0,
      "_version": 9,
      "_source": {
          "id": 1002,
          "name": "imooc-2",
          "desc": "imooc is fashion",
          "create_date": "2019-12-25"
  	}
  }
  
  元数据：
  	_index：文档数据所属那个索引，理解为数据库的某张表即可。
  	_type：文档数据属于哪个类型，新版本使用_doc。
  	_id：文档数据的唯一标识，类似数据库中某张表的主键。可以自动生成或者手动指定。
  	_score：查询相关度，是否契合用户匹配，分数越高用户的搜索体验越高。
  	_version：版本号。
  	_source：文档数据，json格式。
  ```

  * **定制结果集**

  ```
  GET		/mineIndex/_doc/索引ID?_source=id,name
  GET 	/mineIndex/_doc/_search?_source=id,name
  ```

  * **判断文档是否存在**

  ```
  HEAD	/mineIndex/_doc/索引ID
  ```

  
  ​	

## 4. 分词与内置分词器

* **什么是分词？**

  把文本转换为一个个的单词，分词称之为analysis。es默认只对英文语句做分词，中文不支持，每个中文字都会被拆分为独立的个体。

```json
英文分词：I study in imooc.com
中文分词：我在慕课网学习

POST	/_analyze
{
	"analyzer": "standard",
	"text": "text文本"
}

POST	/mineIndex/_analyze
{
	"analyzer": "standard",
	"field": "name",
	"text": "text文本"
}
```

* **es内置分词器**

```json
standard：默认分词，单词会被拆分，大小会转换为小写。
simple：按照非字母分词。大写转为小写。
whitespace：按照空格分词。忽略大小写。
stop：去除无意义单词，比如the/a/an/is…
keyword：不做分词。把整个文本作为一个单独的关键词。

{
    "analyzer": "standard",
    "text": "My name is Peter Parker,I am a Super Hero. I don't like the Criminals."
}
```

* **建立IK中文分词器**

```
1. 下载IK中文分词器
Github：https://github.com/medcl/elasticsearch-analysis-ik

2. 直接解压至{es}/plugins目录下即可
# unzip xxx.zip -d {es}/plugins/ik

3. 解压完成后，需要重启再测试中文分词效果
POST	/_analyze
{
    "analyzer": "ik_max_word",
    "text": "上下班车流量很大"
}
```

* **自定义中文词库**

```
1. 在{es}/plugins/ik/config下，创建：
   vim custom.dic
2. 并且添加内容：
   慕课网
   骚年
3.配置自定义扩展词典
   <entry key="ext_dict">custom.dic</entry>
4. 重启
```

