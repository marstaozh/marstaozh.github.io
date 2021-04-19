var treeJson = [
    {
        "menuArr": [
            {
                "id": "base",
                "name": "Java基础",
                "menuArr": [
                    {
                        "href":"md/java/collection.md",
                        "name":"集合",
                        "dataModuleId":"0"
                    },
                    {
                        "href":"md/java/BIO.md",
                        "name":"同步与异步&阻塞与非阻塞",
                        "dataModuleId":"1"
                    },
                    {
                        "href":"md/java/netty.md",
                        "name":"Netty",
                        "dataModuleId":"2"
                    },
                    {
                        "href":"md/java/transaction.md",
                        "name":"事务",
                        "dataModuleId":"3"
                    }
                ]
            },
            
            {
                "menuArr": [
                    {
                        "href":"thread.md",
                        "name":"基础知识",
                        "dataModuleId":"0"
                    },
                    {
                        "href":"treadLocal.md",
                        "name":"ThreadLocal",
                        "dataModuleId":"1"
                    }
                ],
                "id": "tread",
                "name": "多线程"
            },
            {
                "menuArr": [
                    {
                        "href":"factory.md",
                        "name":"工厂模式",
                        "dataModuleId":"0"
                    }
                ],
                "id": "designModel",
                "name": "设计模式"
            },
            {
                "href":"lambda.md",
                "name":"lambda",
                "dataModuleId":"0"
            }
        ],
        "id": "Java",
        "name": "Java"
    },
    {
        "id": "frame",
        "name": "框架",
        "menuArr": [
            {
                "href":"md/frame/configCORS.md",
                "name":"跨域配置",
                "dataModuleId":"0"  
            },
            {
                "href":"md/frame/swagger2.md",
                "name":"跨域配置",
                "dataModuleId":"1"  
            }
        ]
    },
    {
        "id": "database",
        "name": "数据库",
        "menuArr": [
            {
                "href":"md/database/mariaDB/installMariaDB10.4InCentOS7.md",
                "name":"mariaDB",
                "dataModuleId":"0"  
            }
        ]
    },
    {
        "id": "messageQueue",
        "name": "消息中间件",
        "menuArr": [
            {
                "id": "activeMQ",
                "name": "activeMQ",
                "menuArr": [
                    {
                        "href":"md/mq/activeMQ/activeMQsCluster.md",
                        "name":"ActiveMQ集群架构与原理解析",
                        "dataModuleId":"0"
                    }
                ]
            },
            {
                "id": "kafka",
                "name": "kafka",
                "menuArr": [
                    
                ]
            },
            {
                "id": "rabbitMQ",
                "name": "rabbitMQ",
                "menuArr": [
                    {
                        "href":"md/mq/rabbitMQ/initEnv4RabbitMQ.md",
                        "name":"rabbitMQ环境搭建",
                        "dataModuleId":"0"
                    },
                    {
                        "href":"md/mq/rabbitMQ/firstMeetRabbitMQ.md",
                        "name":"初识RabbitMQ",
                        "dataModuleId":"1"
                    },
                    {
                        "href":"md/mq/rabbitMQ/rabbitMQsAPI.md",
                        "name":"RabbitMQ核心API",
                        "dataModuleId":"1"
                    },
                    {
                        "href":"md/mq/rabbitMQ/RabbitMQAdvancedFeatures.md.md",
                        "name":"RabbitMQ的高级特性",
                        "dataModuleId":"1"
                    },
                    {
                        "href":"md/mq/rabbitMQ/RabbitMQsCluster.md",
                        "name":"RabbitMQ集群环境搭建",
                        "dataModuleId":"1"
                    }
                ]
            },
            {
                "id": "rocketMQ",
                "name": "rocketMQ",
                "menuArr": [
                    {
                        "href":"md/mq/rocketMQ/rocketMQsCluster.md",
                        "name":"RocketMQ集群架构与原理解析",
                        "dataModuleId":"0"
                    }
                ]
            }
        ]
    }
];

var nodeTemplate = "<li data-module-id=\"replaceNodeDataModuleId\" class=\"menu_title_primary\">" + 
"<a class=\"collapsed \" data-toggle=\"collapse\" data-target=\"#replaceNodeDivId\">" +
"<span class=\"glyphicon glyphicon-folder-open\"></span> replateNodeMenuName<span class=\"caret\"></span></a>" +
"<div id=\"replaceNodeDivId\" class=\"collapse\" aria-expanded=\"false\" style=\"height: 1px;\">" +
  "<ul class=\"list-unstyled\">" +
  "replaceLi" +
  "</ul>" +
"</div>" +  
"</li>";

// var leafTemplate = "<li><a data-module-id=\"replaceLeafDataModuleId\" target=\"mIframe\" href=\"replaceLeafHref\">replaceLeafName</a></li>";
var leafTemplate = "<li><a data-module-id=\"replaceLeafDataModuleId\" target=\"mIframe\" "+
                    "onclick=\"converteMd('replaceLeafHref')\">replaceLeafName</a></li>";

$(function(){
    
    var reg = new RegExp("replaceNodeDivId","g");
    function recursionTree(nodeJson, level) {
        var menu = "";
        var folderIcon = "<span class=\"glyphicon glyphicon-folder-open\"></span> ";
        var fileIcon = "<span class=\"glyphicon glyphicon-file\"></span> ";
        $.each(nodeJson, function(index, value) {
            if(value.menuArr) {
                
                var nodeLi = nodeTemplate.replace(/replaceNodeDataModuleId/, level);
                nodeLi = nodeLi.replace(reg, value.id);
                nodeLi = nodeLi.replace(/replateNodeMenuName/, value.name);

                var li = recursionTree(value.menuArr, level+1);
                nodeLi = nodeLi.replace(/replaceLi/, li);
                menu += nodeLi;
                
            }else {
                var leafLi = leafTemplate.replace(/replaceLeafDataModuleId/, value.dataModuleId);
                leafLi = leafLi.replace(/replaceLeafHref/, value.href);
                if(level == 3) {
                    leafLi = leafLi.replace(/replaceLeafName/, "&nbsp;&nbsp;" + fileIcon + value.name);
                }else {
                    leafLi = leafLi.replace(/replaceLeafName/, fileIcon + value.name);
                }

                menu += leafLi;
            }
        });

        return menu;
    };

    function initTree () {

        var menu = recursionTree(treeJson, 1);
        $("#menu").append(menu);
    };

    initTree();
    
});