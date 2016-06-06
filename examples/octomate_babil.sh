#!/usr/bin/env bash

#
#          __,-“”-.__
#     |\  / ,-.  ,-. \  /|
#     )o)( ( o )( o ) )(o(
#    /o/ |  `-'  `-'  | \o\
#    \ \/   OctOmate   \/ /
#  ~ ~~~~~~~~~~~~~~~~~~~~~~ ~
#
# This project is a part of the “Byte-Sized JavaScript” videocast.
#
# You can watch “Byte-Sized JavaScript” at: < https://bit.ly/bytesized >
#
# MIT Licensed — See LICENSE.md
#
# Send your comments, suggestions, and feedback to <me@volkan.io>.
#

cd "$(dirname "$0")"

OCTOMATE='../bin/octomate.js'

${OCTOMATE} "git@github.com:jsbites/babil.git"
