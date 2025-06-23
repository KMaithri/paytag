const DateFormatter = (datetime) => {

    const arr_date = datetime.split(" ");

    const my_date = arr_date[0] + arr_date[1] + arr_date[2];
    const date = new Date(my_date);

    // Extract day, month, year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Format to DD-MM-YYYY
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;

}

export default DateFormatter;