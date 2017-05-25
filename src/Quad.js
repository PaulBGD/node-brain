export class Quad {
    constructor(o1, o2, o3, o4) {
        this.o1 = o1;
        this.o2 = o2;
        this.o3 = o3;
        this.o4 = o4;
        this.canEnd = false;
        this.canStart = false;
    }

    toJSON() {
        return this.toString();
    }

    toString() {
        return `${this.o1}|${this.o2}|${this.o3}|${this.o4}|${this.canStart ? 1 : 0}|${this.canEnd ? 1 : 0}`;
    }

    toPartsString() {
        return `${this.o1}|${this.o2}|${this.o3}|${this.o4}`;
    }

    static fromString(str) {
        const split = str.split('|');
        if (split.length !== 6) {
            throw new Error('Invalid quad ' + str);
        }
        const quad = new Quad(split[ 0 ], split[ 1 ], split[ 2 ], split[ 3 ]);
        quad.canStart = split[ 4 ] == '1';
        quad.canEnd = split[ 5 ] == '1';
        return quad;
    }
}
