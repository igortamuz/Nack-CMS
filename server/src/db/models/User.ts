import { Schema, model, Model, Document} from 'mongoose';
import bcrypt from 'bcryptjs'
import Slot from './Slot';
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: string
  phone: string,
  street: string,
  cep: string,
  number: string,
  neighborhood: string,
  complement: string,
  state: string,
  city: string,
  reference: string,
  tokens: string[]
  indications: string[];
  affiliatedTo: string;
  balance: number;
  recovery: string;
  avatar?: string;
  generateAuthToken(): Promise<string>
  generateRecoveryLink(): Promise<string>
}

interface IUserModel extends Model<IUser>{
  findByCredentials(email: string, password: string): Promise<IUser>
  findAndVerifyRecoveryLink(recovery: string): Promise<IUser>
}

enum UserRole {
  admin="admin",
  client="client"
}

const userSchema = new Schema<IUser, IUserModel>({
  name: String,
  email: {type: String, required: true, unique: true},
  password: {type: String},
  phone: String,
  street: String,
  cep: String,
  number: String,
  neighborhood: String,
  complement: String,
  state: String,
  city: String,
  reference: String,
  balance: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: UserRole.client
  },
  tokens: [
    {type: String, required: true}
  ],
  affiliatedTo: {
    type: String,
  },
  indications: [
    {type: String}
  ],
  recovery: {
    type: String
  },
  avatar: {
    type: String
  }
})

userSchema.methods.generateAuthToken = async function (){
  const user = this
  const token = jwt.sign({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  }, process.env.JWT)
  
  user.tokens = user.tokens.concat(token)
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
      throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch){
      throw new Error('Unable to login')
  }

  return user
}

userSchema.methods.generateRecoveryLink = async function() {
  const user = this
  const recovery = jwt.sign({
    id: user._id
  }, process.env.JWT, {expiresIn: '20m'})

  user.recovery = recovery
  await user.save()

  return recovery
}

interface IJwtPayload extends JwtPayload {
  id: string
}

userSchema.statics.findAndVerifyRecoveryLink = async (recovery: string) => {
  
  const decoded = <IJwtPayload>jwt.verify(recovery, process.env.JWT)
  
  const user = await User.findById(decoded.id)
  if (!user) throw new Error("Usuário não encontrado")
  
  return user
}

userSchema.methods.toJSON = function(){
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.__v

  return userObject
}

userSchema.virtual('slots', {
  ref: 'Slot',
  // What identifies them
  localField: '_id',
  // The field used
  foreignField: 'owner'
})

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.pre('remove', async function(next){
  const user = this
  await Slot.deleteMany({owner: user._id})
  next()
})

const User = model<IUser, IUserModel>('User', userSchema)

export default User