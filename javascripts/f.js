var F = Class.create({
  initialize: function(){
    this.panels = [];
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
});

/* Panel */
var P = Class.create({
  initialize: function(options ) { 
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


