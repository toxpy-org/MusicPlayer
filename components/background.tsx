import { useRef, useEffect } from 'react';

export default function Background() {
    let canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current) canvas.current.width = window.innerWidth;
        if (canvas.current) canvas.current.height = window.innerHeight;

        window.onresize = () => {
            if (canvas.current) canvas.current.width = window.innerWidth;
            if (canvas.current) canvas.current.height = window.innerHeight;
        }
    });

    return <div>
        <canvas ref={canvas} id="audio_visual" className='absolute z-0 left-[50%] translate-x-[-50%] bottom-0'></canvas>
    </div>
}