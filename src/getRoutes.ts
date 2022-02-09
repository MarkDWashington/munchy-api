import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const getRoutes = Router();

getRoutes.get("/recipes", async (req, res) => {
  try {
    const client = req.app.locals.db as MongoClient;
    const database = client.db("munchy");
    const recipes = database.collection("recipes");

    const findResult = await recipes.find({}).project({title: 1}).toArray();
    
    res.type("json").send({recipes: findResult});

  } catch (err) {
    res.status(500).send(err);
  }
});

getRoutes.get("/getRecipe", async (req, res) => {
  try {
    const recipeId: string = req.query.recipeId as string;
    
    if (recipeId == null) {
      res.status(400).send("Invalid request");
    }

    const client = req.app.locals.db as MongoClient;
    const database = client.db("munchy");
    const recipes = database.collection("recipes");

    const findResult = await recipes.findOne({_id: new ObjectId(recipeId)});

    res.type("json").send(findResult);

  } catch (err) {
    res.status(500).send(err);
  }
});

export default getRoutes;