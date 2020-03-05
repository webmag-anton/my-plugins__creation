'use strict'

class ProgressBar {
	// если при создании нового экземпляра мы в параметры не 
	// передадим объект с опциями, то он будет равен пустому объекту
	constructor(options = {}) {
		// деструктурируем опции; ставим дефолтные значения, на случай если их не передали
		const {
			start = 10,
			end = 100,
			height = 20, 
			bg = 'green',
			textColor = 'white',
			border = '2px solid brown'
		} = options 

		this.start = start
		this.end = end
		this.height = height
		this.bg = bg
		this.textColor = textColor
		this.border = border
	}

	// init - единственный публичный метод, о котором должен знать пользователь 
	// защищенные методы, начинающиеся с _ являются инкапсулироваными: о них пользователь не должен знать

	init(selector) { // метод init добавляет внутрь выбранного элемента progressBar из метода _createProgressBar  -1-
		document.querySelector(selector).append( this._createProgressBar() )
	}

	_createProgressBar() { // метод _createProgressBar создает progressBar внутрь которого добавляет bar из метода _createBar  -2-
		const progressBar = document.createElement('div')
		const bar = this._createBar()
		progressBar.style.width = '100%'
		progressBar.style.border = this.border
		progressBar.append(bar)
		this._animateBar(bar) // и анимирует этот внутренний бар методом _animateBar
		return progressBar
	}

	_createBar() { // метод _createBar создает bar  -3-
		const bar = document.createElement('div')
		bar.style.cssText = `
			text-align: center;
			background-color: ${this.bg};
			height: ${this.height}px;
			line-height: ${this.height}px;
			color: ${this.textColor};
		`
		this._stateProgress(bar) // и задает ширину bar и проценты внутри bar методом _stateProgress
		return bar
	}

	_stateProgress(elem) {  //  -4- , 					-6, 7, 8... (вызов из рекурсии пока выполняется условие в анимации)-
		elem.style.width = `${this.start}%`
		elem.textContent = `${this.start}%`
	}

	_animateBar(bar) { // метод для анимации bar  -5-
		const animate = () => {
			if (this.start < this.end) {
				this.start++;
				this._stateProgress(bar)
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	}

}


// наследуем от ProgressBar
class RoundedProgressBar extends ProgressBar {
	constructor(options) {
		super(options)
		// перед расширением свойств в конструкторе вызываем метод super
		this.rounded = options.rounded || '5px'
	}

	// изменяем (расширяем) метод _createProgressBar - пример полиморфизма (изменяем одноименный родительский метод)
	_createProgressBar() {
		const progressBar = super._createProgressBar() // вызов родительского методв
		this._roundedBar(progressBar)
		return progressBar
	}

	_roundedBar(elem) {
		elem.style.borderRadius = this.rounded
		elem.style.overflow = 'hidden'
	}
}