import { Client } from "pg";

const pgclient = new Client(process.env.DATABASE_URL);
let connected = false;

// (async () => {
//   await client.connect();
//   try {
//     console.log("Connection with PG established")
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     client.end();
//   }
// })();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (): Promise<Client> => {
  if (connected) return pgclient;
  return new Promise((res, rej) => pgclient.connect().then(r => (connected = true, res(pgclient))).catch(rej));
}

export async function WithClient<T>(cb: (c: Client) => Promise<T>): Promise<T> {
  if (connected) return cb(pgclient)

  return new Promise((res, rej) => pgclient.connect().then(r => (connected = true, res(cb(pgclient)))).catch(rej));
} 
