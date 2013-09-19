/*************************************************************
*	Software 			: 		Inertia OpenSlide Library
*	Created by 			: 		Jim-Bert Amante
*	Licenced under			: 		MIT
*	Copyright			:		2013
*
**************************************************************/

/*************************************************************
 * hi! this is my first open-source software so please
 * bear with it...i know their are bugs and a lot
 * of rooms for improvements but dont worry...this is a
 * working beta version and it is easy to use because
 * (by default) it is packed with transitions/effects that
 * you can use. And if you like to create a plugin..just use
 * the format in inertia.effects.js file.
 *************************************************************/

/*************************************************************
 *
 * Special thanks to my gf for inspiration :-)
 *
 *************************************************************/
// aha! you are interested on how this software work!
// thats...cool? hehe..
var inertiaObject = {
			// enumerate all the tags needed
			tags : ["header","presentation-view","body","slide"],
			//global for animations of child elements
			animatestart : 0, 
			//global variable for highlighting
			highlight : false, 
			//global variable for zooming
			zoomed : false, 
			//scaling to normal
			scale : 1,
			//global for counting the sequence of animation
			mycurrentselection : 0,
			//global for determining the current slide number
			myslidenumber : 0, 
			//globar variable of this.mysize
			currentAnimationSize : 0,
			//global to contains interval of timeouts
			transitionInterval : null,
			//global that contain setTimeout of slidetransition to avoid collision
			animationSlideRemoval : null,
			//global to avoid slide placing over the active slide
			reStacker : null,
			//global for triggering autoplayer
			autoPlayer : null,
			
			showTool : false

	},
	
	// initialize globar inertia
	inertia = function(){},
	
	// initialize inertia tool..the black transluscent thing you can use
	// to navigate inside the presentation
	inertiaTool = function()
	{	
		// we need to inject some html
		var tool = ["<div id='toolbar'>",
					"<div id='mystatus'></div>",
					"<select id='slide-number'><option value='select'>Select Slide</option></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
					"<input type='button' id='inertia-go' onclick='goSlide()' value='go'>",
					"<button id='inertia-prev'>Prev</button>",
					"<button id='inertia-next'>Next</button>",
				    "</div>"].join("");
		var htm = __util.Tget(inertiaObject.tags[2]);
		htm[0].innerHTML += tool;
		__util.get("#toolbar").style.opacity = "0";
	},
	
	// this thing handles the navigation from one slide to another
	goSlide = function(){
		var myslidenumer 		= 		document.URL;
		var curr 				= 		myslidenumer.split("#");
		var currentSlide 		= 		curr[1];
		var mytool 				= 		__util.get("#slide-number").value;
		
		
		if(currentSlide == mytool){
			alert("You are there!");
		}else if(mytool == "select"){
			alert("Please select slide!");
		}else{
			window.location = "#" + mytool;
			jumpTo(parseInt(currentSlide),parseInt(mytool));
		}
	},
	canvasConfig = function(){
		/**************************************************
		 *user can override 
		 * this.canvasWide is the width of panel while
		 * this.canvasHeight is the height of panel
		 **************************************************/
		this.canvasWide			=			900;
		this.canvasHeight		=			600;
		
		//DO NOT OVERRIDE THIS SETTINGS
		this.canvasId			=			'mymaincanvas';
		this.screenWide			=			screen.width;
		this.screenHeight		=			screen.height;
		this.calculatePositionX =			0;
		this.calculatePositionY =			0;
	},
	getTitle = function(parent)
	{
		var parentSlide = __util.Tget(inertiaObject.tags[3]);
		if(typeof parentSlide[parent] != "undefined")
		{
			var header = parentSlide[parent].getElementsByTagName(inertiaObject.tags[0]);
		}else{
			var header = ["false"];
		}
		
		if(header[0])
		{
			document.title = header[0].innerHTML;
		}else
		{
			var firstChild = parentSlide[parent].getElementsByClassName("resources");
			
			if(typeof firstChild[0] != "undefined")
			{
				document.title = firstChild[0].innerHTML;
			}else
			{
			document.title = "Slide "+parent;
			}
		}
	},
	setStat = function(select)
	{
		var statusObj = __util.get("#mystatus");
		statusObj.style.display = "inline-block";
		statusObj.style.marginRight = "5px";
		statusObj.innerHTML = select+ "/" + (__util.Tget(inertiaObject.tags[3]).length - 1);
	},
	navigateNext = function(myprev,mynext)
		{
			if(mynext < inertiaObject.myslidenumber){
				var childs = new checkchild(myprev);
				var returnkey = childs.animateChild();
				if(returnkey == 1){	
					
					var trans 					= 			new mytransition(myprev,mynext);
					var transit 				= 			trans.checktrans();
					
					//preload resources of the next slide
					var myinitializeResources 	=		 	new initializeResources();
					myinitializeResources.load(mynext);
					
					var checkImages = new checkimage();
					checkImages.init(mynext,parseInt(mynext) - 1);
					
					
					inertiaObject.mycurrentselection = mynext;
					window.location = "#" + mynext;
					
				}
			}else{
				alert("End of Slide. Thank you!");
			}
		},
	navigatePrev = function(myprev,mynext)
		{
			if(myprev > 0){
					var trans 							= 			new mytransition(myprev,mynext);
					var transit 						= 			trans.checktrans();
					
					//preload resources
					var myinitializeResources			=		 	new initializeResources();
					myinitializeResources.load(mynext);
					
					//check if theres an image to display at the backrground
					var checkImages = new checkimage();
					checkImages.init(parseInt(myprev) - 1,myprev);
					
					inertiaObject.mycurrentselection = mynext;
					window.location = "#" + mynext;
			}	
			
	},
	jumpTo = function(myprev,mynext)
	{
			var trans 					= 			new mytransition(myprev,mynext);
			var transit 				= 			trans.checktrans();
			
			//preload resources of the next slide
			var myinitializeResources 	=		 	new initializeResources();
			myinitializeResources.load(mynext);
			
			
			var checkImages = new checkimage();
			checkImages.init(mynext,myprev);
			inertiaObject.mycurrentselection = mynext;
			window.location = "#" + mynext;
	},
	checkAutoPlay = function(target,execution){
			//stable as of alpha 1.2.3
			//check for childrens first
			//get the current slide using the __util.Tget function
			this.myparent = __util.Tget(inertiaObject.tags[3])[target];
			//get all the resources child of the current slide
			//whic is the resources
			this.mychild = this.myparent.getElementsByClassName("resources");
			
			for(var count = 0; count < this.mychild.length; count++)
			{
				if(this.mychild[count].getAttribute('animatesequence') == execution){
					var ifautoplay = this.mychild[count].getAttribute('autoplay')
					if(ifautoplay !== undefined && ifautoplay !== null){
							console.log("186 "+ifautoplay);
							var interval = __util.pTime(ifautoplay,"0s");
							
							inertiaObject.autoPlayer = setTimeout(function(){
								
								//using cleartimeout works but there are time that 
								//when the user press arrow keys fast...mycurrentselection
								//and current slide [target] is not the same
								// resulting to calling next next slide
								if(inertiaObject.mycurrentselection == target){
									// increment 1
									var myNextRes = parseInt(target) + 1;
									//and move next! :-)
									navigateNext(target,myNextRes);
									
								}else{
									console.log("warning : too much keypress results to slide collition [fixed]");
								}
									
									//check for transition
									if(inertiaObject.currentAnimationSize == inertiaObject.animatestart)
									{
										var myNext = parseInt(target) + 1;
										var myNextParent = __util.Tget(inertiaObject.tags[3])[myNext];
										var parentAuto = myNextParent.getAttribute("autoplay");
										
										if(parentAuto !== undefined && parentAuto !== null){
											console.log("203 "+parentAuto);
											slideInterval = __util.pTime(parentAuto,"0s");
											
											inertiaObject.autoPlayer = setTimeout(function(){
													navigateNext(target,myNext);
											},slideInterval);
										}else{
											console.log("no next transition");
										}
									}
								},interval);
								
					}else{
							//alert("wala na");
					}
				}
			}
		//	var listChild = myparent.getElementsBy
	},insertEndSlide = function(){
			var parent		=		__util.Tget(inertiaObject.tags[1])[0];
			var end			=		document.createElement("slide");
			end.innerHTML	=		"<div style='color:#FFF;font-family:arial;text-align:center'>End of Presentation</div><div class='backgroundImage inertia-ending-slide' imgsrc='./backgrounds/b.jpg' imgin='fadeinout'></div>";
			end.setAttribute("showpane","false");
			parent.appendChild(end);
	
	};

