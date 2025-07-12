import { defineStore } from 'pinia'

export const userDataStore = defineStore('userData', {
  state: () => ({ correctAnswers: [], currentWords: [], currentCorrectAnswer: null }),
  getters: {
    getCorrectAnswers: (state) => state.correctAnswers,
    getCurrentWords: (state) => state.currentWords,
    getCurrentCorrectAnswer: (state) => state.currentCorrectAnswer
  },
  actions: {
    addCorrectAnswer(answer) {
      this.correctAnswers.push(answer)
    },
    setCurrentWords(words) {
      this.currentWords = words
    },
    setCurrentCorrectAnswer(answer) {
      this.currentCorrectAnswer = answer
    },
    resetCurrentWords() {
      this.currentWords = []
      this.currentCorrectAnswer = null
    }
  },
  persist: true
})
