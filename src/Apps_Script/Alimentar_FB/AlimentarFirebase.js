//esse codigo le a planilha Alimenta_FB e manda para o firebase

function getEnvironment() {
    var environment = {
      spreadsheetID: "1qHejsSJFjrwqnO4gmRYLYs7eYtYLAImsF9j56ZGiLz8",
      firebaseUrl: "https://testebase-ba866-default-rtdb.firebaseio.com/Chamada/Representante/",
    };
    return environment;
  }
  
  // Creates a Google Sheets on change trigger for the specific sheet
  function createSpreadsheetEditTrigger(sheetID) {
    var triggers = ScriptApp.getProjectTriggers();
    var triggerExists = false;
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getTriggerSourceId() == sheetID) {
        triggerExists = true;
        break;
      }
    }
  
    if (!triggerExists) {
      var spreadsheet = SpreadsheetApp.openById(sheetID);
      ScriptApp.newTrigger("importSheet")
        .forSpreadsheet(spreadsheet)
        .onChange()
        .create();
    }
  }
  
  // Delete all the existing triggers for the project
  function deleteTriggers() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Initialize
  function initialize(e) {
    writeDataToFirebase(getEnvironment().spreadsheetID);
  }
  
  // Write the data to the Firebase URL
  function writeDataToFirebase(sheetID) {
    var ss = SpreadsheetApp.openById(sheetID);
    SpreadsheetApp.setActiveSpreadsheet(ss);
    createSpreadsheetEditTrigger(sheetID);
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      importSheet(sheets[i]);
      SpreadsheetApp.setActiveSheet(sheets[i]);
    }
  }
  
  // A utility function to generate nested object when
  // given a keys in array format
  function assign(obj, keyPath, value) {
    lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
      key = keyPath[i];
      if (!(key in obj)) obj[key] = {};
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  }
  
  // Import each sheet when there is a change
  function importSheet(sheet) {
    var data = sheet.getDataRange().getValues();
    var dataToImport = {
      Representantes: [] // Inicializa o array para os representantes
    };
  
    for (var i = 1; i < data.length; i++) {
      var representante = {};
      for (var j = 0; j < data[0].length; j++) {
        // Se o índice for o da coluna 'DATA', converta para "ano-mês-dia"
        if (data[0][j] === 'DATA') {
          if (data[i][j] instanceof Date) {
            // Formata a data no formato "ano-mês-dia"
            var formattedDate = Utilities.formatDate(data[i][j], Session.getScriptTimeZone(), 'yyyy-MM-dd');
            representante['DATA'] = formattedDate; // Atribui a data formatada ao campo 'DATA'
          }
        } else {
          // Para os outros campos, adiciona normalmente
          var key = data[0][j].split("__").join('.'); // Usa '.' para estrutura hierárquica
          representante[key] = data[i][j];
        }
      }
      dataToImport.Representantes.push(representante); // Adiciona o objeto representante ao array
    }
  
    var token = ScriptApp.getOAuthToken();
  
    // Aqui removemos o ID da planilha e o nome da aba da URL
    var firebaseUrl = getEnvironment().firebaseUrl;
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
    base.setData("", dataToImport);
  }
  