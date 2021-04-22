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

```json
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

### 2.5 match_phrase

```json
match：分词后只要有匹配就返回，
match_phrase：分词结果必须在text字段分词中都包含，而且顺序必须相同，而且必须都是连续的。（搜索比较严格）
slop：允许词语间跳过的数量

POST     /mineIndex/_doc/_search
{
	"query": {
		"match_phrase": {
			"desc": {
				"query": "大学 毕业 研究生",
				"slop": 2
			}
		}
	}
}
```

### 2.6  match(operator)&ids

```json
operator
	or：搜索内容分词后，只要存在一个词语匹配就展示结果
	and：搜索内容分词后，都要满足词语匹配

POST     /mineIndex/_doc/_search
{
	"query": {
		"match": {
			"desc": {
				"query": "xbox游戏机",
				"operator": "or"
			}
		}
	}
}

相当于 select * from shop where desc='xbox' or|and desc='游戏机'

根据文档主键ids搜索
GET		/mineIndex/_doc/1001
查询多个
POST     /mineIndex/_doc/_search
{
	"query": {
		"ids": {
			"type": "_doc",
			"values": ["1001", "1010", "1008"]
		}
	}
}
```

### 2.7 minimum_should_match

```json
minimum_should_match: 最低匹配精度，至少有[分词后的词语个数]x百分百，得出一个数据值取整。
举个例子：当前属性设置为70，若一个用户查询检索内容分词后有10个词语，那么匹配度按照 10x70%=7，则desc中至少需要有7个词语匹配，就展示；
		若分词后有8个，则 8x70%=5.6，则desc中至少需要有5个词语匹配，就展示。
minimum_should_match 也能设置具体的数字，表示个数

POST     /mineIndex/_doc/_search
{
	"query": {
		"match": {
			"desc": {
				"query": "女友生日送我好玩的xbox游戏机",
				"minimum_should_match": "60%"
			}
		}
	}
}
```

### 2.8 multi_match
```json
满足使用match在多个字段中进行查询的需求

POST     /mineIndex/_doc/_search
{
	"query": {
		"multi_match": {
			"query": "皮特帕克慕课网",
			"fields": ["desc", "nickname"]
		}
	}
}
```

### 2.9 boost
```json
权重，为某个字段设置权重，权重越高，文档相关性得分就越高, 通常来说搜索商品名称要比商品简介的权重更高。

POST     /mineIndex/_doc/_search
{
	"query": {
		"multi_match": {
        	"query": "皮特帕克慕课网",
            "fields": ["desc", "nickname^10"]
		}
	}
}

nickname^10 代表搜索提升10倍相关性，也就是说用户搜索的时候其实以这个nickname为主，desc为辅，
nickname的匹配相关度当然要提高权重比例了。
```



## 3. 布尔查询

### 3.1 可以组合多重查询

```json
· must：查询必须匹配搜索条件，譬如 and
· should：查询匹配满足1个以上条件，譬如 or
· must_not：不匹配搜索条件，一个都不要满足
```

* 实操1

```json
POST     /mineIndex/_doc/_search
{
	"query": {
		"bool": {
			"must": [
				{
					"multi_match": {
						"query": "慕课网",
						"fields": ["desc", "nickname"]
					}
				},
				{
					"term": {
						"sex": 1
					}
				},
				{
					"term": {
						"birthday": "1996-01-14"
					}
				}
			]
		}
	}
}

{
	"query": {
		"bool": {
			"should(must_not)": [
				{
					"multi_match": {
						"query": "学习",
						"fields": ["desc", "nickname"]
					}
				},
				{
					"match": {
						"desc": "游戏"
					}	
				},
				{
					"term": {
						"sex": 0
					}
				}
			]
		}
	}
}
```

* 实操2

```json
POST     /mineIndex/_doc/_search
{
	"query": {
		"bool": {
			"must": [
				{
					"match": {
						"desc": "慕"
					}	
				},
				{
					"match": {
						"nickname": "慕"
					}	
				}
			],
			"should": [
				{
					"match": {
						"sex": "0"
					}	
				}
			],
			"must_not": [
				{
					"term": {
						"birthday": "1992-12-24"
					}	
				}
			]
		}
	}
}
```

### 3.2 为指定词语加权

```json
特殊场景下，某些词语可以单独加权，这样可以排得更加靠前。
POST     /mineIndex/_doc/_search
{
	"query": {
		"bool": {
			"should": [
				{
					"match": {
						"desc": {
							"query": "律师",
							"boost": 18
						}
					}
				},
				{
					"match": {
						"desc": {
							"query": "进修",
							"boost": 2
						}
					}
				}
			]
		}
	}
}
```

## 4. 过滤器

```json
对搜索出来的结果进行数据过滤。不会到es库里去搜，不会去计算文档的相关度分数，所以过滤的性能会比较高，过滤器可以和全文搜索结合在一起使用。
	post_filter元素是一个顶层元素，只会对搜索结果进行过滤。
	不会计算数据的匹配度相关性分数，不会根据分数去排序，query则相反，会计算分数，也会按照分数去排序。

