import mysql from "mysql2/promise";
export async function query({ query, values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DB_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}
