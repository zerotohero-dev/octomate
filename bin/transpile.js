#!/usr/bin/env node

/*
 *          __,-“”-.__
 *     |\  / ,-.  ,-. \  /|
 *     )o)( ( o )( o ) )(o(
 *    /o/ |  `-'  `-'  | \o\
 *    \ \/   OctOmate   \/ /
 * ~ ~~~~~~~~~~~~~~~~~~~~~~ ~
 *
 * This project is a part of the “Byte-Sized JavaScript” videocast.
 *
 * You can watch “Byte-Sized JavaScript” at: < https://bit.ly/bytesized >
 *
 * MIT Licensed — See LICENSE.md
 *
 * Send your comments, suggestions, and feedback to <me@volkan.io>.
 */

const babil = require( 'babil' );
const join = require( 'path' ).join;

babil.initialize( {
    rootPath: join( __dirname, '..' )
} ).then(
    babil.transpile,
    () => setTimeout( () => process.exit( 1 ), 500 )
);
