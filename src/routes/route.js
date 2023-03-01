const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', function (req, res) {
  res.send('Massdrop Challenge: Create a request and view its status');
})

router.get('/status/:id', function (req, res) {
  controller.requestStatus(req.params['id'], res);
})

router.get('/create/:url', function (req, res) {
  if (controller.isValidUrl(req.params['url'])) {
    controller.createJob("http://" + req.params['url'], res);
  }
  else{
    res.send("Invalid URL. Please Input a valid URL");
  }
})

module.exports = router;
