import { useSelector } from "react-redux";
import { API_BASE_URL } from "../BaseURL";
const useHandleData = () => {
    const { user } = useSelector(state => state.user);

    const handleData = async ({ endPoint, data, isAuthenticated, method }) => {

        const headers = isAuthenticated ? { Authorization: `Bearer ${user.token}`, accept: "application/json" } : { accept: "application/json" };

        const requestOptions = {
            method,
            headers,
        };

        if (data !== undefined && data !== null) {
            requestOptions.body = data;
        }


        return new Promise((resolve, reject) => {
            fetch(API_BASE_URL + endPoint, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        return response.json()
                            .then(errorData => {
                                const error = new Error(JSON.stringify(errorData));
                                error.status = response.status;
                                reject(error);
                            })
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => {
                    reject(new Error(JSON.stringify({ networkError: error.message })));
                })
        })

    }

    return handleData;
}

export default useHandleData;