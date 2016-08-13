import {MemoryProvider} from './MemoryProvider';
import {Quad} from './Quad';

export {Brain, Quad, MemoryProvider};

const VALID_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

class Brain {
    constructor(options) {
        options = options || {};

        this.provider = options.provider || new MemoryProvider();
        this.VALID = options.validCharacters || VALID_CHARACTERS;
    }

    addSentence(sentence, callback) {
        if (typeof sentence !== 'string') {
            const error = new Error(`Sentence must be a string`);
            if (callback) {
                callback(error);
            }
            return Promise.reject(error);
        }

        const parts = [];

        let i = 0;
        let punctuation = false;
        let str = '';
        while (i < sentence.length) {
            var ch = sentence.charAt(i);
            if ((this.VALID.indexOf(ch) >= 0) === punctuation) {
                punctuation = !punctuation;
                if (str.length > 0) {
                    parts.push(str);
                }
                str = '';
                continue;
            }
            str += ch;
            i++;
        }
        if (str.length > 0) {
            parts.push(str);
        }

        if (parts.length < 4) {
            if (callback) {
                callback(null, false);
            }
            return Promise.resolve(false);
        }

        i = 0;
        const iLowEnough = () => i < parts.length - 3;
        const handleNewQuad = () => {
            const quad = new Quad(parts[i], parts[i + 1], parts[i + 2], parts[i + 3]);
            if (i === 0) {
                quad.canStart = true;
            }
            if (i === parts.length - 4) {
                quad.canEnd = true;
            }
            return this.provider.addQuad(quad)
                .then(() => {
                    let j = 0;
                    const jLowEnough = () => j < 4;
                    const addWord = () => this.provider.addWord(quad, parts[i + j]).then(() => j++);
                    return promiseWhile(jLowEnough, addWord);
                })
                .then(() => {
                    if (!quad.canStart) {
                        return this.provider.addPrevious(quad, parts[i - 1]);
                    }
                })
                .then(() => {
                    if (!quad.canEnd) {
                        return this.provider.addNext(quad, parts[i + 4]);
                    }
                })
                .then(() => i++);
        };
        return promiseWhile(iLowEnough, handleNewQuad)
            .then(() => {
                if (callback) {
                    callback(null, true);
                }
            })
            .catch(error => {
                if (callback) {
                    callback(error);
                }
                throw error;
            });
    }

    getSentence(word, callback) {
        if (typeof word !== 'string' || word.indexOf(' ') > -1) {
            const error = new Error(`Invalid word "${word}"`);
            if (callback) {
                callback(error);
            }
            return Promise.reject(error);
        }

        const parts = [];
        let quad;
        let middleQuad;

        return this.provider.getMiddleQuad(word)
            .then(theMiddleQuad => {
                for (let i = 1; i <= 4; i++) {
                    parts[i - 1] = theMiddleQuad[`o${i}`];
                }

                quad = middleQuad = theMiddleQuad;

                const quadCanEnd = () => quad.canEnd !== true;
                const getNextQuad = () => this.provider.getNextPossibleWord(quad)
                    .then(token => this.provider.getQuad(new Quad(quad.o2, quad.o3, quad.o4, token)))
                    .then(newQuad => quad = newQuad)
                    .then(() => parts.push(quad.o4));
                return promiseWhile(quadCanEnd, getNextQuad);
            })
            .then(() => {
                quad = middleQuad;

                const quadCanStart = () => quad.canStart !== true;
                const getPreviousQuad = () => this.provider.getPreviousPossibleWord(quad)
                    .then(token => this.provider.getQuad(new Quad(token, quad.o1, quad.o2, quad.o3)))
                    .then(newQuad => quad = newQuad)
                    .then(() => parts.unshift(quad.o1));
                return promiseWhile(quadCanStart, getPreviousQuad);
            })
            .then(() => {
                const sentence = parts.join('');
                if (callback) {
                    callback(null, sentence);
                }
                return sentence;
            })
            .catch(error => {
                if (callback) {
                    callback(error);
                }
                throw error;
            });
    }
}

function promiseWhile(condition, promise) {
    if (condition()) {
        return promise().then(() => promiseWhile(condition, promise));
    }
    return Promise.resolve();
}

module.exports = Brain;
