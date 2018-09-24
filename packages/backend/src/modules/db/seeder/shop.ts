import * as moment from "moment";
import {WEEK_DAYS_BITMAP as w} from "../../../constants";

export const shops = [
    {
        name: "Abovyan Shop",
        working_days: w.MONDAY + w.THURSDAY + w.FRIDAY,
        open_at: moment().set("hour", 10).format("HH:mm"),
        close_at:  moment().set("hour", 22).format("HH:mm"),
        rent_price: 0
    }, {
        name: "Slavonakan Shop",
        working_days: w.ALL_WEEK_DAYS,
        open_at: moment().set("hour", 9).format("HH:mm"),
        close_at:  moment().set("hour", 21).format("HH:mm"),
        rent_price: 30000
    }, {
        name: "Aleq Manukyan Shop",
        description: "lorem ipsum",
        rent_price: 30000
    }
];
