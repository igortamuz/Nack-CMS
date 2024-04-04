import ISlot from './ISlot'

export default interface IRaffle {
  _id: string;
  available?: number;
  createdAt?: Date;
  updatedAt?: Date;
  prize?: string;
  secondPrize?: string;
  thirdPrize?: string;
  fourthPrize?: string;
  id?: string;
  image?: string;
  imagesRaffle?: Array<string>;
  numberOfSlots?: number;
  pagos: number;
  reservados: number;
  quickRaffle?: boolean;
  raffled?: string;
  slots?: ISlot[];
  status: boolean;
  ticketPrice: number;
  title: string;
  winner: string;
}