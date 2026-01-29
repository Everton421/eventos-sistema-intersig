import { connectRabbitMQ } from "./broker/broker-connection.ts";
import { serviceVerifyProdutctEvent } from "./services/verify-event-produtos.ts";
import { serviceVerifyClientEvent } from "./services/verify-event-clientes.ts";
import { serviceVerifyRecebimentosEvent } from "./services/verify-event-recebimentos.ts";
import { serviceVerifyPedidosEvent } from "./services/verify-event-pedidos.ts";

const EMITIR_EVENTOS = process.env.EMITIR_EVENTOS as 'S' | 'N' ;


async function main(){

 if(  EMITIR_EVENTOS == 'S'  ){
  connectRabbitMQ()

    await serviceVerifyProdutctEvent();
  
    await serviceVerifyClientEvent()
    
    await serviceVerifyPedidosEvent()

    await serviceVerifyRecebimentosEvent()
  
  }else{
    console.log("process.env.EMITIR_EVENTOS nao foi configurada!");
 
 }
 
}

 

main();