var express = require('express');
var cassandra = require('cassandra-driver');


var router = express.Router();
var client = new cassandra.Client({
    contactPoints: ['127.0.0.1']
});

client.connect(function(err) {

});

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
    console.log('in router delete.....');
    var query = "DELETE FROM FINDADOC.DOCTORS WHERE DOC_ID=?";
    client.execute(query, [req.params.doc_id], function(err) {
        if (err) {
            console.log('error found');
            res.status(404).send({
                msg: err
            });
        } else {
            console.log('dleete successful');
            req.flash('info', 'Doctor deleted');
            res.redirect('/');
        }
    });
});



router.post('/edit_doc/:doc_id', function(req, res, next) {
  console.log('post of edit_doc...');
  console.log(req.body);
    var query =
        "UPDATE FINDADOC.DOCTORS SET practice_name=?,street_address=?,zip=?,new_patients=?,graduation_year=? WHERE doc_id=? and category =? and state =? and full_name =? and city=? ";
    client.execute(query, [req.body.practiceName, req.body.streetAddress,
            req.body.zipCode, req.body.newPatients, req.body.graduationYear,
            req.params.doc_id, req.body.category, req.body.state, req.body.fullName,
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
                req.flash('info', 'Details Edited');
                res.location('/');
                res.redirect('/');
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
  console.log('get of browseDoctors.....');
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
