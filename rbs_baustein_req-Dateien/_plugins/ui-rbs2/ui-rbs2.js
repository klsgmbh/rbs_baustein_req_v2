
/** Author:     Edgardo Moreira (moreira@knowlogysolutions.de)
 *  Version:    0.0.1   12.2018
 *              0.0.2   02.2019
 *              0.0.3   05.2019
 *              0.0.4   09.2019
 *              0.0.5   11.2019
 *              0.1.0   02.2020
 * 
 * To be used with ui-rbs2\bsnrbs.AutoSuggest_2.1.3.js
*/
//

var url_rbs_strliste;
var url_rbs_data;
var strs;
var bezn;
var strnr;
var plz;
var otnrh;
var hausnr;
var hausnrz;
var hnrh;
var tohnr;
var beznr;
var beznrh;
var otname;
var city;
var landh;
var objtyp;
var objtype;
var inputtext;
var optionstr;
var optionhnr;
var optionhnrto;
var optionplz;
var k1000;
var k5000;
var xstat;
var ystat;
var etrs89x;
var etrs89y;
var onlyber;
var bodyid;
var scrollable = ".autosuggest{height: 25%;overflow-y: auto;overflow:hidden;position: absolute;}"
var responding = false;
var meth = "GET";
var iseid;
var onlyberarr = [];



$(document).ready(function () {
    url_rbs_strliste = $('#id-input-urlrbsstrliste').val();
    url_rbs_data = $('#id-input-urlrbsdata').val();
    strs = $('#id-input-F00000053h');
    bezn = $('#id-input-bzrnameh');
    strnr = $('#id-input-strnrh');
    plz = $('#id-input-F00000054h');
    otnrh = $('#id-input-otnrh');
    hnrh = $('#id-input-hnrh');
    hausnr = $('#id-input-F00000016h');
    hausnrz = $('#id-input-F00000084h');
    tohnr = $('#id-input-bisF00000016');
    //beznr = $('#id-input-bzrnr');
    beznrh = $('#id-input-beznrh');
    otname = $('#id-input-otnameh');
    city = $('#id-input-F00000035h');
    landh = $('#id-input-landh');
    objtyp = $('#id-input-objtype');
    // k1000 = $('#id-input-k1000h');
    // k5000 = $('#id-input-k5000h');
    // xstat = $('#id-input-xstath');
    // ystat = $('#id-input-ystath');
    etrs89x = $('#id-input-etrs89_xh');
    etrs89y = $('#id-input-etrs89_yh');
    onlyber = $('#id-input-onlyberlin');
    iseid = $('#id-input-eid-true');
    body = $('body');

    var $company = $(".company");
    var $persondata = $(".persondata");
    var $rbs = $(".rbs");

    if ($company && $persondata && $rbs){
        $rbs.insertAfter(".company");
    }

    if (objtyp.length > 0) {objtype = objtyp.val().substr(0,objtyp.val().indexOf('|'))};

    //var objtype = objtyp.val().substr(0,objtyp.val().indexOf('|'))

if (onlyber.length > 0){
    $.each(onlyber.val().split(";"), function(){
        onlyberarr.push($.trim(this));
    });
    // onlyberarr = onlyber.val().split(";");
    // onlyberarr.trim();
    if (onlyberarr.indexOf(body.attr('id')) > -1){
        city.val("Berlin")
        city.prop("readonly", true);
        $('[class*="2_ro"]').hide();
    }
}    


if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) == true){
    plz.attr("autocomplete","new-password");
    otname.attr("autocomplete","new-password");
    bezn.attr("autocomplete","new-password");
    strs.attr("autocomplete","new-password");
    hnrh.attr("autocomplete","new-password");
    tohnr.attr("autocomplete","new-password");
}else{
    plz.attr("autocomplete","off");
    otname.attr("autocomplete","off");
    bezn.attr("autocomplete","off");
    strs.attr("autocomplete","off");
    hnrh.attr("autocomplete","off");
    tohnr.attr("autocomplete","off");
}

    strs.attr("list","autocompleteOff");
    hnrh.attr("list","autocompleteOff");
    tohnr.attr("list","autocompleteOff");
    plz.attr("list","autocompleteOff");

    
    strs.attr("autofill","off");
    hnrh.attr("autofill","off");
    tohnr.attr("autofill","off");
    plz.attr("autofill","off");
    
    var inputtext = strs.val();

    //hide ortnr 
    $('[class~="2_hide"]').hide();

    var getiseid = $("section[class*='infobox narrow iseid']");

    if (getiseid.length > 0){
        $('[class~="2_hide_eid"]').hide();
    }


    // if(iseid.val() === "1"){
    //     $('[class~="2_hide_eid"]').hide();
    // }

    var norbs = $('section.no-rbs');

    var checkagain = function(){
        if (!responding){
            checkConnection()
        }
    }
    if (strs.length > 0){checkagain()};

    addScrollBar(scrollable);
});

