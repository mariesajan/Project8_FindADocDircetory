var express = require('express');
var cassandra = require('cassandra-driver');

var router = express.Router();


var client = new cassandra.Client({
    contactPoints: ['127.0.0.1']
});

client.connect(function(err) {
    console.log('Cassandra connected');
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'FindADoc'
    });
});

router.post('/find_doc', function(req, res, next) {
    if(req.body.state == ''){ // if no state selected from the drop down, all the doctor details should be retreived
      var query = " SELECT * FROM FINDADOC.DOCTORS";

      client.execute(query, function(err, results) {
          if (err) {
              console.log('error in query');
              console.log(err);
          } else {
              res.render('browse_docs', {
                  doctors: results.rows
              });
          }
      });
    }else{
        var query = " SELECT * FROM FINDADOC.DOCTORS WHERE STATE=? ";

            client.execute(query, [req.body.state], function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('browse_docs', {
                        doctors: results.rows
                    });
                }
            });
    }

});

module.exports = router;
