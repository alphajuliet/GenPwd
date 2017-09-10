// Generator.js
// aj

//---------------------------------
// Namespace: Generator

var Generator = Generator || {};
Generator = (function () {


  // Capitalise a word
  var capitalise = function (s) {
    return s.replace(/^[a-z]/, s => s.toUpperCase());
  }

  // Random number string in range [0, 10^n), padded to n digits
  // randomNumericString :: Integer -> String
  var randomNumericString = function (n) {
    var x = Math.random() * (Math.pow(10, n)-1);
    return String("0000000000" + x).slice(-n);
  };

  // Random 0 to n-1
  var dice = function (n) {
    return Math.floor(Math.random() * n)
  }

  // Wraps a function that returns a random element from the given list.
  // RandomList :: Object -> (() -> String)
  var RandomList = function (t) {
    return function () {
      return t[dice(t.length)];
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

  //---------------------------------
  var isChecked = function (id) { return $(id).is(':checked') };

  // Apply a function only if the box is checked
  // e.g. doIfChecked(R.toUpper, '#box1')('abcd')
  var doIfChecked = function (f, id) {
    return isChecked(id) ? f : R.identity;
  }

  // Transform a random element in an array
  // trRandElement :: (a -> a) -> [a] -> [a]
  var trRandElement = R.curry(function (f, arr) { 
    var idx = dice(arr.length);
    return R.join('', R.update(idx, f(arr[idx]), arr));
  });

  var symbols =  ["!","#","$","^","*","&", "+","@","-","=","/","~","?","\\","%","[","]","{","}","(",")"];

  var cap  = function (s) { return isChecked("#capitals") ? capitalise(s) : s; };
  var punc = function ()  { return isChecked("#punctuation") ? RandomList(symbols)() : "" };
  var num  = function (n) { return isChecked("#numbers") ? randomNumericString(n) : "" };

  // Uppercase a random letter
  var ranUpper = trRandElement(R.toUpper);

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
      switch (dice(8)) {
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
      var w = (dice(2) < 1) ? crunch(f) + num(2) : num(2) + crunch(f);
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
      {"":5, "n":1});

    var randomWord = function () {
      var syll = [capF(c1), v1, n];

      var f;
      switch (dice(4)) {
        case 0:  f = [syll, punc, c1, v1]; break;
        case 1:  f = [syll, punc, syll, c1, v1]; break;
        case 2:  f = [v1, syll, punc, syll]; break;
        case 3:  f = [punc, syll, syll]; break;
        default: f = [syll, syll, punc]; break;
      }

      g = (dice(2) < 1) ? [f, num2] : [num2, f];

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
      switch (dice(6)) {
        case 0:  f = [c, vm, capF(c), vm, ce]; break;
        case 1:  f = [capF(c), vm, c, ve]; break;
        case 2:  f = [cs, vm, capF(c), vm, c, ve]; break;
        case 3:  f = [capF(cs), vm, c]; break;
        case 4:  f = [vs, c, capF(c), ve]; break;
        case 5:  f = [vs, c, capF(c), vm, cs]; break;
        default: f = [capF(c), vm, c, vm, c, vm, ce]; break;
      }
      w = (dice(2) < 1) ? [f, punc, num3] : [num3, f, punc];
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
    var allLetters = [' ', '_', "'", 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    var tr = [
      [ 0.0001661183,0,0.001012786,0.1211592,0.04469118,0.03657282,0.02942973,0.01811225,0.03810004,0.01722272,0.06422884,0.07750222,0.002545361,0.005792706,0.02441939,0.05296494,0.01820335,0.06261052,0.02634315,0.002180972,0.0217347,0.07929201,0.1634068,0.01310727,0.007486041,0.06366618,0.0003590299,0.007630724,5.89452e-05],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [ 0.5013193,0,0,0.01846966,0.01583113,0.0237467,0.03166227,0.005277045,0.005277045,0.002638522,0.06860158,0.04221636,0,0,0.01583113,0.03430079,0.03166227,0.005277045,0.02638522,0,0.005277045,0.02110818,0.06596306,0,0.002638522,0.02902375,0,0.0474934,0],
      [ 0.07805008,0,0,0,0.02216091,0.0423595,0.05372029,0.0002655768,0.008616492,0.02077401,0.0004278738,0.05071042,0.0001327884,0.008690264,0.05919412,0.02996592,0.2138631,0.0006491878,0.02143795,0.0001327884,0.09562241,0.09959131,0.1211178,0.008026322,0.02075925,0.01541821,0.000604925,0.02589374,0.001814775],
      [ 0.00544285,0,0,0.07042718,0.01410193,8.246743e-05,0.0004123371,0.2764308,0.0002474023,0,0.001649349,0.03430645,0.003711034,0,0.1700478,0.001814283,0.0004123371,0.1147947,0,0,0.08609599,0.0182253,0.00799934,0.130381,0.000577272,0.0001649349,0,0.06267524,0],
      [ 0.0139879,0,0,0.13221,0,0.01463599,0.000162022,0.1656405,0,0,0.1476021,0.03920933,0,0.09499892,0.05352128,0,5.400734e-05,0.1565673,0,0.0003240441,0.06734716,0.001188162,0.05984014,0.04385396,0,0,0,0.008857205,0],
      [ 0.6500541,0,0.0005148535,0.02648921,0.0001801987,0.0001801987,0.01493075,0.1040262,0.0007207949,0.007182207,7.722803e-05,0.05977449,0.0003346548,7.722803e-05,0.0100139,0.0005405962,0.002574268,0.05411111,0,2.574268e-05,0.01964166,0.02432683,0.0002574268,0.007182207,0.002934665,0.000952479,0,0.01289708,0],
      [ 0.3749525,0,0.0004703669,0.05476271,0.0009207182,0.01452133,0.09605492,0.03522748,0.007625948,0.005624387,0.002762154,0.009347291,0.0001200937,0.0007605933,0.03099418,0.02212726,0.08143352,0.004313364,0.008436581,0.0006905386,0.1203839,0.06003683,0.02438902,0.0003302576,0.01338044,0.005684434,0.008866916,0.01549208,0.0002902264],
      [ 0.4058919,0,0,0.06825423,0,0,0,0.07306166,0.03499357,0,0,0.07753368,0,0,0.0401923,0,0,0.149086,5.590027e-05,0,0.07026664,0.001844709,0.04332271,0.03370787,0,0.000614903,0,0.001173906,0],
      [ 0.4025702,0.0002150769,0,0.07457791,0.0001613077,0,0.0001075384,0.1218948,0,0.01634584,0.1261426,0.03554146,0,0,0.0316163,0.001666846,0.008065383,0.05753307,0,0,0.06543714,0.02494892,0.003817615,0.02661577,0,0.0006989999,0,0.00204323,0],
      [ 0.08628014,0,0.0001213789,0.156518,0.0004450558,4.045962e-05,0.0002022981,0.489521,0.000323677,6.068943e-05,2.022981e-05,0.1323232,0,2.022981e-05,0.0009710309,0.001274478,0.0004045962,0.06050736,6.068943e-05,0.0001011491,0.01515213,0.000849652,0.03214517,0.01666936,0,0.002225279,0,0.003762745,0],
      [ 0.08962114,0,0.0001414978,0.01284092,0.01275249,0.03652411,0.04934734,0.02322332,0.01501645,0.03166012,7.074888e-05,0.00127348,0,0.007534755,0.04596908,0.04131734,0.3027698,0.03779759,0.008560614,0.0003891188,0.0361173,0.09643072,0.1286038,0.0006544271,0.01797021,0,0.001768722,0,0.001644911],
      [ 0.001620746,0,0,0.165316,0,0,0.001620746,0.2090762,0,0,0,0.001620746,0,0,0,0,0,0.1750405,0,0,0,0,0,0.445705,0,0,0,0,0],
      [ 0.319432,0,0.0002989537,0.01061286,0.0005979073,0.0001494768,0.0004484305,0.3475336,0.002989537,0.0004484305,0.0005979073,0.1346786,0,0,0.01793722,0.001494768,0.08430493,0.001793722,0,0,0.0001494768,0.04887892,0,0.001345291,0,0.004334828,0,0.02197309,0],
      [ 0.1275035,0,0.0002507444,0.1018022,0.001755211,0.0005014888,0.05014888,0.1780599,0.01670585,0.0002820874,0.0003761166,0.1193543,0,0.007929792,0.1266573,0.005422348,0.001316408,0.09142768,0.004388027,0,0.003479079,0.01529541,0.01864911,0.02012224,0.006832785,0.002726845,0,0.09901269,0],
      [ 0.1376386,0,0.0003590181,0.1571153,0.0189382,0.000179509,0,0.2816048,0.001929722,0,4.487726e-05,0.06857245,0,0,0.003859444,0.01377732,0.002961899,0.1127317,0.04945474,0,0.01476462,0.01718799,0.000179509,0.02831755,0,0,0,0.0903828,0],
      [ 0.2481563,0,0.000138819,0.01658887,0.0003991046,0.0295858,0.2020858,0.08016797,0.005622169,0.15251,0.001162609,0.03147721,0.0004685141,0.01011643,0.01082788,0.0005726284,0.007791216,0.05181419,0.0006246855,0.0005899807,0.000416457,0.03534679,0.09358136,0.004876017,0.00628156,0.0007114474,0.0007461521,0.006906245,0.0004338094],
      [ 0.1186039,0,3.539886e-05,0.01093825,0.004796545,0.01203561,0.01890299,0.00153985,0.115418,0.006725783,0.0006017806,0.01318607,0.0005486823,0.01688525,0.02761111,0.055824,0.1386396,0.0464256,0.02277916,0.0001769943,0.09971858,0.02849608,0.04541673,0.1309404,0.01959327,0.06024885,0.001345157,0.001628347,0.0009380697],
      [ 0.1109007,0,7.01459e-05,0.117284,0.0005611672,0,0,0.1978816,0.0002805836,0,0.01683502,0.07007576,0.0001402918,0.0001402918,0.09118967,0.001332772,0.0004910213,0.1133558,0.07246072,0,0.0874018,0.0359147,0.04054433,0.03984287,0,0.0007716049,0,0.002525253,0],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
      [ 0.2112281,0,0.0001335619,0.06571244,0.00211473,0.009549674,0.03557198,0.2411905,0.004029116,0.007657547,0.003984596,0.07196759,0,0.01248804,0.01202057,0.01297776,0.02350689,0.09663201,0.004229459,0,0.01865414,0.04930659,0.04320727,0.02315072,0.008481179,0.003428088,0,0.03866616,0.0001113016],
      [ 0.3777397,0,0.0006458123,0.05148335,0.0002018163,0.01683148,0.0002421796,0.1057316,0.001089808,0.0004036327,0.05202825,0.05447023,4.036327e-05,0.007971746,0.0160444,0.009445005,0.003229062,0.0459334,0.01951564,0.001755802,0.000221998,0.04496468,0.1500101,0.02946519,8.072654e-05,0.007386478,0,0.003067608,0],
      [ 0.2508565,0,0.000250369,0.03299599,0.0001185958,0.006206515,1.317731e-05,0.07721906,0.0007906388,0.002714527,0.3508723,0.06362007,0,0,0.01771031,0.0009355893,0.001067362,0.08793222,9.22412e-05,0,0.0313093,0.02168986,0.01859319,0.01834282,0,0.007023508,0,0.009593085,5.270926e-05],
      [ 0.04042785,0,0.0004985497,0.01486584,0.01332487,0.02905185,0.02923314,0.02474619,0.006254532,0.05814902,0,0.02538071,0,0,0.09087201,0.03607687,0.1360587,0.002130167,0.06680566,0,0.1472534,0.1160714,0.1583575,0,0.0008158086,0,0.001948876,0.0001359681,0.001540972],
      [ 0.003239304,0,0,0.07706843,0,0,0,0.6677014,0,0,0,0.1795114,0,0,0,0,0,0.05776758,0,0,0.000269942,0,0,0.002294507,0.001079768,0,0,0.01106762,0],
      [ 0.1211245,0,0.0003275109,0.2731441,0.0004912664,0.0001637555,0.007259825,0.1633734,0.0003820961,0,0.1219432,0.1472162,5.458515e-05,0.0003820961,0.01375546,5.458515e-05,0.05010917,0.07429039,5.458515e-05,0,0.009606987,0.01304585,0.001637555,0.001091703,0,0,0,0.0004912664,0],
      [ 0.1414063,0,0,0.06953125,0,0.1414063,0,0.0625,0.00546875,0,0.0171875,0.0859375,0,0,0.0015625,0,0,0.00234375,0.2226562,0.003125,0,0,0.1890625,0.01796875,0.01875,0,0.01875,0.00234375,0],
      [ 0.7707597,0,0.0004001868,0.00693657,0.004068565,0.003268192,0.0004001868,0.05295805,0.001133862,0.0002000934,0.0006669779,0.0180084,0,0,0.008203828,0.003735076,0.001067165,0.07690255,0.001600747,0,0.002601214,0.03781765,0.007603548,0,0.0005335823,0.001133862,0,0,0],
      [ 0.02325581,0,0,0.03488372,0,0,0,0.5232558,0,0,0,0.09302326,0,0,0.1046512,0,0,0.05581395,0,0,0,0,0,0,0,0,0,0.04186047,0.1232558],
    ];

    // Return a random next letter, given the transition matrix
    // nextLetter :: Char -> [Char] -> [[Float]] -> Char
    var nextLetter = function (tr_matrix, symbols, ltr) {
      var row_index = R.indexOf(ltr, symbols);
      var row = tr_matrix[row_index];

      // Round the probabilities to splits across 100
      var roundf = R.flip(R.curry(Math.round));
      var int_row = R.map(R.compose(roundf(1), R.multiply(200)), row);

      // Generate a bag of letters and pick one
      var listf = WeightedList(R.zipObj(symbols, int_row));
      return listf();
    };

    // Pre-calculate all the weighted lists
    // var allLists = R.map(nextLetter(symbols, tr_matrix), symbols)

    // Generate a random word of a minimum and maximum length
    var randomWord = function () {
      var minLength = 5;
      var maxLength = 7;
      var w = '';

      do {
        letter = RandomList(R.slice(3, 29, allLetters))();
        w = letter;
        do {
          letter = nextLetter(tr, allLetters, letter);
          w = w + letter;
        } while (letter != ' ' && w.length < maxLength);
        w = $.trim(w);
      } while (w.length < minLength);

      if (dice(2) < 1)
        w = doIfChecked(ranUpper, "#capitals")(w) + punc() + num(3); // add decorators
      else
        w = num(3) + punc() + doIfChecked(ranUpper, "#capitals")(w)

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
