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

	init(selector) { // метод init добавляет внутрь выбранного элемента progressBar из метода createProgressBar  -1-
		document.querySelector(selector).append(this.createProgressBar())
	}

	createProgressBar() { // метод createProgressBar создает progressBar внутрь которого добавляет bar из метода createBar  -2-
		const progressBar = document.createElement('div')
		const bar = this.createBar()
		progressBar.style.width = '100%'
		progressBar.style.border = this.border
		progressBar.append(bar)
		this.animateBar(bar) // и анимирует этот внутренний бар методом animateBar
		return progressBar
	}

	createBar() { // метод createBar создает bar  -3-
		const bar = document.createElement('div')
		bar.style.cssText = `
			text-align: center;
			background-color: ${this.bg};
			height: ${this.height}px;
			line-height: ${this.height}px;
			color: ${this.textColor};
		`
		this.stateProgress(bar) // и задает ширину bar и проценты внутри bar методом stateProgress

		return bar
	}

	stateProgress(elem) {  //  -4- , 					-6, 7, 8... (вызов из рекурсии пока выполняется условие в анимации)-
		elem.style.width = `${this.start}%`
		elem.textContent = `${this.start}%`
	}

	animateBar(bar) { // метод для анимации bar  -5-
		const animate = () => {
			if (this.start < this.end) {
				this.start++;
				this.stateProgress(bar)
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
		// перед расширением свойств в конструкторе вызывакм метод super
		this.rounded = options.rounded || '5px'
	}

	// изменяем (расширяем) метод createProgressBar
	createProgressBar() {
		const progressBar = super.createProgressBar()
		this.roundedBar(progressBar)
		return progressBar
	}

	roundedBar(elem) {
		elem.style.borderRadius = this.rounded
		elem.style.overflow = 'hidden'
	}
}