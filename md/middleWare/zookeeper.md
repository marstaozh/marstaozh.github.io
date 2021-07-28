```
1. 修改主机名
/etc/hostname /etc/hosts

2. 关闭防火墙

3. 上传zk安装包
	解压 
	tar -zxvf zookeeper-3.4.6.tar.gz -C /usr/local/
	修改环境变量
	vim /etc/profile
	export ZOOKEEPER_HOME=/usr/local/zookeeper-3.4.6
	export PATH-.:$ZOOKEEPER_HOME/bin:$PATH
	source /etc/profile
	
4. 修改zk配置文件
	重命名配置文件
	mv /usr/local/zookeeper-3.4.6/conf/zoo_sample.conf /usr/local/zookeeper-3.4.6/conf/zoo.conf
	修改数据的目录
	dataDir=/usr/local/zookeeper-3.4.6/data
	添加集群地址
	server.0=192.168.3.11:2888:3888
	server.1=192.168.3.12:2888:3888
	server.2=192.168.3.13:2888:3888
	创建data目录
	mkdir /usr/local/zookeeper-3.4.6/data
	创建myid文件
	touch /usr/local/zookeeper-3.4.6/data/myid
	修改myid文件
	在192.168.3.11机器上配置0
	在192.168.3.12机器上配置1
	在192.168.3.13机器上配置2
	
5. 启动zk
	启动命令：zkServer.sh start
	停止命令：zkServer.sh stop
	查看状态：zkServer.sh status
	
6. 开机启动
	cd /etc/rc.d/init.d
	touch zookeeper
	chmod 777 zookeeper
	vim zookeeper
        -------------------
        #!/bin/bash

        #chkconfig:2345 20 90
        #description:zookeeper
        #processname:zookeeper
        export JAVA_HOME=/usr/local/jdk1.8
        export PATH=$JAVA_HOME/bin:$PATH
        case $1 in
            start) /usr/local/zookeeper-3.4.6/bin/zkServer.sh start;;
            stop) /usr/local/zookeeper-3.4.6/bin/zkServer.sh stop;;
            status) /usr/local/zookeeper-3.4.6/bin/zkServer.sh status;;
            restart) /usr/local/zookeeper-3.4.6/bin/zkServer.sh restart;;
            *) echo "require start|stop|status|restart" ;;
        esac
        -------------------
	chkconfig zookeeper on
	chkconfig --add zookeeper
	chkconfig --list zookeeper
	
```