window.onload = function()
{
	//inject the toolbar --> press 't' to show
	inertiaTool();
	//insert end slide
	insertEndSlide();
	//initialize the canvas
	var canvas = new canvasConfig();
	canvas.canvasInit(); 
	canvas.aspectRatio();
	canvas.initializeCSS();
	
	var engine = new inertia();
	engine.load();
		
	var zoomElem = new inertiaZoom();
	zoomElem.init();
	
};

window.onresize = function(){
	var canvas = new canvasConfig();
	canvas.aspectRatio();
};

canvasConfig.prototype = {
	canvasInit : function()
	{	
	
		this.calculatePositionX			=		(this.screenWide - this.canvasWide) / 2;
		this.calculatePositionY			=		(this.screenHeight - this.canvasHeight) / 2;
		var mycanvas					=		__util.Tget(inertiaObject.tags[3]);
		inertiaObject.myslidenumber		=		mycanvas.length;
		simulate3d();
		for(var starter = 0; starter < mycanvas.length;starter++){
			mycanvas[starter].style.height		=		this.canvasHeight+"px";
			mycanvas[starter].style.width		=		this.canvasWide+"px";
			mycanvas[starter].style.boxShadow	=		"0px 2px 15px #000";
			mycanvas[starter].style.position	=		"fixed";
			mycanvas[starter].style.zIndex		=		"-10";
			mycanvas[starter].style.opacity		= 		"0";
			mycanvas[starter].style.display		=		"none";
			__x(mycanvas[starter],"perspective","1200px");
			
			var bg = document.createElement("slide-background");
				bg.style.position = "absolute";
				bg.style.top = "0px";
				bg.style.left = "0px";
				bg.style.zIndex = "-10";
				bg.style.width = this.canvasWide+"px";
				bg.style.height = this.canvasHeight+"px";
				__x(bg,"perspective","1200px");
			mycanvas[starter].appendChild(bg);
		}

		for(var counter = 0; counter < mycanvas.length;counter++){
			var myslides = __util.get("#slide-number");
			myslides.innerHTML += "<option value='"+counter+"'>"+counter+"</option>";
		}

		
		
	},
	aspectRatio : function()
	{
			var mytarget = __util.Tget(inertiaObject.tags[3]);
			
			for(var start = 0; start < mytarget.length;start++){
				
				var myheight = this.canvasHeight;
				var mywidth = this.canvasWide;
				var windowheight = parseInt(window.innerHeight);
				var windowwidth = parseInt(window.innerWidth);
				
				var mytop = (windowheight / 2) - (this.canvasHeight / 2);
				var myleft = (windowwidth / 2) - (this.canvasWide / 2);
				//globals
				myDefaultLeft = myleft;
				myDefaultTop = mytop;
				
				mytarget[start].style.position = "fixed";
				mytarget[start].style.top = mytop+"px";
				mytarget[start].style.left = myleft+"px";
				mytarget[start].style.transform = ""; //reset transform
				if(windowheight < myheight && windowwidth > mywidth){
					var minus = myheight - windowheight;
					var calc = (myheight - minus) / myheight;
					mytarget[start].style.transform = "scale("+calc+")";
					mytarget[start].style.webkitTransform = "scale("+calc+")";
					inertiaObject.scale = calc;
				}
				if(windowwidth < mywidth && windowheight > myheight){
					var minus = mywidth - windowwidth;
					var calc = (mywidth - minus) / mywidth;
					mytarget[start].style.transform = "scale("+calc+")";
					mytarget[start].style.webkitTransform = "scale("+calc+")";
					inertiaObject.scale = calc;
				}
				
				if(windowwidth < mywidth && windowheight < myheight){
					var diff1 = mywidth - windowwidth;
					var diff2 = myheight - windowheight;
					
					if(diff1 > diff2){
						var minus = mywidth - windowwidth;
						var calc = (mywidth - minus) / mywidth;
						mytarget[start].style.transform = "scale("+calc+")";
						mytarget[start].style.webkitTransform = "scale("+calc+")";
						inertiaObject.scale = calc;
					}else{
						var minus = myheight - windowheight;
						var calc = (myheight - minus) / myheight;
						mytarget[start].style.transform = "scale("+calc+")";
						mytarget[start].style.webkitTransform = "scale("+calc+")";
						inertiaObject.scale = calc;
					}
				}
				
				if(windowwidth > mywidth && windowheight > myheight){
					mytarget[start].style.transform = "scale(1)";
					mytarget[start].style.webkitTransform = "scale(1)";
					inertiaObject.scale = 1;
				}
			}
	},
	initializeCSS : function()
	{
		
		var style = new stylesheet();
		style.checkSheet("inertia-stylesheet");
		style.checkSheet("inertia-zoomsheet");
		style.checkSheet("inertia-panelsheet");
		style.checkSheet("inertia-bgsheet");
		style.checkSheet("inertia-highlightsheet");
	}
};

