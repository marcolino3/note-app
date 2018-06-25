class FrontendService {
    constructor(app, __dirname) {
        app.get("/", function(req, res){
            res.sendFile("index.html",  {root: __dirname + '/frontend/'});
        });
    }

}

export default FrontendService;