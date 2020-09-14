require("dotenv").config();

const {Pool}=require("pg")

// module.exports={pool};


/* const config={
    user: 'postgres',
    host: '10.0.0.37',
    port: 5432,
    password: '1234',
    database: 'banco'
};

const pool = new Pool(config);




 */
  

const config={
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'banco1'
};

const pool = new Pool(config);

module.exports={pool} 