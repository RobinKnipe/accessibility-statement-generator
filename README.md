# Accessibility Statement generator

A simple CLI that acts as a guide to help create PSBAR compliant Accessibility
Statements.
Session data is recorded upon completion, so that it can be used to speed up
future updates.
The details captured by the CLI are used to create a Markdown document, and in
turn, an HTML page.

## Running the CLI

Checkout this repo and run `npm i` to install the necessary dependencies.
Then the CLI can be run with:
```bash
./asg
```

### Load a previous session
The first part of the program will allow a previous session's answers to be used
as defaults, so you can skip through (by simply pressing Enter/Return), and
updating as necessary. This part can be skipped by running the CLI and
specifying a target file:
```bash
./asg ./accessibility-statements/My Service-<date>.json
```
The next prompt - whether to edit these answers - can also be skipped by adding
a further option `y` (yes edit), `n` (don't edit):
```bash
./asg ./accessibility-statements/My Service-<date>.json y
```

### Skip session loading
The main part of the program (the bit that asks for the necessary content), can
be run with `plop`:
```bash
./node_modules/.bin/plop
```
Once the CLI has gathered all the required project information, it will create
the three output files in the `./accessibility-statements` directory.

## CI automation

It is the goal of this project to allow developers to speed up the creation of
Accessibility Statements, and eventually automate their updates after CI test
runs. While the need for some manual testing will always exist; hopefully this
will help with everything else, and improve upon the current document template
by bringing the advantages of GitHub's superior collaborative features.
