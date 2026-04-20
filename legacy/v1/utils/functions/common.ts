const RequestMethod = {
    POST: "POST"
}

const Time = {
    MORNING: "morning",
    AFTERNOON: "afternoon",
    EVENING: "evening"
}

function getHostedUrl(): string {

    return "http://localhost:3000"
}

function randomNumberGenerator(to: number): number {

    return Math.floor(Math.random() * to);
}

function getTime(): string {
    const today = new Date();
    const curHr = today.getHours();

    if (curHr < 12) {

        return Time.MORNING;
    } else if (curHr < 18) {

        return Time.AFTERNOON;
    }

    return Time.EVENING;

}

export { RequestMethod, Time, getHostedUrl, randomNumberGenerator, getTime };
