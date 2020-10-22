
export const getTime = (date) => date.split(' ')[4];

export const delayToString = (delay) => {
    const delayAbs = Math.abs(delay);
    let minutes = Math.floor(delayAbs / 60);
    minutes = minutes === 0 ? '00' : (minutes < 10 ? '0' + minutes : minutes);
    let seconds = delayAbs < 10 ? '0' + delayAbs : delayAbs > 59 ? (delayAbs % 60 < 10 ? '0' + delayAbs % 60 : delayAbs % 60) : delayAbs;
    return `${delay < 0 ? '+' : ''}${minutes}:${seconds}`;
}
