// GenPwd.js

//---------------------------------
// Namespace: GenPwd

var GenPwd = GenPwd || {};
GenPwd = (function () {

  // Application metadata
  var Info = {
    name: "GenPwd",
    author: "AndrewJ",
    version: "2.26",
    date: "2017-07-19",
    info: "GenPwd is a simple password generator.",
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

  // Display the app info, and populate the list of available generators.
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
    $('#clipboard').hide();
  };

  // Main function to generate a list of random words, based on the chosen generator.
  var generate = function (output) {
    var nwords = 10;
    var gen_opt = $('#gen').val();
    var options = { // unused for now
      "capitals": $('#capitals').is(':checked'),
      "punctuation": $('#punctuation').is(':checked'),
      "numbers": $('#numbers').is(':checked')
    };
    var gen = Generator[gen_opt];

    $(output).empty();
    R.forEach(
      function (i) {
        $(output)
          .append($("<div class='word'></div>")
            .append(gen.randomWord()));
      }, 
      R.range(0, nwords));

    // Copy to clipboard functionality
    $('#clipboard').show();
    $('.word').click(function () {
      $('#copy-text').attr("value", $(this).text());
    });

    var clipboard = new Clipboard('.copy-button');
    clipboard.on('error', function(e) { console.log(e); });

  };

  // Public data
  return {
    initialise: initialise,
    generate: generate
  };

})();

// The End
