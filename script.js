

//#region CASO HAJA ALGUM ERRO

process.on("uncaughtException", (err) => {
    trataERRO(err);
});

//#endregion

//#region REQUIRES LIB/FUNÇÕES

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const watch = require('node-watch');
const listaImagensJson = require('./data.json')
//#endregion

//#region VARIAVEIS DE COR

var corGreenBold  = "\x1b[32m";
var corRedBold    = "\x1b[31m";
var corBlueBold   = "\x1b[34m";
var corWhiteBold  = "\x1b[37m";
var corYellowBold = "\x1b[33m";

//#endregion

//#region HELP NA INSERÇÃO DE PARÂMETROS

const numParametros = 4; // Número total de parâmetros
if (process.argv.length != numParametros) {

console.clear();
console.log(corRedBold + " PARAMETROS NÃO INFORMADOS OU ERRADOS  -  SIGA O HELP ABAIXO: " + corWhiteBold)
console.log("=====================================================================================================================================================================================================")
console.log(` 1° VerBrowser         :  "VISIBLE" ou "HIDDEN"                   * Use "HIDDEN" para esconder o browser`)
console.log(` 2° PastaDeSaida       :  "C:\\TEMP"                               * Sem barra no final`)
console.log("=====================================================================================================================================================================================================\n")

process.exit();
}

//#endregion

//#region PARÂMETROS

var estadoBrowser = true;
const mostrarBrowser         = process.argv[2]; // VISIBLE OU HIDDEN
const pastaDeDownload        = process.argv[3]; // "C:/Users/murilo/Desktop"
var downloadPath             = path.resolve(pastaDeDownload);

//#endregion

//#region VALIDAÇÕES DE PARÂMETRO

    //#region VALIDAÇÂO MUDAR ESTADO DO BROWSER [2]

        if (mostrarBrowser.toUpperCase() === "VISIBLE") {
            estadoBrowser = false;
        } else if (mostrarBrowser.toUpperCase() === "HIDDEN") {
            estadoBrowser = "new";
        } else {
            throw new Error(
            `PARÂMETROS DE VISIBILIDADE DO BROWSER ERRADO - Use: VISIBLE OU HIDDEN `
            );
        }

    //#endregion

    //#region VALIDAÇÂO CAMINHO DE DESTINO [3]

        if (!fs.existsSync(downloadPath)) {
            // Cria o diretório de destino
            fs.mkdirSync(downloadPath);
        }

    //#endregion


//#region VARIAVEIS

    //#region VARIAVEIS DE INICIO E FIM DE SCRIPT
            
        var nomeFile_FimScript = "FIM-SCRIPT.FIM";
        var arquivoMarcaErro   = "ERRO-SCRIPT.BAD";

    //#endregion

    //#region VARIAVEIS PARA UTILIZAR NO PROJETO TODO

        const arquivoEmDownload = ".crdownload"


//#endregion

//#endregion

//#region SCRIPT ##########################################################################################################################################################################################################

    const scriptRoboTopAoFlop = async () => {
        
        //#region CHAMADA DA FUNÇÃO DE INICIO DE SCRIPT E EXCLUSÃO DE ARQUIVOS .FIM E .BAD

            inicioDoScript();
            excluiArquivos(arquivoMarcaErro, nomeFile_FimScript)

        //#endregion

        //#region ABRE O BROWSER

            const browser = await puppeteer.launch({
                headless: estadoBrowser,
                args: [`--window-size=1920,1080`],
              
            });

            const page = await browser.newPage()
            await page.setViewport({ width: 1920, height: 1080});
            console.log("Browser aberto.")
            
        //#endregion

        //#region CONFIGURAÇÕES DO NAVEGADOR

            //#region DEFINE PASTE DE DOWNLOAD
            
                const client = await page.target().createCDPSession();
                await client.send("Page.setDownloadBehavior", {
                    behavior: "allow",
                    downloadPath: downloadPath,
                });
    
            //#endregion        
    
        //#endregion

        

        //RENOMEIA O NOME DO ARQUIVO BAIXADO

        // page.on('response', async (response) => {
        //     await watch(downloadPath, function (event, name) {
        //         var nomeArquivo = path.basename(name);
        //         if (event === "update" && active === true) {

        //             // if(menuRamos[salvaArquivoRamo] === "DENTAL" || menuRamos[salvaArquivoRamo] === "PREVIDENCIA"){
             
        //                 if(!nomeArquivo.includes(arquivoEmDownload)){
        //                     active = false
        //                     var novoNomeArquivo = `${downloadPath}/${menuRamos[salvaArquivoRamo]}-${nomeArquivo}`
        //                     fs.rename(`${downloadPath}/${nomeArquivo}`, novoNomeArquivo,
        //                             function (res) {
        //                             if (res) {
        //                             } else {
        //                                 console.log(
        //                                 corGreenBold +
        //                                     "Arquivo baixado com sucesso!\n" +
        //                                     corWhiteBold
        //                                 );
        //                                 }
        //                             }
        //                     )
                        
        //                 }
        //     }
        //     })
        // })



    }

    scriptRoboTopAoFlop()

