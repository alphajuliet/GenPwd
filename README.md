__GenPwd__ is a simple password generator that runs in a single-page HTML application. Using combinations of weighted letters and vowels it generates pseudo-random words. It offers options for additional complexity through incorporating numbers, punctuation, and capitals.

These are the available generators:
* _generator1_: vaguely reminiscent of English
* _generator2_: something resembling Japanese
* _generator3_: another Englishy variant
* _generator4_: a simple 1-character lookahead Markov chain, trainied on some English text. See the R project for the code.

# Caveats

1. The generated passwords are not guaranteed or even designed to be uniformly distributed throughout the target space. They should not be used for systems that require strong password authentication. Use at your own risk, or use two-factor authentication.

2. Randomly generated words may turn out to be offensive in some languages. If you're offended by something in the list, sorry, try again.

# Development

## Backlog

* Use pluggable generators
* Do something based on phonotactics

## In Progress

## Done

* Use a Markov chain as a generator
* Add a third generator
* Clean and improve code
* Use Lodash to standardise function calls.
* Update to jQuery 3.0.0
* Refactored code to allow additional generators
* Updated stylesheet to change fonts and colours
* Added more text to README
* Added pseudo-Japanese generator
* Added .gitignore
* Updated jQuery to 1.8.3
