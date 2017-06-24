// Generator.js
// aj

//---------------------------------
// Namespace: Generator

var Generator = Generator || {};
Generator = (function () {

  // Random number string
  // randomNumericString :: Integer -> String
  var randomNumericString = function (n) {
    return _.padStart(_.random(0, Math.pow(10,n)-1), n, "0");
  };


  // Wraps a function that returns a random element from the given list.
  // RandomList :: Object -> (() -> String)
  var RandomList = function (t) {
    return function () {
      return t[Math.floor(Math.random() * t.length)];
    };
  };

  // Return a function that randomly selects elements from a weighted list.
  // A weighted list simply has more copies of higher weighted elements.
  // WeightedList :: Object -> (() -> String)
  var WeightedList = function (t) {

    // Return an array of n copies of x.
    // repeat :: String -> Integer -> [String]
    var repeat = function (x, n) {
      return R.times(function (i) {return (x);}, n);
    };

    // Creates multiple versions of an element based on the count.
    // e.g. {"a":2, "b":3} -> ["a", "a", "b", "b", "b"]
    // expandedList :: Object -> [String]
    var expandedList = R.chain(
      function (p) { return repeat(p[0], p[1]); },
      R.toPairs(t)
    );

    return RandomList(expandedList);
  };

  // Apply a function only if the box is checked
  // e.g. doIfChecked(R.toUpper, '#box1')('abcd')
  var doIfChecked = function (f, id) {
    return $(id).is(':checked') ? f : R.identity;
  }

  // Transform a random element in an array
  // trRandElement :: (a -> a) -> [a] -> [a]
  var trRandElement = R.curry(function (f, arr) { 
    var idx = Math.floor(Math.random() * arr.length);
    return R.join('', R.update(idx, f(arr[idx]), arr));
  });

  var symbols =  ["!","#","$","^","*","&", "+","@","-","=","/","~","?","\\","%","[","]","{","}","(",")"];

  // cap :: String -> String
  var cap  = function (s) { return ($("#capitals:checked").length > 0 ? _.capitalize(s) : s); };

  // Uppercase a random letter
  var ranUpper = trRandElement(R.toUpper);

  // punc :: () -> String
  var punc = function () { return($('#punctuation').is(':checked') ? RandomList(symbols)() : "") };

  // num :: Int -> String
  var num  = function (n) { return ($('#numbers').is(':checked') ? randomNumericString(n) : ""); };

  // Temporary hacks to reduce arity
  var num2 = function () { return num(2); };
  var num3 = function () { return num(3); };
  var capF = function (f) { return R.compose(cap, f); };

  // Functional smarts
  // crunch :: [() -> String] -> String
  var crunch = function (f) { return R.join('', R.juxt(R.flatten(f))()); };

  //---------------------------------
  // Generator 1
  // The original generator

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
      var syll1 = [c1, v1, c2]; 

      var f;
      switch (_.random(0, 8)) {
        case 0:  f = [syll1, punc, capF(c2), v2, c3]; break;
        case 1:  f = [v1, capF(c1), punc, v2, c3]; break;
        case 2:  f = [c1, v1, punc, capF(c3), v3]; break;
        case 3:  f = [v1, c1, v1, capF(c3), v3, punc]; break;
        case 4:  f = [c1, v1, capF(c1), v2, c3, punc]; break;
        case 5:  f = [punc, capF(c1), v2, c3, v3]; break;
        case 6:  f = [c1, v1, capF(c2), punc, v2, c3]; break;
        case 7:  f = [c1, v1, capF(c1), v1, c1, v1, punc]; break;
        default: f = [c1, v1, punc, capF(c3), v3]; break;
      }
      var w = (_.random(0, 2) < 1) ? crunch(f) + num(2) : num(2) + crunch(f);
      return w;
    };

    // Public data
    return {randomWord: randomWord };
  })();

  //---------------------------------
  // Generator 2
  // Pseudo-Japanese style

  var generator2 = (function () {
    var c1 = WeightedList(
      {"k":5,"g":5,"t":5,"d":5,"s":5,"z":4,"h":3,"b":3,
        "p":3,"n":3,"r":5,"m":5,"y":2,"gy":1,"j":2,"sh":2,
        "ch":2,"ky":1,"hy":1,"ry":2,"my":1,"ny":1,"by":1,"py":1});
    var v1 = WeightedList(
      {"a":2,"i":1,"u":2,"e":1,"o":2, "ou":1});
    var n = WeightedList(
      {"":4, "n":1});

    var randomWord = function () {
      var syll = [capF(c1), v1, n];

      var f;
      switch (_.random(0, 4)) {
        case 0:  f = [syll, punc, c1, v1]; break;
        case 1:  f = [syll, punc, syll, c1, v1]; break;
        case 2:  f = [v1, syll, punc, syll]; break;
        case 3:  f = [punc, syll, syll]; break;
        default: f = [syll, syll, punc]; break;
      }

      g = (_.random(0, 2) < 1) ? [f, num2] : [num2, f];

      w = crunch(g); // Turn into a string

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
  // Generator 3
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
      var f;
      switch (_.random(0, 6)) {
        case 0:  f = [c, vm, capF(c), vm, ce]; break;
        case 1:  f = [capF(c), vm, c, ve]; break;
        case 2:  f = [cs, vm, capF(c), vm, c, ve]; break;
        case 3:  f = [capF(cs), vm, c]; break;
        case 4:  f = [vs, c, capF(c), ve]; break;
        case 5:  f = [vs, c, capF(c), vm, cs]; break;
        default: f = [capF(c), vm, c, vm, c, vm, ce]; break;
      }
      w = (_.random(0, 1) === 0) ? [f, punc, num3] : [num3, f, punc];
      return crunch(w);
    };

    // Public data
    return {randomWord: randomWord};
  })();

  //---------------------------------
  // Generator 4
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
    // nextLetter :: Char -> [Char] -> [[Float]] -> Char
    var nextLetter = function (tr_matrix, symbols, ltr) {
      var row_index = _.indexOf(symbols, ltr);
      var row = tr_matrix[row_index];

      // Round the probabilities to splits across 100
      var roundf = R.flip(R.curry(Math.round));
      var int_row = R.map(R.compose(roundf(1), R.multiply(100)), row);

      // Generate a bag of letters and pick one
      var listf = WeightedList(R.zipObj(symbols, int_row));
      return listf();
    };

    // Pre-calculate all the weighted lists
    // var allLists = R.map(nextLetter(symbols, tr_matrix), symbols)

    // Generate a random word of a minimum and maximum length
    var randomWord = function () {
      var minLength = 4;
      var maxLength = 6;
      var w = '';

      do {
        letter = ' ';
        do {
          letter = nextLetter(tr, allLetters, letter);
          w = w + letter;
        } while (letter != ' ' && w.length < maxLength);
        w = $.trim(w);
      } while (w.length < minLength);

      w = doIfChecked(ranUpper, "#capitals")(w) + punc() + num(3); // add decorators
      return w;
    };

    // Public data
    return {randomWord: randomWord};

  })();

  // Public data
  return {
    generators: [
      {"name": "Gen 1", "fn": "generator1"},
      {"name": "Gen 2", "fn": "generator2"},
      {"name": "Gen 3", "fn": "generator3"},
      {"name": "Markov", "fn": "generator4", "default": true}
    ],
    WeightedList: WeightedList,
    generator1: generator1,
    generator2: generator2,
    generator3: generator3,
    generator4: generator4
  };

})();

// The End
