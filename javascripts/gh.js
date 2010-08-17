window.AR = Ajax.JSONRequest;

window.GH = {
  hash: {}
  ,proxy: 'http://hoavui.com/github_jsonp.php?url='
  ,api: 'http://github.com/api/v2/json'
  
  ,Commits: {
    listBranch: function(user_id, repository, branch, options ) {
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
      options = Object.extend({ 
        onSuccess: function(response) {
          var commits = eval('(' + response.responseText +')').commits;
          onData( commits ); // get rid of root namespace
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 
      // debugger

      var url = GH.api + '/commits/list/' + user_id + '/' + repository + '/' + branch + path;

      new AR( GH.proxy + url, options );
    }
    
    ,show: function( user_id, repository, sha, options ) {
      options = Object.extend({ 
        onSuccess: function(response) {
          var commit = eval('(' + response.responseText +')').commit;
          onData( commit );
        }
        ,onData: Prototype.K
      }, options || {});

      var onData = options.onData; 

      var url = GH.api + '/commits/show/' + user_id + '/' + repository + '/' + sha;

      new AR( GH.proxy + url, options );
    }
  }
  
  ,Tree: {
    show: function( user_id, repository, branch, tree_sha, options  ) {
      options = Object.extend({ 
        onSuccess: function(response) {
          // console.log("response %o",response);
          var tree = (eval('(' + response.responseText + ')')).tree;
          
          tree = tree.sort(function(a,b){
            // blobs always lose to tree
            if( a.type == 'blob' && b.type == 'tree' ) 
              return 1; 
            if( a.type == 'tree' && b.type == 'blob' )
              return -1;
            return a.name > b.name ? 1 : ( a.name < b.name ? - 1 : 0 );
          });          
          
          onData(tree);
        }
      }, options || {});

      var onData = options.onData;
      
      var url = GH.api + '/tree/show/' + user_id +'/' + repository +'/' + tree_sha;

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
    
    /* 
      Show a blob at a specific 
    */
    ,showByCommit: function( user_id, repository, commit_sha, path, options ) {
      options = Object.extend({ 
        onSuccess: Prototype.K
      }, options || {});

      var onData = options.onData; 

      var url = GH.api + '/blob/' + user_id + '/' + repository + '/' + commit_sha + path;

      new AR( GH.proxy + url, options );
    }
  }
};
