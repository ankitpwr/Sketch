import express from "express";
import cors from "cors";
import { SignUpSchema } from "@repo/types/zodSchema";
const app = express();
app.use(express.json());
app.use(cors());

app.post("/signin", async (req, res) => {
  try {
    const parseData = SignUpSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        error: parseData.error.issues,
      });
    }
    //use bcrypt for password hashing
    // make db call

    res.status(200).json({});
  } catch (error) {
    console.log(`Error Occured`);
    return res.status(500).json({
      error: `Internal Server Error`,
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const parseData = SignUpSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        error: parseData.error.issues,
      });
    }

    // verify the data in user name
  } catch (error) {}
});
