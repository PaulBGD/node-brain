import { join } from 'path';
import { exists, mkdir, writeFile, appendFile, readFile, readdir } from 'fs';

import { Quad } from './Quad';

export class FileSystemProvider {
    constructor(directory) {
        this.directory = directory;
        this.quadsDir = join(directory, 'quads');
        this.wordsDir = join(directory, 'words');
        this.previousDir = join(directory, 'previous');
        this.nextDir = join(directory, 'next');
    }

    initialize() {
        const { directory, quadsDir, wordsDir, previousDir, nextDir } = this;

        let promise = Promise.resolve();

        [ directory, quadsDir, wordsDir, previousDir, nextDir ].forEach(dir => {
            promise = promise.then(() => new Promise((resolve, reject) => {
                exists(dir, exists => {
                    if (exists) {
                        return resolve();
                    }
                    mkdir(dir, error => error ? reject(error) : resolve());
                })
            }));
        });

        return promise;
    }

    addQuad(quad) {
        return new Promise((resolve, reject) => {
            writeFile(join(this.quadsDir, sanitize(quad.toPartsString())), quad.toString(), 'utf8', error => error ? reject(error) : resolve());
        });
    }

    addWord(quad, word) {
        return new Promise((resolve, reject) => {
            appendFile(join(this.wordsDir, sanitize(word.toLowerCase())), quad.toString() + '\n', 'utf8', error => error ? reject(error) : resolve());
        });
    }

    addPrevious(quad, previous) {
        return new Promise((resolve, reject) => {
            appendFile(join(this.previousDir, sanitize(quad.toPartsString())), previous + '\n', 'utf8', error => error ? reject(error) : resolve());
        });
    }

    addNext(quad, next) {
        return new Promise((resolve, reject) => {
            appendFile(join(this.nextDir, sanitize(quad.toPartsString())), next + '\n', 'utf8', error => error ? reject(error) : resolve());
        });
    }

    getMiddleQuad(word) {
        return new Promise((resolve, reject) => {
            const wordFile = join(this.wordsDir, sanitize(word.toLowerCase()));

            exists(wordFile, exists => {
                if (exists) {
                    readFile(wordFile, 'utf8', (error, contents) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(Quad.fromString(getRandom(contents.split('\n').slice(0, -1))));
                    });
                } else {
                    readdir(this.quadsDir, (error, files) => {
                        if (error) {
                            return reject(error);
                        }
                        const file = join(this.quadsDir, getRandom(files));
                        readFile(file, 'utf8', (error, contents) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(Quad.fromString(contents));
                        });
                    })
                }
            });
        });
    }

    getNextPossibleWord(quad) {
        return new Promise((resolve, reject) => {
            const file = join(this.nextDir, sanitize(quad.toPartsString()));

            readFile(file, 'utf8', (error, contents) => {
                if (error) {
                    return reject(error);
                }
                resolve(getRandom(contents.split('\n').slice(0, -1)));
            });
        });
    }

    getPreviousPossibleWord(quad) {
        return new Promise((resolve, reject) => {
            const file = join(this.previousDir, sanitize(quad.toPartsString()));

            readFile(file, 'utf8', (error, contents) => {
                if (error) {
                    return reject(error);
                }
                resolve(getRandom(contents.split('\n').slice(0, -1)));
            });
        });
    }

    getQuad(quad) {
        return new Promise((resolve, reject) => {
            const file = join(this.quadsDir, sanitize(quad.toPartsString()));

            readFile(file, 'utf8', (error, contents) => {
                if (error) {
                    return reject(error);
                }
                resolve(Quad.fromString(contents));
            });
        });
    }
}

function getRandom(array) {
    return array[ Math.floor(array.length * Math.random()) ];
}

function sanitize(filename) {
    return Buffer.from(filename).toString('base64').replace(/\//g, '_');
}