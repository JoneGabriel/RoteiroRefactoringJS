
const formatarMoeda = require("./util")
function gerarFaturaHTML(fatura, calc) {
    let body = `<p> Fatura ${fatura.cliente} </p> \n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
      body += `<li> ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
    }
    body+=`</ul>\n`
    body += `<p>Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}</p>\n`;
    body += `<p>Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)}</p>\n`;
    body+=`</html> \n`
    return body;
  }

function gerarFaturaStr (fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

module.exports = { 
  gerarFaturaHTML,
  gerarFaturaStr
}