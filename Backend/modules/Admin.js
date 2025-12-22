import mongoose from "mongoose";

const Adminscema=mongoose.Schema({
    user_Id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
      Adminname:{type:String},
    Admincode:{type:String},
    Address:{type:String}
});

export default mongoose.model("Admin",Adminscema);
