/* Panel */
window.P = Class.create({
  initialize: function(f, options) { 
    this.f        = f;
    this.tree     = options.tree  || [];
    this.index    = options.index || 0 ;
    this.name     = options.name;
    this.item     = options.item;

    this.r();
  }
  
  ,dispose: function() {
    $('p' + this.index ).remove();
  }
  
  ,r: function() {
    this.f.psW.insert({ bottom: this.h() });
  }
  
  ,h: function() {
    var it, css, recent, ix=this.index, t=this.tree,bH = this.f.bW.offsetHeight,
        h = '<ul class=files>';

    for( var i = 0; i < t.length; i++ ) {
      it = t[i];
      h += '<li class=' + it.type + '>' + 
              '<span class=ico>' +
                '<a href=# data-sha=' + it.sha + ' data-name="' + it.name + '">' + it.name + '</a>' +
              '</span>' +
            '</li>';
    }
    h += '</ul>';

    return '<div id=p' + ix + ' data-index=' + ix +' class=panel style="height:' + bH +'px">' + h + '</div>';
  }

});