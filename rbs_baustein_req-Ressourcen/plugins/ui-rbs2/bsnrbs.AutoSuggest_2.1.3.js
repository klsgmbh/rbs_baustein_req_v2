/**
 *  author:		Timothy Groves - http://www.brandspankingnew.net
 *  change: 	Edgardo Moreira 2018
 *	version:	1.2 - 2006-11-17
 *              1.3 - 2006-12-04
 *              2.0 - 2007-02-07
 *              2.1.1 - 2007-04-13
 *              2.1.2 - 2007-07-07
 *              2.1.3 - 2007-07-19
 *
 */


if (typeof(bsnrbs) == "undefined")
	_b = bsnrbs = {};


if (typeof(_b.Autosuggest) == "undefined")
	_b.Autosuggest = {};
else
	alert("Autosuggest is already set!");

var discr = '%';


_b.AutoSuggest = function (id, param)
{
	// no DOM - give up!
	//
	if (!document.getElementById)
		return 0;
	
	// get field via DOM
	//
	this.fld = _b.DOM.gE(id);

	if (!this.fld)
		return 0;
	
	// init variables
	//
	this.sInp 	= "";
	this.nInpC 	= 0;
	this.aSug 	= [];
	this.iHigh 	= 0;
	
	// parameters object
	//
	this.oP = param ? param : {};
	
	// defaults	
	//
	var k, def = {minchars:1, meth:"get", varclass: "street", varname:"input", filter:"", className:"autosuggest", timeout:2500, delay:500, offsety:-5, shownoresults: true, noresults: "No results!", maxheight: 25, cache: true, maxentries: 2500};
	for (k in def)
	{
		if (typeof(this.oP[k]) != typeof(def[k]))
			this.oP[k] = def[k];
	}
	
	
	// set keyup handler for field
	// and prevent autocomplete from client
	//
	var p = this;

	//this.fld.click = function(ev){ return p.onclick(ev); };
	
	// NOTE: not using addEventListener because UpArrow fired twice in Safari
	//_b.DOM.addEvent( this.fld, 'keyup', function(ev){ return pointer.onKeyPress(ev); } )

	this.fld.onclick 		= function(ev){ return p.onClick(ev); };	310120
	this.fld.onkeydown 	= function(ev){ return p.onKeyDown(ev); };
	this.fld.onkeyup 		= function(ev){ return p.onKeyUp(ev); };
	//this.fld.onblur  = function(ev) {return p.onBlur(ev);};
	
	this.fld.setAttribute("autocomplete","new-password");
};

_b.AutoSuggest.prototype.onBlur = function(ev){
	var bubble = 1;
	this.clearSuggestions(this.fld.value);
	var bubble = 0;
	return bubble;
}

_b.AutoSuggest.prototype.onClick = function(ev)
{
	var bubble = 1;
	
	var key = (window.event) ? window.event.keyCode : ev.keyCode;

			this.getSuggestions(this.fld.value);
	

	return bubble;
};

_b.AutoSuggest.prototype.onKeyDown = function(ev)
{	
	var key = (window.event) ? window.event.keyCode : ev.keyCode;

	// set responses to keydown events in the field
	// this allows the user to use the arrow keys to scroll through the results
	// ESCAPE clears the list
	// TAB sets the current highlighted value
	//
	var RETURN = 13;
	var TAB = 9;
	var ESC = 27;
	
	var bubble = 1;

	switch(key)
	{
		case RETURN:
			this.setHighlightedValue();
			bubble = 0;
			break;

		case ESC:
			this.clearSuggestions();
			break;

		case TAB:
			this.setHighlightedValue();
			bubble = 0;
			break;
			
	}

	return bubble;
};



_b.AutoSuggest.prototype.onKeyUp = function(ev)
{
	var key = (window.event) ? window.event.keyCode : ev.keyCode;
	


	// set responses to keydown events in the field
	// this allows the user to use the arrow keys to scroll through the results
	// ESCAPE clears the list
	// TAB sets the current highlighted value
	//

	var ARRUP = 38;
	var ARRDN = 40;
	
	var bubble = 1;

	switch(key)
	{


		case ARRUP:
			this.changeHighlight(key);
			bubble = 0;
			break;


		case ARRDN:
			this.changeHighlight(key);
			bubble = 0;
			break;
		
		
		default:
			this.getSuggestions(this.fld.value);
	}

	return bubble;
	

};








