import { defineStore } from 'pinia'

export const userDataStore = defineStore('userData', {
  state: () => ({ correctAnswers: [], currentWords: [], currentCorrectAnswer: null }),
  getters: {
    getCorrectAnswers: (state) => state.correctAnswers,
    getCurrentWords: (state) => state.currentWords,
    getCurrentCorrectAnswer: (state) => {
      if (!state.encodedAnswer) return null
      try {
        return atob(state.encodedAnswer)
      } catch (e) {
        return null
      }
    }
  },
  actions: {
    addCorrectAnswer(answer) {
      this.correctAnswers.push(answer)
    },
    setCurrentWords(words) {
      this.currentWords = words
    },
    setCurrentCorrectAnswer(answer) {
      this.currentCorrectAnswer = btoa(answer)
    },
    resetCurrentWords() {
      this.currentWords = []
      this.currentCorrectAnswer = null
    }
  },
  persist: true
})
