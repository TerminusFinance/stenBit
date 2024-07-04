import axios, {} from 'axios';



export const createUser = async (userId: string, userName: string, coins: number): Promise<GetUserByResponse> => {
    try {
        console.log("createUser userId -", userId)
        const response = await axios.post<{ result: GetUserByResponse }>(
            'https://parseapi.back4app.com/functions/createUser',
            {userId, userName, coins}, // Параметры тела запроса
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

export interface Invitee {
    userId: string;
    userName: string;
    coinsReferral: number;
}

export interface GetUserByResponse {
    className?: string;
    codeToInvite?: string;
    coins?: number;
    objectId?: string;
    userId?: string;
    userName?: string;
    address?: string;
    listUserInvite?: Invitee[];
    completedTasks?: number[] | null;
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
    completedTasks?: number[];
}

export const updateUser = async (userId: string, updates: Partial<UpdateUserRequest>): Promise<GetUserByResponse> => {
    // Create the payload dynamically, including only defined fields
    const payload = { userId, ...updates };
    console.log("payload - ", payload)
    try {
        const response = await axios.post<{
            result: GetUserByResponse
        }>('https://parseapi.back4app.com/functions/updateUser',
            payload,
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


export interface UpdateUserRequestCompletedTask {
    userId?: string;
    completedTasks: number[];
}

export const updateUserByCompletedTask = async (userId: string, updates: Partial<UpdateUserRequestCompletedTask>): Promise<GetUserByResponse> => {
    try {
        const response = await axios.post<{
            result: GetUserByResponse
        }>('https://parseapi.back4app.com/functions/updateUser',
            { userId, ...updates } as UpdateUserRequestCompletedTask,
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


export const processInvitationFromInviteCode = async (inviteCode: string, newUserId: string, newUserName: string): Promise<GetUserByResponse> => {
    try {
        const response = await axios.post<{
            result: GetUserByResponse
        }>('https://parseapi.back4app.com/functions/processInvitation',
            { inviteCode, newUserId, newUserName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id': '35FDDTeCMqJUMhDYr9LFh2TEXPXTiRvYiRYbcG23',
                    'X-Parse-REST-API-Key': 'kAyRiID9BcXva11fhs5b6fX47nkcVlJjk34313qP'
                }
            }
        );

        return response.data.result;
    } catch (error) {
        console.error('Error processing invitation:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
            if (error.response.data.error === 'User with the given invite code not found') {
                return { error: 'User with the given invite code not found' };
            } else if (error.response.data.error === 'User with this userId already exists') {
                return { error: 'User with this userId already exists' };
            }
        }
        throw error;
    }
};

interface LeagueLevel {
    level: string;
    maxEnergy: number;
    minCoins: number;
    maxCoins: number;
}

export const getLevelLeague = async (): Promise<LeagueLevel[]> => {
    try {
        const response = await axios.get<LeagueLevel[]>('http://95.163.235.93/leagues');

        console.log("response.data - ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error processing invitation:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
        }
        throw error;
    }
}