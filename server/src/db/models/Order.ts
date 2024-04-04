import { Schema, model} from 'mongoose';

export interface IOrder {
  order: string;
  ammount: number;
  user: string;
  slot: string;
  fulfilled: boolean;
  preferenceId: string;
  paymentTotal: number;
  paymentId: string;
  paymentType: string;
  expireAt: Date;
}

// enum OrderStatusEnum {
//   approved = 'approved',
//   failed = 'failed',
//   rejected = 'rejected'
// }

const orderSchema = new Schema<IOrder>({
  paymentTotal: {
    type: Number,
    required: true
  },
  preferenceId: {
    type: String
  },
  txid: {
    type: String
  },
  status: {
    type: String,
    default: 'waiting'
  },
  deadline: {
    type: Date
  },
  paymentType: String,
  paymentId: String,
  receipt: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  slot: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Slot'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    expires: '72h'
  }
}, {
  timestamps: true
})

const Order = model('Order', orderSchema)

export default Order