var nun = ""; 
var start_time = "";

function checkConnection(){

    try{
        nun = new Date().toUTCString();
        start_time = Date.parse(nun);
        resp = getRBSConnection(0)
        if (!resp){
            nun = new Date().toUTCString();
            start_time = Date.parse(nun);
            setTimeout(getRBSConnection(),2000);
        }
        //console.log(resp);
        //break;
    
    }catch (err){   
        console.log(err);
    }
}


// async function checkConnection(){

//     try{
//         let resp = await getRBSConnection()
//         console.log(resp);
//         //break;
    
//     }catch (err){   
//         console.log(err);
//     }
// }

function getRBSConnection(){
   
    var request = new XMLHttpRequest();
    
   
    
    //return new Promise(function(resolve, reject) {
        request.onreadystatechange = function (){
            if (this.readyState === request.DONE){
                if (this.status >= 300){
                    reject("Error, status code = " + this.status)
                } else {
                    
                    if (this.getAllResponseHeaders().indexOf("Date")){
                        var resp_time;
                        resp_time = Date.parse(this.getResponseHeader("Date"));
                        console.log (nun);
                        console.log (this.getResponseHeader("Date"));

                        if (resp_time > 0){
                            // if (resp_time - start_time >= 0){
                                responding = true;
                            //if (beznr.val() == ''){
                            if (beznrh.val() == ''){
                                checkAddress();
                            };
                            checkCity();
                            // //resolve (this.status);
                            // console.log( "Ajax request successful. Status: " + this.readyState );
                            // return true;
                        // } else {
                        //     console.log("Error, no connection!");
                        //     return false;
                        //     //reject("Error, no connection!");
                        // }
                    } else {
                        console.log("Error, no connection!");
                        return false;
                        //eject("Error, no connection!");
                    }
                    }else{
                        console.log("Error, no date header. Status: " + this.status);
                        return false;
                        //reject("Error, no date header. Status: " + this.status)
                    }
                }
            }
        }
        var url_ = ""
        
        url_ = url_rbs_strliste + 'strname=x&' + (new Date()).getTime();
        request.open('HEAD', url_, true);
        request.onerror = function() {
            console.log("** An error occurred during the transaction")
        };
        request.send(null);
    //});

}

