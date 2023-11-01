import { supabase } from '../../../music/supabase';

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<any>
) {
    let coversmeta = await supabase.storage.from("music").list("covers", {
        limit: 100,
        offset: 0,
    });

    let audiosmeta = await supabase.storage.from("music").list("audios", {
        limit: 100,
        offset: 0,
    });

    let data: any = {};

    data["covers"] = coversmeta.data;
    data["audios"] = audiosmeta.data;

    if (!coversmeta.data) return res.status(404).send({ "message": "no covers" });
    if (!audiosmeta.data) return res.status(404).send({ "message": "no audios" })

    for (let i = 0; i < coversmeta.data?.length; i++) {
        let cover = data["covers"]![i];
        data["covers"][i]["contentUrl"] = await supabase.storage.from("music").createSignedUrl(`covers/${cover.name}`, 86400);
    }

    for (let i = 0; i < audiosmeta.data?.length; i++) {
        let audio = data["audios"]![i];
        data["audios"][i]["contentUrl"] = await supabase.storage.from("music").createSignedUrl(`audios/${audio.name}`, 86400);
    }

    res.status(200).send(data);
}
