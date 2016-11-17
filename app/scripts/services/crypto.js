'use strict';

angular.module("openshiftConsole")
  .factory("CryptoService", function(Logger){

    return {
        base64URLEncode: function(source) {
            var retval = window.btoa(source);
            // convert to base64url alphabet and remove padding
            retval = retval.replace(/\+/g, "-");
            retval = retval.replace(/\//g, "_");
            retval = retval.replace(/=/g, "");
            return retval;
        },

        randomBytes: function(length) {
            var retval = [];
            if (window.crypto && window.Uint8Array) {
                try {
                    var r = new Uint8Array(length);
                    window.crypto.getRandomValues(r);
                    for (var j=0; j < length; j++) { retval.push(r[j]); }
                } catch(e) {
                    Logger.debug("RedirectLoginService.randomBytes: ", e);
                }
            }

            while (retval.length < length) { retval.push(Math.round(Math.random() * 256)); }
            
            return retval;
        },

        randomBase64URLString: function(length) {
            // base64 expands 4/3, so we need 3/4 as many source bytes
            var sourceBytes = this.randomBytes(Math.ceil(length * 0.75));
            var source = "";
            for (var i=0; i < sourceBytes.length; i++) {
                source = source + String.fromCharCode(sourceBytes[i]);
            }
            return this.base64URLEncode(source).substring(0,length);
        }
    };
  });
