/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect} from 'react'

export default httpRequest => {
    const [error, setError] = useState(null)

    const reqIntercep = httpRequest.interceptors.request.use(req => {
        setError(null)
        return req
    });
    
    const resIntercep = httpRequest.interceptors.response.use(res => res, err => {
        setError(err)
    });

    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        return () => {
            httpRequest.interceptors.request.eject(reqIntercep)
            httpRequest.interceptors.response.eject(resIntercep);
        }
    }, [reqIntercep, resIntercep])

    return [
        error, clearError
    ]
}