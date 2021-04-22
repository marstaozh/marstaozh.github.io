## 1. 安装单体Elasticsearch

```
1. 上传后解压:
# tar -zxvf elasticsearch-7.4.2-linux-x86_64.tar.gz

## 移动到指定目录：
# mv elasticsearch-7.4.2 /usr/local/

2. ES 目录介绍
    bin：可执行文件在里面，运行es的命令就在这个里面，包含了一些脚本文件等
    config：配置文件目录
    JDK：java环境
    lib：依赖的jar，类库
    logs：日志文件
    modules：es相关的模块
    plugins：可以自己开发的插件
    data：这个目录没有，自己新建一下，后面要用 -> mkdir data，这个作为索引目录
    
3. 修改核心配置文件 elasticsearch.yml
## 修改集群名称，默认是elasticsearch，虽然目前是单机，但是也会有默认的
# cluster.name: architect-elasticsearch

## 为当前的es节点取个名称，名称随意，如果在集群环境中，都要有相应的名字
# node.name: es-node0

## 修改data数据保存地址
# path.data: /usr/local/elasticsearch-7.4.2/data

## 修改日志数据保存地址
# path.logs: /usr/local/elasticsearch-7.4.2/logs

## 绑定es网络ip，原理同redis
# network.host: 0.0.0.0

## 默认端口号，可以自定义修改
# http.port: 9200

## 集群节点，名字可以先改成之前的那个节点名称
# cluster.initial_master_nodes: ["es-node0"]

4. 修改JVM参数
# vim jvm.options
· 默认xms和xmx都是1g，虚拟机内存没这么大，修改一下即可
	-Xms128m
	-Xmx128m

5. 添加用户, ES不允许使用root操作es，需要添加用户，操作如下：
# useradd esuser
# chown -R esuser:esuser /usr/local/elasticsearch-7.4.2
# su esuser
# whoami

6. 启动ES
# ./elasticsearch

## 如果出现如下错误：
soft nofile 65536
hard nofile 131072
soft nproc 2048
hard nproc 4096

## 那么需要切换到root用户下去修改配置如下：
# vim /etc/security/limits.conf
# vim /etc/sysctl.conf
	vm.max_map_count=262145

## 刷新一下
# sysctl -p 

7. 测试
## 访问你的虚拟机ip+端口号9200，如下则表示OK
## 停止es: 如果是前台启动，直接ctrl+c就可以停止

## 后台启动：
# ./elasticsearch -d

## 端口号意义
	9200：Http协议，用于外部通讯
   	9300：Tcp协议，ES集群之间是通过9300通讯
```



## 2. Elasticsearch集群

* 引子
  	单机es可以用，没毛病，但是有一点我们需要去注意，就是高可用是需要关注的，一般我们可以把es搭建成集群，2台以上就能成为es集群了。
  	集群不仅可以实现高可用，也能实现海量数据存储的横向扩展。

* 分片机制
  	每个索引可以被分片，就相当于吃披萨的时候被切了好几块，然后分给不同的人吃
  	副本分片是主分片的备份，主挂了，备份还是可以访问，这就需要用到集群了。
  	同一个分片的主与副本是不会放在同一个服务器里的，因为一旦宕机，这个分片就没了

* es集群搭建的准备工作
  	使用虚拟机克隆功能，把单个es的虚拟机克隆为3个，我们会搭建3节点的es集群。

   * 前置操作

     当克隆以后，es中的data目录，一定要清空，这里面包含了原先的索引库数据。

     ```
     rm -rf /usr/local/elasticsearch-7.4.2/data/nodes
     ```

  * 配置集群
    	修改elasticsearch.yml这个配置文件如下

	# 配置集群名称，保证每个节点的名称相同，如此就能都处于一个集群之内了
	cluster.name: imooc-es-cluster
	# 每一个节点的名称，必须不一样
	node.name: es-node1
	# http端口（使用默认即可）
	http.port: 9200
	# 主节点，作用主要是用于来管理整个集群，负责创建或删除索引，管理其他非master节点（相当于企业老总）
	node.master: true
	# 数据节点，用于对文档数据的增删改查
	node.data: true
	# 集群列表
	discovery.seed_hosts: ["192.168.1.184", "192.168.1.185", "192.168.1.186"]
	# 启动的时候使用一个master节点
	cluster.initial_master_nodes: ["es-node1"]

* 最后可以通过如下命令查看配置文件的内容：
  	more elasticsearch.yml | grep ^[^#]
* 分别启动3台es
  	切换到esuser后在启动，访问集群各个节点，查看信息