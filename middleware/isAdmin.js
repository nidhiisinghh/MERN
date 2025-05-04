const jwt = require('jsonwebtoken'); 

const tokenSecret = process.env.TOKEN_SECRET; 
module.exports = (req, res, next) => {
    console.log("req.headers", req.headers); 
    const token = req.headers["x-access-token"]; 
    if(!token) {
        res.status(403).json({message: "no toekn found."})
    }

    try {
        const decode = jwt.verify(token, tokenSecret); 
        req.userId = decode.userId; 
        let type = decode.type; 
        if(type != 1){
            return res.status(403).json({success: false,message: "You are not Authorized to access this resource"});
        }
        next(); 
    }

    catch(err){
        console.log("errors", err); 
        return res.status(401).json({success: false,message: "Token is expired or corrupt"});
    }
}