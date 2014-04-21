/***********************************************
 * 
 *  effects for transitions/ background images/ typography etc.
 * 
 * *********************************************/
//this is the default effects on loading slides..please do not use
canvasTransition.transfadein = function(){
		
		var fadein1 = __util.evaluate("@%100keyframes fadein1{0%{opacity:0;}1%{opacity:0;}100%{opacity:1;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(fadein1).transform({
			incoming : {
				object : this.transintarget,
				name : "fadein1",
				duration : "2s",
				fillmode : "forwards"
			}
		});
};

canvasTransition.transfadeinrotateout = function(){
			var fadeinrotateout = __util.evaluate("@%100keyframes fadeinbefore{0%{opacity:0;display:none;}1%{opacity:0;display:block;}100%{opacity:1;display:block;}} @%100keyframes fadeoutrot{from{opacity:1;%100transform:rotateY(0deg);}to{opacity:0;display:none;%100transform:rotateY(90deg);}}");
			this.$.mySheet("inertia-stylesheet").myNewRule(fadeinrotateout).transform({
				incoming : {
					object : this.transintarget,
					name : "fadeinbefore",
					duration : "1s",
					delay : "1s",
					fillmode : "forwards"
				},
				outcoming : {
					object : this.transouttarget,
					name : "fadeoutrot",
					duration : "1s",
					fillmode : "forwards"
				}
			});
			
}


canvasTransition.transfadeout = function(){
	var fadeinfadeout = __util.evaluate("@%100keyframes fadein{0%{opacity:0;display:none;}1%{opacity:0;display:block;}100%{opacity:1;display:block;}} @%100keyframes fadeout{from{opacity:1;}to{opacity:0;display:none;}}");
	this.$.mySheet("inertia-stylesheet").myNewRule(fadeinfadeout).transform({
		incoming : {
			object : this.transintarget,
			name : "fadein",
			duration : "1s",
			fillmode : "forwards"
		},
		outcoming : {
			object : this.transouttarget,
			name : "fadeout",
			duration : "1s",
			fillmode : "forwards"
		}
	});
};

