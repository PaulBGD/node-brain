import {Quad} from './Quad';

export class MemoryProvider {
    constructor() {
        this.quads = {};
        this.words = {};
        this.previous = {};
        this.next = {};
    }

    addQuad(quad) {
        this.quads[quad.toString()] = quad;
        return Promise.resolve();
    }

    addWord(quad, word) {
        if (this.words[word]) {
            this.words[word].push(quad);
        } else {
            this.words[word] = [quad];
        }
        return Promise.resolve();
    }

    addPrevious(quad, previous) {
        const asString = quad.toString();
        if (this.previous[asString]) {
            this.previous[asString].push(previous);
        } else {
            this.previous[asString] = [previous];
        }
        return Promise.resolve();
    }

    addNext(quad, next) {
        const asString = quad.toString();
        if (this.next[asString]) {
            this.next[asString].push(next);
        } else {
            this.next[asString] = [next];
        }
        return Promise.resolve();
    }

    getMiddleQuad(word) {
        const array = this.words[word] || Object.keys(this.quads).map(Quad.fromString);
        return Promise.resolve(getRandom(array));
    }

    getNextPossibleWord(quad) {
        return getFromQuadKeyArray(this.next, quad).then(getRandom);
    }

    getPreviousPossibleWord(quad) {
        return getFromQuadKeyArray(this.previous, quad).then(getRandom);
    }

    getQuad(quad) {
        return getFromQuadKeyArray(this.quads, quad);
    }

    fromJSON(json) {
        this.words = json.words || {};
        this.quads = json.quads || {};
        this.next = json.next || {};
        this.previous = json.previous || {};

        Object.keys(this.quads).forEach(key => {
            this.quads[key] = Quad.fromString(this.quads[key]);
        });
        Object.keys(this.words).forEach(key => {
            this.words[key] = this.words[key].map(Quad.fromString);
        });
    }

    toJSON() {
        return {
            words: this.words,
            quads: this.quads,
            next: this.next,
            previous: this.previous
        };
    }
}

function getFromQuadKeyArray(quads, quad) {
    const array = Object.keys(quads).filter(key => {
        const other = Quad.fromString(key);
        return !(other.o1 !== quad.o1 || other.o2 !== quad.o2 || other.o3 !== quad.o3);

    });
    if (!array || array.length === 0) {
        console.log('quads', quads, 'does not contain', quad);
        throw new Error('');
        return Promise.resolve(null);
    }
    return Promise.resolve(quads[array[0]]);
}

function getRandom(array) {
    return array[Math.floor(array.length * Math.random())];
}