// GenPwd.js

// Extend array to return a random element
Array.prototype.randomElement = function () {
  return this[_.random(0, this.length - 1)];
};

//---------------------------------
// Namespace: GenPwd

var GenPwd = GenPwd || {};
GenPwd = (function () {

  // Application metadata
  var Info = {
    name: "GenPwd",
    author: "AndrewJ",
    version: "2.21",
    date: "2016-09-03",
    info: "GenPwd is a very simple password generator.",
    appendTo: function(tagName) {
      var str = "<div>";
      str += "<span class='title'>" + this.name + "</span>";
      str += "&nbsp;<span class='description'>v" + this.version + "</span>";
      str += "</div>";
      $(tagName).append(str);
    },
    aboutText: function() {
      var str = this.name + " v" + this.version;
      str += ", last modified: " + this.date;
      str += " by: " + this.author + ".\n\n";
      str += this.info;
      return str;
    }
  };

  var initialise = function () {
    var fn;
    Info.appendTo("header");
    $.each(Generator.generators, function (i, gen) {
      if (gen.default === true)
        fn = gen.fn + '" selected="true';
      else
        fn = gen.fn;
      $('#gen').append($('<option value="' + fn + '">' + gen.name + '</option>'));
    });
  };

  var generate = function (output) {
    var nwords = 10;
    var gen_opt = $('#gen').val();
    var gen = Generator[gen_opt];

    $(output).empty();
    _.range(0, nwords).forEach(function (i) {
      $(output).append(
        $("<div class='word'></div>").append(gen.randomWord())
      );
    });
  };

  // Public
  return {
    initialise: initialise,
    generate: generate
  };

})();


//---------------------------------
// Namespace: Generator

