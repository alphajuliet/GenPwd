// GenPwd.js

// Extend array to return a random element 
Array.prototype.randomElement = function () {
  return this[_.random(0, this.length - 1)]
}

//---------------------------------
// Namespace: GenPwd

var GenPwd = GenPwd || {};
GenPwd = (function () {

  // Application metadata
  var Info = {
    name: "GenPwd",
    author: "AndrewJ", 
    version: "2.16",
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
  };
  var nwords = 10;

  // Random number string
  var randomNumericString = function (n) {
    return _.padStart(_.random(0, Math.pow(10,n)-1), n, "0")
  }

  // List generators returning functions to call
  var RandomList = function (t) {
    return function () {
      return t.randomElement();
    }
  };

  var WeightedList = function (t) {
    var expandedList = [];
    $.each(t, function (key, value) {
      for (i=0; i<value; i++) 
        expandedList.push(key);
    });
    return function () {
      return expandedList.randomElement();
    }
  };

  var initialise = function () {
    var fn;
    Info.appendTo("header");
    $.each(Generator.generators, function (i, gen) {
      if (gen.default == true) 
        fn = gen.fn + '" selected="true';
      else
        fn = gen.fn
      $('#gen').append($('<option value="' + fn + '">' + gen.name + '</option>'))
    });
  };

  var generate = function () {
    var gen = eval('Generator.' + $('#gen').val());
    $("#output").empty();
    for (var i=0; i < nwords; i++) {
      elt = $("<div class='word'></div>").append(gen.randomWord());
      $("#output").append(elt);
    }
  };

  // Public
  return {
    nwords: nwords,
    randomNumericString: randomNumericString,
    RandomList: RandomList,
    WeightedList: WeightedList,
    initialise: initialise,
    generate: generate
  }

})();


//---------------------------------
// Namespace: Generator

