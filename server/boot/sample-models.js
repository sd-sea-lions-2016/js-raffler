module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.create([
    {username: 'John', email: 'john@doe.com', password: 'opensesame'},
    {username: 'Jane', email: 'jane@doe.com', password: 'opensesame'},
    {username: 'Bob', email: 'bob@raffles.com', password: 'opensesame'}
  ], function(err, users) {
    if (err) throw err;

    console.log('Created users:', users);

    // create raffle 1 and make john the owner
    users[0].raffles.create({
      name: 'raffle1',
      balance: 100
    }, function(err, raffle) {
      if (err) throw err;

      console.log('Created raffle:', raffle);

    });

    //create raffle 2 and make jane the owner
    users[1].raffles.create({
      name: 'raffle2',
      balance: 100
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
        principalId: users[2].id
      }, function(err, principal) {
        if (err) throw err;

        console.log('Created principal:', principal);
      });
    });
  });
};
