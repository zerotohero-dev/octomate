[![tests][tests]][tests-url]
[![deps][deps]][deps-url]

[tests]: https://img.shields.io/travis/jsbites/octomate.svg
[tests-url]: https://travis-ci.org/jsbites/octomate
[deps]: https://david-dm.org/jsbites/octomate.svg
[deps-url]: https://david-dm.org/jsbites/octomate

```
        __,-“”-.__
   |\  / ,-.  ,-. \  /|
   )o)( ( o )( o ) )(o(
  /o/ |  `-'  `-'  | \o\
  \ \/   OctOmate   \/ /
~ ~~~~~~~~~~~~~~~~~~~~~~ ~
```

`octomate`: Automation made easy.

`octomate` compares the npm version of a given library to its git version. If there is a mismatch, it runs tests against the current git version and publishes the library to npm after the tests pass. — It is kind of like poor man’s CI.

## About `octomate`

`octomate` is created as an automation-helper:

It checks your libary’s NPM version and if your git version is ahead of the NPM version, then it runs a series of actions on your libary and if all those actions complete successfully, it publishes your library to NPM, synchronizing your NPM and git versions.

Note that there are other tools (*like git commit hooks, CI/CD environments, task runners*) that can give more flexibility than `octomate`. — At its current state, `octomate` is just a thought experiment.

### Installation

Install `octomate` via NPM:

```bash
npm install octomate -g
```

Note that you might need a recent version of Node.JS (*v.7.0.0. and above is preferred*).

## Usage Examples

I’ve covered a particular usage examples in the [“automate all the thingz” videocast here](https://www.youtube.com/watch?v=OZ_9czIl-iQ).

`octomate` is a command line application, it accepts a single argument which is a a git repository URL.

```bash
octomate "git@github.com:jsbites/badem.git"
```

Replace `"git@github.com:jsbites/badem.git"` with your repository’s SSH url. Given that you have configured your local npm, the above code will…

* Create a sandbox folder.
* Clone the repository into that sandbox folder.
* Compare the repository’s NPM version to the version in its `package.json`
* If versions match it will do nothing and exit; otherwise it’ll proceed with the next steps:
* Run `npm install`.
* If `npm install` succeeds, run `npm test`.
* If `npm test` succeeds, run `npm publish`.

respectively.

Note that you repository should have predefined `install`, `test`, and `publish` tasks registered in the `scripts` section of your `package.json`.

## Dependencies

You will need the **current** version of [Node.JS](https://nodejs.org/) with all the bells and whistles — [You can install it from nodejs.org](https://nodejs.org/).

## How to Develop

For development, you’ll need to first clone or for this repository, and then install the dependencies and transpile the code as follows:

```bash
cd octomate
npm install
./bin/transpile.sh
```

> Note that there is no watcher task, you you’ll have to run `.bin/transpile.sh` whenever you change the source code.

## Important Files and Folders

* `./lib`: The source files live here. `lib/octomate.js` is where the majority of the action takes place.
* `./release`: Once you run `./bin/.transpile.sh`, the transpiled files will be copied here..
* `./bin`: Shell scripts. — `./bin/octomate.js` is the pakcage main script; `./bin/transiple.sh` transpiles files.
* `./CHANGELOG.md`: A log of what has been done since the last version.
* `./CODE_OF_CONDUCT.md`: Tells the collaborators to be nice to each other.
* `./README.md`: This very file.
* `./.babelrc`: Used for development; configures `babel`.
* `./.eslintrc`: Used for development; configures `eslint`.

## Wanna Help?

Any help is more than appreciated.

If you want to contribute to the source code, **fork this repository** and **create a pull request**.

> In lieu of a formal style guide, take care to maintain the existing coding style.

Also, don’t forget to add unit tests for any new or changed functionality.

If you want to report a bug; or share a comment or suggestion, [either email me](mailto:me@volkan.io), or [file an issue](https://github.com/jsbites/octomate/issues/new).

## I’ve Found a Bug; I Have an Idea

[For bug reports and suggestions, please file an issue](https://github.com/jsbites/octomate/issues/new).

## Contact Information

* **Project Maintainer**: [Volkan Özçelik](https://volkan.io/)
* **Project Website**: [bytesized.tv](https://bytesized.tv/)

## License

MIT-licensed. — [See the license file  for details](LICENSE.md).

## Code of Conduct

We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

[See the code of conduct for details](CODE_OF_CONDUCT.md).

## A [ByteSized.TV][vidcast] Project

This repository is a part of the [Byte-Sized JavaScript VideoCasts][vidcast].

It is a compilation of short (*around ten minutes*) screencasts about **JavaScript** and related technologies.

[**Learn**, **explore**, and **have fun**][vidcast]!
