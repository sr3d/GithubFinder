/* 
 * Plugin to let the page bookmarkable
 */
var Permalink = Class.create( PluginBase, { 
  initialize: function($super, f) {
    $super(f);
    this.f = f;

    var self      = this,
        old       = f._resizePanelsWrapper.bind(f);
    
    // override previewTextfile

  }
});

// if( !Prototype.Browser.IE )
window.FP.push(Permalink);