var express = require("express"); // If passed string doesn't have ./ node will look in the modules
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));

app.listen(app.get('port'), function(){
    console.log("server is listening on http://localhost:" + app.get('port'));
});

app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});