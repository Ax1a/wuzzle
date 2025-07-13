<template>
  <div class="flex flex-col min-h-screen overflow-x-hidden">
    <Dialog :visible="isDialogVisible" :is-correct="isCorrect" :word="answer" @close="closeDialog" @new-word="getNewWord" />
    <main class="flex flex-row flex-wrap items-center justify-center flex-grow w-screen h-full gap-3 py-8 sm:gap-5 lg:gap-10 md:py-16">
      <div class="flex flex-col items-center gap-5 lg:gap-14">
        <h1 class="text-6xl font-bold text-white">Wuzzle</h1>
        <div class="flex flex-col items-center gap-2">
          <div v-for="(row, rowIndex) in words" :key="rowIndex" class="flex flex-row gap-2">
            <div
              :class="[
                'flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 border rounded-md transition-colors duration-200',
                {
                  'bg-teal-900/40 border-teal-400/40': !col.status,
                  'bg-gray-600 border-gray-400 text-white': col.status === 'absent',
                  'bg-green-500 border-green-300 text-white': col.status === 'correct',
                  'bg-yellow-500 border-yellow-300 text-black': col.status === 'present'
                }
              ]"
              v-for="(col, colIndex) in row"
              :key="colIndex"
            >
              <span class="text-2xl font-bold sm:text-4xl text-gray-50 animate-fade animate-duration-200" :key="col.letter">{{ col.letter }}</span>
            </div>
          </div>
          <button
            @click="getNewWord"
            :class="[
              'w-full px-5 py-3 lg:mt-5 font-medium text-white duration-200 bg-green-700 rounded-md hover:bg-green-800',
              isGameOver && !isDialogVisible ? 'visible' : 'invisible'
            ]"
          >
            New Word
          </button>
        </div>
      </div>
      <Keyboard @keyPress="handleKeyPress" />
    </main>
    <Footer />
  </div>
</template>
<script setup>
  import Footer from './components/Footer.vue'
  import Dialog from './components/Dialog.vue'
  import Keyboard from './components/Keyboard.vue'
  import { userDataStore } from './stores/user_data'
  import { fetchWordList, getRandomWord, buildBoard, mapWordLetters, hasEmptyCells, pastGameIsGameOver } from './utils'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const NO_OF_TRIES = 6
  const WORD_LENGTH = 5
  const words = ref([])
  const answer = ref('')
  const isDialogVisible = ref(false)
  const store = userDataStore()
  let wordToGuess = []
  let currentRowIndex = 0
  let currentColIndex = 0
  let isCorrect = ref(false)
  let isGameOver = false
  let wordList = []

  onMounted(async () => {
    wordList = await fetchWordList(WORD_LENGTH)
    if (pastGameIsGameOver()) {
      store.resetCurrentWords()
    }
    getAnswer()
    setupRowAndColumn()
    // Event listener for keyboard input
    window.addEventListener('keydown', (e) => handleKeyPress(e, true))
    // store.resetCurrentWord()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', (e) => handleKeyPress(e, true))
  })

  function handleKeyPress(event, listener = false) {
    if (isCorrect.value || isDialogVisible.value) return
    const key = listener ? event.key : event
    if (listener && (event.ctrlKey || event.altKey || event.metaKey)) return
    if (key === 'Enter') {
      checkAnswer()
    } else if (key === 'Backspace') {
      removeLetter()
    } else if (key.length === 1 && key.match(/^[A-Za-z]+$/) && hasEmptyCells(words.value, currentRowIndex)) {
      addLetter(key.toUpperCase())
    }
    store.setCurrentWords(words.value)
  }

  function checkAnswer() {
    if (currentColIndex < WORD_LENGTH) return
    words.value[currentRowIndex].forEach((col, index) => {
      if (col.letter === wordToGuess[index]) {
        col.status = 'correct'
      } else if (wordToGuess.includes(col.letter)) {
        col.status = 'present'
      } else {
        col.status = 'absent'
      }
    })
    if (words.value[currentRowIndex].every((col) => col.status === 'correct')) {
      gameOver(true)
      return
    }

    currentRowIndex++
    if (currentRowIndex >= NO_OF_TRIES) {
      gameOver(false)
      return
    }
    currentColIndex = 0
  }

  function gameOver(correct) {
    isGameOver = true
    isCorrect.value = correct
    isDialogVisible.value = true
    /* Store the correct answer in user data
      Correct answers will be filtered out on the words list */
    if (correct) {
      store.addCorrectAnswer(answer.value)
    }
    store.resetCurrentWords()
  }

  function removeLetter() {
    if (currentColIndex === 0) return
    words.value[currentRowIndex][currentColIndex - 1].letter = ''
    currentColIndex--
  }

  function addLetter(letter) {
    if (currentRowIndex < NO_OF_TRIES) {
      words.value[currentRowIndex][currentColIndex].letter = letter
      // console.log(words.value)
      currentColIndex++
    } else {
      currentColIndex = 0
      currentRowIndex++
    }
  }

  function getNewWord() {
    isDialogVisible.value = false
    currentColIndex = 0
    currentRowIndex = 0
    isGameOver = false
    isCorrect.value = false
    store.resetCurrentWords()
    // Setup words and answer for the new game
    getAnswer()
    words.value = buildBoard(NO_OF_TRIES, WORD_LENGTH)
  }

  function getAnswer() {
    const currentAnswer = store.getCurrentCorrectAnswer ?? null
    if (!currentAnswer) {
      answer.value = getRandomWord(wordList)
      store.setCurrentCorrectAnswer(answer.value)
      wordToGuess = mapWordLetters(answer.value)
    } else {
      answer.value = currentAnswer
      wordToGuess = mapWordLetters(currentAnswer)
    }
  }

  function setupRowAndColumn() {
    if (store.getCurrentWords && store.getCurrentWords.length > 0) {
      words.value = store.getCurrentWords
      currentRowIndex = words.value.findLastIndex((row) => row.some((col) => col.letter !== '' && col.status !== ''))
      currentRowIndex++
      const currentCol = words.value[currentRowIndex].findIndex((col) => col.letter === '')
      currentColIndex = currentCol !== -1 ? currentCol : WORD_LENGTH
    } else {
      words.value = buildBoard(NO_OF_TRIES, WORD_LENGTH)
    }
  }

  function closeDialog() {
    isDialogVisible.value = false
  }
</script>
