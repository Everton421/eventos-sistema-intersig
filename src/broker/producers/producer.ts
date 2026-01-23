import dbConn, { databaseEventos } from "../../connection/database-connection.ts";
import { type message } from "../../contracts/message.ts";
import { publishExchangeMessage } from "../broker-connection.ts";



export async function dispathExchange(exchangeName: string, data: message) {
    try {

        const result = await publishExchangeMessage(exchangeName, '', data)
        return result;

    } catch (e) {

        const sqlLog = `INSERT INTO ${databaseEventos}.logs SET 
                                                                         status = 'ERRO',
                                                                         id_message = '${data.id_message}',
                                                                         id_registro ='${data.id_registro}',
                                                                         dados_sql ="",
                                                                         detalhes_erro ="${e}",
                                                                         detalhes = "Erro ao tentar enviar mensagem para a exchange: ${exchangeName} " ,
                                                                             tabela_origem = '${data.tabela_origem}',
                                                                             tipo_evento = '${data.tipo_evento}'
                                                                         ;`
        await dbConn.query(sqlLog);

    }

}