canvasTransition.mycube = function(){
		var cube = __util.evaluate("@%100keyframes cubein{0%{opacity:0;display:none;%100transform:rotateY(90deg) translateZ(300px);}10%{opacity:1;}50%{%100transform:rotate(0deg) translateZ(300px);}100%{opacity:1;display:block;}}")+
				 __util.evaluate("@%100keyframes cubeout{0%{opacity:1;}20%{%100transform:translateZ(300px);}50%{%100transform:rotate(0deg) translateZ(300px);}90%{opacity:1;}100%{opacity:0;display:none;%100transform:rotateY(-90deg) translateZ(300px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(cube).transform({
			incoming : {
				object : this.transintarget,
				name : "cubein",
				duration : "1s",
				delay:"700ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "cubeout",
				duration : "1s",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.replace = function(){
		var out = __util.Tget(inertiaObject.tags[3])[this.transouttarget];
		var cube = __util.evaluate("@%100keyframes replacein{0%{%100transform:translateZ(-300px) translateX("+out.getBoundingClientRect().width+"px);opacity:0;}50%{%100transform:translateZ(-300px) translateX("+out.getBoundingClientRect().width+"px);opacity:1;}100%{%100transform:translateZ(0px)  translateX(0px);opacity:1;}}")+
				 __util.evaluate("@%100keyframes replaceout{50%{%100transform:translateZ(-300px) translateX(-"+out.getBoundingClientRect().width+"px);}80%{%100transform:translateZ(-300px) translateX(-"+out.getBoundingClientRect().width+"px);opacity:1;}100%{%100transform:translateZ(-300px) translateX(-"+out.getBoundingClientRect().width+"px);opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(cube).transform({
			incoming : {
				object : this.transintarget,
				name : "replacein",
				duration : "1s",
				delay:"700ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "replaceout",
				duration : "1s",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.fast = function(){
		var out = __util.Tget(inertiaObject.tags[3])[this.transouttarget];
		var cube = __util.evaluate("@%100keyframes fastin{0%{%100transform:translateX("+screen.width+"px) skew(-10deg);opacity:1;}80%{%100transform:translateX(0px) skew(-10deg);opacity:1;}100%{%100transform:translateX(0px) skew(0deg);opacity:1;}}")+
				 __util.evaluate("@%100keyframes fastout{100%{%100transform:translateX(-"+screen.width+"px) skew(-10deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(cube).transform({
			incoming : {
				object : this.transintarget,
				name : "fastin",
				duration : "1s",
				delay:"700ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "fastout",
				duration : "1s",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.spidey = function(){
		var out = __util.Tget(inertiaObject.tags[3])[this.transouttarget];
		var cube = __util.evaluate("@%100keyframes fastin{0%{%100transform:rotateZ(-90deg);%100transform-origin:100% 0%;opacity:0;}50%{%100transform:rotateZ(-90deg);%100transform-origin:100% 0%;opacity:1;}100%{%100transform:rotateZ(0deg);%100transform-origin:100% 0%;opacity:1;}}")+
				 __util.evaluate("@%100keyframes fastout{0%{%100transform:rotateZ(0deg);%100transform-origin:0% 0%;opacity:1;}90%{%100transform:rotateZ(90deg);%100transform-origin:0% 0%;opacity:1;}100%{%100transform:rotateZ(90deg);%100transform-origin:0% 0%;opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(cube).transform({
			incoming : {
				object : this.transintarget,
				name : "fastin",
				duration : "1s",
				delay:"700ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "fastout",
				duration : "1s",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.color = function(){
		var out = __util.Tget(inertiaObject.tags[3])[this.transouttarget];
		var cube = __util.evaluate("@%100keyframes fastin{0%{%100transform:rotateZ(-90deg);%100transform-origin:100% 0%;opacity:0;}50%{%100transform:rotateZ(-90deg);%100transform-origin:100% 0%;opacity:1;}100%{%100transform:rotateZ(0deg);%100transform-origin:100% 0%;opacity:1;}}")+
				 __util.evaluate("@%100keyframes fastout{0%{%100transform:rotateZ(0deg);%100transform-origin:0% 0%;opacity:1;}90%{%100transform:rotateZ(90deg);%100transform-origin:0% 0%;opacity:1;}100%{%100transform:rotateZ(90deg);%100transform-origin:0% 0%;opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(cube).transform({
			incoming : {
				object : this.transintarget,
				name : "fastin",
				duration : "1s",
				delay:"700ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "fastout",
				duration : "1s",
				fillmode : "forwards"
			}
		});
	
};


canvasTransition.fullrotate = function(){
		var cube = __util.evaluate("@%100keyframes nextrotate{0%{opacity:0;%100transform:rotateY(-90deg);}1%{opacity:1;%100transform:rotateY(-90deg)}100%{opacity:1;%100transform:rotateY(0deg)}}")+
				 __util.evaluate("@%100keyframes prevrotate{0%{opacity:1;%100transform:rotateY(0deg);}99%{opacity:1;%100transform:rotateY(90deg);}100%{opacity:0;%100transform:rotateY(90deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(cube).transform({
			incoming : {
				object : this.transintarget,
				name : "nextrotate",
				duration : "1s",
				delay:"1s",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "prevrotate",
				duration : "1s",
				fillmode : "forwards"
			}
		});
	
};

canvasTransition.card = function(){
		var mycard= __util.evaluate("@%100keyframes cardout{0%{opacity:1;z-index:100;}50%{%100transform:rotate(-45deg) scale(0.5);%100transform-origin:0% 100%;left:100px;top:100px;}90%{opacity:1;}100%{opacity:0;z-index:10;}} @%100keyframes cardin{0%{opacity:1;z-index:10;}50%{%100transform:rotate(-45deg) scale(0.5);right:100px;%100transform-origin:100% 0%;bottom:100px;}90%{opacity:1;z-index:100;}100%{z-index:10;opacity:1;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(mycard).transform({
			incoming : {
				object : this.transintarget,
				name : "cardin",
				duration : "1500ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "cardout",
				duration : "1500ms",
				fillmode : "forwards"
			}
		});
	
};

canvasTransition.slideallleft = function(){
		var farLeft = screen.width;
		var moveNow = __util.evaluate("@%100keyframes incomingfrombelow{0%{opacity:1;display:block;%100transform:translateX("+farLeft+"px);}100%{opacity:1;display:block;%100transform:translateX(0px);}}@%100keyframes outcomingfrombelow{0%{opacity:1;display:block;%100transform:translateX(0px);}100%{opacity:1;display:block;%100transform:translateX(-"+farLeft+"px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "incomingfrombelow",
				duration : "1000ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "outcomingfrombelow",
				duration : "1000ms",
				fillmode : "forwards"
			}
		});
	
};

canvasTransition.slideallbottom = function(){
		var farBottom = screen.height;
		var moveNow = __util.evaluate("@%100keyframes incomingFromBelow{0%{opacity:1;display:block;%100transform:translateY("+farBottom+"px);}100%{opacity:1;display:block;}}@%100keyframes outcomingFromBelow{0%{opacity:1;display:block;}100%{opacity:1;display:block;%100transform:translateY(-"+farBottom+"px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "incomingFromBelow",
				duration : "1000ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "outcomingFromBelow",
				duration : "1000ms",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.slideallright = function(){
		var farRight = screen.width;
		var moveNow = __util.evaluate("@%100keyframes incomingFromRight{0%{opacity:1;display:block;%100transform:translateY(-"+farRight+"px);}100%{opacity:1;display:block;%100transform:translateY(0px);}}@%100keyframes outcomingFromRight{0%{opacity:1;display:block;%100transform:translateY(0px);}100%{opacity:1;display:block;%100transform:translateY("+farRight+"px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "incomingFromRight",
				duration : "1000ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "outcomingFromRight",
				duration : "1000ms",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.slidealltop = function(){
		var farTop = screen.height;
		var moveNow = __util.evaluate("@%100keyframes incomingFromTop{0%{opacity:1;display:block;%100transform:translateY(-"+farTop+"px);}100%{opacity:1;display:block;%100transform:translateY(0px);}}@%100keyframes outcomingFromTop{0%{opacity:1;display:block;%100transform:translateY(0px);}100%{opacity:1;display:block;%100transform:translateY("+farTop+"px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "incomingFromTop",
				duration : "1000ms",
				fillmode : "forwards"
			},
			outcoming : {
				object : this.transouttarget,
				name : "outcomingFromTop",
				duration : "1000ms",
				fillmode : "forwards"
			}
		});
	
};
canvasTransition.doorleft = function(){
		var farLeft = screen.width;
		var moveNow = __util.evaluate("@%100keyframes opendoor{0%{opacity:1;display:block;%100transform:rotateY(0deg);%100transform-origin:100% 0%;}20%{opacity:1;display:block;%100transform:rotateY(-40deg);%100transform-origin:100% 0%;}100%{opacity:0;display:none;%100transform:rotateY(-40deg) translateX(-2000px);%100transform-origin:100% 0%;}}")+
					  __util.evaluate("@%100keyframes closedoor{0%{opacity:1;display:block;left:-"+farLeft+"px;}100%{opacity:1;display:block;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "closedoor",
				duration : "500ms",
				fillmode : "forwards",
				delay:"500ms"
			},
			outcoming : {
				object : this.transouttarget,
				name : "opendoor",
				duration : "1s",
				fillmode : "forwards"
			}
		});
}
canvasTransition.threedpanels = function(){
		var farLeft = screen.width;
		var moveNow = __util.evaluate("@%100keyframes entrancepanel{100%{%100transform:translateZ(-500px);opacity:0;}}")+
					  __util.evaluate("@%100keyframes closedoor{0%{%100transform:translateZ(500px);opacity:0;display:block}100%{%100transform:translateZ(0px);opacity:1;display:block;}}");
		
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "closedoor",
				duration : "500ms",
				fillmode : "forwards",
				delay:"500ms"
			},
			outcoming : {
				object : this.transouttarget,
				name : "entrancepanel",
				duration : "1s",
				fillmode : "forwards"
			}
		});
		
}
canvasTransition.threedpanelsreverse = function(){
		var farLeft = screen.width;
		var moveNow = __util.evaluate("@%100keyframes entrancepanel{100%{%100transform:translateZ(500px);opacity:0;}}")+
					  __util.evaluate("@%100keyframes closedoor{0%{%100transform:translateZ(-500px);opacity:0;display:block}100%{%100transform:translateZ(0px);opacity:1;display:block;}}");
		
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "closedoor",
				duration : "500ms",
				fillmode : "forwards",
				delay:"500ms"
			},
			outcoming : {
				object : this.transouttarget,
				name : "entrancepanel",
				duration : "1s",
				fillmode : "forwards"
			}
		});
		
}
canvasTransition.doorright = function(){
		var farLeft = screen.width;
		var moveNow = __util.evaluate("@%100keyframes opendoor2{0%{opacity:1;display:block;%100transform:rotateY(0deg);%100transform-origin:0% 0%;}20%{opacity:1;display:block;%100transform:rotateY(40deg);%100transform-origin:0% 0%;}100%{opacity:0;display:none;%100transform:rotateY(40deg) translateX(2000px);%100transform-origin:0% 0%;}}")+
					  __util.evaluate("@%100keyframes closedoor2{0%{opacity:1;display:block;left:"+farLeft+"px;}100%{opacity:1;display:block;}}");
						
		this.$.mySheet("inertia-stylesheet").myNewRule(moveNow).transform({
			incoming : {
				object : this.transintarget,
				name : "closedoor2",
				duration : "500ms",
				fillmode : "forwards",
				delay:"500ms"
			},
			outcoming : {
				object : this.transouttarget,
				name : "opendoor2",
				duration : "1s",
				fillmode : "forwards"
			}
		});
}

/**************************************************
 * 
 *  effects for animating the resources
 *  anyone who wants to create extension can use the
 *  generic format.
 * 
 *  this.mytargetchild is the target of your animation.
 *  You can grab all its properties
 * 
 * ***********************************************/

contentAnimation.fadein = function() //check
	{
		var fadein = __util.evaluate("@%100keyframes res_fadein{0%{opacity:0;}100%{opacity:1;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(fadein).enterRule({
			object : this.mytargetchild,
			enter : 'res_fadein',
			duration : '1s'
		});
	};

