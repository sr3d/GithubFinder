window.GH = {
  hash: {}
  // ,proxy: 'http://alexle.net/experiments/githubfinder/proxy.php?url='
  ,proxy: './proxy.php?url='
  // ,proxy: ''
  ,api: 'http://github.com/api/v2/json'
  
  /* set the proxy.php url and switch to the correct AR (AjaxRequest) */
  ,setProxy: function(p) { 
    this.proxy = p;
    // window.AR = p.indexOf('./') == 0 ? Ajax.Request : JSP;
    window.AR = JSP;
  }
  
  ,Commits: {
    _cache: []
    /* list all commits for a specific branch */
    ,listBranch: function(u, r, b, o ) {
      var onData = o.onData,
          url = GH.api + '/commits/list/' + u + '/' + r + '/' + b;
      o.onSuccess = function(res) {
        onData( res.responseText );
      }
      new JSP( url, o );
    }
    
    ,list: function( u, r, b, path, o ) {
      var self = this,
          url = GH.api + '/commits/list/' + u + '/' + r + '/' + b + path,
          onData = o.onData;
          
      o.onSuccess = function(res) {
        var cs = res.responseText.commits;
        // if(!cs) { alert('not found'); return;}
        /* cache the commits */
        self._cache[ url ] = cs;
        onData( cs );
      }
      
      /* hit the cache first */
      if( this._cache[ url ] ) {
        onData( this._cache[ url ] );
        return;
      }

      new JSP( url, o );
    }
    
    ,show: function( u, r, sha, o ) {
      var self = this,
          url = GH.api + '/commits/show/' + u + '/' + r + '/' + sha,
          onData = o.onData;

      o.onSuccess = function(res) {
        var c = res.responseText.commit;
        /* cache */
        self._cache[ sha ] = c;
        onData( c );
      }

      /* hit the cache first */
      if( this._cache[ sha ] ) {
        onData( this._cache[ sha ] );
        return;
      }

      new JSP( url, o );
    }
  }
  
  ,Tree: {
    _cache: {}
    ,show: function( u, r, b, tree_sha, o  ) {
      var self = this,
          url = GH.api + '/tree/show/' + u +'/' + r +'/' + tree_sha,
          onData = o.onData;
          
      o.onSuccess = function(res) {
        var tree = res.responseText.tree;
        // if(!tree) { alert('not found'); return;}
        tree = tree.sort(function(a,b){
          // blobs always lose to tree
          if( a.type == 'blob' && b.type == 'tree' ) 
            return 1; 
          if( a.type == 'tree' && b.type == 'blob' )
            return -1;
          return a.name > b.name ? 1 : ( a.name < b.name ? - 1 : 0 );
        });          
        
        /* add the index to the item */
        for( var i = 0, len = tree.length; i < len; i++ ) {
          tree[i].index = i;
        }
        
        /* cache the tree so that we don't have to re-request every time */
        self._cache[ tree_sha ] = tree;
        
        onData(tree);
      }

      
      /* hit the cache first */
      if( this._cache[ tree_sha ] ) {
        onData( this._cache[ tree_sha ] );
        return;
      }

      new JSP( url, o);
    }
  }
  
  ,Blob: {
    show: function( u, r, sha, o ) {
      var url = GH.api + '/blob/show/' + u + '/' + r + '/' + sha;
      new AR( GH.proxy + url, o );
    }
    
    /**
     * u,r,b: user, repo, branch
     * fn: filename
     * o: the options, with callback
     */
    ,loadPage: function(u,r,b,fn, o) {
      var url = 'http://github.com/' + u + '/' + r + '/blob/' + b +'/' + fn;
      new AR( GH.proxy + url, o );
    }
  }
  
  ,Repo: {
    show: function( u, r, o ) {
      var url = GH.api + '/repos/show/' + u + '/' + r,
          onData = o.onData;

      o.onSuccess = function(res) {
        onData(res.responseText.repository);
      }
      new JSP( url, o );
    }
    
    ,listBranches: function( u, r, o ) {
      var url = GH.api + '/repos/show/' + u + '/' + r + '/branches',
          onData = o.onData; 
      o.onSuccess = function(res) {
        var branches = res.responseText.branches;
        onData(branches);
      }
      new JSP( url, o );
    }
  }
  
  ,Raw: {
    loadBlobAtCommit: function( u, r, commitId, path, options ) {
      //http://github.com/:user_id/:repo/raw/:commit_id/:path
      // http://github.com/mojombo/grit/raw/c0f0b4f7a62d2e563b48d0dc5cd9eb3c21e3b4c2/lib/grit.rb
      url = 'https://github.com/' + u + '/' + r + '/raw/' + commitId + path;
      new AR( GH.proxy + url, options );
    }
  }
};