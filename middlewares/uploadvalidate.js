

var validator = function(req,res,next){

    req.checkBody('item_id').notEmpty().withMessage('Item id must be filled'),
    req.checkBody('file').notEmpty().withMessage('File must be filled'),

    req.asyncValidationErrors().then(function() {
        next();
    }).catch(function(errors) {
        req.flash('errors',errors);
        res.status(500).redirect('back');
    });

}

module.exports = {
    validator
}