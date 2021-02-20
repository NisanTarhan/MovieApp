import data from './data.js'
import { searchMovieByTitle, makeBgActive } from './helpers.js'

class MoviesApp {
    constructor(options) {
        const {
            root,
            searchInput,
            searchForm,
            yearHandler,
            yearSubmitter,
            yearFilter,
            genreFilter,
            genreSubmitter,
        } = options
        this.$tableEl = document.getElementById(root)
        this.$tbodyEl = this.$tableEl.querySelector('tbody')

        this.$searchInput = document.getElementById(searchInput)
        this.$searchForm = document.getElementById(searchForm)
        this.yearHandler = yearHandler
        this.$yearSubmitter = document.getElementById(yearSubmitter)
        this.$yearFilter = document.getElementById(yearFilter)

        this.$genreFilter = document.getElementById(genreFilter)
        this.$genreSubmitter = document.getElementById(genreSubmitter)
    }

    createMovieEl(movie) {
        const { image, title, genre, year, id } = movie
        return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }

    createInputElement(value, count, name, type) {
        return `<div class="form-check">
        <input class="form-check-input" name="${name}" type=${type} value="${value}" id="${value}" >
        <label class="form-check-label" for="${value}">
        ${value} (${count})
        </label>
    </div>`
    }

    fillTable() {
        const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur)
        }, '')

        this.$tbodyEl.innerHTML = moviesHTML
    }

    generateFilters(filterTypeArray) {
        function fillCategoryFilter(category, inputType, filterElement) {
            let filterKeys = Object.keys(filterTypeArray)

            const filterArr = filterKeys
                .map((item) => {
                    return this.createInputElement(item, filterTypeArray[item], category, inputType)
                })
                .join('')
            filterElement.innerHTML += filterArr
        }

        return fillCategoryFilter.bind(this)
    }

    getValuesFromObject(category) {
        let categorys = data.map((obj) => `${obj[category]}`)
        return categorys.reduce(function (acc, category) {
            if (!acc[category]) {
                acc[category] = 0
            }
            acc[category]++
            return acc
        }, {})
    }
    getGenres() {
        let genres = this.getValuesFromObject('genre')

        const genreFunction = this.generateFilters(genres)
        genreFunction('genre', 'checkbox', this.$genreFilter)
    }

    getYears() {
        let years = this.getValuesFromObject('year')

        const yearFunction = this.generateFilters(years)
        yearFunction('year', 'radio', this.$yearFilter)
    }

    reset(itemName) {
        this.$tbodyEl.querySelectorAll('tr').forEach((item) => {
            item.style.background = 'transparent'
        })
        document.querySelectorAll(`input:checked`).forEach((item) => {
            if (item.name != itemName) item.checked = false
        })
    }

    handleSearch() {
        this.$searchForm.addEventListener('submit', (event) => {
            event.preventDefault()
            this.reset()
            const searchValue = this.$searchInput.value
            const matchedMovies = data
                .filter((movie) => {
                    return searchMovieByTitle(movie, searchValue)
                })
                .forEach(makeBgActive)
            this.$searchInput.value = ''
        })
    }

    handleCategoryFilter(elementToListen, elementName) {
        elementToListen.addEventListener('click', () => {
            this.reset(elementName)
            const selectedElements = document.getElementsByName(elementName)
            selectedElements.forEach((element) => {
                if (element.checked) {
                    const matchedMovies = data
                        .filter((movie) => {
                            return movie[elementName] === element.value
                        })
                        .forEach(makeBgActive)
                }
            })
        })
    }

    init() {
        this.fillTable()
        this.handleSearch()
        this.getGenres()
        this.getYears()

        this.handleCategoryFilter(this.$yearSubmitter, this.yearHandler)
        this.handleCategoryFilter(this.$genreSubmitter, 'genre')
    }
}

let myMoviesApp = new MoviesApp({
    root: 'movies-table',
    searchInput: 'searchInput',
    searchForm: 'searchForm',
    yearHandler: 'year',
    yearSubmitter: 'yearSubmitter',
    genreFilter: 'genre-filter',
    yearFilter: 'year-filter',
    genreSubmitter: 'genre-submitter',
})

myMoviesApp.init()