_b.AutoSuggest.prototype.getSuggestions = function (val)
{
	
	// if input stays the same, do nothing
	//


	if (val == this.sInp && val != "")
		return 0;
	
	
	// kill list
	//
	_b.DOM.remE(this.idAs);
	
	
	this.sInp = val;
	
	
	// input length is less than the min required to trigger a request
	// do nothing
	//
	if (val.length < this.oP.minchars)
	{
		this.aSug = [];
		this.nInpC = val.length;
		return 0;
	}
	
	
	
	
	var ol = this.nInpC; // old length
	this.nInpC = val.length ? val.length : 0;
	
	
	
	// if caching enabled, and user is typing (ie. length of input is increasing)
	// filter results out of aSuggestions from last request
	//
	var l = this.aSug.length;
	if (this.nInpC > ol && l && l<this.oP.maxentries && this.oP.cache)
	{
		var arr = [];
		for (var i=0;i<l;i++)
		{
			if (this.aSug[i].value.substr(0,val.length).toLowerCase() == val.toLowerCase())
				arr.push( this.aSug[i] );
		}
		this.aSug = arr;
		
		this.createList(this.aSug);
		
		
		
		return false;
	}
	else
	// do new request
	//
	{
		var pointer = this;
		var input = this.sInp;
		clearTimeout(this.ajID);
		this.ajID = setTimeout( function() { pointer.doAjaxRequest(input) }, this.oP.delay );
	}

	

	return false;
};





_b.AutoSuggest.prototype.doAjaxRequest = function (input)
{
	// check that saved input is still the value of the field
	//
	

	if (input != this.fld.value)
		return false;
	
	
	var pointer = this;
	//vars = this.oP.varname.split(';');

	
	// create ajax request
	//
	if (typeof(this.oP.script) == "function")
		var url = this.oP.script(encodeURIComponent(this.sInp));
	else
		var url = this.oP.script+this.oP.varname+"="+encodeURIComponent(this.sInp);
	
	if (!url)
		return false;
	
	var meth = this.oP.meth;
	var input = this.sInp;
	
	var onSuccessFunc = function (req) { pointer.setSuggestions(req, input) };
	var onErrorFunc = function (status) {console.log( "Triggered ajaxError handler. " + status)};// alert("AJAX error: "+status); };

	var myAjax = new _b.Ajax();
	myAjax.makeRequest( url, meth, onSuccessFunc, onErrorFunc );

};





