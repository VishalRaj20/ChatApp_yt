import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import MessagesRoutes from "./routes/MessagesRoutes.js";
import ChannelRoutes from "./routes/ChannelRoutes.js";
import path from "path";import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  }));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', MessagesRoutes);
app.use("/api/channel", ChannelRoutes);

// code for deployment



// This works in both local and hosted environments like Render
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "Client", "dist");

  app.use(express.static(clientDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}




const server = app.listen(port, () =>{
    console.log(`Server is running at Port: ${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL).then(() => console.log("DB connection successfully."))