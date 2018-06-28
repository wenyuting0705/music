(function(win) {
	win.dragNav = function(navWrap,callback) {
		var navList = navWrap.children[0];

		transformCss(navList, 'translateZ', 1);

		var eleY = 0;
		var startY = 0;

		var s1 = 0;
		var s2 = 0;
		var t1 = 0;
		var t2 = 0;
		var disValue = 0;
		var disTime = 1;
		
		var Tween={
			Linear: function(t,b,c,d){ return c*t/d + b; },
			easeOut:function(t,b,c,d,s){
	            if (s == undefined) s = 3;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	        }
		}
		
		var timer=null;
		
		var startX=0;
		var isFirst=true;
		var isY=true;
		
		navWrap.addEventListener('touchstart', function(event) {
			var touch = event.changedTouches[0];

//			navList.style.transition = 'none';
			clearInterval(timer);
			
			eleY = transformCss(navList, 'translateY');
			startY = touch.clientY;
			startX=touch.clientX;

			s1 = eleY;
			t1 = new Date().getTime();

			disValue = 0;
			
			if(callback && typeof callback['start']=='function'){
				callback['start']();
			}
			
			isFirst=true;
			isY=true;
		});

		navWrap.addEventListener('touchmove', function(event) {
			var touch = event.changedTouches[0];
			
			
			if(!isY){
				return;
			}

			var endY = touch.clientY;
			var endX=touch.clientX;
			var disY = endY - startY;
			var disX=endX-startX;
			var translateY = eleY + disY;
			
			
			if(translateY > 0) {
				var scale = 0.6 - translateY / (document.documentElement.clientHeight * 3);
				translateY = translateY * scale;
			} else if(translateY < document.documentElement.clientHeight - navList.offsetHeight) {
				var over = (document.documentElement.clientHeight - navList.offsetHeight) - translateY;
				var scale = 0.6 - over / (document.documentElement.clientHeight * 3);
				translateY = (document.documentElement.clientHeight - navList.offsetHeight) - over * scale;
			}
			
			if(isFirst){
				isFirst = false;
				if(Math.abs(disX) > Math.abs(disY)){
					isY = false;
					return;
				}
			}
			
			transformCss(navList, 'translateY', translateY);
			s2 = translateY;
			t2 = new Date().getTime();
			disValue = s2 - s1;
			disTime = t2 - t1;
			
			if(callback && typeof callback['move']=='function'){
				callback['move']();
			}
		});
		navWrap.addEventListener('touchend', function() {
			var speed = disValue / disTime;
			var target = transformCss(navList, 'translateY') + speed * 200;

			var type='Linear';
			if(target > 0) {
				target = 0;
				type='easeOut';
			} else if(target < document.documentElement.clientHeight - navList.offsetHeight) {
				target = document.documentElement.clientHeight - navList.offsetHeight;
				type='easeOut';
			}

//			transformCss(navList, 'translateY', target);
			
			var time=1000;
			
			tweenMove(target,type,time);
			
//			if(callback && typeof callback['end']=='function'){
//				callback['end']();
//			}
		});
		
		function tweenMove(target,type,time){
			var t=0;
			var b=transformCss(navList, 'translateY');
			var c=target-b;
			var d=time/20;
			
			clearInterval(timer);
			timer=setInterval(function(){
				t++;
				if(t>d){
					if(callback && typeof callback['end']=='function'){
						callback['end']();
					}
					clearInterval(timer);
				}else{
					if(callback && typeof callback['move']=='function'){
						callback['move']();
					}
					var point = Tween[type](t,b,c,d);
					transformCss(navList,'translateY',point)
				}
			},20)
		}
	}
})(window)