_b.AutoSuggest.prototype.setSuggestions = function (req, input)
{
	// if field input no longer matches what was passed to the request
	// don't show the suggestions
	//

	
	
	if (input != this.fld.value)
		return false;
	
	
	this.aSug = [];
	
	
	if (this.oP.json)
	{
		var jsondata = eval('(' + req.responseText + ')');
		
		for (var i=0;i<jsondata.results.length;i++)
		{
			this.aSug.push(  { 'id':jsondata.results[i].id, 'value':jsondata.results[i].value, 'info':jsondata.results[i].info }  );
		}
	}
	else
	{

		var xml = req.responseXML;
	
		// traverse xml
		//

		//var results = xml.getElementsByTagName('results')[0].childNodes;

		if (this.oP.varclass == "street"){

			var results = xml.getElementsByTagName('rbs-str-liste')[0].childNodes;

			for (var i=0;i<results.length;i++)
			{
				if (results[i].nodeType == 1){
					//this.aSug.push(  { 'id':results[i].getAttribute('id'), 'value':results[i].childNodes[0].nodeValue, 'info':results[i].getAttribute('info') }  );
					var myres = results[i];
					var str = myres.getElementsByTagName('strname');
					var strnr = myres.getAttribute('strnr');
					var strtyp = myres.getAttribute('strtyp');
					var strname = str.item(0).textContent;
					var bezliste = myres.getElementsByTagName('rbs-bez-liste').item(0);
					if (bezliste.nodeType == 1){
						for (k=0;k<bezliste.childNodes.length;k++){
							if (bezliste.childNodes.item(k).nodeType == 1){
								if(bezliste.childNodes.item(k).tagName == 'rbs-bez'){
									var bezs = bezliste.childNodes.item(k);
									var beznr = bezs.getAttribute('beznr');
									for (var j=0;j<bezs.childNodes.length;j++){
										if (bezs.childNodes.item(j).nodeType == 1){
											if (bezs.childNodes.item(j).tagName == 'bezname'){
												var bezname = bezs.childNodes.item(j).textContent;												
											}
											if (bezs.childNodes.item(j).tagName == 'rbs-ot'){
												var ot = bezs.childNodes.item(j);
												var otnr = ot.getAttribute('otnr');
												var otname = ot.getElementsByTagName('otname').item(0).textContent;
												this.aSug.push({'id': strnr + '_' + beznr, 'value': strname, 'info1': otname, 'info2': bezname, 'info3': discr + otnr, 'info4': discr + strnr, 'info5': strtyp })
											}

										}
									}
								}
								
							}
						}
						
					}
				}
					//var strnr = str.getAttribute('strnr');
					//var bez = str.getElementsByTagName('rbs-bez');
					//var bezname = bez.childNodes[0].nodeValue;
					//this.aSug.push(  { 'id':i, 'value':results[i].childNodes[0].nodeValue, 'info':results[i].getAttribute('info') }  );
			}
		}else if(this.oP.varclass == "house"){
			var fil = this.oP.filter;
			var results = xml.getElementsByTagName('rbs-adr-liste')[0].childNodes;
			for (var i=0;i<results.length;i++)
			{
				if (results[i].nodeType == 1){
					var myres = results[i];
					var hausnr = myres.getAttribute('hausnr');
					var hausnrz = myres.getAttribute('hausnrz');
					var postleit = myres.getAttribute('postleit');
					var bzknr = myres.getAttribute('beznr');
					var k1000 = myres.getAttribute('k1000');
					var k5000 = myres.getAttribute('k5000');
					var xstat = myres.getAttribute('xstat');
					var ystat = myres.getAttribute('ystat');
					var etrs89_x = myres.getAttribute('etrs89_x');
					var etrs89_y = myres.getAttribute('etrs89_y');
					var coord = k1000 + '$' + k5000 + '$' + xstat + '$' + ystat + '$' + etrs89_x + '$' + etrs89_y;
					if (fil.length > 0) {
						if (postleit == fil){
							this.aSug.push({'id': i, 'value': hausnr+hausnrz, 'info1': discr + bzknr, 'info2': discr + postleit, 'info3': discr + hausnr, 'info4': discr + hausnrz, 'info5': discr+coord});
						}
					} else {
						this.aSug.push({'id': i, 'value': hausnr+hausnrz, 'info1': discr + bzknr, 'info2': discr + postleit, 'info3': discr + hausnr, 'info4': discr + hausnrz, 'info5': discr+coord});
					}
					
				}
			}

		}else if(this.oP.varclass == "zipcode"){
			var plzarr = [];
			var results = xml.getElementsByTagName('rbs-adr-liste')[0].childNodes;
			for (var i=0;i<results.length;i++){
				if (results[i].nodeType == 1){
					var myres = results[i];
					var postleit = myres.getAttribute('postleit');
					var hausnr = myres.getAttribute('hausnr');
					var hausnrz = myres.getAttribute('hausnrz');
					var bzknr = myres.getAttribute('beznr');
					var k1000 = myres.getAttribute('k1000');
					var k5000 = myres.getAttribute('k5000');
					var xstat = myres.getAttribute('xstat');
					var ystat = myres.getAttribute('ystat');
					var etrs89_x = myres.getAttribute('etrs89_x');
					var etrs89_y = myres.getAttribute('etrs89_y');
					var coord = k1000 + '$' + k5000 + '$' + xstat + '$' + ystat + '$' + etrs89_x + '$' + etrs89_y;
					if (!plzarr.includes(postleit)){
						this.aSug.push({'id': i, 'value': postleit, 'info1': discr + bzknr, 'info2': discr + hausnr+hausnrz, 'info3': discr + hausnr, 'info4': discr + hausnrz, 'info5': discr+coord});
						plzarr.push (postleit);
					}

				}
			}

		}
	
	}

	this.idAs = "as_"+this.fld.id;
	

	this.createList(this.aSug);

};



