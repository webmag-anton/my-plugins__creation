'use strict'

// вызов метода создает модальное окно и возвращает 
// объект с методами для управления модалкой
const firstModal = $.modal({
	title: 'My custom modal header',
	closable: true,
	content: `<p>some custom content for modal window...</p>`,
	width: '500px',
	duration: 500
})

// setTimeout( firstModal.destroy, 9000 )

const modalBtn = document.querySelector('.modal-btn')
modalBtn.addEventListener('click', function() {
	firstModal.open()
	setTimeout( () => {
		firstModal.setContent('new content from method setContent')
	}, 2500)
})

firstModal.onOpen( () => {
	console.log('modal has been opened, method onOpen()')
})
firstModal.onClose( () => {
	console.log('modal has been closed, method onClose()')
})
firstModal.beforeClose( () => {
	console.log('now modal is going to be closed, method beforeClose()')
})