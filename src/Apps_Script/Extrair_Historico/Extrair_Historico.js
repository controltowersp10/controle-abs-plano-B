//esse codigo vai ler o fire base e vai trazer os dados salvos la por data de salvamento, isso vai ser salvo em uma planilha gerando um historico 


function getAllData() {
  // Acessar a planilha específica
  var ss = SpreadsheetApp.openById("19R4Kg84nzOvKfWvfMhZohXU_aC7xSTgOd-N1iG4qp80");
  var sheet = ss.getSheetByName("Historico-Geral"); // Nome da página

  // URL do Firebase e token secreto
  var firebaseUrlBase = "https://testebase-ba866-default-rtdb.firebaseio.com/Historico/Chamada/";
  var secret = "9UrRHn5Ao77TYMeYnWNF3co4L8eXXUMXRSjAOYQH"; 

  // Fazer uma requisição para obter todas as chaves (datas) de "Historico/Chamada"
  var response = UrlFetchApp.fetch(firebaseUrlBase + ".json?auth=" + secret);
  var allData = JSON.parse(response.getContentText());

  // Obter todas as chaves (datas) como um array e ordenar da mais recente para a mais antiga
  var keys = Object.keys(allData).sort(function(a, b) {
    return new Date(b) - new Date(a); // Ordenar em ordem decrescente
  });

  // A chave mais recente será a primeira do array ordenado
  var latestDate = keys[0];
  var firebaseUrl = firebaseUrlBase + latestDate + ".json"; // Montar a URL do Firebase com a data mais recente

  // Fazer a requisição para o Firebase com a data mais recente
  var responseLatest = UrlFetchApp.fetch(firebaseUrl + "?auth=" + secret);
  var data = JSON.parse(responseLatest.getContentText());

  // Função para formatar a data no formato ${day}/${month}/${year}
  function formatDate(dateString) {
    if (!dateString) return "---";
    
    var date = new Date(dateString);
    
    // Ajustar para o fuso horário de Brasil (GMT-3)
    date.setHours(date.getHours() + 3); // Adiciona 3 horas ao horário atual

    var day = ("0" + date.getDate()).slice(-2); // Adicionar 0 à esquerda, se necessário
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Meses são base 0
    var year = date.getFullYear();
    
    return `${day}/${month}/${year}`; // Ajuste para o formato dia/mês/ano
  }

  // Obter o número de linhas na planilha (incluindo cabeçalho)
  var lastRow = sheet.getLastRow();
  
  // Se houver mais de uma linha (significa que temos dados além do cabeçalho)
  var existingData = [];
  if (lastRow > 1) {
    // Obter os dados existentes na planilha, ignorando o cabeçalho
    existingData = sheet.getRange(2, 1, lastRow - 1, 13).getValues(); 
  }

  // Iterar sobre os dados obtidos do Firebase
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var record = data[key];
      
      // Extrair os dados do Firebase
      var idGroot = record.ID_Groot ? record.ID_Groot : "---";
      var nome = record.Nome ? record.Nome.toUpperCase() : "---"; // Nome em maiúsculas
      var matricula = record.Matricula ? record.Matricula : "---";
      var turno = record.Turno ? record.Turno : "---";
      var escalaPadrao = record.Escala_Padrao ? record.Escala_Padrao : "---";
      var cargoPadrao = record.Cargo_Padrao ? record.Cargo_Padrao : "---";
      var areaPadrao = record.Area_Padrao ? record.Area_Padrao : "---";
      var empresa = record.Empresa ? record.Empresa : "---";
      var status = record.Status ? record.Status : "---";
      var turma = record.Turma ? record.Turma : "---";
      var dataRegistro = record.DATA ? formatDate(record.DATA) : "---"; // Formatar a data
      var presenca = record.Presenca ? record.Presenca : "---";
      var justificativa = record.Justificativa ? record.Justificativa : "---";

      // Dados a serem salvos
      var newRow = [idGroot, nome, matricula, turno, empresa, escalaPadrao, cargoPadrao, areaPadrao, status, turma, dataRegistro, presenca, justificativa];

      // Verificar se a matrícula e a data já estão presentes na planilha
      var rowUpdated = false;
      for (var i = 0; i < existingData.length; i++) {
        if (existingData[i][2] === matricula && existingData[i][10] === dataRegistro) { // Coluna 3 é a matrícula, coluna 11 é a data
          // Atualizar a linha existente
          sheet.getRange(i + 2, 1, 1, 13).setValues([newRow]);
          rowUpdated = true;
          break;
        }
      }

      // Se a matrícula ou data não forem encontradas, adicionar nova linha
      if (!rowUpdated) {
        sheet.appendRow(newRow);
      }
    }
  }
}
