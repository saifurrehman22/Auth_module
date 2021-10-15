const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

    SALT_WORK_FACTOR = 15;
const userSchema = mongoose.Schema({
    name : {
        type :String,
        required:true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,      
        validate: {
            isAsync: true,
            validator: function(value, isValid) {
                const self = this;
                return self.constructor.findOne({ email: value })
                .exec(function(err, user){
                    if(err){
                        throw err;
                    }
                    else if(user) {
                        if(self.id === user.id) {  // if finding and saving then it's valid even for existing email
                            return isValid(true);
                        }
                        return isValid(false);  
                    }
                    else{
                        return isValid(true);
                    }
                })
            },
            message:  'The email address is already taken!'
        },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    address : {
        type :String,
        required:true

    },
    resetToken : {
        data : String,
        default : ''

    },
    updatedAt : {
        type: Date,
        default: Date.now
    },
    createdAt : { 
         type : Date,
         default: Date.now } 
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports =mongoose.model('user',userSchema);

