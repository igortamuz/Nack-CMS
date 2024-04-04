import {Response, NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from 'db/models/User'
import {IAuthUserRequest} from 'routers/types'

interface IJwtPayload extends JwtPayload {
  _id: string;
}

const auth = async (req: IAuthUserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = <IJwtPayload>jwt.verify(token, process.env.JWT)
    const user = await User.findOne({_id: decoded._id, 'tokens': token})

    if (!user){
        throw new Error()
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({error: 'Please authenticate'})
  }
}

export default auth