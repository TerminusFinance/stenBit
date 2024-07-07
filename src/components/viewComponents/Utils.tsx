

export const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
};

export const OpenUrl = (url: string) =>{
    window.open(url, '_blank');
}