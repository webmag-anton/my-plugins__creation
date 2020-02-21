'use strict'

// защищенная (системная) ф-я; доступна в глобальном объекте Window (в глобальном scope),
// но не является св-вом Window (т.к. не var); если был бы подключен Webpack была бы модульность 
function _createModal(options) {
	const modal = document.createElement('div')
	modal.classList.add('my-modal')
	modal.insertAdjacentHTML('afterbegin', `
		<div class="modal-overlay">
			<div class="modal-window">
				<div class="modal-header">
					<div class="modal-title">
						${(typeof options.title == 'string' && options.title) || 'default title'}
					</div>
					<div class="modal-close">&times;</div>
				</div>
				<div class="modal-body">
					${options.content || 
						`	<p>Lorem ipsum dolor sit.</p>
							<p>Lorem ipsum dolor sit.</p>`
					}
				</div>
				<div class="modal-footer">
					<button>ok</button>
					<button>cancel</button>
				</div>
			</div>
		</div>
	`)

	if (typeof options.width == 'string') { 
		modal.querySelector('.modal-window').style.width = options.width
	}
	modal.querySelector('.modal-overlay').style.transition = 
		`${(typeof options.duration == 'number' && options.duration) || 300}ms ease`
	modal.querySelector('.modal-window').style.transition = 
		`${(typeof options.duration == 'number' && options.duration) || 300}ms ease`
	
	document.body.append(modal)
	return modal
}

// ф-я замыкает в себе ссылку на модальное окно, доступ к которой есть только из методов
$.modal = function (options) {
	// удобно называть DOM-node элементы начиная с символа $, что б отличать от обычных переменных
	const $modal = _createModal(options)

	let _animationDurationMs = (typeof options.duration == 'number' && options.duration) || 300 

	// создаем событие открытия модалки
	let openEvent = new CustomEvent('modalOpen')
	// создаем событие закрытия модалки
	let closeEvent = new CustomEvent('modalClose')
	// создаем событие перед закрытием модалки
	let beforeCloseEvent = new CustomEvent('beforeModalClose')

	let modalMethods = { // возвращаем объект с методами модалки
		open() {
			$modal.classList.add('open')
			// запускаем событие 
			setTimeout( () => {
				$modal.dispatchEvent(openEvent)
			}, _animationDurationMs)
		},
		close() {
			let agreement = confirm('Закрыть модалку?')
			if (agreement) {
				$modal.dispatchEvent(beforeCloseEvent)
			} else {
				return
			}

			$modal.classList.remove('open')
			// запускаем событие 
			setTimeout( () => {
				$modal.dispatchEvent(closeEvent)
			}, _animationDurationMs)
		},
		destroy() {
			if ($modal.classList.contains('open')) {
				$modal.classList.remove('open')
				setTimeout( () => $modal.remove(), _animationDurationMs)
			} else {
				$modal.remove()
			}
			$modal.removeEventListener('click', closeHandler)
		},
		setContent(newContent) {
			$modal.querySelector('.modal-body').textContent = newContent
		},
		onOpen(func) {
			$modal.addEventListener('modalOpen', func)
		},
		onClose(func) {
			$modal.addEventListener('modalClose', func)
		},
		beforeClose(func) {
			$modal.addEventListener('beforeModalClose', func)
		}
	}

	function closeHandler(e) {
		if (e.target == $modal.querySelector('.modal-close') || e.target == $modal.querySelector('.modal-overlay')) {
			modalMethods.close()
		}
	}

	if (typeof options.closable == 'boolean' && options.closable) {
		$modal.classList.add('closable')
		$modal.addEventListener('click', closeHandler)
	}

	return modalMethods
}