_b.AutoSuggest.prototype.createList = function(arr)
{
	var pointer = this;
	
	
	
	
	// get rid of old list
	// and clear the list removal timeout
	//
	_b.DOM.remE(this.idAs);
	this.killTimeout();
	
	
	// if no results, and shownoresults is false, do nothing
	//
	if (arr.length == 0 && !this.oP.shownoresults)
		return false;
	
	
	// // create holding div
	// //
	// var div = _b.DOM.cE("div", {id:this.idAs, className:this.oP.className});	
	
	// var hcorner = _b.DOM.cE("div", {className:"as_corner"});
	// var hbar = _b.DOM.cE("div", {className:"as_bar"});
	// var header = _b.DOM.cE("div", {className:"as_header"});
	// header.appendChild(hcorner);
	// header.appendChild(hbar);
	// div.appendChild(header);
	
	
	
	
	// // create and populate ul
	// //
	// var ul = _b.DOM.cE("ul""as_ul", {id:"as_ul"});
	var ul = _b.DOM.cE("ul",{id:this.idAs, className:this.oP.className});
	//var ul = _bsn.DOM.createElement("ul", {id:this.idAs, className:this.oP.className}); this.idAs
	
	
	
	// loop throught arr of suggestions
	// creating an LI element for each suggestion
	//
	for (var i=0;i<arr.length;i++)
	{
		// format output with the input enclosed in a EM element
		// (as HTML, not DOM)
		//
		var val = arr[i].value;
		var st = val.toLowerCase().indexOf( this.sInp.toLowerCase() );
		var output = val.substring(0,st) + "<em>" + val.substring(st, st+this.sInp.length) + "</em>" + val.substring(st+this.sInp.length);
		
		
		var span 		= _b.DOM.cE("span", {}, output, true);
		// if (arr[i].info != "")
		// {
		// 	var br			= _b.DOM.cE("br", {});
		// 	span.appendChild(br);
		// 	var small		= _b.DOM.cE("small", {}, arr[i].info);
		// 	span.appendChild(small);
		// }

		if (arr[i].info1 != "" && arr[i].info1.indexOf(discr) == -1 )
		{
			// var br			= _b.DOM.cE("br", {});
			// span.appendChild(br);
			var small		= _b.DOM.cE("small", {}, ', ' + arr[i].info1);
			span.appendChild(small);
		}

		if (arr[i].info2 != "" && arr[i].info2.indexOf(discr) == -1 )
		{
			// var br			= _b.DOM.cE("br", {});
			// span.appendChild(br);
			var small		= _b.DOM.cE("small", {}, ', ' + arr[i].info2);
			span.appendChild(small);
		}

		if (arr[i].info3 != "" && arr[i].info3.indexOf(discr) == -1 )
		{
			// var br			= _b.DOM.cE("br", {});
			// span.appendChild(br);
			var small		= _b.DOM.cE("small", {}, ', ' + arr[i].info3);
			span.appendChild(small);
		}

		if (arr[i].info4 != "" && arr[i].info4.indexOf(discr) == -1 )
		{
			// var br			= _b.DOM.cE("br", {});
			// span.appendChild(br);
			var small		= _b.DOM.cE("small", {}, ', ' + arr[i].info3);
			span.appendChild(small);
		}
		
		var a 			= _b.DOM.cE("a", { href:"#" });
		
		var tl 		= _b.DOM.cE("span", {className:"tl"}, " ");
		var tr 		= _b.DOM.cE("span", {className:"tr"}, " ");
		a.appendChild(tl);
		a.appendChild(tr);
		
		a.appendChild(span);
		
		a.name = i+1;
		a.onclick = function () { pointer.setHighlightedValue(); return false; };
		a.onmouseover = function () { pointer.setHighlight(this.name); };
		
		var li = _b.DOM.cE(  "li", {}, a  );
		
		ul.appendChild( li );
	}

	//var ul = _bsn.DOM.createElement("ul", {id:this.idAs, className:this.oP.className});
	
	
	// var pointer = this;
	// for (var i=0;i<arr.length;i++)
	// {
	// 	var a = _b.DOM.cE("a", { href:"#" }, arr[i]);
	// 	//var a = _bsn.DOM.createElement("a", { href:"#" }, arr[i]);
	// 	a.onclick = function () { pointer.setValue( this.childNodes[0].nodeValue ); return false; }
	// 	var li = _b.DOM.cE(  "li", {}, a  );
	// 	//var li = _bsn.DOM.createElement(  "li", {}, a  );
	// 	ul.appendChild(  li  );
	// }
	
	var pos = _b.DOM.getPos(this.fld);
	
	ul.style.left = pos.x + "px";
	ul.style.top = ( pos.y + this.fld.offsetHeight ) + "px";
	ul.style.width = this.fld.offsetWidth+"px";
	ul.onmouseover = function(){ pointer.killTimeout() }
	ul.onmouseout = function(){ pointer.resetTimeout() }

    if (ul.children.length > 0) {
        document.getElementsByTagName("body")[0].appendChild(ul);
    }

	if (ul.offsetHeight > this.oP.maxheight && this.oP.maxheight != 0)
	{
		ul.style['height'] = this.oP.maxheight;
	}
	
	
	
	// // no results
	// //
	// if (arr.length == 0 && this.oP.shownoresults)
	// {
	// 	var li = _b.DOM.cE(  "li", {className:"as_warning"}, this.oP.noresults  );
	// 	ul.appendChild( li );
	// }
	
	
	// div.appendChild( ul );
	
	
	// var fcorner = _b.DOM.cE("div", {className:"as_corner"});
	// var fbar = _b.DOM.cE("div", {className:"as_bar"});
	// var footer = _b.DOM.cE("div", {className:"as_footer"});
	// footer.appendChild(fcorner);
	// footer.appendChild(fbar);
	// div.appendChild(footer); 
	
	
	
	// // get position of target textfield
	// // position holding div below it
	// // set width of holding div to width of field
	// //
	// var pos = _b.DOM.getPos(this.fld);
	
	// div.style.left 		= pos.x + "px";
	// div.style.top 		= ( pos.y + this.fld.offsetHeight + this.oP.offsety ) + "px";
	// div.style.width 	= this.fld.offsetWidth + "px";
	
	
	
	// // set mouseover functions for div
	// // when mouse pointer leaves div, set a timeout to remove the list after an interval
	// // when mouse enters div, kill the timeout so the list won't be removed
	// //
	// div.onmouseover 	= function(){ pointer.killTimeout() };
	// div.onmouseout 		= function(){ pointer.resetTimeout() };


	// // add DIV to document
	// //
	// document.getElementsByTagName("body")[0].appendChild(div);
	

	// this.fld.onkeydown = function(ev)
	// {
	// 	var key = (window.event) ? window.event.keyCode : ev.keyCode;

	// 	switch(key)
	// 	{
    //         case RETURN:
    //         ev.stopPropagation();
    //         pointer.setHighlightedValue();
    //         pointer.nInputChars = pointer.fld.value.length;
    //         pointer.aSuggestions = [];
    //         pointer.clearSuggestions();
    //         return false;

    //         case TAB:
	// 		pointer.setHighlightedValue();
    //         break;

	// 		case ESC:
	// 		pointer.clearSuggestions();
	// 		break;

	// 		case KEYUP:
	// 		pointer.changeHighlight(key);
	// 		return false;
	// 		break;

	// 		case KEYDN:
	// 		pointer.changeHighlight(key);
	// 		return false;
	// 		break;
	// 	}

	// };
	
	
	// currently no item is highlighted
	//
	this.iHigh = 0;
	
	
	// remove list after an interval
	//
	var pointer = this;
	this.toID = setTimeout(function () { pointer.clearSuggestions() }, this.oP.timeout);
};


