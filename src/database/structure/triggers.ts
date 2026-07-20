import { databaseEventos, ESTOQUE, FINANCEIRO, PUBLICO, VENDAS } from "../../connection/database-connection.ts";


const publico = `\`${PUBLICO}\``;
const vendas = `\`${VENDAS}\``;
const estoque = `\`${ESTOQUE}\``;
const financeiro = `\`${FINANCEIRO}\``

export const sqlTriggers = [

//////////// cad_prod

        `DROP TRIGGER IF EXISTS ${publico}.trg_produtos_update;`,
    `CREATE TRIGGER ${publico}.trg_produtos_update
        AFTER UPDATE ON ${publico}.cad_prod
        FOR EACH ROW
        BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_prod', OLD.CODIGO, 'UPDATE', 'PENDENTE');
        END`,
    
        `DROP TRIGGER IF EXISTS ${publico}.trg_produtos_delete;`,
        
    `CREATE TRIGGER ${publico}.trg_produtos_delete
        AFTER DELETE ON ${publico}.cad_prod
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_prod', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
    
        `DROP TRIGGER IF EXISTS ${publico}.trg_produtos_insert;`,
        
    `CREATE TRIGGER ${publico}.trg_produtos_insert
        AFTER INSERT ON ${publico}.cad_prod
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_prod', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,
////////////

//////////// prod_tabprecos
        `DROP TRIGGER IF EXISTS ${publico}.trg_preco_produto_insert;`,
    `CREATE TRIGGER ${publico}.trg_preco_produto_insert
        AFTER INSERT ON ${publico}.prod_tabprecos
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('prod_tabprecos', NEW.PRODUTO, 'INSERT', 'PENDENTE');
        END`,
    
        `DROP TRIGGER IF EXISTS ${publico}.trg_preco_produto_update;`,
         
    `CREATE TRIGGER ${publico}.trg_preco_produto_update
        AFTER UPDATE ON ${publico}.prod_tabprecos
        FOR EACH ROW
        BEGIN
            IF (OLD.PRECO != NEW.PRECO) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('prod_tabprecos', OLD.PRODUTO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,

    `DROP TRIGGER IF EXISTS ${publico}.trg_preco_produto_delete;`,
    `CREATE TRIGGER ${publico}.trg_preco_produto_delete
        AFTER DELETE ON ${publico}.prod_tabprecos
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('prod_tabprecos', OLD.PRODUTO, 'DELETE', 'PENDENTE');
        END`,
////////////

//////////// pro_orca
        `DROP TRIGGER IF EXISTS ${vendas}.trg_pro_orca_update;`,
    `CREATE TRIGGER ${vendas}.trg_pro_orca_update
        AFTER UPDATE ON ${vendas}.pro_orca
        FOR EACH ROW
        BEGIN
            IF (NEW.QTDE_SEPARADA <> OLD.QTDE_SEPARADA) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('pro_orca', NEW.PRODUTO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
    
        `DROP TRIGGER IF EXISTS ${vendas}.trg_pro_orca_insert;`,
     
    `CREATE TRIGGER ${vendas}.trg_pro_orca_insert
        AFTER INSERT ON ${vendas}.pro_orca
        FOR EACH ROW
        BEGIN
            IF (NEW.QTDE_SEPARADA > 0) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('pro_orca', NEW.PRODUTO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
////////////
        
//////////// prod_setor
    `  DROP TRIGGER IF EXISTS ${estoque}.trg_prod_setor_insert;`,
    `CREATE TRIGGER ${estoque}.trg_prod_setor_insert
        AFTER INSERT ON ${estoque}.prod_setor
            FOR EACH ROW
          BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('prod_setor', NEW.PRODUTO, 'INSERT', 'PENDENTE');
        END`,
    `  DROP TRIGGER IF EXISTS ${estoque}.trg_prod_setor_update;`,
    `CREATE TRIGGER ${estoque}.trg_prod_setor_update
        AFTER UPDATE ON ${estoque}.prod_setor
        FOR EACH ROW
        BEGIN
            IF (NEW.DATA_RECAD <> OLD.DATA_RECAD OR OLD.ESTOQUE <> NEW.ESTOQUE) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status, setor)
                VALUES ('prod_setor', NEW.PRODUTO, 'UPDATE', 'PENDENTE', NEW.SETOR);
            END IF;
        END`,
////////////

//////////// cad_clie clientes
        ` DROP TRIGGER IF EXISTS ${publico}.trg_cad_clie_update;
        `,
    `CREATE TRIGGER ${publico}.trg_cad_clie_update
        AFTER UPDATE ON ${publico}.cad_clie
        FOR EACH ROW
        BEGIN
            IF (OLD.DATA_RECAD != NEW.DATA_RECAD OR OLD.ATIVO != NEW.ATIVO) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_clie', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
    `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_clie_insert;
        `,
    `CREATE TRIGGER ${publico}.trg_cad_clie_insert
        AFTER INSERT ON ${publico}.cad_clie
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_clie', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    `DROP TRIGGER IF EXISTS ${publico}.trg_cad_clie_delete;`,
    `CREATE TRIGGER ${publico}.trg_cad_clie_delete
        AFTER DELETE ON ${publico}.cad_clie
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_clie', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
////////////

//////////// trigger fornecedores
    `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_forn_update;
        `,
    `CREATE TRIGGER ${publico}.trg_cad_forn_update
        AFTER UPDATE ON ${publico}.cad_forn
        FOR EACH ROW
        BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_forn', NEW.CODIGO, 'UPDATE', 'PENDENTE');
        END`,
    `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_forn_insert;
        `,
    `CREATE TRIGGER ${publico}.trg_cad_forn_insert
        AFTER INSERT ON ${publico}.cad_forn
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_forn', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    `
        DROP TRIGGER IF EXISTS ${publico}.trg_cad_forn_delete;
        `,

    `CREATE TRIGGER ${publico}.trg_cad_forn_delete
        AFTER DELETE ON ${publico}.cad_forn
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_forn', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
////////////

    
////////////  setores  
    `DROP TRIGGER IF EXISTS ${estoque}.trg_setores_update;`,
    `CREATE TRIGGER ${estoque}.trg_setores_update
        AFTER UPDATE ON ${estoque}.setores
        FOR EACH ROW
        BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status )
                VALUES ('setores', NEW.CODIGO, 'UPDATE', 'PENDENTE' );
        END`,

    ` DROP TRIGGER IF EXISTS ${estoque}.trg_setores_insert; `,

    `CREATE TRIGGER ${estoque}.trg_setores_insert
        AFTER INSERT ON ${estoque}.setores
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('setores', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,
////////////

////////////  recebimentos ct_receb
    `
      DROP TRIGGER IF EXISTS ${financeiro}.trg_ct_receb_update;
     `,
    `CREATE TRIGGER ${financeiro}.trg_ct_receb_update
        AFTER UPDATE ON ${financeiro}.ct_receb
        FOR EACH ROW
        BEGIN
            IF (
              OLD.VENCIMENTO != NEW.VENCIMENTO
              OR OLD.HISTORICO != NEW.HISTORICO
              OR OLD.DATA_PGTO != NEW.DATA_PGTO
              OR OLD.TIPO_RECEBIMENTO != NEW.TIPO_RECEBIMENTO
              OR OLD.PARCIAL != NEW.PARCIAL
              OR OLD.AGRUP_ORIGEM != NEW.AGRUP_ORIGEM
              OR OLD.AGRUP_DESTINO != NEW.AGRUP_DESTINO
              ) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('ct_receb', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
    `
        DROP TRIGGER IF EXISTS ${financeiro}.trg_ct_receb_insert;
        `,
    `CREATE TRIGGER ${financeiro}.trg_ct_receb_insert
        AFTER INSERT ON ${financeiro}.ct_receb
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('ct_receb', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    `
        DROP TRIGGER IF EXISTS ${financeiro}.trg_ct_receb_delete;
        `,

    `CREATE TRIGGER ${financeiro}.trg_ct_receb_delete
        AFTER DELETE ON ${financeiro}.ct_receb
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('ct_receb', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
////////////

//////////// pedidos  cad_orca
    `  DROP TRIGGER IF EXISTS ${vendas}.trg_pedidos_update;`,
    `CREATE TRIGGER ${vendas}.trg_pedidos_update
        AFTER UPDATE ON ${vendas}.cad_orca
        FOR EACH ROW
        BEGIN
            IF (
              OLD.CLIENTE != NEW.CLIENTE
              OR OLD.SITUACAO != NEW.SITUACAO
              OR OLD.SIT_SEPAR != NEW.SIT_SEPAR
              OR OLD.DATA_PEDIDO != NEW.DATA_PEDIDO
              OR OLD.VENDEDOR != NEW.VENDEDOR
              OR OLD.SETOR != NEW.SETOR
              OR OLD.DATA_RECAD != NEW.DATA_RECAD
              ) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_orca', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
    `
        DROP TRIGGER IF EXISTS ${vendas}.trg_pedidos_insert;
        `,
    `CREATE TRIGGER ${vendas}.trg_pedidos_insert
        AFTER INSERT ON ${vendas}.cad_orca
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_orca', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    `
        DROP TRIGGER IF EXISTS ${vendas}.trg_pedidos_delete;
        `,

    `CREATE TRIGGER ${vendas}.trg_pedidos_delete
        AFTER DELETE ON ${vendas}.cad_orca
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_orca', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
////////////

//////////// pedidos  de compra 
    `  DROP TRIGGER IF EXISTS ${vendas}.trg_comp_update;`,
    `CREATE TRIGGER ${vendas}.trg_comp_update
        AFTER UPDATE ON ${vendas}.cad_comp
        FOR EACH ROW
        BEGIN
            IF (
              OLD.FORNECEDOR != NEW.FORNECEDOR
              OR OLD.SITUACAO != NEW.SITUACAO
              OR OLD.SIT_SEPAR != NEW.SIT_SEPAR
              OR OLD.DATA_PEDIDO != NEW.DATA_PEDIDO
              OR OLD.COMPRADOR != NEW.COMPRADOR
              OR OLD.SETOR != NEW.SETOR
              ) THEN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_comp', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END IF;
        END`,
    `
        DROP TRIGGER IF EXISTS ${vendas}.trg_comp_insert;
        `,
    `CREATE TRIGGER ${vendas}.trg_comp_insert
        AFTER INSERT ON ${vendas}.cad_comp
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_comp', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    `
        DROP TRIGGER IF EXISTS ${vendas}.trg_comp_delete;
        `,

    `CREATE TRIGGER ${vendas}.trg_comp_delete
        AFTER DELETE ON ${vendas}.cad_comp
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_comp', OLD.CODIGO, 'DELETE', 'PENDENTE');
        END`,
////////////

//////////// cad_nf
    `  DROP TRIGGER IF EXISTS ${vendas}.trg_notas_update;`,
    `CREATE TRIGGER ${vendas}.trg_notas_update
        AFTER UPDATE ON ${vendas}.cad_nf
        FOR EACH ROW
        BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_nf', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            
        END`,
    `
        DROP TRIGGER IF EXISTS ${vendas}.trg_notas_insert ;
        `,
    `CREATE TRIGGER ${vendas}.trg_notas_insert
        AFTER INSERT ON ${vendas}.cad_nf
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_nf', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

////////////

//////////// grupos

    ` DROP TRIGGER IF EXISTS ${publico}.trg_grupos_insert;`,

    `CREATE TRIGGER ${publico}.trg_grupos_insert
        AFTER INSERT  ON ${publico}.cad_pgru
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_pgru', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    ` DROP TRIGGER IF EXISTS ${publico}.trg_grupos_update;`,

    `CREATE TRIGGER ${publico}.trg_grupos_update
            AFTER UPDATE  ON ${publico}.cad_pgru
            FOR EACH ROW
            BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_pgru', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END`,


    `  DROP TRIGGER IF EXISTS ${publico}.trg_grupos_delete; `,

    `CREATE TRIGGER ${publico}.trg_grupos_delete
                AFTER DELETE ON ${publico}.cad_pgru
                FOR EACH ROW
                BEGIN
                    INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                    VALUES ('cad_pgru', OLD.CODIGO, 'DELETE', 'PENDENTE');
                END`,
////////////

//////////// marcas
    ` DROP TRIGGER IF EXISTS ${publico}.trg_marcas_insert;`,

    `CREATE TRIGGER ${publico}.trg_marcas_insert
        AFTER INSERT  ON ${publico}.cad_pmar
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('cad_pmar', NEW.CODIGO, 'INSERT', 'PENDENTE');
        END`,

    ` DROP TRIGGER IF EXISTS ${publico}.trg_marcas_update;`,

    `CREATE TRIGGER ${publico}.trg_marcas_update
            AFTER UPDATE  ON ${publico}.cad_pmar
            FOR EACH ROW
            BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('cad_pmar', NEW.CODIGO, 'UPDATE', 'PENDENTE');
            END`,

    `  DROP TRIGGER IF EXISTS ${publico}.trg_marcas_delete; `,

    `CREATE TRIGGER ${publico}.trg_marcas_delete
                AFTER DELETE ON ${publico}.cad_pmar
                FOR EACH ROW
                BEGIN
                    INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                    VALUES ('cad_pmar', OLD.CODIGO, 'DELETE', 'PENDENTE');
                END`,
////////////

////////// lotes series
    ` DROP TRIGGER IF EXISTS ${publico}.trg_lotes_series_insert;`,

    `CREATE TRIGGER ${publico}.trg_lotes_series_insert
        AFTER INSERT  ON ${publico}.lotes_series
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
            VALUES ('lotes_series', NEW.CODIGO, 'INSERT', 'PENDENTE');
     END`,

    ` DROP TRIGGER IF EXISTS ${publico}.trg_lotes_series_update;`,

    `CREATE TRIGGER ${publico}.trg_lotes_series_update
            AFTER UPDATE  ON ${publico}.lotes_series
            FOR EACH ROW
            BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('lotes_series', NEW.CODIGO, 'UPDATE', 'PENDENTE');
          END`,

    `  DROP TRIGGER IF EXISTS ${publico}.trg_lotes_series_delete; `,

    `CREATE TRIGGER ${publico}.trg_lotes_series_delete
                AFTER DELETE ON ${publico}.lotes_series
                FOR EACH ROW
                BEGIN
                    INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                    VALUES ('lotes_series', OLD.CODIGO, 'DELETE', 'PENDENTE');
                END`,
/////////////////

////////// lote serie setor 

    ` DROP TRIGGER IF EXISTS ${estoque}.trg_lote_serie_setor_insert;`,

    `CREATE TRIGGER ${estoque}.trg_lote_serie_setor_insert
        AFTER INSERT  ON ${estoque}.lote_serie_setor
        FOR EACH ROW
        BEGIN
            INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status, setor)
            VALUES ('lote_serie_setor', NEW.id, 'INSERT', 'PENDENTE', NEW.SETOR);
     END`,

    ` DROP TRIGGER IF EXISTS ${estoque}.trg_lote_serie_setor_update;`,

    `CREATE TRIGGER ${estoque}.trg_lote_serie_setor_update
            AFTER UPDATE  ON ${estoque}.lote_serie_setor
            FOR EACH ROW
            BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status,setor)
                VALUES ('lote_serie_setor', NEW.id, 'UPDATE', 'PENDENTE', NEW.SETOR);
          END`,


    `  DROP TRIGGER IF EXISTS ${estoque}.trg_lote_serie_setor_delete; `,

    `CREATE TRIGGER ${estoque}.trg_lote_serie_setor_delete
                AFTER DELETE ON ${estoque}.lote_serie_setor
                FOR EACH ROW
                BEGIN
                    INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status,setor)
                    VALUES ('lote_serie_setor', OLD.id, 'DELETE', 'PENDENTE', OLD.SETOR);
                END`,
/////////////////

///////////////// requerimentos

      ` DROP TRIGGER IF EXISTS ${vendas}.trg_requerimentos_insert;`,

    `CREATE TRIGGER ${vendas}.trg_requerimentos_insert
            AFTER INSERT ON ${vendas}.requerimentos
            FOR EACH ROW
            BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status)
                VALUES ('requerimentos', NEW.CODIGO, 'INSERT', 'PENDENTE');
            END`,

   ` DROP TRIGGER IF EXISTS ${vendas}.trg_requerimentos_update;`,

    `CREATE TRIGGER ${vendas}.trg_requerimentos_update
            AFTER UPDATE  ON ${vendas}.requerimentos
            FOR EACH ROW
            BEGIN
                INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status,setor)
                VALUES ('requerimentos', NEW.CODIGO, 'UPDATE', 'PENDENTE', 0);
          END`,

   ` DROP TRIGGER IF EXISTS ${vendas}.trg_requerimentos_delete;`,
    `CREATE TRIGGER ${vendas}.trg_requerimentos_delete
                AFTER DELETE ON ${vendas}.requerimentos
                FOR EACH ROW
                BEGIN
                    INSERT INTO ${databaseEventos}.eventos_sistema(tabela_origem, id_registro, tipo_evento, status,setor)
                    VALUES ('requerimentos', OLD.CODIGO, 'DELETE', 'PENDENTE', 0);
                END`,

];