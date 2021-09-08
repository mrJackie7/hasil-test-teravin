//* Third-party modules
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const mysql = require('mysql')

//* Local module
const randIdDate = require('./utils/idRandomizer')

// Todo 1. Rampingkan semua kodingan agar mudah dibaca, terutama pada beberapa endpoint

const app = express()
const port = 3000,
  mainLayout = 'layout/mainLayout',
  dbDestination = 'pegawai-db',
  tabelPegawai = 'pegawai',
  tabelAlamat = 'alamat'

//* Using EJS
app.set('view engine', 'ejs')
app.use(expressLayouts)

// Create Connection to Database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: dbDestination,
  multipleStatements: true,
})

// Connecting to database
conn.connect((err) => {
  if (err) throw err
  console.log('Connected to MySQL')
})

//* Built-in Middelware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//konfigurasi flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)

app.use(flash())

//* @Action: Get All Pegawai
//* @Desc: mendapatkan data semua Pegawai
//* @Path: /
app.get('/', (req, res) => {
  const sql = `SELECT * FROM ${tabelPegawai}`

  conn.query(sql, (err, results) => {
    if (err) throw err

    //* Stringify results
    const data = JSON.stringify(results)

    //* merender hasil ke ejs
    res.render('index', {
      layout: mainLayout,
      title: 'Data Pegawai',
      employees: JSON.parse(data),
      msg: req.flash('msg'),
    })
  })
})

//* @Action: Get halaman untuk input data pegawai
//* @Path: /add
app.get('/add', (req, res) => {
  res.render('add-pegawai', {
    title: 'Form Tambah Data Pegawai',
    layout: mainLayout,
  })
})

// Todo 2. selesaikan Post data ke mysql (check)
// Todo 4. Bisa add multiple input field berdasarkan perintah frontend
//* @Action: Post Data Pegawai Baru
//* @Desc: menambahkan data pegawai baru
//* @Path: /add/pegawai
app.post(
  '/add/pegawai',
  [
    check('nama', 'Nama harus diisi!').notEmpty().trim().escape(),
    check('email', 'Email harus diisi dengan email valid!')
      .isEmail()
      .trim()
      .escape()
      .normalizeEmail(),
    check(
      'mobile',
      'Nomor telepon harus diisi dengan yang valid!'
    ).isMobilePhone('id-ID'),
    check('birthdate', 'Tanggal lahir harus diisi!').notEmpty(),
    check('alamat', 'Alamat harus diisi!').notEmpty(),
  ],
  (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      //* Render pesan error-ish ke add-contact untuk nanti di selipkan dibawah input field
      res.render('add-pegawai', {
        title: 'Form Tambah Data Pegawai',
        layout: mainLayout,
        errors: errs.array(),
      })
    } else {
      //* Generating idPegawai
      const idPegawai = randIdDate()

      const dataPegawai = {
          idPegawai,
          nama: req.body.nama,
          email: req.body.email,
          mobile: req.body.mobile,
          birthdate: req.body.birthdate,
        },
        dataAlamat = {
          idPegawai,
          alamat: req.body.alamat,
        }

      const sqlPegawai = `INSERT INTO ${tabelPegawai} SET ?`,
        sqlAlamat = `INSERT INTO ${tabelAlamat} SET ?`
      conn.query(sqlPegawai, dataPegawai, (err, results) => {
        if (err) throw err
        conn.query(sqlAlamat, dataAlamat, (err, results) => {
          if (err) throw err
          req.flash('msg', 'Data pegawai berhasil ditambahkan!')
          res.redirect('/')
        })
      })
    }
  }
)

//* @Action: Get halaman untuk ubah data pegawai berdasarkan idPegawai
//* @Path: /edit/:idPegawai
app.get('/edit/:idPegawai', (req, res) => {
  const sql = [
    `SELECT * FROM ${tabelPegawai} where idPegawai = '${req.params.idPegawai}'`,
    `SELECT * FROM ${tabelAlamat} where idPegawai = '${req.params.idPegawai}'`,
  ]

  conn.query(sql.join(';'), (err, results) => {
    if (err) throw err

    //* Check jika data berdasarkan idPegawai ada
    let data = { exists: 0 }
    if (results[0].length !== 0) {
      //* Add Object dari result [0] dan Convert semua data kedalam object dan nanti akan dikirim ke ejs
      data = {
        idPegawai: results[0][0].idPegawai,
        nama: results[0][0].nama,
        email: results[0][0].email,
        mobile: results[0][0].mobile,
        birthdate: results[0][0].birthdate,
        alamat: results[1][0].alamat,
      }
    }

    //* merender hasil ke ejs
    res.render('edit-pegawai', {
      layout: mainLayout,
      title: 'Ubah Data Pegawai',
      pegawai: data,
    })
  })
})

