import { Schema, model} from 'mongoose';

export interface IAffiliate {
  affiliate: string;
  indication: string;
  transaction: number;
  share: number;
}

const affiliateSchema = new Schema<IAffiliate>({
  affiliate: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  indication: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  transaction: {
    type: Number
  },
  share: {
    type: Number
  }
}, {
  timestamps: true
})

const Affiliate = model('Affiliate', affiliateSchema)

export default Affiliate