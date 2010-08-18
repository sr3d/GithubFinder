/* Diff plugin
  require difflib and diffview
*/
var Diff = Class.create( PluginBase, {
  mixin: {
    diff: function( sha1, tree1, sha2, tree2, filename ) {
      // debugger
      $('f').hide();
      var file1, file2, diff, flag = 0;
      
      var process = function(file, mainFile) { 
        flag++;

        if( mainFile ) 
          file1 = file;
        else 
          file2 = file;

        if( flag < 2 ) {
          return;
        }
        //       
        // console.log("file1 %o",file1);
        // console.log("file2 %o",file2);
        try{
          
          file1 = difflib.stringAsLines(file1);
          file2 = difflib.stringAsLines(file2);
          var sm  = new difflib.SequenceMatcher( file1, file2 ),
              opc = sm.get_opcodes(),
              dO  = $("diffoutput").update('').show();
          // while (diffOutput.firstChild) diffOutput.removeChild(diffOutput.firstChild);
          // var showInline = false;          
          var node = diffview.buildView({ 
            baseTextLines:    file1,
            newTextLines:     file2,
            opcodes:          opc,
            baseTextName:     'Commit: ' + s(sha1) + ' (tree: '+ s(tree1) + ')',
            newTextName:      'Commit: ' + s(sha2) + ' (tree: '+ s(tree2) + ')',
          });
          dO.appendChild( node );
        } catch(ex) {
          alert(ex);
        }
      } // process

      var u = this.u, r = this.r, b = this.b;
      
      /* load a file from a tree */
      var lf = function(sha, fn, mainFile) { 
        GH.Tree.show( u, r, b, sha, { onData: function(tree) {
          for( var i = 0; i < tree.length; i++ ) {
            if( tree[i].name == fn ){
              // now request
              GH.Blob.show( u, r, tree[i].sha, { onSuccess: function(res) {
                try{ 
                  process(res.responseText, mainFile);
                } catch(x) {
                  alert(x);
                }
                
              }.bind(this)});
              break;
            }
          }
        }.bind(this)});
      };
      
      lf(tree1, filename, true);
      lf(tree2, filename);
    } // function
  } 
  
  
  ,initialize: function($super, f) {
    $super(f);
  }
  
});

/* add the plugin to the plugins list */
window.FP.push(Diff);