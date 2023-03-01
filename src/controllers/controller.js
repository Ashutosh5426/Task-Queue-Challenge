const redis = require('redis');
const kue = require('kue');
const axios = require('axios');
const validUrl = require('valid-url');

const client = redis.createClient();
const queue = kue.createQueue();

client.on('connect', function() {
  console.log('connected to Redis');
});

client.on('error', function (err) {
  console.log("Error " + err);
});

queue.on( 'error', function( err ) {
  console.log( 'Kue Error: ', err );
});

function createJob(myUrl, res) {
  try {
    var job = queue.create('request', myUrl).priority('high').removeOnComplete( true ).save( function(err) {
      if( !err ) {
        res.send("Your new id for the url is " + job.id);
        client.hset(job.id, 'data', 'none', redis.print);
      }
      else{
        res.send("There was an error importing your data");
      }
    });
  } catch (err) {
    res.send("There was an error creating the job");
  }
}

function requestStatus(id, res) {
  try {
    client.hget(id, 'data', function(err, obj) {
      if (err){
        res.send(err);
      }
      else if (obj == null){
        res.send("This key does not exist! Check your spelling or try a new key");
      }
      else if (obj == 'none'){
        res.send("This task is still running");
      }
      else{
        res.send(obj);
      }
    });
  } catch (err) {
    res.send("There was an error getting the request status");
  }
}

function processRequest(job, done) {
  axios.get(job.data)
    .then( function(response) {
      client.hset(job.id, 'data', response.data, redis.print);
      done();
    });
}

queue.process('request', 5, function(job, done) {
  processRequest(job, done);
});

function isValidUrl(url) {
  return validUrl.isHttpUri("http://" + url);
}

module.exports = {
  createJob,
  requestStatus,
  isValidUrl
};
