module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

console.log('seeding the db');
  User.find({username: 'Admin'}).then(function(result){
    console.log(result);
    if (result.length < 1) {
      console.log('No admin found. Creating admin');
      User.create([
        {username: 'Admin', email: 'admin@sdjs-raffle.com', password: 'sdjspassword'}
      ], function(err, admin) {
        if (err) throw err;

        console.log('Created users:', admin);

        // create raffle 1 and make john the owner
        admin[0].raffles.create({
          date: new Date(),
          active: false
        }, function(err, raffle) {
          if (err) throw err;
          console.log('Created raffle:', raffle);
        });

        //create the admin role
        Role.create({
          name: 'admin'
        }, function(err, role) {
          if (err) throw err;

          console.log('Created role:', role);

          //make bob an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: admin[0].id
          }, function(err, principal) {
            if (err) throw err;

            console.log('Created principal:', principal);
          });
        });
      });
    } else {
      console.log('Admin already created.');
    } // end if statement
  });
};
