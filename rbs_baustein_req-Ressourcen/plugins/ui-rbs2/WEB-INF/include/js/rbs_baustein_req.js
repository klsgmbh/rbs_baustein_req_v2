//vvvv URLs des RBS Dienst vvvv
var urlrbsstrliste;
var urlrbsdata; 
//---- https://fbinter.stadt-berlin.de/rbs/rbs-str-liste-xml.jsp?
//---- für Strassen mit Übergabe von Parametern. Hier sind Straßenname strname, Straßennummer strnr, 
//---- Bezirksnummer beznr und Ortsteilnummer otnr möglich.
function geturlrbsstrliste(){
    var res = "";
    res = assistants.xpath.select("urlrbs", "string(rbs_url/url_1)");
    return res;
}


//---- https://fbinter.stadt-berlin.de/rbs/rbs-data-xml.jsp?
//---- für Adressen mit Übergabe von Parametern. Hier sind Straßennummer strnr Pflicht, Hausnummer 
//---- hausnr, Bezirksnummer beznr und Ortsteilnummer otnr möglich. 
function geturlrbsdata(){
    var res = "";
    res =  assistants.xpath.select("urlrbs", "string(rbs_url/url_2)");
    return res;
}

//^^^^ URLs des RBS Dienst ^^^^



function checkReadOnly(){
	if (assistants.scope.current === 'eid'){
        return true; //read from eID
	}else{
		if (myForm.user){
			if (myForm.user.modeid == '3'){
				return true; //Firmenkunde
			}else{
				if (myForm.user.levelid == '3') {
					return true; //hÃ¶here Sicherheitstufe BÃ¼rger
				}else{
					return false;
				}
			}
		}else{
			return false;
		}
	}
}



// ---- die Validierung einer Adresse ist positive, wenn RBS die Adresse eindeutig in Berlin identifiziert hat
// ---- und liefert die Bezirksnummer.
function validateAddress(){
    var res = false
    if (myForm.F00000035h.toLowerCase() !== "berlin"){
        return false;
    }else if (myForm.F00000035h.toLowerCase() == "berlin") {
        if (myForm.bzrnr != '') {
            var adr = callbzrinfo();
            myForm.bzrnameh = adr.bzrname;
            myForm.otnameh = adr.otname;
            res = true;
        }
    }else{
        res = false
    }    
	return res;
}

function callbzrinfo(){
    var res;
    var strname = myForm.F00000053h;
    var hnr = myForm.F00000016h;
    var hnrz = myForm.F00000084h;
    var plz = myForm.F00000054h;
    var city = "berlin";
    res = callCheckAddress(strname,hnr,hnrz,plz,city)
    return res;
}

function rbsrule(){
    var res = true;
    if (myForm.rbs_valid != undefined && myForm.F00000035h != undefined){
        if (myForm.rbs_valid !== true){
            if (myForm.F00000035h.toLowerCase() === "berlin"){
                res = false;
            }
        }
    }
    return res;
}

function selectDistrict(){
    myForm.bzrnr = myForm.beznum;
    myForm.otnr = myForm.otnum;
    if (myForm.bzrnr != ""){
        myForm.bzrname = myForm['beznum/@label'];
    }else{
        myForm.bzrname = "";
    }
    if (myForm.otnr != ""){
        myForm.otname = myForm['otnum/@label'];
    }else{
        myForm.otname = "";
    }
}

/*
	the values for res are the names of the pages (<body id="">)
	where only Berlin addresses are allowed and 
	should be validated.
*/

// function onlyBerlin(){
    // var res = "foo; bar; rbs";
    // return res;
// }

function ro(){
    if (assistants.scope.current === 'eid' && myForm.id_feld){
        return true;
    } else {
        return false;
    }
}
//---------------- Server side address validation --------------------------//



