const { readFileSync } = require('fs');

  class  ServicoCalculoFatura  {

    constructor(repo) {
      this.repo = repo;
    }

    calcularTotalCreditos(apresentacoes){
      let total = 0;
      for (let apre of apresentacoes) {
        total+=this.calcularCredito(apre);
      }
      return total;
    }

    calcularTotalFatura(apresentacoes) {
      let total = 0;
      for (let apre of apresentacoes) {
      total+=this.calcularTotalApresentacao(apre);
      }
      return total;
    }

    calcularTotalApresentacao(apre){
      let total = 0;
      switch (this.repo.getPeca(apre).tipo) {
        case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
        case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
        default:
          throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).tipo}`);
      }
      return total;
    }

    calcularCredito(apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (this.repo.getPeca(apre).tipo === "comedia") 
        creditos += Math.floor(apre.audiencia / 5);
      return creditos;   
    }
  
  }
  class Repositorio {
    constructor() {
      this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }
  
    getPeca(apre) {
      return this.pecas[apre.id];
    }
  }

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
  { style: "currency", currency: "BRL",
  minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(apresentacao, pecas) {
  return pecas[apresentacao.id];
} 

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

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
const faturaHtml = gerarFaturaHTML(faturas, calc);

console.log(faturaStr);
console.log(faturaHtml);

