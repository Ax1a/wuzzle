import { userDataStore } from '../stores/user_data'

/*
 * Credits to the original author for the word list.
 * @see {@link https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b#file-wordle-answers-alphabetical-txt|Original Word List by cfreshman on GitHub}
 */
export async function fetchWordList(WORD_LENGTH = 5) {
  const res = await fetch('/word_list.txt')
  const text = await res.text()
  return text
    .split('\n')
    .map((w) => w.trim())
    .filter((w) => w.length === WORD_LENGTH)
}

export async function isWordInTheList(wordArr, WORD_LENGTH = 5) {
  const wordList = await fetchWordList(WORD_LENGTH)
  const word = wordArr
    .map((i) => i.letter)
    .join('')
    .toLowerCase()
  return wordList.includes(word)
}

export function getRandomWord(wordList) {
  if (wordList.length === 0) wordList = wordListTemp
  const idx = Math.floor(Math.random() * wordList.length)
  return wordList[idx].toUpperCase()
}

export function buildBoard(NO_OF_TRIES = 6, WORD_LENGTH = 5) {
  const words = []
  for (let i = 0; i < NO_OF_TRIES; i++) {
    const row = []
    for (let j = 0; j < WORD_LENGTH; j++) {
      row.push({
        letter: '',
        status: ''
      })
    }
    words.push(row)
  }
  return words
}

export function mapWordLetters(answer) {
  return answer.split('').map((letter) => letter.toUpperCase())
}

export function hasEmptyCells(words, currentRowIndex) {
  return words[currentRowIndex].some((cell) => cell.letter === '')
}

export function pastGameIsGameOver() {
  const store = userDataStore()
  const currentWords = store.getCurrentWords
  return (
    currentWords.length > 0 &&
    (currentWords.find((row) => row.every((cell) => cell.status === 'correct')) !== undefined ||
      currentWords[currentWords.length - 1].every((cell) => cell.status !== ''))
  )
}
