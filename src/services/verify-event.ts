import { randomUUID } from "node:crypto";
import dbConn, { databaseEventos } from "../connection/database-connection.ts";
import { type eventos_clientes_sistema } from "../interfaces/eventos_clientes_sistema.ts";
import { dispathExchange } from "../broker/producers/producer.ts";

 
  export async function serviceVerifyEvent(){
     let inExecution = false;
setInterval( async ()=>{

          if(inExecution){
               console.log("[X] Tarefa em execução... ");
               return
          }

         try{
          inExecution = true 
               const [rows  , fields ] = await dbConn.query(`SELECT * FROM ${databaseEventos}.eventos_sistema where STATUS = 'PENDENTE' LIMIT 100 ;`);

               const data = rows as eventos_clientes_sistema[]
          if( data.length > 0   ){
               
               for(const i of data ){
                    const id_message = randomUUID() as string;
                    const resultMsg =  await dispathExchange(
                         'sistema',
                         {
                              id_message: id_message,
                              criado_em: i.criado_em,
                              dados_json:'',
                              id_evento: Number(i.id),
                              id_registro: Number(i.id_registro),
                              status: i.status,
                              tabela_origem: i.tabela_origem,
                              tipo_evento: i.tipo_evento
                         })

                         if(resultMsg){
                              console.log(`[X] Enviado Evento tabel origem [ ${i.tabela_origem} ]  | RabbitMQ: id ${id_message}`)

                              const sql = `UPDATE ${databaseEventos}.eventos_sistema SET status = 'PROCESSADO', id_message = '${id_message}'   WHERE  id = ${i.id}  ;`

                              try{
                              await dbConn.query( sql );
                              
                              }catch(e){
                         const sqlLog = `INSERT INTO ${databaseEventos}.logs SET 
                                                  status = 'ERRO',
                                                  id_message = '${id_message}',
                                                  id_registro ='${i.id_registro}',
                                                  dados_sql ="${sql}",
                                                  detalhes_erro ="${e}",
                                                       tabela_origem = '${i.tabela_origem}',
                                                       tipo_evento = '${i.tipo_evento}'
                                                  ;`
                              await dbConn.query( sqlLog);
                              }
                         
                         } 
               }
          }
          }catch(e){

         } finally{
          inExecution = false;
         }

    }, 10000)
  }
