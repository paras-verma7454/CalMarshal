export default function convertTime12Hrs(time24Hrs: string) {
    const [hours, minutes] = time24Hrs.split(':');
    let hours12Hrs = parseInt(hours);
    const ampm = hours12Hrs >= 12 ? 'PM' : 'AM';
    hours12Hrs = hours12Hrs % 12;
    hours12Hrs = hours12Hrs || 12; // the hour '0' should be '12'
    return `${hours12Hrs}:${minutes} ${ampm}`;
  }