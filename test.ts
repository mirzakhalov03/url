import pool from "./config/db";

const test = async () => {
  try {
    const res = await pool.query("SELECT * FROM urls");
    console.log("Query result:", res.rows);
  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    await pool.end();
  }
};

test();