## RabbitMQ集群环境搭建

### 1. 集群节点安装

```
1.1 安装RabbitMQ所需要的依赖包
yum install build-essential openssl openssl-devel unixODBC unixODBC-devel make gcc gcc-c++ kernel-devel m4 ncurses-devel tk tc xz

1.2 下载安装包
wget www.rabbitmq.com/releases/erlang/erlang-18.3-1.el7.centos.x86_64.rpm
wget http://repo.iotti.biz/CentOS/7/x86_64/socat-1.7.3.2-5.el7.lux.x86_64.rpm
wget www.rabbitmq.com/releases/rabbitmq-server/v3.6.5/rabbitmq-server-3.6.5-1.noarch.rpm

1.3 安装服务命令
rpm -ivh erlang-18.3-1.el7.centos.x86_64.rpm 
rpm -ivh socat-1.7.3.2-1.1.el7.x86_64.rpm
rpm -ivh rabbitmq-server-3.6.5-1.noarch.rpm
//卸载
rpm -qa | grep rabbitmq
rpm -e --allmatches rabbitmq-server-3.6.5-1.noarch
rpm -qa | grep erlang
rpm -e --allmatches erlang-18.3-1.el7.centos.x86_64
rpm -qa | grep socat
rpm -e --allmatches socat-1.7.3.2-5.el7.lux.x86_64
rm -rf /usr/lib/rabbitmq/ /etc/rabbitmq/ /var/lib/rabbitmq/

1.4 修改集群用户与连接心跳检测
注意修改vim /usr/lib/rabbitmq/lib/rabbitmq_server-3.6.5/ebin/rabbit.app文件
修改：loopback_users 中的 <<"guest">>,只保留guest
修改：heartbeat 为10

1.5 安装管理插件
首先启动服务
	/etc/init.d/rabbitmq-server start stop status restart
查看服务有没有启动： lsof -i:5672
	rabbitmq-plugins enable rabbitmq_management
可查看管理端口有没有启动： 
	lsof -i:15672 或者 netstat -tnlp|grep 15672

1.6 服务指令
/etc/init.d/rabbitmq-server start stop status restart
验证单个节点是否安装成功：http://服务器IP:15672/
Ps：以上操作在集群节点上同时进行操作
```



### 2. 文件同步步骤

```
PS:选择集群节点中任意一个节点为Master，需要把Master的Cookie文件同步到其余节点上去。
进入/var/lib/rabbitmq目录下，把/var/lib/rabbitmq/.erlang.cookie文件的权限修改为777，原来是400。
然后把.erlang.cookie文件copy到各个节点下，最后把所有cookie文件权限还原为400即可。

进入目录修改权限；远程copy72、73节点
	scp /var/lib/rabbitmq/.erlang.cookie 192.168.31.42:/var/lib/rabbitmq/
	scp /var/lib/rabbitmq/.erlang.cookie 192.168.31.43:/var/lib/rabbitmq/
```



### 3. 组成集群步骤

```
3.1 停止MQ服务(这里不能使用原来的命令：/etc/init.d/rabbitmq-server stop)
	rabbitmqctl stop
	
3.2 组成集群操作
PS:接下来就可以使用集群命令，配置节点为集群模式，集群全部节点执行启动命令，后续启动集群使用此命令即可。
	rabbitmq-server -detached

3.3 slave加入集群操作(重新加入集群也是如此，以最开始的主节点未加入节点)
注意做这个步骤的时候：需要配置/etc/hosts 必须相互能够寻址到
    bhz72：rabbitmqctl stop_app
--ram 表示使用内存存储操作，不加则使用磁盘
    bhz72：rabbitmqctl join_cluster --ram rabbit@bhz71
    bhz72：rabbitmqctl start_app
    bhz73：rabbitmqctl stop_app
    bhz73：rabbitmqctl join_cluster rabbit@bhz71
    bhz73：rabbitmqctl start_app
在另外其他节点上操作要移除的集群节点
	rabbitmqctl forget_cluster_node rabbit@bhz71

3.4 修改集群名称
PS: 修改集群名称，默认为第一个node名称
	rabbitmqctl set_cluster_name clusterName

3.5 查看集群状态
	rabbitmqctl cluster_status
```



### 4. 配置镜像队列

```
rabbitmqctl set_policy ha-all "^" '{"ha-mode":"all"}'

PS:将所有队列设置为镜像队列，即队列会被复制到各个节点，各个节点状态一致，RabbitMQ高可用集群就已经搭建好了,我们可以重启服务，查看其队列是否在从节点同步。
```

