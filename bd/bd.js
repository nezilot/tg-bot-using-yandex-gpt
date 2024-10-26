const fs = require('fs');
const path = require('path');
config = require('../config');

async function saveUser(idUser) {
    
    let allUsers = await parseJson('users.json');

    try {

        if(chekPovtor(allUsers, idUser)) {
  
            console.log('Такоe число было, поэтом скип');
      
            return false;
      
           }

           else {
      
            if (config.admins.includes(idUser)) {
      
              console.log('Этот Id является admin, скип');
      
              return false;

            } else {
      
            allUsers.push(idUser);
      
              saveJson('./bd/users.json', allUsers);
      

              return true;
              
            }};



    } catch(err) {
        console.log(err);
    }

};

function saveJson(filename, json) {

    fs.writeFileSync(filename, JSON.stringify(json, null, 2));

  };

function parseJson(fileMame) {

    const filePath = path.join(__dirname, fileMame);

    const data =  fs.readFileSync(filePath, 'utf8');


    return JSON.parse(data);


  };


  function chekPovtor(array, znachenie) {

    return array.includes(znachenie);
  
  };

  function parseUsers() {

    let usersAll = parseJson('users.json');

    return usersAll;

  };

module.exports = {

    saveUser,
    parseUsers

};