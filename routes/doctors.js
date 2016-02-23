var express = require('express');
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser');
var app = express();

var router = express.Router();
var client = new cassandra.Client({
    contactPoints: ['127.0.0.1']
});

client.connect(function(err) {

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/add_doc', function(req, res, next) {
    var doc_id = cassandra.types.uuid();
    var newPatientBoolean = (req.body.newPatients === "true"); // to convert the newPatient string value to boolean
    var query =
        "INSERT INTO FINDADOC.DOCTORS (doc_id, full_name, category, city, state,graduation_year, new_patients, practice_name, street_address, zip) VALUES (?,?,?,?,?,?,?,?,?,?)";
    client.execute(query, [doc_id, req.body.fullName, req.body.category,
        req.body.city, req.body.state, req.body.graduationYear,
        newPatientBoolean, req.body.practiceName, req.body.streetAddress,
        req.body.zipCode
    ], {
        prepare: true
    }, function(err, results) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        } else {
            req.flash('info', 'Doctor added');
            res.redirect('/');
        }
    });
});



router.delete('/delete/:doc_id', function(req, res, next) {
    var query = "DELETE FROM FINDADOC.DOCTORS WHERE DOC_ID=?";
    client.execute(query, [req.params.doc_id], function(err) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }
    });
});

router.post('/edit_doctor_details',function(req,res,next){
  var newPatientBoolean = (req.body.newPatients === "true");
  var query =
      "UPDATE FINDADOC.DOCTORS SET practice_name=?,street_address=?,zip=?,new_patients=?,graduation_year=? WHERE doc_id=? and category =? and state =? and full_name =? and city=? ";
  client.execute(query, [req.body.practiceName, req.body.streetAddress,
          req.body.zipCode, newPatientBoolean, req.body.graduationYear,
          req.body.docId, req.body.category, req.body.state, req.body.fullName,
          req.body.city
      ], {
          prepare: true
      },
      function(err, results) {
          if (err) {
              res.status(404).send({
                  msg: err
              });
          } else {
            res.send('Success');
          }
      });
});

router.get('/edit/:doc_id', function(req, res, next) {
    var query = "SELECT * FROM FINDADOC.DOCTORS WHERE DOC_ID=?";
    client.execute(query, [req.params.doc_id], function(err, results) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        } else {
            res.render('edit_doc', {
                doctor: results.rows[0]
            });
        }
    });
});

router.get('/browseDoctors', function(req, res, next) {
    var query = "SELECT * FROM FINDADOC.DOCTORS";
    client.execute(query, [], function(err, results) {
        if (err)
            res.status(404).send({
                msg: err
            });
        else {
            res.render('browse_docs', {
                doctors: results.rows
            });
        }
    });
});


router.get('/browseDocDetails/:docid', function(req, res, next) {
    var query = "SELECT * FROM FINDADOC.DOCTORS WHERE DOC_ID=?";
    client.execute(query, [req.params.docid], function(err, results) {
        if (err)
            res.status(404).send({
                msg: err
            });
        else {
            res.render('browse_docs_details', {
                doctor: results.rows['0']
            });
        }
    });
});

router.get('/addDoctors', function(req, res, next) {
    var query = "SELECT * FROM FINDADOC.CATEGORIES";
    client.execute(query, [], function(err, results) {
        if (err)
            res.status(404).send({
                msg: err
            });
        else {
            res.render('add_doc', {
                categories: results.rows
            });
        }
    });
});

module.exports = router;
