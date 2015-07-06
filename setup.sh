#!/bin/bash

# delete temporary files
rm -rf node_modules public

# install npm dev dependencies
npm install

# install bower dependencies
bower install

# build and serve
gulp
