import fs from 'fs'

import Slot from "db/models/Slot";
import Raffle from "db/models/Raffle";
import User from "db/models/User";
import { ObjectId } from "mongodb";
import { Handler } from "routers/types";
import {parse} from "json2csv"
import path from 'path/posix';

export const reportByUserRaffle: Handler = async(req, res) => {
  try {
    const records = await Slot.aggregate([
      {
        $match: {raffle: new ObjectId(req.params.raffleId)}
      }, {
        $group: {
          _id: "$owner",
          count: {$sum: 1}
        }
      }
    ])
    if (records.length === 0) throw new Error()
    
    const report: any[] = []
    const raffle = await Raffle.findById(req.params.raffleId).select('title')
    for (let item of records){
      const user = await User.findById(item._id).select(['name', 'email', 'phone'])
      report.push({sorteio: raffle.title, nome: user.name, email: user.email, telefone: user.phone, quantidade: item.count})
    }
    
    if (report.length === 0) throw new Error()

    const csv = parse(report)

    fs.writeFile('./public/reports/report.csv', csv, () => {})
    
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3005/static/reports/report.csv' : 
      "https://gosorte.com/static/reports/report.csv"
  
    res.send(url)
  } catch (error) {
    res.status(400).send('Erro!')
    console.log(error)
  }
}