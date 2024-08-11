import { requestFactory } from "./requester";

const baseUrl = 'http://localhost:3030/data/additional';

export const userServiceFactory = (token) => {

    const request = requestFactory(token);

    const createInitialDetails = async () => {
        const data = {
            nationality: '',
            age: '',
            imageUrl: '',
        };

        return await request.post(baseUrl, data);
    }

    const additionalInfoByOwnerId = async (loggedUserId) => {
        try {
            const result = await request.get(`${baseUrl}?_ownerId=${loggedUserId}`);
            if (result && Array.isArray(result)) {
                return result[0]; // Filter by parameter (_ownerId) returns Array with values. This is why we take the first only
            } else {
                throw new Error(`Something wrong with details request: ${result}`);
            }

        } catch (error) {
            console.error("No additional info: ", error);
            if (error.message.includes('Not Found')) {
                return createInitialDetails();
            } else {
                throw error;
            }
        }
    }

    const additionalInfo = async (userId) => {
        try {
            const result = await request.get(`${baseUrl}/${userId}`);
            const info = Object.values(result);

            return info;

        } catch (error) {
            console.error("No additional info: ", error);
            if (error.message.includes('Not Found')) {
                const initialData = createInitialDetails();
                return initialData;

            } else {
                // Handle other types of errors
                throw error;
            }
        }
    };

    const update = async (userId, data) => {
        try {
            const response = await request.put(`${baseUrl}/${userId}`, data);
            return response;
        } catch (err) {
            console.log(err);
        }
    }



    return {
        additionalInfo,
        additionalInfoByOwnerId,
        update,
    };
}
