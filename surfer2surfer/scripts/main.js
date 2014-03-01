// This sample is using jso.js from https://github.com/andreassolberg/jso

var deviceready = function() {

        var debug = false,
        cmdLogin = document.getElementById("cmdLogin"),       
        cmdPost = document.getElementById("cmdPost"),        
        inAppBrowserRef;
    
    jso_registerRedirectHandler(function(url) {
        inAppBrowserRef = window.open(url, "_blank");
        inAppBrowserRef.addEventListener('loadstop', function(e){LocationChange(e.url)}, false);
    });

    /*
* Register a handler that detects redirects and
* lets JSO to detect incomming OAuth responses and deal with the content.
*/
    
    function LocationChange(url){
        url = decodeURIComponent(url);

        jso_checkfortoken('facebook', url, function() {            
            inAppBrowserRef.close();
        });
    };

    /*
* Configure the OAuth providers to use.
*/
    jso_configure({
        "facebook": {
            client_id: "137443023097520",
            redirect_uri: "http://www.facebook.com/connect/login_success.html",
            authorization: "https://www.facebook.com/dialog/oauth",
            presenttoken: "qs"
        }
    }, {"debug": debug});
    
    // jso_dump displays a list of cached tokens using outputlog if debugging is enabled.
    jso_dump();
    
    cmdLogin.addEventListener("click", function() {
        // For debugging purposes you can wipe existing cached tokens...
        jso_ensureTokens({
                "facebook": ["read_stream", "publish_stream"]
            });
    });

    cmdPost.addEventListener("click", function() {
        // Perform the protected OAuth calls.
        $.oajax({
            type: "POST",
            url: "https://graph.facebook.com/me/feed",
            jso_provider: "facebook",
            jso_scopes: ["read_stream", "publish_stream"],
            jso_allowia: true,
            dataType: 'json',
            data: {
                message: "WOW with my Icenium mobile application I can post to my Facebook wall!",
                link: "http://icenium.com/?utm_source=facebook&utm_medium=post&utm_campaign=sampleapp",
                picture: "http://www.icenium.com/iceniumImages/features-main-images/how-it-works.png"
            },
            success: function(data) {                
                //alert(data);
            },
            error: function(e) {
                //alert(e);
            }
        });
    });
};

document.addEventListener('deviceready', this.deviceready, false);

//Activate :active state
document.addEventListener("touchstart", function() {}, false);