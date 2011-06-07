var RecentlyChangedFiles = Class.create( PluginBase, { 
  initialize: function( $super, f ) {
    $super(f);
  }
  
  ,recentlyChangedFiles = function(){ 
    if( !this.item ) { 
       return;
    }

    if( !this.item.commit ) { // race conditions!!!!! 
      return; // commit log not ready
    }

    // get the commit log to show the latest changed
    GH.Commits.show( this.f.user_id, this.f.repository, this.item.commit.id, { 
      onData: function(commit) {
        var files = commit.modified || []; // TODO:  merge and move
        var p = $('p' + this.index );
        for( var i = 0; i< files.length; i++ ) {
          fn = files[i].filename.split('/');
          fn = fn[ fn.length-1 ];
          var e = p.down('a[data-name="' + fn + '"]');
          if( e ) e.up('li').addClassName('recent');
        }

      }.bind(this)
    } );
  }
})