/* code highliter */
var CH = Class.create( PluginBase, { 
  initialize: function($super, f) {
    $super(f);
    
    // this.addStylesheet();

    var hlt = CodeHighlighter;
    
    var getFiletype = function(filename,text) {
      var fileType,
          matchingRules = { 
              'ruby':         [ /\.rb$/i, /\bRakefile\b/i, /\bGemfile\b/i, /\.gemspec\b/i, /\bconsole\b/i, /\.rake$/i ]
              ,'css':         [ /\.css/i ]
              ,'html':        [ /\.html?$/i, /\.aspx$/i, /\.php$/i ]
              ,'javascript':  [ /\.js$/i ]
              ,'python':      [ /\.py$/i ]
              ,'applescript': [ /\.applescript$/i ]
          };
      
      
      $H(matchingRules).each(function(type) { 
        for( var i = 0; i < type.value.length; i++ ) {
          if( type.value[i].match(filename) ) {
            fileType = type.key;
            return;
          }
        }
      } );
      
      /* attempt to futher detect the fileType */
      if( !fileType ) {
        text = text.replace(/\r\n/, "\n").split(/\n/)[0];
        fileType =  /ruby/i.test(text) ?    'ruby' : 
                    /python/i.test(text) ?  'python' : 
                    /php/i.test(text) ?     'php' : 
                    '';
      }
      
      return fileType;
    }
    
    var old = f.previewTextFile;
    f.previewTextFile = function( text, item ) { 
      old(text,item);
      var codeEl = $('code');
      codeEl.className = ''; // clear previous syntax class
      codeEl.addClassName(getFiletype(item.name,text));
      
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