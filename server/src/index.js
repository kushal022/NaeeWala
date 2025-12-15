import app from "./app.js";
import { createDatabaseIfNotExists } from "./db/dbCreate.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
