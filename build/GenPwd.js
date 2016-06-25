// GenPwd.js

// Application metadata
var Info = {
  name: "GenPwd",
  author: "AndrewJ", 
  version: "2.15",
  date: "2016-06-25",
  info: "GenPwd is a very simple password generator.",
  appendTo: function(tagName) {
    var str = "<div>";
    str += "<span class='title'>" + this.name + "</span>";
    str += "&nbsp;<span class='description'>v" + this.version + "</span>";
    str += "</div>";
    $(tagName).append(str);
  },
  aboutText: function() {
    str = this.name + " v" + this.version;
    str += ", last modified: " + this.date;
    str += " by: " + this.author + ".\n\n";
    str += this.info;
    return str;
  }
}

// Return a random element from an array
Array.prototype.randomElement = function () {
  return _.nth(this, _.random(0, this.length-1));
}

// Utility function		
var doTimes = function (n, fn) {
  for (var i=0; i<n; i++) fn();
  return n;
}

// Random number string
var randomNumericString = function () {
  return _.padStart(_.random(0, 99), 2, "0")
}

//---------------------------------
// Namespace: GenPwd
var GenPwd = {

  nwords: 10,

  // List generators returning functions to call
  RandomList: function (t) {
    return function () {
      return t.randomElement();
    }
  },

  WeightedList: function (t) {
    var expandedList = [];
    _.forEach(t, function (value, key) {
      doTimes(value, function () {
        expandedList.push(key);
      });
    });
    return function () {
      return expandedList.randomElement();
    }
  },

  initialise: function () {
    Info.appendTo("header");
  }		
}


