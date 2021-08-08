module.exports = {
    details: function(req, res, next) {
        console.log(req.isAuthenticated());
        if(req.isAuthenticated()) 
            return req.user;
    }
}