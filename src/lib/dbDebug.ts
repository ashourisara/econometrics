import db from "./db";

export const debugDb = () => {
  console.log("Database path:", db.name);
  console.log(
    "Tables:",
    db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  );
};
