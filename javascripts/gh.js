/* switch to the correct AR */
if( window.proxy )
  window.AR = window.proxy.indexOf('./') == 0 ? Ajax.Request : Ajax.JSONRequest;

window.GH = {
  hash: {}
  // ,proxy: 'http://alexle.net/experiments/githubfinder/proxy.php?url='
  ,proxy: window.proxy ? window.proxy : './proxy.php?url='
  
  ,api: 'http://github.com/api/v2/json'
  
  ,Commits: {
    _cache: []

    ,listBranch: function(user_id, repository, branch, options ) {
      options = Object.extend({ 
        onSuccess: function(response) {
          var commits = eval('(' + response.responseText +')');
          onData( commits );
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 

      var url = GH.api + '/commits/list/' + user_id + '/' + repository + '/' + branch;

      new AR( GH.proxy + url, options );
    }
    
    ,list: function( user_id, repository, branch, path, options ) {
      var self = this,
          url = GH.api + '/commits/list/' + user_id + '/' + repository + '/' + branch + path;
          
      options = Object.extend({ 
        onSuccess: function(response) {
          var commits = eval('(' + response.responseText +')').commits;
          
          /* cache the commits */
          self._cache[ url ] = commits;
                    
          onData( commits ); // get rid of root namespace
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 

      /* hit the cache first */
      if( this._cache[ url ] ) {
        onData( this._cache[ url ] );
        return;
      }

      new AR( GH.proxy + url, options );
    }
    
    ,show: function( user_id, repository, sha, options ) {
      var self = this,
          url = GH.api + '/commits/show/' + user_id + '/' + repository + '/' + sha;

      options = Object.extend({ 
        onSuccess: function(response) {
          // debugger
          var commit = eval('(' + response.responseText +')').commit;

          /* cache */
          self._cache[ sha ] = commit;

          onData( commit );
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 

      /* hit the cache first */
      if( this._cache[ sha ] ) {
        onData( this._cache[ sha ] );
        return;
      }

      new AR( GH.proxy + url, options );
    }
  }
  
  ,Tree: {
    _cache: {}
    ,show: function( user_id, repository, branch, tree_sha, options  ) {
      var self = this,
          url = GH.api + '/tree/show/' + user_id +'/' + repository +'/' + tree_sha;
          
      options = Object.extend({ 
        onSuccess: function(response) {
          var tree = (eval('(' + response.responseText + ')')).tree;
          
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
      }, options || {});

      var onData = options.onData;
      
      /* hit the cache first */
      if( this._cache[ tree_sha ] ) {
        onData( this._cache[ tree_sha ] );
        return;
      }

      new AR( GH.proxy + url, options);
    }
  }
  
  ,Blob: {
    show: function( user_id, repository, sha, options ) {
      options = Object.extend({ 
        onSuccess: Prototype.K
      }, options || {});

      var onData = options.onData; 

      var url = GH.api + '/blob/show/' + user_id + '/' + repository + '/' + sha;

      new AR( GH.proxy + url, options );
    }
  }
  
  ,Repo: {
    show: function( user_id, repository, options ) {
      options = Object.extend({ 
        onSuccess: function(response) {
          var repo = (eval('(' + response.responseText + ')')).repository;
          onData(repo);
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 
      var url = GH.api + '/repos/show/' + user_id + '/' + repository;
      new AR( GH.proxy + url, options );
    }
    
    ,listBranches: function( user_id, repository, options ) {
      options = Object.extend({ 
        onSuccess: function(response) {
          var branches = (eval('(' + response.responseText + ')')).branches;
          onData(branches);
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 
      var url = GH.api + '/repos/show/' + user_id + '/' + repository + '/branches';
      new AR( GH.proxy + url, options );      
    }
  }
};

window.AR = GH.proxy.indexOf('./') == 0 ? Ajax.Request :
              Ajax.JSONRequest;