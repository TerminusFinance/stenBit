import React from 'react';
import {useLocation} from "react-router-dom";

const NotFound: React.FC = () => {


    const location = useLocation()
    const {e} = location.state as { e: any }

    return <h2>404 Not Found - {e}</h2>;
};

export default NotFound;
