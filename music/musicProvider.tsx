import { createContext, useState, useContext, ReactNode } from 'react';

interface MusicState {

}

export const MusicContext = createContext<MusicState>({});
export const useMusic = () => useContext(MusicContext);

export function MusicProvider({ children }: { children: ReactNode }) {
    let [state, setState] = useState<MusicState>({});

    return <MusicContext.Provider value={state}>
        {children}
    </MusicContext.Provider>
}