function initRBS(){

    optionhnr = {
        script: function () {return url_rbs_data + "strnr=" + $('#id-input-strnrh').val() + '&otnr='+ $('#id-input-otnrh').val()},
        varclass: 'house',
        timeout:10000,
        maxentries: 2500,
        minchars: 0,
        callback: setval = function(resp){
            var val = '';
            val = resp.value;
            hnrh.val(val);
            // val = resp.info1;
            // val = val.substr(val.indexOf("%") + 1)
            // beznr.val(val);
            val = resp.info2;
            val = val.substr(val.indexOf("%") + 1)
            plz.val(val);
            val = resp.info3;
            val = val.substr(val.indexOf("%") + 1)
            hausnr.val(val);
            val = resp.info4;
            val = val.substr(val.indexOf("%") + 1)
            hausnrz.val(val);
            var coords = '';
            coords = resp.info5;
            val = coords.substring(coords.indexOf("%")+1, coords.indexOf("$"));
            // k1000.val(val);
            coords = coords.substring(coords.indexOf("$",1)+1);
            val = coords.substring(0, coords.indexOf("$"));
            // k5000.val(val);
            coords = coords.substring(coords.indexOf("$",1)+1);
            val = coords.substring(0, coords.indexOf("$"));
            // xstat.val(val);
            coords = coords.substring(coords.indexOf("$")+1);
            val = coords.substring(0, coords.indexOf("$"));
            // ystat.val(val);
            coords = coords.substring(coords.indexOf("$")+1);
            val = coords.substring(0, coords.indexOf("$"));
            etrs89x.val(val);
            coords = coords.substring(coords.indexOf("$")+1);
            val = coords;
            etrs89y.val(val);
        }
    };

    optionhnrto = {
        script: function () {return url_rbs_data + "strnr=" + $('#id-input-strnrh').val() + '&otnr='+ $('#id-input-otnrh').val()},
        varclass: 'house',
        timeout:10000,
        maxentries: 2500,
        callback: setval = function(resp){
            var val = resp.value;
            tohnr.val(val);
            
        }
    };

    optionstr = {
        script: url_rbs_strliste,
        varname: "strname",
        varclass: "street",
        filter: plz.val(),
        timeout:3000,
        maxentries: 2500,
        // maxresults: 35,
        callback: setval = function(resp){
            var val = '';
            val = resp.id;
            val = val.substr(val.indexOf("_") + 1);
            //beznr.val(val);
            beznrh.val(val);
            val = resp.info3;
            val = val.substr(val.indexOf("%") + 1)
            otnrh.val(val);
            val = resp.info4;
            val = val.substr(val.indexOf("%") + 1)
            strnr.val(val);
            val = resp.info5;
            val = val.substr(val.indexOf("%") + 1)
            $("#id-input-objtype").val(val + '|' + val);
            plz.val('');
            strs.val(resp.value);
            otname.val(resp.info1);
            bezn.val(resp.info2);
            hnrh.val('').keypress();
        }

        };

    optionplz = {
        script: function () {return url_rbs_data + "strnr=" + $('#id-input-strnrh').val() + '&otnr='+ $('#id-input-otnrh').val() },
        varclass: 'zipcode',
        timeout:10000,
        maxentries: 20,
        callback: setval = function (resp) {
            plz.value = resp.value;
            var val = '';
            val = resp.info1;
            val = val.substr(val.indexOf("%") + 1)
            beznrh.val(val);
            var coords = '';
            coords = resp.info5;
            val = coords.substring(coords.indexOf("%")+1, coords.indexOf("$"));
            // k1000.val(val);
            coords = coords.substring(coords.indexOf("$",1)+1);
            val = coords.substring(0, coords.indexOf("$"));
            // k5000.val(val);
            coords = coords.substring(coords.indexOf("$",1)+1);
            val = coords.substring(0, coords.indexOf("$"));
            // xstat.val(val);
            coords = coords.substring(coords.indexOf("$")+1);
            val = coords.substring(0, coords.indexOf("$"));
            // ystat.val(val);
            coords = coords.substring(coords.indexOf("$")+1);
            val = coords.substring(0, coords.indexOf("$"));
            etrs89x.val(val);
            coords = coords.substring(coords.indexOf("$")+1);
            val = coords;
            etrs89y.val(val);
          }
    }

}

function checkCity(){
    if (city.val() != undefined){
        if (city.val().toLowerCase() === "berlin"){// && landh.val().indexOf("000") >= 0){ // === "000|Deutschland") {
            initRBS();
            var str_xml = new bsnrbs.AutoSuggest('id-input-F00000053h', optionstr);
            var hnr_xml = new bsnrbs.AutoSuggest('id-input-hnrh', optionhnr);
            var hnr_xml = new bsnrbs.AutoSuggest('id-input-bisF00000016', optionhnrto);
            var plz_xml = new bsnrbs.AutoSuggest('id-input-F00000054h', optionplz);
            return true;
        }else{
            //beznr.val('');
            beznrh.val('');
            //plz.val('');
            bezn.val('');
            otname.val('');
            otnrh.val('');
            strnr.val('');
            optionstr = '';
            optionhnr = '';
            optionhnrto = '';
            optionplz = '';
            // k1000.val('');
            // k5000.val('');
            // xstat.val('');
            // ystat.val('');
            etrs89x.val('');
            etrs89y.val('');
            bsnrbs.AutoSuggest('id-input-F00000053h', optionstr);
            bsnrbs.AutoSuggest('id-input-hnrh', optionhnr);
            bsnrbs.AutoSuggest('id-input-bisF00000016', optionhnrto);
            bsnrbs.AutoSuggest('id-input-F00000054h', optionplz);
            return false;
        }
    }
};

