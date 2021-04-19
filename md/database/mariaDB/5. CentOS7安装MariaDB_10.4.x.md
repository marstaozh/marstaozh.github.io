### CentOS7 安装 MariaDB 10.4.x

#### 1. 下载安装包

```
galera-4-26.4.2-1.rhel7.el7.centos.x86_64.rpm
jemalloc-3.6.0-1.el7.x86_64.rpm
jemalloc-devel-3.6.0-1.el7.x86_64.rpm
MariaDB-client-10.4.8-1.el7.centos.x86_64.rpm
MariaDB-common-10.4.8-1.el7.centos.x86_64.rpm
MariaDB-compat-10.4.8-1.el7.centos.x86_64.rpm
MariaDB-server-10.4.8-1.el7.centos.x86_64.rpm
```

#### 2. 按顺序安装依赖环境包

```linux
2.1 yum install rsync nmap lsof perl-DBI nc
2.2 rpm -ivh jemalloc-3.6.0-1.el7.x86_64.rpm
2.3 rpm -ivh jemalloc-devel-3.6.0-1.el7.x86_64.rpm
```

#### 3. 卸载冲突的mariadb-libs

```
先搜索：
	rpm -qa | grep mariadb-libs
后删除：
	rpm -ev --nodeps mariadb-libs-5.5.60-1.el7_5.x86_64
```

#### 4. 安装 boost-devel 依赖环境

```
yum install boost-devel.x86_64
```

#### 5. 导入MariaDB的key

```
rpm --import http://yum.mariadb.org/RPM-GPG-KEY-MariaDB
```

#### 6. 安装 galera 环境

```
rpm -ivh galera-4-26.4.2-1.rhel7.el7.centos.x86_64.rpm
```

####  7. 安装 libaio (此步骤在安装 10.4.8 的时候需要)

```
7.1 wget http://mirror.centos.org/centos/6/os/x86_64/Packages/libaio-0.3.107-10.el6.x86_64.rpm
7.2 rpm -ivh libaio-0.3.107-10.el6.x86_64.rpm
```

#### 8. 顺序安装MariaDB的4个核心包

```
rpm -ivh 
	MariaDB-common-10.4.7-1.el7.centos.x86_64.rpm 
	MariaDB-compat-10.4.7-1.el7.centos.x86_64.rpm 
	MariaDB-client-10.4.7-1.el7.centos.x86_64.rpm 
	MariaDB-server-10.4.7-1.el7.centos.x86_64.rpm 
```

#### 9. 安装完毕MariaDB后，需要配置数据库，在命令行中执行如下代码用以启动mysql服务

```
service mysql start
```

#### 10. 启动成功后运行如下命令进行安全配置：

```
mysql_secure_installation
执行完上述命令后，会出现下方几项询问：
	10.1 输入当前密码，初次安装后是没有密码的，直接回车
	10.2 询问是否使用`unix_socket`进行身份验证：n
	10.3 为root设置密码：y
	10.4 输入root的新密码：root
	10.5 确认输入root的新密码：root
	10.6 是否移除匿名用户，这个随意，建议删除：y
	10.7 拒绝用户远程登录，这个建议开启：n
	10.8 删除test库，可以保留：n
	10.9 重新加载权限表：y
```

#### 11. 配置完成后，还需完成以下额外配置

```
11.1 进入MariaDB命令操作界面 
	mysql -u root -p 
11.2 赋予root用户远程连接权限
	grant all privileges on *.* to 'root'@'%' identified by 'root密码';
	flush privileges;
```

#### 至此MariaDB已全部配置完毕，可使用远程客户端进行连接数据库了！

