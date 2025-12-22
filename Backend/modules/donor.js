import mongoose from "mongoose";

const donorSchema=mongoose.Schema({
    user_Id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
    Bloodgroup:{type:String},
    Dateofbirth:{type:String}
}

);
export default mongoose.model("donor",donorSchema);
