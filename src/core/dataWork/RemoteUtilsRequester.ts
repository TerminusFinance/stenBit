import axios, {} from 'axios';
import {TaskType} from "../../components/home/tasksScreen/itemTask/ItemTask.tsx";
import {retrieveLaunchParams} from "@tma.js/sdk";

const BASE_URL = "/api/"

    // const initDataRaw = "query_id=AAHpI4RkAAAAAOkjhGQZtt7I&user=%7B%22id%22%3A1686381545%2C%22first_name%22%3A%22Dmitrii%22%2C%22last_name%22%3A%22Kopeikin%22%2C%22username%22%3A%22kopeikindp%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721155597&hash=4e247f41d9e1dc4a2d09d64a87ec73d6cdaa7ec3a26ca663d8785b71f88b1efe"
const { initDataRaw } = retrieveLaunchParams();

export interface Invitee {
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
    userId: string,
    userName: string,
    coins: number,
    codeToInvite: string,
    address?: string,
    listUserInvited: listUserInvitedItem[],
    currentEnergy?: number,
    maxEnergy: number,
    boosts: BoostItem[]
    completedTasks: number[] | null;
    tasks: UserTask[];
    imageAvatar? : string | null;
}

export interface BoostUpdateResult {
    user : UserBasic;
    boostEndTime?: string;
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
    etaps?: number | null;
    dataSendCheck?: string| null
}
export const createUser = async (coins: number): Promise<UserBasic> => {
    try {
        const response = await axios.post<UserBasic>(
            `${BASE_URL}users/createNewUsers`,
            {coins}, {headers: {Authorization: `tma ${initDataRaw}`}}
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

export const getUserById = async (): Promise<UserBasic | string> => {

    try {
        const response = await axios.get<UserBasic>(
            `${BASE_URL}users/getUser`, {headers: {Authorization: `tma ${initDataRaw}`}}
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

export const updateUser = async (updates: Partial<UpdateUserRequest>): Promise<UserBasic> => {
    const payload = {...updates};
    console.log("payload - ", payload)
    try {
        const response = await axios.put<UserBasic>(`${BASE_URL}users/updateUsers`,
            payload, {headers: {Authorization: `tma ${initDataRaw}`}}
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const addCoinsToClickData = async (coins: number): Promise<UserBasic> => {
    try {
        const response = await axios.post<UserBasic>(`${BASE_URL}users/addCoins`,
            {coins}, {headers: {Authorization: `tma ${initDataRaw}`}}
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};



export const processInvitationFromInviteCode = async (inviteCode: string): Promise<UserBasic | string> => {
    try {
          await axios.post<{
            result: GetUserByResponse
        }>(`${BASE_URL}users/processInvitation`,
            {inviteCode,}, {headers: {Authorization: `tma ${initDataRaw}`}}
        );

        const userResult =await getUserById()
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

export const updateTaskCompletion = async (taskId: number): Promise<UserBasic | string> => {
    try {
        const completed = true
        const response = await axios.patch<UpdateTaskResult>(`${BASE_URL}task/updateTaskCompletion`, {
            taskId, completed
        }, {headers: {Authorization: `tma ${initDataRaw}`}});

        console.log("response.data - ", response.data);
        if(response.data.message == "Task completion status updated successfully") {
            const userGetResponse = await getUserById()
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


export const updateLevel = async (boostName: string) : Promise<BoostUpdateResult | string> => {
    try {
        const response = await axios.post<BoostUpdateResult>(`${BASE_URL}users/updateBoost`, {
            boostName
        }, {headers: {Authorization: `tma ${initDataRaw}`}});
        console.log("response.data - ", response.data);
        if ('message' in response.data) {
            return `${response.data.message}`; // Возвращаем сообщение об ошибке
        }
        return response.data;
    } catch (e) {
        return "error in update state task"
    }
}

export const checkSuccessTask = async (taskId: number): Promise<UserBasic | string> => {
    try {
        const response = await axios.post<UserBasic>(`${BASE_URL}task/checkSuccessTask`, {
            taskId
        }, {headers: {Authorization: `tma ${initDataRaw}`}});
        console.log("response.data - ", response.data);
        if ('message' in response.data) {
            return `${response.data.message}`; // Возвращаем сообщение об ошибке
        }
        return response.data;
    } catch (e) {
        return `error ${e}`
    }
}