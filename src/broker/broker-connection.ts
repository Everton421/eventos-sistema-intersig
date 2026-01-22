import amqplib, { type ChannelModel, type Channel  } from 'amqplib';

let connection: ChannelModel | null = null;
  let pubChannel:   Channel | null = null;

const URL = process.env.BROKER_URL;

export async function connectRabbitMQ(): Promise<void> {
    if (!URL) throw new Error("BROKER_URL não definido.");

    try {
        console.log("🔌 [RabbitMQ] Iniciando conexão...");
        
        connection = await amqplib.connect(URL);
        pubChannel = await connection.createChannel();


        await Promise.all([
               pubChannel.assertExchange('clientes', 'fanout', { durable: true }),
               pubChannel.assertExchange('produtos', 'fanout', { durable: true }) 
        ])

        console.log("✅ [RabbitMQ] Conectado e Exchange configurada!");

        connection.on('error', (err) => {
            console.error("❌ [RabbitMQ] Erro na conexão:", err.message);
        });

        connection.on('close', () => {
            console.warn("⚠️ [RabbitMQ] Conexão fechada. Tentando reconectar em 5s...");
            connection = null;
            pubChannel = null;
            setTimeout(connectRabbitMQ, 5000);  
        });

    } catch (error) {
        console.error("❌ [RabbitMQ] Falha ao conectar. Tentando novamente em 5s...");
        setTimeout(connectRabbitMQ, 5000);
    }
}

// Função exportada para publicar mensagens
export async function publishExchangeMessage( exchange: 'clientes' | 'produtos' , routingKey: string, data: any): Promise<boolean> {
    if (!pubChannel || !connection) {
        console.warn("⚠️ [RabbitMQ] Sem conexão ativa. Mensagem não enviada.");
        return false;
    }

    try {
        const buffer = Buffer.from(JSON.stringify(data));
        return pubChannel.publish(exchange, routingKey, buffer);
    } catch (error) {
        console.error("❌ [RabbitMQ] Erro ao tentar publicar:", error);
        return false;
    }
}


export async function publishMessage( queue: 'clientes' | 'produtos',  data: any): Promise<boolean> {
    if (!pubChannel || !connection) {
        console.warn("⚠️ [RabbitMQ] Sem conexão ativa. Mensagem não enviada.");
        return false;
    }
               await pubChannel.assertQueue('produtos',  { durable: true }) 

    try {

        const buffer = Buffer.from(JSON.stringify(data));
          return pubChannel.sendToQueue(queue,  buffer);
    } catch (error) {
        console.error("❌ [RabbitMQ] Erro ao tentar publicar:", error);
        return false;
    }
}


