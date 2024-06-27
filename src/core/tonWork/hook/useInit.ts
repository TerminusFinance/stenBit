import {useEffect, useState} from 'react';

export function useInit<T>(
    func: () => Promise<T>,
    deps: never[] = []
){
    const [state, setState] = useState<T | undefined>();
    useEffect(()=>{
        (async () => {
            setState(await func());
        })();
    },deps);


    return state;
}