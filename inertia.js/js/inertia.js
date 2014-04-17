/*************************************************************
*	Software 			: 		Inertia OpenSlide Library
*	Created by 			: 		Jim-Bert Amante
*	Licenced under		: 		none so far
*	Copyright			:		2013
*
**************************************************************/

/*************************************************************
 * hi! this is my first open-source software so please
 * bear with it...i know there are bugs and a lot
 * of rooms for improvemaents but dont worry...this is a
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
			
			presentationScale : 1,
			//global for counting the sequence of animation..it is also the current slide numbr
			mycurrentselection : 0,
			//global for determining the current slide number (length)
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
			//tools in the slide
			showTool : false,
			//PRESENTERS VIEW PORTION
			presentersView : false,
			
			dummySelected : 0,
			
			myPresenterview : false,
			
			curtainOut : false,
			
			startPosition : true,

			keyupEvents : new Object(),

			keyupCache : undefined
	},
	
	// initialize globar inertia
	inertia = function(){},
	
	// initialize inertia tool..the black transluscent thing you can use
	// to navigate inside the presentation
	inertiaTool = function()
	{	
		// we need to inject some html
		var tool = ["<div id='toolbar'>",
					"<div id='tools1'>",
						"<div id='mystatus'></div>",
						"<div id='inertia-prev-prev'><div id='inertia-prev-prev2'></div></div>",
						"<div id='inertia-prev'></div>",
						"<div id='inertia-next'></div>",
						"<div id='inertia-next-next'><div id='inertia-next-next2'></div></div>",
						"<div id='inertia-progress'><div id='inertia-progressing'></div></div>",
						"<select id='slide-number'><option value='select'>Select Slide</option></select>",
						"<input type='button' id='inertia-go' onclick='goSlide()' value='go'>",
						"<button id='inertia-zin'>Zoom In</button>",
						"<button id='inertia-zout'>Zoom Out</button>",
					"</div>",
				    "</div>"].join("");
		var htm = __util.Tget(inertiaObject.tags[2]);
		htm[0].innerHTML += tool;
		__util.get("#toolbar").style.opacity = "0";
		console.log("INERTIA TOOL LOADED...");
	},
	
	// this thing handles the navigation from one slide to another
	goSlide = function(){
		var myslidenumer 		= 		document.URL,
			curr 				= 		myslidenumer.split("#"),
			currentSlide 		= 		curr[1],
			mytool 				= 		__util.get("#slide-number").value;
		
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
		if(typeof parentSlide[parent] !== "undefined")
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
			
			if(typeof firstChild[0] !== "undefined")
			{
				document.title = firstChild[0].innerHTML;
			}else
			{
			document.title = ["Slide ",parent].join("");
			}
		}
	},
	setStat = function(select)
	{
		var statusObj = __util.get("#mystatus");
		statusObj.style.display = "inline-block";
		statusObj.style.marginRight = "5px";
		statusObj.innerHTML = [select, "/",(__util.Tget(inertiaObject.tags[3]).length - 1)].join("");
	},
	navigateNext = function(myprev,mynext)
		{
			if(mynext < inertiaObject.myslidenumber)
			{
				var childs			=		new checkchild(myprev);
				var returnkey		=		childs.animateChild();
				if(returnkey == 1)
				{	
					var trans 					= 			new mytransition(myprev,mynext);
					
					var transit 				= 			trans.checktrans();
					
					var checkImages				=			new checkimage();
					
					//preload resources of the next slide
					var myinitializeResources 	=		 	new initializeResources();
					
					myinitializeResources.load(mynext);
					
					checkImages.init(mynext,parseInt(mynext) - 1);
					
					inertiaObject.mycurrentselection = mynext;
					
					window.location = "#" + mynext;
					
					inertiaObject.mycurrentslide = mynext;
				}
				
				if(typeof myPresenterview !== "undefined"){
					myPresenterview.mysync(inertiaObject.mycurrentselection,inertiaObject.animatestart);
				}
				
			}
			else
			{
				alert("End of Slide. Thank you!");
			}
			
			updateProgressBar();
		},
	navigatePrev = function(myprev,mynext)
		{
			if(myprev > 0)
			{
					var trans 							= 			new mytransition(myprev,mynext);
					
					var transit 						= 			trans.checktrans();
					//initialize image loader
					var checkImages						=			new checkimage();
					//preload resources
					var myinitializeResources			=		 	new initializeResources();
					
					myinitializeResources.load(mynext);
					
					//check if theres an image to display at the backrground
					checkImages.init(parseInt(myprev) - 1,myprev);
					
					inertiaObject.mycurrentselection = mynext;
					//set the url
					window.location = "#" + mynext;
					
					inertiaObject.mycurrentslide = mynext;
			}

			updateProgressBar();
			
	},
	jumpTo = function(myprev,mynext)
	{
			var trans 							= 			new mytransition(myprev,mynext);
			var transit 						= 			trans.checktrans();
			var checkImages						=			new checkimage();
			var myinitializeResources 			=		 	new initializeResources();
			myinitializeResources.load(mynext);
			
			checkImages.init(mynext,myprev);
			inertiaObject.mycurrentselection	=			mynext;
			inertiaObject.mycurrentslide		=			mynext;
			window.location						=			["#",mynext].join("");

			updateProgressBar();
			
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
							var interval = __util.pTime(ifautoplay,ifautoplay);
							
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
								
					}
				}
			}
	},
	
	/* this section inserts the first slide
	 * which compose of the informations about the 
	 * browser
	 */
	insertEndSlide = function(){
			var parent		=		__util.Tget(inertiaObject.tags[1])[0];
			var end			=		document.createElement("slide");
			end.id			=		""
			end.innerHTML	=		"<div style='color:#FFF;font-family:arial;text-align:center'>End of Presentation</div><div class='backgroundImage inertia-ending-slide' imgsrc='./backgrounds/b.jpg' transition='fadeinout'></div>";
			end.setAttribute("showpane","false");
			parent.appendChild(end);
	
	},
	insertFirstSlide = function(){
			var browserInfo		=		navigator.userAgent;
			var mybrowser		=		browserInfo.match(/Firefox/) == "Firefox" ? "Gecko" : browserInfo.match(/Chrome/) == "Chrome" ? "Webkit" : browserInfo.match(/Opera/) == "Opera" ? "Webkit" : "What is it?";
			var storage 		=		typeof(Storage)!=="undefined" ? "Local Storage is supported" : "Local Storage is not supported";
			var myinfo			=		document.createElement("slide");
			var parent			=		__util.Tget("presentation-view")[0];
			var content			=		["<div id='inertia-myinfo'>","<div class='inertia-slide-info'><div class='inertia-round'></div> You are using "+mybrowser+" browser</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> We're on a "+navigator.platform+" platform</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> "+storage+"</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> Use <div class='inertia-key'>></div> or <div class='inertia-key'><</div> arrow keys for navigation.</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> You can also press <div class='inertia-key'>T</div> for tools.</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> To highlight just press <div class='inertia-key'>H</div>.</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> Click to zoom.</div>","<div class='inertia-slide-info'><div class='inertia-round'></div> If your platform supports Extended Desktop you may want to use a Presenter's View...just press <div class='inertia-key'>P</div></div>","</div>"].join(""); 
			myinfo.innerHTML = content;
			parent.insertBefore(myinfo,__util.Tget("slide")[0]);
			
	},
	presviewInit = function(){
		var el = __util.Tget(inertiaObject.tags[1])[0];
		el.style.width = window.innerWidth + "px";
		el.style.height = window.innerHeight + "px";
	},
	updateProgressBar = function(){
		var progress = __util.get("#inertia-progressing"),
			slideCount = inertiaObject.myslidenumber,
			current = inertiaObject.mycurrentselection,
			slidewidth = 100 / slideCount;
		
		progress.style.width = (slidewidth * current) + "%";
		
	};
	
