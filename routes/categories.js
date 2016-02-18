var express = require('express');
var cassandra = require('cassandra-driver');

var router = express.Router();

var client = new cassandra.Client({
    contactPoints: ['127.0.0.1']
});

router.get('/category_docs/:cat_name', function(req, res, next) {
    var query =
        "SELECT * FROM findadoc.doctors WHERE category = ? ALLOW FILTERING";
    client.execute(query, [req.params.cat_name], function(err, results) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        } else {
            res.render('browse_docs', {
                doctors: results.rows
            });
        }
    });
});


router.get('/addCategory', function(req, res, next) {
    res.render('add_category');
});


router.post('/add_cat', function(req, res, next) {
    var cat_id = cassandra.types.uuid();
    var query =
        "INSERT INTO FINDADOC.CATEGORIES (cat_id,category_name) VALUES(?,?)";
    client.execute(query, [cat_id, req.body.categoryName], function(
        err, result) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        } else {
            req.flash('info', 'Category inserted');
            res.location('/');
            res.redirect('/');
        }
    });
});



module.exports = router;
