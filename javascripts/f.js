/* alias */
var AR = Ajax.Request;

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
        for( var i = 0, len = tree.length; i < len; i++ ) {
          this.shas[ tree[i].sha ] = tree[i];
        }

        // debugger
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

    if( item.type == 'tree' ) {
      this.renderPanel( item.sha, index, item );
      
      /* set selection cursor */
      var selection = element.up('ul').down('li.current');
      selection ? selection.removeClassName('current') : '';
      
      element.up('li').addClassName('current');
    } else {
      // open the file;
    }
    
    /* display file info */
    var path = [];
    for( var i = 0; i <= index; i++ ) {
      path.push(this.panels[i].name);
    }
    path.push( item.name );
    
    path = path.join("/");
    
    // console.log("path %o", path);
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

var I = Class.create( { 
  initialize: function() {
    document.on('tree:show')
  }
});


document.on('dom:loaded', function() { 
  window.f = new F( { 
    user_id: 'rails'
    ,repository: 'rails'
    ,branch: 'master'
  });
  
  // setTimeout( function() { 
  //   f.renderPanel('b59883907274dce4a97fd6607abb2f6e0370fc2d', 0);
  //   
  //   setTimeout( function() { 
  //     f.renderPanel('a4e00d607ee23925073aae0e70eb57ef8f8f9a74', 1);
  //   }, 400 );
  //       
  // }, 500 );
  
 
});

