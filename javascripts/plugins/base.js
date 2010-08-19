;window.FP = []; // this array contains the list of all registered plugins

var PluginBase = Class.create( { 
  initialize: function(o) {
    if( !this.mixin ) this.mixin = {};
    Object.extend( o, this.mixin );
  }
} );