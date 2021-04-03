const libContainer = document.getElementById('lib-container');
const bookContainer = document.getElementById('book-card-container');
const newBookForm = document.forms["newBookForm"];
const editBookForm = document.forms['editBookForm'];
let cardToEdit;

let myLibrary = [];
let bookCards = [];

const bookFactory = (title, author, pages, beenRead) => {
  return { title, author, pages, beenRead }
}

const bookCardFactory = (book) => {
  
  const newDiv = document.createElement('div');
  const bookTitle = document.createElement('h5');
  const bookAuthor = document.createElement('i');

  newDiv.classList.add('card', 'text-center', 'text-white', 'bg-dark', 'mb-3');
  newDiv.setAttribute('data-target', '#bookInfoModal');
  newDiv.setAttribute('data-toggle', 'modal');
  newDiv.append(bookTitle, bookAuthor);
  newDiv.style.margin = '2px';

  bookTitle.textContent = book.title;
  bookTitle.classList.add('card-header');
  
  bookAuthor.textContent = book.author;
  bookAuthor.classList.add('card-text');
  
  const element = newDiv;

  return { book, element }
}

addBookToLibrary = (book, library) => {
  let newBookCard = bookCardFactory(book);

  newBookCard.element.addEventListener('mousedown', () => {
    showCardModal(newBookCard);
  });

  bookContainer.append(newBookCard.element);

  bookCards.push(newBookCard)
  book.index = library.length;
  library.push(book);
};

getFormData = () => {
  let newBookTitle = newBookForm.elements['bookTitleInput'].value;
  let newBookAuthor = newBookForm.elements['bookAuthorInput'].value;
  let newBookNumPages = newBookForm.elements['bookNumOfPagesInput'].value;
  let newBook = bookFactory(newBookTitle, newBookAuthor, newBookNumPages);
  
  addBookToLibrary(newBook, myLibrary);
  newBookForm.reset()
};

fillEditBookForm = (card) => { 
  editBookForm.elements['editBookTitleInput'].value = card.book.title;
  editBookForm.elements['editBookAuthorInput'].value = card.book.author;
  editBookForm.elements['editBookPagesInput'].value = card.book.pages;

  cardToEdit = card
};

getEditFormData = () => {
  let editedBookTitle = editBookForm.elements['editBookTitleInput'].value;
  let editedBookAuthor = editBookForm.elements['editBookAuthorInput'].value;
  let editedBookPages = editBookForm.elements['editBookPagesInput'].value;

  cardToEdit.book.title = editedBookTitle;
  cardToEdit.element.children[0].textContent = editedBookTitle;
  cardToEdit.book.author = editedBookAuthor;
  cardToEdit.element.children[1].textContent = editedBookAuthor;
  cardToEdit.book.pages = editedBookPages;
  
  bookCards.push(cardToEdit)
};

listBooks = (library) => {
  for (let book in library) {
    console.log(library[book])
  }
};

showCardModal = (card) => {
  const modalContent = document.getElementById('bookInfoModal').children[0].children[0];
  modalContent.innerHTML = ''

  const modalHeader = getModalHeader(card);

  const modalBody = getModalBody(card);

  const modalFooter = getModalFooter(card);
  
  modalContent.append(modalHeader, modalBody, modalFooter);
};

getModalHeader = (card) => {
  const modalHeader = document.createElement('div');
  const modalTitle = document.createElement('h5');

  const closeBtn = getCloseBtn();
  
  modalHeader.classList.add('modal-header');
  modalHeader.style.borderBottom = '1px solid #343a40'
  
  modalTitle.classList.add('modal-title');
  modalTitle.textContent = card.book.title;
  
  modalHeader.append(modalTitle, closeBtn);

  return modalHeader;
};

getCloseBtn = () => {
  const closeBtn = document.createElement('button');

  closeBtn.classList.add('close');
  closeBtn.setAttribute('data-dismiss', 'modal');
  closeBtn.style.color = 'black';
  closeBtn.textContent = 'x';
  closeBtn.id = 'infoCloseBtn';

  return closeBtn
};

