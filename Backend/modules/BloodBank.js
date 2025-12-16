import mongoose from "mongoose";


const bankscema=mongoose.Schema({
      user_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
      Bankname:{type:String},
      Licensenumber:{type:String},
      BankAddress:{type:String}

})

export default mongoose.model("bloodbank",bankscema);