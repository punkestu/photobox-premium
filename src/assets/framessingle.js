import Calendar from "./framessingle/calendar.png";
import Receipt from "./framessingle/receipt.png";

export function all() {
    return [
        {
            key: "calendar",
            framecount: 1,
            display: Calendar,
            direction: "vertical",
            offsetleft: 23,
            offsettop: 636,
            offsetright: 23,
            offsetbottom: 65,
            gap: 0,
            width: 685,
            height: 1181,
            ratio: [640, 480],
        }, {
            key: "receipt",
            framecount: 2,
            display: Receipt,
            direction: "vertical",
            offsetleft: 61,
            offsettop: 283,
            offsetright: 61,
            offsetbottom: 65,
            gap: 12,
            width: 685,
            height: 1299,
            ratio: [564, 408],
        }
    ];
}