import { type  message } from "../../contracts/message.ts";
import {     publishExchangeMessage, publishMessage } from "../broker-connection.ts";
 
/* // old function 

export async function dispathProdutos( data:message ){
   // o primeiro parametro pe o nome da exchange 
            // o segundo é o Routing key ( em fanout pode ser vazio ''  )
          const result = await  channels.channelProdutos.publish( 'produtos', '', Buffer.from( JSON.stringify(data)) )
           return result;
}
  */

 

export async function dispathExchangeProdutos( data:message ){
   // o primeiro parametro pe o nome da exchange 
            // o segundo é o Routing key ( em fanout pode ser vazio ''  )
          const result = await  publishExchangeMessage(  'produtos', '', data )
           return result;
}