const express = require('express')
const app = express()
const {pool}=require('./dbConfig')
const bcrypt=require('bcrypt')

const PORT = process.env.PORT || 777;

app.set("view engine", "ejs"); 
app.use(express.urlencoded({ extended:false }));

app.get('/', (req, res)=>{
    res.render('index')
})

app.get("/users/register", (req, res)=>{
    res.render("register");
})

app.get("/users/login", (req, res)=>{
    res.render("login");
})

app.get("/users/dashboard", (req, res)=>{
    res.render("dashboard");
})

app.post('/users/register', async (req, res)=>{
    let {name, email, password, password2}=req.body;

    console.log({
        name,
        email,
        password,
        password2
    })

    let errors=[];

    if(!name || !email || !password || !password2){
        errors.push({message: "Asegurese de ingresar todos los campos"})

    }

    if(password.length<6){
        errors.push({message: "La contraseña debe de tener 6 caracteres o más"})

    }

    if(password!==password2){
        errors.push({message: "Las contraseñas no coinciden"})
    }

    if(errors.length>0){
        res.render('register', {errors})
    }else{
        // La validacion pasó
        
        let hashedPassword=await bcrypt.hash(password, 10)
        console.log(hashedPassword)

        pool.query(
            `SELECT * FROM cliente
            WHERE cliente_correo= $1
            `, 
            [email], 
            (err, results)=>{
                if (err){
                    throw err;
                }
                console.log(results.rows);  

                if(results.rows.length>0){
                    errors.push({message: "El correo que ingresó ya está registrado"})
                    res.render("register", { errors });
                }
            }
        );
    }  
}); 



app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})