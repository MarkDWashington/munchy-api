import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';

const getRoutes = Router();

getRoutes.get("/recipes", async (req, res) => {
  try {
    const database: Db = req.app.locals.db.db("munchy");
    const recipes = database.collection("recipes");

    const findResult = await recipes.find({}).project({title: 1}).toArray();
    
    res.send({recipes: findResult});

  } catch (err) {
    res.send(err);
  }
});

getRoutes.get("/getRecipe", async (req, res) => {
  try {
    const database: Db = req.app.locals.db.db("munchy");
    const recipes = database.collection("recipes");

    const recipeId: string = req.query.recipeId as string;

    if (recipeId == null) {
      res.status(400).send("Invalid request");
    }

    const findResult = await recipes.findOne({_id: new ObjectId(recipeId)});
    console.log(findResult);
    res.send(findResult);

  } catch (err) {
    res.send(err);
  }
});

export default getRoutes;