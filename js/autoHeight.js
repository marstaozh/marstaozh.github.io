window.onload=function(){
	if(self != top) { 
        console.log(document.body.offsetHeight);
        parent.setAttrs({height:document.body.offsetHeight+60});
    }
};