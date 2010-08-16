/* alias */
var AR = Ajax.Request;
// var PAR = function() {  // paralelle Ajax Request
//   
// }
// GH.branch('sr3d', 'githubfinder','master');
// GH.tree('sr3d', 'githubfinder','master')

var F = Class.create({
  initialize: function(options){
    options = Object.extend( { 
      user_id:      'rails'
      ,repository:  'rails'
      ,branch:      'master'
    }, options || {} );
    
    this.panels   = [];
    this.panelsWrapper  = $('panels_wrapper');
    this.browserWrapper = $('browser_wrapper');
    this.shas     = {};
    
    this.user_id    = options.user_id;
    this.repository = options.repository;
    this.branch     = options.branch;
    
    GH.Commits.listBranch( this.user_id, this.repository, this.branch, { 
      onData: function(commits) { 
        var tree_sha = commits.commits[0].tree;
        // this.open( tree_sha );
        this.renderPanel(tree_sha);
      }.bind(this)
    });
    
    document.on('click','a[data-sha]', function( event, element ){ 
      var sha = element.readAttribute('data-sha');
      this.click( sha, element );
      Event.stop(event);
    }.bind(this) );
    
  }
  
  
  ,toHTML: function() {
    var html = [
      '<div>'
    ];
  } 
  
  ,renderPanel: function( tree_sha, index, item ) { 
    index = (typeof index == 'undefined' ) ? 0 : index;

    /* clear previously opened panels */
    for( var i = this.panels.length - 1; i > index; i-- ) {
      (this.panels.pop()).dispose();
    }

    this.open( tree_sha, item );
  }
  
  ,_resizePanelsWrapper: function() {
    var panelWidth = 201;
    var w = (this.panels.length * panelWidth  );
    this.panelsWrapper.style.width = w + 'px';

    /* scroll to the last panel */    
    this.browserWrapper.scrollLeft = w;
  }
  
  ,open: function( tree_sha, item ) {
    GH.Tree.show( this.user_id, this.repository, this.branch, tree_sha, {
      onData: function(tree) { // tree is already sorted 
        /* add all items to cache */
        for( var i = 0, len = tree.length; i < len; i++ )
          this.shas[ tree[i].sha ] = tree[i];

        var name = item ? item.name : '' ;
        
        var p = new P( { tree: tree, index: this.panels.length, name: name } );
        this.panels.push( p );
        
        this._resizePanelsWrapper();
        
      }.bind(this)
    });
  }
  
  ,click: function(sha, element) {
    // debugger
    var item = this.shas[ sha ];
    var index = +(element.up('.panel')).readAttribute('data-index');  

    console.log("item %o",item);
    
    if( item.type == 'tree' ) {
      this.renderPanel( item.sha, index, item );
      
      /* set selection cursor */
      var selection = element.up('ul').down('li.current');
      selection ? selection.removeClassName('current') : '';
      
      element.up('li').addClassName('current');
    } else {
      // open the file;
      if( /text/.test(item.mime_type) ) {
        // show preview here
        GH.Blob.show( this.user_id, this.repository, item.sha, { onSuccess: function(response) {
          this.previewTextFile(response.responseText, item);
        }.bind(this)});
      }
      
    }
    
    /* display file info */
    var path = [];
    for( var i = 0; i <= index; i++ ) {
      path.push(this.panels[i].name);
    }
    path.push( item.name );
    
    path = path.join("/");
    
    GH.Commits.list( this.user_id, this.repository, this.branch, path, { onData: function(commits) {
      var c = commits[0];
      var commitsHTML = ['<div>'];
      for( var i = 0; i < commits.length; i++ ) {
        
        commitsHTML.push(
          '<div>Commit: ' + 
            '<a href=javascript:void(0) onclick=f.diff(' + 
              [ '"', c.id, '","',  c.tree, '","', commits[i].id, '","',commits[i].tree, '","',item.name, '"' ].join('')+')>' +
              commits[i].id +
            '</a>' + 
            '(tree: ' + commits[i].tree + ')' +
          '</div>' 
        );
      }
      commitsHTML.push('</div>');
    
      var html = [
        '<div>Name: ',
          '<a href=',
            'http://github.com/' + this.user_id + '/' + this.repository + '/' + item.type + '/' + this.branch + path,
            'target=_blank>',
            item.name,
          '</a>',
         '</div>',
        '<div>Path: ' + path + '</div>',
        '<div>Committed Date: ' + (new Date(c.committed_date)).toString() + '</div>',
        '<div>',
          'Author: <a href=http://github.com/' + c.author.login + '>' + c.author.name + '</a>',
          '(' + c.author.email +')',
        '</div>',
        '<div>',
          'Message:<br/>',
          c.message,
        '</div>',
        
        '<div class=commits>',
          commitsHTML.join(''),
        '</div>'
      ];
      $('info').update( html.join(' '));
    }.bind(this)});
    
    // console.log("path %o", path);
  }
  

  ,previewTextFile: function( text, item ) {
    // debugger
    text = text.replace(/\r\n/, "\n").split(/\n/);
    /* render line numbers */
    
    var lineNumbers = [],
        lines = []
        sloc = 0;
    for( var i = 0, len = text.length; i < len; i++ ) {
      lineNumbers.push( '<div>' + (i + 1) + '</div>');
      
      lines.push( [ 
        '<div class=l>',
          text[i] ? text[i] : '<br/>',
        '</div>'
      ].join(''));

      // count actual loc
      sloc += text[i] ? 1 : 0;
    }
    
    var html = [
      '<div class=meta>',
        '<span>' + item.mode + '</span>',
        '<span>' + text.length + ' (' + sloc +' sloc)</span>',
        '<span>' + item.size + ' bytes</span>',
      '</div>',
    
      '<table>',
        '<tr>',
          '<td>',
            '<pre class=ln>',
              lineNumbers.join(''),
            '</pre>',
          '</td>',
          
          '<td width=100% valign=top>',
            '<pre>',
              lines.join(''),
            '</pre>',
          '</td>',
        '</tr>'
    ]
    
    $('file').update( html.join('') ).show();
    
    // 1.  get current file
    // 2.  get a different
    // 3.  diff any differences? 
  }
  
  ,diff: function( sha1, tree1, sha2, tree2, filename ) {
    $('file').hide();
    var file1, file2, file1Sha, file2Sah, diff;
    
    var flag = 0;
    var process = function() { 
      if( flag < 2 ) {
        console.log("pending requests");
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
      var diffoutputdiv = $("diffoutput");
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
        console.log("done");
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
  
  ,test: function() { 
    /* commit contains tree data
      to load the file in the commit, have to go thru the tree, grab the sha of the file
      then request the file itself;
    */
    
    var sha1  = '1607a8b08ce355043220f035b6d56a6e5a5d782c'; // commit sha
    var sha2  = 'ee9c950f2fe0c7953f0a9ad6a53439da7a4e89bc';
    
    var filename  = 'Gemfile';
    
    var tree1 = '27e7a9c4210ab4fa49e20afffdf723dda4366a15';
    var tree2 = '1b3f6a3e49be0ebacb251de0c0fc12bf64e2e596';
    
    
    var file1, file2, file1Sha, file2Sah, diff;
    
    var flag = 0;
    var process = function() { 
      if( flag < 2 ) {
        console.log("pending requests");
        return;
      }
      console.log("file1 %o",file1);
      console.log("file2 %o",file2);
      
      $('file1').value = file1;
      $('file2').value = file2;
      // $('diff').value = diff;
      /* */
      // debugger
        
      file1 = difflib.stringAsLines(file1);
      file2 = difflib.stringAsLines(file2)
      var sm = new difflib.SequenceMatcher( file1, file2 );
      var opcodes = sm.get_opcodes();
      // debugger
      var diffoutputdiv = $("diffoutput");
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
        console.log("done");
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
    
    
    // GH.Commits.show( this.user_id, this.repository, sha1, { onData: function(commit) {
    //   console.log("commit %o",commit);
    //   var modified = commit.modified;
    //   for( var i = 0; i < modified.length; i++ ) {
    //     if( modified[i].filename == filename )
    //       diff = modified[i].diff;
    //   }
    //   flag++;
    //   process();
    // }.bind(this)});
    
  }
  
});

/* Panel */
var P = Class.create({
  initialize: function(options) { 
    options = Object.extend( {
      tree: []
      ,index: 0
      ,name: ''
      
    }, options, {});
    
    this.tree     = options.tree;
    this.index    = options.index;
    this.name     = options.name;
    
    this.render();
  }
  
  ,dispose: function() {
    $('p' + this.index ).remove();
  }
  
  ,render: function() {
    $('panels_wrapper').insert({ bottom: this.toHTML() });
    $('p' + this.index ).select('li').each( function(item) { 
      item.observe('mouseover', function() { 
        item.addClassName('hover');
      }).observe('mouseout', function() {
        item.removeClassName('hover');
      });
    })
  }
  
  ,toHTML: function() { 
    var html = ['<ul>'];
    var item;
    for( var i = 0, len = this.tree.length; i < len; i++ ) {
      item = this.tree[i];
      var css = item.type == 'tree' ? 'folder' : 'file';
      html.push( '<li class=' + css +'><a href=javascript:void(0) data-sha='+ item.sha + '>' + item.name + '</a></li>');
    }
    html.push('</ul>');

    return '<div id=p' + this.index + ' data-index=' + this.index +' class=panel>' + html.join('') + '</div>';
  }

});

// var I = Class.create( { 
//   initialize: function() {
//     document.on('tree:show')
//   }
// });


document.on('dom:loaded', function() { 
  window.f = new F( { 
    user_id: 'rails'
    ,repository: 'rails'
    ,branch: 'master'
  }); 
  
  
  // window.f.test();
});


//GH.Blob.showByCommit('rails','rails','ee9c950f2fe0c7953f0a9ad6a53439da7a4e89bc','/Gemfile')


