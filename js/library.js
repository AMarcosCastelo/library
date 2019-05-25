// Book
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}
// End of Book

function validateForm(book) {
    if(book.title == '' || book.author == '' || book.pages == '') {
        return false;
    } 
    return true;
}

// LocalBd
function LocalBd() {

    let id = localStorage.getItem('id');

    if(id === null) {

        localStorage.setItem('id', 0);

    }

}

LocalBd.prototype.getNextId = function() {
    let nextId = localStorage.getItem('id');
        return parseInt(nextId) + 1;
}
LocalBd.prototype.recordBook = function(b) {

    let id = this.getNextId();
    localStorage.setItem(id, JSON.stringify(b));
    localStorage.setItem('id', id);

}
LocalBd.prototype.downloadBooks = function() {
    let id = localStorage.getItem('id');
    let books = new Array();

    // Recovers all books registered in localStorage
    for(let i = 1; i <= id; i++) {

        let book = JSON.parse(localStorage.getItem(i));

        // Verify that recovery is not null
        if(book === null) {
            continue;
        }

        book.id = i;
        books.push(book);
    }
    return books;
}
LocalBd.prototype.remove = function(id) {
    localStorage.removeItem(id);
}

// End of LocalBd

let bd = new LocalBd();

function addBookToLibrary() {

    let title = document.getElementById('title');
    let author = document.getElementById('author');
    let pages = document.getElementById('pages');
    let read = document.getElementById('read');

    let book = new Book(
        title.value,
        author.value,
        pages.value,
        read.checked
    );
    
    if(validateForm(book)) {
        bd.recordBook(book);
        window.location.reload();
    } else {
        // Erro
        alert('Fill out all the fields!');
    }

}

function loadBooks(books = Array(), filter = false) {

    if(books.length == 0 && filter == false) {

        books = bd.downloadBooks();

    }

    let listBooks = document.getElementById('listBooks');
    listBooks.innerHTML = '';

    books.forEach(function(b) {

        let td = document.createElement('td');
        td.className = 'd-flex justify-content-center';
        td.innerHTML = b.pages;
        let readBtn = document.createElement('td');
        if(b.read) {
            readBtn.className = 'd-flex td_btn_read';
            readBtn.innerHTML = `
                <button id="btn_${b.id}" class="btn btn-success readBtn">Read</button>
            `;
        } else {
            readBtn.className = 'd-flex td_btn_unread';
            readBtn.innerHTML = `
                <button id="btn_${b.id}" class="btn btn-danger readBtn">Unread</i></button>
            `;
        }
        

        let tdAuthor = document.createElement('td');
        tdAuthor.className = 'd-flex justify-content-center';
        tdAuthor.innerHTML = b.author;

        let row = listBooks.insertRow();

        row.insertCell(0).innerHTML = b.title;
        row.insertCell(1).append(tdAuthor);
        row.insertCell(2).append(td);
        row.insertCell(3).append(readBtn);

        let tdBtn = document.createElement('td');
        tdBtn.className = 'd-flex justify-content-center';
        tdBtn.innerHTML = `
        <button id="id_book_${b.id}" class="btn btn-danger tdBtn"><i class="fas fa-trash-alt"></i></button>
        `;
        row.insertCell(4).append(tdBtn);

    });

    initEventsButtonsRemove('.tdBtn');
    initEventsButtonsRead('.readBtn')
    
}
function addEventListenerAll(element, events, fn) {

    events.split(' ').forEach( event => {

        element.addEventListener(event, fn);

    });

}

function initEventsButtonsRemove(button) {

    let buttons = document.querySelectorAll(button);
    
    buttons.forEach( (btn, index) => {

        this.addEventListenerAll(btn, 'click', e => {

            let id = btn.id.replace('id_book_', '');
            bd.remove(id);
            window.location.reload();

        });

    });

}
function initEventsButtonsRead(button) {

    let buttons = document.querySelectorAll(button);
    
    buttons.forEach( (btn, index) => {

        this.addEventListenerAll(btn, 'click', e => {

            let id = btn.id.replace('btn_', '');

            let item = JSON.parse(localStorage.getItem(id));

            if(btn.innerHTML == 'Read') {
                item.read = false;
                localStorage.setItem(id, JSON.stringify(item));
                changeClass(btn, 'btn-success', 'btn-danger');
                btn.innerHTML = 'Unread';
            } else {
                item.read = true;
                localStorage.setItem(id, JSON.stringify(item));
                changeClass(btn, 'btn-danger', 'btn-success');
                btn.innerHTML = 'Read';
            }   

        });

    });

}
function changeClass(element, old, newClass) {
    element.classList.remove(old);
    element.classList.add(newClass);
}