import Notification from "../models/Notification.js";

export const getNotification = async (req, res) => {
  const userId = req.user.id
  try {
     
    const notifications = await Notification.find({ recipient:userId, read:false})
      .populate("author", "name profile")
      .sort({ createdAt: -1 });  
 
      
    res.json(notifications)
      
  } catch (error) {
    console.error("Notification Error", error);
     
    res.status(500).json({ message: "Internal Error", error });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 export const deleteNotification = async (req, res) => {
   const { id } = req.params;

   try {
     const notification = await Notification.findByIdAndDelete(id);

     if (!notification) {
       return res
         .status(404)
         .json({ success: false, message: "Notification not found" });
     }

     res.status(200).json({ success: true, message: "Notification deleted" });
   } catch (error) {
     console.error("Error deleting notification:", error);
     res.status(500).json({ success: false, message: "Internal Server Error" });
   }
 };
