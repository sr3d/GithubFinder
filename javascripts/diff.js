/* Diff plugin
  require difflib and diffview
*/
var Diff = Class.create( PluginBase, {
  mixin: {
    diff: function( sha1, tree1, sha2, tree2, filename ) {
      $('f').hide();
      var file1, file2, file1Sha, file2Sah, diff;

      var flag = 0;
      var process = function() { 
        if( flag < 2 ) {
          //console.log("pending requests");
          return;
        }
        // console.log("file1 %o",file1);
        // console.log("file2 %o",file2);

        // $('file1').value = file1;
        // $('file2').value = file2;
        // $('diff').value = diff;
        /* */
        // debugger

        file1 = difflib.stringAsLines(file1);
        file2 = difflib.stringAsLines(file2)
        var sm = new difflib.SequenceMatcher( file1, file2 );
        var opcodes = sm.get_opcodes();
        // debugger
        var diffoutputdiv = $("diffoutput").show();
        while (diffoutputdiv.firstChild) diffoutputdiv.removeChild(diffoutputdiv.firstChild);
        var contextSize = null; // or a number 
        var showInline = false;
        try{

          var node = diffview.buildView({ 
      	    baseTextLines:    file1,
  			    newTextLines:     file2,
  			    opcodes:          opcodes,
  			    baseTextName:     'Commit: ' + s(sha1) + ' (tree: '+ s(tree1) + ')',
  			    newTextName:      'Commit: ' + s(sha2) + ' (tree: '+ s(tree2) + ')',
  			    contextSize:      contextSize,
  			    viewType:         showInline 
  		    });
      	  diffoutputdiv.appendChild( node );

          // console.log("node %o",node);
          // console.log("done");
        } catch(ex) {
          alert(ex.message);
          console.log("ex %o",ex);
        }
      }

      GH.Tree.show( this.user_id, this.repository, this.branch, tree1, { onData: function(tree) {
        for( var i = 0; i < tree.length; i++ ) {
          if( tree[i].name == filename ){
            // now request
            GH.Blob.show( this.user_id, this.repository, tree[i].sha, { onSuccess: function(response) {
              file1 = response.responseText;
              file1Sha = tree[i].sha;
              flag++;
              process();
            }.bind(this)});
            break;
          }

        }
      }.bind(this)});


      GH.Tree.show( this.user_id, this.repository, this.branch, tree2, { onData: function(tree) {
        for( var i = 0; i < tree.length; i++ ) {
          if( tree[i].name == filename ){
            // now request
            GH.Blob.show( this.user_id, this.repository, tree[i].sha, { onSuccess: function(response) {
              file2 = response.responseText;
              file2Sha = tree[i].sha;
              flag++;
              process();
            }.bind(this)});
            break;
          }
        }
      }.bind(this)});

    }
  } 
  
  
  ,initialize: function($super, f) {
    $super(f);
  }
  
});

/* add the plugin to the plugins list */
window.FP.push(Diff);