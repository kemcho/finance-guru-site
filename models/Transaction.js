const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
 
    ticker:{
        type:String,
        require:true
    },
    units:{
        type:Number,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
    
});

const Transaction = mongoose.model('transactions', TransactionSchema); 
module.exports = Transaction;