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
    this.shas     = {};
    
    this.user_id    = options.user_id;
    this.repository = options.repository;
    this.branch     = options.branch;
    
    GH.Commits.listBranch( this.user_id, this.repository, this.branch, { 
      onData: function(commits) { 
        var tree_sha = commits.commits[0].tree;
        this.open( tree_sha );
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
  
  ,renderPanel: function( sha, index ) { 
    console.log("index:" + index );
    for( var i = this.panels.length - 1; i > index; i-- ) {
      (this.panels.pop()).dispose();
    }
    this.open( sha );
  }
  
  
  ,open: function( tree_sha ) {
    GH.Tree.show( this.user_id, this.repository, this.branch, tree_sha, {
      onData: function(tree) { // tree is already sorted 
        /* add all items to cache */
        for( var i = 0, len = tree.length; i < len; i++ ) {
          this.shas[ tree[i].sha ] = tree[i];
        }

        var p = new P( { tree: tree, index: this.panels.length } );
        this.panels.push( p );
      }.bind(this)
    });
  }
  
  ,click: function(sha, element) {
    // debugger
    var item = this.shas[ sha ];
    if( item.type == 'tree' ) {
      var index = +(element.up('.panel')).readAttribute('data-index');
      this.renderPanel( sha, index );
    } else {
      // open the file;
    }
  }
  
});

/* Panel */
var P = Class.create({
  initialize: function(options) { 
    options = Object.extend( {
      tree: []
      ,index: 0
    }, options, {});
    
    this.tree     = options.tree;
    this.index    = options.index;
    
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


document.on('dom:loaded', function() { 
  window.f = new F( { 
    user_id: 'rails'
    ,repository: 'rails'
    ,branch: 'master'
  });
});