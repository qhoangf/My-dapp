import { query } from "../../lib/db";

export default async function handler(req, res) {
    const tokenid = req.body.tokenid
  try{
    const sql = "DELETE FROM nfts WHERE tokenid = ?"
    const values = [tokenid]
    const data = await query({
      query: sql,
      values: values
    })
    res.status(200).json({message: 'delete successful'})
  }catch(e){
    res.status(500).json({message: e.message})
  }
}