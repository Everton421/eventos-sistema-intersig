import { connectRabbitMQ } from "./broker/broker-connection.ts";
import { serviceVerifyProdutctEvent } from "./services/verify-event-produtos.ts";
import { serviceVerifyClientEvent } from "./services/verify-event-clientes.ts";
import { serviceVerifyRecebimentosEvent } from "./services/verify-event-recebimentos.ts";
import { serviceVerifyPedidosEvent } from "./services/verify-event-pedidos.ts";

 connectRabbitMQ()

  await serviceVerifyProdutctEvent();
 
  await serviceVerifyClientEvent()
  
  await serviceVerifyPedidosEvent()
 

await serviceVerifyRecebimentosEvent()
 
 