inertia.prototype = {
	load : function(){
		
			// i use the url to determine the current slide,
			// this is helpful when the user refresh the page.
			var myslidenumer 		= 		document.URL;
			var newslider 			= 		myslidenumer.split("#");
			
			inertiaObject.mycurrentselection	= 		newslider[1] != undefined ? newslider[1] : setTimeout(function(){window.location = document.URL + "#0";},1000);
			
			var mycanvasProp 		= 		new	canvasConfig();
			var myscreenheight		=		mycanvasProp.screenHeight;
			var myscreenwidth		=		mycanvasProp.screenWide;
			
			//preload resources
			var myinitializeResources = new initializeResources();
			myinitializeResources.load(inertiaObject.mycurrentselection);
			
			//get the number of slides inside our presentation
			var mycanvases		=		__util.Tget(inertiaObject.tags[3]);
			var end				=		mycanvases.length;
			
						
			//preload first slides
			var firstexec = new execTrans((parseInt(inertiaObject.mycurrentselection) - 1),inertiaObject.mycurrentselection);
			firstexec["transfadein"]();
			
			var __panelAnimation = new __slideAnimation();
			__panelAnimation.animate(inertiaObject.mycurrentselection,0);
			
			getTitle(inertiaObject.mycurrentselection);
			setStat(inertiaObject.mycurrentselection);
			
			//check for any autoplay
			checkAutoPlay(inertiaObject.mycurrentselection,inertiaObject.animatestart);
			//end preload
			/**initialize structures of slides :
			 * this analyze the markup of each element: sizes, width,
			 * height, top, left etc.
			 **/
			 
			//initialize properties of all background images if any
			for(var myimg = 0;myimg < end;myimg++){
				var mycanvas = __util.Tget(inertiaObject.tags[3]);
				var images = mycanvas[myimg].getElementsByClassName('backgroundImage');
				for(var count = 0; count < images.length;count++){
					var mysrc = images[count].getAttribute('imgsrc');
					//start image
					var myappend = __util.Tget(inertiaObject.tags[2])[0];
					var myimgdiv = document.createElement('div');
					myimgdiv.setAttribute('class','mybg');
					myimgdiv.setAttribute('id','mybg'+myimg);
					myimgdiv.setAttribute('style',['height:',myscreenheight,'px;',
												  'width:100%;',
												  'min-width:100%;',
												  'background-image:url("',mysrc,'");',
												  'background-size:cover;',
												  'z-index:-1;',
												  'position:fixed;',
												  'display:none;',
												  'top:0px;left:0px;'].join(""));
					myappend.appendChild(myimgdiv);
				}
			}
			
			//for bg images
			var checkImages 	= 		new checkimage();
			checkImages.init(inertiaObject.mycurrentselection);
			
			//initialize properties of canvases
			for(var mycanvas = 0;mycanvas < end;mycanvas++){
				
				var myinitialclass = mycanvases[mycanvas];
				
				if(mycanvases[mycanvas].getAttribute("showpane") == 'false'){
					myinitialclass.style.background = "transparent";
					myinitialclass.style.boxShadow = "none";
					
				}

			}
			
			window.addEventListener("keyup",function(e){
				if(e.keyCode == 39){
					__util.xTime();
					inertiaObject.autoPlayer = null;
					navigateNext(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) + 1);
				}else if(e.keyCode == 37){
					__util.xTime();
					navigatePrev(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) - 1);
				}else if(e.keyCode == 72){
					var myhighlight = new inertia();
					myhighlight.load.highlight();
				}else if(e.keyCode == 84){
					__util.tool();
				}else{
					
				}
			},false);
			
			__util.get('#inertia-next').addEventListener("click",function(){
				__util.xTime();
				navigateNext(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) + 1);
			},false);
			
			__util.get('#inertia-prev').addEventListener("click",function(){
				__util.xTime();
				navigatePrev(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) - 1);
			},false);
			
			__util.Tget(inertiaObject.tags[2])[0].addEventListener("touchstart",function(evt){
				__util.xTime();
				touchStartX = evt.touches[0].pageX;
			},false);
			
			__util.Tget(inertiaObject.tags[2])[0].addEventListener("touchmove",function(evt){
				__util.xTime();
				touchEndX = evt.touches[0].pageX;
			},false);
			
			__util.Tget(inertiaObject.tags[2])[0].ontouchend = function(){
				var direction = parseInt(touchStartX) - parseInt(touchEndX);
				
				if(direction > 0)
				{
					navigateNext(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) + 1);
				}else
				{
					navigatePrev(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) - 1);
				}
			}
		
	}
};

