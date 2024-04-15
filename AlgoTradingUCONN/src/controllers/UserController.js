exports.UserController={
    getUser:(req,res)=>{
        return res.send(req.params.id).status(200)
    },
    registerUser: (req,res) => {
        return res.send({user_registered:req.body.uer}).status(200)
    }
}