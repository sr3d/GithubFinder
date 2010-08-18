/* Panel */
window.P = Class.create({
  initialize: function(f, options) { 
    options = Object.extend( {
      tree:         []
      ,index:       0
      ,name:        ''
      ,item:        null
    }, options, {});
    
    this.f        = f;
    this.tree     = options.tree;
    this.index    = options.index;
    this.name     = options.name;
    this.item     = options.item;
    
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
    var item, icon, css, recent,
        html = ['<ul class=files>'];

    // debugger
    for( var i = 0, len = this.tree.length; i < len; i++ ) {
      item = this.tree[i];
      // recent = this.item && item.sha == this.item.commit.id ? '*' : '';
      css  = item.type == 'tree' ? 'folder' : 'file';

      html.push( 
        '<li class=' + css +'>' + 
          '<span class=ico>' +
            '<a href=javascript:void(0) data-sha='+ item.sha + ' data-name="' + item.name + '">' + item.name + 
              // recent +
            '</a>' +
          '</span>' +
        '</li>'
      );
    }
    html.push('</ul>');

    return '<div id=p' + this.index + ' data-index=' + this.index +' class=panel>' + html.join('') + '</div>';
  }

});