// Função para importar dados da planilha ABS_Day que esta conectada ao BigQuery para a planilha Alimentar_FB que esta responsavel por alimentar o firebase

function importDataToSheet() {
    var destinationSpreadsheetId = "1qHejsSJFjrwqnO4gmRYLYs7eYtYLAImsF9j56ZGiLz8"; // ID da planilha de destino
    var destinationSheetName = "Alimentar_FB"; // Nome da aba de destino
  
    var sourceSpreadsheetId = "1ZcLvNXjh0az2vKPCJv3TUM5X-XhICo0BG1QnUMrdqyI"; // ID da planilha fonte
    var sourceRange = "ABS_Day!A2:N"; // Intervalo de células a ser importado (começando da linha 2 para ignorar o cabeçalho)
  
    // Abre a planilha fonte e o intervalo de dados
    var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
    var sourceSheet = sourceSpreadsheet.getSheetByName("ABS_Day");
    var sourceData = sourceSheet.getRange(sourceRange).getValues(); // Pega apenas os valores
  
    // Abre a planilha de destino
    var destinationSpreadsheet = SpreadsheetApp.openById(destinationSpreadsheetId);
    var destinationSheet = destinationSpreadsheet.getSheetByName(destinationSheetName);
  
    // Define o intervalo de destino (a partir da linha 2)
    // Caso a planilha de destino esteja vazia, começamos na linha 2
    var startRow = destinationSheet.getLastRow() + 1 > 1 ? destinationSheet.getLastRow() + 1 : 2;
    var destinationRange = destinationSheet.getRange(startRow, 1, sourceData.length, sourceData[0].length);
  
    // Coloca os dados importados na aba de destino a partir da célula A2, sem apagar o cabeçalho
    destinationRange.setValues(sourceData);
  }
  