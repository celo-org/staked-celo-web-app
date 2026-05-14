# Contributing

Thank you for your interest in improving the stCelo web app.

If you want to contribute, but aren't sure where to start, you can create a
[new discussion](https://github.com/celo-org/staked-celo-web-app/discussions).

There are multiple opportunities to contribute. It doesn't matter if you are just
getting started or are an expert. We appreciate your interest in contributing.

> **IMPORTANT**
> Please ask before starting work on any significant new features.
>
> It's never a fun experience to have your pull request declined after investing time and effort
> into a new feature. To avoid this from happening, we invite contributors to create a
> [new discussion](https://github.com/celo-org/staked-celo-web-app/discussions) to discuss API changes or
> significant new ideas.

## Basic guide

This guide is intended to help you get started with contributing. By following these steps,
you will understand the development process and workflow.

### Cloning the repository

To start contributing to the project, clone it to your local machine using git:

$ git clone https://github.com/celo-org/staked-celo-web-app.git

Navigate to the project's root directory:

$ cd staked-celo-web-app

### Installing Node.js

We use [Node.js](https://nodejs.org/en/) to run the project locally.

Please use the Node.js version defined by the project. If you use
[nvm](https://github.com/nvm-sh/nvm), run:

$ nvm use

If you do not have the required version installed, run:

$ nvm install
$ nvm use

This project expects contributors to use the same Node.js version as CI. The supported runtime
versions are defined in the repository configuration, such as `.nvmrc` and the `engines` field in
`package.json`.

### Installing Yarn

This project uses [Yarn](https://yarnpkg.com/) for dependency management.

Please use the Yarn version defined by the project configuration. You can verify your local Yarn
version with:

$ yarn --version

The expected Yarn version is defined in the `engines` field in `package.json`.

### Installing dependencies

Once in the project's root directory, run the following command to install the project's
dependencies:

$ yarn install

After installing the dependencies, the project is ready to be run.

### Running the web app

Inspect the `package.json` file and look for the `scripts` section.
It contains the list of available scripts that can be run.

### Running the test suite

Run all available tests with:

$ yarn run test

When you open a Pull Request, the GitHub CI will run any available test suites for you.

> **INFO**
> Some tests are run automatically when you open a Pull Request, while others are run when a
> maintainer approves the Pull Request. This is for security reasons, as some tests require access
> to secrets.

### Open a Pull Request

✅ Now you're ready to contribute!