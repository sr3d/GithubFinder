var f,proxy,d=document,s;

/* xtract textual content from an image*/
var x = function(z, m ) {  // image, callback
  var o = new Image();
  o.onload = function() {
    var s = "", 
        c = d.createElement("canvas"),
        t = c.getContext("2d"),
        w = o.width,
        h = o.height;
    c.width  = c.style.width  = w;
    c.height = c.style.height = h; 
    t.drawImage(o, 0, 0);
    
    var b = t.getImageData( 0, 0, w, h ).data; //b : bucket of data
    for(var i= 0; i < b.length; i += 4) {
      if( b[i] > 0 )
        s += String.fromCharCode(b[i]);
    }
    m(s);
  }
  o.src = z;
}

/*
x('c.png', function(s){
  // both CSS and JS are bundled up into 1 file
  s = s.split('~10K~');
  

  // init CSS
  var c = d.createElement('style');
  c.innerHTML = s[1]; //.replace('$', 'background-color:');
  d.body.appendChild(c);    

  // console.log(s[1]);
  // run the JS
  eval(s[0]);    
});

*/
var fc = 2; file = 0, js='';
var run = function(s) {
  js += s;

  
  if( ++file != fc ) 
    return;

  // console.log("js::::" + js );
  
  // debugger
  
  js = js.split('~10K~');
  var c = d.createElement('style');
  c.innerHTML = js[1]; //.replace('$', 'background-color:');
  d.body.appendChild(c);    

  // console.log(s[1]);
  // run the JS
  try{ eval(js[0]); } catch(ex) { alert(ex); }
}

document.observe('dom:loaded',function() { 
  for(var i = 0; i < fc; i++ ) {
    x('c' + i + '.png', run);
  }  
})
