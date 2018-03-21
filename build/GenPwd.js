// GenPwd.js

//---------------------------------
// Namespace: GenPwd

var GenPwd = GenPwd || {};
GenPwd = (() => {

  // Application metadata
  const Info = {
    name: "GenPwd",
    author: "AndrewJ",
    version: "2.29",
    date: "2017-09-18",
    info: "GenPwd is a simple password generator.",
    appendTo: function (tagName) {
      let str = "<div>";
      str += "<span class='title'>" + this.name + "</span>";
      str += "&nbsp;<span class='description'>v" + this.version + "</span>";
      str += "</div>";
      $(tagName).append(str);
    },
    aboutText: function () {
      let str = this.name + " v" + this.version;
      str += ", last modified: " + this.date;
      str += " by: " + this.author + ".\n\n";
      str += this.info;
      return str;
    }
  };

  // Display the app info, and populate the list of available generators.
  var initialise = () => {
    Info.appendTo("header");

    var fn;
    $.each(Generator.generators, (i, gen) => {
      if (gen.default === true)
        fn = gen.fn + '" selected="true';
      else
        fn = gen.fn;
      $('#gen').append($('<option value="' + fn + '">' + gen.name + '</option>'));
    });

    $('#clipboard').hide();
  };

  // Main function to generate a list of random words, based on the chosen generator.
  var generate = (output, gen_opt, opts) => {
    const nwords = 10;
    const gen = Generator[gen_opt];

    $(output).empty();
    R.forEach( (i) => {
      $(output)
        .append($("<div class='word'></div>")
          .append(gen.randomWord(opts)));
    }, 
    R.range(0, nwords));

    // Copy to clipboard functionality
    $('#clipboard').show();
    $('.word').click( 
      () => $('#copy-text').attr("value", $(this).text()));

    var clipboard = new Clipboard('.copy-button');
    clipboard.on('error', (e) => console.log(e) );

  };

  // Public data
  return {
    initialise: initialise,
    generate: generate
  };

})();

// The End
