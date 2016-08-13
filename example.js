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
