import data from './data.js'
import { searchMovieByTitle, makeBgActive } from './helpers.js'

class MoviesApp {
    constructor(options) {
        const {
            root,
            searchInput,
            searchForm,
            yearSubmitter,
            yearFilter,
            genreFilter,
            genreSubmitter,
        } = options
        this.$tableEl = document.getElementById(root)
        this.$tbodyEl = this.$tableEl.querySelector('tbody')

        this.$searchInput = document.getElementById(searchInput)
        this.$searchForm = document.getElementById(searchForm)
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

    generateFuncToFillFilterSection(filterTypeObject) {
        function fillFilterSection(filterType, inputType, filterElement) {
            let filterKeys = Object.keys(filterTypeObject)

            const filterArr = filterKeys
                .map((item) => {
                    return this.createInputElement(item, filterTypeObject[item], filterType, inputType)
                })
                .join('')
            filterElement.innerHTML += filterArr
        }

        return fillFilterSection.bind(this)
    }

    getFiltersObjectWithAmountByType(filterType) {
        let filters = data.map(item => item[filterType])
        const amountOfFilterItem = filters.reduce((acc, curr) => {
            if (!acc[curr]) {
                acc[curr] = 0
            }
            acc[curr]++
            return acc
        }, {})
        return amountOfFilterItem
    }

    getFilters(filterType, inputType, filterElement) {
        let filtersWithAmount = this.getFiltersObjectWithAmountByType(filterType)

        const fillFilter = this.generateFuncToFillFilterSection(filtersWithAmount)
        fillFilter(filterType, inputType, filterElement)
    }

    reset(itemName) {
        this.$tbodyEl.querySelectorAll('tr').forEach((item) => {
            item.style.background = 'transparent'
        })
        document.querySelectorAll(`input:checked`).forEach((item) => {
            if (item.name != itemName) item.checked = false
        })
        if (itemName) {
            this.$searchInput.value = '';
        }
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
            matchedMovies.forEach(makeBgActive)
            this.$searchInput.value = ''
        })
    }

    handleFilterElementClick(buttonElement, elementName) {
        buttonElement.addEventListener('click', () => {
            this.reset(elementName)
            const selectedElements = document.getElementsByName(elementName)
            selectedElements.forEach((element) => {
                if (element.checked) {
                    const matchedMovies = data
                        .filter((movie) => {
                            return movie[elementName] === element.value
                        })
                    matchedMovies.forEach(makeBgActive)
                }
            })
        })
    }

    init() {
        this.fillTable()
        this.handleSearch()
        this.getFilters('genre', 'checkbox', this.$genreFilter)
        this.getFilters('year', 'radio', this.$yearFilter)

        this.handleFilterElementClick(this.$yearSubmitter, 'year')
        this.handleFilterElementClick(this.$genreSubmitter, 'genre')
    }
}

let myMoviesApp = new MoviesApp({
    root: 'movies-table',
    searchInput: 'searchInput',
    searchForm: 'searchForm',
    yearSubmitter: 'yearSubmitter',
    genreFilter: 'genre-filter',
    yearFilter: 'year-filter',
    genreSubmitter: 'genre-submitter',
})

myMoviesApp.init()