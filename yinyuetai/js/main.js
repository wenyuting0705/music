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

window.onload = function() {
	getFocus();
	headerBind();
	navDrag();
	addActive();
	banner();
	tab();
	screenDrag();
}

//input 获取焦点与失去焦点
function getFocus() {
	var inputText = document.querySelector('#wrap #header .search input[type="text"]')
	inputText.addEventListener('touchstart', function(event) {
		inputText.focus();
		event.stopPropagation();
		event.preventDefault();
	});
	document.addEventListener('touchstart', function() {
		inputText.blur();
	})
}
//头部菜单
function headerBind() {
	var menuBtn = document.getElementById('menuBtn');
	var list = document.querySelector('.list');
	var flag = true;
	menuBtn.addEventListener('touchstart', function(event) {

		if(flag) {
			removeClass(menuBtn, 'menuBtnClose')
			addClass(menuBtn, 'menuBtnOpen')
			list.style.display = 'block'
		} else {
			removeClass(menuBtn, 'menuBtnOpen')
			addClass(menuBtn, 'menuBtnClose')
			list.style.display = 'none'
		}

		flag = !flag;

		event.stopPropagation();
		event.preventDefault();
	})
	document.addEventListener('touchstart', function(event) {
		if(!flag) {
			removeClass(menuBtn, 'menuBtnOpen');
			addClass(menuBtn, 'menuBtnClose');
			list.style.display = 'none';
			flag = !flag;
		}
	});
	list.addEventListener('touchstart', function(event) {
		event.stopPropagation();
		event.preventDefault();
	})
}
//头部导航拖动
function navDrag() {
	var navWrap = document.querySelector('#wrap #content .navWrap');
	var navList = document.querySelector('#wrap #content .navWrap .navList');
	transformCss(navList, 'translateZ', 1);

	var eleX = 0;
	var startX = 0;

	var s1 = 0;
	var s2 = 0;
	var t1 = 0;
	var t2 = 0;
	var disValue = 0;
	var disTime = 1;
	navWrap.addEventListener('touchstart', function(event) {
		var touch = event.changedTouches[0];

		navList.style.transition = 'none';
		eleX = transformCss(navList, 'translateX');
		startX = touch.clientX;

		s1 = eleX;
		t1 = new Date().getTime();

		disValue = 0;
	});

	navWrap.addEventListener('touchmove', function(event) {
		var touch = event.changedTouches[0];
		var endX = touch.clientX;
		var disX = endX - startX;
		var translateX = eleX + disX;

		if(translateX > 0) {
			var scale = 0.6 - translateX / (document.documentElement.clientWidth * 3);
			translateX = translateX * scale;
		} else if(translateX < document.documentElement.clientWidth - navList.offsetWidth) {
			var over = (document.documentElement.clientWidth - navList.offsetWidth) - translateX;
			var scale = 0.6 - over / (document.documentElement.clientWidth * 3);
			translateX = (document.documentElement.clientWidth - navList.offsetWidth) - over * scale;
		}
		transformCss(navList, 'translateX', translateX);
		s2 = translateX;
		t2 = new Date().getTime();
		disValue = s2 - s1;
		disTime = t2 - t1;
	});

	navWrap.addEventListener('touchend', function() {
		var speed = disValue / disTime;
		var target = transformCss(navList, 'translateX') + speed * 100;

		var bezier = '';
		if(target > 0) {
			target = 0;
			bezier = 'cubic-bezier(.19,1.47,.86,1.5)';
		} else if(target < document.documentElement.clientWidth - navList.offsetWidth) {
			target = document.documentElement.clientWidth - navList.offsetWidth;
			bezier = 'cubic-bezier(.19,1.47,.86,1.5)';
		}

		navList.style.transition = '0.5s transform ' + bezier;

		transformCss(navList, 'translateX', target);
	});
}
//头部导航切换样式
function addActive() {
	var liNodes = document.querySelectorAll('#wrap #content .navWrap .navList > li ');
	var flag = false;
	for(var i = 0; i < liNodes.length; i++) {
		liNodes[i].addEventListener('touchmove', function() {
			flag = true;
		});
		liNodes[i].addEventListener('touchend', function() {
			if(!flag) {
				for(var j = 0; j < liNodes.length; j++) {
					liNodes[j].className = '';
				}
				this.className = 'active';
			}
		})
		flag = false;
	}
}
//轮播图
function banner() {

	var wrap = document.querySelector('#wrap #content .rollWrap');
	var list = document.querySelector('#wrap #content .rollWrap .rollList');
	transformCss(list, 'translateZ', 1);

	list.innerHTML += list.innerHTML;

	var liNodes = document.querySelectorAll('#wrap #content .rollWrap .rollList > li');
	var spanNodes = document.querySelectorAll('#wrap #content .rollWrap .rollIcons > span');

	var styleNode = document.createElement('style');
	styleNode.innerHTML = '#wrap #content .rollWrap{height: ' + liNodes[0].offsetHeight + 'px;}'
	styleNode.innerHTML += '#wrap #content .rollWrap .rollList{width: ' + liNodes.length + '00%;}';
	styleNode.innerHTML += '#wrap #content .rollWrap .rollList > li{width: ' + 100 / liNodes.length + '%;}';
	document.head.appendChild(styleNode);

	var eleX = 0;

	var startX = 0;
	var startY = 0;

	var now = 0;

	var timer = null;

	var isFirst = true;

	var isX = true;

	wrap.addEventListener('touchstart', function(event) {
		var touch = event.changedTouches[0];

		clearInterval(timer);

		list.style.transition = 'none';

		if(now == 0) {
			now = spanNodes.length;
		} else if(now == liNodes.length - 1) {
			now = spanNodes.length - 1;
		}

		transformCss(list, 'translateX', -now * document.documentElement.clientWidth)

		eleX = transformCss(list, 'translateX');

		startX = touch.clientX;
		startY = touch.clientY;

		isFirst = true;
		isX = true;
	});
	wrap.addEventListener('touchmove', function(event) {
		var touch = event.changedTouches[0];

		if(!isX) {
			return;
		};

		var endX = touch.clientX;
		var endY = touch.clientY;

		var disX = endX - startX;
		var disY = endY - startY;

		if(isFirst) {
			isFirst = false;
			if(Math.abs(disY) > Math.abs(disX)) {

				isX = false;
				return;
			}
		}

		transformCss(list, 'translateX', disX + eleX)

	});
	wrap.addEventListener('touchend', function() {
		var left = transformCss(list, 'translateX')

		now = Math.round(-left / document.documentElement.clientWidth)

		if(now < 0) {
			now = 0
		} else if(now > liNodes.length - 1) {
			now = liNodes.length - 1
		}

		list.style.transition = '0.5s transform';

		transformCss(list, 'translateX', -now * document.documentElement.clientWidth)

		for(var i = 0; i < spanNodes.length; i++) {
			spanNodes[i].className = ''
		}
		spanNodes[now % spanNodes.length].className = 'active'

		auto();
	});

	auto();

	function auto() {
		timer = setInterval(function() {

			if(now == liNodes.length - 1) {
				now = spanNodes.length - 1;

				list.style.transition = 'none';
				transformCss(list, 'translateX', -now * document.documentElement.clientWidth)
			}

			setTimeout(function() {
				now++;
				list.style.transition = '0.5s';
				transformCss(list, 'translateX', -now * document.documentElement.clientWidth)

				for(var i = 0; i < spanNodes.length; i++) {
					spanNodes[i].className = ''
				}
				spanNodes[now % spanNodes.length].className = 'active'
			}, 20)

		}, 1000)
	}

};

