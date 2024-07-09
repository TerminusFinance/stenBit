

export const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
};

export const OpenUrl = (url: string) =>{
    window.open(url, '_blank');
}

export  const calculateThousandsDifference = (current: number, max: number): number => {
    const difference = max - current;
    return Math.ceil(difference / 1000);
};

export     const formatNumber = (num: number): string => {
    if (num < 1000) {
        return num.toString();
    }

    return num.toLocaleString('en-US');
};

export const  formatNumberToK = (num: number): string => {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(num % 1e9 === 0 ? 0 : 1) + "B";
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(num % 1e6 === 0 ? 0 : 1) + "M";
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(num % 1e3 === 0 ? 0 : 1) + "K";
    } else {
        return num.toString();
    }
};

