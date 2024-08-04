export const capitalizeFirstLetter = (text: string) => {
    if (!text) {
        return null;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const maskString = (text: string) => {
    if (!text) {
        return null;
    }

    if (text.length <= 4) {
        return text;
    }

    const lastFour = text.slice(-4);
    const masked = lastFour.padStart(text.length, '*');
    return masked;
}

export const formatDateString = (dateString: string) => {
    if (!dateString) {
        return null;
    }

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDate;
}

export const convertToPrice = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'ZMW' });
}