const { nanoid } = require('nanoid');
const items = require('./items');

const addItemHandler = (request, h) => 
{
    const {
        name, 
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if (!name) {
        const response = h
          .response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          })
          .code(400);
        return response;
      }
    
      if (parseInt(readPage) > parseInt(pageCount)) {
        const response = h
          .response({
            status: 'fail',
            message:
              'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          })
          .code(400);
        return response;
      }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newItem = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    
    // [POST] Add book with complete data
    // [POST] Add book with finished data
    // if (
    //     (parseInt(readPage) <= parseInt(pageCount)) && 
    //     (reading === "false" || reading === "true")
    // ) {
    //     items.push(newItem);

    //     return h.response({
    //         status: "success",
    //         message: "Buku berhasil ditambahkan",
    //         data: { bookId: id }
    //     }).code(201)
    // }

    items.push(newItem);

  const isSuccess = items.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h
        .response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
            bookId: id,
            },
        })
        .code(201);
        return response;
    }

    const response = h
        .response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
        })
        .code(500);
    return response;
    

    // // [POST] Add book without name
    // if (name === "" || !name) {
    //     return h.response({
    //         status: "fail",
    //         message: "Gagal menambahkan buku. Mohon isi nama buku",
    //     }).code(400)
    // }

    // // [POST] Add book with page read more than page count
    // if (parseInt(readPage) > parseInt(pageCount)) 
    // {
    //     return h.response({
    //         status: "fail",
    //         message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    //     }).code(400)
    // }
};



const getAllItemsHandler = (request, h) => 
{
    const { name, reading, finished } = request.query;

    let filteredBooksName = items.filter((book) => {
        const nameRegex = new RegExp(name, 'gi');
        return nameRegex.test(book.name);
    });


    if (reading) {
        filteredBooksName = items.filter(
            (book) => Number(book.reading) === Number(reading),
        );
    }

    if (finished) {
        filteredBooksFinished = items.filter(
            (book) => Number(book.finished) === Number(finished),
        );
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooksName.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    })
}


const getItemByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = items.filter((note) => note.id === bookId)[0];

    if (book) {
        return h.response({
            status: 'success',
            data: { book },
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};


const editItemByIdHandler = (request, h) => 
{
    const { bookId } = request.params;

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    if (!name) 
    {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }
  
    if (parseInt(readPage) > parseInt(pageCount)) 
    {
        return h.response({
            status: 'fail',
            message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }
  
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
  
    const index = items.findIndex((book) => book.id === bookId);
  
    if (index !== -1) 
    {
        items[index] = {
            ...items[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };
  
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    }
  
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};


const deleteItemByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const index = items.findIndex((book) => book.id === bookId);
  
    if (index !== -1) {
      items.splice(index, 1);
  
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
      return response;
    }
  
    const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
    return response;
  };


module.exports = {
    addItemHandler,
    getAllItemsHandler,
    getItemByIdHandler,
    editItemByIdHandler,
    deleteItemByIdHandler
}