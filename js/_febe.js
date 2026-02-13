///////////////////////////////////////
// FrontEnd to BackEnd
///////////////////////////////////////
class _febe {
    constructor() {
        this.topics = [
            "mtk-ready:click",
            "mtk-courses:click",
            "mtk-path:click",
            "header-logo",
            "mtk-header-dashboard",
            "mtk-header-login",
            "mtk-header-logout",
            "mtk-header-home",
            "mtk-header-hierarchy",
            "mtk-header-register",
            "mtk-header-settings",
            "mtk-dashboard:continue",
            "mtk-login-forgot-password",
            "mtk-login-register",
            "mtk-login-focus",
            "mtk-login-success",
            "MTK-parts.click",
            "mtk-hierarchy:resource:click",
            "mtk-register:submit"
        ];
        
        // OBJECT MAPPING FOR ALL MESSAGE HANDLERS
        this.handlers = {
	    // PAGE TRANSITIONS
            "mtk-ready:click": () => MTKPager.show("register"),
            "mtk-courses:click": () => MTKPager.show("register"),
            "mtk-path:click": () => MTKPager.show("register"),
            "mtk-login-register": () => MTKPager.show("register"),
            "mtk-header-register": () => MTKPager.show("register"),
            "mtk-header-home": () => MTKPager.show("home"),
            "mtk-dashboard:continue": () => MTKPager.show("hierarchy"),
            "mtk-header-hierarchy": () => MTKPager.show("hierarchy"),
            "header-logo": () => MTKPager.show("dashboard"),
            "mtk-header-dashboard": () => MTKPager.show("dashboard"),
            "mtk-header-settings": () => MTKPager.show("settings"),
            "mtk-header-login": () => MTKPager.show("login"),

	    // SPECIAL HANDLERS
            "mtk-register:submit": () => this.handleRegisterSubmit(),
            "mtk-login-success": (data) => this.handleLoginSuccess(data),
            "mtk-hierarchy:resource:click": (data) => this.resource(data),
            "MTK-parts.click": () => this.handlePartsClick(),
            "mtk-header-logout": () => this.handleLogout(),
            "mtk-login-forgot-password": () => this.handleForgotPassword(),
            "mtk-login-focus": () => this.handleLoginFocus()
        };
        
        // RESOURCE TYPE HANDLERS
        this.resourceHandlers = {
            "video": (data) => this.handleVideoResource(data),
            "image": (data) => this.handleImageResource(data)
        };
        
        this.subscribe();
    }
    
    // ALL _febe SUBSCRIPTIONS ARE PROCESSED HERE
    subscribe() {
        this.topics.forEach(topic => {
            wc.log("_febe: subscribed to", topic);
            PubSub.subscribe(topic, this.onMessage.bind(this));
        });
    }
    
    onMessage(msg, data) {
        wc.log("_febe: onMessage", msg, data);
        
        // Lookup handler from object
        const handler = this.handlers[msg];
        
        if (handler) {
            handler(data);
        } else {
            wc.error("_febe: DO NOT HAVE:" + msg);
            alert("_febe: DO NOT HAVE:" + msg);
        }
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Register Submit
    /////////////////////////////////////////////////////////////////////////////////
    handleRegisterSubmit() {
        wc.log("_febe: handleRegisterSubmit");
        // Add your register submit logic here
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Login Success
    /////////////////////////////////////////////////////////////////////////////////
    handleLoginSuccess(data) {
        wc.log("_febe: handleLoginSuccess", data);
        
        wc.doLogin(data.email, data.password)
            .then(success => {
                if (success) {
                    wc.log('Logged in!');
                    document.location.href = document.location.origin + "/repo_deploy/private";
                    MTKPager.show("dashboard");
                }
            })
            .catch(err => {
                wc.error(err);
                alert(err);
            });
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Parts Click
    /////////////////////////////////////////////////////////////////////////////////
    handlePartsClick() {
        wc.log("_febe: handlePartsClick");
        
        MTKPager.show("lessons");
        wc.timeout(() => {
            lessonClicked(cIndex, cTitle);
        }, 500, 1);
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Logout
    /////////////////////////////////////////////////////////////////////////////////
    handleLogout() {
        wc.log("_febe: handleLogout");
        
        wc.doLogout();
        document.location.href = document.location.origin + "/repo_deploy/index.html";
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Forgot Password
    /////////////////////////////////////////////////////////////////////////////////
    handleForgotPassword() {
        wc.log("_febe: handleForgotPassword");
        // Add your forgot password logic here
        MTKPager.show("forgot-password");
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Login Focus
    /////////////////////////////////////////////////////////////////////////////////
    handleLoginFocus() {
        wc.log("_febe: handleLoginFocus");
        // Add your login focus logic here
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Video Resource
    /////////////////////////////////////////////////////////////////////////////////
    handleVideoResource(data) {
        wc.log("_febe: handleVideoResource", data);
        
        $(".mtk-hierarchy-rhs-video, .mtk-hierarchy-rhs-image, .mtk-hierarchy-rhs-intro").hide();
        $(".mtk-hierarchy-rhs-video").fadeIn();
        
        wc.timeout(function() {
            window.MTKVideoInstance.load(data.url, data.description);
        }, 200, 1);
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Handler: Image Resource
    /////////////////////////////////////////////////////////////////////////////////
    handleImageResource(data) {
        wc.log("_febe: handleImageResource", data.type, data.url);
        // Add your image handling logic here
    }
    
    /////////////////////////////////////////////////////////////////////////////////
    //// Resource Handler
    /////////////////////////////////////////////////////////////////////////////////
    resource(data) {
        if (!data) {
            wc.warn("_febe.resource: no data received");
            return;
        }
        
        wc.log("_febe.resource:", data.description, data.url);
        
        // Lookup resource handler from object
        const handler = this.resourceHandlers[data.type];
        
        if (handler) {
            handler(data);
        } else {
            wc.error("NO SUCH TYPE:", data.type);
        }
    }
}

/* Auto-init */
window._febe = new _febe();
