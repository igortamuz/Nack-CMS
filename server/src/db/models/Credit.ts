import { Schema, model} from 'mongoose';

export interface ICredit {
  preferenceId: string;
  paymentTotal: number;
  paymentId: string;
  status: string;
  user: string;
  txid: string;
}

const creditSchema = new Schema<ICredit>({
  preferenceId: String,
  paymentTotal: Number,
  paymentId: String,
  txid: String,
  status: {
    type: String,
    default: 'waiting'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  receipt: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }
}, {
  timestamps: true
})

const Credit = model('Credit', creditSchema)

export default Credit