inertia.prototype.load.highlight = function()
{

	var initializeHighlight = __util.Tget(inertiaObject.tags[3]);
	var childResource = initializeHighlight[inertiaObject.mycurrentselection].getElementsByClassName("resources");
	for(var count =0; count < childResource.length; count++){
		
		var ifhl = childResource[count].getAttribute("highlight");
		var mysheet = new stylesheet();
		var myrule = __util.evaluate("@%100keyframes highlight{0%{opacity:1;}100%{opacity:0.2;}}@%100keyframes unhighlight{0%{opacity:0.2;}100%{opacity:1;}}");
		var sheet = mysheet.checkSheet("inertia-highlightsheet");
		sheet.innerHTML += myrule;
		
		if(ifhl != null && ifhl != 'false' && ifhl != ''){
		
		}else{
		
			
			if(inertiaObject.highlight){
			console.log("yes!");
				__x(childResource[count],"animationName","unhighlight");
				__x(childResource[count],"animationDuration","1s");
				__x(childResource[count],"animationFillMode","forwards");
			}else{
			console.log("not yet");
				__x(childResource[count],"animationName","highlight");
				__x(childResource[count],"animationDuration","1s");
				__x(childResource[count],"animationFillMode","forwards");
			}
		
		}
	}
	if(inertiaObject.highlight){
	inertiaObject.highlight = false;
	}else{
	inertiaObject.highlight = true;
	}
};

