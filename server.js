var restify = require('restify');
var server = restify.createServer();

server.get('/root/:id', function(req, res, next){
    var id = req.params.id;
    res.end("OK" + id);
})

server.post('/root', function(req, res, next){
    res.end("ok" + req.params.);
})

server.listen(8000, function(){
    console.log("Hello");
});
