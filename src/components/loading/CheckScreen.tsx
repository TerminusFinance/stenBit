import React, {useEffect, useState} from "react";
import {parse, validate} from "@telegram-apps/init-data-node";
import {retrieveLaunchParams} from "@tma.js/sdk";

export const CheckScreen : React.FC = () => {

    const { initDataRaw } = retrieveLaunchParams();
    const token = '7248210755:AAH9Gq1oKsUD1HWTpg4avAGCGUt_M5cqrvs';
    const   [state, setTate] = useState("nothing")
    useEffect(() => {
        initDataRaw
        switch (initDataRaw) {
            case 'tma':
                try {

                    validate(initDataRaw, token, {
                        expiresIn: 3600,
                    });
                    //

                    parse(initDataRaw);
                    setTate("good")
                    // return next();
                } catch (e) {
                    // @ts-ignore
                    setTate("error - ", e.message)
                    // return next(e);
                }
            //
            // default:
            //     return next(new Error('Unauthorized'));
        }
    }, []);
    return (
        <div>
            <p>{state}</p>

        </div>
    )

}