contentAnimation.slidein = function()
	{
		var myslidein = __util.evaluate("@%100keyframes res_slidein{0%{opacity:0;%100transform:translateX(-100px);}100%{opacity:1;%100transform:translateX(0px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(myslidein).enterRule({
			object : this.mytargetchild,
			enter : 'res_slidein',
			duration : '1s'
		});
	};
contentAnimation.slideinreverse = function()
	{
		var myleft = screen.width+"px";
		var myslideinreverse = __util.evaluate("@%100keyframes res_slideinreverse{0%{opacity:0;%100transform:translateX(100px);}100%{opacity:1;%100transform:translateX(0px);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(myslideinreverse).enterRule({
			object : this.mytargetchild,
			enter : 'res_slideinreverse',
			duration : '1s'
		});
	};
contentAnimation.hangin = function() //check
	{
		var hangin = __util.evaluate("@%100keyframes hangin{0%{%100transform:rotateX(90deg);%100transform-origin:100% 0%;}30%{%100transform:rotateX(-90deg);%100transform-origin:100% 0%;}60%{%100transform:rotateX(40deg);%100transform-origin:100% 0%;}80%{%100transform:rotateX(-20deg);%100transform-origin:100% 0%;}100%{%100transform:rotateX(0deg);%100transform-origin:100% 0%;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(hangin).enterRule({
			object : this.mytargetchild,
			enter : 'hangin',
			duration : '1s'
		});
	};
