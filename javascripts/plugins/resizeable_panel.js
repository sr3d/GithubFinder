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

      /* have to take into account the width of the resized panels */
      for( var i = 0; i < this.ps.length; i++ ) {
        totalWidth += self.widths[i] ? self.widths[i] : defaultWidth;
      }
      
      /* adding in the width or resizer*/
      totalWidth += this.ps.length * (self.resizeWidth+1);
      
      this.psW.style.width = totalWidth + 'px';

      /* scroll to the last panel */    
      this.bW.scrollLeft = totalWidth;
      
      /* adjusting the height of the finder panels based on the scrollbar */
      var scrollbarSize = self.scrollbarSize();
      if( totalWidth > this.bW.offsetWidth ) {
        var newHeight = this.psW.style.height = (this.bW.offsetHeight - scrollbarSize) + 'px';
        this.psW.select('div').each(function(div) { 
          div.style.height = newHeight;
        } );
      } else { 
        if( this.psW.style.height != this.bW.style.height ) {
          var newHeight = this.psW.style.height = this.bW.style.height;
          this.psW.select('div').
            invoke('setStyle',{height: newHeight} );
        }
      }
    }.bind(f);
    
    /* insert vertical resizable */
    $('finder').removeClassName('tbb').insert({
      after: '<div class="resize hrz"></div>'});
  }
  
  ,extend: function() { 
    var self = this;
    /* extend the Panel class */
    window.P = Class.create( window.P, { 
      r: function( $super ) {
        $super();
        
        var p = this.p = $('p' + this.index);

        /* set the width of the panel to the previously set width (if needed) */
        if( self.widths[ this.index ] )
          p.style.width = self.widths[ this.index ] + 'px';
        
        /* draw the resizer bar */
        var height  = $('b_w').offsetHeight + 'px',
            style   = 'height:' + height + ';width:2px',
            html    = '<div id=resize' + this.index + ' style="' + style + '" data-index=' + this.index + ' class=resize></div>',
            psW     = $('ps_w');
            
        psW.insert(html);
        self.resizeWidth = $('resize' + this.index).offsetWidth;
        
        this.updateFileLabel();
      }
      
      ,dispose: function($super) {
        $super();
        $('resize' + this.index ).remove();
      }
      
      ,updateFileLabel: function() {
        var l = this.p.offsetWidth / 8;
        this.p.select('a').each(function(a) { 
          a.innerHTML = t(a.readAttribute('data-name'), l);
        });
      }
    } );
    
    /* handle resizing drag */
    document.observe('mousedown', function(event) { 
      var e = event.findElement();

      if( !e.hasClassName('resize') ) return;
      
      this.element = e;
      this.start = [event.clientX, event.clientY];

      /* make sure the cursor stays as col-resize */
      document.body.style.cursor = e.hasClassName('hrz') ? 'row-resize' : 'col-resize';
      event.stop();
      
    }.bind(this));
    
    
    document.observe('mouseup', function(event) { 
      /* not dragging, bail out */
      if( !this.element ) return;
      
      /* user drags, resizing ... */
      if( this.element.hasClassName('hrz') ) {         // horizontal split 
        var b         = $('b_w'),
            i         = $('i_w'),
            end       = event.clientY,
            min       = 300,
            newHeight = b.offsetHeight + (end - this.start[1]);
            
        newHeight     = newHeight < min ? min : newHeight;
        i.style.height = b.style.height = newHeight + 'px';
        this.f._resizePanelsWrapper();

      } else { // vertical split
        var end       = event.clientX,
            pI        = +this.element.readAttribute('data-index'),
            p         = $('p' + pI ),
            min       = 200,
            newWidth  = parseInt(p.offsetWidth) + (end - this.start[0]);
            
        newWidth      = newWidth < min ? min : newWidth;
        p.style.width = newWidth + 'px';

        /* store width so we can remember */
        this.widths[ pI ] = newWidth;
        
        this.f.ps[pI].updateFileLabel();
      }

      /* reset the cursor */
      document.body.style.cursor = '';
      this.element = null;      
      this.f._resizePanelsWrapper();
        
    }.bind(this));
    
  }
  
  /* dynamically calculate the scrollbar size of the */
  ,scrollbarSize: function() { 
    if( this.sbs) return this.sbs;
    
    var html = [
      '<div id=Z1 style="position:absolute;top:0;left:0;visibility:hidden;width:200px;height:150px;overflow:hidden">',
        '<p id=Z2 style="width:100%;height:200px"></p>',
      '<div>'
    ];
    
    $(document.body).insert(html.join());
    var outer = $('Z1'), 
        inner = $('Z2'),
        w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2  = inner.offsetWidth;
    if( w1 == w2 ) w2 = outer.clientWidth;
    outer.remove();
    return this.sbs = w1 - w2;
  }
});


if( !Prototype.Browser.IE )
  FP.push(ResizablePanel);