// Todo 3. Selesaikan endpoint untuk update data (check)
// Todo 5. Bisa edit multiple input field, kalo kosong tambah 1, kalo ga diperlukan hapus saja
//* @Action: Update Data Pegawai by idPegawai
//* @Desc: mengubah data pegawai berdasarkan idPegawainya
//* @Path: /edit/pegawai/:idPegawai
app.post(
  '/edit/pegawai/:idPegawai',
  [
    check('nama', 'Nama harus diisi!').notEmpty().trim().escape(),
    check('email', 'Email harus diisi dengan email valid!')
      .isEmail()
      .trim()
      .escape()
      .normalizeEmail(),
    check(
      'mobile',
      'Nomor telepon harus diisi dengan yang valid!'
    ).isMobilePhone('id-ID'),
    // check('birthdate', 'Tanggal lahir harus diisi!').notEmpty(),
    check('alamat', 'Alamat harus diisi!').notEmpty(),
  ],
  (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      //* Render pesan error-ish ke add-contact untuk nanti di selipkan dibawah input field
      res.render('edit-pegawai', {
        title: 'Ubah Data Pegawai',
        layout: mainLayout,
        errors: errs.array(),
        pegawai: req.body,
      })
    } else {
      //* Querying insert data ke database
      const updatePegawai = `UPDATE ${tabelPegawai} SET nama='${req.body.nama}', email='${req.body.email}', mobile='${req.body.mobile}', birthdate='${req.body.birthdate}' WHERE idPegawai='${req.body.idPegawai}'`,
        updateAlamat = `UPDATE ${tabelAlamat} SET alamat='${req.body.alamat}' WHERE idPegawai='${req.body.idPegawai}'`

      conn.query(updatePegawai, (err, results) => {
        if (err) throw err
        conn.query(updateAlamat, (err, results) => {
          if (err) throw err
          req.flash('msg', 'Data pegawai berhasil diubah!')
          res.redirect('/')
        })
      })
    }
  }
)

//* @Action: Get halaman untuk hapus data pegawai berdasarkan idPegawai
//* @Path: /hapus/:idPegawai
app.get('/hapus/:idPegawai', (req, res) => {
  const sql = [
    `SELECT * FROM ${tabelPegawai} where idPegawai = '${req.params.idPegawai}'`,
    `SELECT * FROM ${tabelAlamat} where idPegawai = '${req.params.idPegawai}'`,
  ]

  conn.query(sql.join(';'), (err, results) => {
    if (err) throw err

    //* Check jika data berdasarkan idPegawai ada
    let data = { exists: 0 }
    if (results[0].length !== 0) {
      //* Add Object dari result [0] dan Convert semua data kedalam object dan nanti akan dikirim ke ejs
      data = {
        exists: 1,
        idPegawai: results[0][0].idPegawai,
        nama: results[0][0].nama,
        email: results[0][0].email,
        mobile: results[0][0].mobile,
        birthdate: results[0][0].birthdate,
        alamat: results[1][0].alamat,
      }
    }

    //* merender hasil ke ejs
    res.render('delete-pegawai', {
      layout: mainLayout,
      title: 'Hapus Data Pegawai',
      pegawai: data,
    })
  })
})

//* @Action: Hapus Data Pegawai by idPegawai
//* @Desc: menghapus data pegawai berdasarkan idPegawainya
//* @Path: /delete/pegawai
app.post('/delete/pegawai/:idPegawai', (req, res) => {
  //console.log(req.params.idPegawai)
  const hapusPegawai = `DELETE FROM ${tabelPegawai} WHERE idPegawai='${req.params.idPegawai}'`,
    hapusAlamat = `DELETE FROM ${tabelAlamat} WHERE idPegawai='${req.params.idPegawai}'`
  conn.query(hapusPegawai, (err, results) => {
    if (err) throw err
    conn.query(hapusPegawai, (err, results) => {
      if (err) throw err
      req.flash(
        'msg',
        'Data berhasil dihapus! Kami harap anda tahu apa yang anda lakukan.'
      )
      res.redirect('/')
    })
  })
})

//* @Action: Get Pegawai Spesifik by idPegawai
//* @Desc: mendapatkan data Pegawai saat di klik detail idPegawai
//* @Path: /detail/:idPegawai
app.get('/detail/:idPegawai', (req, res) => {
  const sql = [
    `SELECT * FROM ${tabelPegawai} where idPegawai = '${req.params.idPegawai}'`,
    `SELECT * FROM ${tabelAlamat} where idPegawai = '${req.params.idPegawai}'`,
  ]

  conn.query(sql.join(';'), (err, results) => {
    if (err) throw err

    //* Check jika data berdasarkan idPegawai ada
    let data = { exists: 0 }
    if (results[0].length !== 0) {
      //* Add Object dari results dan Convert semua data kedalam object dan nanti akan dikirim ke ejs
      data = {
        exists: 1,
        idPegawai: results[0][0].idPegawai,
        nama: results[0][0].nama,
        email: results[0][0].email,
        mobile: results[0][0].mobile,
        birthdate: results[0][0].birthdate,
        alamat: results[1][0].alamat,
      }
    }

    //* merender hasil ke ejs
    res.render('detail', {
      layout: mainLayout,
      title: 'Detail Pegawai',
      pegawai: data,
    })
  })
})

//* @Action: 404 Action
//* @Desc: halaman ini muncul saat pathingnya tidak ditemukan
//* @Path:
app.use('', (req, res) => {
  res.status(404)
  res.send('404')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