function checkAddress(){
	if (city.val() != undefined){
		if (city.val().toLowerCase() == 'berlin'){
            //alert ('beBerlin');
			if (strnr.val().length > 0){ //&& plz.val().length > 0){ //&& hnrh.val().length > 0){// && beznr.val().length < 1){
				var requestURL = url_rbs_data + 'strnr=' + strnr.val() + '&hausnr=' + hnrh.val();
				var request = new XMLHttpRequest();
				request.onreadystatechange = function (){
					if (this.readyState == 4 && this.status == 200){
						getDistrictNr(this);
					}
				};
				request.open('GET', requestURL, true);
				request.send();
            }
		
		}

	}
};

function getDistrictNr(req){
    var respdom = req.responseXML;
    var results = respdom.getElementsByTagName('rbs-adr-liste')[0].childNodes;
    if (results.length == 3){
        for (var i=0;i<results.length;i++)
        {
            if (results[i].nodeType == 1){
                var myres = results[i];
                var postleit = myres.getAttribute('postleit');
                if (postleit.length > 0){
                    plz.val(postleit);
                    beznrh.val(myres.getAttribute('beznr'));
                    //beznr.val(myres.getAttribute('beznr'));
                    getCoords(myres);
                    //console.log(plz.val());
                }else{
                    myres= '';
                    getCoords(myres);
                    if (beznrh.val().length > 0) {beznrh.val('')};
                }
            }
        }
    }else{
            beznrh.val('');
            myres= '';
            getCoords(myres);
    }
};

function getCoords(myres){
    if (myres !='') {
        // k1000.val(myres.getAttribute('k1000'));
        // k5000.val(myres.getAttribute('k5000'));
        // xstat.val(myres.getAttribute('xstat'));
        // ystat.val(myres.getAttribute('ystat'));
        etrs89x.val(myres.getAttribute('etrs89_x'));
        etrs89y.val(myres.getAttribute('etrs89_y'));
    }else{
        // k1000.val('');
        // k5000.val('');
        // xstat.val('');
        // ystat.val('');
        etrs89x.val('');
        etrs89y.val('');
    }
}


function checkStreet(){
	if (city.val() != undefined){
		if (city.val().toLowerCase() == 'berlin'){
			//alert ('beBerlin');
			if (strnr.val().length > 0 || strs.val().length > 0){ //|| strnr.val.length > 0){ //&& plz.val().length > 0){ //&& hnrh.val().length > 0){// && beznr.val().length < 1){
                var requestURL = url_rbs_strliste;
                var argnr = "strnr=" + strnr.val() + '&otnr='+ $('#id-input-otnrh').val();
                var args = "strname=" +strs.val() + '&otnr='+ $('#id-input-otnrh').val();
                if (meth == "GET"){
                    if (strnr.val().length > 0){
                        requestURL = requestURL + argnr; // "https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?strnr=" + strnr.val() + '&otnr='+ $('#id-input-otnr').val();
                    }else{
                        requestURL = requestURL + args; //"https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?strname=" + strs.val() + '&otnr='+ $('#id-input-otnr').val();
                    }
                }				
				var request = new XMLHttpRequest();
				request.onreadystatechange = function (){
					if (this.readyState == 4 && this.status == 200){
						getStreetNr(this);
					}
				};
				request.open(meth, requestURL, true);
				if (meth == "GET"){
                    request.send();
                }else if (meth == "POST") {
                    if (strnr.val().length > 0){
                        request.send(argnr); // "https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?strnr=" + strnr.val() + '&otnr='+ $('#id-input-otnr').val();
                    }else{
                        request.send(args); //"https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?strname=" + strs.val() + '&otnr='+ $('#id-input-otnr').val();
                    }
                    

			    }

		    }
        }
    }
};

