import { Anybody, Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { FastAverageColor, FastAverageColorResource } from 'fast-average-color';

const inter = Inter({ subsets: ['latin'] })

interface MusicOption {
  img: string,
  audio: string,
  color: Array<number>,
  l?: boolean,
  weights: (c: { r: number, g: number, b: number, a: number }, w: { c: number, h: number }) => number[],
  play: () => void
}

export default function Home() {
  let canvas: HTMLCanvasElement;
  let audio: HTMLAudioElement;
  let audioContext: AudioContext;
  let ctx: CanvasRenderingContext2D;

  let [chosen, setChosen] = useState<number>(1);

  let options: Array<MusicOption> = [
    {
      img: "./icon/Mortal_With_You.webp",
      audio: "./audio/mortal_with_you.mp3",
      color: [0, 0, 0, 0],
      weights: ({ r, g, b, a }, { c, h }) => [r * ((c / h) + 0.5), g * ((c / h) + 0.5), b, 0.5 * ((c / h))],
      play: () => {
        // setChosen(0);
        start();
      },
    },
    {
      img: "./icon/shoujo_a.webp",
      audio: "./audio/girl_amp3.mp3",
      color: [0, 0, 0, 0],
      weights: ({ r, g, b, a }, { c, h }) => [r * ((c / h) + 0.1), g * ((c / h) + 0.1), b * ((c / h) + 0.5), 0.5],
      play: () => {
        // setChosen(1);
        start()
      },
    },
    {
      img: "./icon/mili_sl0t.webp",
      audio: "./audio/sl0t.mp3",
      color: [0, 0, 0, 0],
      weights: ({ r, g, b, a }, { c, h }) => [r, g, b * ((c / h) + 0.3), 0.5],
      play: () => {
        // setChosen(2);
        start()
      },
    }
  ]


  for (let option of options) {
    if (!option.l) {
      option.l = true;
      let av = new FastAverageColor();
      setTimeout(() => {
        (() => {
          let img = new Image();
          img.src = option.img;

          img.onload = () => {
            option.color = av.getColor(img).value;
          };

          return [];
        })()
      }, 100)

    }
  }


  let [selected, SetSelected] = useState<MusicOption>(options[1]);

  let playing = selected;

  useEffect(() => {
    document.body.style.backgroundImage = `url(${selected?.img})`;

    canvas = document.getElementById("audio_visual") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as any;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    })

    // let img = new Image();

    // img.src = imgSrc;

    // img.addEventListener("load", () => {
    //   let a = av.getColor(img);
    //   color = a.value;
    // })
  }, [selected])

  const start = () => {
    if ((audio != undefined) && !audio.paused) {
      // if (chosen == isPlaying) return;

      return;
      audio.pause();

      // setIsPlaying(chosen);
    };

    // setIsPlaying(chosen);

    audio = new Audio(selected?.audio);

    audio.play()

    console.log(chosen);

    audioContext = new AudioContext();

    let audioSource = audioContext.createMediaElementSource(audio);
    let analyzer = audioContext.createAnalyser();

    audioSource.connect(analyzer);
    analyzer.connect(audioContext.destination);

    let removed = 2.4;

    analyzer.fftSize = Math.pow(2, Math.round(removed) + 6);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let barWidth = Math.ceil(removed) * ((canvas.width / 2) / bufferLength);
    let barHeight;
    let x = 0;
    let loud = 0;
    let prevLoud = 0;
    let highest = 1;

    function animate() {
      barWidth = Math.ceil(removed) * (canvas.width / 2) / bufferLength;

      x = 0;
      loud = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      analyzer.getByteFrequencyData(dataArray);

      let color = playing.color;

      let weightedColor = playing.weights({ r: color[0], g: color[1], b: color[2], a: color[3] }, { c: prevLoud, h: highest });
      let red = weightedColor[0];
      let green = weightedColor[1];
      let blue = weightedColor[2];
      let alpha = weightedColor[3];

      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      // ctx.fillStyle = `rgba(${red * ((prevLoud / highest) + 1)}, ${green * ((prevLoud / highest) + 1)}, ${blue}, 0.5)`;

      ctx.filter = "blur(25px)";

      for (let i = 0; i < bufferLength / removed; i++) {
        loud += dataArray[i];

        barHeight = dataArray[i] * 1.5 + 10;

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
      }

      for (let i = 0; i < bufferLength / removed; i++) {
        barHeight = dataArray[i] * 1.5 + 10;

        ctx.fillRect((canvas.width / 2) + x, canvas.height - barHeight, barWidth, barHeight);
        x -= barWidth;
      }

      prevLoud = loud;
      if (loud > highest) highest = loud;

      requestAnimationFrame(animate);
    }

    animate();
  }

  return (
    <div className='flex px-12 h-screen justify-center'>
      <canvas id="audio_visual" className='music_canvas'></canvas>

      <div className='flex my-8 max-w-[1300px] min-w-[900px] wrapper-bg rounded-lg overflow-hidden'>
        <div className='flex grow-[1] min-w-[600px] flex flex-col'>
          <div>
            <img src={selected?.img} className='h-auto' alt='' />
          </div>
          <div>
            <button onClick={start} className='bg-slate-600 m-2'>Play - mortal with you</button>
            <button onClick={start} className='bg-slate-600 m-2'>Play - shoujo a</button>
            <button onClick={start} className='bg-slate-600 m-2'>Play - sl0t</button>
          </div>
        </div>
        <div className='flex min-w-[300px] w-[500px]'></div>
      </div>
    </div>
    // <main
    //   className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    // >
    //   <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
    //     <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
    //       Get started by editing&nbsp;
    //       <code className="font-mono font-bold">pages/index.tsx</code>
    //     </p>
    //     <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
    //       <a
    //         className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
    //         href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         By{' '}
    //         <Image
    //           src="/vercel.svg"
    //           alt="Vercel Logo"
    //           className="dark:invert"
    //           width={100}
    //           height={24}
    //           priority
    //         />
    //       </a>
    //     </div>
    //   </div>

    //   <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
    //     <Image
    //       className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
    //       src="/next.svg"
    //       alt="Next.js Logo"
    //       width={180}
    //       height={37}
    //       priority
    //     />
    //   </div>

    //   <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
    //     <a
    //       href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Docs{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Find in-depth information about Next.js features and API.
    //       </p>
    //     </a>

    //     <a
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Learn{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Learn about Next.js in an interactive course with&nbsp;quizzes!
    //       </p>
    //     </a>

    //     <a
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Templates{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Discover and deploy boilerplate example Next.js&nbsp;projects.
    //       </p>
    //     </a>

    //     <a
    //       href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Deploy{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Instantly deploy your Next.js site to a shareable URL with Vercel.
    //       </p>
    //     </a>
    //   </div>
    // </main>
  )
}
