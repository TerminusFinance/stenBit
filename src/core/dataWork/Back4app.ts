import axios, {} from 'axios';

interface UserData {
    objectId?: string;
    userId?: string;
    clickCount?: number;
    address?: string;
    inviteCode?: string;
    invitedFriends?: string[];
    error?: string;
}

interface CreateUserResponse {
    result: UserData;
}

export const createUser = async (userId: string, userName: string): Promise<UserData> => {
    try {
        console.log("createUser userId -", userId)
        const response = await axios.post<CreateUserResponse>(
            'https://parseapi.back4app.com/functions/createUser',
            {userId, userName}, // Параметры тела запроса
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id': '35FDDTeCMqJUMhDYr9LFh2TEXPXTiRvYiRYbcG23',
                    'X-Parse-REST-API-Key': 'kAyRiID9BcXva11fhs5b6fX47nkcVlJjk34313qP',
                }
            }
        );
        return response.data.result;
    } catch (error) {
        console.error('Error creating user:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
        }
        throw error;
    }
};

export interface GetUserByResponse {
    className?: string;
    codeToInvite?: string;
    coins?: number;
    objectId?: string;
    userId?: string;
    userName?: string;
    address?: string;
    listUserInvite?: string[]; // Обновим на правильное название
    error?: string;
}

export const getUserById = async (userId: string): Promise<GetUserByResponse> => {
    try {
        console.log('Sending request to get user by ID:', userId);

        const response = await axios.post<{ result: GetUserByResponse }>(
            'https://parseapi.back4app.com/functions/getUserById',
            {userId}, // Параметры тела запроса в виде объекта
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id': '35FDDTeCMqJUMhDYr9LFh2TEXPXTiRvYiRYbcG23',
                    'X-Parse-REST-API-Key': 'kAyRiID9BcXva11fhs5b6fX47nkcVlJjk34313qP',
                }
            }
        );

        console.log('Response data:', response.data.result.coins);
        return response.data.result; // Вернем результат из объекта response.data
    } catch (error) {
        console.error('Error getting user:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
            if (error.response.status === 400 && error.response.data.error === 'Could not find user: User not found') {
                return {error: 'User not found'}; // Возвращаем объект с сообщением об ошибке
            }
        }
        throw error;
    }
};


export interface UpdateUserRequest {
    userId?: string;
    coins?: number;
    userName?: string;
    address?: string;
    listUserInvite?: string[];
}

export const updateUser = async (userId: string, updates: Partial<UpdateUserRequest>): Promise<GetUserByResponse> => {
    try {
        const response = await axios.post<{
            result: GetUserByResponse
        }>('https://parseapi.back4app.com/functions/updateUser',
            { userId, ...updates } as UpdateUserRequest,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id': '35FDDTeCMqJUMhDYr9LFh2TEXPXTiRvYiRYbcG23',
                    'X-Parse-REST-API-Key': 'kAyRiID9BcXva11fhs5b6fX47nkcVlJjk34313qP',
                }
            }
        );

        return response.data.result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// (async () => {
//     try {
//         // Создание пользователя
//         const newUser = await createUser('uniqueUserId123', '123 Main St');
//         console.log('Created User:', newUser.result);
//
//         // Получение пользователя по userId
//         const user = await getUserById('uniqueUserId123');
//         console.log('Fetched User:', user.result);
//
//         // Обновление пользователя
//         const updatedUser = await updateUser('uniqueUserId123', { clickCount: 10, address: '456 New St' });
//         console.log('Updated User:', updatedUser.result);
//     } catch (error) {
//         console.error('Operation failed:', error);
//     }
// })();