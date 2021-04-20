# DSL搜索

## 1. 入门语法

### 1.1 请求参数的查询(QueryString)

```
查询[字段]包含[内容]的文档
GET     /mineIndex/_doc/_search?q=desc:慕课网
GET     /mineIndex/_doc/_search?q=nickname:慕&q=age:25

text与keyword搜索对比测试(keyword不会被倒排索引，不会被分词)
GET     /mineIndex/_doc/_search?q=nickname:super
GET     /mineIndex/_doc/_search?q=username:super
GET     /mineIndex/_doc/_search?q=username:super hero

这种方式称之为QueryString查询方式，参数都是放在url中作为请求参数的。
```

### 1.2 DSL基本语法

```
QueryString用的很少，一旦参数复杂就难以构建，所以大多查询都会使用dsl来进行查询更好。
Domain Specific Language
特定领域语言
基于JSON格式的数据查询
查询更灵活，有利于复杂查询
```

* **查询**

```json
POST     /mineIndex/_doc/_search
{
	"query": {
		"match": {
			"desc": "慕课网"
		}
	}
}
```

* **判断某个字段是否存在**

```
{
	"query": {
		"exists": {
			"field": "desc"
		}
	}
}
```

```
语法格式为一个json object，内容都是key-value键值对，json可以嵌套。
key可以是一些es的关键字，也可以是某个field字段，后面会遇到

搜索不合法问题定位
DSL查询的时候经常会出现一些错误查询，出现这样的问题大多都是json无法被es解析，
他会像java那样报一个异常信息，根据异常信息去推断问题所在，比如json格式不对，关键词不存在未注册等等，
甚至有时候不能定位问题直接复制错误信息到百度一搜就能定位问题了。
```



## 2. 进阶语法

### 2.1 查询所有

```json
GET     /mineIndex/_doc/_search
或
POST     /mineIndex/_doc/_search
{
	"query": {
		"match_all": {}
	},
	"_source": ["id", "nickname", "age"]
}
```

### 2.2 分页

```json
默认查询是只有10条记录，可以通过分页来展示

POST     /mineIndex/_doc/_search
{
	"query": {
		"match_all": {}
	},
	"_source": [
		"id",
		"nickname",
		"age"
	],
	"from": 5,
	"size": 5
}
```

### 2.3 term/match

```json
term精确搜索与match分词搜索
搜索的时候会把用户搜索内容，比如“慕课网强大”作为一整个关键词去搜索，而不会对其进行分词后再搜索

POST     /mineIndex/_doc/_search
{
	"query": {
		"term": {
			"desc": "慕课网"
		}
	}
}
对比
{
	"query": {
		"match": {
			"desc": "慕课网"
		}
	}
}

注：match会对慕课网先进行分词（其实就是全文检索），在查询，而term则不会，直接把慕课网作为一个整的词汇去搜索。
```

### 2.4 terms

```
多个词语匹配检索，相当于是tag标签查询，比如慕课网的一些课程会打上前端/后端/大数据/就业课这样的标签，可以完全匹配做类似标签的查询

POST     /mineIndex/_doc/_search
{
	"query": {
		"terms": {
			"desc": ["慕课网", "学习", "骚年"]
		}
	}
}
```

