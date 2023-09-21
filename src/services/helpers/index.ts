export const capitalizeFirstLetter = (text: string) => {
    if (!text) {
        return null;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
}