function transformDate(date: Date) {

    const dateToString: string = String(date);

    const dateToStringCrop: string = dateToString.substring(0, 10);

    const dateToDisplay: string = `${dateToStringCrop.substring(8, 10)}/${dateToStringCrop.substring(5, 7)}/${dateToStringCrop.substring(0, 4)}`
  
    return dateToDisplay;
  }
  
module.exports = { transformDate };
