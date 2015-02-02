function RemoteDatabaseManager(remoteDbConnection, localDbConnection) {
  this.remoteDb = remoteDbConnection;
  this.localDb = localDbConnection;
}

RemoteDatabaseManager.prototype.replicateDb = function() {
  this.remoteDb.replicate.to(
    this.localDb
  ).then( function () {
    $(document).trigger( "dbReplicated.RemoteDatabaseManager" );
    console.log( "Replication OK" );
  }).catch( function (error) {
    console.error( "Could not replicate remote database", error );
  });
};
