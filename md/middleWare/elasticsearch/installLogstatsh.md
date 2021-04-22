## Logstatsh数据同步

* **Logstash介绍**

  Logstash是elastic技术栈中的一个技术。它是一个数据采集引擎，可以从数据库采集数据到es中。
  我们可以通过设置**自增id主键**或者**时间**来控制数据的自动同步，这个id或者时间就是用于给logstash进行识别的

	id：假设现在有1000条数据，Logstash识别后会进行一次同步，同步完会记录这个id为1000，以后数据库新增数据，
		那么id会一直累加，Logstash会有定时任务，发现有id大于1000了，则增量加入到es中
	时间：同理，一开始同步1000条数据，每条数据都有一个字段，为time，初次同步完毕后，记录这个time，下次同步的时候进行时间比对，
		如果有超过这个时间的，那么就可以做同步.
		这里可以同步新增数据，或者修改元数据，因为同一条数据的时间更改会被识别，而id则不会。



* 数据同步配置

```
1. 上传并解压logstash，位置放在如下：
	/usr/local/logstash-7.6.2

2. 创建文件名：logstash-db-sync.conf，后缀为conf，文件名随意，位置也随意（可以参考以下）
	/usr/local/logstash-7.6.2/sync/logstash-db-sync.conf，后缀为conf
	
3. 把数据库驱动拷贝
	/usr/local/logstash-7.6.2/sync/mysql-connector-java-5.1.41.jar
	
4. logstash-db-sync.conf的配置内容
input {
	jdbc {
        # 设置 MySql/MariaDB 数据库url以及数据库名称
        jdbc_connection_string => "jdbc:mysql://192.168.1.6:3306/foodie-shop-dev?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true"
        # 用户名和密码
        jdbc_user => "root"
        jdbc_password => "root"
        # 数据库驱动所在位置，可以是绝对路径或者相对路径
        jdbc_driver_library => "/usr/local/logstash-7.6.2/sync/mysql-connector-java-5.1.41.jar"
        # 驱动类名
        jdbc_driver_class => "com.mysql.jdbc.Driver"
        # 开启分页
        jdbc_paging_enabled => "true"
        # 分页每页数量，可以自定义
        jdbc_page_size => "10000"
        # 执行的sql文件路径
        statement_filepath => "/usr/local/logstash-7.6.2/sync/foodie-items.sql"
        # 设置定时任务间隔  含义：分、时、天、月、年，全部为*默认含义为每分钟跑一次任务
        schedule => "* * * * *"
        # 索引类型
        type => "_doc"
        # 是否开启记录上次追踪的结果，也就是上次更新的时间，这个会记录到 last_run_metadata_path 的文件
        use_column_value => true
        # 记录上一次追踪的结果值
        last_run_metadata_path => "/usr/local/logstash-7.6.2/sync/track_time"
        # 如果 use_column_value 为true， 配置本参数，追踪的 column 名，可以是自增id或者时间
        tracking_column => "updated_time"
        # tracking_column 对应字段的类型
        tracking_column_type => "timestamp"
        # 是否清除 last_run_metadata_path 的记录，true则每次都从头开始查询所有的数据库记录
        clean_run => false
        # 数据库字段名称大写转小写
        lowercase_column_names => false
	}
}
output {
	elasticsearch {
		# es地址
		hosts => ["192.168.1.187:9200"]
		# 同步的索引名
		index => "foodie-items"
		# 设置_docID和数据相同
		document_id => "%{id}"
	}
	# 日志输出
	stdout {
		codec => json_lines
	}
}
		
5. sql同步脚本
	SELECT
		i.id as itemId,
		i.item_name as itemName,
		i.sell_counts as sellCounts,
		ii.url as imgUrl,
		tempSpec.price_discount as price,
		i.updated_time as updated_time
	FROM
		items i
	LEFT JOIN
		items_img ii
	on
		i.id = ii.item_id
	LEFT JOIN
		(SELECT item_id,MIN(price_discount) as price_discount from items_spec GROUP BY item_id) tempSpec
	on
		i.id = tempSpec.item_id
	WHERE
		ii.is_main = 1
		and
		i.updated_time >= :sql_last_value

6. 启动logstatsh
# ./logstash -f /usr/local/logstash-7.6.2/sync/logstash-db-sync.conf
```

* **自定义模板配置中文分词**

​	目前的数据同步，mappings映射会自动创建，但是分词不会，还是会使用默认的，而我们需要中文分词，这个时候就需要自定义模板功能来设置分词了。

```
查看Logstash默认模板
GET     /_template/logstash
```

```
修改模板如下
{
	"order": 0,
	"version": 1,
	"index_patterns": ["*"],
	"settings": {
		"index": {
			"refresh_interval": "5s"
		}
	},
	"mappings": {
		"_default_": {
			"dynamic_templates": [
				{
					"message_field": {
						"path_match": "message",
						"match_mapping_type": "string",
						"mapping": {
							"type": "text",
							"norms": false
						}
					}
				},
				{
					"string_fields": {
						"match": "*",
						"match_mapping_type": "string",
						"mapping": {
							"type": "text",
							"norms": false,
							"analyzer": "ik_max_word",
							"fields": {
								"keyword": {
									"type": "keyword",
									"ignore_above": 256
								}
							}
						}
					}
				}
			],
			"properties": {
				"@timestamp": {
					"type": "date"
				},
				"@version": {
					"type": "keyword"
				},
				"geoip": {
					"dynamic": true,
					"properties": {
						"ip": {
							"type": "ip"
						},
						"location": {
							"type": "geo_point"
						},
						"latitude": {
							"type": "half_float"
						},
						"longitude": {
							"type": "half_float"
						}
					}
				}
			}
		}
	},
	"aliases": {}
}
```

新增如下配置，用于更新模板，设置中文分词

* **定义模板名称**

​	template_name => "myik"
* **模板所在位置**

​	template => "/usr/local/logstash-7.6.2/sync/logstash-ik.json"
* **重写模板**

​	template_overwrite => true

* **默认为true，false关闭logstash自动管理模板功能，如果自定义模板，则设置为false**

​	manage_template => false
​	
重新运行Logstash进行同步
​	./logstash -f /usr/local/logstash-7.6.2/sync/logstash-db-sync.conf