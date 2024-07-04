import React, { createContext, useContext, useState, ReactNode } from 'react';
import {UserBasic} from "../core/dataWork/Back4app.ts";

// 1. Определение интерфейсов


interface DataContextType {
    dataApp: UserBasic;
    setDataApp: React.Dispatch<React.SetStateAction<UserBasic>>;
}

// 2. Создание контекста

const DataContext = createContext<DataContextType | undefined>(undefined);

// 3. Создание провайдера

interface DataProviderProps {
    children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [dataApp, setDataApp] = useState<UserBasic>({  });

    return (
        <DataContext.Provider value={{ dataApp, setDataApp }}>
            {children}
        </DataContext.Provider>
    );
};

// 4. Кастомный хук для использования контекста

const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export { DataProvider, useData };