contentAnimation.pulldown = function()
	{
		var pulldown = __util.evaluate("@%100keyframes pulldown{0%{%100transform-origin:0% 100%;}40%{%100transform:rotateZ(120deg);%100transform-origin:0% 100%;}80%{%100transform:rotateZ(40deg);%100transform-origin:0% 100%;}90%{%100transform:rotateZ(100deg);%100transform-origin:0% 100%;}100%{%100transform:rotateZ(90deg);%100transform-origin:0% 100%;}}");
		
		this.$.mySheet("inertia-stylesheet").myNewRule(pulldown).enterRule({
			object : this.mytargetchild,
			enter : 'pulldown',
			duration : '1s'
		});
	};
	
contentAnimation.rotatein = function()
	{
		var rotatein = __util.evaluate("@%100keyframes rotatein{0%{%100transform-origin:50% 0%;%100transform:rotateY(90deg);}100%{%100transform-origin:50% 0%;%100transform:rotateY(0deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotatein).enterRule({
			object : this.mytargetchild,
			enter : 'rotatein',
			duration : '1s'
		});
	};
contentAnimation.coolyin = function()
	{
		var rotatein = __util.evaluate("@%100keyframes coolyin{0%{%100transform-origin:50% 0%;%100transform:rotateY(360deg) scale(10);}100%{%100transform-origin:50% 0%;%100transform:rotateY(0deg) scale(1);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotatein).enterRule({
			object : this.mytargetchild,
			enter : 'coolyin',
			duration : '1s'
		});
	};
	
