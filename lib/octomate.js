/*
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

import { join } from 'path';
import remove from 'remove';
import mkdirp from 'mkdirp';
import parse from 'minimist';
import { spawn } from 'child_process';
import { log, info, error } from './log';
import { readFile } from 'fs';

const TEMP_DIR = join( __dirname, 'sources' );
const PACKAGE_NAME_REG_EXP = /\/([^/]*)\.git/;

const prepareWorkspace = () => new Promise(
    ( resolve ) =>
        remove( TEMP_DIR, () => mkdirp( TEMP_DIR, () => resolve( true ) ) )
);

const prepareCommands = () => new Promise( ( resolve, reject ) => {
    const url = parse( process.argv.slice( 2 ) )._[ 0 ] || '';

    if ( !url ) {
        reject( { reason: 'Please provide a git url.' } );

        return;
    }

    resolve( { url } );
} );

const cloneTheMasterBranch = ( { url } ) => new Promise( (resolve, reject ) => {
    const command = spawn( 'git', [ 'clone', url ], { cwd: TEMP_DIR } );

    command.stdout.on( 'data', ( data ) => ( data ) => info( `${data}` ) );
    command.stderr.on( 'data', ( data ) => ( data ) => info( `${data}` ) );

    command.on( 'close', ( code ) => {
        if ( code === 0 ) {
            log( `Successfully cloned “${url}” into “${TEMP_DIR}”.` );

            resolve( { url } );

            return;
        }

        reject( { code, reason: 'Failed to clone the repository.' } );
    } );
} );

const getPackageVersion = ( { url } ) => new Promise( (resolve, reject ) => {
    const packageName = url.match( PACKAGE_NAME_REG_EXP )[ 1 ];

    if ( !packageName ) {
        error( `Cannot find the package name for “${url}”. Exiting.` );

        reject( { reason: 'Package name not found.' } );

        return;
    }

    const packageFilePath = join( TEMP_DIR, packageName, 'package.json' );

    readFile( packageFilePath, { encoding: 'utf8' }, ( err, data ) => {
        if ( err ) {
            error( `Cannot read the file at “${packageFilePath}”. Exiting.` );

            reject( { error: err, reason: 'Cannot read the package file.' } );

            return;
        }

        const { version, name } = JSON.parse( data );

        resolve( { version, name } );
    } );
} );

const compareLocalVersionAgainstNpmVersion = (
    { version: localVersion, name }
) => new Promise( ( resolve, reject ) => {
    const buffer = [];

    const command = spawn( 'npm', [ 'info', name, '--json' ] );

    command.stdout.on( 'data', ( data ) => buffer.push( data ) );

    command.on( 'close', ( code ) => {
        if ( code !== 0 ) {
            reject( { code, reason: 'Failed to execute `npm info`.' } );

            return;
        }

        const details = JSON.parse( buffer.join( '' ) );
        const latestVersion = details.versions.pop();

        if ( localVersion === latestVersion ) {
            log( 'NPM is up-to-date. Skipping the remainder of the tasks.' );

            resolve( { name, skip: true } );

            return;
        }

        resolve( { name, skip: false } );
    } );
} );

const executeNpmCommand = ( commandName, name, resolve, reject, skip ) => {
    if ( skip ) {
        log( `Skipped: \`npm ${commandName}\` for “${name}”.` );

        resolve( { name, skip } );

        return;
    }

    const command = spawn( 'npm', [ commandName ], { cwd: join( TEMP_DIR, name) } );

    switch( commandName ) {
    case 'install':
        log( `Will install “${name}”. This might take a while…` );

        break;
    case 'test':
        log( `Will test “${name}”. This might take a while…` );

        break;
    default:
        log( `Executing \`npm ${commandName}\` for ${name}.` );

        break;
    }

    [ command.stdout, command.stderr ]
        .map( ( stream ) => stream.on( 'data', ( data ) => info( `${data}` ) ) );

    command.on( 'close', ( code ) => {
        log( `\`npm ${commandName}\` closed with code “${code}”.` );

        if ( code === 0 ) {
            resolve( { name, skip } );

            return;
        }

        log( 'Stopping further actions.' );

        reject( { code, reason: 'NPM command failed.' } );
    } );
};

const installModule = ( { name, skip } ) => new Promise( (resolve, reject ) =>
    executeNpmCommand( 'install', name, resolve, reject, skip )
);

const testModule = ( { name, skip } ) => new Promise( (resolve, reject ) =>
    executeNpmCommand( 'test', name, resolve, reject, skip )
);

const publishModule = ( { name, skip } ) => new Promise( (resolve, reject ) =>
    executeNpmCommand( 'publish', name, resolve, reject, skip )
);

prepareWorkspace()
    .then( prepareCommands )
    .then( cloneTheMasterBranch )
    .then( getPackageVersion )
    .then( compareLocalVersionAgainstNpmVersion )
    .then( installModule )
    .then( testModule )
    .then( publishModule )
    .then(
        ( { name } ) => log( `Successfully executed all tasks for “${name}”.` ),
        ( err ) => {
            console.log( err );
            throw new Error( { reason: `Failed to execute one or more tasks for “${name}”!` }
        ) }
    );
