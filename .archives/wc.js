window.wc         = window.wc         || {};
window.wc.session = window.wc.session || {};
window.wc.local   = window.wc.local   || {};

window.wcENV = window.wcENV || "prod";
window.wcAPP = window.wcAPP || "NOT-SET";
window.wcURL = window.wcURL || "http://www.melify.com/tk/lib/components/w";

// FOR WINDOZE
if(typeof(console) === 'undefined') {console = {}}

/////////////////////////////////////////////////////////////////////////////////
//// string to hash
/////////////////////////////////////////////////////////////////////////////////
String.prototype.hash = function() {
  var self = this, range = Array(this.length);
  for(var i = 0; i < this.length; i++) {
    range[i] = i;
  }
  return Array.prototype.map.call(range, function(i) {
    return self.charCodeAt(i).toString(16);
  }).join('');
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.log = function(...data) {
    return console.log(...data);
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.group = function(...data) {
    return console.group(...data);
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.groupEnd = function(...data) {
    return console.groupEnd(...data);
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.info = function(...data) {
    wc.logger(...data);
    return console.info(...data);
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.warn = function(...data) {
    return console.warn(...data);
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.error = function(...data) {
    return console.error(...data);
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.timeout(function(){
////     alert("A")
//// }, 1000, 1);	 
/////////////////////////////////////////////////////////////////////////////////
wc.timeout = function(func, wait, times) {
    if (typeof times === "undefined") {
	times = 1;
    }

    var interv = function(w, t) {
	return function(){
	    if(typeof t === "undefined" || t-- > 0){
		setTimeout(interv, w);

		try{
		    func.call(null);
		}
		catch(e){
		    t = 0;
		    throw e.toString();
		}
	    }
	};
    }(wait, times);

    setTimeout(interv, wait);
};

/////////////////////////////////////////////////////////////////////////////////
//// STRING TO TITLE
/////////////////////////////////////////////////////////////////////////////////
wc.toTitle = function(str) {
    str = str.toLowerCase().split(' ');

    for (var i = 0; i < str.length; i++) {
	str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }

    return str.join(' ');
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.notify = function(options) {
    var noty = new Noty(options);
    
    if (options.show) {
        noty.show();
    }
    
    if (options.include) {
        $("#" + options.id + " .noty_body").load(options.include);
    }
    
    if (options.width) {
        $("#" + options.id).parent().width(options.width);
    }
    
    return noty;
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.logger = function(str) {
    //wc.group("wc.logger:", str);
    
    var myNoty = wc.notify({
        width:		"100%",
        theme:		"bootstrap-v4",
        type:		"info",
        modal:		false,
        killer:		true,
        show:		true,
        text:		str,
	layout:		"bottomCenter",
	closeWith:	['click'],
	timeout:	5000
    })

    $(".wc-logger").html(str);
    
    //wc.groupEnd();
}

////////////////////////////////////////////////////////////////////////////////////
////
//// wc.waitFor(function() {
////    return $(".navbar").length
//// }, function() {
////    alert("A");
//// });
////
////////////////////////////////////////////////////////////////////////////////////
wc.waitFor = function(condition, callback) {
    if(!condition()) {
        wc.log('waiting');
        window.wc.timeout(waitFor.bind(null, condition, callback), 300); /* this checks the flag every 300 milliseconds*/
    } else {
        wc.log('done');
        callback();
    }
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.infoTest = function() {
    wc.group("wc.infoTest");
    
    var myNoty = wc.notify({
        id:           "my-notify",
        width:        "500px",
        theme:        "bootstrap-v4",
        type:         "info",
        layout:       "centerRight",
        timeout:      "3000",
        modal:        false,
        killer:       false,
        show:         true,
        text:         "Mel was here...", // WILL BE IGNORE IF HAVE "include"
        include:      "/tk/lib/components/w/html/parts/noty/info.html",
    })
    
    wc.groupEnd();
    return myNoty;
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.warningTest = function() {
    wc.group("wc.warningTest");
    
    var myNoty = wc.notify({
        id:           "my-notify",
        width:        "500px",
        theme:        "bootstrap-v4",
        type:         "warning",
        layout:       "topRight",
        timeout:      "3000",
        modal:        false,
        killer:       false,
        show:         true,
        text:         "Mel was here...", // WILL BE IGNORE IF HAVE "include"
        include:      "/tk/lib/components/w/html/parts/noty/info.html",
    })
    
    wc.groupEnd();
    return myNoty;
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.errorTest = function() {
    wc.group("wc.errorTest");
    
    var myNoty = wc.notify({
        id:           "my-notify",
        width:        "500px",
        theme:        "bootstrap-v4",
        type:         "error",
        layout:       "center",
        timeout:      "3000",
        modal:        true,
        killer:       false,
        show:         true,
        text:         "Mel was here...", // WILL BE IGNORE IF HAVE "include"
        include:      "/tk/lib/components/w/html/parts/noty/info.html",
    })
    
    wc.groupEnd();
    return myNoty;
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.dialogTest = function() {
    wc.group("wc.dialogTest");

    var myNoty = wc.notify({
        id:           "my-notify",
        closeWith:    "button",
        width:        "500px",
        theme:        "bootstrap-v4",
        type:         "default",
        layout:       "center",
        timeout:      "",
        modal:        true,
        killer:       false,
        show:         true,
        text:         "Mel was here...", // WILL BE IGNORE IF HAVE "include"
        include:      "/tk/lib/components/w/html/parts/noty/info.html",
	
        buttons: [
	    Noty.button('I AGREE', 'btn btn-outline-success btn-noty', function () {
                wc.log('btn-ok clicked');
	    }),
	    Noty.button('I Disagree', 'btn btn-outline-secondary btn-noty', function () {
                wc.log('btn-close clicked');
                myNoty.close();// CLOSE DIALOG
	    })
        ]
    })
    
    wc.groupEnd();
    return myNoty;
}

////////////////////////////////////////////////////////////////////////////////////
////
////////////////////////////////////////////////////////////////////////////////////
wc.workingTest = function() {
    wc.group("wc.workingTest");
    
    var myNoty = wc.notify({
        id:           "my-notify",
        closeWith:    "button",
        width:        "500px",
        theme:        "bootstrap-v4",
        type:         "transparent",
        layout:       "center",
        timeout:      "4000",
        modal:        true,
        killer:       false,
        show:         true,
        text:         "<div style=text-align:center><img src='/tk/img/common/loading.3.gif'/></div>"
    })
    
    wc.groupEnd();
    return myNoty;
}

////////////////////////////////////////////////////////////////////////////////////
//// EXECUTE A PIECE OF CODE SO MANY TIMES
////
//// wc.interval(function(){
////     wc.log("waiting...")
//// }, 1000, 10);
////
////  timeout, how many times to try
////////////////////////////////////////////////////////////////////////////////////
wc.interval = function(func, wait, times){
    var interv = function(w, t){
        return function(){
	    if(typeof t === "undefined" || t-- > 0){
                wc.timeout(interv, w);

                try{
		    func.call(null);
                }
                catch(e){
		    t = 0;
		    throw e.toString();
                }
	    }
        };
    }(wait, times);

    wc.timeout(interv, wait);
};

////////////////////////////////////////////////////////////////////////////////////
//// 
////////////////////////////////////////////////////////////////////////////////////
wc.type = function(obj) {
    wc.group("wc.type:", obj);

    wc.groupEnd()
    return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
}

////////////////////////////////////////////////////////////////////////////////////
//// 
////////////////////////////////////////////////////////////////////////////////////
wc.getAttributes = function(node) {
    wc.group("wc.getAttributes", node);

    var i, attributeNodes = node.attributes, length = attributeNodes.length, attrs = {};
    
    for ( i = 0; i < length; i++ ) {
	attrs[attributeNodes[i].name] = attributeNodes[i].value;
    }

    wc.groupEnd();
    return attrs;
}

////////////////////////////////////////////////////////////////////////////////////
//// SAVE STATS IN EACH OBJECT
////////////////////////////////////////////////////////////////////////////////////
wc.setStats = function(obj, cname, version) {
    wc.group("wc.setStats:", cname, version);
    
    this.img = document.createElement("img");

    wc.log("wcENV:", wcENV, "wcURL:", wcURL, "wcAPP:", wcAPP);

    ga('send', {'hitType':'event', 'eventCategory':'wc-setstatus', 'eventAction':'setStats', 'eventLabel':cname, 'eventValue':JSON.stringify({'env':wcENV,'app':wcAPP,'url':wcURL})});

    wc.log("wcENV:", wcENV, "wcURL:", wcURL, "wcAPP:", wcAPP);

    this.img = document.createElement("img");

    this.img.src =
	wcURL + "/assets/ma.gif?" +
	"app=" +  wcAPP +
	"&comp=" + cname + "&ver=" + version +
	"&date=" + escape(new Date()) + 
	"&browser=" + escape(navigator.userAgent) +
	"&url=" + location.protocol + "//" + location.host + location.pathname;
    
    this.img.style.display = "none";
    obj.appendChild(this.img)
    
    window.dataLayer = window.dataLayer || []; window.dataLayer.push({
    	"wcEvent": "wcTrigger",
    	"wcAction": "wc-create",
    	"wcName": cname,
    	"wcVersion": version,
    	"wcApp": window.wcAPP,
    	"wcEnv": window.wcENV,
    	"wcUrl": document.location
    });
    
    wc.groupEnd()
}

////////////////////////////////////////////////////////////////////////////////////
//// REPLACED BY PUBSUB
////////////////////////////////////////////////////////////////////////////////////
window.publish = PubSub.publish;
wc.publish     = PubSub.publish;
wc.publishSync = PubSub.publishSync;
wc.subscribe   = PubSub.subscribe;

////////////////////////////////////////////////////////////////////////////////////
////  wc.publish("wc-maker", {
////      id: this.id,
////      user: "Mel",
////      action: "click"
////  });
////////////////////////////////////////////////////////////////////////////////////
// wc.publish = function(publisher, label, data) {
//     wc.group("wc.publish", publisher.id, label, data);

//     if (1) {
// 	PubSub.publish(label,data);
//     } else {
// 	var event = document.createEvent('CustomEvent');
// 	event.initCustomEvent(label, true, true, data);
// 	publisher.dispatchEvent(event);
//     }

//     ga('send', {'hitType':'event', 'eventCategory':'wc-publish', 'eventAction':'publish', 'eventLabel':label, 'eventValue':JSON.stringify(data)});
    
//     window.dataLayer = window.dataLayer || []; window.dataLayer.push({
//     	"wcEvent": "wcTrigger",
//     	"wcAction": "wc-publish",
//     	"wcName": label,
//     	"wcTime": data.time,
//     	"wcId": data.id,
//     	"wcAction": data.action,
// 	"wcParam": data.uparam
//     });

//     wc.groupEnd();
// };

////////////////////////////////////////////////////
//// GENERAL PUBLISH METHOD
//// to be used for testing by react, ...
////////////////////////////////////////////////////
// window.publish = function(id, values) {
//     wc.group("window.publish", id, values);

//     if (1) {
// 	PubSub.publish(id,values);
//     } else {
// 	var event = document.createEvent('CustomEvent');
// 	event.initCustomEvent(id, true, true, values);
// 	document.dispatchEvent(event);
//     }

//     wc.groupEnd();
//     return values;
// }

////////////////////////////////////////////////////
//// GENERAL PUBLISH METHOD
////////////////////////////////////////////////////
// wc.publish2 = function(id, values) {
//     wc.group("wc.publish2", id, values);

//     if (1) {
// 	PubSub.publish(id,values);
//     } else {
// 	var event = document.createEvent('CustomEvent');
// 	event.initCustomEvent(id, true, true, values);
// 	document.dispatchEvent(event);
//     }

//     wc.groupEnd();
// }

////////////////////////////////////////////////////////////////////////////////////
////  wc.subscribe("wc-maker", function(e) {
////      wc.log(">>>>>>>", e.detail);
////  });
////////////////////////////////////////////////////////////////////////////////////
// wc.subscribe = function(name, callback) {
//     wc.group("wc.subscribe", name);

//     if (1) {
// 	PubSub.subscribe(name,callback);
//     } else {
// 	window.addEventListener(name, callback, true);
//     }

//     ga('send', {'hitType':'event', 'eventCategory':'wc-subscribe','eventAction':'subscribe', 'eventLabel': name, 'eventValue':JSON.stringify({'env':wcENV,'app':wcAPP,'url':wcURL})});
    
//     window.dataLayer = window.dataLayer || []; window.dataLayer.push({
//     	"wcEvent": "wcTrigger",
//     	"wcAction": "wc-subscribe",
//     	"wcName": name,
//     	"wcApp": window.wcAPP,
//     	"wcEnv": window.wcENV,
//     	"wcUrl": wcURL
//     });

//     wc.groupEnd();
// };

////////////////////////////////////////////////////////////////////////////////////
//// equivalend of $().load()
////
////	wc.load($("wc-maker")[0],"/mtk/render?callback=tk::dummy::3")
////	    .then(function(value) {
////		wc.log(">>>>>>>>>>>>", value);
////	    })
////	    .fail(function(value) {
////		wc.log(">>>>>>>>>>>>", value);
////	    });
////
////////////////////////////////////////////////////////////////////////////////////
// wc.load = function(element, url, type) {
//     wc.group("wc.load", element.id, url, type);

//     var deferred = $.Deferred();

//     $.ajax({
// 	url: url, 
// 	type: type || 'get',
// 	error: function(XMLHttpRequest, textStatus, errorThrown){
// 	    wc.error('HOUSTON WE HAVE PROBLEM IN: ' + url);
// 	    deferred.reject('HOUSTON WE HAVE PROBLEM IN: ' + url);
// 	},
// 	success: function(data){
// 	    element.innerHTML = data;
// 	    deferred.resolve('SUCCESS');
// 	}
//     });

//     wc.groupEnd();
//     return deferred.promise();
// }

///////////////////////////////////////////////////////////////////////////////////////////
//// wc.ajax("post", "/mtk/render", "ajax=1&callback=packer", function(data, status, xhr) {
////     $("#container-results").append(data);
//// });
///////////////////////////////////////////////////////////////////////////////////////////
// wc.ajax = function(method, url, data, success) {
//     wc.group("wc.ajax:", method, url, data);

//     $.ajax({
// 	url: url,
// 	type: method,
// 	data: data,
// 	success: success
//     });

//     wc.groupEnd();
//     return true;
// }

//////////////////////////////////////////////////
// CHROME OR FIREFOX ONLY
//////////////////////////////////////////////////
wc.check4chrome = function() {
    wc.group("wc.check4chrome");
    
    // ALLOW LOCALHOST (any hostname not having .net or .com etc.)
    if (window.location.hostname.indexOf('.') != -1) {
	wc.groupEnd();
	return
    }
    
    wc.timeout(function(){
	if (wc.detectIE() != false) {
	    document.location.href = "/Melify/mtk/dev/tk/noie.html";
	}
    }, 500);

    wc.groupEnd();
};

//////////////////////////////////////////////////
// IF CONDITION READY
//////////////////////////////////////////////////
// LOOP 3 TIMES AND FAIL
// -----------------------------------------------
// wc.when(function() {
//     return $("#xx").length;
// }, 1000, 3)
//   .then(function(args) {
//       $("body").append("<h1>" + args + "<h1>");
//   }).fail(function(args) {
//       alert(args);
//   });
/////////////////////////////////////////////////
wc.when = function(condition, wait, times, deferred) {
    wc.group("wc.when:", times);
    
    const WC_NTIMES = 20;

    if (typeof times == "undefined") {
	times = WC_NTIMES;
    }

    if (typeof deferred == "undefined") {
	var deferred = $.Deferred();
    }

    var cond = condition();

    if (cond) {
	// RETURN CONDITION() VALUE
	deferred.resolve(cond);
	wc.log("condition met.");
    } else {
	wc.timeout(() => {
	    if (times <= 1) {
		wc.error("wc.when failed !");
		deferred.reject("FAILED ON CONDITION");
	    } else {
		wc.when(condition, wait, --times, deferred)
	    }
	}, wait);
    }

    wc.groupEnd();
    return deferred.promise();
};

//////////////////////////////////////////////////
// 
// wc.wait4("#xx", function(ele) {
//     console.log(ele)
// });
//
/////////////////////////////////////////////////
wc.wait4 = function(element, callback) {
    wc.group("wc.wait4:", element);

    var observer = new MutationObserver(function(mutations, me) {
	var ele = $(element)[0];
	
	if (ele) {
	    callback(ele);
	    me.disconnect();
	    return;
	}
    });

    observer.observe(document, {
	childList: true,
	subtree: true
    });

    wc.groupEnd();
}

//////////////////////////////////////////////////
// CREATE ROUND (CIRCLE) BUTTONS
/////////////////////////////////////////////////
wc.rounded = function() {
    wc.group("wc.rounded");

    $(".wc-rounded, .btn-round, .btn-circle").css("visibility","hidden");
    
    $(".wc-rounded, .btn-round, .btn-circle").each(function() {
	let w = $(this).width();

	// GET LINE HEIGHT
	var f = $(this).css('font-size');
	var h = Math.floor(parseInt(f));
	
	// + 10 TO MAKE IT REAL ROUND
	$(this).height(w + 10);

	$(this).css({
	    "text-align": "center",
	    "display":"table-cell",
	    "vertical-align":"middle",
	    "line-height": h + 3 + "px",
	    "white-space": "normal"
	});

	$(this)[0].style.setProperty('border-radius', '999px', 'important');
    });

    $(".wc-rounded, .btn-round, .btn-circle").css("visibility","visible");

    wc.groupEnd();
}

//////////////////////////////////////////////////
// DOES A JSON FILE OR URL EXIST
/////////////////////////////////////////////////
wc.fileExist = function(url) {
    wc.group("wc.fileExist:", url);

    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    
    if (xhr.status == "404") {
	wc.groupEnd();
        return false;
    } else {
	wc.groupEnd();
        return true;
    }

    wc.groupEnd();
}

//////////////////////////////////////////////////
// INTEGER > DOLLAR
/////////////////////////////////////////////////
wc.int2Dollar = function(amt) {
    wc.group("wc.int2Dollar:", amt);

    let rval = (amt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  // 12,345.67

    wc.groupEnd();
    return rval;
}

//////////////////////////////////////////////////
// DOLLAR > INTEGER
/////////////////////////////////////////////////
wc.dollar2Int = function(amt) {
    wc.group("wc.dollar2Int:", amt);

    let rval = Number(amt.replace(/[^0-9\.]+/g, ""));

    wc.groupEnd();
    
    return rval;
}

//////////////////////////////////////////////////
// wc.maskMoney("[type=text]",{
//     precision: 2,
//     prefix: "$ ",
//     decimal: ",",
//     thousands: ".",
//     allowNegative: false,
//     allowZero: true
// })
//////////////////////////////////////////////////
wc.maskMoney = function(eid, options) {
    wc.group("wc.maskMoney:", eid);
    
    $(eid).maskMoney(options);

    wc.groupEnd();
}

///////////////////////////////////////////////////////////
// scroll any table to top, bottom or any number of rows
//////////////////////////////////////////////////////////
wc.scroll2row = function(tid,rid) {
    wc.group("wc.scroll2row:", tid, rid);

    var rows = document.querySelectorAll("#" + tid + " tr");
    
    switch(rid)
    {
	case "top":
	rid = 1;
	break;

	case "bottom":
	rid = $(rows).length-1;
	break;
    }

    rows[rid].scrollIntoView({behavior: 'smooth',block: 'center'});

    wc.groupEnd();
}

/////////////////////////////////////////////////////////
// camelcase a string like mel-was-here to melWasHere
////////////////////////////////////////////////////////
wc.camelize = function(string) {
    return string.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
}

////////////////////////////////////////////////////////////////////////////////////
//// sleep(2000)
////////////////////////////////////////////////////////////////////////////////////
wc.sleep = function(ms) {
    var dt = new Date();
    dt.setTime(dt.getTime() + ms);
    while (new Date().getTime() < dt.getTime()) {
        $.noop();
    }
}

///////////////////////////////////////////////////////////////
// get ele styles like: wc.getStyels($("h1")[0])
// from: /GitHub/jQuery-Scoped-CSS-plugin/jquery.scoped.js
//////////////////////////////////////////////////////////////
wc.getStyles = function(element) {
    var temp, styles, n, key;

    if (element.currentStyle) {
        //We work with a style object in IE and Opera rather than the text
        wc.sleep(50); //50ms delay to allow for external stylesheet parsing.
        return element.currentStyle;
    }

    //We extract and process the ComputedCSSStyleObject into text
    temp = document.defaultView.getComputedStyle(element, null);
    styles = '';
    for (n in temp) {
        if (parseInt(n, 10)) {
	    key = wc.camelize(temp[n]);
	    if (temp[key] !== undefined) {
		styles += temp[n] + ':' + temp[key] + ';\n';
	    }
        }
    }

    return styles;
}

///////////////////////////////////////////////////////////////
// GENERATE A UNIQUE ID
//////////////////////////////////////////////////////////////
wc.uid = function() {
    return Math.random().toString(36).substr(2, 9);
}

///////////////////////////////////////////////////////////////
// FIND NAME FROM KEY
//   let rval = wc.jfind(tkRegex, "name", pat)
//////////////////////////////////////////////////////////////
wc.jfind = function(jarray, key, name) {
    wc.group("wc.jfind:", jarray, key, name);

    var rval = $.grep(jarray, function(item) {
	return item[key] == name
    });
    
    wc.groupEnd();
    return rval;
}

///////////////////////////////////////////////////////////////
// INPUT MASKING
//   https://unmanner.github.io/imaskjs/guide.html
//
//   wc.mask("text-1", Number)
//   wc.mask("text-1", Number, {min:0, max:10000})
//
//////////////////////////////////////////////////////////////
wc.imask = function(id,mask,vargs) {
    wc.group("wc.imask", id,mask,vargs)

    var element = document.getElementById(id);
    
    var maskOptions = {
	mask: mask,
    };
    
    if (vargs) {
	Object.assign(maskOptions, vargs);
    }
    
    var mask = IMask(element, maskOptions);
    
    wc.groupEnd();
    return mask;
}

/////////////////////////////////////////////////////////////////////////////////
//// BIND ALL [data-keys]
/////////////////////////////////////////////////////////////////////////////////
wc.binder = function() {
    wc.group("wc.binder")

    $("[data-key]").each(function() {
	let id = $(this).attr("id");

	// IF THERE IS NO ID ASSIGN ONE
	if (typeof id === "undefined") {
	    $(this).attr("id",wc.uid())
	    id = $(this).attr("id");
	}

	tkBind(id, tkBinder);
    });

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// GET CURRENT QUARTER
/////////////////////////////////////////////////////////////////////////////////
wc.getQuarter = function() {
    wc.group("wc.quarter")

    var date = new Date();     
    var quarter =  parseInt(date.getMonth() / 3 ) + 1 ;

    wc.groupEnd();
    return quarter;
}

/////////////////////////////////////////////////////////////////////////////////
//// GET CURRENT QUARTER
/////////////////////////////////////////////////////////////////////////////////
wc.positiveNumber = function(n) {
    return (n>0?'+':'') + n;
}

/////////////////////////////////////////////////////////////////////////////////
////    Example:
////	    wc.enterKey("#my-text", function() {
////		alert($("#my-text").val())
////	    });
/////////////////////////////////////////////////////////////////////////////////
wc.enterKey = function(ele, callback) {
    wc.group("wc.enterKey")

    $(ele).on('keydown', function(e) {
	if (e.which == 13) {
            e.preventDefault();
	    callback();
	}
    });

    wc.groupEnd();
    return ele;
}

/////////////////////////////////////////////////////////////////////////////////
////    Example:
////	    wc.ctrlKey("z", function() {
////		alert("ENTERED Ctrl+z")
////	    });
/////////////////////////////////////////////////////////////////////////////////
wc.ctrlKey = function(char, callback) {
    wc.group("wc.ctrlKey:", char)

    document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && event.key === char) {
	    callback(char);
	}
    });
    
    wc.groupEnd();
    return true;
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.table
/////////////////////////////////////////////////////////////////////////////////
wc.table = function(ele, params) {
    wc.group("wc.table")

    if ($(ele).length == 0) {
	alert("NO SUCH ELEMENT (wc.wait4): " + ele);
	wc.groupEnd();
	return
    }

    $(ele).dataTable(params);

    $(".dataTables_filter [type=search]").css({
	border:"1px #ccc solid",
	height: "30px",
	paddingLeft: "10px",
	width: "200px"
    });

    $(".dataTables_filter label").css({
	"text-transform":"uppercase",
	"font-size":"14px",
	"font-family": "far"
    })

    wc.groupEnd();
    return ele;
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.getCSV
//// NEED: /tk/lib/components/w//js/ext/jquery.csv.js
//// EXAMPLE: /Melify/tools/getCSV.html
/////////////////////////////////////////////////////////////////////////////////
wc.getCSV = function(filename, callback) {
    wc.group("wc.getCSV")

    $.ajax({
	type: "GET",  
	url: filename,
	dataType: "text",       
	success: function(response) {
	    callback($.csv.toArrays(response));
	}
    });

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.csv2table
//// NEED: /tk/lib/components/w//js/ext/jquery.csv.js
//// EXAMPLE: /Melify/tools/csv2table.html
//// *** INCOMPLETE ***
/////////////////////////////////////////////////////////////////////////////////
wc.csv2table = function(parent, filename, cls) {
    wc.group("wc.csv2table")

    cls = cls || "";

    var str = `<table class="${cls}"><thead><tr>`;

    wc.getCSV(filename, function(data) {
	// THEAD
	for (var i = 0; i < data[0].length; i++) {
	    str += `<th class="c-${i}">${data[0][i].replace(/ /g,'')}</th>`;
	}
	
	str += "</tr></thead><tbody>";

	let footer = "<tfoot><tr>"
	let once = false;

	// TBODY
	for (var i = 1; i < data.length; i++) {
	    str += "<tr>"

	    for (var j = 0; j < data[i].length; j++) {
		if (!once) {
		    footer += "<td></td>"
		}
		
		str += `<td class="c-${j}">${data[i][j]}</td>`;
	    }

	    str += "</tr>"
	    once = true;
	}
	
	footer += "</tr></tfoot>"

	str += `<tbody>${footer}</table>`;

	$(parent).append(str);
    });

    console.log(str);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// EXPORT TABLE TO csv
////
////	$("#btn-export").on("click", function() {
////	    wc.table2csv.apply(this, [$("#my-table"), "output-file.csv"]);
////	});
////
/////////////////////////////////////////////////////////////////////////////////
wc.table2csv = function($table, filename) {
    wc.group("wc.table2csv")

    var $rows = $table.find('tr:has(th),tr:has(td)'),

        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0),  // null character

        colDelim = '","',
        rowDelim = '"\r\n"',

        csv = '"' + $rows.map(function(i, row) {
            var $row = $(row),
                $cols = $row.find('th,td');

            return $cols.map(function(j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
        .split(tmpRowDelim).join(rowDelim)
        .split(tmpColDelim).join(colDelim) + '"',

        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    if (window.navigator.msSaveBlob) {
	window.navigator.msSaveOrOpenBlob(new Blob([csv], {
	    type: "text/plain;characterset=utf-8;"
	}), filename)
    } else {
	$(this).attr({
	    "download": filename,
	    "href": csvData,
	    "target": "_blank"
	});
    }

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// TRANSFER EVENTS FROM ONE INPUT TO ANOTHER
//// wc.transferEvents("#src", "#dst")
/////////////////////////////////////////////////////////////////////////////////
wc.linkInputs = function(src, dst) {
    wc.group("wc.linkInputs:", src, dst)

    // TRANSFER EVENTS
    $(src).on("keyup", function() {
	$(dst).val($(this).val()).trigger("keyup")
    });

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// FIX TABLE HEADER
//// USAGE: wc.fixTH("my-table", 100)
/////////////////////////////////////////////////////////////////////////////////
wc.fixTH = function(ele, offset) {
    wc.group("wc.fixTH:", ele, offset)

    if ($("#" + ele + "-anchor").length == 0) {
	$("#" + ele).after(`<div id="${ele}-anchor" style="height:0"></div>`);
    }
    
    $(window).scroll(() => {
	var scroll = $(window).scrollTop();
	var anchor_top = $("#" + ele).offset().top - offset;
	var anchor_bottom = $(`#${ele}-anchor`).offset().top;

	if (scroll > anchor_top && scroll < anchor_bottom) {
	    clone_table = $("#clone");
	    
	    if(clone_table.length == 0){
		clone_table = $("#" + ele).clone();
		clone_table.attr('id', 'clone');
		clone_table.css({position:'fixed','pointer-events': 'none',top:offset + "px"});
		clone_table.width($("#" + ele).width());

		$("#table-container").append(clone_table);
		$("#clone").css({visibility:'hidden'});
		$("#clone thead").css({visibility:'visible'});
	    }
	} else {
	    $("#clone").remove();
	}

	wc.groupEnd();
    });
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.dbQuery = function(restURL, successCB, errorCB) {
    wc.group("wc.query:", restURL)

    $.getJSON(restURL, function(data) {
	successCB(data)
    }).fail(function(jqXHR, textStatus, errorThrown) {
	errorCB([])
    });

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.popstate = function(func) {
    wc.group("wc.popstate")

    window.addEventListener('popstate', func);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.pushstate = function(page) {
    wc.group("wc.pushstate")

    history.pushState(null, null, "?page=" + page);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.refreshed = function(page) {
    wc.group("wc.refreshed")

    if (performance.navigation.type == 1) {
	var rval =  true;
    } else {
	var rval =  false;
    }
    
    wc.groupEnd();
    return rval;
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.parseQuery = function() {
    wc.group("wc.parseQuery")

    var queryString = document.location.search;

    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');

        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }

    wc.log("QUERY:", query);

    wc.groupEnd();
    return query;
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.isChrome = function(page) {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

/////////////////////////////////////////////////////////////////////////
//// ipad
/////////////////////////////////////////////////////////////////////////////
wc.isIPAD = function() {
    return navigator.userAgent.match(/iPad/i) != null;
}

/////////////////////////////////////////////////////////////////////////
//// wc.detectIE
/////////////////////////////////////////////////////////////////////////////
wc.detectIE = function() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');

    if (msie > 0) {
	// IE 10 or older 
	//Do some stuff
    } else if (trident > 0) {
	// IE 11 
	//Do some stuff
    } else if (edge > 0) {
	// Edge 
	//Do some stuff
    } else {
	// other browser
	return false;
    }
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.resizer = function() {
    wc.group("wc.resizer")

    if (wc.isChrome) {
	$("body").append(`
	<a style="display:none" id="wc-resizer" href='javascript:void((function(d)%7Bif(self!%3Dtop%7C%7Cd.getElementById(%27toolbar%27)%26%26d.getElementById(%27toolbar%27).getAttribute(%27data-resizer%27))return false%3Bd.write(%27<!DOCTYPE HTML><html style%3D"opacity:0%3B"><head><meta charset%3D"utf-8"/></head><body>
	<a data-viewport="375x667"   data-icon="mobile" data-version="7">Apple iPhone 6/7</a>
	<a data-viewport="375x812"   data-icon="mobile" data-version="X">Apple iPhone X</a>
	<a data-viewport="768x1024"  data-icon="tablet" data-version="P">Apple iPad</a>
	<a data-viewport="1024x1366" data-icon="tablet" data-version="PP">Apple iPad Pro</a>
	<script src="/Melify/tools/resizer/resizer.js"></script>
	</body></html>%27)%7D)(document))%3B'></a>`);

	jQuery(document).ready(function() {
	    $("#wc-resizer").bind("click", function() {
		window.location.href = $(this).attr("href");
	    });

	    $("#wc-resizer").click();
	});
    }
    
    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.upload = function(fname,content) {
    wc.group("wc.upload")

    if ($("#mtk-upload-form").length == 0) {
	$("body").append(`
		<form id="mtk-upload-form" method="post" class=d-none>
		    <input type="text" id="mtk-upload-fname" name="uploadfname"/><br>
		    <textarea id="mtk-upload-content" name="uploadcontent">HELLO</textarea>
		</form>`);
    }

    $("#mtk-upload-fname").val(fname)
    $("#mtk-upload-content").val(content)

    wc.log("uploading to file:", fname);

    $("#mtk-upload-form").on("submit", function(e) {
	e.preventDefault();
	
	let x = $(this).serialize()

	$.ajax({
	    url: "/mac/upload",
	    type: "post",
	    data: x,
	    success:function() {
		console.log("SUCCESS")
	    }
	});
    });

    $("#mtk-upload-form").submit()
    
    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.today = function() {
    wc.group("wc.today")

    return new Date().toISOString().slice(0,10);
    
    wc.groupEnd();
}

//////////////////////////////////////////////////
// COMMIFY
/////////////////////////////////////////////////
wc.commify = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/////////////////////////////////////////////////////////////////////////////////
//// GET CURRENT QUARTER
/////////////////////////////////////////////////////////////////////////////////
wc.getQuarter = function() {
    wc.group("wc.quarter")

    var date = new Date();    
    var quarter =  parseInt(date.getMonth() / 3 ) + 1 ;

    wc.groupEnd();
    return quarter;
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.marketIsOpen = function() {
    wc.group("wc.marketIsOpen")

    var now   = moment(); // e.g. 11:00 am
    var open  = moment('09:29 am', "HH:mm a");
    var close = moment('04:15 pm', "HH:mm a");
    
    wc.log("NOW:", now);

    res = now.isBetween(open , close);
    
    wc.groupEnd();
    return res;
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.magic = function() {
    wc.group("wc.magic");

    if (wcENV == "dev") return true;

    let now = wc.today().replace(/-/g, '').split('').sort().join('');

    while ($.cookie("magic") != now) {
	let magic = prompt("Say the magic word!")
	
	if (magic === null) {
	    wc.groupEnd();
	    wc.magic();
	}

	// SET MAGIC IN COOKIE
	$.cookie("magic", magic.split('').sort().join(''));
    }

    wc.groupEnd();
    return true;
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.ip = function(proc) {
    wc.group("wc.ip");

    $.getJSON('https://ipapi.co/json/', function(data) {
	proc(data.ip)
    });

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.getMagic = function() {
    return wc.hash(wc.today()).toString();
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.isDigit = function(n) {
    wc.group("wc.isDigit:", n)
    wc.groupEnd();
    return !!n.trim() && n > -1;
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.shuffle = function(str) {
    wc.group("wc.shuffle:", str)

    var shuffled = str.split('').sort(function(){return 0.5-Math.random()}).join('');

    wc.groupEnd();
    return shuffled.toUpperCase();
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.months = function(date1, date2) {
    wc.group("wc.months:", date1, date2)

    var sdate = moment(date1);
    var edate = moment(date2);
    var timeValues = [];

    while (edate > sdate || sdate.format('M') === edate.format('M')) {
	timeValues.push(sdate.format('YYYY-MM'));
	sdate.add(1,'month');
    }

    wc.groupEnd();
    return timeValues
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.quarters = function(date1, date2) {
    wc.group("wc.quarters:", date1, date2)

    var sdate = moment(date1);
    var edate = moment(date2);
    var timeValues = [];

    while (edate > sdate || sdate.format('Q') === edate.format('Q')) {
	timeValues.push(sdate.format('YYYY-MM'));
	sdate.add(1,'quarter');
    }

    wc.groupEnd();
    return timeValues
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.years = function(date1, date2) {
    wc.group("wc.years:", date1, date2)

    var date1 = moment(date1);
    var date2  = moment(date2);
    var years = date2.diff(date1, 'year');

    wc.groupEnd();
    return years
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.getSearchParam = function(variable) {
    wc.group("wc.getSearchParam")

    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
	    wc.groupEnd();
            return decodeURIComponent(pair[1]);
        }
    }

    wc.groupEnd();
    return "";
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.setSearchParam = function(value) {
    wc.group("wc.setSearchParam")

    window.history.pushState("", "", value)

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////////
wc.today = function() {
    return new Date().toISOString().slice(0,10);
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.hash = function(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.block = function(ele) {
    let zi = $(ele).css("z-index");

    $(ele)
	.attr("zi",zi)
	.css({
	    zIndex: -1,
	    position: "absolute"
	})
	.css("position","relative")
	.wrap("<div class='wc-screen'></div>");
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.unblock = function(ele) {
    $(ele)
	.css("postion","relative")
	.css("z-index",$(ele).attr("zi"))
	.unwrap();
}

/////////////////////////////////////////////////////////////////////////////////
//// BEHAVES LIKE COOKIES. REMAIN ON USER'S BROWSER
/////////////////////////////////////////////////////////////////////////////////
wc.local.save = function(name,value) {
    wc.group("wc.local.save:", name,value);

    if (typeof(Storage) === "undefined") {
	alert("SORRY! NO WEB STORAGE SUPPORT..");
    } else {
	// STORE
	localStorage.setItem(name, value);
    }	 

    wc.groupEnd();
    return name;
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.local.restore = function(name) {
    wc.group("wc.local.restore:", name);

    let rval = localStorage.getItem(name)
    wc.log("VALUE:", rval)

    wc.groupEnd();
    return rval;
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.local.delete = function(name) {
    wc.group("wc.local.delete:", name);

    localStorage.removeItem(name);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.local.clear = function(name) {
    wc.group("wc.local.clear");

    localStorage.clear();

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// LIVES SO LONG AS USER IS IN THE APP
/////////////////////////////////////////////////////////////////////////////////
wc.session.save = function(name,value) {
    wc.group("wc.session.save:", name,value);

    if (typeof(Storage) === "undefined") {
	alert("SORRY! NO WEB STORAGE SUPPORT..");
    } else {
	// STORE
	sessionStorage.setItem(name, value);
    }	 

    wc.groupEnd();
    return name;
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.session.restore = function(name) {
    wc.group("wc.session.restore:", name);

    let rval = sessionStorage.getItem(name)
    wc.log("VALUE:", rval)

    wc.groupEnd();
    return rval;
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.session.delete = function(name) {
    wc.group("wc.session.delete:", name);

    sessionStorage.removeItem(name);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
////
/////////////////////////////////////////////////////////////////////////////////
wc.session.clear = function(name) {
    wc.group("wc.session.clear");

    sessionStorage.clear();

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.blink(".blinker", 500, 2000)
/////////////////////////////////////////////////////////////////////////////////
wc.blink = function(selector, duration, timeout) {
    wc.group("wc.blink");

    $(selector).animate(
	{opacity:0.2},
	duration, "linear",  
	function() { 
	    $(this).delay(100); 
	    $(this).animate({opacity:1}, duration, function(){ 
		wc.blink(this, duration, timeout); 
	    }); 

	    $(this).delay(100); 
	}); 

    setTimeout(function(){
	$(selector).css("opacity",1).animate().stop()
    }, timeout);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.backend(".blinker", 500, 2000)
/////////////////////////////////////////////////////////////////////////////////
wc.backend = function(cmnd, proc) {
    wc.group("wc.backend:", cmnd);

    $.get("/mtk/rest/os/backend?cmnd=" + encodeURIComponent(cmnd), function(data) {
	wc.groupEnd();
	proc(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
	wc.groupEnd();
	proc(null);
	console.error(errorThrown, textStatus);
    })

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.wow()
/////////////////////////////////////////////////////////////////////////////////
wc.wow = function() {
    wc.group("wc.wow");

    $('head').append(
	`<link href="/tk/lib/components/misc/webpack/node_modules/animate.css/animate.css" rel="stylesheet">
	 <script src="/tk/lib/components/misc/webpack/node_modules/wow.js/dist/wow.js"></script>`
    );

    wc.wait4(".wow", function() {
	wow = new WOW().init();
    });

    wc.groupEnd();
    return true;
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.backToTop
/////////////////////////////////////////////////////////////////////////////////
wc.backToTop = function() {
    wc.group("wc.backToTop");

    $("<a href='#' class='wc-scroll-to-top'></a>").prependTo(document.body);

    $('head').append(`
	<style type="text/css">
		.wc-scroll-to-top {
		    width:100px; 
		    height:100px;
		    position:fixed!important;
		    bottom:45%!important;
		    right:-20px!important;
		    display:none;
		    background: url('/tk/img/common/scroll-to-top.png') no-repeat 0px 20px;
		    background-size: 50px 50px;
		    z-index: 99999999!important;
		}
		.wc-scroll-to-top:hover{
			text-decoration:none;
		    }
		}
	</style>`);

    setTimeout(function() {
	//Check to see if the window is top if not then display button
	$(window).scroll(function(){
	    if ($(this).scrollTop() > 100) {
		$('.wc-scroll-to-top').fadeIn();
	    } else {
		$('.wc-scroll-to-top').fadeOut();
	    }
	});

	//Click event to scroll to top
	$('.wc-scroll-to-top').click(function(){
	    $('html, body').animate({scrollTop : 0},400);
	    return false;
	});
    }, 500);

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.backToTop
/////////////////////////////////////////////////////////////////////////////////
wc.confirm = function(msg) {
    wc.group("wc.backToTop:",msg);

    if (confirm(msg)) {
	var rval = true;
    } else {
	var rval = false
    }

    wc.groupEnd();
    return rval
}

/////////////////////////////////////////////////////////////////////////////////
//// wc.backToTop
/////////////////////////////////////////////////////////////////////////////////
wc.beep = function() {
    wc.group("wc.beep");

    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();

    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////
wc.getScript = function(src, async) {
    wc.group("wc.script:", src, async)

    // async = false WILL WAIT FOR SCRIPT TO LOAD

    $.ajax({
	async: async || false,
	url: src,
	dataType: "script"
    });
    
    wc.groupEnd();
}

/////////////////////////////////////////////////////////////////////////
//// 
/////////////////////////////////////////////////////////////////////////////
wc.timer = function(ele, maxtime, callback) {
    wc.group("wc.timer:", ele, maxtime, callback);

    // CREATE AN ELEMENT INSIDE THE APP TO SHOW PROGRESS
    // <h3 class=timer id=timer style=position:fixed;top:70px;left:10px;>...</h3>

    function pretty_time_string(num) {
	return ( num < 10 ? "0" : "" ) + num;
    }

    var start = new Date;    
    
    clearInterval(this.to);

    var to = setInterval(()=> {
	var total_seconds = maxtime - (new Date - start) / 1000;   

	var hours = Math.floor(total_seconds / 3600);
	total_seconds = total_seconds % 3600;

	var minutes = Math.floor(total_seconds / 60);
	total_seconds = (total_seconds % 60);

	var seconds = Math.floor(total_seconds);

	hours   = pretty_time_string(hours);
	minutes = pretty_time_string(minutes);
	seconds = pretty_time_string(seconds);

	var currentTimeString = hours + ":" + minutes + ":" + seconds;

	if (currentTimeString.indexOf("-") != -1) {
	    $(ele).text("DONE");
	    clearInterval(this.to);
	    callback();
	    return;
	}

	$(ele).text(currentTimeString);
    }, 1000);

    wc.groupEnd();
    return to;
}

/////////////////////////////////////////////////////////////////////////
//// COMPONENT TESTER
/////////////////////////////////////////////////////////////////////////////
wc.tester = function(component, id, test, timeout) {
    console.group("test.doit:", JSON.stringify(test), component, id, timeout);

    // CREATE A CONTAINER FOR RESULTS
    if ($("#test-results").length == 0) {
	$("body").prepend(`<div id="test-results" class="alert alert-info"><h6 class="wc-font-b">TESTING:</h6></div>`);
    }

    // SEND MSG TO BLANK TO CONFIGURE WITH ACTION, VALUE
    wc.timeout(() => {
	// ADD TEST EVENT TO SCREEN
	$("#test-results").append(`<div class="ml-3">- TESTING: <i>${test.action}, ${JSON.stringify(test.value)}</i></div>`);
	
	wc.publish(component, {
	    id: id,
	    time: new Date().getTime(),
	    action: test.action,
	    value: test.value
	});

    }, timeout, 1);

    console.groupEnd();
};

//////////////////////////////////////////////////
// TURN LOGGING ON/OFF
/////////////////////////////////////////////////
if (wcENV === "dev") {
    $(window).keydown(function(e) {
	if (e.which == 17) { // CTRL
	    $(".wc").addClass("ctrl-outline");

	    $(".wc").each(function() {
		let id = $(this).attr("id");
		
		$(this).css("position","relative").append("<div class='btn btn-sm btn-light border showoff shadow-lg' style=position:absolute;top:0;left:0;background:#BA68C8;color:#FFF>" + id + "</div>");
	    });
	}
    }).keyup(function(e) {
	if (e.which == 17) { // CTRL
	    $(".wc").removeClass("ctrl-outline");
	    $(".showoff").remove();
	}
    });
} else {
    // TURN OFF DEBUGGING IN PROD
    wc.log = wc.group = wc.groupEnd = wc.error = wc.info = wc.warn = function() {};
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// GOOGLE DATA LAYER
////////////////////////////////////////////////////////////////////////////////////////////////////
(function(w,d,s,l,i){w[l]=w[l]||[];
     w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
     var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
     j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
     f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KV7VH6K');
// ENDGOOGLE DATA LAYER

////////////////////////////////////////////////////////////////////////////////////////////////////
// GOOGLE ANALYTICS
////////////////////////////////////////////////////////////////////////////////////////////////////
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-37505168-1', 'auto');
ga('send', 'pageview');
// END GOOGLE ANALYTICS 