contentAnimation.walkin = function()
	{
		var rotatein = __util.evaluate("@%100keyframes walkin{0%{%100transform-origin:50% 0%;%100transform:scale(5) translateX(-100%);opacity:0.5;}50%{%100transform-origin:50% 0%;%100transform:scale(5) translateX(0px);opacity:0.5;}100%{%100transform-origin:50% 0%;%100transform:rotateY(0deg) scale(1);opacity:1;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotatein).enterRule({
			object : this.mytargetchild,
			enter : 'walkin',
			duration : '1500ms'
		});
	};
	
//////////////////////////
contentAnimationOut.fadeout = function() //check
	{
		var fadeout = __util.evaluate("@%100keyframes res_fadeout{0%{opacity:1;}100%{opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(fadeout).enterRule({
			object : this.mytargetchild,
			enter : 'res_fadeout',
			duration : '1s',
			fill:"forwards"
		});
	};
contentAnimationOut.slideoutright = function() //check
	{
		var fadeout = __util.evaluate("@%100keyframes slideout1{100%{margin-left:300px;opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(fadeout).enterRule({
			object : this.mytargetchild,
			enter : 'slideout1',
			duration : '1s',
			fill:"forwards"
		});
	};
contentAnimationOut.slideoutleft = function() //check
	{
		var fadeout = __util.evaluate("@%100keyframes slideout1{100%{margin-right:300px;opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(fadeout).enterRule({
			object : this.mytargetchild,
			enter : 'slideout1',
			duration : '1s',
			fill:"forwards"
		});
	};
	
//image specific transition
	
/******************************************************
 * 
 * 
 * 
 * ****************************************************/
animationLoop.rotating1 = function()
	{
		var rotate1 = __util.evaluate("@%100keyframes rotating1{100%{%100transform:rotate(360deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotate1).loopRule({
			object : this.mytargetchild,
			loop : 'rotating1',
			delay:'0s',
			duration : '3s',
			mode : 'once' // once || loop
		});
	}
animationLoop.rotating2 = function()
	{
		var rotate2 = __util.evaluate("@%100keyframes rotating2{100%{%100transform:rotate(360deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotate2).loopRule({
			object : this.mytargetchild,
			loop : 'rotating2',
			delay:'0s',
			duration : '3s',
			mode : 'loop' // once || loop
		});
	}
animationLoop.rotating3 = function()
	{
		var rotate2 = __util.evaluate("@%100keyframes rotating3{100%{%100transform:rotateX(360deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotate2).loopRule({
			object : this.mytargetchild,
			loop : 'rotating3',
			delay:'0s',
			duration : '3s',
			mode : 'loop' // once || loop
		});
	}
animationLoop.rotating4 = function()
	{
		var rotate2 = __util.evaluate("@%100keyframes rotating4{100%{%100transform:rotateY(360deg);}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotate2).loopRule({
			object : this.mytargetchild,
			loop : 'rotating4',
			delay:'0s',
			duration : '3s',
			mode : 'loop' // once || loop
		});
	}
animationLoop.pulse = function()
	{
		var rotate2 = __util.evaluate("@%100keyframes pulse{0%{opacity:1;}100%{opacity:0;}}");
		this.$.mySheet("inertia-stylesheet").myNewRule(rotate2).loopRule({
			object : this.mytargetchild,
			loop : 'pulse',
			delay:'0s',
			duration : '1s',
			mode : 'loop' // once || loop
		});
	}
	
