/* PluginBase that allows for mixins into an object */
var PluginBase = Class.create( { 
  initialize: function(o) {
    if( !this.mixin ) this.mixin = {};
    Object.extend( o, this.mixin );
  }
} );

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
    
    this.u    = options.user_id;
    this.r = options.repository;
    this.b     = options.branch;
    
    // this.defaultRepo = 'sr3d/GithubFinder';

    
    this.render();
    
    this.repo = null;

    
    document.on('click','a[data-sha]', function( event, element ){ 
      this.click( element.readAttribute('data-sha'), element );
      // Event.stop(event);
    }.bind(this) );
    
    
    var idc = $('in'),
        s = function() { idc.show() },
        h = function() { if( Ajax.activeRequestCount == 0 ) idc.hide() };
    Ajax.Responders.register( { 
      onException: function(r,x) { console.log(x);h() }
      ,onComplete: h
      ,onCreate: s
    });
    
    /* init plugins */
    if( FP ) {
      for( var i = 0; i < FP.length; i++ ) {
        new FP[i](this);
      }
    }

    
    /* if user assigns user_id, repo, branch */
    this.xU();
    
    /* now let's finder begin! */
    try{
      this.oR(); // open repo
    } catch(e) {
      alert(e);
    }
  }
  
  
  ,xU: function() {
    var p = uP();
    if( p["user_id"] ) this.u   = p["user_id"];
    if( p["repo"] )    this.r   = p["repo"];
    if( p["branch"] )  this.b   = p["branch"];
  }
  
  ,render: function() { 
    $('content').update( this.h() );
    this.psW  = $('ps_w');
    this.bW = $('b_w');
    // debugger
  }
    
  ,h: function() {
    return [
      '<div id=finder class=tbb>',
        '<div id=r_w>',
          '<div class=p>',
            '<div id=url_w>',
              '<span class=big>Github Finder</span>',
              '<span>',
                'Repo: http://github.com/<input type=text name="" placeholder=' + this.defaultRepo + ' id=r />',
                '<span id=brs_w></span>', // branches
                '<input type=button id=go value=Go onclick=f.browse() />',
              '</span>',
              '<span id=in style=display:none>Loading...</span>',
            '</div>',
          '</div>',  // .p
        '</div>',   // #r_w
      
        '<div id=r_i_w class=tbb>', // #repo info wrapper
          '<div class=p><span id=r_i></span></div>',
        '</div>',
      
        '<div id=b_w>', // browser wrapper 
          '<div id=ps_w style="width:200px"></div>',
        '</div>',

        '<div id=i_w>', // info_wrapper
          '<div class=t>Info</div>',
          '<div id=i class=p>Select an item or navigate with arrow keys</div>',
        '</div>',

        '<div class=clear></div>',
      '</div>', // #finder 

      '<div id=f_c_w style="display:none">',                 // file content wrapper
        '<div id=f_h_w>',                 // file header
          '<div class=p>',
            '<div id=f_h class=big></div>',
          '</div>',
        '</div>',
        
        '<div id=f_c>',                 // file content
          '<div class=p>',                 // padding
            '<div id=f_w>',             // file wrapper
              '<div id=f></div>',       // file 
            '</div>',
            '<div id=diffoutput></div>',
          '</div>', // padding
        '</div>',
        
        '<div id=c_w>',                 // commit wrapper
          '<div id=commits>',
            '<div class=t>Commits Log</div>',
            '<div class=p id=c_l_w>Commits Log</div>', // commits log wrapper
          '</div>',
          '<div class=clear></div>',
        '</div>', // #c_w

        '<div class=clear></div>',
      '</div>',  // #f_c_w
      
      '<div id=footer>(c) 2010 Alex Le.  <a href=http://github.com/sr3d/GithubFinder>Fork me</a> on Github</div>'
    ].join('');
  }

  /* openRepo */
  ,oR: function(repo) {
    this.reset()
    
    var u,r,b = 'master';
    if( !repo ) {
      u = this.u;
      r = this.r;
      b = this.b;
    } else {
      repo = repo.split('/');
      if( repo.length < 2 ) { alert('invalid repository'); return }
      u = this.u    = repo[0];
      r = this.r = repo[1];
      b = this.b     = $('brs') ? $F('brs') : b;
    }
    
    $('r').value = u + '/' + r;
    

    /* Load the master branch */
    GH.Commits.listBranch( u, r, b, { 
      onData: function(commits) { 
        var tree_sha = commits.commits[0].tree;
        this.renderPanel(tree_sha);
      }.bind(this)
    });
    
    /* Show the repo info */
    GH.Repo.show( u, r, { 
      onData: function(repo) {
        this.repo = repo;
        this.renderRepoInfo();
      }.bind(this)
    });
    
    /* Show branches info */
    GH.Repo.listBranches( u, r, { 
      onData: function(branches) {
        this.bes = $H(branches);
        this.renderBranches();
      }.bind(this)
    });
    
  }
  
  ,reset: function() {
    $('f_c_w').hide();
    this.cI = -1;
    this.pI = 0;
    
    while(this.panels.length > 0)
      (this.panels.pop()).dispose();
  }
  
  ,browse: function() {
    $('i').innerHTML = '';
    this.openRepo( $F('r') || $('r').readAttribute('placeholder') );
  }
  /* render the status bar */
  ,renderRepoInfo: function() {
    $('r_i').innerHTML = this.repo.description;
  }
  
  ,renderBranches: function() {
    var html = ['Branch: <select id=brs>'];
    this.bes.each(function(b) { 
      html.push( 
        '<option ' + (this.b == b.key ? ' selected=""' : ' ' ) + '>' +
          b.key +
        '</option>'
      );
    }.bind(this));
    html.push('</select>');
    $('brs_w').innerHTML = html.join();
  }
  
  ,renderPanel: function( tree_sha, index, item ) { 
    index = (typeof index == 'undefined' ) ? 0 : index;

    /* clear previously opened panels */
    for( var i = this.panels.length - 1; i > index; i-- ) {
      (this.panels.pop()).dispose();
    }
    // debugger
    this.open( tree_sha, item );
  }
  
  ,_resizePanelsWrapper: function() {
    var panelWidth = 201;
    var w = (this.panels.length * panelWidth  );
    this.psW.style.width = w + 'px';

    /* scroll to the last panel */    
    this.bW.scrollLeft = w;
  }

  /* request the content of the tree and render the panel */
  ,open: function( tree_sha, item ) {
    GH.Tree.show( this.u, this.r, this.b, tree_sha, {
      onData: function(tree) { // tree is already sorted 
        /* add all items to cache */
        for( var i = 0, len = tree.length; i < len; i++ )
          this.shas[ tree[i].sha ] = tree[i];

        var name = item ? item.name : '' ;
        // debugger
        var p = new P( this, { tree: tree, index: this.panels.length, name: name, tree_sha: tree_sha, item: item } );
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


    /* set selection cursor && focus the item */
    e.up('ul').select('li.cur').invoke('removeClassName','cur');
    var p = e.up('div.panel'),
        li = e.up('li').addClassName('current'),
        posTop = li.positionedOffset().top + li.offsetHeight - p.offsetHeight;
    if( posTop > p.scrollTop) {
      p.scrollTop = posTop ;
    }
      

    /* current index */
    this.cI = item.index;
    this.pI = index; // current panel index;

    /* remember the current selected item */
    this.panels[ index ].cI = item.index;
    

    /* don't be trigger happy: ptm = preview timer  */
    if(this._ptm) clearTimeout( this._ptm );

    /* set a small delay here incase user switches really fast (e.g. keyboard navigation ) */
    this._ptm = setTimeout( function(){
      
      if( item.type == 'tree' ) {
        this.renderPanel( item.sha, index, item );
        // don't show file preview panel 
        $('f_c_w').hide();
      } else {
        
        $('f_c_w').show();
        if( /text/.test(item.mime_type) ) {
          $('f').innerHTML = '';
          GH.Blob.show( this.u, this.r, item.sha, { onSuccess: function(response) {
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

      
      var commit, commits;
      var showInfo = function() {
        var html = [
           '<div><b>Name</b><br/>',
             '<a href=',
               'http://github.com/' + this.u + '/' + this.r + '/' + item.type + '/' + this.b + path,
               ' target=_blank>',
               item.name,
             '</a>',
           '</div>',
           '<br/>',
           '<div><b>Path</b><br/> ' + path + '</div>',

           '<br/>',        
           '<div><b>Last Committed</b><br/> ' + 
             s( commit.id ) + ' on ' +
             (new Date(commit.committed_date)).toString() + 
           '</div>',
           '<br/>',

           '<div>',
             '<b>Author</b><br/>',
             '<a href=http://github.com/' + commit.author.login + '>' + commit.author.name + '</a>',
             ' (' + commit.author.email +')',
           '</div>',
           '<br/>',
           '<div>',
             '<b>Commit Message</b><br/>',
             commit.message,
           '</div>'
         ];
         $('i').update( html.join(''));
      }

      var showPreview = function() {
        $('diffoutput').hide();
        $('f_c_w').show();
        $('f_h').innerHTML = path;
      }

      var showCommitsLog = function() { 
        var diffWith, diffHead, diffPrevious,
            commitsHTML = ['<div>'];
        for( var i = 0; i < commits.length; i++ ) {
          diffWith = commits.length > 1 ? '<br/>Diff with: ' : '';
          diffHead = i > 0 ? 
            '<a href=javascript:void(0) onclick=f.diff(' + 
                [ '"', commit.id, '","',  
                  commit.tree, '","', 
                  commits[i].id, '","',
                  commits[i].tree, '","',
                  item.name, '"' 
                ].join('') +
              ')>Head</a> '
              : '';
          
          diffPrevious = commits[i+1] ? 
            ' <a href=javascript:void(0) onclick=f.diff(' + 
              [ '"', commits[i].id, '","',  
                commits[i].tree, '","', 
                commits[i+1].id, '","',
                commits[i+1].tree, '","',
                item.name, '"' 
              ].join('') +
            ')>Previous</a>'
            : '';
          
          commitsHTML.push(
            '<div class=ce>' +
              '<b>' + s(commits[i].id) +'</b>' + ' by ' + commits[i].author.name +
              diffWith + diffHead + (diffHead && diffPrevious ? ' - ' : '') + diffPrevious +
            '</div>'
          );
        };
        commitsHTML.push('</div>');
        $('c_l_w').update( commitsHTML.join('') );
      };
      
      /* query the commits to get a list of commits and info */
      
      GH.Commits.list( this.u, this.r, this.b, path, { onData: function(cs) {
        item.commit = commit = cs[0];  // also assign the item's commit to keep track of folder's latest commit
        commits = cs;
        
        showInfo();
        
        if( item.type != 'tree' ) { 
          showPreview();
          showCommitsLog();
        }
        
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
      lineNumbers.push( '<span>' + (i + 1) + "</span>\n");
      
      lines.push( text[i] ? text[i].replace('<', '&lt;').replace('>', '&gt;') : '' );

      // count actual loc
      sloc += text[i] ? 1 : 0;
    }
    
    var html = [
      '<div class=meta>',
        '<span>' + item.mode + '</span>',
        '<span>' + text.length + ' lines (' + sloc +' sloc)</span>',
        '<span>' + item.size + ' bytes</span>',
      '</div>',
    
      '<div id=f_c_s>',  // file content scroll
        '<table cellspacing=0 cellpadding=0>',
          '<tr>',
            '<td>',
              '<pre class=ln>',
                lineNumbers.join(''),
              '</pre>',
            '</td>',
          
            '<td width=100% valign=top>',
              '<pre class=code>',
                lines.join("\n"),
              '</pre>',
            '</td>',
          '</tr>',
        '</div>'
    ];
    
    $('diffoutput').hide();
    $('f').update( html.join('') ).show();
  }
});