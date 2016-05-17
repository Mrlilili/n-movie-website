/**
 * Created by admin-b on 2016/5/13.
 * fas
 */
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie')
var port = process.env.PORT || 3000;
var app = express();
mongoose.connect('mongodb://localhost/imooc');
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);
app.locals.moment = require('moment')
console.log('started on  port' + port);
// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies
        })
    });

})
// detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.render('detail', {
                title: '详情',
                movies: movie
            })
        })
    }

})
// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '管理',
        movie: {
            _id: '',
            title: '',
            doctor: '',
            country: '',
            language: '',
            poster: '',
            flash: '',
            year: '',
            summary: ''
        }
    })
})
// admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.render('admin', {
                    title: '更新',
                    movie: movie[0]
                })
            }
        })
    }
})
// admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body._id
    var movieObj = req.body.movie
    var _movie;

    if (id != '') {

        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            console.log(movie);
            _movie = _.extend(movie[0], movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + _movie.id)
            })
        })
    } else {

        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + _movie.id)
        });
    }
});
// list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '列表页',
            movies: movies
        })
    })

})

//list delete movie

app.delete('/admin/list', function (req,res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                res.json({success: 1});
            }
        })
    }
})