/**********************************************
 * 
 * this is for animating background images
 * cool! :-)
 * 
 * *******************************************/	


backgroundAnimation.fadeinout = function()
{
	var fadein = __util.evaluate("@%100keyframes fadeinImg{0%{opacity:0;display:none;}100%{opacity:1;display:block;}} @%100keyframes fadeoutImg{from{opacity:1;display:block;}to{opacity:0;display:none;}}");
	this.$.mySheet("inertia-bgsheet").myNewRule(fadein).transformImage({
	incoming :{
		bg : this.targetin,
		bgImage : 'fadeinImg',
		bgDuration : '1s',
		bgDelay :'0s'
	},
	outcoming :{
		bg : this.targetout,
		bgImage : 'fadeoutImg',
		bgDuration : '1s',
		bgDelay :'0s'
	}});
};
//as of 1.21
backgroundAnimation.slideall = function()
{
	var fadein = __util.evaluate("@%100keyframes slideinImg{0%{opacity:1;display:block;left:100%;}100%{opacity:1;display:block;left:0%;}} @%100keyframes slideoutImg{100%{opacity:1;left:-100%;}}");
	this.$.mySheet("inertia-bgsheet").myNewRule(fadein).transformImage({
	incoming :{
		bg : this.targetin,
		bgImage : 'slideinImg',
		bgDuration : '1s',
		bgDelay :'0s'
	},
	outcoming :{
		bg : this.targetout,
		bgImage : 'slideoutImg',
		bgDuration : '1s',
		bgDelay :'0s'
	}});
};


/**************************************************************************
 *
 * Animating background images/color...uhm...it kinda complicated 
 * cause i dont know what im thinking when i crete this section...but
 * you can also make your own...if you can...and ah...sorry for
 * messy code
 * __api(this.transintarget).getBg() <--- is the background container
 * 							   		 <--- using this you can access the 
 *									 <--- background container
 * __api(this.transintarget).getSlide() <-- is the slide wherein background will animate
 **************************************************************************/

