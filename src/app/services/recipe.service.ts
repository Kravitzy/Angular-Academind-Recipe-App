import { Subject } from "rxjs";
import { Recipe } from "../components/recipes/recipe.model";
import { Ingredient } from "../components/shared/ingredient.model";

export class RecipeService {
  recipesChanged= new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     "Shnitzel",
  //     "Delicious Toasty Shnitzel",
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG/1200px-Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG",
  //     [new Ingredient("Chicken Breast", 1), new Ingredient("Bread Crumbs", 1)]
  //   ),
  //   new Recipe(
  //     "Fat Burger",
  //     "Best burger ever",
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/1200px-RedDot_Burger.jpg",
  //     [new Ingredient("Meat", 1), new Ingredient("Buns", 2)]
  //   ),
  // ];
  private recipes: Recipe[] = [];


  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.getRecipes())
  }

  getRecipes() {
    return this.recipes.slice(); // sends a copy of the array and not a direct refrence
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index,1)
    this.recipesChanged.next(this.getRecipes());

  }
}
