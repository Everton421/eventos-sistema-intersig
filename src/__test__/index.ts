import { testeConsumerEcommerce } from "./teste-consumer-ecommerce.ts";
import {  testeConsumercliente } from "./teste-consumer-cliente.ts";
import { testeConsumerFinanceiro } from "./teste-consumer-financeiro.ts";
import { testeConsumerPedidos } from "./teste-consumer-pedidos.ts";

 await testeConsumerEcommerce();
await testeConsumerFinanceiro();
await  testeConsumercliente();


await testeConsumerPedidos()