var Readme = Class.create( PluginBase, { 
  initialize: function($super, f) {
    $super(f);
    
    this.f = f;
    this.readme = null;
    // this.addStylesheet();

    var self      = this,
        old       = f._resizePanelsWrapper.bind(f);

    f._resizePanelsWrapper = function() {
      old();
      
      if( self.readme != null ) {return; } // don't run it again
      
      self.readme = false;
      var tree = this.ps[0].tree;
      for( var i = 0; i < tree.length; i++ ) {
        if( 'readme readme.md readme.textile'.indexOf(tree[i].name.toLowerCase()) >= 0) {
          self.readme = tree[i].name;
          break;
        }
      }
      
      if( !self.readme ) return;
      
      self.loadReadme();
      
    }; //.bind(f);
    
    
    var oB = f.browse.bind(f);
    f.browse = function() {
      /* reset the readme stuff */
      self.readme = null;
      if($('readme_wrapper')) $('readme_wrapper').remove();
      
      oB();
    }
  }
  
  ,loadReadme: function() {
    $('f_c_w').insert({ after:'<div id=readme_wrapper><div class=p><h1>README</h1><hr/><div id=readme></div></div></div>'});
    
    var url = 'http://github.com/' + this.f.u + '/' + this.f.r + '/blob/master/' + this.readme; 
    GH.Blob.loadPage( this.f.u, this.f.r, this.f.b, this.readme, { 
      onSuccess: function(response) {
        var html = response.responseText,
            div  = document.createElement('div');
        div.innerHTML = html.replace(/<script(.|\s)*?\/script>/g, '');
        
        // var content = $(div).down('div#readme');
        
        $('readme').update( $(div).down('div#readme').innerHTML )
        
        div = null;
      }
    });
  }
  
  /* add the link to the stylesheet */
  // ,addStylesheet: function() {
  //   var css = document.createElement('link');
  //   css.href = 'github_readme.css';
  //   css.rel  = 'stylesheet';
  //   css.type = 'text/css';
  //   document.body.appendChild(css);
  // }
});

// if( !Prototype.Browser.IE )
window.FP.push(Readme);