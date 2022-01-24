import { Router } from "express";
import { MongoClient } from "mongodb";

interface RecipeStep {
  num: number;
  text: string;
}

interface RecipeData {
  title: string;
  subtitle: string;
  steps: RecipeStep[];
}

const postRoutes = Router();

postRoutes.post("/submitRecipe", (req, res) => {
  try {
    const client = req.app.locals.db as MongoClient;
    const database = client.db("munchy");
    const recipes = database.collection("recipes");

    const newRecipe = req.body as RecipeData;

    recipes.insertOne(newRecipe);
    
    res.send();

  } catch (err) {
    res.status(500).send(err);
  }
});

export default postRoutes;