_b.AutoSuggest.prototype.changeHighlight = function(key)
{	
	var list = _b.DOM.gE(this.idAs);
	if (!list)
		return false;
	
	var n;

	if (key == 40)
		n = this.iHigh + 1;
	else if (key == 38)
		n = this.iHigh - 1;
	
	
	if (n > list.childNodes.length)
		n = list.childNodes.length;
	if (n < 1)
		n = 1;
	
	console.log(this.iHigh)
	this.setHighlight(n);
};



_b.AutoSuggest.prototype.setHighlight = function(n)
{
	var list = _b.DOM.gE(this.idAs);
	if (!list)
		return false;
	
	if (this.iHigh > 0)
		this.clearHighlight();
	
	this.iHigh = Number(n);
	

	//--Move scrollbar when necessary--
	var listh = list.clientHeight;
	var offseth = list.offsetHeight;
	var lscrolltop = list.scrollTop;
	var elem = list.children.item(n-1);
	var elemh = list.children.item(n-1).clientHeight;
	var viewport = lscrolltop + listh;
	var elemoffset = elemh * (this.iHigh-1);

	if (list.scrollHeight  > list.clientHeight){
		var scrollBottom = list.clientHeight + list.scrollTop;
		var elementBottom = elem.offsetTop + elem.offsetHeight;
		if (elementBottom > scrollBottom){
			list.scrollTop = elementBottom - list.clientHeight;
		} else if (elem.offsetTop < list.scrollTop){
			list.scrollTop = elem.offsetTop;
		}
	}
	

	// console.log ("selected: ", this.iHigh-1 , "element h", elemh, "viewport: ", viewport, "elemoffset",  elemoffset, "Scrolltop", lscrolltop, "List height", listh, "List offserheight", offseth);


	list.childNodes[this.iHigh-1].className = "highlight";// "as_highlight";
	list.childNodes[this.iHigh-1].focus();

	// console.log(this.iHigh)
	
	this.killTimeout();
};