function validateTestaddress(strnam, hnur, hnurz, zipcode, city){
    var address = "";
        if (city.toLowerCase() !== "berlin"){ return "";}

        adr = callCheckAddress(strnam,hnur,hnurz,zipcode,city);
        address = "strname: " + adr.strname + "; " + "strnr: " + adr.strnr + "; " + "hausnr: " + adr.hausnr + "; " + "hausnrz: " + adr.hausnrz + "; " +  "plz: " + adr.plz + "; " +  "bezname: " + adr.bzrname + "; " + "beznr: " + adr.beznr + "; " + "otname: " + adr.otname + "; " + "otnr: " + adr.otnr + "; " + "etrs89_x: " + adr.etrs89_x  + "; " + "etrs89_y: " + adr.etrs89_y;
        return address;
}


assistants.xpath.addNamespace('rbs', 'https://fbinter.stadt-berlin.de/rbs');

function isObjectEmpty(value) {
    return (
      Object.prototype.toString.call(value) === '[object Object]' &&
      JSON.stringify(value) === '{}'
    );
  }


function callCheckAddress(strname, hnr, hnrz, zipcode, city){
	var strnr = "";
	var arg = "";
    var address = {
        strname: "",
        strnr: "",
        hausnr: "",
        hausnrz: "",
        plz: "",
        bzrname: "",
        beznr: "",
        otname: "",
        otnr: "",
        etrs89_x: "",
        etrs89_y: ""
    };
    if (city.toLowerCase() !== 'berlin'){
        return address;
    }

    urlrbsstrliste = geturlrbsstrliste();
    urlrbsdata = geturlrbsdata();

	var oneAddress = assistants.rest(urlrbsdata + "strname={street}&hausnr={housenr}&hausnrz={housenrsx}", {
        street: strname,
        housenr: hnr,
        housenrsx: hnrz
    }).lazy()
    .get()
    .entity({
		200: response => {
			return response.entity;
			},
		404: response => {
			return undefined;
			}
	});
	
    if (oneAddress === undefined) {
        assistants.log.error("Diese Adresse existiert nicht");
        return address;
        //return {fehler: true, fehlerDetail: "Diese Adresse existiert nicht"};
    }else{
        var crbsadr = assistants.xpath.select(oneAddress, "count(/rbs:rbs-adr-liste/rbs:rbs-adr)");
        print("crbsadr: " + crbsadr);
        if (crbsadr == undefined){return address;}
        //if (crbsadr == 0){return address;}
        
        if (crbsadr < 1){
            //if address is not exact
            var strlist =[];
            //get the street numbers that correspond to this street name
            strlist = callStreetList(strname);
            //try each street nummer and house number until zipcodes are the same
            if(strlist.length > 0){
                for (var i = 0; i < strlist.length; i++){
                    // address = "";
                    print("checking street: " + strlist[i] + " from " + strlist.length + " streetnumbers");
                    address = getUniqueAddress(strlist[i],hnr,hnrz,zipcode);
                    // print ("address: " + address);
                    // if (address.beznr !== ""){
                        return address;
                    // }             
                }
            }else{
                return address;
            }
            
        }else if(crbsadr === 1){
            //Address is exact and verifiable
            var strname = assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/rbs:strname)");
            var strnr = assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/@strnr)");
            var beznr = assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/@beznr)");
            var bezname = assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/rbs:bezname)");
            var otnr =  assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/@otnr)");
            var otname =  assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/rbs:otname)");
            var etrs89x = assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/@etrs89_x)");
            var etrs89y = assistants.xpath.select(oneAddress, "string(//rbs:rbs-adr/@etrs89_y)");
            address = {
                strname: strname,
                strnr: strnr,
                hausnr: hnr,
                hausnrz: hnrz,
                plz: zipcode,
                beznr: beznr,
                bzrname: bezname,
                otnr: otnr,
                otname: otname,
                etrs89_x: etrs89x,
                etrs89_y: etrs89y
            };
            address = "strname: " + strname + "; " + "strnr: " + strnr + "; " + "hausnr: " + hnr + "; " + "hausnrz: " + hnrz + "; " +  "plz: " + zipcode + "; " +  "beznr: " + beznr + "; " +  "otnr: " + otnr + "; " + "etrs89_x" + etrs89x  + "; " + "etrs89_y" + etrs89y;
            print ("address: " + address);
            return address;
            
        }else{
            return address;
        }
        //return ("count rbs-adr-liste: " + strlist.length);
    }
}

