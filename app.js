var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let items = [
    {id:1, nom:'nombre'},
    {id:2, nom:'nombre2'},
    {id:3, nom:'nombre3'},
]


// API
app.get('/api/items', (req, res) => {
    res.status(200).send(items)
});

app.delete('/api/items/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    let foundIndex = -1
    for (let i = 0; i < items.length ; i++) {
        if (items[i].id == id){
            foundIndex = i
            break;
        }
    }
    if (foundIndex == -1){ // si no encontrado
        res.status(404).send('not found')
    }else {
        items.splice(foundIndex,1)
        res.status(204).send()
    }
})



app.post('/api/items',(req, res)=>{
    let params = req.body
    params.id = items.length +1
    items.push(params) // DB.insert(...)
    res.status(201).json(params)
})

// WEB
app.get('/', (req, res) => {
    res.render('index',{title:'WEB DE ITEMS'})
});
app.get('/items', (req, res) => {
    res.render('items',
        {
            title:'ITEMS',
            items:items    }
    )
})


// ITEMS DETAIL ////////////////
app.get('/api/items/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    console.log(typeof (id))

    let item = null
    for (let i = 0; i < items.length  ; i++) {
        if (items[i].id == id){
            item = items[i]
            break
        }
    }

    if (!item){
        res.status(404).json(' Item ' + id + ' not found')
    }else{
        res.status(200).json(item)
    }

});

// INSERT ITEM ////////////////
app.get('/items/insert', (req,res)=>{
    res.render('insert_item',
        {title:'insert item'}
    )
});

app.post('/items',(req, res)=>{
    const params = req.body
    params.id = items.length +1
    items.push(params) // DB.insert(...)
    res.redirect('/items')
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