_b.AutoSuggest.prototype.clearHighlight = function()
{
	var list = _b.DOM.gE(this.idAs);
	if (!list)
		return false;
	
	if (this.iHigh > 0)
	{
		list.childNodes[this.iHigh-1].className = "";
		this.iHigh = 0;
	}
};


_b.AutoSuggest.prototype.setHighlightedValue = function ()
{
	
	if (this.iHigh)
	{
		this.sInp = this.fld.value = this.aSug[ this.iHigh-1 ].value;
		
		// move cursor to end of input (safari)
		//
		this.fld.focus();
		if (this.fld.selectionStart)
			this.fld.setSelectionRange(this.sInp.length, this.sInp.length);
		

		this.clearSuggestions();

		
		// pass selected object to callback function, if exists
		//
		if (typeof(this.oP.callback) == "function")
			this.oP.callback( this.aSug[this.iHigh-1] );

			
	}
};













_b.AutoSuggest.prototype.killTimeout = function()
{
	clearTimeout(this.toID);
};

_b.AutoSuggest.prototype.resetTimeout = function()
{
	clearTimeout(this.toID);
	var pointer = this;
	this.toID = setTimeout(function () { pointer.clearSuggestions() }, 1000);
};







_b.AutoSuggest.prototype.clearSuggestions = function ()
{
	
	this.killTimeout();
	
	var ele = _b.DOM.gE(this.idAs);
	var pointer = this;
	if (ele)
	{
		var fade = new _b.Fader(ele,1,0,250,function () { _b.DOM.remE(pointer.idAs) });
	}
};










// AJAX PROTOTYPE _____________________________________________


if (typeof(_b.Ajax) == "undefined")
	_b.Ajax = {};



