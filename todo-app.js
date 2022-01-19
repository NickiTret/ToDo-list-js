(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');
        button.disabled = true;
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        //   input.setAttribute("required", true);
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        let count = 0;
        if (button.value.length === 0) { button.disabled = true; } else if (button.value = '') { button.disabled = true; }

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,

        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;

    }




    let defaultLS = [];

    function createTodoApp(container, title = 'Список дел', dataFromStorage) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        function checkInput(elem) {
            elem.input.addEventListener('keyup', function() {
                if (this.value.length === 0) {
                    elem.button.disabled = true;
                } else {
                    elem.button.disabled = false;
                }
            });
        };

        if (dataFromStorage !== null) {
            defaultLS = dataFromStorage;
            if (localStorage.getItem(title)) {
                defaultLS = JSON.parse(localStorage.getItem(title));
            }
            if (Array.isArray(defaultLS)) {
                defaultLS.forEach(item => {
                    let todoList = document.querySelector('ul');
                    let itemElement = createTodoItem(item.name, item.done, item.id);
                    todoList.append(itemElement.item);
                    itemElement.doneButton.addEventListener('click', () => toggleDone(itemElement.item, title));
                    itemElement.deleteButton.addEventListener('click', () => deleteItem(itemElement.item, title, defaultLS, item.id));
                    if (itemElement.done === true) {
                        itemElement.classList.add('list-group-item-success');
                        toggleDone(itemElement.item, title)
                    }
                    saveItem(title, defaultLS);
                    console.log(itemElement.item.id)
                });
            }

        } else {
            localStorage.setItem(title, JSON.stringify(defaultLS));
            defaultLS = JSON.parse(localStorage.getItem(title));
        }





        console.log(defaultLS);

        checkInput(todoItemForm);
        buttonList();

        function buttonList() {
            let todoItemForm = document.querySelector('.input-group');
            let inputTodo = document.querySelector('.form-control');
            let todoList = document.querySelector('ul');
            todoItemForm.addEventListener('submit', function(e) {
                e.preventDefault();

                function NewLi(name) {
                    this.name = name;
                    this.done = false;
                    this.id = Date.now();

                };
                if (!inputTodo.value) {
                    return;
                }
                let todoItem = createTodoItem(inputTodo.value);
                todoList.append(todoItem.item);
                let itemObject = new NewLi(inputTodo.value);
                defaultLS.push(itemObject);
                inputTodo.value = '';
                todoItem.doneButton.addEventListener('click', () => toggleDone(todoItem.item, title));
                todoItem.deleteButton.addEventListener('click', () => deleteItem(todoItem.item, title, defaultLS, itemObject.id));
                saveItem(title, defaultLS);
                console.log(defaultLS)

            });
        };
    }

    function createTodoItem(name, done) {
        let itemList = document.querySelector('ul');
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        if (done) { item.classList.add('list-group-item-success'); }
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;




        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);



        return {
            item,
            doneButton,
            deleteButton,

        };
    }

    function saveItem(title, arrayAll) {
        localStorage.setItem(title, JSON.stringify(arrayAll));
        //   let newArray = localStorage.setItem(title, JSON.stringify(arrayAll));
        //   return newArray

    };

    function deleteItem(item, storageKey, array, index) {

        if (confirm('Вы уверены?')) {
            item.remove();
            let itemId = array.findIndex(el => el.id === index);
            if (itemId >= 0) { array.splice(itemId, 1); }
            saveItem(storageKey, array);

        }

    };

    function toggleDone(item, storageKey) { //- на вход передаем todoItem и ключ localStorage

        item.classList.toggle('list-group-item-success'); //- добавляем/убираем класс для стилизации кнопки
        const isDone = item.classList.contains('list-group-item-success'); //- проверяем есть ли класс, чтобы понять текущий статус
        const idx = itemIndex(item); //- тут добавим отдельную функцию которая определяет индекс <li> внутри <ul> списка задач, чтобы редактировать объект с соответствующим индексом в массиве объектов
        let dataFromStorage = JSON.parse(localStorage.getItem(storageKey)); //- получаем наш массив объектов из localStorage
        dataFromStorage[idx].done = isDone; //- проставляем статус задачи у необходимого объекта, который мы ранее определили по классу
        localStorage.setItem(storageKey, JSON.stringify(dataFromStorage)); //- сохраняем измененный массив в localStorage
        if (item.done === true) {
            item.classList.add('list-group-item-success');
        }

        console.log(item)

        function itemIndex(item) {
            const list = item.parentElement; //- находим родителя < ul >
            const elements = Array.from(list.children); //- преобразуем список < li > в массив
            return elements.indexOf(item); //- определяем индекс нашего входящего < li >
        };
        saveItem(storageKey, dataFromStorage);
    };

    window.createTodoApp = createTodoApp;
})();