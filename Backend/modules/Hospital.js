import mongoose from "mongoose";

const Hospitalscema=mongoose.Schema({
      user_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
      Hospitalname:{type:String},
      Department:{type:String},
      HospitalAddress:{type:String}



})
export default mongoose.model("hospital",Hospitalscema)