//#endregion

//#region FUNÇÕES

    //#region trataERRO(err) 

        function trataERRO(xerr) {
            if (!fs.existsSync(downloadPath)) {
                // Cria o diretório de destino
                fs.mkdirSync(downloadPath);
            }
            arquivoMarcaErro = arquivoMarcaErro === "" ? "ERRO-SCRIPT.BAD" : "ERRO-SCRIPT.BAD"
            console.error(corRedBold + "!!!!!!!!!!!!!!!!!!!!!!   ERRO CAPTURADO   !!!!!!!!!!!!!!!!!!!!!!\n" + corWhiteBold, corYellowBold + xerr + corWhiteBold);
            let nomeFinalizador = path.resolve(downloadPath, arquivoMarcaErro);
            let txt = `ERRO no script ${process.argv[1]}:
            PASTA SAIDA  : ${downloadPath}
            VER BROWSE   : ${mostrarBrowser};
            <mensagem>${xerr}</mensagem>
            `;
            fs.writeFileSync(nomeFinalizador, txt, "utf8");
            process.exit(0);
        }

    //#endregion       

    //#region sleep(delay)
        
        async function sleep(delay) {
            return new Promise((resolve) => setTimeout(resolve, delay));  
        }

    //#endregion

    //#region inicioDoScript()

        function inicioDoScript() {
            console.log(corGreenBold+ "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<INICIO DO SCRIPT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + corWhiteBold)
            console.log("Parâmetros: ");
            console.log(corBlueBold + " Mostrar browser     : " + corWhiteBold + process.argv[2]);
            console.log(corBlueBold + " Caminho de saída    : " + corWhiteBold + process.argv[3]);
            console.log(corGreenBold+ "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<INICIO DO SCRIPT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n" + corWhiteBold)
        }

    //#endregion  

    //#region fimDoScript()

        function fimDoScript() {
            nomeFile_FimScript = nomeFile_FimScript === "" ? "FIM-SCRIPT.FIM" : "FIM-SCRIPT.FIM"
            const nomeFinal = path.resolve(downloadPath, nomeFile_FimScript);
            console.log(corGreenBold + "Arquivo salvo: " + corWhiteBold + nomeFinal);
            console.info(
            corGreenBold +
                "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SCRIPT FINALIZADO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
                corWhiteBold
            );
            const txt = `Arquivo finalizado com sucesso!`;
            fs.writeFileSync(nomeFinal, txt, "utf8");
            process.exit(0);
        }

    //#endregion  

    //#region salvarJSON()

        function salvarJSON(novoNome, JSONfinal) {
            const jsonData = JSON.stringify(JSONfinal, null, 2);
            const nomeFinal = path.resolve(downloadPath, novoNome);
            fs.writeFile(nomeFinal, jsonData, "utf8", (err) => {
            if (err) {
                console.error("Erro ao salvar o arquivo:", err);
                return;
            }
            });
        }

    //#endregion

    //#region getValorLinhas(frame, linhasTabela)

        async function getValorLinhas(frame, linhasTabela){
            return await frame.evaluate((linhasTabela) => {
                var valor = document.querySelectorAll(linhasTabela)
                var todasLinhas = []
                for(let i of valor){
                    todasLinhas.push(i.innerText.trim())
                }
                return todasLinhas
            }, linhasTabela)
        }       

    //#endregion

    //#region validaData()

    function validaData(dataInicioParam, dataFinalParam){

            const dataAtual = new Date()

            //#region DATA FORMATADA INICIO
            const partesInicio = dataInicioParam.split('/')
            
            const diaInicio = partesInicio[0]
            const mesInicio = partesInicio[1] - 1;
            const anoInicio = partesInicio[2];
            
            const dataFormatadaInicio = new Date(anoInicio, mesInicio, diaInicio)
            //#endregion

            //#region DATA FORMATADA FINAL
            
            const partesFinal = dataFinalParam.split('/')
            
            const diaFinal = partesFinal[0]
            const mesFinal = partesFinal[1] - 1;
            const anoFinal = partesFinal[2];
            
            const dataFormatadaFinal = new Date(anoFinal, mesFinal, diaFinal)


            //#endregion

            const diferencaEmMilissegundosInicio = dataAtual - dataFormatadaInicio
            const diferencaEmMilissegundosFinal  = dataAtual - dataFormatadaFinal

            const diferencaEmDiasInicio = Math.floor(diferencaEmMilissegundosInicio / (1000 * 60 * 60 * 24))
            const diferencaEmDiasFinal  = Math.floor(diferencaEmMilissegundosFinal / (1000 * 60 * 60 * 24))

            if(diferencaEmDiasInicio === diferencaEmDiasFinal){
                return true
            }

            if(diferencaEmDiasInicio > 90 || diferencaEmDiasFinal > 90){
                throw new Error("PARAMETRO DE DATA ERRADO - O intervalo de no máximo 30 dias tem que estar entre os ultimos 90 dias corridos!")
            }

            const diferenca = diferencaEmDiasInicio - diferencaEmDiasFinal
            if(diferenca < 1 || diferenca > 30){
                throw new Error("PARAMETRO DE DATA ERRADO - O intervalo entre as datas tem que ser no máximo 30 dias!")
            }
        }

    //#endregion

    //#region excluiArquivos()

    function excluiArquivos(erroArquivo, fimArquivo){
        const caminhoArquivoBad = path.resolve(downloadPath, erroArquivo)
        const caminhoArquivoFim = path.resolve(downloadPath, fimArquivo)

        if(fs.existsSync(caminhoArquivoBad)){
            fs.unlink(caminhoArquivoBad, (err) => {
                if(err){
                    console.error("Não foi possível excluir o arquivo .BAD")
                }else{
                    console.log(corBlueBold + "Arquivo .BAD excluído!" + corWhiteBold)
                }
            })
        }
        if(fs.existsSync(caminhoArquivoFim)){
            fs.unlink(caminhoArquivoFim, (err) => {
                if(err){
                    console.error("Não foi possível excluir o arquivo .FIM")
                }else{
                    console.log(corBlueBold + "Arquivo .FIM excluído!" + corWhiteBold)
                }
            })
        }
    }

    //#endregion

    //#region todosDigitos(texto)

        function todosDigitos(texto){
            return !isNaN(texto)
        }

    //#endregion    

    //#region verificaData(dataStr)
        
        function verificaData(dataStr) {
            
            // Divide a data em dia, mês e ano
            const [dia, mes, ano] = dataStr.split('/');
        
            // Cria um objeto Date com a data fornecida
            const data = new Date(ano, mes - 1, dia);
        
            // Verifica se o objeto Date é válido e suas partes correspondem à data fornecida
            return (
                data.getDate() == dia &&
                data.getMonth() == mes - 1 &&
                data.getFullYear() == ano
            );
        }

    //#endregion

    //#region REMOVER ACENTOS

        function removerAcentos(palavra) {
            const mapaAcentos = {
            'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
            'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i', 'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
            'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ç': 'c',
            'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
            'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I', 'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
            'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U', 'Ç': 'C'
            };
        
            return palavra.replace(/[áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ]/g, function(matched) {
            return mapaAcentos[matched];
            });
        }

    //#endregion

    //#region separaData(data)

    function separaData(data){
        const dataSemBarra = data.split('/')
        const mapaData = {
            dia:dataSemBarra[0],
            mes:dataSemBarra[1],
            ano:dataSemBarra[2]
        }

        return mapaData
    }

//#endregion

//#endregion
