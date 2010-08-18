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
  			    baseTextName:     'Tree: ' + tree1 + '<br/>(' + file1Sha +')',
  			    newTextName:      'Tree: ' + tree2 + '<br/>(' + file2Sha +')',
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
      // 
      // ,test: function() { 
      //   /* commit contains tree data
      //     to load the file in the commit, have to go thru the tree, grab the sha of the file
      //     then request the file itself;
      //   */
      //   
      //   var sha1  = '1607a8b08ce355043220f035b6d56a6e5a5d782c'; // commit sha
      //   var sha2  = 'ee9c950f2fe0c7953f0a9ad6a53439da7a4e89bc';
      //   
      //   var filename  = 'Gemfile';
      //   
      //   var tree1 = '27e7a9c4210ab4fa49e20afffdf723dda4366a15';
      //   var tree2 = '1b3f6a3e49be0ebacb251de0c0fc12bf64e2e596';
      //   
      //   
      //   var file1, file2, file1Sha, file2Sah, diff;
      //   
      //   var flag = 0;
      //   var process = function() { 
      //     if( flag < 2 ) {
      //       console.log("pending requests");
      //       return;
      //     }
      //     console.log("file1 %o",file1);
      //     console.log("file2 %o",file2);
      //     
      //     $('file1').value = file1;
      //     $('file2').value = file2;
      //     // $('diff').value = diff;
      //     // debugger
      //       
      //     file1 = difflib.stringAsLines(file1);
      //     file2 = difflib.stringAsLines(file2)
      //     var sm = new difflib.SequenceMatcher( file1, file2 );
      //     var opcodes = sm.get_opcodes();
      //     // debugger
      //     var diffoutputdiv = $("diffoutput");
      //     while (diffoutputdiv.firstChild) diffoutputdiv.removeChild(diffoutputdiv.firstChild);
      //     var contextSize = null; // or a number 
      //     var showInline = false;
      //     try{
      //         
      //       var node = diffview.buildView({ 
      //        baseTextLines:    file1,
      //          newTextLines:     file2,
      //          opcodes:          opcodes,
      //          baseTextName:     'Tree: ' + tree1 + '<br/>(' + file1Sha +')',
      //          newTextName:      'Tree: ' + tree2 + '<br/>(' + file2Sha +')',
      //          contextSize:      contextSize,
      //          viewType:         showInline 
      //        });
      //      diffoutputdiv.appendChild( node );
      //        
      //       // console.log("node %o",node);
      //       console.log("done");
      //     } catch(ex) {
      //       alert(ex.message);
      //       console.log("ex %o",ex);
      //     }
      //   }
      //   
      //   GH.Tree.show( this.user_id, this.repository, this.branch, tree1, { onData: function(tree) {
      //     for( var i = 0; i < tree.length; i++ ) {
      //       if( tree[i].name == filename ){
      //         // now request
      //         GH.Blob.show( this.user_id, this.repository, tree[i].sha, { onSuccess: function(response) {
      //           file1 = response.responseText;
      //           file1Sha = tree[i].sha;
      //           flag++;
      //           process();
      //         }.bind(this)});
      //         break;
      //       }
      //         
      //     }
      //   }.bind(this)});
      //   
      // 
      //   GH.Tree.show( this.user_id, this.repository, this.branch, tree2, { onData: function(tree) {
      //     for( var i = 0; i < tree.length; i++ ) {
      //       if( tree[i].name == filename ){
      //         // now request
      //         GH.Blob.show( this.user_id, this.repository, tree[i].sha, { onSuccess: function(response) {
      //           file2 = response.responseText;
      //           file2Sha = tree[i].sha;
      //           flag++;
      //           process();
      //         }.bind(this)});
      //         break;
      //       }
      //     }
      //   }.bind(this)});
      //   
      // }    
  } 
  
  
  ,initialize: function($super, f) {
    $super(f);
  }
  
});

/* add the plugin to the plugins list */
window.FP.push(Diff);