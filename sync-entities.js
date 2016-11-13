var MongoClient = require('mongodb').MongoClient;
var fetch = require('node-fetch');

var witToken = process.env.WIT_TOKEN;
var witHeader = {Authorization: 'Bearer ' + witToken, 'Content-Type': 'application/json'};
var mongoUrl = process.env.MONGO_URL;


MongoClient.connect(mongoUrl, function(err, db) {
  if (err) throw new Error('Error connecting to MongoDB: ', err)
  console.log("Connected successfully to MongoDB");

  Promise.all([retrieveDbNames(db), retrieveWitNames()]).then(function(names) {
    var dbNames = names[0];
    var witNames = names[1];

    var addNames = [];
    var deleteNames = [];

    // Add
    dbNames.forEach(function(name) {
      if (!witNames.includes(name)) {
        addNames.push(name);
      };
    });  
  
    // Remove
    witNames.forEach(function(name) {
      if (!dbNames.includes(name)) {
        deleteNames.push(name);
      };
    });
    
    // Add them sequentially
    var addPromise = addNames.reduce(function(cur, next) {
      return cur.then(function() {
        console.log('Adding ' + next);
        return fetch('https://api.wit.ai/entities/name/values?v=20160526',
          {method: 'POST', headers: witHeader, body: JSON.stringify({value: next, expressions: [next]})}
        ).then(function(res) {
          return res.text();
        }).then(function(res) {
          console.log(res);
        });
      });
    }, Promise.resolve()).then(function() {
    });
    
    // Delete them sequentially
    deleteNames.reduce(function(cur, next) {
      return cur.then(function() {
        console.log('Deleting ' + next);
        return fetch('https://api.wit.ai/entities/name/values/' + encodeURIComponent(next) + '?v=20160526',
          {method: 'DELETE', headers: witHeader}
        ).then(function(res) {
          return res.text();
        }).then(function(res) {
          console.log(res);
        });
      });
    }, addPromise).then(function() {
      console.log('Done!');
      db.close();
    });
  });

});


function retrieveDbNames(db) {
  return new Promise(function(resolve, reject) {
    db.collection('phone').find({}).toArray(function(err, docs) {
      if (err) {
        reject(err);
        return;
      }
    
      var names = [];
      docs.forEach(function(doc) {
        if (doc.firstname && !names.includes(doc.firstname)) {
          names.push(doc.firstname);
        }
        if (doc.lastname && !names.includes(doc.lastname)) {
          names.push(doc.lastname);
        }
        if (doc.nickname && !names.includes(doc.nickname)) {
          names.push(doc.nickname);
        }
      });
    
      resolve(names);
    });
  });
}

function retrieveWitNames() {
  return fetch('https://api.wit.ai/entities/name?v=20160526', {headers: witHeader}).then(function(res) {
    return res.json();
  }).then(function(json) {
    var names = [];
    json.values.forEach(function(value) {
      if (!names.includes(value.value)) {
        names.push(value.value);
      }
    });
    return names;
  });
}