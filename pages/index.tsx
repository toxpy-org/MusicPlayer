import { useEffect } from "react"
import Background from "../components/background";
import { useMusic } from '@/music';
import Link from 'next/link';

export default function Home() {
    let music = useMusic();

    useEffect(() => {

    });

    return <div className="flex px-12 h-screen justify-center bg-gray-900">
        <Background />
        <div className="flex z-10 bg-gray-800 text-white my-8 w-[1300px] min-w-[900px] rounded-lg overflow-hidden">
            <Link href="/api/files/all" className="p-4 text-blue-300 hover:text-red-300 border-2 h-fit m-4">API Musics metadata</Link>
            <Link href="/api/files/stream?fileid=55971677575" className="p-4 text-blue-300 hover:text-red-300 border-2 h-fit m-4">API <cite>Mili - Mortal with you</cite> streaming audio</Link>
        </div>
    </div>
}