import { query } from "../../lib/db";

export default async function handler(req, res) {
    const tokenid = req.body.tokenid;
    const price = req.body.price;
    const coupon = req.body.coupon;
  try{
    const sql = "UPDATE nfts SET price = ?, coupon = ? WHERE tokenid = ?"
    const values = [price, coupon, tokenid]
    const data = await query({
      query: sql,
      values: values
    })
    res.status(200).json({message: "Update price successful"})
  }catch(e){
    res.status(500).json({message: e.message})
  }
}
