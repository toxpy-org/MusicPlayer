import axios from 'axios';

export type TypeFilemeta = {
    name: string,
    created: string,
    modified: string,
    id: string,
    size: number,
    contenttype: string,
}

export type TypeStream = {
    size: number,
    expires: Date,
    path: string,
    hosts: Array<string>
}

export const GetCoversMeta = async (): Promise<Array<TypeFilemeta>> => {
    let token = process.env.PCLOUD_TOKEN;

    let res = await axios.get("https://api.pcloud.com/listfolder?folderid=19317899103", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    let obj: any = Array.from(res.data.metadata.contents);

    obj = obj.map((file: any) => (
        (delete file['isshared'], delete file['thumb'],
            delete file['hash'], delete file['ismine'],
            delete file['parentfolderid'], delete file['icon'],
            delete file['modified'], delete file['comments'],
            delete file['category'], delete file['isfolder']),
        file));

    return obj;
}

export const GetAudiosMeta = async (): Promise<Array<TypeFilemeta>> => {
    let token = process.env.PCLOUD_TOKEN;

    let res = await axios.get("https://api.pcloud.com/listfolder?folderid=19317899757", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    let obj: any = Array.from(res.data.metadata.contents);

    obj = obj.map((file: any) => (
        (delete file['isshared'], delete file['thumb'],
            delete file['hash'], delete file['ismine'],
            delete file['parentfolderid'], delete file['icon'],
            delete file['modified'], delete file['comments'],
            delete file['category'], delete file['isfolder']),
        file));

    return obj;
}



export const StreamFile = async (fileid: number): Promise<TypeStream> => {
    let token = process.env.PCLOUD_TOKEN;

    let res = await axios.get(`https://api.pcloud.com/getfilelink?fileid=${fileid}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    let data: any = res.data;

    data["expires"] = new Date(data['expires']);

    data['links'] = data['hosts'].map((host: string) => 'https://' + host + data['path']);

    delete data['result'];
    delete data['hash'];
    delete data['dwltag'];


    return data;
}