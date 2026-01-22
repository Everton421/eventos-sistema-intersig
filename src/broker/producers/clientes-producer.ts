import { type  message } from "../../contracts/message.ts";
import { publishExchangeMessage } from "../broker-connection.ts";


/* // old function 
export async function dispathClientes( data:message ){
   const result = await channels.channelClientes.sendToQueue('clientes', Buffer.from( JSON.stringify(data)))
        return result;
}
*/
export async function dispathExchangeClientes( data:message ){
   // o primeiro parametro pe o nome da exchange 
            // o segundo é o Routing key ( em fanout pode ser vazio ''  )
          const result = await  publishExchangeMessage(  'clientes', '', Buffer.from( JSON.stringify(data)) )
           return result;
}