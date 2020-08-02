// используются data-аттрибуты для js логики;  а классы - только для стилизации в scss

const getTemplate = (data = [], placeholder, selectedId) => {
   let text = placeholder || 'Placeholder по умолчанию'

   const items = data.map(item => {
      let cls = ''
      // если указали в опциях selectedId
      if (item.id === selectedId) {
         text = item.value
         cls = 'selected'
      }
      return `
         <li class='select__item ${cls}' data-type='item' data-id='${item.id}'>${item.value}</li>
      `
   })

   return `
      <div class='select__backdrop' data-type='backdrop'></div>

      <div class='select__input' data-type='input'>
         <span data-type='value'>${text}</span>
         <i class='fa fa-chevron-down' data-type='arrow'></i>
      </div>

      <div class='select__dropdown'>
         <ul class='select__list'>
            ${items.join('')}
         </ul>
      </div>
   `
}

export class Select {
   constructor(selector, options) {
      this.$el = document.querySelector(selector)
      this.options = options
      this.selectedId = options.selectedId
      
      this.#render()
      this.#setup()
   }

   // рендерим селект
   #render() {          // приватный метод, доступен только внутри класса Select
      const { placeholder, data } = this.options

      this.$el.classList.add('select')
      this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
   }

   // устанавливаем прослушку
   #setup() {
      this.clickHandler = this.clickHandler.bind(this) // привязываем контекст обработчику
      this.$el.addEventListener('click', this.clickHandler)

      // получаем стрелку и placeholder
      this.$arrow = this.$el.querySelector('[data-type="arrow"]')
      this.$value = this.$el.querySelector('[data-type="value"]')
   }

   clickHandler(e) {
      // деструктурируем значение аттрибута data-type
      const { type } = e.target.dataset
      
      if (e.target.closest('[data-type="input"]')) { // если кликнули по инпуту
         this.toggle()
      } else if (type === 'item') {
         const id = e.target.dataset.id
         this.select(id)
      } else if (type === 'backdrop') {
         this.close()
      }
   }

   get isOpen() {
      return this.$el.classList.contains('open')
   }

   // геттер для получения выбранного option'a 
   get current() {
      return this.options.data.find(item => item.id === this.selectedId)
   }

   select(id) {
      // меняем selectedId, которое и повлияет на current, value которого подставляем в placeholder
      this.selectedId = id
      this.$value.textContent = this.current.value

      this.$el.querySelectorAll('[data-type="item"]').forEach(el => {
         el.classList.remove('selected')
      })
      this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

      this.options.onSelect ? this.options.onSelect(this.current) : null

      this.close()
   }

   // открывает/закрывает select, в зависимости от наличая класса 'open', c помощью геттера isOpen
   toggle() {
      this.isOpen ? this.close() : this.open()
   }

   open() {
      this.$el.classList.add('open')
      this.$arrow.classList.remove('fa-chevron-down')
      this.$arrow.classList.add('fa-chevron-up')
   }

   close() {
      this.$el.classList.remove('open')
      this.$arrow.classList.add('fa-chevron-down')
      this.$arrow.classList.remove('fa-chevron-up')
   }

   // удаляем прослушку
   desroy() {
      this.$el.removeEventListener('click', this.clickHandler)
      this.$el.innerHTML = ''
   }
}