import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";
import {getReceiverSocketId, io} from '../libs/socket.js'

export const getUsersForSidebar = async (req, res) => {
    try {
        const logginInUser=req.user._id;
        const filteredUsers=await User.find({ _id: { $ne: logginInUser} }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
    try{
        const { id:receiverId } = req.params;
    const { text,image } = req.body;
    const senderId=req.user._id;
    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl=uploadResponse.secure_url;
    }
    const newMessage=new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });
    await newMessage.save();
    // socket io for real time chat
    const receiverSocketId=getReceiverSocketId(receiverId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage',newMessage);
    }

    res.status(201).json(newMessage);
    }catch(error){
        res.status(500).json({ message: error.message });
    }

}