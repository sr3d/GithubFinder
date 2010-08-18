/* JS to execute specifically in the bootstrap 
  This script is to be embedded in the image to further save space
*/
// var run = function() {
  /* embed the css */
  x('s.png', function(s) { 
    var c = d.createElement('style');
    c.innerHTML = s;
    d.body.appendChild(c);
  });
  
  
  GH.setProxy('http://alexle.net/experiments/githubfinder/proxy.php?url=');
  f = new F();
// }