// function checkStreet(){
// 	if (city.val() != undefined){
// 		if (city.val().toLowerCase() == 'berlin'){
// 			//alert ('beBerlin');
// 			if (strnr.val().length > 0 || strs.val().length > 0){ //|| strnr.val.length > 0){ //&& plz.val().length > 0){ //&& hnrh.val().length > 0){// && beznr.val().length < 1){
// 				var requestURL = "";
// 				if (strnr.val().length > 0){
// 				    requestURL = "https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?strnr=" + strnr.val() + '&otnr='+ $('#id-input-otnr').val();
// 				}else{
// 					requestURL = "https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?strname=" + strs.val() + '&otnr='+ $('#id-input-otnr').val();
//                 }
// 				var request = new XMLHttpRequest();
// 				request.onreadystatechange = function (){
// 					if (this.readyState == 4 && this.status == 200){
// 						getStreetNr(this);
// 					}
// 				};
// 				request.open('GET', requestURL, true);
// 				request.send();
// 			}

// 		}
// 	}

// };

function getStreetNr(req){
    var respdom = req.responseXML;
    var results = respdom.getElementsByTagName('rbs-str-liste')[0].childNodes;
    if (results.length >= 3){
        for (var i=0;i<results.length;i++)
        {
            if (i > 2){break;}
            if (results[i].nodeType == 1){
                var myres = results[i];
                var str = myres.getElementsByTagName('strname');
                var strnr_ = myres.getAttribute('strnr');
                var strtyp_ = myres.getAttribute('strtyp');
                var strname = str.item(0).textContent;
                if (strname != strs.val()){return true};
                var bezliste = myres.getElementsByTagName('rbs-bez-liste').item(0);
					if (bezliste.nodeType == 1){
                        if (bezliste.childNodes.length >= 3){
                            if (bezliste.childNodes.item(1).nodeType == 1){
                                var bezs = bezliste.childNodes.item(1);
                                var beznr_ = bezs.getAttribute('beznr');
                                if (bezs.childNodes.length == 5){
                                    var bezn_ = bezs.childNodes.item(1).textContent;
                                    var ot = bezs.childNodes.item(3);
                                    var otnr_ = ot.getAttribute('otnr');
                                    var otnam_ = ot.getElementsByTagName('otname').item(0).textContent;
                                    strs.val(strname); strnr.val(strnr_); objtyp.val(strtyp_ + "| " + strtyp_); bezn.val(bezn_); beznrh.val(beznr_);  otname.val(otnam_); otnrh.val(otnr_); checkAddress();     
                                    //strs.val(strname); strnr.val(strnr_); objtyp.val(strtyp_ + "| " + strtyp_); bezn.val(bezn_); beznr.val(beznr_); beznrh.val(beznr_);  otname.val(otnam_); otnr.val(otnr_); checkAddress();     

                                    // strs.val(strname); strnr.val(strnr_); hnrh.val(''); objtyp.val(strtyp_ + "| " + strtyp_); bezn.val(bezn_); beznr.val(beznr_); beznrh.val(beznr_);  otname.val(otnam_); otnr.val(otnr_); checkAddress();     
                                }
                            }

                        }
                    }
            }
        }
    }

}

function setHouseNrSx(){
    var $nrs = '';
    var $letters = '';
    var harr;
    if (hnrh.length > 0){
        var hnrval = hnrh.val().trim();
        var hnrzval = "";
        harr = hnrval.split(/([a-zA-Z]+|[0-9]+)/); //[a-zA-Z]+|[0-9]+
        for (var i=0;i<harr.length;i++){
            if(i==1){
                hausnr.val(harr[i]);
            } else{
                if (harr[i].length>0){
                    hnrzval += harr[i];
                    hausnrz.val(hnrzval.trim());
                }
                    
            }
        }
    }else{
        hausnr.val('');
        hausnrz.val('');
    }
}

$(document).on("focusin", ".inputcontainer", function (e) {
    if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) == true){
        $('#id-input-F00000054h').attr("autocomplete","new-password");
        $('#id-input-otnameh').attr("autocomplete","new-password");
        $('#id-input-bzrnameh').attr("autocomplete","new-password");
        $('#id-input-F00000053h').attr("autocomplete","new-password");
        $('#id-input-hnrh').attr("autocomplete","new-password");
        $('#id-input-hnrh').attr("autofill","off");
        $('#id-input-bisF00000016').attr("autocomplete","new-password");
    }else{
        $('#id-input-F00000054h').attr("autocomplete","off");
        $('#id-input-otnameh').attr("autocomplete","off");
        $('#id-input-bzrnameh').attr("autocomplete","off");
        $('#id-input-F00000053h').attr("autocomplete","off");
        $('#id-input-hnrh').attr("autocomplete","off");
        $('#id-input-bisF00000016').attr("autocomplete","off");
    }
});


