var mongoose = require('mongoose');

// define the schema for our user model
var upcomingsSchema = mongoose.Schema({
    Name : String,
    dataid : String,
    Places : Array,
    Src : String,
    privacy : String,
    stars:Number
});

// // generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

// // create the model for users and expose it to our app
module.exports = mongoose.model('upcomings', upcomingsSchema);
