import   mysql  from 'mysql2/promise';

export const PUBLICO = process.env.DB_PUBLICO
export const VENDAS = process.env.DB_VENDAS
export const ESTOQUE = process.env.DB_ESTOQUE
export const FINANCEIRO = process.env.DB_FINANCEIRO

   export  const databaseEventos = `\`${process.env.DB_EVENTOS}\``;

 const dbConn = await mysql.createPool( {
     host: process.env.DB_HOST,
                      user:  process.env.DB_USER ,
                      password: process.env.DB_PASSWORD,
                      connectionLimit: 10
 });
     
export default dbConn;
