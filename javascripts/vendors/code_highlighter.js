/* Unobtrustive Code Highlighter By Dan Webb 11/2005
   Version: 0.4

	Usage:
		Add a script tag for this script and any stylesets you need to use
		to the page in question, add correct class names to CODE elements,
		define CSS styles for elements. That's it!

	Known to work on:
		IE 5.5+ PC
		Firefox/Mozilla PC/Mac
		Opera 7.23 + PC
		Safari 2

	Known to degrade gracefully on:
		IE5.0 PC

	Note: IE5.0 fails due to the use of lookahead in some stylesets.  To avoid script errors
	in older browsers use expressions that use lookahead in string format when defining stylesets.

	This script is inspired by star-light by entirely cunning Dean Edwards
	http://dean.edwards.name/star-light/.
*/

// replace callback support for safari.
if ("a".replace(/a/, function() {return "b"}) != "b") (function(){
  var default_replace = String.prototype.replace;
  String.prototype.replace = function(search,replace){
	// replace is not function
	if(typeof replace != "function"){
		return default_replace.apply(this,arguments)
	}
	var str = "" + this;
	var callback = replace;
	// search string is not RegExp
	if(!(search instanceof RegExp)){
		var idx = str.indexOf(search);
		return (
			idx == -1 ? str :
			default_replace.apply(str,[search,callback(search, idx, str)])
		)
	}
	var reg = search;
	var result = [];
	var lastidx = reg.lastIndex;
	var re;
	while((re = reg.exec(str)) != null){
		var idx  = re.index;
		var args = re.concat(idx, str);
		result.push(
			str.slice(lastidx,idx),
			callback.apply(null,args).toString()
		);
		if(!reg.global){
			lastidx += RegExp.lastMatch.length;
			break
		}else{
			lastidx = reg.lastIndex;
		}
	}
	result.push(str.slice(lastidx));
	return result.join("")
  }
})();

var CodeHighlighter = { styleSets : new Array };

CodeHighlighter.addStyle = function(name, rules) {
	// using push test to disallow older browsers from adding styleSets
	if ([].push) this.styleSets.push({
		name : name,
		rules : rules,
		ignoreCase : arguments[2] || false
	})

  // function setEvent() {
  //  // set highlighter to run on load (use LowPro if present)
  //  if (typeof Event != 'undefined' && typeof Event.onReady == 'function')
  //    return Event.onReady(CodeHighlighter.init.bind(CodeHighlighter));
  // 
  //  var old = window.onload;
  // 
  //  if (typeof window.onload != 'function') {
  //    window.onload = function() { CodeHighlighter.init() };
  //  } else {
  //    window.onload = function() {
  //      old();
  //      CodeHighlighter.init();
  //    }
  //  }
  // }
  // 
  // // only set the event when the first style is added
  // if (this.styleSets.length==1) setEvent();
}

CodeHighlighter.init = function() {
	if (!document.getElementsByTagName) return;
	if ("a".replace(/a/, function() {return "b"}) != "b") return; // throw out Safari versions that don't support replace function
	// throw out older browsers

  // var codeEls = document.getElementsByTagName("CODE");
  
  // HACK:  
  var codeEls = [$('code')];
  
	// collect array of all pre elements
	codeEls.filter = function(f) {
		var a =  new Array;
		for (var i = 0; i < this.length; i++) 
		  if (f(this[i])) 
		    a[a.length] = this[i];
		return a;
	}

	var rules = new Array;
	rules.toString = function() {
		// joins regexes into one big parallel regex
		var exps = new Array;
		for (var i = 0; i < this.length; i++) exps.push(this[i].exp);
		return exps.join("|");
	}

	function addRule(className, rule) {
		// add a replace rule
		var exp = (typeof rule.exp != "string")?String(rule.exp).substr(1, String(rule.exp).length-2):rule.exp;
		// converts regex rules to strings and chops of the slashes
		rules.push({
			className : className,
			exp : "(" + exp + ")",
			length : (exp.match(/(^|[^\\])\([^?]/g) || "").length + 1, // number of subexps in rule
			replacement : rule.replacement || null
		});
	}

	function parse(text, ignoreCase) {
		// main text parsing and replacement
		return text.replace(new RegExp(rules, (ignoreCase)?"gi":"g"), function() {
			var i = 0, j = 1, rule;
			while (rule = rules[i++]) {
				if (arguments[j]) {
					// if no custom replacement defined do the simple replacement
					if (!rule.replacement) return "<span class=\"" + rule.className + "\">" + arguments[0] + "</span>";
					else {
						// replace $0 with the className then do normal replaces
						var str = rule.replacement.replace("$0", rule.className);
						for (var k = 1; k <= rule.length - 1; k++) str = str.replace("$" + k, arguments[j + k]);
						return str;
					}
				} else j+= rule.length;
			}
		});
	}

	function highlightCode(styleSet) {
		// clear rules array
		var parsed, clsRx = new RegExp("(\\s|^)" + styleSet.name + "(\\s|$)");
		rules.length = 0;
    
    // // get stylable elements by filtering out all code elements without the correct className
    var stylableEls = codeEls.filter(function(item) { return clsRx.test(item.className) });
    // var stylableEls = codeEls;
    
		// add style rules to parser
		for (var className in styleSet.rules) addRule(className, styleSet.rules[className]);


		// replace for all elements
		for (var i = 0; i < stylableEls.length; i++) {
			// EVIL hack to fix IE whitespace badness if it's inside a <pre>
			if (/MSIE/.test(navigator.appVersion) && stylableEls[i].parentNode.nodeName == 'PRE') {
				stylableEls[i] = stylableEls[i].parentNode;

				parsed = stylableEls[i].innerHTML.replace(/(<code[^>]*>)([^<]*)<\/code>/i, function() {
					return arguments[1] + parse(arguments[2], styleSet.ignoreCase) + "</code>"
				});
				parsed = parsed.replace(/\n( *)/g, function() {
					var spaces = "";
					for (var i = 0; i < arguments[1].length; i++) spaces+= "&nbsp;";
					return "\n" + spaces;
				});
				parsed = parsed.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
				parsed = parsed.replace(/\n(<\/\w+>)?/g, "<br />$1").replace(/<br \/>[\n\r\s]*<br \/>/g, "<p><br></p>");

			} else parsed = parse(stylableEls[i].innerHTML, styleSet.ignoreCase);

			stylableEls[i].innerHTML = parsed;
		}
	}

	// run highlighter on all stylesets
	for (var i=0; i < this.styleSets.length; i++) {
		highlightCode(this.styleSets[i]);
	}
}




CodeHighlighter.addStyle("css", {
	comment : {
		exp  : /\/\*[^*]*\*+([^\/][^*]*\*+)*\//
	},
	keywords : {
		exp  : /@\w[\w\s]*/
	},
	selectors : {
		exp  : "([\\w-:\\[.#][^{};>]*)(?={)"
	},
	properties : {
		exp  : "([\\w-]+)(?=\\s*:)"
	},
	units : {
		exp  : /([0-9])(em|en|px|%|pt)\b/,
		replacement : "$1<span class=\"$0\">$2</span>"
	},
	urls : {
		exp  : /url\([^\)]*\)/
	}
 });

