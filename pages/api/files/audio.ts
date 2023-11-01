import { supabase } from '../../../music/supabase';

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    let audioId = req.query.id;

    let audiosmeta = await supabase.storage.from("music").list("audios", {
        limit: 100,
        offset: 0,
    });

    let data: Array<any>;

    data = audiosmeta.data as any;

    if (!audiosmeta.data) return res.status(404).send({ "message": "no audios" })

    for (let i = 0; i < audiosmeta.data?.length; i++) {
        let audio = data![i];
        
        data[i]["contentUrl"] = (await supabase.storage.from("music").createSignedUrl(`audios/${audio.name}`, 86400)).data?.signedUrl;
    }   

    if (audioId == undefined) return res.status(200).send(data);

    let audiosMatch = data.filter(audio => audio.id == audioId);


    if (audiosMatch.length < 1) return res.status(404).send({ message: `${audioId} not found` });
    if (audiosMatch.length > 1) return res.status(500).send({ message: `${audioId} multiple found` });

    res.status(200).send(audiosMatch.pop());
}
