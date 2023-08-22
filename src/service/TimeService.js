export default {
    getTimeFromTimestamp: function (timestamp) {
        let date = new Date(timestamp * 1000);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        // let seconds = date.getSeconds();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        // seconds = seconds < 10 ? '0' + seconds : seconds;
        // return `${hours}:${minutes}:${seconds}`;
        return `${hours}:${minutes}`;
    }
}