//var slide = new Object();


//this is an animation before anything else

//

window.onload = function()
{	
	
	if(window.opener != null){
		var auth = window.opener.authenticate();
	}else{
		console.log("RUNNING ON TOP");
	}
	
	if(window.opener != null && auth == "inertia"){
		var canvas = new canvasConfig();
		canvas.presentersView();
		inertiaObject.presentersView = true;
	}else{
		//inject the toolbar --> press 't' to show
		if ( window.self === window.top )
		{ 
		}else{
			console.log("i am on an i frame");
		}
		
		inertiaTool();
		//insert first slide
		insertFirstSlide();
		//insert end slide
		insertEndSlide();
		//initialize the canvas
		var canvas = new canvasConfig();
		//initialize canvas
		canvas.canvasInit(); 
		
		//initialize container
		presviewInit();
		//set aspect ratio
		//__util.Tget(inertiaObject.tags[1])[0]
		//canvas.aspectRatio(window,__util.Tget(inertiaObject.tags[3]));
		canvas.aspectRatio(__util.Tget(inertiaObject.tags[1])[0],__util.Tget(inertiaObject.tags[3]));
		//initialize css
		canvas.initializeCSS();
		//initialize curtain
		initCurtain();
		
		initViews();
		
		var engine = new inertia();
		engine.load();
		
		//INITIALIZE ZOOM.
		var zoomElem = new inertiaZoom();
		zoomElem.init();
		
		//update our progress
		updateProgressBar();
		
		// DETERMINE IF A USER TRIGGERED A PRESENTER'S VIEW
		// I NOTICED THAT WHEN THE USER CALLS A PRESENTERS VIEW
		// AND THE MAIN WINDOW WAS REFRESHED...THE SYNCRONIZATION FAILED
		// SO USING SESSIONSTORAGE I CAN DETERMINE WHETHER IT IS
		// EXISTING OR NOT...COOKIES ARE NOT AVAILABLE IF YOU ARE NOT
		// USING A WEB SERVER...OUCH!
		try{
			if(sessionStorage.presenter == "true"){
				try{
				// OPEN PRESENTATION
				__util.presenter();
				// CALL CHILD WINDOW'S FUNCTIONS
				myPresenterview.checkSlide(inertiaObject.mycurrentselection);
				myPresenterview.dummySlide(inertiaObject.mycurrentselection);
				}catch(e){
						alert(e);
				}
			}
		}catch(e){
			console.log(e);
		}
		//start inertia
		__util.Tget(inertiaObject.tags[1])[0].style.display = "block";
		
	}
	/*
	var s = document.getElementsByClassName("resources");
	
	for(var i = 0;i < s.length;i++){
		s[i].setAttribute("contenteditable","true");
	}*/

};

