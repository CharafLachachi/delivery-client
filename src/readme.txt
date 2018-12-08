Quand Vous aurez besoin d'accéder à indexedDB, 
1) Verifier si la bdd existe et la récupérer, sinon la créer avec la méthode suivante, 
sauf que dans le cas ou vous créez la base de données vérifier bien que vous ajoutez 
toutes les tables uilisées dans le projet, car si un autre composant vérifie l'existance de la bdd après que vous l'aviez 
créee il suppose que toutes les tables existe. (ligne 24 25)

Cette méthode retourne une promesse (Promise<Dexie>) qui contient la bd.
private initializeDataBase() : Promise<Dexie>{
    // First Try to open DataBase if it was already created
    new Dexie('__mydb').open().then(function (db) {
      console.log ("Found database: " + db.name);
      console.log ("Database version: " + db.verno);
      
      return Promise.resolve(db);
      // return  new Promise((resolve,reject) => {
      //   resolve(db);
      //   reject(new Error("Something awful happened"));
      // })
  
  }).catch('NoSuchDatabaseError', function(e) {
      // Database with that name did not exist, so we have to create it
      console.error ("Database not found");
     const db = new Dexie('__mydb');
      this.db.version(1).stores({
      delivery: 'id,createdAt,modifiedAt,state,deliveryManId,orderId,deliveryMan,order',
      deliveryMan : 'firstname,lastname,phoneNumber,email,deliveryManAddress,passwordHash,passwordSalt,deliveryManAddressNavigation,delivery'
      });
      return Promise.resolve(db)

  }).catch(function (e) {
      // Unknown error
      console.error ("Oh uh: " + e);
  });
  return null;
  }