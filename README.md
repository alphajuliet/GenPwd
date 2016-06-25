__GenPwd__ is a simple password generator that runs in a single-page HTML application. Using combinations of weighted letters and vowels it generates pseudo-random words. It offers options for additional complexity through incorporating numbers, punctuation, and capitals.

There are two generators available:
* _generator1_: vaguely reminiscent of English
* _generator2_: something resembling Japanese

# Caveats

1. The generated passwords are not guaranteed or even designed to be uniformly distributed throughout the target space. They should not be used for systems that require strong password authentication. Use at your own risk.

2. Randomly generated words may turn out to be offensive in some languages. If you're offended by something in the list, sorry, try again.

# Development

## Backlog

* Use pluggable generators

## In Progress

* Clean up code

## Done

* Use Lodash to standardise function calls.
* Update to jQuery 3.0.0
* Refactored code to allow additional generators
* Updated stylesheet to change fonts and colours
* Added more text to README
* Added pseudo-Japanese generator
* Added .gitignore
* Updated jQuery to 1.8.3

