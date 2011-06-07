var Keyboard = Class.create( PluginBase, { 
  initialize: function($super, f) {
    // $super(f);
    
    document.observe('keydown', function(e) { 
      if(e.findElement().tagName == 'INPUT') return; //  user has focus in something, bail out.
      
      // var k = e.which ? e.which : e.keyCode; // keycode
      var k = e.which || e.keyCode; // keycode
      
      var cI = f.cI,
          pI = f.pI;
      
      var p = f.ps[pI];     // panel
      var t = p.tree;       // the panel's tree
      

      var d = function() { 
        if( t[ ++cI ] ) {
          var item = t[cI]; 
          // debugger
          f.click( item.sha, $$('#p' + pI + ' a')[cI], true );
        } else {
          cI--;
        }
      };
      
      var u = function() {
        if( t[ --cI ] ) {
          var item = t[cI]; 
          f.click( item.sha, $$('#p' + pI + ' a')[cI], true );
        } else {
          cI++;
        }        
      }
      
      var l = function() {
        if( f.ps[--pI] ) {
          // debugger
          t = f.ps[pI].tree;
          // get index of the previously selected item
          cI = f.ps[pI].cI;
          // var item = f.ps[pI]; 
          f.click( t[cI].sha, $$('#p' + pI + ' a')[cI], true );
          
        } else {
          pI++; // undo 
        }        
      }
      
      
      var r = function() {
        if( !t[cI] || t[cI].type != 'tree' ) return;
        
        if( f.ps[++pI] ) {
          t = f.ps[pI].tree;
          cI = -1;
          d(); // down!

        } else {
          pI--; // undo 
        }        
      }
      
      // k == 40 ? d() : ( k == 39 ? r() : ( k == 38 ? u() : ( k == 37 ? l() : '';
      switch( k ) {
        case 40: // key down
          d();
          break;
          
        case 38: // up
          u();
          break;
        
        case 37: //left
          l();
          break
          
        case 39: // right
          r();
          break;
        default:
          break;
      }
      
      
      // console.log("keypress");
      
      if( k >= 37 && k <= 40)
        e.stop();
      
    });
  }
});

/* add the plugin to the plugins list */
FP.push(Keyboard);