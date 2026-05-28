(function () {
  'use strict';

  async function loadRecords() {
    const payload = window.OrdoRecordsData;
    if (!payload || !Array.isArray(payload.records)) {
      throw new Error('Arquivo de registros inválido: data/records.js');
    }
    return JSON.parse(JSON.stringify(payload.records));
  }

  function findRecord(records, id) {
    return records.find((record) => record.id === id) || records[0];
  }

  window.OrdoRecords = { loadRecords, findRecord };
}());
