var nodeTemplate = "<li data-module-id=\"replaceNodeDataModuleId\" class=\"menu_title_primary\">" + 
"<a class=\"collapsed \" data-toggle=\"collapse\" data-target=\"#replaceNodeDivId\">" +
"<span class=\"glyphicon glyphicon-folder-open\"></span> replateNodeMenuName<span class=\"caret\"></span></a>" +
"<div id=\"replaceNodeDivId\" class=\"collapse\" aria-expanded=\"false\" style=\"height: 1px;\">" +
  "<ul class=\"list-unstyled\">" +
  "replaceLi" +
  "</ul>" +
"</div>" +  
"</li>";

var leafTemplate = "<li><a data-module-id=\"replaceLeafDataModuleId\" target=\"mIframe\" "+
                    "onclick=\"converteMd('replaceLeafHref')\">replaceLeafName</a></li>";

$(function(){
    
    var reg = new RegExp("replaceNodeDivId","g");
    function recursionTree(nodeJson, level) {
        var menu = "";
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