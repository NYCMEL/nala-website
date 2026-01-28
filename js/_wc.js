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
//// wc.fetch("https://nala-test.com/api/curriculum.json");
/////////////////////////////////////////////////////////////////////////////////
wc.fetch = function(url) {
    wc.log("_wc: fetch", url);

    fetch(url).then(response => {
	if (!response.ok) {
	    throw new Error("HTTP error " + response.status);
	} return response.json();
    }).then(data => {
	wc.log("Curriculum JSON:", data);
    }).catch(error => {
	wc.error("Fetch failed:", error);
    });
}

/**
 * Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
 * License: MIT - http://mrgnrdrck.mit-license.org
 *
 * https://github.com/mroderick/PubSubJS
 */

(function (root, factory){
    'use strict';

    var PubSub = {};

    if (root.PubSub) {
        PubSub = root.PubSub;
        console.warn("PubSub already loaded, using existing version");
    } else {
        root.PubSub = PubSub;
        factory(PubSub);
    }
    // CommonJS and Node.js module support
    if (typeof exports === 'object'){
        if (module !== undefined && module.exports) {
            exports = module.exports = PubSub; // Node.js specific `module.exports`
        }
        exports.PubSub = PubSub; // CommonJS module 1.1.1 spec
        module.exports = exports = PubSub; // CommonJS
    }
    // AMD support
    /* eslint-disable no-undef */
    else if (typeof define === 'function' && define.amd){
        define(function() { return PubSub; });
        /* eslint-enable no-undef */
    }
}(( typeof window === 'object' && window ) || this, function (PubSub){
    'use strict';

    var messages = {},
        lastUid = -1,
        ALL_SUBSCRIBING_MSG = '*';

    function hasKeys(obj){
        var key;

        for (key in obj){
            if ( Object.prototype.hasOwnProperty.call(obj, key) ){
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a function that throws the passed exception, for use as argument for setTimeout
     * @alias throwException
     * @function
     * @param { Object } ex An Error object
     */
    function throwException( ex ){
        return function reThrowException(){
            throw ex;
        };
    }

    function callSubscriberWithDelayedExceptions( subscriber, message, data ){
	//wc.log(message)

        try {
            subscriber( message, data );
        } catch( ex ){
            setTimeout( throwException( ex ), 0);
        }
    }

    function callSubscriberWithImmediateExceptions( subscriber, message, data ){
	//wc.log(message)

        subscriber( message, data );
    }

    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
        var subscribers = messages[matchedMessage],
            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
            s;

        if ( !Object.prototype.hasOwnProperty.call( messages, matchedMessage ) ) {
            return;
        }

        for (s in subscribers){
            if ( Object.prototype.hasOwnProperty.call(subscribers, s)){
                callSubscriber( subscribers[s], originalMessage, data );
            }
        }
    }

    function createDeliveryFunction( message, data, immediateExceptions ){
	//wc.log(message)

        return function deliverNamespaced(){
            var topic = String( message ),
                position = topic.lastIndexOf( '.' );

            // deliver the message as it is now
            deliverMessage(message, message, data, immediateExceptions);

            // trim the hierarchy and deliver message to each level
            while( position !== -1 ){
                topic = topic.substr( 0, position );
                position = topic.lastIndexOf('.');
                deliverMessage( message, topic, data, immediateExceptions );
            }

            deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);
        };
    }

    function hasDirectSubscribersFor( message ) {
	//wc.log(message)

        var topic = String( message ),
            found = Boolean(Object.prototype.hasOwnProperty.call( messages, topic ) && hasKeys(messages[topic]));

        return found;
    }

    function messageHasSubscribers( message ){
	//wc.log(message)

        var topic = String( message ),
            found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG),
            position = topic.lastIndexOf( '.' );

        while ( !found && position !== -1 ){
            topic = topic.substr( 0, position );
            position = topic.lastIndexOf( '.' );
            found = hasDirectSubscribersFor(topic);
        }

        return found;
    }

    function publish( message, data, sync, immediateExceptions ){
        message = (typeof message === 'symbol') ? message.toString() : message;

	//wc.log(message)

        var deliver = createDeliveryFunction( message, data, immediateExceptions ),
            hasSubscribers = messageHasSubscribers( message );

        if ( !hasSubscribers ){
            return false;
        }

        if ( sync === true ){
            deliver();
        } else {
            setTimeout( deliver, 0 );
        }

        return true;
    }

    PubSub.publish = function( message, data ){
	//wc.log(message)

        return publish( message, data, false, PubSub.immediateExceptions );
    };

    /**
     * Publishes the message synchronously, passing the data to it's subscribers
     * @function
     * @alias publishSync
     * @param { String } message The message to publish
     * @param {} data The data to pass to subscribers
     * @return { Boolean }
     */
    PubSub.publishSync = function( message, data ){
	//wc.log(message)

        return publish( message, data, true, PubSub.immediateExceptions );
    };

    /**
     * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
     * @function
     * @alias subscribe
     * @param { String } message The message to subscribe to
     * @param { Function } func The function to call when a new message is published
     * @return { String }
     */
    PubSub.subscribe = function( message, func ){
        if ( typeof func !== 'function'){
            return false;
        }

        message = (typeof message === 'symbol') ? message.toString() : message;

        // message is not registered yet
        if ( !Object.prototype.hasOwnProperty.call( messages, message ) ){
            messages[message] = {};
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        var token = 'uid_' + String(++lastUid);
        messages[message][token] = func;

        // return token for unsubscribing
        return token;
    };

    PubSub.subscribeAll = function( func ){
        return PubSub.subscribe(ALL_SUBSCRIBING_MSG, func);
    };

    /**
     * Subscribes the passed function to the passed message once
     * @function
     * @alias subscribeOnce
     * @param { String } message The message to subscribe to
     * @param { Function } func The function to call when a new message is published
     * @return { PubSub }
     */
    PubSub.subscribeOnce = function( message, func ){
        var token = PubSub.subscribe( message, function(){
            // before func apply, unsubscribe message
            PubSub.unsubscribe( token );
            func.apply( this, arguments );
        });
        return PubSub;
    };

    /**
     * Clears all subscriptions
     * @function
     * @public
     * @alias clearAllSubscriptions
     */
    PubSub.clearAllSubscriptions = function clearAllSubscriptions(){
        messages = {};
    };

    /**
     * Clear subscriptions by the topic
     * @function
     * @public
     * @alias clearAllSubscriptions
     * @return { int }
     */
    PubSub.clearSubscriptions = function clearSubscriptions(topic){
        var m;
        for (m in messages){
            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0){
                delete messages[m];
            }
        }
    };

    /**
       Count subscriptions by the topic
       * @function
       * @public
       * @alias countSubscriptions
       * @return { Array }
       */
    PubSub.countSubscriptions = function countSubscriptions(topic){
        var m;
        // eslint-disable-next-line no-unused-vars
        var token;
        var count = 0;
        for (m in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
                for (token in messages[m]) {
                    count++;
                }
                break;
            }
        }
        return count;
    };


    /**
       Gets subscriptions by the topic
       * @function
       * @public
       * @alias getSubscriptions
       */
    PubSub.getSubscriptions = function getSubscriptions(topic){
        var m;
        var list = [];
        for (m in messages){
            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0){
                list.push(m);
            }
        }
        return list;
    };

    /**
     * Removes subscriptions
     *
     * - When passed a token, removes a specific subscription.
     *
     * - When passed a function, removes all subscriptions for that function
     *
     * - When passed a topic, removes all subscriptions for that topic (hierarchy)
     * @function
     * @public
     * @alias subscribeOnce
     * @param { String | Function } value A token, function or topic to unsubscribe from
     * @example // Unsubscribing with a token
     * var token = PubSub.subscribe('mytopic', myFunc);
     * PubSub.unsubscribe(token);
     * @example // Unsubscribing with a function
     * PubSub.unsubscribe(myFunc);
     * @example // Unsubscribing from a topic
     * PubSub.unsubscribe('mytopic');
     */
    PubSub.unsubscribe = function(value){
        var descendantTopicExists = function(topic) {
            var m;
            for ( m in messages ){
                if ( Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0 ){
                    // a descendant of the topic exists:
                    return true;
                }
            }

            return false;
        },
            isTopic    = typeof value === 'string' && ( Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value) ),
            isToken    = !isTopic && typeof value === 'string',
            isFunction = typeof value === 'function',
            result = false,
            m, message, t;

        if (isTopic){
            PubSub.clearSubscriptions(value);
            return;
        }

        for ( m in messages ){
            if ( Object.prototype.hasOwnProperty.call( messages, m ) ){
                message = messages[m];

                if ( isToken && message[value] ){
                    delete message[value];
                    result = value;
                    // tokens are unique, so we can just stop here
                    break;
                }

                if (isFunction) {
                    for ( t in message ){
                        if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value){
                            delete message[t];
                            result = true;
                        }
                    }
                }
            }
        }

        return result;
    };
}));