//---------------------------------
// Namespace: Generator
var Generator = {

  // Generators
  generator1: {	
    c1: GenPwd.WeightedList({"b":2,"bl":1,"br":1,"c":2,"cr":1,"ch":2,"cl":1,"d":2,"f":2,"fl":1,"fr":1,"g":2,"gl":1,"gr":1,"h":1,"j":2,"k":2,"l":2,"m":3,"n":2,"p":2,"pl":1,"pr":1,"qu":1,"r":2,"s":3,"sh":2,"sk":1,"sl":1,"sm":1,"sn":1,"st":2,"str":1,"t":3,"th":2,"thr":1,"tr":2,"tw":1,"v":2,"w":1,"z":2}),
    c2: GenPwd.RandomList(["b","bl","br","cr","ch","cl","d","f","fl","fr","g","gg", "gl","gr","h","j","k","l","m","n","p","pl","pp","pr","pt","qu","r","s","sh","sk","sl","sm","sn","st","str","t","th","thr","tr","tw","v","w","z"]),
    c3: GenPwd.WeightedList({"b":1,"ch":1,"ck":1,"ct":1,"d":2,"dd":1,"f":1,"ff":1,"ft":1,"g":1,"k":1,"l":2,"ll":1,"lb":1,"ld":1,"lm":1,"ln":1,"lp":1,"lt":1,"m":3,"mp":1,"mt":1,"n":3,"nd":1,"ng":1,"nn":1,"nt":1,"p":2,"pp":1,"pt":1,"rd":1,"rg":1,"rk":1,"rn":1,"rr":1,"rs":1,"rt":1,"s":3,"sh":1,"ss":2,"st":2,"t":3,"tt":2,"th":2,"v":2,"wn":1}),
    v1: GenPwd.WeightedList({"a":5,"aa":1,"ai":1,"e":5,"ea":1,"ee":1,"i":5,"o":5,"oo":2,"u":2}),
    v2: GenPwd.WeightedList({"a":5, "e":5,"i":5, "ia":1, "o":5, "oa":1,"oo":2, "u":2, "ua":1}),
    v3: GenPwd.WeightedList({"a":5,"ao":1,"e":5,"ea":1,"ee":2,"eo":1,"i":2,"ia":2,"io":2,"o":5,"oa":2,"oo":2,"ow":2,"ua":1,"uo":1,"y":5}),
    p:  GenPwd.RandomList(["!","#","$","^","*","&", "+","@","-","=","/","~","?","\\","%","[","]","{","}","(",")"]),
    cap: function (s) { return ($("#capitals:checked").length > 0 ? _.capitalize(s) : s); },
    punc: function () { return ($("#punctuation:checked").length > 0 ? this.p() : ""); },
    num: function () { return ($("#numbers:checked").length > 0 ? _.padStart(_.random(0, 99), 2, "0") : ""); },
    randomWord: function () {
      var R = this;
      var w = "";
      c = _.random(0, 8);
      switch (c) {
        case 0:  w = R.c1() + R.v1() + R.punc() + R.cap(R.c2()) + R.v2() + R.c3(); break;
        case 1:  w = R.v1() + R.cap(R.c1()) + R.punc() + R.v2() + R.c3(); break;
        case 2:  w = R.c1() + R.v1() + R.punc() + R.cap(R.c3()) + R.v3(); break;
        case 3:  w = R.v1() + R.c1() + R.v1() + R.cap(R.c3()) + R.v3() + R.punc(); break;
        case 4:  w = R.c1() + R.v1() + R.cap(R.c1()) + R.v2() + R.c3() + R.punc(); break;
        case 5:  w = R.punc() + R.cap(R.c1()) + R.v2() + R.c3() + R.v3(); break;
        case 6:  w = R.c1() + R.v1() + R.cap(R.c2()) + R.punc() + R.v2() + R.c3(); break;
        case 7:  w = R.c1() + R.v1() + R.cap(R.c1()) + R.v1() + R.c1() + R.v1() + R.punc(); break
        default: w = R.c1() + R.v1() + R.punc() + R.cap(R.c3()) + R.v3(); break;
      }
      w = (_.random(0, 2) < 1) ? w + R.num() : R.num() + w;
      // return c + ": " + w;
      return w;
    },
  },

  // Pseudo-Japanese style
  generator2: {
    c1: GenPwd.WeightedList({"k":5,"g":5,"t":5,"d":5,"s":5,"z":4,"h":2,"b":3,"p":2,"n":3,"r":5,"m":5,"y":2,
                     "gy":1,"j":1,"sh":1,"ch":1,"ky":1,"hy":1,"ry":1,"my":1,"ny":1,"by":1,"py":1}),
    v1: GenPwd.WeightedList({"a":2,"i":1,"u":2,"e":1,"o":2, "ou":1}),
    p:  GenPwd.RandomList(["!","#","$","^","*","&", "+","@","-","=","/","~","?","\\","%","[","]","{","}","(",")"]),
    cap: function (s) { return ($("#capitals:checked").length > 0 ? _.capitalize(s) : s); },
    punc: function () { return ($("#punctuation:checked").length > 0 ? this.p() : ""); },
    num: function () { return ($("#numbers:checked").length > 0 ? _.padStart(_.random(0, 99), 2, "0") : ""); },

    randomWord: function () {
      var R = this;
      var w;
      c = _.random(0, 5);
      switch (c) {
        case 0: w = R.c1() + R.v1() + R.punc() + R.cap(R.c1()) + R.v1() + R.c1() + R.v1(); break;
        case 1: w = R.c1() + R.v1() + "n" + R.punc() + R.cap(R.c1()) + R.v1() + R.c1() + R.v1(); break;
        case 2: w = R.c1() + R.v1() + R.punc() + R.c1() + R.v1() + R.cap(R.c1()) + R.v1() + "n"; break;
        case 3: w = R.c1() + R.v1() + R.punc() + R.cap(R.c1()) + R.v1(); break;
        default: w = R.c1() + R.v1() + R.cap(R.c1()) + R.v1() + "n";
      }
      w = (_.random(0, 2) < 1) ? w + R.num() : R.num() + w;
      w = w.replace(/[Tt]i/, "chi");
      w = w.replace(/[Ss]i/, "shi");
      w = w.replace(/[Hh]u/, "fu");
      w = w.replace(/[Cc]fu/, "chu"); // fix from the previous rule when it matches "chu"
      w = w.replace(/[Ss]fu/, "shu"); // fix from the previous rule when it matches "shu"
      w = w.replace(/[Tt]u/, "tsu");
      w = w.replace(/[Ss]he/, "sho");
      w = w.replace(/(\wy)[ie]/, "$1o");
      return w;
    },
  },

  // Public methods

  generate: function () {
    var gen = eval("Generator." + $("#gen").val());
    $("#output").empty();
    for (var i=0; i < GenPwd.nwords; i++) {
      elt = $("<div class='word'></div>").append(gen.randomWord());
      $("#output").append(elt);
    }
  },

}			

// The End
