# Angular-1-Starter-Application
Basic starter application for Angular 1.4 to get you up and developing. Utilizes Gulp for DevOps build, Angular 1.3 for the client using ui-router for routing, mocha for unit testing, chai for assertions, Karma for test runner, Express for static file serving, Restify for REST API, Redis for server-side caching, and MongoDB for NoSQL database.

# Installation

1. checkout the code
2. cd to the directory
3. run `npm install && bower install` in your Terminal
4. [install](https://github.com/JesterXL/redis-basic) and start Redis in your Terminal `redis-server`
6. open a new terminal tab, then type `gulp`
7. type `node src/static/app.js`
7. navigate to `http://localhost:8553` in your browser

# Gulp Tasks

`gulp`

Deploys your app locally, starts the static & API server. Connect to `http://localhost:8628` to see it.

`gulp analyze`

Shows formatting, styling, and complexity (Halsted, Cyclomatic) in your code.

`gulp test`

Runs Karma unit tests and generates code coverage reports for both client and CI server.

`gulp testWhileICode`

Same as Karma, but runs in CI mode. When you save a file, it'll rerun all the unit tests wicked fast.

`gulp showCoverage`

Shows the code coverage report generated from `gulp test`.