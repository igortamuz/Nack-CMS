import { Schema, model} from 'mongoose';

export interface ISlot {
  _id: string;
  slots: number[];
  raffle: string;
  order: string;
  owner: string;
  expireAt: Date;
}

enum Status {
  reserved = "reserved",
  owned = "owned"
}

const slotSchema = new Schema<ISlot>({
  slots: [
    {type: Number}
  ],
  status: {
    type: String,
    enum: Status,
    default: Status.reserved
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  raffle: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Raffle'
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    expires: "72h"
  }
}, {
  timestamps: true
})

const Slot = model('Slot', slotSchema)

export default Slot