function callStreetList(street){
    urlrbsstrliste = geturlrbsstrliste();
    var strarr = [];
    var streetlist = assistants.rest(urlrbsstrliste + "strname={street}", {
        street: street
    }).lazy()
    .get()
    .entity({
        200: response => {
            return response.entity;
        },
        404: response => {
            return undefined;
        }
    });
    if (streetlist === undefined) {
        assistants.log.error("Diese Adresse existiert nicht");
        return (strarr);
        //return {fehler: true, fehlerDetail: "Diese Adresse existiert nicht"};
    }else{
        var cliste = assistants.xpath.select(streetlist, "count(//rbs:rbs-str/@strnr)");
        //return cliste;
        if (cliste > 1) {
            var results = [];
            for (var i=1;i < cliste + 1; i++){
                var arg1 = "string(//rbs:rbs-str[";
                var arg2 = i;
                var arg3 = "]/@strnr)"
                var arg = arg1 + arg2 + arg3;
                var res = assistants.xpath.select(streetlist, arg);
                results.push(res);
            
            
        }
        
        return (results);
        }
    }
}

function getUniqueAddress(strnr,hnr,hnrz,zipcode){
    urlrbsstrliste = geturlrbsstrliste();
    urlrbsdata = geturlrbsdata();
    var address = {
        strname: "",
        strnr: "",
        hausnr: "",
        hausnrz: "",
        plz: "",
        bzrname: "",
        beznr: "",
        otname: "",
        otnr: "",
        etrs89_x: "",
        etrs89_y: ""
    };
    var streetlist = assistants.rest(urlrbsdata + "strnr={street}&hausnr={housenr}&hausnrz={housenrsx}", {
        street: strnr,
        housenr: hnr,
        housenrsx: hnrz
    }).lazy()
    .get()
    .entity({
		200: response => {
			return response.entity;
			},
		404: response => {
			return undefined;
			}
	});
    if (streetlist === undefined) {
        assistants.log.error("Diese Adresse existiert nicht");
        return address;
        //return {fehler: true, fehlerDetail: "Diese Adresse existiert nicht"};
    }else{
        var crbsadr = assistants.xpath.select(streetlist, "count(/rbs:rbs-adr-liste/rbs:rbs-adr)");
        print( "getunique: " + crbsadr);
        if(crbsadr === 1){
            var plz = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/@postleit)");
            
            if (zipcode === plz){ //compare zipcode and plz
                var strname = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/rbs:strname)");
                var strnr = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/@strnr)");
                var beznr = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/@beznr)");
                var bezname = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/rbs:bezname)");
                var otnr =  assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/@otnr)");
                var otname =  assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/rbs:otname)");
                var etrs89x = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/@etrs89_x)");
                var etrs89y = assistants.xpath.select(streetlist, "string(//rbs:rbs-adr/@etrs89_y)");
                address = {
                    strname: strname,
                    strnr: strnr,
                    hausnr: hnr,
                    hausnrz: hnrz,
                    plz: zipcode,
                    beznr: beznr,
                    bzrname: bezname,
                    otnr: otnr,
                    otname: otname,
                    etrs89_x: etrs89x,
                    etrs89_y: etrs89y
                };
                // address = "strname: " + strname + "; " + "strnr: " + strnr + "; " + "hausnr: " + hnr + "; " + "hausnrz: " + hnrz + "; " +  "plz: " + zipcode + "; " +  "beznr: " + beznr + "; " +  "otnr: " + otnr + "; " + "etrs89_x" + etrs89x  + "; " + "etrs89_y" + etrs89y;
                return address;
            }else{
                return address;
            }
            
            
        }else{
            return address;
        }
    }


}

//---------------- Server side address validation --------------------------//