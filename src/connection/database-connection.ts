import   mysql  from 'mysql2/promise';

export const DB_PUBLICO = process.env.PUBLICO
export const DB_VENDAS = process.env.VENDAS
export const DB_ESTOQUE = process.env.ESTOQUE
export const DB_FINANCEIRO = process.env.FINANCEIRO

    
const DB_CONFIG = { 
                      host: process.env.DB_HOST,
                      user:  process.env.DB_USER ,
                      password: process.env.DB_PASSWORD,
                      connectionLimit: 10
                    };
   export  const databaseEventos = `\`${process.env.DB_EVENTOS}\``;


 const dbConn = await mysql.createPool(DB_CONFIG);
     
export default dbConn;
