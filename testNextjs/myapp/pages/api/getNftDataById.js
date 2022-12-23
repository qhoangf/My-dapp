import { query } from "../../lib/db";

export default async function handler(req, res) {
  const tokenid = req.query.tokenid;
  try {
    const sql = "SELECT * FROM nfts WHERE tokenid = ?";
    const values = [tokenid];
    const data = await query({
      query: sql,
      values: values,
    });
    res.status(200).json({ data: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
