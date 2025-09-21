import Resturant from "../models/Resturants.js"
export const getPendingResturants=async(req,res)=>{
    try{
     const allPendingResturants=await Resturant.find({approved:"pending"});
     res.status(200).json({message:"success",data:allPendingResturants});
    }
    catch(error){
      res.status(500).json({message:"error",error:error.message});
    }
}
export const updateResturantApproval = async (req, res) => {
    const { id } = req.params;
    const { approved } = req.body;
    if(approved==="active"){
        return res.status(401).json({
            message:"Resturant  is already active"
        })
    }
    try {
        const updateApproval = await Resturant.findByIdAndUpdate(
            { _id: id },
            { approved: "active" }
        );
        res.status(200).json({ message: "success", data: updateApproval });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
};