// sliced3x3 v. 1.0
panelAnimation.sliced3x3 = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],["1","1","1","2","2","2","3","3","3"],["500","900","1300","1200","800","1000","700","1100","600"],["t1","t2","t3","m1","m2","m3","b1","b2","b3"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{from{opacity:0;}to{opacity:1;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background-size:cover;background:"+this.transinbackground+" -"+left+"px -"+top+"px;opacity:0;position:absolute;width:"+mywidth+"px;height:"+myheight+"px;top:"+top+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;"));
			__api(this.transintarget).getBg().appendChild(slices);
		}
		this.normalizeAfter("1s","1300");
}
panelAnimation.enlarge3x3 = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],["1","1","1","2","2","2","3","3","3"],["500","900","1300","1200","800","1000","700","1100","600"],["t1","t2","t3","m1","m2","m3","b1","b2","b3"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{from{width:0px;height:0px;}to{width:"+mywidth+"px;height:"+myheight+"px;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background-size:cover;background:"+this.transinbackground+" -"+left+"px -"+top+"px;position:absolute;width:0px;height:0px;top:"+top+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;"));
			__api(this.transintarget).getBg().appendChild(slices);
		}
		
		this.normalizeAfter("1s","1300");
}
panelAnimation.fly3x3 = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],["1","1","1","2","2","2","3","3","3"],["500","900","1300","1200","800","1000","700","1100","600"],["t1","t2","t3","m1","m2","m3","b1","b2","b3"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{from{top:-"+matrix[2][count]+"px;opacity:0;}to{top:"+top+"px;opacity:1;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			slices.setAttribute("style","background:"+this.transinbackground+" -"+left+"px -"+top+"px;position:absolute;width:"+mywidth+"px;top:-"+matrix[2][count]+"px;height:"+myheight+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;"));
			 __api(this.transintarget).getBg().appendChild(slices);
		}
		this.normalizeAfter("1s","1300");
}
panelAnimation.card3x3 = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],["1","1","1","2","2","2","3","3","3"],["500","900","1300","1200","800","1000","700","1100","600"],["t1","t2","t3","m1","m2","m3","b1","b2","b3"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{100%{%100transform:rotateX(0deg);opacity:1;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background:"+this.transinbackground+" -"+left+"px -"+top+"px;opacity:0;position:absolute;width:"+mywidth+"px;height:"+myheight+"px;top:"+top+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;%100transform:rotateX(90deg);")+"z-index:-1;");
			 __api(this.transintarget).getBg().appendChild(slices);
		}
		this.normalizeAfter("1s","1300");
}
panelAnimation.fly3x3d = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],
					 ["1","1","1","2","2","2","3","3","3"],
					 ["500","900","1300","1200","800","1000","700","1100","600"],
					 ["t1","t2","t3","m1","m2","m3","b1","b2","b3"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{0%{%100transform:rotateY(90deg) translateX(-500px);opacity:1;}100%{%100transform: translateX(0px) rotateY(0deg);opacity:1;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background:"+this.transinbackground+" -"+left+"px -"+top+"px;opacity:0;position:absolute;width:"+mywidth+"px;height:"+myheight+"px;top:"+top+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;%100transform:rotateY(360deg);")+"z-index:-1;");
			 __api(this.transintarget).getBg().appendChild(slices);
		}
		
		this.normalizeAfter("1s","1300");
}
panelAnimation.fly3x3dreverse = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],["1","1","1","2","2","2","3","3","3"],["500","900","1300","1200","800","1000","700","1100","600"],["t1","t2","t3","m1","m2","m3","b1","b2","b3"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{0%{%100transform:rotateY(90deg) translateX(2000px);opacity:1;}100%{%100transform: translateX(0px) rotateY(0deg);opacity:1;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background:"+this.transinbackground+" -"+left+"px -"+top+"px;opacity:0;position:absolute;width:"+mywidth+"px;height:"+myheight+"px;top:"+top+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;%100transform:rotateY(360deg);")+"z-index:-1;");
			 __api(this.transintarget).getBg().appendChild(slices);
		}
		
		this.normalizeAfter("1s","1300");
}
panelAnimation.bubbles3x3 = function(){
//better if use showpane = false
		var matrix =[["1","2","3","1","2","3","1","2","3"],
					 ["1","1","1","2","2","2","3","3","3"],
					 ["500","900","1300","1200","800","1000","700","1100","600"],
					 ["t1","t2","t3","m1","m2","m3","b1","b2","b3"],
					 ["#0099CC","#84FF43","#E75957","#E757CD","#7157E7","#57E7A9","#E3E757","#E77157","#57E7AD"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height) / 3;
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 9;count++){
			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{0%{%100transform:translateY(1000px) translateZ(200px);background:"+matrix[4][count]+";opacity:1;display:block;border-radius:50%;width:100px;height:100px;}70%{%100transform:translateY(-100px) translateZ(200px);opacity:1;display:block;background:"+matrix[4][count]+";border-radius:50%;width:100px;height:100px;}100%{%100transform:translateY(0px) translateZ(0px);opacity:1;display:block;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background:"+this.transinbackground+" -"+left+"px -"+top+"px;opacity:0;position:absolute;width:"+mywidth+"px;height:"+myheight+"px;top:"+top+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;%100transform:rotateY(360deg);")+"z-index:-1;");
			 __api(this.transintarget).getBg().appendChild(slices);
		}
		
		this.normalizeAfter("1s","1300");
}

panelAnimation.flippage = function(){
	var heights = parseInt(__api(this.transintarget).getSlide().style.height) / 5;
	var width = parseInt(__api(this.transintarget).getSlide().style.width);
	var left = parseInt(__api(this.transintarget).getSlide().style.left);
	var matrix = [["0","1","2","3","4"],["200","300","400","500","600"],["-","","-","","-"]];
	for(var count = 0;count < 5;count++)
	{
		var flips = document.createElement("div");
		var top = parseInt(heights) * parseInt(matrix[0][count]);
		flips.setAttribute("style","position:absolute;opacity:0;left:"+matrix[2][count]+screen.width+"px;background-color:#0099CC;background:"+this.transinbackground+" 0px -"+top+"px;width:"+width+"px;height:"+heights+"px;top:"+top+"px;"+__util.evaluate("%100transform:rotateX(180deg);%100transform-origin:0% 50%;%100animation:flips"+parseInt(matrix[0][count])+" 2500ms "+parseInt(matrix[1][count])+"ms forwards;"));
		__api(this.transintarget).getBg().appendChild(flips);
		var myflip = __util.evaluate("@%100keyframes flips"+parseInt(matrix[0][count])+"{30%{left:0px;%100transform:rotateX(180deg);opacity:1;}80%{opacity:1;left:0px;%100transform:rotateX(180deg);}100%{opacity:1;left:0px;%100transform:rotateX(0deg);}}");
		this.$.mySheet("inertia-panelsheet").myNewRule(myflip);
	}
	
	this.normalizeAfter("2500ms","600");
}

