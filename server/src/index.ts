import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

// const port = process.env.PORT || 4000;

// app.listen(Number(port), () => {
//   console.log(`Server listening on http://localhost:${port}`);
// });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});