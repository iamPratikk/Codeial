module.exports.index = function(req,res){
    return res.status(200).json({
        message : 'List of Posts in v2',
        posts : []
    })
}