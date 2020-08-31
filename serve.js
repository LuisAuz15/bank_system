const express = require('express');
const app = express();
const {pool}=require('./dbConfig');
const bcrypt=require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport=require('passport');
const initializePassport = require('./passportConfig');
const { request } = require('express');

initializePassport(passport)

const PORT = process.env.PORT || 777;

app.use(express.urlencoded({ extended:false }));
app.set("view engine", "ejs"); 

app.use(
    session({
    secret: 'secret',

    resave: false,

    saveUninitialized: false
})
)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/', (req, res)=>{
    res.render('index')
})

app.get("/users/register", checkAuthenticated, (req, res)=>{
    res.render("register");
})

app.get("/users/login", checkAuthenticated, (req, res)=>{
    res.render("login");
})

app.get("/users/dashboard", checkNotAuthenticated, (req, res)=>{
    res.render("dashboard", 
    {user: req.user.cliente_nombre}
    );
})

app.get("/users/logout", (req, res)=>{
    req.logOut();
    req.flash('succes_msg', "You have logged out")
    res.redirect('/')
})
   
app.post("/users/register", async (req, res)=>{
    let {name, email, password, password2}=req.body;

    let errors=[];

    console.log({
        name,
        email,
        password,
        password2
    })

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
        
        hashedPassword=await bcrypt.hash(password, 10)
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
                }else{
                    pool.query(
                        `INSERT INTO cliente (cliente_nombre, cliente_correo, cliente_password)
                        VALUES ($1, $2, $3)
                        RETURNING cliente_id, cliente_password`, [name, email, hashedPassword], 
                        (err, results)=>{
                            if(err){
                                throw err
                            }
                            console.log(results.rows);
                            req.flash('succes_msg', "¡Listo! estás registrado, Ahora procede a iniciar sesión")
                            res.redirect('/users/login')
                        }
                    )
                } 
            }
        );
    }  
}); 

app.post(
    '/users/login', 
    passport.authenticate('local',{
        successRedirect: "/users/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
}))

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/users/dashboard');
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/")
}


//Probablemente manejemos las inserciones en otras tablas aquí


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})