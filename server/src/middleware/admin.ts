import {Response, NextFunction} from 'express'
import {IAuthUserRequest} from 'routers/types'

const isAdmin = async (req: IAuthUserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'admin'){
      throw new Error("Permissões insuficientes")
    }
    next()
  } catch (error) {
    res.status(403).send("Permissões insuficientes")
  }  
}

export default isAdmin