var Generator = Generator || {};
Generator = (function () {

  var p =  GenPwd.RandomList(["!","#","$","^","*","&", "+","@","-","=","/","~","?","\\","%","[","]","{","}","(",")"]);
  var cap = function (s) { return ($("#capitals:checked").length > 0 ? _.capitalize(s) : s); };
  var punc = function () { return ($("#punctuation:checked").length > 0 ? p() : ""); };
  var num = function (n) { return ($("#numbers:checked").length > 0 ? GenPwd.randomNumericString(n) : ""); };

  //---------------------------------
  // Generator 1

  var generator1 = (function () {	
    var c1 = GenPwd.WeightedList(
      {"b":2,"bl":1,"br":1,"c":2,"cr":1,"ch":2,"cl":1,"d":2,"f":2,"fl":1,
        "fr":1,"g":2,"gl":1,"gr":1,"h":1,"j":2,"k":2,"l":2,"m":3,"n":2,"p":2,
        "pl":1,"pr":1,"qu":1,"r":2,"s":3,"sh":2,"sk":1,"sl":1,"sm":1,"sn":1,
        "st":2,"str":1,"t":3,"th":2,"thr":1,"tr":2,"tw":1,"v":2,"w":1,"z":2});
    var c2 = GenPwd.RandomList(
      ["b","bl","br","cr","ch","cl","d","f","fl","fr","g","gg", "gl","gr",
        "h","j","k","l","m","n","p","pl","pp","pr","pt","qu","r","s","sh","sk",
        "sl","sm","sn","st","str","t","th","thr","tr","tw","v","w","z"]);
    var c3 = GenPwd.WeightedList(
      {"b":1,"ch":1,"ck":1,"ct":1,"d":2,"dd":1,"f":1,"ff":1,"ft":1,"g":1,
        "k":1,"l":2,"ll":1,"lb":1,"ld":1,"lm":1,"ln":1,"lp":1,"lt":1,"m":3,
        "mp":1,"mt":1,"n":3,"nd":1,"ng":1,"nn":1,"nt":1,"p":2,"pp":1,"pt":1,
        "rd":1,"rg":1,"rk":1,"rn":1,"rr":1,"rs":1,"rt":1,"s":3,"sh":1,"ss":2,
        "st":2,"t":3,"tt":2,"th":2,"v":2,"wn":1});
    var v1 = GenPwd.WeightedList(
      {"a":5,"aa":1,"ai":1,"e":5,"ea":1,"ee":1,"i":5,"o":5,"oo":2,"u":2});
    var v2 = GenPwd.WeightedList(
      {"a":5, "e":5,"i":5, "ia":1, "o":5, "oa":1,"oo":2, "u":2, "ua":1});
    var v3 = GenPwd.WeightedList(
      {"a":5,"ao":1,"e":5,"ea":1,"ee":2,"eo":1,"i":2,"ia":2,"io":2,"o":5,
        "oa":2,"oo":2,"ow":2,"ua":1,"uo":1,"y":5});

    var randomWord = function () {
      var syll1 = function () { return c1() + v1() + c2(); };
      var w = "";
      var c = _.random(0, 8);
      switch (c) {
        case 0:  w = syll1() + punc() + cap(c2()) + v2() + c3(); break;
        case 1:  w = v1() + cap(c1()) + punc() + v2() + c3(); break;
        case 2:  w = c1() + v1() + punc() + cap(c3()) + v3(); break;
        case 3:  w = v1() + c1() + v1() + cap(c3()) + v3() + punc(); break;
        case 4:  w = c1() + v1() + cap(c1()) + v2() + c3() + punc(); break;
        case 5:  w = punc() + cap(c1()) + v2() + c3() + v3(); break;
        case 6:  w = c1() + v1() + cap(c2()) + punc() + v2() + c3(); break;
        case 7:  w = c1() + v1() + cap(c1()) + v1() + c1() + v1() + punc(); break
        default: w = c1() + v1() + punc() + cap(c3()) + v3(); break;
      }
      w = (_.random(0, 2) < 1) ? w + num() : num() + w;
      // return c + ": " + w;
      return w;
    };

    // Public data
    return {randomWord: randomWord }
  })();

  //---------------------------------
  // Pseudo-Japanese style

  var generator2 = (function () {
    var c1 = GenPwd.WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":4,"h":3,"b":3,
        "p":3,"n":3,"r":5,"m":5,"y":2,"gy":1,"j":2,"sh":2,
        "ch":2,"ky":1,"hy":1,"ry":2,"my":1,"ny":1,"by":1,"py":1});
    var v1 = GenPwd.WeightedList(
      {"a":2,"i":1,"u":2,"e":1,"o":2, "ou":1});

    var randomWord = function () {
      var w;

      var syll = function () {
        var x = c1() + v1();
        if (_.random(0,4) == 0) x = x + "n";
        return x
      };

      var c = _.random(0, 4);
      switch (c) {
        case 0: w = syll() + punc() + cap(syll()); break;
        case 1: w = syll() + punc() + syll() + cap(syll()); break;
        case 2: w = v1() + cap(syll()) + punc() + syll() ; break;
        case 3: w = syll() + v1() + cap(syll()) + punc(); break;
        default: w = syll() + cap(syll()) + punc();
      }
      w = (_.random(0, 2) < 1) ? w + num(2) : num(2) + w; // add a number at start or end
      w = w.replace(/[Tt]i/, "chi");
      w = w.replace(/[Ss]i/, "shi");
      w = w.replace(/[Hh]u/, "fu");
      w = w.replace(/[Cc]fu/, "chu"); // fix from the previous rule when it matches "chu"
      w = w.replace(/[Ss]fu/, "shu"); // fix from the previous rule when it matches "shu"
      w = w.replace(/[Tt]u/, "tsu");
      w = w.replace(/[Ss]he/, "sho");
      w = w.replace(/(\wy)[ie]/, "$1o");
      return w;
    };

    // Public data
    return {randomWord: randomWord};
  })();

  //---------------------------------
  // Another attempt at Englishy words

  var generator3 = (function () {

    // Consonants
    var c = GenPwd.WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":2,"b":4,
        "p":3,"n":4,"r":5,"m":4,"j":1,"sh":2,"l":2,"ch":2});
    var ce = GenPwd.WeightedList(
      {"ck":1,"g":3,"t":3,"d":3,"ss":2,"bb":1,
        "pp":1,"rp":1,"n":4,"th":1,"m":2,"sh":2,"ll":2,"ch":2,
        "st":1,"nt":1,"ft":1,"mt":1,"rm":1,"rn":1,"rs":1,"rt":1,
        "ng":1,"nch":1,"nd":1,"rd":1,"sk":1,"nce":1,"rce":1});
    var cs = GenPwd.WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":2,"b":4,
        "p":3,"n":4,"r":5,"m":4,"j":2,"sh":2,"l":2,"ch":2,
        "bl":1,"br":1,"dr":1,"fl":1,"fr":1,"gl":1,"gr":1,
        "cl":1,"cr":1,"sl":1,"st":1,"str":1,"w":1});

    // Vowels
    var vm = GenPwd.WeightedList(
      {"a":3,"ai":1,"e":3,"ee":2,"io":1,"oo":2,"i":3,"o":3,"u":2});
    var ve = GenPwd.WeightedList(
      {"a":2,"ee":1,"i":2,"io":1,"o":2,"oo":1,"y":2});
    var vs = GenPwd.WeightedList(
      {"a":1,"e":1,"i":1,"o":1});


    var randomWord = function () {
      var w;
      switch (_.random(0, 5)) {
        case 0: w = c() + vm() + cap(c()) + vm() + ce(); break;
        case 1: w = cap(c()) + vm() + c() + ve(); break;
        case 2: w = cs() + vm() + cap(ce()); break;
        case 3: w = cap(cs()) + vm() + c(); break;
        case 4: w = vs() + c() + cap(c()) + ve(); break;
        case 5: w = vs() + c() + cap(c()) + vm() + ce(); break;
      }
      w = w + punc() + num(3);
      return w;
    }

    // Public data
    return {randomWord: randomWord};
  })();

  // Public
  return {
    generators: [
      {"name": "Gen 1", "fn": "generator1"}, 
      {"name": "Gen 2", "fn": "generator2", "default": true},
      {"name": "Gen 3", "fn": "generator3"}
    ],
    generator1: generator1,
    generator2: generator2,
    generator3: generator3,
  }

})();	

// The End
