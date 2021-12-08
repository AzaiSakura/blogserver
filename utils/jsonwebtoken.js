const JWT = require("jsonwebtoken");
const secret = 'kljskajdoewiioertiojreoitjoidjfgifdjg';
function createToken(Payload) {
    return JWT.sign(Payload, secret, {expiresIn: 43200}); //生成token    
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, secret, (err, data) => {
            if (err) {
                reject({
                    'code': 400,
                    'data': err
                })
            } else {
                resolve({
                    'code': 200,
                    'data': data
                })
            }
        })
    })
}

module.exports = {
    createToken,
    verifyToken
}