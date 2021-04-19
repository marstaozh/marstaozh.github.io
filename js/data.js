var treeJson = [
    {
        "menuArr": [
            {
                "href":"java/javaCollection.html",
                "name":"集合",
                "dataModuleId":"0"
            },
            {
                "href":"java/BIO.html",
                "name":"同步与异步&阻塞与非阻塞",
                "dataModuleId":"1"
            },
            {
                "href":"java/netty.html",
                "name":"Netty",
                "dataModuleId":"2"
            },
            {
                "href":"java/transaction.html",
                "name":"事务",
                "dataModuleId":"3"
            },
            {
                "menuArr": [
                    {
                        "href":"thread.html",
                        "name":"基础知识",
                        "dataModuleId":"0"
                    },
                    {
                        "href":"treadLocal.html",
                        "name":"ThreadLocal",
                        "dataModuleId":"1"
                    }
                ],
                "id": "Tread",
                "name": "多线程"
            },
            {
                "menuArr": [
                    {
                        "href":"factory.html",
                        "name":"工厂模式",
                        "dataModuleId":"0"
                    }
                ],
                "id": "designModel",
                "name": "设计模式"
            },
            {
                "href":"con1.html",
                "name":"lambda",
                "dataModuleId":"0"
            }
        ],
        "id": "Java",
        "name": "Java"
    },
    {
        "id": "database",
        "name": "数据库",
        "menuArr": [
            {
                "href":"../md/database/mariaDB",
                "name":"lambda",
                "dataModuleId":"0"  
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