_b.Ajax = function ()
{
	this.req = {};
	this.isIE = false;
};



_b.Ajax.prototype.makeRequest = function (url, meth, onComp, onErr)
{
	
	if (meth != "POST")
		meth = "GET";
	
	this.onComplete = onComp;
	this.onError = onErr;
	
	var pointer = this;
	
	// branch for native XMLHttpRequest object
	if (window.XMLHttpRequest)
	{
		this.req = new XMLHttpRequest();
		this.req.onreadystatechange = function () { pointer.processReqChange() };
		this.req.open("GET", url, true); //
		this.req.send(null);
	// branch for IE/Windows ActiveX version
	}
	else if (window.ActiveXObject)
	{
		this.req = new ActiveXObject("Microsoft.XMLHTTP");
		if (this.req)
		{
			this.req.onreadystatechange = function () { pointer.processReqChange() };
			this.req.open(meth, url, true);
			this.req.send();
		}
	}
};


_b.Ajax.prototype.processReqChange = function()
{
	
	// only if req shows "loaded"
	if (this.req.readyState == 4) {
		// only if "OK"
		if (this.req.status == 200)
		{
			this.onComplete( this.req );
		} else {
			this.onError( this.req.status );
		}
	}
};










// DOM PROTOTYPE _____________________________________________


if (typeof(_b.DOM) == "undefined")
	_b.DOM = {};



/* create element */
_b.DOM.cE = function ( type, attr, cont, html )
{
	var ne = document.createElement( type );
	if (!ne)
		return 0;
		
	for (var a in attr)
		ne[a] = attr[a];
	
	var t = typeof(cont);
	
	if (t == "string" && !html)
		ne.appendChild( document.createTextNode(cont) );
	else if (t == "string" && html)
		ne.innerHTML = cont;
	else if (t == "object")
		ne.appendChild( cont );

	return ne;
};



/* get element */
_b.DOM.gE = function ( e )
{
	var t=typeof(e);
	if (t == "undefined")
		return 0;
	else if (t == "string")
	{
		var re = document.getElementById( e );
		if (!re)
			return 0;
		else if (typeof(re.appendChild) != "undefined" )
			return re;
		else
			return 0;
	}
	else if (typeof(e.appendChild) != "undefined")
		return e;
	else
		return 0;
};



/* remove element */
_b.DOM.remE = function ( ele )
{
	var e = this.gE(ele);
	
	if (!e)
		return 0;
	else if (e.parentNode.removeChild(e))
		return true;
	else
		return 0;
};



/* get position */
_b.DOM.getPos = function ( e )
{
	var e = this.gE(e);

	var obj = e;

	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	
	var obj = e;
	
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;

	return {x:curleft, y:curtop};
};










// FADER PROTOTYPE _____________________________________________



if (typeof(_b.Fader) == "undefined")
	_b.Fader = {};





_b.Fader = function (ele, from, to, fadetime, callback)
{	
	if (!ele)
		return 0;
	
	this.e = ele;
	
	this.from = from;
	this.to = to;
	
	this.cb = callback;
	
	this.nDur = fadetime;
		
	this.nInt = 50;
	this.nTime = 0;
	
	var p = this;
	this.nID = setInterval(function() { p._fade() }, this.nInt);
};




_b.Fader.prototype._fade = function()
{
	this.nTime += this.nInt;
	
	var ieop = Math.round( this._tween(this.nTime, this.from, this.to, this.nDur) * 100 );
	var op = ieop / 100;
	
	if (this.e.filters) // internet explorer
	{
		try
		{
			this.e.filters.item("DXImageTransform.Microsoft.Alpha").opacity = ieop;
		} catch (e) { 
			// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
			this.e.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity='+ieop+')';
		}
	}
	else // other browsers
	{
		this.e.style.opacity = op;
	}
	
	
	if (this.nTime == this.nDur)
	{
		clearInterval( this.nID );
		if (this.cb != undefined)
			this.cb();
	}
};



_b.Fader.prototype._tween = function(t,b,c,d)
{
	return b + ( (c-b) * (t/d) );
};