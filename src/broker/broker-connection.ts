import amqplib, { type ChannelModel, type Channel } from 'amqplib';

let connection: ChannelModel | null = null;
let pubChannel: Channel | null = null;

let reconnectAttempts = 0;
const BASE_DELAY = 1000;
const MAX_DELAY = 30000;

const URL = process.env.BROKER_URL;
const exchange = process.env.EXCHANGE;

function getReconnectDelay(): number {
    const exponential = Math.min(BASE_DELAY * Math.pow(2, reconnectAttempts), MAX_DELAY);
    const jitter = Math.random() * 1000;
    return exponential + jitter;
}

function scheduleReconnect(): void {
    connection = null;
    pubChannel = null;
    const delay = getReconnectDelay();
    reconnectAttempts++;
    console.warn(`⚠️ [RabbitMQ] Reconectando em ${(delay / 1000).toFixed(1)}s... (tentativa ${reconnectAttempts})`);
    setTimeout(connectRabbitMQ, delay);
}

export async function connectRabbitMQ(): Promise<void> {
    if (!URL) throw new Error("BROKER_URL não definido.");

    try {
        console.log("🔌 [RabbitMQ] Iniciando conexão...");

        connection = await amqplib.connect(URL, { heartbeat: 30 });

        connection.on('error', (err) => {
            console.error("❌ [RabbitMQ] Erro na conexão:", err.message);
        });

        connection.on('close', (err) => {
            if (err) {
                console.error("❌ [RabbitMQ] Conexão fechada com erro:", err.message);
            } else {
                console.warn("⚠️ [RabbitMQ] Conexão fechada.");
            }
            scheduleReconnect();
        });

        pubChannel = await connection.createChannel();

        pubChannel.on('error', (err) => {
            console.error("❌ [RabbitMQ] Erro no channel:", err.message);
        });

        pubChannel.on('close', () => {
            console.warn("⚠️ [RabbitMQ] Channel fechado.");
        });

        await pubChannel.assertExchange(exchange!, 'fanout', { durable: true });

        reconnectAttempts = 0;
        console.log(`✅ [RabbitMQ] Conectado e exchange ${exchange} configurada!`);

    } catch (error) {
        console.error("❌ [RabbitMQ] Falha ao conectar:", error instanceof Error ? error.message : error);
        scheduleReconnect();
    }
}

export async function publishExchangeMessage(exchange: string, routingKey: string, data: any): Promise<boolean> {
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