使用场景：
	query：根据用户搜索条件检索匹配记录
	post_filter：用于查询后，对结果数据的筛选

POST     /mineIndex/_doc/_search
{
	"query": {
		"match": {
			"desc": "慕课网游戏"
		}	
	},
	"post_filter": {
		"range": {
			"money": {
				"gt": 60,
				"lt": 1000
			}
		}
	}	
}

```

## 5. 排序

es的排序同sql，可以desc也可以asc。也支持组合排序。

```json
POST     /mineIndex/_doc/_search
{
	"query": {
		"match": {
			"desc": "慕课网游戏"
		}
	},
	"post_filter": {
		"range": {
			"money": {
				"gt": 55.8,
				"lte": 155.8
			}
		}
	},
	"sort": [
		{
			"age": "desc"
		},
		{
			"money": "desc"
		}
	]
}
```

对文本排序，由于文本会被分词，所以往往要去做排序会报错，通常我们可以为这个字段增加额外的一个附属属性，类型为keyword，用于做排序。

```json
POST        /mineIndex2/_mapping
{
	"properties": {
		"id": {
			"type": "long"
		},
		"nickname": {
			"type": "text",
			"analyzer": "ik_max_word",
			"fields": {
				// keyword是nickname的附属属性名称
				"keyword": {
					"type": "keyword"// 类型为keyword
				}
			}
		}
	}
}

查询并排序
POST     /mineIndex2/_doc/_search
{
	"query": {
		"match": {
			"id": "007"
		}
	},
	"sort": [
		{
			// 通过nickname的附属属性进行排序，因为附属属性没有被分词
			"nickname.keyword": "desc"
		}
	]
}
```

## 6. 高亮highlight

```json
POST     /mineIndex/_doc/_search
{
    "query": {
        "match": {
            "desc": "慕课网"
        }
    },
    "highlight": {
        "pre_tags": ["<tag>"],
        "post_tags": ["</tag>"],
        "fields": {
            "desc": {} // 对应搜索的字段
        }
    }
}
```

## 7. prefix | fuzzy | wildcard

### 7.1 prefix：根据前缀去查询

```json
POST     /mineIndex/_doc/_search
{
	"query": {
		"prefix": {
			"desc": "imo"
		}
	}
}
```

### 7.2 fuzzy：模糊搜索

```json
并不是指的sql的模糊搜索，而是用户在进行搜索的时候的打字错误现象，搜索引擎会自动纠正，然后尝试匹配索引库中的数据。
POST     /mineIndex/_doc/_search
{
  "query": {
	"fuzzy": {
	  "desc": "imoov.coom"
	}
  }
}
```

### 7.3 wildcard：占位符查询。

？：1个字符

*：1个或多个字符

```json
POST     /shop/_doc/_search
{
  "query": {
	"wildcard": {
	  "desc": "*oo?"
	}
  }
}
{
	"query": {
		"wildcard": {
			"desc": "演*"
		}
	}
}
```

官文：https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html

### 7.4 或多字段搜索

```json
{
	"query": {
		"multi_match": {
	  		"fields": [ "desc", "nickname"],
	  		"query": "imcoc supor",
	  		"fuzziness": "AUTO"
		}
  	}
}

{
	"query": {
		"multi_match": {
	  		"fields": [ "desc", "nickname"],
	  		"query": "演说",
	  		"fuzziness": "1"
		}
  	}
}
```

官文：https://www.elastic.co/guide/cn/elasticsearch/guide/current/fuzzy-match-query.html