var __util = {
	get : function(selector)
	{
		try
		{
			var select = document.querySelector(selector.toString());
			return select;
		}catch(err)
		{
			if(selector.match(/#/g) == "#")
			{
			var newselector = selector.split("#");
			var select = document.getElementById(newselector[1]);
			return select;
			}else
			{
			var newselector = selector.trim(".");
			var select = document.getElementsByClassName(newselector);
			return select;
			}
		}
	},
	Tget : function(selector)
	{
		var select = document.getElementsByTagName(selector);
		return select
	},
	xTime : function()
	{

		window.clearTimeout(inertiaObject.autoPlayer);
		window.clearTimeout(inertiaObject.animationSlideRemoval);  // <==test
		window.clearTimeout(inertiaObject.reStacker);  // <==test
		

	},
	pTime : function(myinterval,mydelay){
		var intrv = 0;
		var delay = 0;
		if(myinterval.match(/ms/g) == "ms"){
			intrv = parseInt(myinterval);
		}else if(myinterval.match(/s/g) == "s"){
			intrv = parseInt(myinterval) * 1000;
		}else{
			intrv = 0;
		}
		if(mydelay.match(/ms/g) == "ms"){
			delay = parseInt(mydelay);
		}else if(mydelay.match(/s/g) == "s"){
			delay = parseInt(mydelay) * 1000;
		}else{
			delay = 0;
		}
		
		return parseInt(intrv) + parseInt(delay);
	},
	/*******************************************************************
	 *  THIS FUNCTION HANDLES THE STATE OF SLIDE AS WELL AS
	 *  CLEANING PREVIOUSLY USED STYLESHEETS.
	 *  BASICALLY WHEN A FUNCTION CLEANED A CSS RULE, THE ANIMATING
	 *  SLIDE WAS AFFECTED. SO IN ORDER TO CLEAN THE SLIDE WE HAVE TO:
	 * ****************************************************************/
	reStack : function(target,interval) //GET ALLOTED TIME FOR A TRANSITION
										 //FINISH
	{
		inertiaObject.reStacker = setTimeout(function(){ //SET A TIMEOUT 
			var parents = __util.Tget(inertiaObject.tags[3]); //YEAH..A LOT OF 
			for(var count =0; count < parents.length;count++) // JS CODES
			{
				if(count !=target){
					parents[count].style.display = "none";  //SO HERE IT IS, TO AVOID BLOCKING
					parents[count].style.opacity = "0"; 	//OF ELEMENTS, WE MUST MAKE SURE THAT
					parents[count].style.zIndex = "-10";	//INACTIVE SLIDE IS -10 INDEX, AND TRANSPARENT
				}else{
					parents[count].style.display = "block"; //AND THE ACTIVE SLIDE
					parents[count].style.opacity = "1";		//IS OF COURSE TAY IN FOCUS
					parents[count].style.zIndex = "10";		
					document.getElementById("inertia-stylesheet").innerHTML = ""; // AND WE CLEAN CSS RULES
					document.getElementById("inertia-bgsheet").innerHTML = ""; // AND WE CLEAN CSS RULES
				}
			}
		},interval); //POOOOFFF!!!
		
	},
	tool : function(){
		if(inertiaObject.showTool){
			__util.get("#toolbar").style.opacity = "0";
			inertiaObject.showTool = false;
		}else{
			__util.get("#toolbar").style.opacity = "1";
			inertiaObject.showTool = true;
			
		}
	},
	evaluate : function(toEval)
	{
		var pref = ["","-webkit-","-moz-","-o-","-ms-"];
		
		var w3c = toEval.replace(/%100/g,pref[0]);
		var crx = toEval.replace(/%100/g,pref[1]);;
		var moz = toEval.replace(/%100/g,pref[2]);;
		var o = toEval.replace(/%100/g,pref[3]);;
		var ms = toEval.replace(/%100/g,pref[4]);;
		
		return w3c + crx + moz + o+ms;

	}
}


/**
 * this portion checks the presence
 * of animation for each slides.
 * */
var resetObjects = function(){
	inertiaObject.animatestart = 0;
	inertiaObject.highlight = false;
	inertiaObject.zoomed = false;
}

var resetAnimations = function(target){
	__x(target,"animationName","");
	__x(target,"animationDuration","");
	__x(target,"animationDelay","");
	__x(target,"animationFillMode","");
}

var mytransition = function(select,mynext){
	try{
		this.myElem = __util.Tget(inertiaObject.tags[3]);
		this.mytrans = this.myElem[mynext].getAttribute('transition');
		if(this.mytrans == undefined){
			this.mytrans = "transfadeout";
		}else{
			this.mytrans = this.mytrans;
		}
		this.selection = select;
		this.next = mynext;
	}catch(err){
		console.log(err + " ");	
	}
	
	this.checktrans = function(){
		var executeOut = new execTrans(this.selection,this.next);
		executeOut[this.mytrans]();
		getTitle(this.next);
		setStat(this.next);
		
		//look for the first resource with animation
		//set all variables first before another function reset the data needed
		this.myinterval = inertiaObject.transitionInterval;
		var nextTarget = this.next;
		var nextRes = inertiaObject.animatestart + 1;
		
		setTimeout(function(){
			checkAutoPlay(nextTarget,nextRes);
			//__emptyBg(select);
			//alert("yeah");
		},this.myinterval);
	}
	
	
};


/**
 * this will trigger the effects and execute on the given
 * target, this is helpful also in extending the effect.
 * 
 * */ 

var execTrans = function(mytarget,mynextTarget){
	
	this.transouttarget = mytarget == -1 || mytarget == null ? false : mytarget;
	
	this.transintarget = mynextTarget;
	
	this.$ = new __animationSheets();
	
	resetObjects(); 
};

var execAnimate = function(mytarget,background){
	
	this.transintarget = mytarget;
	this.transinbackground = background != '' ? background : "#FFF";
	
	this.$ = new __animationSheets();
	
};

var inertiaZoom = function(){};

inertiaZoom.prototype.init = function()
{

	var parentZoom = __util.Tget(inertiaObject.tags[3]);
		for(var count = 0;count < parentZoom.length;count++)
		{
		var childZoom = parentZoom[count].getElementsByClassName("resources");

		for(var zcount = 0;zcount < childZoom.length;zcount++)
		{
			var inertiaZ = new inertiaZoom();
			inertiaZ.zoomify(childZoom[zcount], parentZoom[count]);
		}
	}
}

inertiaZoom.prototype.zoomify = function(targetChild, targetParent){
	//here
	var canZoom = targetChild.getAttribute("zoom");
	if(canZoom){
		targetChild.addEventListener("click",function(evt){
			var mh = targetChild.clientHeight,
				mw = targetChild.clientWidth,
				myh = mh / 2,
				myw = mw / 2,
				scrh = screen.height / 2,
				scrw = screen.width / 2,
				mot = targetChild.offsetTop + targetParent.offsetTop,
				mol = targetChild.offsetLeft + targetParent.offsetLeft,
				mycenterpointH = (scrh - myh) - mot,
				mycenterpointW = (scrw - myw) - mol,
				myscale = inertiaObject.scale,
				zoomed = false;
				
			resetAnimations(targetParent);
				
			if(mw > mh)
			{
			var compute = window.innerWidth - (scrw - myw);
			}else if(mw < mh)
			{
			var compute = window.innerHeight - (scrh - myh);
			}
			//for 3d zooming 
					var zoomer = ["@%100keyframes zoomed{0%{opacity:1;%100transform:scale(",myscale,") translateY(0px) translateX(0px) translateZ(0px);}100%{opacity:1;%100transform:translateY(",mycenterpointH,"px) translateX(",mycenterpointW,"px) translateZ(",compute,"px) scale(",myscale,");}}",
								 "@%100keyframes zoomedout{0%{opacity:1;%100transform:translateY(",mycenterpointH,"px) translateX(",mycenterpointW,"px) translateZ(",compute,"px);}100%{opacity:1;%100transform:translateY(0px) translateX(0px) translateZ(0px) scale(",myscale,");}}"].join("");
					zoomer = __util.evaluate(zoomer);
					var zoomSheet = new stylesheet();
					var zSheet = zoomSheet.checkSheet("inertia-zoomsheet");
					zSheet.innerHTML += zoomer;
					
						if(inertiaObject.zoomed == true){
							__x(targetParent,"animationName","zoomedout");
							__x(targetParent,"animationDuration","1s");
							__x(targetParent,"animationFillMode","forwards");
							setTimeout(function(){
								inertiaObject.zoomed = false;
							},1000);
						}else{
							__x(targetParent,"animationName","zoomed");
							__x(targetParent,"animationDuration","1s");
							__x(targetParent,"animationFillMode","forwards");
								targetParent.style.opacity = "1";
							inertiaObject.zoomed = true;
						}
					
		
		},false);
		
	}
	//here
}


var animation = function(){
	
	this.name = null;
	this.duration = "0s";
	this.delay = "0s";
	this.fillMode = "";
	this.state = "running";
}

		
animation.prototype.start = function(targetAnimation)
{
	
	__x(targetAnimation,"animationPlayState",this.state);
	__x(targetAnimation,"animationName",this.name);
	__x(targetAnimation,"animationDuration",this.duration);
	__x(targetAnimation,"animationFillMode",this.fillMode);
	__x(targetAnimation,"animationDelay",this.delay);	
}


var checkchild = function(parent){
	this.canvaselement 		= 		parent;
	this.myparentCanvas 	= 		__util.Tget(inertiaObject.tags[3]);
	this.mychild 			= 		this.myparentCanvas[parent].getElementsByClassName("animate");
	this.mychildLen 		= 		this.mychild.length;
	var canvases 			= 		this.canvaselement;
	var myarrayElement 		= 		new Array();
	
	for(var count=0;count < this.mychildLen;count++){
		//get some necessary data
		var mysequence = this.mychild[count].getAttribute("animatesequence");
		myarrayElement = myarrayElement.concat(mysequence);
		
		//resetAnimations(this.mychild[count]);  //removed in 1.2.3

	}
	
	var compareNumbers = function(a,b) {
	return a - b;
	}
	var arraySize = this.mychildLen - 1;
	var last = myarrayElement.sort(this.compareNumbers);
	if(last[arraySize]==undefined){
		inertiaObject.currentAnimationSize = 0;
	}else{
		inertiaObject.currentAnimationSize = parseInt(last[arraySize]) + 1;
	}
};

checkchild.prototype.animateChild = function()
	{
		for(var count=0;count < this.mychildLen;count++)
		{
				if(this.mychild[count].getAttribute('animatesequence') == inertiaObject.animatestart)
				{
					var myid			=			this.mychild[count].getAttribute('id');
					var myanimation		=			this.mychild[count].getAttribute('animatein'); //here
					var looping			=			this.mychild[count].getAttribute('animateloop');
					var mychildAnimate 	=			new childAnimation(myid);
					mychildAnimate[myanimation]();
					
					if(looping == 'undefined' || looping == null || looping == '')
					{
					//do nothing
					}else
					{
					setTimeout(function(){
						var mychildAnimateLoop = new childAnimationLoop(myid);;
						mychildAnimateLoop[looping]();
					},1000);
					}
					
					if(this.mychild[count - 1]){
							var animateoutid = this.mychild[count-1].getAttribute("id");
							var myanimateout = this.mychild[count-1].getAttribute("animateout");
							
							if(myanimateout != null)
							{
								var mychildAnimateOut 	=	new childAnimation(animateoutid);
								mychildAnimateOut[myanimateout]();
							}
					}
				}
				
				if(this.mychild[count].getAttribute('animatesequence') == inertiaObject.animatestart + 1){
					checkAutoPlay(this.canvaselement,inertiaObject.animatestart + 1);
				}
	
		}
		if(inertiaObject.animatestart == inertiaObject.currentAnimationSize){
		//make animatestart back to zero so that the next cnvas will
		//implement what it did to the first
		inertiaObject.animatestart = 0;
		//resturn the flag!
		return 1;
		}
		//increment animatestart...i dont know why, but i have a feeling that it is necessary.
		inertiaObject.animatestart += 1;
	},
	//WATCH THIS!!
checkchild.prototype.animateCheck = function()
{
	if(inertiaObject.animatestart == inertiaObject.currentAnimationSize){
	//make animatestart back to zero so that the next cnvas will
	//implement what it did to the first
	inertiaObject.animatestart = 0;
	//resturn the flag!
	return 1;
	}
}


/***********************************************************************
 * 
 * this function will check the animation,
 * extending the animation :
 * 
 * childAnimation.prototype = {
 *		animationName : function(){
 * 			
 * 		}
 *  }
 * 
 ***********************************************************************/

var childAnimation = function(mytarget)
{
	this.childIndex			=		mytarget;
	this.mytargetchild		=		__util.get("#"+this.childIndex);
	this.elemAnimate		=		this.mytargetchild;

	this.$ = new __animationSheets();
	

		
};



var childAnimationLoop = function(mytarget)
{
	this.childIndex			=		mytarget;
	this.mytargetchild		=		__util.get("#"+this.childIndex);
	this.elemAnimate		=		this.mytargetchild;
	this.$ = new __animationSheets();
	
}


/****************************************************************
 * this function for checking the presence of
 * animation in background images
 * **************************************************************/

var checkimage = function(){};
checkimage.prototype.init = function(target,prev)
{
		var myprev = prev;
		var mycanvas = __util.Tget(inertiaObject.tags[3]);
	if(mycanvas[target])
	{
		if(mycanvas[target].getElementsByClassName("backgroundImage")[0]){
			try{ var animatein = mycanvas[target].getElementsByClassName("backgroundImage")[0].getAttribute("imgin") }catch(err){ var animatein = undefined; }
			if(animatein != undefined){
					var mybgin = new checkBgAnim("mybg"+target,"mybg"+prev);
					mybgin[animatein]();
					
			}else{
					var mybgin = new checkBgAnim("mybg"+target,"mybg"+prev);
					mybgin["fadeinout"]();
			}
		}else{
			try{ var previmage = mycanvas[prev].getElementsByClassName("backgroundImage")[0]; }catch(e){ var previmage = undefined;}
			
			if(previmage != undefined){
					var mybgin = new checkBgAnim("mybg"+target,"mybg"+prev);
					mybgin["fadeinout"]();
			}
		}
	}
	/*
	try{ var animateout = mycanvas[myprev].getElementsByClassName("backgroundImage")[0].getAttribute("imgout") }catch(err){ var animateout = false; }
	if(animateout != false){
			var mybgout = new checkBgAnim("mybg"+myprev);
			mybgout[animateout]();
			
	}
	*/
}

/**this is the start of animation of background,
 * anyone can extend this animation the way they want.
 * just hack!
 * 
 * this one will alert the target image to perform 
 * animation
 * ***************************************************/
var checkBgAnim = function(target,prev)
{
	this.targetin = target;
	this.targetout = prev;
	this.$ = new __animationSheets();
};

/***********************************************************
 *
 * for injecting CSS rule in document
 *
 **********************************************************/



var __animationSheets		=		function(){};
var __newRule				=		function(target){this.id = target;};
var __transition			=		function(){};

__animationSheets.prototype = {
	mySheet : function(stylesheetId)
	{
		var toCheck = stylesheetId;
		
		var style = new stylesheet();
		
		style.checkSheet(toCheck);
		console.log(toCheck);
		return myrule = new __newRule(toCheck);
	}
}

__newRule.prototype = {
	myNewRule : function(appendRule)
	{
		var style = new stylesheet();
		var mysheet = style.checkSheet(this.id); //return the stylesheet
		
		mysheet.innerHTML += appendRule;
		
		return mytransform = new __transition();
	}
}

__transition.prototype = {
	transform : function(objRule)
	{
		var mycanvas = __util.Tget(inertiaObject.tags[3]);
		try{ var outcoming = objRule.outcoming.object; }catch(err){ var outcoming = null; };
		try{ var incoming = objRule.incoming.object; }catch(err){ var incoming = null; };
		
		//var incoming = objRule.incoming.object; 
		
		if(outcoming != null && mycanvas[outcoming] != undefined)
		{
			
			var name = objRule.outcoming.name ? objRule.outcoming.name : console.log("Error! No animation name!");
			var duration = objRule.outcoming.duration ? objRule.outcoming.duration : "0s";
			var delayed = objRule.outcoming.delay ? objRule.outcoming.delay : "0s";
			var fill = objRule.outcoming.fillmode ? objRule.outcoming.fillmode : "forwards";
			
			var inertiaAnimate = new animation();
			inertiaAnimate.name = name;
			inertiaAnimate.duration = duration;
			inertiaAnimate.fillMode = fill;
			inertiaAnimate.delay = delayed;
			inertiaAnimate.start(mycanvas[outcoming]);
			
			var intervalValue = __util.pTime(duration,delayed);
			
			inertiaObject.animationSlideRemoval = setTimeout(function(){
				mycanvas[outcoming].style.display = "none";
				mycanvas[outcoming].style.zIndex = "-10";
			},intervalValue);
			
			
			var __panelAnimation = new __slideAnimation();
			
			__panelAnimation.animate(incoming,intervalValue);
			
			
			
		}
		
		//display is not transitionable
		if(incoming != null && mycanvas[incoming] != undefined)
		{
			var name = objRule.incoming.name ? objRule.incoming.name : console.log("Error! No animation name!");
			var duration = objRule.incoming.duration ? objRule.incoming.duration : "0s";
			var delayed = objRule.incoming.delay ? objRule.incoming.delay : "0s";
			var fill = objRule.incoming.fillmode ? objRule.incoming.fillmode : "forwards";
		
			mycanvas[incoming].style.display = "block";
			mycanvas[incoming].style.zIndex = "10";
			
			var inertiaAnimate = new animation();
			inertiaAnimate.name = name;
			inertiaAnimate.duration = duration;
			inertiaAnimate.fillMode = fill;
			inertiaAnimate.delay = delayed;
			inertiaAnimate.start(mycanvas[incoming]);
			
			var intervalValue = __util.pTime(duration,delayed);
			
			__util.reStack(incoming,intervalValue);
			
		}
	},
	enterRule : function(animate)
	{
		animate.object.style.display = 'block';
		var name = animate.enter ? animate.enter : console.log("Must have animation name!");
		var duration = animate.duration ? animate.duration : "0s";
		var delayed = animate.delay ? animate.delay : "0s";
		var fill = animate.fill ? animate.fill : "forwards";
			
			var inertiaAnimate = new animation();
			inertiaAnimate.name = name;
			inertiaAnimate.duration = duration;
			inertiaAnimate.fillMode = fill;
			inertiaAnimate.delay = delayed;
			inertiaAnimate.start(animate.object);
			
	},
	loopRule : function(myLoop)
	{
	
		if(myLoop.mode == 'once')
		{
			var mymode = 'forwards';
		}else if(myLoop.mode == 'loop')
		{
			var mymode = 'infinite';
		}else{
			var mymode = 'forwards';
		}
		
		var name = myLoop.loop ? myLoop.loop : alert("No animation name");
		var duration = myLoop.duration ? myLoop.duration : "0s";
		var delayed = myLoop.delay ? myLoop.delay : "0s";
		
		__x(myLoop.object,"animation",name+" "+duration+" "+mymode+" "+delayed);
	},
	transformImage : function(objRule)
	{
		try
		{
			var mybgimagein = document.getElementById(objRule.incoming.bg);
			if(mybgimagein != undefined)
			{
				//display is not transitionable
				__x(mybgimagein,"animationPlayState","running");
				__x(mybgimagein,"animationName",objRule.incoming.bgImage);
				__x(mybgimagein,"animationDuration",objRule.incoming.bgDuration);
				__x(mybgimagein,"animationFillMode",'forwards');
				__x(mybgimagein,"animationDelay",objRule.incoming.bgDelay);
				mybgimagein.style.display = 'block';
				mybgimagein.style.opacity = '1';
			}
			var mybgimageout = document.getElementById(objRule.outcoming.bg);
			
			if(mybgimageout != undefined)
			{
				//display is not transitionable
				
				__x(mybgimageout,"animationPlayState","running");
				__x(mybgimageout,"animationName",objRule.outcoming.bgImage);
				__x(mybgimageout,"animationDuration",objRule.outcoming.bgDuration);
				__x(mybgimageout,"animationFillMode",'forwards');
				__x(mybgimageout,"animationDelay",objRule.outcoming.bgDelay);
				
				var myinterval = __util.pTime(objRule.outcoming.bgDuration,objRule.outcoming.bgDelay);
				console.log(myinterval);
				setTimeout(function(){
					mybgimageout.style.display = 'none';
					mybgimageout.style.opacity = '0';
				},myinterval);
			}
			
		}catch(err)
		{
			alert(err);
		}
	}
}

var __slideAnimation = function(){}; //constructor

__slideAnimation.prototype = {
	animate : function(target, duration){
		var mytarget = __util.Tget(inertiaObject.tags[3])[target];
		var panelAnimate = mytarget.getAttribute("animate");
		if(panelAnimate != null && panelAnimate != undefined)
		{
			var ifpanelAnimate = panelAnimate.split(":");
			//check if we have a color
			if(ifpanelAnimate[1] == '' || ifpanelAnimate[1] == undefined){
				mybackground = "#FFF";
			}else{
				mybackground = ifpanelAnimate[1];
			}
			//make transparent background
			__util.Tget(inertiaObject.tags[3])[target].style.background = "transparent";
			__util.Tget(inertiaObject.tags[3])[target].style.border = "solid gray 1px";
			//empty background
			__emptyBg(target,duration);
			//fire event
			setTimeout(function(){
				var myanimate = new execAnimate(target,mybackground);
				myanimate[ifpanelAnimate[0]]();
			},duration);
		}
	}
}

var __emptyBg = function(target,duration){
	setTimeout(function(){
	__util.get("#inertia-panelsheet").innerHTML = "";
	},duration);
	__util.Tget(inertiaObject.tags[3])[target].getElementsByTagName("slide-background")[0].innerHTML = "";	
	
	//
}


/*********************************************************
*
* check if stylesheet is present in the document
*
*********************************************************/
var stylesheet = function(){}; //constructor

stylesheet.prototype.checkSheet = function(myId){
	var test = __util.get("#"+myId);
	if(test == null){
		try{
			var createsheet = document.createElement("style");
			var myappend = __util.Tget(inertiaObject.tags[2])[0];
			createsheet.setAttribute('type','text/css');
			createsheet.setAttribute('rel','stylesheet');
			createsheet.setAttribute('id',myId);
			myappend.appendChild(createsheet);
		}catch(err){
			alert("Style sheet "+err);
		}
	}else{
		return test;
	}
}

/**UPDATE**/
var initializeResources = function(){};

initializeResources.prototype.load = function(mytargetselection){
		//initialize child elements i.e. resources
		var mycanvas = __util.Tget(inertiaObject.tags[3]);
		if(mycanvas[mytargetselection])
		{
			var mycanvasResource = mycanvas[mytargetselection].getElementsByClassName('resources');
			for(var counter = 0;counter < mycanvasResource.length;counter++){
				var inanimate = mycanvasResource[counter].getAttribute("animatein");
				var flow = mycanvasResource[counter].getAttribute("blockflow");
				if(inanimate == undefined || inanimate == ''){
					//do nothing
				}else{
					 mycanvasResource[counter].style.display = 'none';
					 if(flow){
					 //do nothing
					 }else{
					 mycanvasResource[counter].style.position = 'absolute';
					 }
					//heres the flag
					var seq = mycanvasResource[counter].getAttribute("animatesequence");
					
					var randomMe = Math.floor((Math.random()*10000)+1);
					mycanvasResource[counter].setAttribute("id",randomMe);
					mycanvasResource[counter].className += " " + "animate";
					
					//reset all animation
					resetAnimations(mycanvasResource[counter]);
				}
			}
		}
}

/*********************************************************
 *	for cross-browser integration
 *
 *********************************************************/
var __x = function(target,property,value)
{
	var rawAgent	=		navigator.userAgent;
	var fx			=		rawAgent.match("Firefox") ? true : false;
	var cr			=		rawAgent.match("Chrome") ? true : false;
	var o			=		rawAgent.match("Opera") ? true : false;
	
	/*__fx = ["perspective":target.style.perspective = value,
			"animation":target.style.animation = value,
			"animationName":target.style.animationName = value,
			"animationDuration":target.style.animationName = value,
			"animationFillMode":target.style.animationFillMode = value,
			"animationDelay":target.style.animationDelay = value,
			"animationDirection":target.style.animationDirection = value,
			"animationPlayState":target.style.animationPlayState = value,
			"transformStyle":target.style.transformStyle = value];*/
			
	switch(property){
		case "perspective":
			return fx ? target.style.perspective = value : cr ? target.style.webkitPerspective = value : "yuck";
			break;
		case "animation":
			return fx ? target.style.animation = value : cr ? target.style.webkitAnimation = value : "yuck";
			break;
		case "animationName":
			return fx ? target.style.animationName = value : cr ? target.style.webkitAnimationName = value : "yuck";
			break;
		case "animationDuration":
			return fx ? target.style.animationDuration = value : cr ? target.style.webkitAnimationDuration = value : "yuck";
			break;
		case "animationFillMode":
			return fx ? target.style.animationFillMode = value : cr ? target.style.webkitAnimationFillMode = value : "yuck";
			break;
		case "animationDelay":
			return fx ? target.style.animationDelay = value : cr ? target.style.webkitAnimationDelay = value : "yuck";
			break;
		case "animationDirection":
			return fx ? target.style.animationDirection = value : cr ? target.style.webkitAnimationDirection = value : "yuck";
			break;
		case "animationPlayState":
			return fx ? target.style.animationPlayState = value : cr ? target.style.webkitAnimationPlayState = value : "yuck";
			break;
		case "transformStyle":
			return fx ? target.style.transformStyle = value : cr ? target.style.webkitTransformStyle = value : "yuck";
			break;
	}
};


var simulate3d = function()
{
		var viewer						=		__util.Tget(inertiaObject.tags[1])[0] != null ? __util.Tget(inertiaObject.tags[1])[0] : alert("Incomplete HTML : You must wrap all slides in 'presentation-view'");
		viewer.style.position			=		"fixed";
		viewer.style.width				=		"100%";
		viewer.style.height				=		"100%";
		viewer.style.top				=		"0px";
		viewer.style.left				=		"0px";
		__x(viewer,"perspective","1200px");
		__x(viewer,"transformStyle","preserve-3d");
}



//declare all extension

var animationLoop = childAnimationLoop.prototype = {
	/***********************************************
	 * developers can extend this function using :
	 * animationLoop.animationName = function(){
	 *	//code here
	 *}
	 ***********************************************/
}

var contentAnimation = childAnimation.prototype = {
	
	
}

var panelAnimation = execAnimate.prototype = {
	
	
}

var backgroundAnimation = checkBgAnim.prototype = {
	/***********************************************
	 * developers can extend this function using :
	 * backgroundAnimationStart.animationName = function(){
	 *	//code here
	 *}
	 ***********************************************/
}

var canvasTransition = execTrans.prototype = {
	/********************************************
	so that developers can create extension using:
	canvasTransition.hellohep = function(){
	alert("yeah");
	}
	*********************************************/
}
/******************************************************
 *
 * WIDGET SECTION : TO DO
 *
 ******************************************************/

/******************************************************
 *
 * MY OWN API
 *
 ******************************************************/
 __api = function(target){
	return myelem = new elem(target);
}

var elem = function(thisTarget){
	this.target = thisTarget;
	this.getSlide = function(){
		return __util.Tget(inertiaObject.tags[3])[this.target];
	}
	this.getBg = function(){
		return __util.Tget(inertiaObject.tags[3])[this.target].getElementsByTagName("slide-background")[0];
	}
}
 






