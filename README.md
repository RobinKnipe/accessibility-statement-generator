# Accessibility Statement generator

A simple CLI that acts as a guide to help create PSBAR compliant Accessibility
Statements.
Session data is recorded upon completion, so that it can be used to speed up
future updates.
The details captured by the CLI are used to create a Markdown document, and in
turn, an HTML page.

## Running the CLI

This is a Node.js project, that requires `v12` or higher. Instructions and
installation media can be found here: https://nodejs.org/en/download/.
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
./asg ./accessibility-statements/My-Service.json
```
The next prompt - whether to edit these answers - can also be skipped by adding
a further option `y` (yes edit), `n` (don't edit):
```bash
./asg ./accessibility-statements/My-Service.json y
```

### Skip session loading
The main part of the program (the bit that asks for the necessary content), can
run with this command:
```bash
./asg new
```

The session loading can also be skipped by running the CLI with `plop`:
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

## How it works

The answers collected by the CLI (or data from a JSON file), is injected into
the Handlebars template file: `./statement-template.md.hbs`. This creates a
markdown file which (in some environments, e.g. React) may be able to be
deployed directly into a codebase. The CLI also translates the generated
markdown file into HTML (for cases where markdown can't be used directly).
Because data can be loaded from a JSON file, a previous session's details can
be automatically updated, and the resulting file used to update a statement
without the interactive part of the CLI:
```bash
./asg ./my-service-data.json n
```
NOTE: the second argument `n` is important to cancel the interactive prompts.
