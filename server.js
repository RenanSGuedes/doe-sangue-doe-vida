const express = require('express')
const app = express()
const nunjucks = require('nunjucks')

nunjucks.configure('./', {
    express: app,
    noCache: true, 
})

app.use(express.json())
app.use(express.static('public'))
// Enable express body
app.use(express.urlencoded({ extended: true }))

// Database connection
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '4518',
    host: 'localhost',
    port: 5432,
    database: 'doe'
}) // New object

app.get('/users', (req, res) => {
    db.query("SELECT * FROM donors", (err, result) => {
        if (err) return res.send("Erro no banco de dados")
    

        const donors = result.rows
        return res.render('index.html', { donors })
    })
})

app.post('/users', (req, res) => {
    const { name, email, blood } = req.body
    
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // Add values in database
    const query = `
        INSERT INTO donors ("name","email","blood")
        VALUES ($1,$2,$3)`
   
    const values = [name, email, blood]
   
    db.query(query, values, (err) => {
        if (err) return res.send('Erro no banco de dados')
      
        return res.redirect('/users')// Redirect to / with get method
    })
})

app.listen(8090, () => {
    console.log("...Server connected")
})
