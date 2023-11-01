import { config } from "dotenv";

import { StreamFile } from '../../../music/pcloud';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    // metadata: {
    //     covers: Array<TypeFilemeta>,
    //     audios: Array<TypeFilemeta>
    // }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (!req.query.fileid) return res.status(404).json({message: "No file id provided"})
    let data = await StreamFile(Number(req.query.fileid));
    res.json({data});
}