var Generator = Generator || {};
Generator = (function () {

  // Random number string
  var randomNumericString = function (n) {
    return _.padStart(_.random(0, Math.pow(10,n)-1), n, "0");
  };

  // List generators returning functions to call
  var RandomList = function (t) {
    return function () {
      return t.randomElement();
    };
  };

  var WeightedList = function (t) {
    var expandedList = [];
    $.each(t, function (key, value) {
      for (i=0; i<value; i++)
        expandedList.push(key);
    });
    return function () {
      return expandedList.randomElement();
    };
  };

  var p =  RandomList(["!","#","$","^","*","&", "+","@","-","=","/","~","?","\\","%","[","]","{","}","(",")"]);
  var cap = function (s) { return ($("#capitals:checked").length > 0 ? _.capitalize(s) : s); };
  var punc = function () { return ($("#punctuation:checked").length > 0 ? p() : ""); };
  var num = function (n) { return ($("#numbers:checked").length > 0 ? randomNumericString(n) : ""); };

  //---------------------------------
  // Generator 1

  var generator1 = (function () {
    var c1 = WeightedList(
      {"b":2,"bl":1,"br":1,"c":2,"cr":1,"ch":2,"cl":1,"d":2,"f":2,"fl":1,
        "fr":1,"g":2,"gl":1,"gr":1,"h":1,"j":2,"k":2,"l":2,"m":3,"n":2,"p":2,
        "pl":1,"pr":1,"qu":1,"r":2,"s":3,"sh":2,"sk":1,"sl":1,"sm":1,"sn":1,
        "st":2,"str":1,"t":3,"th":2,"thr":1,"tr":2,"tw":1,"v":2,"w":1,"z":2});
    var c2 = RandomList(
      ["b","bl","br","cr","ch","cl","d","f","fl","fr","g","gg", "gl","gr",
        "h","j","k","l","m","n","p","pl","pp","pr","pt","qu","r","s","sh","sk",
        "sl","sm","sn","st","str","t","th","thr","tr","tw","v","w","z"]);
    var c3 = WeightedList(
      {"b":1,"ch":1,"ck":1,"ct":1,"d":2,"dd":1,"f":1,"ff":1,"ft":1,"g":1,
        "k":1,"l":2,"ll":1,"lb":1,"ld":1,"lm":1,"ln":1,"lp":1,"lt":1,"m":3,
        "mp":1,"mt":1,"n":3,"nd":1,"ng":1,"nn":1,"nt":1,"p":2,"pp":1,"pt":1,
        "rd":1,"rg":1,"rk":1,"rn":1,"rr":1,"rs":1,"rt":1,"s":3,"sh":1,"ss":2,
        "st":2,"t":3,"tt":2,"th":2,"v":2,"wn":1});
    var v1 = WeightedList(
      {"a":5,"aa":1,"ai":1,"e":5,"ea":1,"ee":1,"i":5,"o":5,"oo":2,"u":2});
    var v2 = WeightedList(
      {"a":5, "e":5,"i":5, "ia":1, "o":5, "oa":1,"oo":2, "u":2, "ua":1});
    var v3 = WeightedList(
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
        case 7:  w = c1() + v1() + cap(c1()) + v1() + c1() + v1() + punc(); break;
        default: w = c1() + v1() + punc() + cap(c3()) + v3(); break;
      }
      w = (_.random(0, 2) < 1) ? w + num(2) : num(2) + w;
      // return c + ": " + w;
      return w;
    };

    // Public data
    return {randomWord: randomWord };
  })();

  //---------------------------------
  // Pseudo-Japanese style

  var generator2 = (function () {
    var c1 = WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":4,"h":3,"b":3,
        "p":3,"n":3,"r":5,"m":5,"y":2,"gy":1,"j":2,"sh":2,
        "ch":2,"ky":1,"hy":1,"ry":2,"my":1,"ny":1,"by":1,"py":1});
    var v1 = WeightedList(
      {"a":2,"i":1,"u":2,"e":1,"o":2, "ou":1});

    var randomWord = function () {
      var w;

      var syll = function () {
        var x = c1() + v1();
        if (_.random(0,4) === 0) x = x + "n";
        return x;
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
    var c = WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":2,"b":4,
        "p":3,"n":4,"r":5,"m":4,"j":1,"sh":2,"l":2,"ch":2});
    var ce = WeightedList(
      {"ck":1,"g":3,"t":3,"d":3,"ss":2,"bb":1,
        "pp":1,"rp":1,"n":4,"th":1,"m":2,"sh":2,"ll":2,"ch":2,
        "st":2,"nt":2,"ft":1,"mt":1,"rk":2,"rm":1,"rn":1,"rs":1,"rt":2,
        "ng":2,"nch":1,"nd":1,"rd":1,"sk":1,"nce":1,"rce":1});
    var cs = WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":2,"b":4,
        "p":3,"n":4,"r":5,"m":4,"j":2,"sh":2,"l":2,"ch":2,
        "bl":1,"br":1,"dr":1,"fl":1,"fr":1,"gl":1,"gr":1,
        "cl":1,"cr":1,"sl":1,"st":1,"str":1,"thr":1,"tr":2,"tw":1,
        "w":1});

    // Vowels
    var vm = WeightedList(
      {"a":4,"ai":1,"e":4,"ee":2,"io":1,"oo":2,"i":4,"o":4,"u":2});
    var ve = WeightedList(
      {"a":2,"ee":1,"i":2,"io":1,"o":2,"oo":1,"y":2});
    var vs = WeightedList(
      {"a":1,"e":1,"i":1,"o":1});


    var randomWord = function () {
      var w;
      switch (_.random(0, 6)) {
        case 0: w = c() + vm() + cap(c()) + vm() + ce(); break;
        case 1: w = cap(c()) + vm() + c() + ve(); break;
        case 2: w = cs() + vm() + cap(c()) + vm() + c() + ve(); break;
        case 3: w = cap(cs()) + vm() + c(); break;
        case 4: w = vs() + c() + cap(c()) + ve(); break;
        case 5: w = vs() + c() + cap(c()) + vm() + ce(); break;
        case 6: w = cap(c()) + vm() + c() + vm() + c() + vm() + ce(); break;
      }
      w = w + punc() + num(3);
      return w;
    };

    // Public data
    return {randomWord: randomWord};
  })();

  // Markov chain generator
  var generator4 = (function () {

    // Generated Markov transition matrix for the given set.
    var allLetters = [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var tr = [
      [0.1846154,0.09230769,0.005128205,0.07692308,0.03076923,0.04615385,0.02564103,0.01025641,0.005128205,0.03589744,0.005128205,0.01538462,0.03589744,0.06666667,0.01538462,0.03076923,0.06153846,0.005128205,0.04102564,0.1128205,0.02564103,0.005128205,0.03076923,0.03076923,0,0.005128205,0],
      [0,0,0,0.1139241,0.08860759,0,0,0.02531646,0,0.01265823,0,0.02531646,0.1265823,0.08860759,0.2151899,0,0,0,0.07594937,0.01265823,0.1392405,0.02531646,0,0.01265823,0.01265823,0.02531646,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0.5,0,0,0,0,0,0,0,0,0.5,0,0,0,0,0],
      [0,0.125,0,0,0,0.1458333,0,0,0.1041667,0.0625,0,0.04166667,0.02083333,0,0,0.1666667,0,0,0.04166667,0.02083333,0.1666667,0.1041667,0,0,0,0,0],
      [0.3928571,0,0,0,0,0.25,0,0,0.03571429,0,0.03571429,0,0.03571429,0.03571429,0,0.07142857,0,0,0.03571429,0.03571429,0,0.03571429,0.03571429,0,0,0,0],
      [0.1849315,0.04794521,0,0.02054795,0.05479452,0.04794521,0.01369863,0.006849315,0,0,0,0,0.02054795,0.02739726,0.1027397,0.02054795,0.01369863,0.01369863,0.1575342,0.1712329,0.04109589,0,0.02054795,0,0.02054795,0.01369863,0],
      [0,0,0,0,0,0.1538462,0.07692308,0,0,0.1538462,0,0,0,0,0,0.3076923,0,0,0,0,0.2307692,0,0,0,0,0.07692308,0],
      [0.2222222,0.1111111,0,0,0,0.1481481,0,0.1111111,0.03703704,0,0,0,0,0,0,0,0,0,0.07407407,0.07407407,0,0.03703704,0,0,0,0.1851852,0],
      [0.3333333,0.06666667,0,0,0,0.4,0,0,0,0.1333333,0,0,0,0,0,0.06666667,0,0,0,0,0,0,0,0,0,0,0],
      [0,0.01369863,0,0.06849315,0.01369863,0.04109589,0.02739726,0,0,0,0,0,0.02739726,0.01369863,0.2191781,0.2054795,0,0.01369863,0.06849315,0.1232877,0.06849315,0,0.05479452,0,0.01369863,0,0.02739726],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
      [0.2222222,0,0,0,0,0.5555556,0,0,0,0,0,0,0,0,0.1111111,0,0,0,0,0.1111111,0,0,0,0,0,0,0],
      [0.08333333,0.0625,0,0,0,0.25,0,0,0,0.1041667,0,0,0.1458333,0,0,0.125,0,0,0,0.02083333,0.02083333,0,0,0,0,0.1875,0],
      [0.05,0.2,0,0,0,0.175,0,0,0,0.125,0,0,0,0,0,0.05,0.3,0,0,0.025,0,0.075,0,0,0,0,0],
      [0.2025316,0.06329114,0,0,0.05063291,0.1518987,0.01265823,0.08860759,0,0.08860759,0,0.01265823,0,0,0,0.05063291,0,0,0,0.1139241,0.08860759,0,0,0,0,0.07594937,0],
      [0.01351351,0,0.01351351,0.08108108,0,0.01351351,0.02702703,0.01351351,0,0.01351351,0,0,0.01351351,0.1621622,0.3108108,0,0.08108108,0,0.06756757,0.01351351,0.05405405,0.05405405,0,0.06756757,0,0,0],
      [0.1081081,0.1891892,0,0,0,0.1351351,0,0,0.02702703,0.1081081,0,0,0.1621622,0,0,0.1081081,0,0,0.1621622,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
      [0.06451613,0.06451613,0,0.0483871,0.03225806,0.2741935,0,0.1290323,0,0.0483871,0,0.01612903,0,0.01612903,0,0.1129032,0.01612903,0,0,0.09677419,0.03225806,0,0.01612903,0,0,0.03225806,0],
      [0.3925234,0.01869159,0,0.009345794,0,0.09345794,0,0,0.009345794,0.07476636,0,0,0.02803738,0.009345794,0,0.02803738,0.03738318,0,0,0.07476636,0.1869159,0.02803738,0,0,0,0.009345794,0],
      [0.09333333,0.04,0,0,0,0.1733333,0,0,0.06666667,0.2533333,0,0,0.04,0,0,0.1066667,0,0,0.02666667,0.1066667,0.02666667,0.04,0,0,0,0.02666667,0],
      [0,0.06666667,0,0.1666667,0,0.1666667,0,0.1,0,0,0,0,0.1,0,0.1,0,0,0,0.03333333,0.2333333,0.03333333,0,0,0,0,0,0],
      [0,0.3333333,0,0,0,0.5333333,0,0,0,0.1333333,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0.3333333,0.1666667,0,0,0,0.25,0,0,0,0.08333333,0,0,0,0,0.08333333,0.08333333,0,0,0,0,0,0,0,0,0,0,0],
      [0.2,0,0,0,0,0.4,0,0,0,0.4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0.7419355,0,0,0,0,0.03225806,0,0,0,0.03225806,0,0,0,0,0,0,0,0,0.03225806,0.1290323,0.03225806,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    // Return a random next letter, given the transition matrix
    var nextLetter = function (ltr, symbols, tr_matrix) {
      var row_idx = _.indexOf(symbols, ltr);
      var row = tr_matrix[row_idx];
      var x = WeightedList(_.zipObject(symbols, row));
      return x();
    };

    var randomCap = function (w) {

    };

    // Generate a random word of a minimum and maximum length
    var randomWord = function () {
      var minLength = 4;
      var maxLength = 6;
      var w = '';

      do {
        letter = ' ';
        do {
          letter = nextLetter(letter, allLetters, tr);
          w = w + letter;
        } while (letter != ' ' && w.length < maxLength);
        w = $.trim(w);
      } while (w.length < minLength);

      w = cap(w) + punc() + num(3); // add decorators
      return w;
    };

    // Public data
    return {randomWord: randomWord};

  })();

  // Public
  return {
    generators: [
      {"name": "Gen 1", "fn": "generator1"},
      {"name": "Gen 2", "fn": "generator2", "default": true},
      {"name": "Gen 3", "fn": "generator3"},
      {"name": "Markov", "fn": "generator4"}
    ],
    generator1: generator1,
    generator2: generator2,
    generator3: generator3,
    generator4: generator4,
  };

})();

// The End