function tab() {
	var tabWarp = document.querySelectorAll('#wrap #content .tab .tabWrap');
	var tabNav = document.querySelectorAll('#wrap #content .tab .tabNav');

	var translateX = tabNav[0].offsetWidth;
	for(var i = 0; i < tabWarp.length; i++) {
		move(tabWarp[i], tabNav[i]);
	}

	function move(tabWarp, tabNav) {
		transformCss(tabWarp, 'translateZ', 1);
		transformCss(tabWarp, 'translateX', -translateX);

		var eleX = 0;
		var startX = 0

		var startY = 0;
		var isFirst = true;
		var isX = true;

		var isLoad = false;
		var loadings = tabWarp.querySelectorAll('.loading');

		var smallG = tabNav.querySelector('.smallG');
		var aNodes = tabNav.querySelectorAll('a');
		var nowA = 0;

		tabWarp.addEventListener('touchstart', function(event) {
			var touch = event.changedTouches[0];

			if(isLoad) {
				return;
			}

			eleX = transformCss(tabWarp, 'translateX');
			startX = touch.clientX;
			startY = touch.clientY;

			isFirst = true;
			isX = true;
		});

		tabWarp.addEventListener('touchmove', function(event) {
			var touch = event.changedTouches[0];

			if(isLoad) {
				return;
			}
			if(!isX) {
				return;
			}

			tabWarp.style.transition = 'none';
			var endX = touch.clientX;
			var endY = touch.clientY;

			var disX = endX - startX;
			var disY = endY - startY;

			if(isFirst) {
				isFirst = false;
				if(Math.abs(disY) > Math.abs(disX)) {
					isX = false;
					return;
				}
			}

			transformCss(tabWarp, 'translateX', eleX + disX);

			if(Math.abs(disX) > translateX / 2) {
				var target = disX < 0 ? -translateX * 2 : 0;

				tabWarp.style.transition = '1s';
				transformCss(tabWarp, 'translateX', target);

				isLoad = true;

				if(disX < 0) {
					nowA++;
				} else {
					nowA--;
				}

				if(nowA > aNodes.length - 1) {
					nowA = 0;
				} else if(nowA < 0) {
					nowA = aNodes.length - 1;
				}
				smallG.style.transition = '.5s';
				transformCss(smallG, 'translateZ', 1);
				transformCss(smallG, 'translate', aNodes[nowA].offsetLeft);

				tabWarp.addEventListener('transitionend', fun);
				tabWarp.addEventListener('webkitTransitionEnd', fun);

				function fun() {
					if(disX < 0) {
						loadings[1].style.opacity = '1';
					} else {
						loadings[0].style.opacity = '1';
					}

					setTimeout(function() {
						for(var i = 0; i < loadings.length; i++) {
							loadings[i].style.opacity = '0';
						}
						isLoad = false;
						tabWarp.style.transition = 'none';
						transformCss(tabWarp, 'translateX', -translateX);
					}, 800);

					tabWarp.removeEventListener('transitionend', fun);
					tabWarp.removeEventListener('webkitTransitionEnd', fun);
				}

			}
		});

		tabWarp.addEventListener('touchend', function(event) {
			var touch = event.changedTouches[0];
			if(isLoad) {
				return;
			}
			var endX = touch.clientX;
			var disX = endX - startX;
			if(Math.abs(disX) < translateX / 2) {
				tabWarp.style.transition = '.5s';
				transformCss(tabWarp, 'translateX', -translateX);
			}
		})
	}
}

function screenDrag(){
	var conWrap=document.getElementById('conWrap');
	var content=document.getElementById('content');
	var scrollBar=document.getElementById('scrollBar');
	
	var scale=document.documentElement.clientHeight/content.offsetHeight;
	scrollBar.style.height=scale*document.documentElement.clientHeight+'px';
	
	var callback={
		start:function(){
			scrollBar.style.opacity='1';
		},
		move:function(){
			scrollBar.style.opacity='1';
			var dis=transformCss(content,'translateY')*scale;
			transformCss(scrollBar,'translateY',-dis);
		},
		end:function(){
			scrollBar.style.opacity='0';
		}
	}
	
	dragNav(conWrap,callback);
}
