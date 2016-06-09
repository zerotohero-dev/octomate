'use strict';

var _path = require('path');

var _remove = require('remove');

var _remove2 = _interopRequireDefault(_remove);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _child_process = require('child_process');

var _log = require('./log');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEMP_DIR = (0, _path.join)(__dirname, 'sources'); /*
                                                       *          __,-“”-.__
                                                       *     |\  / ,-.  ,-. \  /|
                                                       *     )o)( ( o )( o ) )(o(
                                                       *    /o/ |  `-'  `-'  | \o\
                                                       *    \ \/   OctOmate   \/ /
                                                       *  ~ ~~~~~~~~~~~~~~~~~~~~~~ ~
                                                       *
                                                       * This project is a part of the “Byte-Sized JavaScript” videocast.
                                                       *
                                                       * You can watch “Byte-Sized JavaScript” at: < https://bit.ly/bytesized >
                                                       *
                                                       * MIT Licensed — See LICENSE.md
                                                       *
                                                       * Send your comments, suggestions, and feedback to <me@volkan.io>.
                                                       */

var PACKAGE_NAME_REG_EXP = /\/([^/]*)\.git/;

var prepareWorkspace = function prepareWorkspace() {
    return new Promise(function (resolve) {
        return (0, _remove2.default)(TEMP_DIR, function () {
            return (0, _mkdirp2.default)(TEMP_DIR, function () {
                return resolve(true);
            });
        });
    });
};

var prepareCommands = function prepareCommands() {
    return new Promise(function (resolve, reject) {
        var url = (0, _minimist2.default)(process.argv.slice(2))._[0] || '';

        if (!url) {
            reject({ reason: 'Please provide a git url.' });

            return;
        }

        resolve({ url: url });
    });
};

var cloneTheMasterBranch = function cloneTheMasterBranch(_ref) {
    var url = _ref.url;
    return new Promise(function (resolve, reject) {
        var command = (0, _child_process.spawn)('git', ['clone', url], { cwd: TEMP_DIR });

        command.stdout.on('data', function (data) {
            return function (data) {
                return (0, _log.info)('' + data);
            };
        });
        command.stderr.on('data', function (data) {
            return function (data) {
                return (0, _log.info)('' + data);
            };
        });

        command.on('close', function (code) {
            if (code === 0) {
                (0, _log.log)('Successfully cloned “' + url + '” into “' + TEMP_DIR + '”.');

                resolve({ url: url });

                return;
            }

            reject({ code: code, reason: 'Failed to clone the repository.' });
        });
    });
};

var getPackageVersion = function getPackageVersion(_ref2) {
    var url = _ref2.url;
    return new Promise(function (resolve, reject) {
        var packageName = url.match(PACKAGE_NAME_REG_EXP)[1];

        if (!packageName) {
            (0, _log.error)('Cannot find the package name for “' + url + '”. Exiting.');

            reject({ reason: 'Package name not found.' });

            return;
        }

        var packageFilePath = (0, _path.join)(TEMP_DIR, packageName, 'package.json');

        (0, _fs.readFile)(packageFilePath, { encoding: 'utf8' }, function (err, data) {
            if (err) {
                (0, _log.error)('Cannot read the file at “' + packageFilePath + '”. Exiting.');

                reject({ error: err, reason: 'Cannot read the package file.' });

                return;
            }

            var _JSON$parse = JSON.parse(data);

            var version = _JSON$parse.version;
            var name = _JSON$parse.name;


            resolve({ version: version, name: name });
        });
    });
};

var compareLocalVersionAgainstNpmVersion = function compareLocalVersionAgainstNpmVersion(_ref3) {
    var localVersion = _ref3.version;
    var name = _ref3.name;
    return new Promise(function (resolve, reject) {
        var buffer = [];

        var command = (0, _child_process.spawn)('npm', ['info', name, '--json']);

        command.stdout.on('data', function (data) {
            return buffer.push(data);
        });

        command.on('close', function (code) {
            if (code !== 0) {
                reject({ code: code, reason: 'Failed to execute `npm info`.' });

                return;
            }

            var details = JSON.parse(buffer.join(''));
            var latestVersion = details.versions.pop();

            if (localVersion === latestVersion) {
                (0, _log.log)('NPM is up-to-date. Skipping the remainder of the tasks.');

                resolve({ name: name, skip: true });

                return;
            }

            resolve({ name: name, skip: false });
        });
    });
};

var executeNpmCommand = function executeNpmCommand(commandName, name, resolve, reject, skip) {
    if (skip) {
        (0, _log.log)('Skipped: `npm ' + commandName + '` for “' + name + '”.');

        resolve({ name: name, skip: skip });

        return;
    }

    var command = (0, _child_process.spawn)('npm', [commandName], { cwd: (0, _path.join)(TEMP_DIR, name) });

    switch (commandName) {
        case 'install':
            (0, _log.log)('Will install “' + name + '”. This might take a while…');

            break;
        case 'test':
            (0, _log.log)('Will test “' + name + '”. This might take a while…');

            break;
        default:
            (0, _log.log)('Executing `npm ' + commandName + '` for ' + name + '.');

            break;
    }

    [command.stdout, command.stderr].map(function (stream) {
        return stream.on('data', function (data) {
            return (0, _log.info)('' + data);
        });
    });

    command.on('close', function (code) {
        (0, _log.log)('`npm ' + commandName + '` closed with code “' + code + '”.');

        if (code === 0) {
            resolve({ name: name, skip: skip });

            return;
        }

        (0, _log.log)('Stopping further actions.');

        reject({ code: code, reason: 'NPM command failed.' });
    });
};

var installModule = function installModule(_ref4) {
    var name = _ref4.name;
    var skip = _ref4.skip;
    return new Promise(function (resolve, reject) {
        return executeNpmCommand('install', name, resolve, reject, skip);
    });
};

var testModule = function testModule(_ref5) {
    var name = _ref5.name;
    var skip = _ref5.skip;
    return new Promise(function (resolve, reject) {
        return executeNpmCommand('test', name, resolve, reject, skip);
    });
};

var publishModule = function publishModule(_ref6) {
    var name = _ref6.name;
    var skip = _ref6.skip;
    return new Promise(function (resolve, reject) {
        return executeNpmCommand('publish', name, resolve, reject, skip);
    });
};

prepareWorkspace().then(prepareCommands).then(cloneTheMasterBranch).then(getPackageVersion).then(compareLocalVersionAgainstNpmVersion).then(installModule).then(testModule).then(publishModule).then(function (_ref7) {
    var name = _ref7.name;
    return (0, _log.log)('Successfully executed all tasks for “' + name + '”.');
}, function (err) {
    console.log(err);
    throw new Error({ reason: 'Failed to execute one or more tasks for “' + name + '”!' });
});

//# sourceMappingURL=octomate.js.map