require("dotenv").config();

const {Pool}=require("pg")

// const isProduction=process.env.NODE_ENV === 'production'

// const connectionString=`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}:${process.env.DB_HOST}:${process.env.DB_PORT}:${process.env.DB_DATABASE}`

// const pool=new Pool({
//     connectionString: isProduction ? process.env.DATABASE_URL : connectionString
// });

// module.exports={pool};

const config={
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'banco'
};

const pool = new Pool(config);

module.exports={pool}