if( typeof console == 'undefined' ) 
  console = { log: function(){} };

/* Util stuff */
/* return a truncated s */
var s = function(h) { return h.substr(0,6);};

window.FP = [];  // finder plugins

window.F = Class.create({
  initialize: function(options){
    options = Object.extend( { 
      user_id:      'rails'
      ,repository:  'rails'
      ,branch:      'master'
    }, options || {} );
    
    this.panels   = []; 
    this.shas     = {};
    
    this.user_id    = options.user_id;
    this.repository = options.repository;
    this.branch     = options.branch;
    
    this.defaultRepo = 'sr3d/GithubFinder';
    
    
    this.render();
    
    this.repo = null;


    this.cI = -1;
    this.pI = 0;
    
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
    
    
    var i = $('indicator');
    var s = function() { i.show(); };
    var h = function() { i.hide(); };
    
    Ajax.Responders.register( { 
      onException: function( ex ) { 
        s();
        console.log("AJax exception %o",ex);
      }
      ,onComplete: function() { if( Ajax.activeRequestCount == 0 ) h(); }
      ,onCreate: s
    });
    
    /* if we have pluggins */
    if( FP ) {
      for( var i = 0; i < FP.length; i++ ) {
        new FP[i](this);
      }
    }
      
  }
  
  ,render: function() { 
    $('content').update( this.toHTML() );
    this.panelsWrapper  = $('panels_wrapper');
    this.browserWrapper = $('browser_wrapper');
    

    GH.Repo.show( this.user_id, this.repository, { 
      onData: function(repo) {
        this.repo = repo;
        this.renderRepoInfo();
      }.bind(this)
    });
  }
    
  ,toHTML: function() {
    var html = [
      '<div id=finder>',
        '<div id=r_w>',
          '<div class=p>',
            '<div id=url_w>',
              '<span class=big>Github Finder</span>',
              '<span>',
                'Repo: http://github.com/<input type=text name="" placeholder=' + this.defaultRepo + '/>',
                '<input type="button" id="go" value="Go"/>',
              '</span>',
              '<span id=indicator>Loading...</span>',
            '</div>',
          '</div>',  // .p
        '</div>',   // #r_w
      
        '<div id=r_i_w>', // #repo info
          '<div class=p><span id=r_i></span></div>',
        '</div>',
      
        '<div id="browser_wrapper">',
          '<div id="panels_wrapper" style="width:200px"></div>',
        '</div>',

        '<div id="info_wrapper">',
          '<div class="big">Info</div>',
          '<div id="info" class="padding"></div>',
        '</div>',

        '<div class="clear"></div>',
      '</div>', // #finder 

      '<div id="file_wrapper">',
        '<div id="file"></div>',
      '</div>',
      '<div id="diffoutput"></div>'  
    ];
    
    return html.join(' ');
  } 
  
  ,renderRepoInfo: function() {
    $('r_i').innerHTML = this.repo.description;
    // var html = [
    //   '<div>',
    //     '<span class=big>',
    //       
    //     '</span>',
    //   '</div>'
    // ];
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
  
  /**
   * @sha: the sha of the object
   * @e:  the source element
   */
  ,click: function(sha, e) {
    // debugger
    var item = this.shas[ sha ];
    var index = +(e.up('.panel')).readAttribute('data-index');


    /* set selection cursor */
    e.up('ul').select('li.current').invoke('removeClassName','current');
    var p = e.up('div.panel'),
        li = e.up('li').addClassName('current'),
        posTop = li.positionedOffset().top + li.offsetHeight - p.offsetHeight;
    /* scroll viewport if needed*/
    // debugger
    if( posTop > p.scrollTop) {
      p.scrollTop = posTop ;
    }
      

    /* current index */
    this.cI = item.index;
    this.pI = index; // current panel index;

    /* remember the current selected item */
    this.panels[ index ].cI = item.index;
    
    
    if(this._ptm) clearTimeout( this._ptm );

    /* set a small delay here incase user switches really fast (e.g. keyboard navigation ) */
    this._ptm = setTimeout( function(){
      
      if( item.type == 'tree' ) {
        this.renderPanel( item.sha, index, item );
      } else {
        // open the file;
        if( /text/.test(item.mime_type) ) {
          GH.Blob.show( this.user_id, this.repository, item.sha, { onSuccess: function(response) {
            this.previewTextFile(response.responseText, item);  
          }.bind(this)} );
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
        // debugger
        var html = [
          '<div><b>Name</b><br/>',
            '<a href=',
              'http://github.com/' + this.user_id + '/' + this.repository + '/' + item.type + '/' + this.branch + path,
              ' target=_blank>',
              item.name,
            '</a>',
          '</div>',
          '<br/>',
          '<div><b>Path</b><br/> ' + path + '</div>',

          '<br/>',        
          '<div><b>Last Committed</b><br/> ' + 
            s( c.id ) + ' on ' +
            (new Date(c.committed_date)).toString() + 
          '</div>',
          '<br/>',

          '<div>',
            '<b>Author</b><br/>',
            '<a href=http://github.com/' + c.author.login + '>' + c.author.name + '</a>',
            '(' + c.author.email +')',
          '</div>',
          '<br/>',
          '<div>',
            '<b>Commit Message</b><br/>',
            c.message,
          '</div>'
        ];
        $('info').update( html.join(''));
      }.bind(this)});      
    
    
    }.bind(this), 200); // time out
    
    
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
          text[i] ? text[i].replace('<', '&lt;').replace('>', '&gt;') : '<br/>',
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
  
});

/* Panel */
window.P = Class.create({
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
    var item, icon, css, 
        html = ['<ul class=files>'];
    for( var i = 0, len = this.tree.length; i < len; i++ ) {
      item = this.tree[i];
      css  = item.type == 'tree' ? 'folder' : 'file';
      icon = item.type == 'tree' ? 'dir' : 'txt';
      
      html.push( 
        '<li class=' + css +'>' + 
          // '<img src=img/' + icon + '.png />' +
          '<span class=ico>' +
            '<a href=javascript:void(0) data-sha='+ item.sha + '>' + item.name + '</a>' +
          '</span>' +
        '</li>'
      );
    }
    html.push('</ul>');

    return '<div id=p' + this.index + ' data-index=' + this.index +' class=panel>' + html.join('') + '</div>';
  }

});