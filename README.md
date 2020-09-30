# Accessibility Statement generator

A simple CLI that acts as a guide to help create PSBAR compliant Accessibility Statements.
Session data is recorded upon completion, so that it can be used to speed up future updates.
The details captured by the CLI are used to create a Markdown document, and in turn, an HTML page.

## Running the CLI

Checkout this repo and run `npm i` to install the necessary dependencies.
Then the CLI can be run with:
```bash
./node_modules/.bin/plop
```
Once the CLI has gathered all the required project information, it will create the three output files
in the `./accessibility-statements` directory.
