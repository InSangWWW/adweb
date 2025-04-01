//가격 포맷팅
export const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 날짜 포맷팅
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2,0);

    return `${year}-${month}-${day}`;
}


//전화번호 포맷팅
export const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber
    .replace(/[^\d]/g, '')
    .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}