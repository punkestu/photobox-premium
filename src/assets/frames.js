import Type1Base from "./frames/type1/base.svg";
import Type1Frames from "./frames/type1/frames";

export function all() {
    return [
        {
            key: "type1",
            framecount: 1,
            display: Type1Base,
            direction: "vertical",
            offsetleft: 23,
            offsettop: 636,
            offsetright: 23,
            offsetbottom: 65,
            gap: 0,
            width: 685,
            height: 1181,
            ratio: [640, 480],
            frames: Type1Frames()
        }
    ];
}