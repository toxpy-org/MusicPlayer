import { config } from "dotenv";

import { GetCoversMeta, GetAudiosMeta, TypeFilemeta } from '../../../music/pcloud';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    metadata: {
        covers: Array<TypeFilemeta>,
        audios: Array<TypeFilemeta>
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({
        metadata: {
            covers: await GetCoversMeta(),
            audios: await GetAudiosMeta()
        }
    })
}
