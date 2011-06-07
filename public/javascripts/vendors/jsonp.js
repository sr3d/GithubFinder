// See an updated version of this in it's own git repo:
// http://github.com/dandean/Ajax.JSONRequest

/* JSON-P implementation for Prototype.js somewhat by Dan Dean (http://www.dandean.com)
 * 
 * *HEAVILY* based on Tobie Langel's version: http://gist.github.com/145466.
 * Might as well just call this an iteration.
 * 
 * This version introduces:
 * - onCreate and onFailure callback options.
 * - option to not invoke request upon instantiation.
 *
 * Tested in Firefox 3/3.5, Safari 4
 *
 * Note: while I still think JSON-P is an inherantly flawed technique,
 * there are some valid use cases which this can provide for.
 *
 * See examples below for usage.
 */
window.JSP = Class.create(Ajax.Base, (function() {
  var id = 0, head = document.getElementsByTagName('head')[0];
  return {
    initialize: function($super, url, options) {
      $super(options);
      this.options.url = url;
      this.options.callbackParamName = this.options.callbackParamName || 'callback';
      this.options.timeout = this.options.timeout || 10000; // Default timeout: 10 seconds
      this.options.invokeImmediately = (!Object.isUndefined(this.options.invokeImmediately)) ? this.options.invokeImmediately : true ;
      this.responseJSON = {};
      if (this.options.invokeImmediately) {
        this.request();
      }
      
      Ajax.Responders.dispatch('onCreate', this);
    },
    
    /**
     *  Ajax.JSONRequest#_cleanup() -> "undefined"
     *  
     *  Cleans up after the request
     **/
    _cleanup: function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      if (this.script && Object.isElement(this.script)) {
        this.script.remove();
        this.script = null;
      }
    },
  
    /**
     *  Ajax.JSONRequest#request() -> "undefined"
     *  
     *  Invokes the JSON-P request lifecycle
     **/
    request: function() {
      // Define local vars
      var key = this.options.callbackParamName,
        name = '_prototypeJSONPCallback_' + (id++);
      
      // Add callback as a parameter and build request URL
      this.options.parameters[key] = name;
      var url = this.options.url + ((this.options.url.include('?') ? '&' : '?') + Object.toQueryString(this.options.parameters));
      
      // Define callback function
      window[name] = function(response) {
        this._cleanup(); // Garbage collection
        window[name] = undefined;
        
        
        if( typeof(response) == 'Object' )
          this.responseJSON = response;
        else
          this.responseText = response;
        
        try {
          Ajax.Responders.dispatch('onComplete', this, response);
          
          if (Object.isFunction(this.options.onComplete)) {
            this.options.onComplete.call(this, this);
          }

          if (Object.isFunction(this.options.onSuccess)) {
            this.options.onSuccess.call(this,this);
          }
        } catch( ex ) { 
          Ajax.Responders.dispatch('onException', this, ex);
          throw ex;
        }

      }.bind(this);
      
      this.script = new Element('script', { type: 'text/javascript', src: url });
      
      if (Object.isFunction(this.options.onCreate)) {
        this.options.onCreate.call(this, this);
      }
      
      
      head.appendChild(this.script);

      this.timeout = setTimeout(function() {
        this._cleanup();
        window[name] = Prototype.emptyFunction;
        if (Object.isFunction(this.options.onFailure)) {
          this.options.onFailure.call(this, this);
        }
      }.bind(this), this.options.timeout);
    }
  };
})());