import { getMetaData } from "../tool/index";

export default class Answer {
    constructor({ aid, text, ansBy, ansDate }) {
        this.aid = aid;
        this.text = text;
        this.ansBy = ansBy;
        this.ansDate = ansDate;
    }

    calculateTimeElapsed() {
        return getMetaData(this.ansDate);
    }
}