panelAnimation.column1_3x1 = function(){
//better if use showpane = false
		var matrix =[["1","2","3"],["1","1","1"],["500","900","1300"],["t1","t2","t3"],["-","","-"]];
		var mywidth = parseInt(__api(this.transintarget).getSlide().style.width) / 3;
		var myheight = parseInt(__api(this.transintarget).getSlide().style.height);
		var mytop = parseInt(__api(this.transintarget).getSlide().style.top);
		var myleft = parseInt(__api(this.transintarget).getSlide().style.left);
		for(var count=0;count < 3;count++){
			var top = (parseInt(matrix[1][count]) - 1) * myheight;
			var left = (parseInt(matrix[0][count]) - 1) * mywidth;
			var slices = document.createElement("div");
			slices.setAttribute("id",matrix[3][count]);
			slices.setAttribute("style","background:"+this.transinbackground+" -"+left+"px -"+top+"px;position:absolute;width:"+mywidth+"px;height:"+myheight+"px;top:"+matrix[4][count]+parseInt((screen.height))+"px;left:"+left+"px;"+__util.evaluate("%100animation:"+matrix[3][count]+" 1s "+parseInt(matrix[2][count])+"ms forwards;")+"z-index:-1;opacity:0;");

			var myanimate = __util.evaluate("@%100keyframes "+matrix[3][count]+"{100%{top:"+top+"px;opacity:1;}}");
			this.$.mySheet("inertia-panelsheet").myNewRule(myanimate);
			__api(this.transintarget).getBg().appendChild(slices); //important
		}
		
		this.normalizeAfter("1s","1300");
	
}
panelAnimation.circular = function(){
		//simple 1...
		//create your object..just like html
		var mycircle = document.createElement("div");
		mycircle.setAttribute("style","position:absolute;width:0%;height:0%;margin:50%;"+__util.evaluate("%100animation:circleAnimate 1s 1s forwards;")+"background:"+this.transinbackground+";background-position:center;opacity:1;border-radius:50%;");
		__api(this.transintarget).getBg().appendChild(mycircle);
		
		//create animation
		var myanimation = __util.evaluate("@%100keyframes circleAnimate{100%{opacity:1;width:100%;height:100%;margin:0%;border-radius:0%;}}");
		//inject animation to our temporary section
		this.$.mySheet("inertia-panelsheet").myNewRule(myanimation);
		
		this.normalizeAfter("1s","1s");
	
}
panelAnimation.flowfrombelow = function(){
		//simple 1...
		//create your object..just like html
		var mycircle = document.createElement("div");
		mycircle.setAttribute("style","position:absolute;margin:100% 50% 0% 50%;width:0%;height:0%;bottom:0px;"+__util.evaluate("%100animation:flowbelow 1s 1s forwards;")+"background:"+this.transinbackground+";background-position:center;opacity:1;border-top:solid #0099CC 10px;");
		__api(this.transintarget).getBg().appendChild(mycircle);
		
		//create animation
		var myanimation = __util.evaluate("@%100keyframes flowbelow{50%{opacity:1;width:100%;height:0%;margin:0%;border-top:solid #0099CC 10px;}99%{border-top:solid #0099CC 10px;}100%{opacity:1;width:100%;height:100%;margin:0%;border-top:none;}}");
		//inject animation to our temporary section
		this.$.mySheet("inertia-panelsheet").myNewRule(myanimation);
		
		this.normalizeAfter("1s","1s");
}



