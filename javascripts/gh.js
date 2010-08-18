window.GH = {
  hash: {}
  // ,proxy: 'http://alexle.net/experiments/githubfinder/proxy.php?url='
  ,proxy: './proxy.php?url='
  
  ,api: 'http://github.com/api/v2/json'
  
  /* set the proxy.php url and switch to the correct AR (AjaxRequest) */
  ,setProxy: function(p) { 
    this.proxy = p;
    window.AR = p.indexOf('./') == 0 ? Ajax.Request : JSP;    
  }
  
  ,Commits: {
    _cache: []
    /* list all commits for a specific branch */
    ,listBranch: function(u, r, b, o ) {
      o = Object.extend({ 
        onSuccess: function(res) {
          // var commits = ;
          onData( eval('(' + res.responseText +')') );
        }
        // ,onData: Prototype.K
      }, o || {});

      var onData = o.onData; 

      var url = GH.api + '/commits/list/' + u + '/' + r + '/' + b;

      new AR( GH.proxy + url, o );
    }
    
    ,list: function( u, r, b, path, o ) {
      var self = this,
          url = GH.api + '/commits/list/' + u + '/' + r + '/' + b + path;
          
      o = Object.extend({ 
        onSuccess: function(res) {
          var commits = eval('(' + res.responseText +')').commits;
          
          /* cache the commits */
          self._cache[ url ] = commits;
                    
          onData( commits ); // get rid of root namespace
        }
        // ,onData: Prototype.K
      }, o || {});

      
      var onData = o.onData; 

      /* hit the cache first */
      if( this._cache[ url ] ) {
        onData( this._cache[ url ] );
        return;
      }

      new AR( GH.proxy + url, o );
    }
    
    ,show: function( u, r, sha, o ) {
      var self = this,
          url = GH.api + '/commits/show/' + u + '/' + r + '/' + sha;

      o = Object.extend({ 
        onSuccess: function(res) {
          // debugger
          var commit = eval('(' + res.responseText +')').commit;

          /* cache */
          self._cache[ sha ] = commit;

          onData( commit );
        }
        // ,onData: Prototype.K
      }, o || {});

      var onData = o.onData; 

      /* hit the cache first */
      if( this._cache[ sha ] ) {
        onData( this._cache[ sha ] );
        return;
      }

      new AR( GH.proxy + url, o );
    }
  }
  
  ,Tree: {
    _cache: {}
    ,show: function( u, r, b, tree_sha, o  ) {
      var self = this,
          url = GH.api + '/tree/show/' + u +'/' + r +'/' + tree_sha;
          
      o = Object.extend({ 
        onSuccess: function(res) {
          var tree = (eval('(' + res.responseText + ')')).tree;
          
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
      }, o || {});

      var onData = o.onData;
      
      /* hit the cache first */
      if( this._cache[ tree_sha ] ) {
        onData( this._cache[ tree_sha ] );
        return;
      }

      new AR( GH.proxy + url, o);
    }
  }
  
  ,Blob: {
    show: function( u, r, sha, o ) {
      o = Object.extend({ 
        onSuccess: Prototype.K
      }, o || {});

      var onData = o.onData; 

      var url = GH.api + '/blob/show/' + u + '/' + r + '/' + sha;

      new AR( GH.proxy + url, o );
    }
  }
  
  ,Repo: {
    show: function( u, r, o ) {
      o = Object.extend({ 
        onSuccess: function(res) {
          var repo = (eval('(' + res.responseText + ')')).repository;
          onData(repo);
        }
        // ,onData: Prototype.K
      }, o || {});

      var onData = o.onData; 
      var url = GH.api + '/repos/show/' + u + '/' + r;
      new AR( GH.proxy + url, o );
    }
    
    ,listBranches: function( u, r, o ) {
      o = Object.extend({ 
        onSuccess: function(res) {
          var branches = (eval('(' + res.responseText + ')')).branches;
          onData(branches);
        }
        // ,onData: Prototype.K
      }, o || {});

      var onData = o.onData; 
      var url = GH.api + '/repos/show/' + u + '/' + r + '/branches';
      new AR( GH.proxy + url, o );      
    }
  }
};