import axios, {} from 'axios';
import {TaskType} from "../../components/home/tasksScreen/itemTask/ItemTask.tsx";
import {retrieveLaunchParams} from "@tma.js/sdk";

const BASE_URL = "https://wm-mariupol.com/"

export const createUser = async (userId: string, userName: string, coins: number): Promise<UserBasic> => {
    try {
        console.log("createUser userId -", userId)
        const response = await axios.post<UserBasic>(
            `${BASE_URL}users`,
            {userId, userName, coins}
        );
        return response.data;
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
    userId?: string;
    userName?: string;
    address?: string;
    listUserInvite?: Invitee[];
    completedTasks?: number[] | null;
    error?: string;
}

export interface BoostItem {
    boostName: string,
    level: number,
    price: number
}

interface listUserInvitedItem {
    userId: string,
    userName: string,
    coinsReferral: number
}

export interface UserBasic {
    userId?: string,
    userName?: string,
    coins?: number,
    codeToInvite?: string,
    address?: string,
    listUserInvited?: listUserInvitedItem[],
    currentEnergy?: number,
    maxEnergy?: number,
    boosts?: BoostItem[]
    completedTasks?: number[] | null;
    tasks?: UserTask[];
}
export interface UserTask {
    taskId: number;
    text: string;
    coins: number;
    checkIcon: string;
    taskType: TaskType;
    type: string;
    completed: boolean;
    lastCompletedDate?: string | null;
    actionBtnTx?: string | null;
    txDescription?: string | null;
}

export const getUserById = async (userId: string): Promise<UserBasic | string> => {

    try {
        const { initDataRaw } = retrieveLaunchParams();
        console.log('Sending request to get user by ID:', userId);

        const response = await axios.get<UserBasic>(
            `${BASE_URL}users/${userId}`, {headers: {Authorization: `tma ${initDataRaw}`}}
        );

        console.log('Response data:', typeof response.data);
        if ('message' in response.data) {
            return `${response.data.message}`; // Возвращаем сообщение об ошибке
        }
        return response.data; // Вернем результат из объекта response.data
    } catch (error) {
        console.error('Error getting user:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
            return "User not found"
        }
        throw error;
    }
};

export interface UpdateUserRequest {
    coins?: number;
    userName?: string;
    address?: string;
}

export const updateUser = async (userId: string, updates: Partial<UpdateUserRequest>): Promise<UserBasic> => {
    const payload = {...updates};
    console.log("payload - ", payload)
    try {
        const response = await axios.put<UserBasic>(`${BASE_URL}users/${userId}`,
            payload,
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};


export interface UpdateUserRequestCompletedTask {
    userId?: string;
    completedTasks: number[];
}




export const processInvitationFromInviteCode = async (inviteCode: string, newUserId: string, newUserName: string): Promise<UserBasic | string> => {
    try {
          await axios.post<{
            result: GetUserByResponse
        }>(`${BASE_URL}users/process-invitation`,
            {inviteCode, newUserId, newUserName},
        );

        const userResult =await getUserById(newUserId)
        return userResult;
    } catch (error) {
        console.error('Error processing invitation:', error);
        console.error('Error getting user:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
            return "User not found"
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
        const response = await axios.get<LeagueLevel[]>(`${BASE_URL}leagues`);

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

interface UpdateTaskResult {
    message: string;
    errorMessage?: string;
}

export const updateTaskCompletion = async (userId: string, taskId: number): Promise<UserBasic | string> => {
    try {
        const completed = true
        const response = await axios.patch<UpdateTaskResult>(`${BASE_URL}task/updateTaskCompletion`, {
            userId, taskId, completed
        });

        console.log("response.data - ", response.data);
        if(response.data.message == "Task completion status updated successfully") {
            const userGetResponse = await getUserById(userId)
            return userGetResponse
        } else  {
            return "error in update state task"
        }
    } catch (error) {
        console.error('Error processing invitation:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.log('Axios error response data:', error.response.data);
            return "User not found"
        }
        throw error;
    }
}


export const updateLevel = async (userId: string, boostName: string) : Promise<UserBasic | string> => {
    try {
        const response = await axios.post<UserBasic>(`${BASE_URL}users/updateBoost`, {
            userId, boostName
        });
        console.log("response.data - ", response.data);
        if ('message' in response.data) {
            return `${response.data.message}`; // Возвращаем сообщение об ошибке
        }
        return response.data;
    } catch (e) {
        return "error in update state task"
    }
}