#!/usr/bin/env node

var debug = require('debug')('passport-mongo'),
    app = require('./app');


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

console.log("Running at Port 3000");