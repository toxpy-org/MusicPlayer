import { config } from "dotenv";
config();

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { WithClient as WithClient } from '../../music/pgclient';

type Data = {
  data: Array<{ id: string, title: string, sources: SourceType }>
}

type SourceType = { id: string, audio: string, cover: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let queryMusic = await WithClient((client) => client.query("SELECT * FROM Music"))
  let querySource = await WithClient((client) => client.query("SELECT * FROM Source"))

  const musicData: Array<{ id: string, title: string }> = queryMusic.rows as any;
  const sourceData: Array<SourceType> = querySource.rows as any;

  const mapSourceId: Record<number, any> = {};
  sourceData.map((data) => mapSourceId[Number(data.id)] = data);

  const data: Data['data'] = musicData.map((data) => ({
    ...data,
    sources: mapSourceId[Number(data.id)]
  }));

  res.status(200).json({ data })
}
