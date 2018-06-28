document.addEventListener('touchstart',function(event){
	event.preventDefault();
});

!(function(){
	var aNodes=document.querySelectorAll('a');
	for (var i=0;i<aNodes.length;i++) {
		aNodes[i].addEventListener('touchstart',function(){
			window.location.href=this.href;
		})
	}
})();

!(function(){
	var styleNode=document.createElement('style');
	var width=document.documentElement.clientWidth;
	styleNode.innerHTML='html{font-size: '+ width/16 +'px !important;}';
	document.head.appendChild(styleNode);
})()
