import React, {useEffect, useState} from "react";
import {parse, validate} from "@telegram-apps/init-data-node";
import {postEvent, retrieveLaunchParams} from "@tma.js/sdk";

export const CheckScreen : React.FC = () => {

    const { initDataRaw } = retrieveLaunchParams();
    const token = '7248210755:AAH9Gq1oKsUD1HWTpg4avAGCGUt_M5cqrvs';
    const   [state, setTate] = useState("nothing")
    try {
        postEvent('web_app_setup_back_button', { is_visible: true });
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }
    useEffect(() => {
        // initDataRaw
        // switch (initDataRaw) {
        //     case 'tma':
        if(initDataRaw != undefined) {
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
        } else  {
            setTate("init is null")
        }
            //
            // default:
            //     return next(new Error('Unauthorized'));
        // }
    }, []);
    return (
        <div>
            <p>{state}</p>

        </div>
    )

}