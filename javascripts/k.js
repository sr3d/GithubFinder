var KB = Class.create( { 
  initialize: function(f) {

    document.on('keydown', function(e) { 
      var k = e.which ? e.which : e.keyCode; // keycode

      var cI = f.cI,
          pI = f.pI;
      
      var p = f.panels[pI]; // panel
      var t = p.tree;       // the panel's tree
      
      // e.stop();
      
      // console.log("k %o",k);
      var d = function() { 
        if( t[ ++cI ] ) {
          var item = t[cI]; 
          // debugger
          f.click( item.sha, $$('#p' + pI + ' a')[cI] );
        } else {
          cI--;
        }
      };
      
      var u = function() {
        if( t[ --cI ] ) {
          var item = t[cI]; 
          f.click( item.sha, $$('#p' + pI + ' a')[cI] );
        } else {
          cI++;
        }        
      }
      
      var l = function() {
        if( f.panels[--pI] ) {
          // debugger
          t = f.panels[pI].tree;
          // get index of the previously selected item
          cI = f.panels[pI].cI;
          // var item = f.panels[pI]; 
          f.click( t[cI].sha, $$('#p' + pI + ' a')[cI] );
          
        } else {
          pI++; // undo 
        }        
      }
      
      
      var r = function() {
        if( t[cI].type != 'tree' ) {
          console.log("not tree");
          return;
        }
        //if(f.panels[pI].tree[cI].type != 'tree') return;
        if( f.panels[++pI] //&& 
            //f.panels[pI].tree[ f.panels[pI-1].cI ].type == 'tree'     // only tree can go right
          ) {
          t = f.panels[pI].tree;
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
          return true;
          break;
      }
      
      return false;
      
    });
  }
  // listen: function() {
  //   var f = this.getFinder();
  // }
  // 
  // ,getFinder: function() { return window.f; }
  //   
});

/* add the plugin to the plugins list */
window.FP.push(KB)