const express = require('express');
const app = express();
const route = require('./routes/route');

app.set('port', (process.env.PORT || 5000));

app.use('/', route);

app.listen(app.get('port'), function() {
  console.log('Server listening on port: ', app.get('port'));
});
