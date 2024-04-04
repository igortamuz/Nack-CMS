import Affiliate from "db/models/Affiliate";
import User from "db/models/User";
import { Handler } from "routers/types";

export const getExtract: Handler = async(req, res) => {
  try {
    const affiliate = await Affiliate.find({affiliate: req.user._id}).populate('indication', ['name', 'email'])
    res.status(200).send(affiliate)
  } catch (error) {
    res.status(204).send()
  }
}

export const getAffiliates: Handler = async(req, res) => {
  try {
    const users = await User.find({affiliatedTo: req.user._id}).select(['name', 'email'])
    res.status(200).send(users)
  } catch (error) {
    res.status(204).send()
  }
}