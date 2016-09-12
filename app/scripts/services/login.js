'use strict';

// Login strategies
angular.module('openshiftConsole')
.provider('RedirectLoginService', function() {
  var _oauth_client_id = "";
  var _oauth_authorize_uri = "";
  var _oauth_token_uri = "";
  var _oauth_redirect_uri = "";

  this.OAuthClientID = function(id) {
    if (id) {
      _oauth_client_id = id;
    }
    return _oauth_client_id;
  };
  this.OAuthAuthorizeURI = function(uri) {
    if (uri) {
      _oauth_authorize_uri = uri;
    }
    return _oauth_authorize_uri;
  };
  this.OAuthTokenURI = function(uri) {
    if (uri) {
      _oauth_token_uri = uri;
    }
    return _oauth_token_uri;
  };
  this.OAuthRedirectURI = function(uri) {
    if (uri) {
      _oauth_redirect_uri = uri;
    }
    return _oauth_redirect_uri;
  };

  this.$get = function($location, $q, Logger, CryptoService) {
    var authLogger = Logger.get("auth");

    var codeVerifierKey = "RedirectLoginService.code_verifier";
    var makeCodeVerifier = function() {
      var code_verifier = CryptoService.randomBase64URLString(50);
      if (!code_verifier) {
        return code_verifier;
      }
      try {
        window.localStorage[codeVerifierKey] = code_verifier;
      } catch(e) {
        authLogger.log("RedirectLoginService.makeCodeVerifier, localStorage error: ", e);
        return "";
      }
      return code_verifier;
    };
    var getCodeVerifier = function() {
      try {
        var code_verifier = window.localStorage[codeVerifierKey];
        window.localStorage.removeItem(codeVerifierKey);
        return code_verifier;
      } catch(e) {
        authLogger.log("RedirectLoginService.getCodeVerifier, localStorage error: ", e);
        return "";
      }
    };

    var nonceKey = "RedirectLoginService.nonce";
    var makeState = function(then) {
      var nonce = String(new Date().getTime()) + "-" + CryptoService.randomBase64URLString(50);
      try {
        window.localStorage[nonceKey] = nonce;
      } catch(e) {
        authLogger.log("RedirectLoginService.makeState, localStorage error: ", e);
      }
      return JSON.stringify({then: then, nonce:nonce});
    };
    var parseState = function(state) {
      var retval = {
        then: null,
        verified: false
      };

      var nonce = "";
      try {
        nonce = window.localStorage[nonceKey];
        window.localStorage.removeItem(nonceKey);
      } catch(e) {
        authLogger.log("RedirectLoginService.parseState, localStorage error: ", e);
      }
      
      try {
        var data = state ? JSON.parse(state) : {};
        if (data && data.nonce && nonce && data.nonce === nonce) {
          retval.verified = true;
          retval.then = data.then;
        }
      } catch(e) {
        authLogger.error("RedirectLoginService.parseState, state error: ", e);
      }
      authLogger.error("RedirectLoginService.parseState", retval);
      return retval;
    };

    return {
      // Returns a promise that resolves with {user:{...}, token:'...', ttl:X}, or rejects with {error:'...'[,error_description:'...',error_uri:'...']}
      login: function() {
        if (_oauth_client_id === "") {
          return $q.reject({error:'invalid_request', error_description:'RedirectLoginServiceProvider.OAuthClientID() not set'});
        }
        if (_oauth_authorize_uri === "") {
          return $q.reject({error:'invalid_request', error_description:'RedirectLoginServiceProvider.OAuthAuthorizeURI() not set'});
        }
        if (_oauth_redirect_uri === "") {
          return $q.reject({error:'invalid_request', error_description:'RedirectLoginServiceProvider.OAuthRedirectURI not set'});
        }

        var returnUri = new URI($location.url()).fragment("");
        var authorizeParams = {
          client_id: _oauth_client_id,
          response_type: 'token',
          state: makeState(returnUri.toString()),
          redirect_uri: _oauth_redirect_uri
        };

        if (_oauth_token_uri) {
          authorizeParams.response_type = "code";

          var code_verifier = makeCodeVerifier();
          if (code_verifier) {
            authorizeParams.code_challenge = code_verifier;
            // TODO: authorizeParams.code_challenge_method = "S256";
          }
        }

        var deferred = $q.defer();
        var uri = new URI(_oauth_authorize_uri);
        // Never send a local fragment to remote servers
        uri.query(authorizeParams);
        authLogger.log("RedirectLoginService.login(), redirecting", uri.toString());
        window.location.href = uri.toString();
        // Return a promise we never intend to keep, because we're redirecting to another page
        return deferred.promise;
      },

      // Parses oauth callback parameters from window.location
      // Returns a promise that resolves with {token:'...',then:'...',verified:true|false}, or rejects with {error:'...'[,error_description:'...',error_uri:'...']}
      // If no token and no error is present, resolves with {}
      // Example error codes: https://tools.ietf.org/html/rfc6749#section-5.2
      finish: function($http) {

        // handleParams handles error or access_token responses
        var handleParams = function(params, stateData) {
          // Handle an error response from the OAuth server
          if (params.error) {
            var error_description = params.error_description;
            var error_uri = params.error_uri;
            authLogger.log("RedirectLoginService.finish(), error", params.error, error_description, error_uri);
            return $q.reject({
              error: params.error,
              error_description: error_description,
              error_uri: error_uri
            });
          }

          // Handle an access_token fragment response
          if (params.access_token) {
            var deferred = $q.defer();
            deferred.resolve({
              token: params.access_token,
              ttl: params.expires_in,
              then: stateData.then,
              verified: stateData.verified
            });
            return deferred.promise;
          }

          // No token and no error is invalid
          return $q.reject({
            error: "invalid_request",
            error_description: "No API token returned"
          });
        };

        // Get url
        var u = new URI($location.url());

        // Read params
        var queryParams = u.query(true);
        var fragmentParams = new URI("?" + u.fragment()).query(true);
        authLogger.log("RedirectLoginService.finish()", queryParams, fragmentParams);

        // immediate error
        if (queryParams.error) {
          return handleParams(queryParams, parseState(queryParams.state));
        }
        // implicit error
        if (fragmentParams.error) {
          return handleParams(fragmentParams, parseState(fragmentParams.state));
        }
        // implicit success
        if (fragmentParams.access_token) {
          return handleParams(fragmentParams, parseState(fragmentParams.state));
        }
        // code flow
        if (_oauth_token_uri && queryParams.code && $http) {
          // verify before attempting to exchange code for token
          // hard-fail state verification errors for code exchange
          var stateData = parseState(queryParams.state);
          if (!stateData.verified) {
            return $q.reject({
              error: "invalid_request",
              error_description: "Client state could not be verified"
            });
          }

          var tokenPostData = [
            "grant_type=authorization_code",
            "code="         + encodeURIComponent(queryParams.code),
            "redirect_uri=" + encodeURIComponent(_oauth_redirect_uri),
            "client_id="    + encodeURIComponent(_oauth_client_id)
          ];
          
          var code_verifier = getCodeVerifier();
          if (code_verifier) {
            tokenPostData.push("code_verifier="+encodeURIComponent(code_verifier));
          }

          return $http({
            method: "POST",
            url: _oauth_token_uri,
            headers: {
              "Authorization": "Basic " + window.btoa(_oauth_client_id+":"),
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: tokenPostData.join("&")
          }).then(function(response){
            return handleParams(response.data, stateData);
          }, function(response) {
            console.log("Error", response);
            return handleParams(response.data, stateData);
          });
        }

        // No token and no error is invalid
        return $q.reject({
          error: "invalid_request",
          error_description: "No API token returned"
        });
      }
    };
  };
});