getModalBody = (card) => {
  const modalBody = document.createElement('div');
  
  modalBody.classList.add('modal-body');

  const authorPara = document.createElement('p');
  const pagesPara = document.createElement('p');

  authorPara.style.margin = '4px';
  authorPara.textContent = 'Written by ' + card.book.author;

  pagesPara.style.margin = '4px';
  pagesPara.textContent = card.book.pages + ' pages long';
  
  modalBody.append(authorPara, pagesPara);

  return modalBody;
};

getModalFooter = (card) => {
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer', 'row', 'align-items-start')
  modalFooter.style.borderTop = '1px solid #343a40'

  const editBtn = getEditBtn(card);
  const removeBtn = getRemoveBtn(card);
  const readBtn = getReadBtn(card);

  modalFooter.append(readBtn, editBtn, removeBtn);

  return modalFooter;
};

getReadBtn = (card) => {
  const readBtnDiv = getReadBtnDiv();
  const readBtn = document.createElement('button');
  readBtn.style.margin = '3px'
  
  if (card.book.beenRead) {
    readBtn.classList.add('btn', 'btn-primary')
    readBtn.textContent = 'Book read';
  } else {
    readBtn.classList.add('btn', 'btn-dark')
    readBtn.textContent = 'Not read';
  }
  
  readBtn.addEventListener('click', (e) => toggleReadStatus(e, card));
  readBtnDiv.append(readBtn);
  return readBtnDiv;
};

getReadBtnDiv = () => {
  const div = document.createElement('div');

  div.classList.add('col-4')
  div.style.width = '0%'

  return div
};

getEditBtn = (card) => {
  const editBtn = document.createElement('button');

  editBtn.classList.add('btn', 'btn-info', 'col');
  editBtn.textContent = 'Edit book';
  editBtn.addEventListener('click', () => editBook(card));
  editBtn.setAttribute('data-toggle', 'modal');
  editBtn.setAttribute('data-target', '#editBookModal');
  editBtn.style.margin = '3px'

  return editBtn;
};

getRemoveBtn = (card) => {
  const removeBtn = document.createElement('button');
  
  removeBtn.addEventListener('click', () => removeBook(card));
  removeBtn.classList.add('btn', 'btn-danger', 'col');
  removeBtn.textContent = 'Remove book';
  removeBtn.style.margin = '3px'
  
  return removeBtn;
};

toggleReadStatus = (e, card) => {
  card.book.beenRead = !card.book.beenRead;
  if (e.target.textContent === 'Not read') {
    e.target.textContent = 'Book read';
    e.target.classList.remove('btn-dark')
    e.target.classList.add('btn-primary')
  } else {
    e.target.textContent = 'Not read';
    e.target.classList.remove('btn-primary');
    e.target.classList.add('btn-dark');
  }
};

editBook = (card) => {
  document.getElementById('infoCloseBtn').click();
  
  fillEditBookForm(card);
};

removeBook = (card) => {
  const infoModal = document.getElementById('bookInfoModal');
  let deleteBook = window.confirm('Are you sure?');
  if (deleteBook) {
    let libIndex = myLibrary.indexOf(card.book);
    let cardsIndex = bookCards.indexOf(card);
    if (libIndex > -1) myLibrary.splice(libIndex, 1);
    if (cardsIndex > -1) bookCards.splice(cardsIndex, 1);

    card.element.remove();
    infoModal.click();
  };
};


addBookToLibrary(bookFactory('A Song of Ice and Fire', 'George R. R. Martin', 413), myLibrary)
addBookToLibrary(bookFactory('The Hobbit', 'J. R. R. Tolkien', 354), myLibrary)
addBookToLibrary(bookFactory('Foundation', 'Isaac Asimov', 256), myLibrary)


listBooks(myLibrary)