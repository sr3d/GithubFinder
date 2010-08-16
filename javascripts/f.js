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
    // $H(tree).each(function(item) { 
    //   
    // });
    for( var i = 0, len = tree.length; i < len; i++ ) {
      item = tree[i];
      html.push( '<li><a href=#>' + item.name + ' ' + item.size + '</a></li>');
    }
    
    html.push('</ul>');
    // debugger
    this.panelsWrapper.insert({
      bottom: '<div id=p' + this.panels.length + 
              ' class=panel>' + html.join('') + '</div>'
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
  
  var user_id     = 'sr3d',
      repository  = 'githubfinder',
      branch      = 'master';
  
  GH.Commits.listBranch( user_id, repository, branch, { 
    onData: function(commits) { 
      var tree_sha = commits.commits[0].tree;      
      console.log("commits %o", commits);
      
      GH.Tree.show( user_id, repository, branch, tree_sha, {
        onData: function(tree) {
          f.open(tree);
        }
      });
    }
  });
});