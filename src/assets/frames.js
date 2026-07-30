import Type1Base from "./frames/type1/base.svg";
import Type2Base from "./frames/type2/base.svg";
import Type3Base from "./frames/type3/base.svg";
import Type4Base from "./frames/type4/base.svg";
import Type5Base from "./frames/type5/base.svg";
import Type6Base from "./frames/type6/base.svg";

export function all() {
    return [
        {
            key: "type1",
            framecount: 4,
            display: Type1Base,
            direction: "vertical",
            offsetleft: 20,
            offsettop: 20,
            offsetright: 20,
            offsetbottom: 20,
            gap: 20,
            width: 400,
            height: 1400,
            ratio: [4, 3]
        },
        {
            key: "type2",
            framecount: 4,
            display: Type2Base,
            direction: "vertical",
            offsetleft: 20,
            offsettop: 20,
            offsetright: 20,
            offsetbottom: 20,
            gap: 20,
            width: 400,
            height: 1400,
            ratio: [4, 3]
        },
        {
            key: "type3",
            framecount: 4,
            display: Type3Base,
            direction: "vertical",
            offsetleft: 20,
            offsettop: 20,
            offsetright: 20,
            offsetbottom: 20,
            gap: 20,
            width: 400,
            height: 1400,
            ratio: [4, 3]
        },
        {
            key: "type4",
            framecount: 3,
            display: Type4Base,
            direction: "horizontal",
            offsetleft: 20,
            offsettop: 20,
            offsetright: 20,
            offsetbottom: 20,
            gap: 20,
            width: 400,
            height: 1400,
            ratio: [4, 3]
        },
        {
            key: "type5",
            framecount: 2,
            display: Type5Base,
            direction: "horizontal",
            offsetleft: 20,
            offsettop: 40,
            offsetright: 20,
            offsetbottom: 40,
            gap: 10,
            width: 280,
            height: 200,
            ratio: [1, 1]
        },
        {
            key: "type6",
            framecount: 1,
            display: Type6Base,
            direction: "horizontal",
            offsetleft: 20,
            offsettop: 20,
            offsetright: 20,
            offsetbottom: 20,
            gap: 20,
            width: 400,
            height: 1400,
            ratio: [4, 3]
        }
    ];
}