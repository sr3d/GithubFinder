/* Diff plugin
  require difflib and diffview
*/
var Diff = Class.create( PluginBase, {
  mixin: {
    diff: function( sha1, tree1, sha2, tree2, filename ) {
      $('f').hide();
      var file1, file2, file1Sha, file2Sah, diff;

      var flag = 0;
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
          file2 = difflib.stringAsLines(file2)
          var sm = new difflib.SequenceMatcher( file1, file2 );
          var opc = sm.get_opcodes();
          
          var diffOutput = $("diffoutput").update('').show();
          // while (diffOutput.firstChild) diffOutput.removeChild(diffOutput.firstChild);
          // var showInline = false;          
          var node = diffview.buildView({ 
            baseTextLines:    file1,
            newTextLines:     file2,
            opcodes:          opc,
            baseTextName:     'Commit: ' + s(sha1) + ' (tree: '+ s(tree1) + ')',
            newTextName:      'Commit: ' + s(sha2) + ' (tree: '+ s(tree2) + ')',
          });
          diffOutput.appendChild( node );
        } catch(ex) {
          alert(ex);
        }
      } // process

      var u = this.user_id, r = this.repository, b = this.branch;
      
      /* load a file from a tree */
      var loadFile = function(treeSha, fn, mainFile) { 
        GH.Tree.show( u, r, b, treeSha, { onData: function(tree) {

          try{ 
          for( var i = 0; i < tree.length; i++ ) {
            if( tree[i].name == fn ){
              // now request
              GH.Blob.show( u, r, tree[i].sha, { onSuccess: function(res) {
                try{ 
                  process(res.responseText, mainFile);
                } catch( ex) {
                  alert(ex);
                  // console.log(ex);
                }
                
              }.bind(this)});
              break;
            }
          }
          
          
          } catch( ex) {
            alert(ex);
            // console.log(ex);
          }
        }.bind(this)});
      };
      
      loadFile(tree1, filename, true);
      loadFile(tree2, filename);
    } // function
  } 
  
  
  ,initialize: function($super, f) {
    $super(f);
  }
  
});

/* add the plugin to the plugins list */
window.FP.push(Diff);