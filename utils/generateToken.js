import jwt from 'jsonwebtoken'
const JWT_SECRET= '1235'
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        
    })
}

export default generateToken 