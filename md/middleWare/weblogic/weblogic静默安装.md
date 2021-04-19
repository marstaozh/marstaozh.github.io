## 1. 下载

```
https://www.oracle.com/middleware/technologies/weblogic-server-downloads.html
```



## 2. 创建专属用户

```shell
# groupadd weblogic

# useradd -g weblogic weblogic

# passwd weblogic
```



## 3. 安装jdk1.8（如已安装跳过）

```

```



## 4. 配置环境变量（针对新建用户的）

```shell
# vim ~/.bash_profile

## 添加一下内容，路径根据真实情况填写
JAVA_HOME=/usr/local/java/jdk1.8.0
export JRE_HOME=/usr/local/java/jdk1.8.0/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
```



## 5. 开始安装

```shell
1.创建 oraInst.loc 文件，用来保存安装时的一些临时文件，和默认安装的组名称，内容如下

## 产品清单目录
inventory_loc=/home/weblogic/oraInventory1
## 用户的组名称，根据实际的修改
inst_group=weblogic

2.创建 wls.rsp 响应文件
[ENGINE]
#DO NOT CHANGE THIS.
Response File Version=1.0.0.0.0
[GENERIC]
#weblogic的安装路径，根据自己的需要修改
ORACLE_HOME=/home/weblogic/Oracle/Middleware   
#Set this variable value to the Installation Type selected. e.g. WebLogic Server, Coherence, Complete with Examples.
INSTALL_TYPE=WebLogic Server

3.配置文件创建后，开始安装
# java -jar wls_12.2.1.4.jar -silent -responseFile /home/weblogic/wls.rsp -invPtrLoc /home/weblogic/oraInst.loc

## 显示以下内容意味着安装成功
Expected result: 1.8.0_191
Actual result: 1.8.0
Warning: Check:CheckJDKVersion completed with warnings.

Validations are enabled for this session.
Verifying data
Copying Files
Percent Complete : 10
Percent Complete : 20
Percent Complete : 30
Percent Complete : 40
Percent Complete : 50
Percent Complete : 60
Percent Complete : 70
Percent Complete : 80
Percent Complete : 90
Percent Complete : 100
The installation of Oracle Fusion Middleware 12c WebLogic and Coherence Developer 12.2.1.4.0 completed successfully.
Logs successfully copied to /home/weblogic/wls12214/cfgtoollogs/oui.
```



## 6. 创建域domain

```
1. 创建以下文件目录
# mkdir -p /home/weblogic/Oracle/Middleware/SeNT/domains/baseDomain/

2. 创建参数文件  create_domain.rsp
# touch create_domain.rsp

------------参数文件内容-----------------------------
read template from "/home/weblogic/wls12214/wlserver/common/templates/wls/wls.jar";

set JavaHome "/usr/local/java/jdk1.8.0";
set ServerStartMode "prod";

find Server "AdminServer" as AdminServer;
set AdminServer.ListenAddress "";
set AdminServer.ListenPort "7001";
set AdminServer.SSL.Enabled "true";
set AdminServer.SSL.ListenPort "7002";

//Create Machine
//create Machine "base" as Machinename;

//use templates default weblogic user
find User "weblogic" as u1;
set u1.password "weblogic";

write domain to "/home/weblogic/Oracle/Middleware/SeNT/domains/baseDomain/";

// The domain name will be "demo-domain"

close template;
------------参数文件内容-----------------------------


4. 创建域
# /home/weblogic/wls12214/wlserver/common/bin/config.sh -mode=silent -silent_script=/home/weblogic/create_domain.rsp -logfile=/home/weblogic/create_domain.log
```



## 7. 启动Weblogic

```
1. 进入域目录
# cd /home/weblogic/Oracle/Middleware/SeNT/domains/baseDomain/

2. 运行启动脚本
# ./startWebLogic.sh

3. 后台运行weblogic
## 需要先创建用户名密码的属性文件
# mkdir -p /home/weblogic/Oracle/Middleware/SeNT/domains/baseDomain/servers/AdminServer/security
# touch boot.propertis
# vim boot.properties
username=<Set username from create_domain.rsp>
password=<Set password from create_domain.rsp>

# nohup /home/weblogic/Oracle/Middleware/SeNT/domains/baseDomain/startWebLogic.sh &
```



## 8. 卸载weblogic

```
# cd /home/weblogic/wls12214/oui/bin

## 静默方式卸载
# ./deinstall.sh -silent
```

