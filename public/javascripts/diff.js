/* Diff plugin
  require difflib and diffview
*/
var Diff = Class.create( PluginBase, {
  mixin: {
    diff: function( commitId1, commitId2, filename) {

      $('f').hide();
      var file1, file2, diff, flag = 0;
      
      var process = function(file, mainFile) { 

        if( mainFile ) 
          file1 = file;
        else 
          file2 = file;

        // debugger

        if( ++flag < 2 ) return;

        try{
          file1 = difflib.stringAsLines(file1);
          
          if( file1.length > 500 
              && !confirm("Diffing large file will take a long time\nDo you want to continue?")) { 
            return;
          }
          
          file2 = difflib.stringAsLines(file2);
          var sm  = new difflib.SequenceMatcher( file1, file2 ),
              opc = sm.get_opcodes(),
              dO  = $("diffoutput").update('').show();
          var node = diffview.buildView({ 
            baseTextLines:    file1,
            newTextLines:     file2,
            opcodes:          opc,
            baseTextName:     s(commitId1),
            newTextName:      s(commitId2)
          });
          dO.appendChild( node );
        } catch(ex) {
          alert(ex);
        }
      } // process

      var u = this.u, r = this.r, b = this.b;
      
      /* load a file from a tree */
      var lf = function(sha, fn, mainFile) { 
        GH.Raw.loadBlobAtCommit( u, r , sha, filename, { 
          onSuccess: function(response) { 
            process(response.responseText, mainFile);
          }
        });
      };
      
      lf(commitId1, filename, true);
      lf(commitId2, filename);
    } // function
  } 
  
  
  ,initialize: function($super, f) {
    $super(f);
  }
  
});

/* add the plugin to the plugins list */
window.FP.push(Diff);