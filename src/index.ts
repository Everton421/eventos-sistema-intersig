import { connectRabbitMQ } from "./broker/broker-connection.ts";
import { seed } from "./database/seed/seed.ts";
import { cleanEvents } from "./services/clean-event.ts";
import { serviceVerifyEvent } from "./services/verify-event.ts";

const EMITIR_EVENTOS = process.env.EMITIR_EVENTOS as 'S' | 'N';


async function main() {
  await seed( )
    await cleanEvents()
  if (EMITIR_EVENTOS == 'S') {
   await connectRabbitMQ()

    await serviceVerifyEvent()
  } else {
    console.log("process.env.EMITIR_EVENTOS nao foi configurada!");

  }
}



main();