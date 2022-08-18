import {query} from "../../lib/db"

export default async function handler(req, res) {
    const tokenid = req.body.tokenid
    const owner = req.body.owner
    const name = req.body.name
    const image = req.body.image
    const price = req.body.price
    const contract_address = req.body.contract_address
    const coupon = req.body.coupon
    const typecoin = req.body.typecoin
    try{
        const sql = "INSERT INTO nfts (tokenid, owner, name, image, price, contract_address, coupon, typecoin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        const values = [tokenid, owner, name, image, price, contract_address,coupon, typecoin]
        const data = await query({
            query: sql,
            values: values
        })
        res.status(200).json({message: "List successful"}) 
    }catch(e){
        res.status(500).json({error: e.message})
    }

    
}