import { Schema, model} from 'mongoose';

export interface IImage {
  filename: string;
  path: string;
  originalName: string;
  raffle: string;
}

const imageSchema = new Schema<IImage>({
  filename: String,
  path: String,
  originalName: String,
  raffle: {
    type: Schema.Types.ObjectId,
    ref: 'Raffle',
    required: false
  }
}, {
  timestamps: true
})

const Image = model('Image', imageSchema)

export default Image