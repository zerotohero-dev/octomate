/*
 *          __,-“”-.__
 *     |\  / ,-.  ,-. \  /|
 *     )o)( ( o )( o ) )(o(
 *    /o/ |  `-'  `-'  | \o\
 *    \ \/   OctOmate   \/ /
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * This project is a part of the “Byte-Sized JavaScript” videocast.
 *
 * You can watch “Byte-Sized JavaScript” at: < https://bit.ly/bytesized >
 *
 * MIT Licensed — See LICENSE.md
 *
 * Send your comments, suggestions, and feedback to <me@volkan.io>.
 */

const log = ( ...stuff ) => console.log( `\n ● ${stuff}\n` );
const info = ( ...stuff ) => console.info( ...stuff );
const error = ( ...stuff ) => console.error( `\n ● ${stuff}\n` );

export { log, info, error };
