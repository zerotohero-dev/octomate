#!/usr/bin/env bash

cd "$(dirname "$0")"

OCTOMATE='../bin/octomate.js'

${OCTOMATE} "git@github.com:jsbites/octomate.git"
