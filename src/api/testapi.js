console.log('Loading restify server...');

var _       = require('lodash');
var Promise = require("bluebird");
var restify = require('restify');
var redisServer   = require("redis");
var redis  = redisServer.createClient();
redis.on("error", function (err)
{
    console.error("Resis Error:", err);
});

var api     = restify.createServer({name: 'angular-1-starter-api'});

api.listen(2146, function () {
    console.log('%s listening at %s', api.name, api.url)
});

api.pre(restify.CORS({
    origins: ['*'],
    credentials: false,
    headers: ['X-Requested-With', 'Authorization']
}));
api.pre(restify.fullResponse());

api.use(restify.bodyParser());

api.get('/api/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});

api.get('/api/abouttext', function(req, res, next)
{
  if(redis.get("abouttext"))
  {
    res.send(200, {response: true, data: redis.get("abouttext")});
  }
  else
  {
    var fs = require('fs');
    fs.readFile(__dirname + '/about.txt', 'utf8', function(err, data) {
      if (err)
      {
        throw err;
        res.send(500, {response: false, error: err});
      }
      redis.set("abouttext", data, redis.print);
      res.send(200, {response: true, data: data});
    });
  }
});

module.exports = api;