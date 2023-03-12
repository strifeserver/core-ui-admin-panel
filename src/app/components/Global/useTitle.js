import React, {useEffect} from 'react';
import { Config } from 'src/config/Config'

const useTitle = (name) => {
    useEffect(() => {
        const appName = Config.app_name;
        const prevTitle = appName;
        document.title = `${name} - ${appName}`;

        return () => {
            document.title = prevTitle;
        }

    }, [])
}

export default useTitle;