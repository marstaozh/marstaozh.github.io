### 1. 下载路径

```
https://www.elastic.co/cn/downloads/kibana
```



### 2. 上传并解压

```
# tar -zxvf kibana-7.12.0-linux-x86_64.tar.gz
# mv kibana-7.12.0-linux-x86_64 kibana-7.12.0
```



### 3. 配置kibana.yml

```
# cd kibana-7.12.0/config
# vim kibana.yml

## 配置一下选项
# 访问端口
server.port: 5601
# 访问ip，即kibana部署服务器ip
server.host: "10.252.37.45"
# kibana连接elasticsearch服务器
elasticsearch.hosts: ["http://10.252.37.45:9200"]
# Kibana 使用 Elasticsearch 中的索引来存储保存的检索，可视化控件以及仪表板。
kibana.index: ".kibana"
```



### 4. 启动kibana

```
## 前台启动
# bin/kibana

## 后台启动
# nohup /home/esuser/kibana-7.12.0/bin/kibana & exit
```



