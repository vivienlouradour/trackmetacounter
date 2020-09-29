const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.json');

const CountService = require('./Services/CountSerivce');

const port = process.env.PORT || config.api_port || 8080;

console.log('server.js started');

main()
  .then(console.log('main finished'))
  .catch(console.error);

async function main(){
  app.use(bodyParser.json());

  app.get('/:trackname', (req, res) => {
    console.log('trackname : ' + req.params.trackname);
    const trackname = req.params.trackname;
    // if(!trackname){
    //   res.sendStatus(400).json({ error : 'trackname must be provided'});
    // }
    CountService.countTracksByName(trackname).then(tracks => {
      res.send(tracks);
    });
  });


  app.listen(port, function () {
    console.log('Listening on http://localhost:' + port);
  });
}