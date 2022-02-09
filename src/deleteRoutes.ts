import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const deleteRoutes = Router();

deleteRoutes.delete("/deleteRecipe", (req, res) => {
  res.send("Item deleted");
});

export default deleteRoutes;