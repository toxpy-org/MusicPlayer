import { supabase } from '../../../music/supabase';

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    let audioId = req.query.id;

    let coversmeta = await supabase.storage.from("music").list("covers", {
        limit: 100,
        offset: 0,
    });

    let data: Array<any>;

    data = coversmeta.data as any;

    if (!coversmeta.data) return res.status(404).send({ "message": "no covers" })

    for (let i = 0; i < coversmeta.data?.length; i++) {
        let audio = data![i];
        
        data[i]["contentUrl"] = (await supabase.storage.from("music").createSignedUrl(`covers/${audio.name}`, 86400)).data?.signedUrl;
    }   

    if (audioId == undefined) return res.status(200).send(data);

    let coversMatch = data.filter(audio => audio.id == audioId);


    if (coversMatch.length < 1) return res.status(404).send({ message: `${audioId} not found` });
    if (coversMatch.length > 1) return res.status(500).send({ message: `${audioId} multiple found` });

    res.status(200).send(coversMatch.pop());
}
