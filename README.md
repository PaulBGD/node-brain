# node-brain
node-brain is a useless library for creating stupid chat bots

## Installation

```
npm install --save --production node-brain
```

## Usage

```javascript
const Brain = require('./src/Brain');
const brain = new Brain();

const sentences = [
    'Tomorrow comes asking for bread.',
    'Two-finger John is running away.',
    'Pinocchio likes to have a shower in the morning.',
    'A shooting star says hello.',
    'Nothingness loves to love.',
    'Wondrous awe makes people shiver.',
    'Stew and rum runs through everything.',
    'A sickingly prodigous profile is often pregnant.',
    'Stew and rum is often one floor above you.',
    'Too long a stick is good for you.',
    'A shooting star is belief in the interrelatedness of all things.',
    'Sixty-four comes asking for bread.',
    'That way asked you a question?',
    'That memory we used to share could please even the most demanding follower of Freud.',
    'Clear water is ever present.',
    'Utter nonsense slips on a banana peel.',
    'Enqoyism is not enough.',
    'Organisational culture was always the second best.',
    'Too long a stick would die for a grapefruit!',
    'Abstraction woke the prime minister.',
    'Two-finger John tells the tale of towers.',
    'Passion or serendipity can get both high and low.'
];

Promise.all(sentences.map(sentence => brain.addSentence(sentence))) // add our sentences to the brain
    .then(() => brain.getSentence('a')) // get a sentence based off of the word 'a'. use '' for a completely random sentences
    .then(sentence => console.log(sentence))
    .catch(error => console.error(error)); // make sure to handle errors!
```


## API

```
module.exports = { Brain, Quad, MemoryProvider }
```


### Brain

- `new Brain(options: Options)`
- `Brain#getSentence(word: String, callback?: (error: Error, sentence: String)): Promise<String>`
- `Brain#addSentence(sentence: String, callback?: (error: Error, success: boolean)): Promise<Boolean>`

### Options

- `validCharacters`: a list of valid characters that constitute words. changing this will make other languages parseable
- `provider`: a provider instance. check the built in `MemoryProvider` for an example

### Quad

- `new Quad(o1, o2, o3, o4)`
- `Quad#o1, Quad#o2, Quad#o3, Quad#o4`
- `Quad#canEnd, Quad#canStart`

## Sample Usages:

- A really, really good random sentence generator
- Dumb chat bots

## Providers

Currently the only provider provided is the MemoryProvider. However since all of the methods return a promise, you can in theory store the Brain's information in a database. In the future we may provide a separate package for SQL based databases.