////////////////////////////////////////////////////////////////////////////////////
//// REPLACED BY PUBSUB
////////////////////////////////////////////////////////////////////////////////////
window.publish = PubSub.publish;
wc.publish     = PubSub.publish;
wc.publishSync = PubSub.publishSync;
wc.subscribe   = PubSub.subscribe;

/////////////////////////////////////////////////////////////////////////////////
//// INCLUDE HTML 
/////////////////////////////////////////////////////////////////////////////////
class Include extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const self = this;
        const href = $(this).attr("href");

        // LOADING PLACEHOLDER INSIDE THIS ELEMENT
        $(self).html("<span class='wc-loading-img'></span>");

        if (!href) return;

        const runLoad = () => {
            self.dispatchEvent(new CustomEvent('include:before-load', {
                detail: { href: href, include: self },
                bubbles: true,
                composed: true
            }));

            $.ajax({
                url: href,
                method: "GET",
                dataType: "html",
                success: function (data) {
                    $(self).html(data); // <-- INJECT INSIDE <wc-include> ITSELF

                    self.dispatchEvent(new CustomEvent('include:loaded', {
                        detail: { href: href, include: self },
                        bubbles: true,
                        composed: true
                    }));
                },
                error: function () {
                    $(self).html("wc-include: Page not found: " + href);
                }
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runLoad, { once: true });
        } else {
            runLoad();
        }
    }
}

window.customElements.define('wc-include', Include);
