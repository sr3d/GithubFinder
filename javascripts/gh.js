var GH = {
  hash: {}
  ,proxy: './proxy.php?url='
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
  }
  
  ,Tree: {
    show: function( user_id, repository, branch, tree_sha, options  ) {
      options = Object.extend({ 
        onSuccess: function(response) {
          console.log("response %o",response);
          var tree = (eval('(' + response.responseText + ')')).tree;
          
          /* add all items to cache */
          for( var i = 0, len = tree.length; i < len; i++ ) {
            GH.hash[ tree[i].sha ] = tree[i];
          }
          
          onData(tree);
        }
      }, options || {});

      var onData = options.onData;
      
      var url = GH.api + '/tree/show/' + user_id +'/' + repository +'/' + tree_sha;

      new AR( GH.proxy + url, options);
    }
  }
};