$(document).on("change", "#id-input-F00000035h", function () {
    //console.log($(this).val());
    //if (responding != true){return;}
    etrs89x.val("");
    etrs89y.val("");
    if (checkCity() == true) {
        strs.val("");
        strnr.val("");
    };
});

$(document).on("change", "#id-input-landh", function () {
    //console.log($(this).val());
    if (responding != true){return;}
    etrs89x.val("");
    etrs89y.val("");
    if (checkCity() == true) {
        strs.val("");
        strnr.val("");
    };
});

$(document).on("focusout", "#id-input-hnrh", function () {
    //console.log($(this).val());
    if (responding != true){return;}
    $('button#default-button.submit-forward').attr("disabled", false);
    if (checkCity() == true){
        hausnr.val("");
        hausnrz.val("");
        setHouseNrSx();
        plz.val("");
        //beznrh.val('');
        checkAddress();
    }
});

$(document).on("change", "#id-input-hnrh", function () {
    //console.log($(this).val());
    //if (responding != true){return;}
    etrs89x.val("");
    etrs89y.val("");
});

$(document).on("focusout", "#id-input-F00000054h", function () {
    //console.log($(this).val());
    etrs89x.val("");
    etrs89y.val("");
    if (responding != true){return;}
    $('button#default-button.submit-forward').attr("disabled", false);
    if (checkCity() == true){checkAddress();}
    
});

$(document).on("focusout", "#id-input-F00000053h", function (e) {
    //console.log($(this).val());
    etrs89x.val("");
    etrs89y.val("");
    if (responding != true){return;}
    $('button#default-button.submit-forward').attr("disabled", false);
    if (checkCity() == true){
        //strnr.val("");
        checkStreet();
        checkAddress();
    }
});

$(document).on("change", "#id-input-F00000053h", function (e) {
    //console.log($(this).val());
    etrs89x.val("");
    etrs89y.val("");
    plz.val("");
    if (responding != true){return;}
    plz.val("");
    strnr.val("");
    beznrh.val("");
});



$(document).on("focusin","#id-input-F00000053h", function (e) {
    if (responding != true){return;}
    $('button#default-button.submit-forward').attr("disabled", true);
})

$(document).on("focusin","#id-input-hnrh", function (e) {
    if (responding != true){return;}
    $('button#default-button.submit-forward').attr("disabled", true);
})

$(document).on("focusin","#id-input-F00000054h", function (e) {
    if (responding != true){return;}
    $('button#default-button.submit-forward').attr("disabled", true);
})


$(document).on("focusout", "#id-input-hnrh", function (e) {
    $(".autosuggest").fadeOut();
    //console.log("fadeout hnrh");
});

$(document).on("focusout", "#id-input-F00000053h", function (e) {
    $(".autosuggest").fadeOut();
    //console.log("fadeout str");
});


$(document).on("focusout", "#id-input-F00000054h", function (e) {
    $(".autosuggest").fadeOut();
    //console.log("fadeout plz");
});

$(document).on("focusout", "#id-input-bisF00000016", function (e) {
    $(".autosuggest").fadeOut();
    //console.log("fadeout 2hnr");
});

// $(document).on("mouseleave", ".autosuggest", function (e) {
//     $(".autosuggest").fadeOut();
//     //console.log("fadeout 2hnr");
// });
// $(document).on("focusout", "button#default-button.submit.forward", function (e) {
//     if (onlyberarr.indexOf(body.attr('id')) > -1){
//         checkAddress();
//     }
// })

function addScrollBar(rule){
    var css = document.createElement('style'); // Creates <style></style>
    css.type = 'text/css'; // Specifies the type
    if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
    else css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName("head")[0].appendChild(css); // Specifies where to place the css
}