window.onresize = function(){
	presviewInit();
	if(!inertiaObject.presentersView){
		var canvas = new canvasConfig();
		canvas.aspectRatio(__util.Tget(inertiaObject.tags[1])[0],__util.Tget(inertiaObject.tags[3]));
	}else{
	
	}
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
	aspectRatio : function(myhost,target,opt)
	{
			var mytarget = target,
				windowheight,
				windowwidth;
			
			if(typeof myhost.innerHeight !== "undefined" && myhost.innerHeight != 0){
				windowheight = parseInt(myhost.innerHeight);
			}else if(typeof myhost.clientHeight !== "undefined" && myhost.clientHeight != 0){
				windowheight = parseInt(myhost.clientHeight);
			}else if(typeof myhost.getBoundingClientRect().height !== "undefined" && myhost.getBoundingClientRect().height != 0){
				windowheight = myhost.getBoundingClientRect().height;
			}else{
				windowheight =  window.innerHeight;
			}
			
			if(typeof opt !== "undefined" && typeof opt.height !== "undefined"){
				//override windowheight if an option for
				//height is present
				windowheight = opt.height;
			}
			
			if(typeof myhost.innerWidth !== "undefined" && myhost.innerWidth != 0){
				windowwidth = parseInt(myhost.innerWidth)
			}else if(typeof myhost.clientWidth !== "undefined" && myhost.clientWidth != 0){
				windowwidth = myhost.clientWidth;
			}else if(typeof myhost.getBoundingClientRect().width !== "undefined" && myhost.getBoundingClientRect().width != 0){
				
				windowwidth = myhost.getBoundingClientRect().width;
			}else{
				windowwidth =  window.innerWidth;
			}
			
			if(typeof opt !== "undefined" && typeof opt.width !== "undefined"){
				//override windowheight if an option for
				//height is present
				windowwidth = opt.height;
			}
			
			var endCount = typeof mytarget.length !== "undefined" ? parseInt(mytarget.length) : 1;
			
			for(var start = 0; start < endCount;start++){
				var toFit = typeof mytarget[start] !== "undefined" ? mytarget[start] : mytarget;
				var myheight = parseInt(toFit.style.height);
				var mywidth = parseInt(toFit.style.width);
				
				var mytop = (windowheight / 2) - (this.canvasHeight / 2);
				var myleft = (windowwidth / 2) - (this.canvasWide / 2);
				
				toFit.style.top = mytop+"px";
				toFit.style.left = myleft+"px";
				toFit.style.transform = ""; //reset transform
				if(windowheight < myheight && windowwidth > mywidth){
					var computedScale = windowheight / myheight;
					__x(toFit,"transform","scale("+computedScale+")");
				}else if(windowwidth < mywidth && windowheight > myheight){
					var computedScale = windowwidth / mywidth;
					__x(toFit,"transform","scale("+computedScale+")");
				}else if(windowwidth < mywidth && windowheight < myheight){
					var diff1 = mywidth - windowwidth;
					var diff2 = myheight - windowheight;
					
					if(diff1 > diff2){
						var computedScale = windowwidth / mywidth;
						__x(toFit,"transform","scale("+computedScale+")");
					}else if(diff1 < diff2){
						var computedScale = windowheight / myheight;
						__x(toFit,"transform","scale("+computedScale+")");
					}
				}
				
				if(windowwidth > mywidth && windowheight > myheight){
					__x(toFit,"transform","scale(1)");
					var computedScale = 1;
				}
				
				inertiaObject.scale = computedScale;
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
	},
	presentersView : function(){
		var viewer			=		__util.Tget(inertiaObject.tags[1])[0] != null ? __util.Tget(inertiaObject.tags[1])[0] : alert("Incomplete HTML : You must wrap all slides in 'presentation-view'");
		var mycanvas		=		__util.Tget(inertiaObject.tags[3]);
		viewer.id			=		"inertia-side-panel";
		viewer.setAttribute("style","z-index:100;position:fixed;top:0px;left:0px;height:"+window.innerHeight+"px;width:300px;background:#717582;overflow:auto;border-right:solid #000 2px;");
	
		for(var starter = 0; starter < mycanvas.length;starter++){
			mycanvas[starter].setAttribute("style","height:"+this.canvasHeight+"px;width:"+this.canvasWide+"px;box-shadow:0px 2px 15px #000;display:inline-block;position:absolute;top:"+(parseInt(starter) * ((parseInt(this.canvasHeight) * 0.3) + 10))+"px;");
			__x(mycanvas[starter],"transform","scale(0.3)");
			__x(mycanvas[starter],"transformOrigin","1% 1%");
			mycanvas[starter].id				=		(parseInt(starter) + 1);
			
			//initialize user's note if any
			var mynote		=		mycanvas[starter].getElementsByTagName("note");
			var mybg		=		mycanvas[starter].getAttribute("animate");
			
			if(typeof mybg !== "undefined" && mybg != null)
			{
				var mybackground = mybg.split(":");
				if(typeof mybackground[1] !== "undefined")
				{
				mycanvas[starter].style.background = mybackground[1];
				}
			}
			
			if(typeof mynote[0] !== "undefined")
			{
				//of course we dont want our notes visible
				mynote[0].style.display		=			"none";
			}

			mycanvas[starter].addEventListener("click",function()
			{
				var mynum			=		this.getAttribute("id");
				checkNote(this);
				//get all canvas
				var mycanvas					=		__util.Tget(inertiaObject.tags[3]);
				for(var cnvs = 0;cnvs < mycanvas.length;cnvs++)
				{
					mycanvas[cnvs].style.border = "none";
				}
				
				checkSlide(mynum)
				
				opener.goToSlide(mynum);
				inertiaObject.dummySelected = parseInt(mynum);
				dummySlide(mynum);
				
				
				
			},false);
			
			
		}
		
		setTimeout(function(){
			createPresenter();
			setSize();
			setUnreload();
			
			var myURL = document.URL;
			var myslide = myURL.split("#");
			
			dummySlide((parseInt(myslide[1])));
			checkSlide((parseInt(myslide[1])));
			
		},100);
		
		// IT HANDLES WINDOWS EVENTS FOR NAVIGATION AND HIGHLIGHT
		window.document.addEventListener("keyup",function(evt){
			// NAVIGATE ONWARD
			if(evt.keyCode == 39){ 
				opener.next(); //control the parent
				checkSlide(opener.inertiaObject.mycurrentselection); //control the panel
			}else if(evt.keyCode == 37){
			// NAVIGATE BACKWARD
				opener.prev();
				checkSlide(opener.inertiaObject.mycurrentselection);
				dummySlide(opener.inertiaObject.mycurrentselection);
			}
			
		},false);
		
		
		window.onresize = function()
		{
			setSize();
		}
		
		window.onbeforeunload = function () {
			opener.sessionStorage.presenter = "false"; 
		};
		
		var setUnreload = function(){
		}

		
		var setSize = function()
		{
		
			var blocker = document.getElementById("inertia-viewer-wrapper");
			var viewer = document.getElementById("inertia-viewer");
			var keynote = document.getElementById("inertia-key-note");
			var note = document.getElementById("inertia-mynote");
			var panel = document.getElementById("inertia-side-panel");
			panel.setAttribute("style","z-index:100;position:fixed;top:0px;left:0px;height:"+window.innerHeight+"px;width:300px;background:#717582;overflow:auto;border-right:solid #000 2px;");
			note.setAttribute("style","background:#FFF;height:200px;width:100%;position:absolute;bottom:0px;left:0px;overflow:auto;border:solid #000 1px;");
			keynote.setAttribute("style","z-index:100;height:230px;width:"+(parseInt(window.innerWidth) - 300) + "px;position:fixed;bottom:0px;left:300px;background:#404353;border-top:solid #000 2px;");
			blocker.setAttribute("style","background:rgba(0,0,0,0.2);z-index:100;position:fixed;top:0px;right:0px;width:"+(parseInt(window.innerWidth) - 300) + "px;height:"+(parseInt(window.innerHeight) - 230) + "px;box-shadow:inset 0px "+((parseInt(window.innerHeight) - 230) / 2)+"px 15px rgba(255,255,255,0.2);");
			
				var canvas = new canvasConfig();
				var myhost = document.getElementById("inertia-viewer-wrapper");
				var mycontent = document.getElementById("inertia-viewer");
				canvas.aspectRatio(myhost,mycontent);
		}
		
		
		//start inertia
		
		
	}
};

var initCurtain = function(){
	
		var background = __util.Tget(inertiaObject.tags[1]);
		if(typeof background[0].getAttribute("curtain") !== "undefined"){
			background = background[0].getAttribute("curtain");
		}else{
			background = "#000";
		}
		
		var curtain = __util.get("#curtain");
		
		if(typeof curtain === "undefined" || curtain == null){
			var elem = document.createElement("div");
			elem.setAttribute("id","curtain");
			elem.style.background = background;
			elem.style.backgroundSize = "auto 100%";
			var htm = __util.Tget(inertiaObject.tags[2]);
			htm[0].appendChild(elem);
		}


	inertiaObject.keyupEvents["curtain"] = function(e){
			
		if(e.keyCode == 66){
			if(inertiaObject.curtainOut){
				__x(elem,"animation","fadeOutCurtain 1000ms forwards");
				inertiaObject.curtainOut = false;
			}else{
				console.log("yea");
				elem.style.display = "block";
				elem.style.zIndex = "100";
				__x(elem,"animation","fradeInCurtain 1000ms forwards");
				inertiaObject.curtainOut = true;
			}
		}

	}
};

var initViews = function(){
	
	var pres = __util.Tget(inertiaObject.tags[1]);
		
	__util.get("#inertia-zout").onclick = function(){
		inertiaObject.presentationScale -= 0.1;
		__x(pres[0],"transform","scale("+inertiaObject.presentationScale+")");
			
	}
	__util.get("#inertia-zin").onclick = function(){
		inertiaObject.presentationScale += 0.1;
		__x(pres[0],"transform","scale("+inertiaObject.presentationScale+")");
			
	}
	
	inertiaObject.keyupEvents["views"] = function(e){
		if(e.keyCode == 73){
		inertiaObject.presentationScale += 0.1;
		__x(pres[0],"transform","scale("+inertiaObject.presentationScale+")");
			
		}else if(e.keyCode == 79){
		inertiaObject.presentationScale -= 0.1;
		__x(pres[0],"transform","scale("+inertiaObject.presentationScale+")");
			
		}
	}
}

var createPresenter = function(){
		//create blocker...to avoid triggering events from viewer
		var blocker = document.createElement("div");
		blocker.id = "inertia-viewer-wrapper";
		blocker.setAttribute("style","background:rgba(0,0,0,0.2);z-index:100;position:fixed;top:0px;right:0px;width:"+(parseInt(window.innerWidth) - 300) + "px;height:"+(parseInt(window.innerHeight) - 230) + "px;box-shadow:inset 0px "+((parseInt(window.innerHeight) - 230) / 2)+"px 15px rgba(255,255,255,0.2);");
		document.body.appendChild(blocker);
		
		var myviewer = document.createElement("div");
		myviewer.id = "inertia-viewer";
		myviewer.setAttribute("style","z-index:100;position:absolute;width:900px;height:600px;box-shadow:0px 2px 15px #000;");
		document.getElementById("inertia-viewer-wrapper").appendChild(myviewer);
		
		//inject html
		var comment = document.createElement("div");
		comment.id = "inertia-key-note";
		comment.setAttribute("style","height:230px;width:"+(parseInt(window.innerWidth) - 300) + "px;position:fixed;bottom:0px;left:300px;background:#404353;border-top:solid #000 2px;");
		document.body.appendChild(comment);
		
		var scaleDown = document.createElement("button");
		scaleDown.innerHTML = "-";
		scaleDown.onclick = function(){
			inertiaObject.scale -= 0.1;
			__x(myviewer,"transform","scale("+(inertiaObject.scale)+")");
		}
		
		var txtComment = document.createElement("div");
		txtComment.id = "inertia-mynote";
		txtComment.setAttribute("style","background:#FFF;height:200px;width:100%;position:absolute;bottom:0px;left:0px;overflow:auto;border:solid #000 1px;");
		document.getElementById("inertia-key-note").appendChild(scaleDown);
		document.getElementById("inertia-key-note").appendChild(txtComment);	
	
}

var checkNote = canvasConfig.prototype.presentersView.checkNote = function(target){
	var mynote			=		target.getElementsByTagName("note");
	var txtnote			=		__util.get("#inertia-mynote");
	if(typeof mynote[0] !== "undefined")
	{
		txtnote.innerHTML			=			mynote[0].innerHTML;
	}else{
		txtnote.innerHTML			=			"";
	}
}

var checkSlide =  canvasConfig.prototype.presentersView.checkSlide = function(n){
	
	var mycanvas	=	__util.Tget(inertiaObject.tags[3]);
	for(var cnvs = 0;cnvs < mycanvas.length;cnvs++)
	{
		
		if(mycanvas[cnvs].id == n)
		{
			checkNote(mycanvas[cnvs]);
			mycanvas[cnvs].style.border = "solid orange 10px";
		}else
		{
			mycanvas[cnvs].style.border = "none";
		}
	}
	
}

var authenticate =  canvasConfig.prototype.presentersView.checkopener = function(){
	
	return "inertia";
	
}
		
var dummySlide = canvasConfig.prototype.presentersView.checkDummySlide = function(dummy){
	
	var targetDummy						=		__util.get("#inertia-viewer");
		targetDummy.innerHTML			=		__util.get("#"+dummy).innerHTML;
		targetDummy.style.background	=		__util.get("#"+dummy).style.background;
		
	var resources						=		targetDummy.getElementsByClassName("resources");
	for(var start =0; start < resources.length;start++)
	{
		if(typeof resources[start].getAttribute("animatein") !== "undefined")
		{
			resources[start].style.display = "none";
		}
	}
	
	inertiaObject.dummySelected = parseInt(dummy);
			
}



//here
var mysync = canvasConfig.prototype.presentersView.sync = function(slide,resources){
		var from = __util.get("#"+slide);
		var to = __util.get("#inertia-viewer");
		
		console.log(inertiaObject.dummySelected);
		
		if(inertiaObject.dummySelected == slide){
			var res = to.getElementsByClassName("resources");
			for(var start =0;start < res.length;start++)
			{
				if(typeof res[start].getAttribute("animatesequence") !== "undefined" && res[start].getAttribute("animatesequence") != null)
				{
					if(parseInt(res[start].getAttribute("animatesequence")) == (resources - 1))
					{
						res[start].style.display = "block";
						res[start].style.opacity = "1";
					}
				}else{
						res[start].style.display = "block";
						res[start].style.opacity = "1";
				}
			}
		}else{
				dummySlide(slide);
				inertiaObject.dummySelected = parseInt(slide);
		}
		

}

inertia.prototype = {
	load : function(){
		
			// i use the url to determine the current slide,
			// this is helpful when the user refresh the page.
			var myslidenumber 					= 		document.URL;
			var newslider 						= 		myslidenumber.split("#");
			inertiaObject.mycurrentselection	= 		newslider[1] != undefined ? newslider[1] : inertiaObject.mycurrentselection = 0;
			var mycanvasProp 					= 		new	canvasConfig();
			//setting the screensizes
			var myscreenheight					=		mycanvasProp.screenHeight;
			var myscreenwidth					=		mycanvasProp.screenWide;
			
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
			
			/* initialize structures of slides :
			 * this analyze the markup of each element: sizes, width,
			 * height, top, left etc.
			 */
			 
			//initialize properties of all background images if any
			for(var myimg = 0;myimg < end;myimg++){
				var mycanvas = __util.Tget(inertiaObject.tags[3]);
				var images = mycanvas[myimg].getElementsByClassName('backgroundImage');
				//for(var count = 0; count < images.length;count++){
				if(typeof images[0] !== "undefined"){
					var mysrc = images[0].getAttribute('imgsrc');
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
				//}
				}
			}
			
			//clear all notes
			var mynote		=		__util.Tget("note");
			for(var note = 0;note < mynote.length;note++){
				mynote[note].style.display = "none";
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
			
			
			window.onkeyup = function(e){
				inertiaObject.keyupCache(e);
			};

			inertiaObject.keyupCache = function(e){	

				if(e.keyCode == 39){
					next();
				}else if(e.keyCode == 37){
					prev();
				}else if(e.keyCode == 72){
					var myhighlight = new inertia();
					myhighlight.load.highlight();
				}else if(e.keyCode == 84){
					__util.tool();
				}else if(e.keyCode == 80){
					//call for presenter's view
					sessionStorage.presenter = "true"; 
					__util.presenter();
				}else if(e.keyCode == 69){
					//call for presenter's view
					expression.init();
				}else{
					
				}
						
		
				inertiaObject.keyupEvents["views"](e);
				inertiaObject.keyupEvents["curtain"](e);
			
			};

			__util.get('#inertia-next').addEventListener("click",function(){
				__util.xTime();
				inertiaObject.autoPlayer = null;
				navigateNext(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) + 1);updateProgressBar();
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

var next = inertia.prototype.load.nextSlide = function(){
	__util.xTime();
	inertiaObject.autoPlayer = null;
	navigateNext(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) + 1);

}

var prev = inertia.prototype.load.prevSlide = function(){
	__util.xTime();
	navigatePrev(inertiaObject.mycurrentselection,parseInt(inertiaObject.mycurrentselection) - 1);
}

var goToSlide = inertia.prototype.load.jumpSlide = function(n){
	jumpTo(parseInt(inertiaObject.mycurrentselection),parseInt(n));
}

var __util = {
	set : function(e,prop){
		if(typeof prop !== "undefined" && typeof prop === "object"){
			for(key in prop){
				e.setAttribute(key,prop[key]);
			}
		}
	},
	get : function(selector)
	{
			if(selector.match(/^#/g) == "#")
			{
			var newselector = selector.replace(/#/,"");
			var select = document.getElementById(newselector);
			return select;
			}else
			{
			var newselector = selector.replace(/^./,"");
			var select = document.getElementsByClassName(newselector);
			return select;
			}
		//}
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
		
		myinterval = myinterval.toString();
		mydelay = mydelay.toString();
		
		if(myinterval.match(/ms/g) != null && myinterval.match(/ms/g)[0] == "ms"){
			intrv = parseInt(myinterval);
		}else if(myinterval.match(/s/g) != null && myinterval.match(/s/g)[0] == "s"){
			intrv = parseInt(myinterval) * 1000;
		}else{
			parseInt(myinterval) ? intrv = parseInt(myinterval) : intrv = 0;
		}
		
		if(mydelay.match(/ms/g) != null && mydelay.match(/ms/g)[0] == "ms"){
			delay = parseInt(mydelay);
		}else if(mydelay.match(/s/g) != null && mydelay.match(/s/g)[0] == "s"){
			delay = parseInt(mydelay) * 1000;
		}else{
			parseInt(mydelay) ? delay = parseInt(mydelay) : delay = 0;
		}
		
		return parseInt(intrv) + parseInt(delay);
	},
	/*******************************************************************
	 *  THIS FUNCTION HANDLES THE STATE OF SLIDE AS WELL AS
	 *  CLEANING PREVIOUSLY USED STYLESHEETS.
	 *  BASICALLY WHEN A FUNCTION CLEANED A CSS RULE, THE ANIMATING
	 *  SLIDE WAS AFFECTED. SO IN ORDER TO CLEAN THE SLIDE WE HAVE TO:
	 *****************************************************************/
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
		
		var pres		=		__util.Tget(inertiaObject.tags[1]),
			canvas		=		new canvasConfig();
			    
		if(inertiaObject.showTool){
			__util.get("#toolbar").style.opacity = "0";
			
			canvas.aspectRatio(pres[0],__util.Tget(inertiaObject.tags[3]),{"height":window.height});
			
			inertiaObject.showTool = false;
		}else{
			    
			__util.get("#toolbar").style.opacity = "1";
			
			canvas.aspectRatio(pres[0],__util.Tget(inertiaObject.tags[3]),{"height":(parseInt(pres[0].style.height) - 50)});
			
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

	},
	//added alpha 2
	presenter : function(){
		myPresenterview = window.open(document.URL,"inertia.js : Presenter's View","width="+window.innerWidth+",height="+window.innerHeight);
		return myPresenterview;
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
		if(typeof executeOut[this.mytrans] !== "undefined"){
			executeOut[this.mytrans]() 
		}else{
			executeOut["transfadeout"]();
			console.log("WARN : No effect named "+this.mytrans+", going to fallback mode.");
		}
		
		getTitle(this.next);
		setStat(this.next);
		
		//look for the first resource with animation
		//set all variables first before another function reset the data needed
		this.myinterval = inertiaObject.transitionInterval;
		var nextTarget = this.next;
		var nextRes = inertiaObject.animatestart + 1;
		
		setTimeout(function(){
			checkAutoPlay(nextTarget,nextRes);
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
	//we need to do this because
	//when we scale the slides...grids of spaces appear
	//between animating panels inside the slides
	//and its ugly
	this.normalizeAfter = function(duration,tdelay){
			var interval = 0,delay = 0;
			if(typeof duration === "undefined"){
				interval = 1000;
			}else{
				interval = duration;
			}
			if(typeof tdelay === "undefined"){
				delay = 0;
			}else{
				delay = tdelay;
			}
			
			time = __util.pTime(interval,delay);
			setTimeout(function(){
				__api(inertiaObject.mycurrentselection).getSlide().style.background = background;
			},time);
			
	};
	
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
			console.log("zoom");
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
				
				
			resetAnimations(targetParent);//?????
				
			if(mw > mh)
			{
			var compute = window.innerHeight - ((mw - mh) / 2);
			}else if(mw < mh)
			{
			var compute = window.innerHeight - ((mh - mw) / 2);
			}else{
			//if it is a square...just use any :-)
			//but i prefer height cause...just an intuition
			var compute = window.innerHeight ;
			}
			//for 3d zooming 
			
					var zoomer = ["@%100keyframes zoomed{0%{opacity:1;%100transform:scale(",myscale,") translateY(0px) translateX(0px) translateZ(0px);}100%{opacity:1;%100transform:translateY(",mycenterpointH,"px) translateX(",mycenterpointW,"px) translateZ(",compute,"px) scale(",myscale,");}}",
								 "@%100keyframes zoomedout{0%{opacity:1;%100transform:translateY(",mycenterpointH,"px) translateX(",mycenterpointW,"px) translateZ(",compute,"px);}100%{opacity:1;%100transform:translateY(0px) translateX(0px) translateZ(0px) scale(",myscale,");}}"].join("");
					zoomer = __util.evaluate(zoomer);
					var zoomSheet = new stylesheet();
					var zSheet = zoomSheet.checkSheet("inertia-zoomsheet");
					zSheet.innerHTML = zoomer;
					var canvas = new canvasConfig();
						if(inertiaObject.zoomed == true){
							__x(targetParent,"animationName","zoomedout");
							__x(targetParent,"animationDuration","1s");
							__x(targetParent,"animationFillMode","forwards");
							setTimeout(function(){
								inertiaObject.zoomed = false;
								resetAnimations(targetParent);
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
					
					if(typeof looping !== 'undefined' || looping != null || looping != '')
					{
						setTimeout(function(){
							var mychildAnimateLoop = new childAnimationLoop(myid);;
							if(typeof mychildAnimateLoop[looping] == "function"){
								mychildAnimateLoop[looping]();
							}
						},1000);
					}
					
					if(this.mychild[count - 1]){
							var animateoutid = this.mychild[count-1].getAttribute("id");
							var myanimateout = this.mychild[count-1].getAttribute("animateout");
							
							if(myanimateout != null)
							{
								
								//var mychildAnimateOut 	=	new childAnimation(animateoutid);
								var mychildAnimateOut 	=	new childAnimationOut(animateoutid);
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
var childAnimationOut = function(mytarget)
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
			try{ var animatein = mycanvas[target].getElementsByClassName("backgroundImage")[0].getAttribute("transition") }catch(err){ var animatein = undefined; }
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
		return new __newRule(toCheck);
	}
}

__newRule.prototype = {
	myNewRule : function(appendRule)
	{
		var style = new stylesheet();
		var mysheet = style.checkSheet(this.id); //return the stylesheet
		
		mysheet.innerHTML += appendRule;
		
		return new __transition();
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
				console.log(objRule.incoming.bgDuration);
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
				console.log("interval="+myinterval);
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
		if(panelAnimate != null && typeof panelAnimate !== "undefined")
		{
			var ifpanelAnimate = panelAnimate.split(":");
			//check if we have a color
			if(ifpanelAnimate[1] == '' || ifpanelAnimate[1] == undefined){
				var mybackground = "#FFF";
			}else{
				var mybackground = ifpanelAnimate[1];
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
	//this will clean all the style used in
	//panel animation
	setTimeout(function(){
	__util.get("#inertia-panelsheet").innerHTML = "";
	},duration);
	__util.Tget(inertiaObject.tags[3])[target].getElementsByTagName("slide-background")[0].innerHTML = "";	
	
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
					
					if(mycanvasResource[counter].className.toString().match(/animate/)){
						
					}else{
						mycanvasResource[counter].className += " " + "animate";
					}
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
		case "transform":
			return fx ? target.style.transform = value : cr ? target.style.webkitTransform = value : "yuck";
			break;
		case "transformOrigin":
			return fx ? target.style.transformOrigin = value : cr ? target.style.webkitTransformOrigin = value : "yuck";
			break;
	}
};


var simulate3d = function()
{
		var viewer						=		__util.Tget(inertiaObject.tags[1])[0] != null ? __util.Tget(inertiaObject.tags[1])[0] : alert("Incomplete HTML : You must wrap all slides in 'presentation-view'");
		viewer.style.position			=		"fixed";
		viewer.style.width				=		window.innerWidth + "px";
		viewer.style.height				=		window.innerHeight + "px";
		viewer.style.top				=		"0px";
		viewer.style.left				=		"0px";
		__x(viewer,"perspective","1200px");
		__x(viewer,"transformStyle","preserve-3d");
}



//declare all extension

var animationLoop = childAnimationLoop.prototype = {};

var contentAnimation = childAnimation.prototype = {};

var contentAnimationOut = childAnimationOut.prototype = {};

var panelAnimation = execAnimate.prototype = {};

var backgroundAnimation = checkBgAnim.prototype = {};

var canvasTransition = execTrans.prototype = {};

/******************************************************
 *
 * MY OWN API
 *
 ******************************************************/
var __api = function(target){
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
	this.getChild = function(x){
		var mychild = x;
		var myparent = __util.Tget(inertiaObject.tags[3])[this.target];
		if(mychild.match(/#/g) == "#")
		{
			var selector = mychild.replace(/^#/,"");
			return document.getElementById(selector[1]);
		}else
		{
			var selector = mychild.replace(/^./,"");
			return myparent.getElementsByClassName(selector);
		}
	}
}











