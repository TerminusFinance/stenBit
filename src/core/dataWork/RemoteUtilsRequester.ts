import axios, {} from 'axios';
import {TaskType} from "../../components/home/tasksScreen/itemTask/ItemTask.tsx";
import {retrieveLaunchParams} from "@tma.js/sdk";

const BASE_URL = "https://wm-mariupol.com/"

// const initDataRaw = "query_id=AAHAI7FnAgAAAMAjsWdXa0gX&user=%7B%22id%22%3A6034629568%2C%22first_name%22%3A%22%D0%A0%D0%BE%D0%BC%D0%B0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22romaandroid%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1720643108&hash=f5c39cf0b62230431612693ae17d2e97857114e1c6e508358e985776d8eeb2c6"
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
    maxEnergy?: number,
    boosts: BoostItem[]
    completedTasks: number[] | null;
    tasks: UserTask[];
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



export const processInvitationFromInviteCode = async (inviteCode: string): Promise<UserBasic | string> => {
    try {
          await axios.post<{
            result: GetUserByResponse
        }>(`${BASE_URL}users/process-invitation`,
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


export const updateLevel = async (boostName: string) : Promise<UserBasic | string> => {
    try {
        const response = await axios.post<UserBasic>(`${BASE_URL}users/updateBoost`, {
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