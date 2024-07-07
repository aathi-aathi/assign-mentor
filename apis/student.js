import express from 'express'
import { db } from '../db-utils/mongodb-connection.js'

const studentRouter = express.Router()

studentRouter.post("/",async(req,res)=>{
    const {body}=req
    try {
        const collection = db.collection("students")
    await collection.insertOne({
        ...body,
        id:Date.now().toString(),
        mentorId:null,
        prev_mentors:[],
})
res.send("Inserted Data successfully")
    } catch (error) {
        res.status(500).send({message:'Something went wrong'})
    }
    
})
studentRouter.put("/:studentId",async(req,res)=>{
    const {studentId}= req.params
    const {body}=req;
    try {
         const checkmentor= await db.collection('students').findOne({id:studentId,mentorId:body.mentorId})
    if(!checkmentor){
         await db.collection("students").updateOne({id:studentId},{$set:{mentorId:body.mentorId}})
     await db.collection("mentors").updateOne({id:body.mentorId},{$push:{"students":studentId}})
     await db.collection('students').updateOne({id:studentId},{$push:{"prev_mentors":body.mentorId}})
         res.send({message:"Teacher assigned successfully"})
    }
    else{
        res.send({message:'The student already assigned to this mentor'})
    }
    } catch (error) {
        res.status(500).send({message:'Something went wrong'})
    }
       

})
export default studentRouter;