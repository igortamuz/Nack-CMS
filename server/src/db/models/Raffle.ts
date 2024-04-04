import { Schema, model} from 'mongoose';

export interface IRaffle {
  title: string;
  raffled: string;
  prize: string;
  date: Date;
  secondPrize: string;
  thirdPrize: string;
  fourthPrize: string;
  numberOfSlots: number;
  ticketPrice: number;
  available: number;
  numberDrawn: number;
  drawDate: Date;
  quickRaffle: boolean;
  imagesRaffle: string[];
  image: string;
  winner: string;
  winnerSlot: string;
}

enum Done {
  raffled = 'raffled',
  unraffled = 'unraffled'
}

const raffleSchema = new Schema<IRaffle>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  numberOfSlots: {
    type: Number,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  secondPrize: String,
  thirdPrize: String,
  fourthPrize: String,
  ticketPrice: {
    type: Number,
    required: true
  },
  available: {
    type: Number
  },
  date: {
    type: Date
  },
  numberDrawn: {
    type: Number
  },
  drawDate: {
    type: Date
  },
  quickRaffle: {
    type: Boolean,
    default: false
  },
  raffled: {
    type: String,
    enum: Done,
    default: Done.unraffled
  },
  status: {
    type: Boolean,
    default: false
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  imagesRaffle: [{
      type: Schema.Types.ObjectId,
      ref: 'Image'
  }],
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  winnerSlot: {
    type: Schema.Types.ObjectId,
    ref: 'Slot'
  }
}, {
  timestamps: true
})

raffleSchema.set('toJSON', {virtuals: true})
raffleSchema.set('toObject', {virtuals: true})

raffleSchema.virtual('slots', {
  ref: 'Slot',
  localField: '_id',
  foreignField: 'raffle',
  justOne: false
});

raffleSchema.methods.toJSON = function(){
  const raffle = this
  const raffleObject = raffle.toObject()

  delete raffleObject.__v

  return raffleObject
}

const Raffle = model('Raffle', raffleSchema)

export default Raffle