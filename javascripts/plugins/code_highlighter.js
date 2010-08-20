/* code highliter */
var CH = Class.create( PluginBase, { 
  initialize: function($super, f) {
    $super(f);
    
    // this.addStylesheet();

    var hlt = CodeHighlighter;
    
    var getFiletype = function(filename) {
      var fileType,
          matchingRules = { 
              'ruby':         [ /\.rb$/i, /\bRakefile\b/i, /\bGemfile\b/i, /\.gemspec\b/i, /\bconsole\b/i ]
              ,'css':         [ /\.css/i ]
              ,'html':        [ /\.html?$/i, /\.aspx$/i, /\.php$/i ]
              ,'javascript':  [ /\.js$/i ]
          };
      
      
      $H(matchingRules).each(function(type) { 
        for( var i = 0; i < type.value.length; i++ ) {
          if( type.value[i].match(filename) ) {
            fileType = type.key;
            return;
          }
        }
      } );
      
      return fileType;
    }
    
    var old = f.previewTextFile;
    f.previewTextFile = function( text, item ) { 
      old(text,item);
      var codeEl = $('code');
      codeEl.className = ''; // clear previous syntax class
      codeEl.addClassName( getFiletype(item.name));
      
      hlt.init();
    }
    
  }
  
  /* add the link to the stylesheet */
  // ,addStylesheet: function() {
  //   // <link href="css/code_highlighter.css" media="all" rel="stylesheet" type="text/css" /> 
  //   var css = document.createElement('link');
  //   css.href = 'css/code_highlighter.css';
  //   css.rel  = 'stylesheet';
  //   css.type = 'text/css';
  //   document.body.appendChild(css);
  // }
  
});

FP.push(CH);