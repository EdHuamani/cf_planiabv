
'use strict';
const Firestore = require('@google-cloud/firestore');
const db = new Firestore();

const functions = require('@google-cloud/functions-framework');
functions.http('updateAdherents', async (request, response) => {
  const citiesRef = db.collection('adherentes');
  const d = new Date();
  const lastUpdate = `${d.getFullYear()}${d.getMonth()}`;

  const snapshot = await citiesRef.where('last_update_cf', '<', parseInt(lastUpdate)).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }
  const promises = [];
  const quota = 15;
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());

    const total = doc.data().deudatot + quota;
    promises.push(doc.ref.update({ 'deudatot': parseFloat(total) }));
  });
  try {
    await Promise.all(promises)
    return response.send({ result: `Total items procesed: ${promises.length}` });
  } catch (error) {
    return response.send({ error });
  }

});

functions.http('updateMaspol', async (request, response) => {
  const citiesRef = db.collection('maspol');
  const d = new Date();
  const lastUpdate = `${d.getFullYear()}${d.getMonth()}`;

  const snapshot = await citiesRef.where('last_update_cf', '<', parseInt(lastUpdate)).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }
  const promises = [];
  const quota = 15;
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());

    const total = doc.data().deuda_tot + quota;
    promises.push(doc.ref.update({ 'deuda_tot': parseFloat(total) }));
  });
  try {
    await Promise.all(promises)
    return response.send({ result: `Total items procesed: ${promises.length}` });
  } catch (error) {
    return response.send({ error });
  }

});

// functions.http('initAdherents', async (request, response) => {
//   const citiesRef = db.collection('adherentes');
//   const lastUpdate = 20221;
//   const snapshot = await citiesRef
//     .get();
//   const promises = [];

//   snapshot.forEach(doc => {
//     promises.push(doc.ref.update({ 'last_update_cf': lastUpdate }));
//   });
//   try {
//     await Promise.all(promises);
//     return response.send({ data: `Total Adherentes: ${promises.length}` });

//   } catch (error) {
//     return response.status(500).send(error);
//   }

// });


// functions.http('initMaspol', async (request, response) => {

//   const citiesRef = db.collection('maspol');
//   const lastUpdate = 20221;
//   console.log('doc ->', request.query.last, 'limit ->', request.query.limit);
//   const lastDoc = await citiesRef.doc(request.query.last).get();
//   const snapshot = await citiesRef
//     .startAt(lastDoc)
//     .limit(parseInt(request.query.limit))
//     .get();

//   const snapCount = await citiesRef.count().get();
//   console.log("all count --->", snapCount.data().count);
//   const snapCountFilter = await citiesRef.where('last_update_cf', '==', lastUpdate).count().get();
//   console.log("filter count --->", snapCountFilter.data().count);

//   const promises = [];
//   console.log('-->', snapshot.docs[snapshot.docs.length - 1].id);
//   snapshot.forEach(doc => {
//     if (!doc.data().last_update_cf) {
//       console.log(doc.data().last_update_cf);
//       promises.push(doc.ref.update({ 'last_update_cf': lastUpdate }));
//     }

//   });
//   try {
//     await Promise.all(promises);
//     return response.send({ data: `Total Maspol: ${promises.length}`, last: snapshot.docs[snapshot.docs.length - 1].id });

//   } catch (error) {
//     return response.status(500).send(error);
//   }

// });
