var ResizablePanel = Class.create( PluginBase, { 
  initialize: function($super, f) {
    $super(f);
    this.extend();
    
    this.f      = f;
    this.widths = []; // to keep track of the width of the panels 
    
    var self = this;
    var oldResizePanel = f._resizePanelsWrapper.bind(f);
    f._resizePanelsWrapper = function() {
      // oldResizePanel();
      var defaultWidth = 201;
      var totalWidth = 0;

      for( var i = 0; i < this.ps.length; i++ ) {
        totalWidth += self.widths[i] ? self.widths[i] : defaultWidth;
      }
      
      /* adding in the width or resizer*/
      totalWidth += this.ps.length * self.resizeWidth + this.ps.length;
      
      this.psW.style.width = totalWidth + 'px';

      /* scroll to the last panel */    
      this.bW.scrollLeft = totalWidth;
      
      /* adjusting the height of the finder panels based on the scrollbar */
      if( totalWidth > this.bW.offsetWidth ) {
        var scrollbarSize = self.scrollbarSize();
        var newHeight = parseInt(this.bW.offsetHeight - scrollbarSize) + 'px';
        this.psW.style.height = newHeight;
        this.psW.select('div').each(function(div) { 
          div.style.height = newHeight;
        } );
      } else { 
        if( this.psW.style.height != this.bW.style.height ) {
          var newHeight = this.bW.style.height;
          this.psW.style.height = newHeight;
          this.psW.select('div').each(function(div) { 
            div.style.height = newHeight;
          } );
        }
      }
    }.bind(f);
  }
  
  ,extend: function() { 
    var self = this;
    /* extend the Panel class */
    window.P = Class.create( window.P, { 
      r: function( $super ) {
        $super();
        var p     = $('p' + this.index);
        
        /* set the width of the panel to the previously set width (if needed) */
        if( self.widths[ this.index ] )
          p.style.width = self.widths[ this.index ] + 'px';
        
        /* draw the resizer bar */
        var height = p.offsetHeight + 'px'; // + 'px';
        var style = 'height:' + height + ';width:2px';
        var html = '<div id=resize' + this.index + ' style="' + style + '" data-index=' + this.index + ' class=resize></div>';

        var psW = $('ps_w');
        psW.insert(html);
        
        self.resizeWidth = $('resize' + this.index).offsetWidth;
      }
      
      ,dispose: function($super) {
        $super();
        $('resize' + this.index ).remove();
      }
    } );
    
    /* handle resizing drag */
    document.on('mousedown', function(event) { 
      var e = event.findElement();

      if( !e.hasClassName('resize') ) return;
      
      this.element = e;
      this.start = event.clientX;

      /* make sure the cursor stays as col-resize */
      document.body.style.cursor = 'col-resize';
      
      event.stop();
    }.bind(this));
    
    
    document.on('mouseup', function(event) { 
      if( !this.element ) return;
      
      var end = event.clientX;
      var pI  = +this.element.readAttribute('data-index');
      var p   = $('p' + pI );
      
      var min         = 200;
      var newWidth    = parseInt(p.offsetWidth) + (end - this.start);
      newWidth        = newWidth < min ? min : newWidth;
      p.style.width   = newWidth + 'px';
      
      /* store width so we can remember */
      this.widths[ pI ] = newWidth;
      

      this.element = null;

      this.f._resizePanelsWrapper();

      document.body.style.cursor = '';
      
    }.bind(this));
    
  }
  
  ,scrollbarSize: function() { 
    if( this._scrollbarSize) return this._scrollbarSize;
    
    var html = [
      '<div id=Z1 style="position:absolute;top:0;left:0;visibility:hidden;width:200px;height:150px;overflow:hidden">',
        '<p id=Z2 style="width:100%;height:200px"></p>',
      '<div>'
    ];
    
    $(document.body).insert(html.join());
    var outer = $('Z1'), inner = $('Z2');
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2  = inner.offsetWidth;
    if( w1 == w2 ) w2 = outer.clientWidth;
    outer.remove();
    
    this._scrollbarSize = w1 - w2;
    
    return this._scrollbarSize;
  }
});



FP.push(ResizablePanel);