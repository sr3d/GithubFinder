/* alias */
var AR = Ajax.Request;

// GH.branch('sr3d', 'githubfinder','master');
// GH.tree('sr3d', 'githubfinder','master')

var F = Class.create({
  initialize: function(){
    this.panels   = [];
    this.panelsWrapper  = $('panels_wrapper');
  }
  
  ,toHTML: function() {
    var html = [
      '<div>'
    ];
  }
  
  ,renderPanel: function( level, html ) { 
    for( var i = level; i < this.panels.length; i++ ) {
      (this.panels[i].pop()).dispose();
    }
    
    // this.panels
  }
  
  ,open: function( tree ) {
    var html = ['<ul>'];
    var item;

    for( var i = 0, len = tree.length; i < len; i++ ) {
      item = tree[i];
      var css = item.type == 'tree' ? 'folder' : 'file';
      html.push( '<li class=' + css +'><a href=# sha='+ item.sha + '>' + item.name + ' ' + item.size + '</a></li>');
    }
    html.push('</ul>');

    this.panelsWrapper.insert({
      bottom: '<div id=p' + this.panels.length + ' class=panel>' + html.join('') + '</div>'
    });
    
    $('p0').select('li').each( function(item) { 
      // console.log("item %o",item);
      item.observe('mouseover', function() { 
        item.addClassName('hover');
      }).observe('mouseout', function() {
        item.removeClassName('hover');
      });
    })
  }
  
});

/* Panel */
var P = Class.create({
  initialize: function(options) { 
    ;
  }
  
  ,dispose: function() {
    
  }
  ,toHTML: function() { 
    var html = [
      '<div class="panel">',
        this.renderEntries( this.options.entries ),
      '</div>'
    ]
  }
  
  ,renderEntries: function(entries){
    
  }
  
  ,renderEntry: function() { 
    
  }
});


document.on('dom:loaded', function() { 
  window.f = new F();
// f.open(window.tree.tree);  
  
  // var user_id     = 'sr3d',
  //     repository  = 'githubfinder',
  //     branch      = 'master';

  var user_id     = 'rails',
      repository  = 'rails',
      branch      = 'master';
  
  
  GH.Commits.listBranch( user_id, repository, branch, { 
    onData: function(commits) { 
      var tree_sha = commits.commits[0].tree;      
      console.log("commits %o", commits);
      
      GH.Tree.show( user_id, repository, branch, tree_sha, {
        onData: function(tree) {
          tree = tree.sort(function(a,b){
            // blob always lose to tree
            if( a.type == 'blob' && b.type == 'tree' ) 
              return 1; 
            if( a.type == 'tree' && b.type == 'blob' )
              return -1;
              
            return a.name > b.name ? 1 : ( a.name < b.name ? - 1 : 0 );
          });
          
          f.open(tree);
        }
      });
    }
  });
});