CodeHighlighter.addStyle("ruby",{
	comment : {
		exp  : /#[^\n]*/
	},
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"|\%w\(.*\)|`[^`\\]*(\\.[^`\\]*)*`/
	},
	keywords : {
		exp  : /\b(do|end|self|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|raise|extend)\b/
	},
	/* Added by Shelly Fisher (shelly@agileevolved.com) */
	symbol : {
	  exp : /([^:])(:[A-Za-z0-9_!?]+)/
	}
});

CodeHighlighter.addStyle("html", {
	comment : {
		exp: /<!\s*(--([^-]|[\r\n]|-[^-])*--\s*)>/
	},
	tag : {
		exp: /(<\/?)([a-zA-Z1-9]+\s?)/,
		replacement: "$1<span class=\"$0\">$2"
	},
	string : {
		exp  : /'[^']*'|"[^"]*"/
	},
	attribute : {
		exp: /\b([a-zA-Z-:]+)(=)/,
		replacement: "<span class=\"$0\">$1$2"
	},
	doctype : {
		exp: /<!DOCTYPE([^&]|&[^g]|&g[^t])*>/
	}
});

CodeHighlighter.addStyle("javascript",{
	comment : {
		exp  : /(\/\/[^\n]*(\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
	},
	parameter: {
		exp: /\bfunction\s?\((.+)\)/
    // ,replacement: "<span class='parameter'>$1</span>"
	},
		
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /'[^']*'|"[^"]*"/
	},
	keywords : {
		exp  : /\b(arguments|break|case|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|typeof|var|void|while|with)\b/
	},
	global : {
		exp  : /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity|String|Numeric|Array)\b/
	},
	

});

CodeHighlighter.addStyle("yaml", {
	keyword : {
		exp  : /\/\*[^*]*\*+([^\/][^*]*\*+)*\//
	},
	value : {
		exp  : /@\w[\w\s]*/
	},
});



CodeHighlighter.addStyle("python",{
	comment : {
		exp  : /#[^\n]+/
	},
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"|""".*"""/
	},
	keywords : {
		exp  : /\b(and|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|yield|as|None)\b/
	}
});


CodeHighlighter.addStyle("applescript",{
	comment : {
		exp  : /--[^\n]+|#![^\n]+/
	},
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /"[^"\\]*(\\.[^"\\]*)*"/
	},
	keywords : {
		exp  : /\b(about|above|after|against|and|apart[\s]+from|around|as|aside[\s]+from|at|back|before|beginning|behind|below|beneath|beside|between|but|by|considering|contain|contains|contains|continue|copy|div|does|eighth|else|end|equal|equals|error|every|exit|false|fifth|first|for|fourth|from|front|get|given|global|if|ignoring|in|instead[\s]+of|into|is|it|its|last|local|me|middle|mod|my|ninth|not|of|on|onto|or|out[\s]+of|over|prop|property|put|ref|reference|repeat|return|returning|script|second|set|seventh|since|sixth|some|tell|tenth|that|the|then|third|through|thru|timeout|times|to|transaction|true|try|until|where|while|whose|with|without)\b/
	},
	global : {
		exp : /\b(AppleScript('s)?|current[\s]+application|missing[\s]+value|false|pi|true|version)\b/
	}
});