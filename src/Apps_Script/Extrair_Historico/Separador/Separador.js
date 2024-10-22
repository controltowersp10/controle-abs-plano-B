//isso vai ler a aba da planilha Historico-Geral e vai usar a coluna de data para se basear na data para criar uma nova aba. apos criar a aba ele vai copiar todos os dados que tenha aquele rand de data equivalente ao mes e vai salvar la nessa nova aba criando um historico mensal/anual

function Month_Separetor() {
    var ss = SpreadsheetApp.openById("19R4Kg84nzOvKfWvfMhZohXU_aC7xSTgOd-N1iG4qp80");
   var historicoSheet = ss.getSheetByName("Historico-Geral"); // Aba de origem
   var configSheet = ss.getSheetByName('Config'); // Aba de configuração para armazenar o controle da última linha
 
   // Se a aba de configuração não existir, cria uma
   if (!configSheet) {
     configSheet = ss.insertSheet('Config');
     configSheet.getRange('A1').setValue('LastProcessedRow'); // Cabeçalho
     configSheet.getRange('B1').setValue(1); // Inicia da primeira linha após o cabeçalho
   }
 
   // Obtém a última linha processada da aba de configuração
   var lastProcessedRow = configSheet.getRange('B1').getValue();
   
   // Obtém todos os dados da aba "Historico"
   var dataRange = historicoSheet.getDataRange();
   var dataValues = dataRange.getValues();
   
   var lastRow = historicoSheet.getLastRow();
 
   // Processa apenas as linhas novas
   for (var i = lastProcessedRow + 1; i <= lastRow; i++) {
     var dataValue = dataValues[i - 1][10]; // Índice da coluna de DATA (ajuste se necessário)
 
     if (dataValue && dataValue !== '') {
       var date = new Date(dataValue);
       if (!isNaN(date.getTime())) {
         // Formata a data para criar o nome da aba (Ex.: Setembro-2024)
         var month = date.toLocaleString('pt-BR', { month: 'long' }); // Mês por extenso
         var year = date.getFullYear();
         var sheetName = month.charAt(0).toUpperCase() + month.slice(1) + '-' + year; // Ex.: Setembro-2024
 
         // Verifica se a aba já existe, caso contrário, cria uma nova
         var targetSheet = ss.getSheetByName(sheetName);
         if (!targetSheet) {
           targetSheet = ss.insertSheet(sheetName);
         }
 
         // Copiar o cabeçalho se a aba estiver vazia
         if (targetSheet.getLastRow() === 0) {
           targetSheet.appendRow(dataValues[0]); // Copia o cabeçalho
         }
 
         // Copia a linha atual para a aba correspondente
         targetSheet.appendRow(dataValues[i - 1]);
       }
     }
   }
 
   // Atualiza a última linha processada na aba de configuração
   configSheet.getRange('B1').setValue(lastRow);
 }
 