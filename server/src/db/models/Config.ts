import { Schema, model} from 'mongoose';

export interface IConfig {
  affiliateShare: string;
}

const configSchema = new Schema<IConfig>({
  affiliateShare: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Config = model('Config', configSchema)

export default Config