import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./components/auth/auth.component";
import { RecipeDetailComponent } from "./components/recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./components/recipes/recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./components/recipes/recipe-start/recipe-start.component";

import { RecipesComponent } from "./components/recipes/recipes.component";
import { ShoppingListComponent } from "./components/shopping-list/shopping-list.component";
import { AuthGuard } from "./services/auth-gaurd.service";
import { RecipeResolverService } from "./services/recipes-resolver.service";

const appRoutes: Routes = [
  { path: "", redirectTo: "/recipes", pathMatch: "full" },
  {
    path: "recipes",
    component: RecipesComponent,
    canActivate: [AuthGuard],
    resolve: [RecipeResolverService],
    children: [
      { path: "", component: RecipeStartComponent },
      { path: "new", component: RecipeEditComponent },
      {
        path: ":id",
        component: RecipeDetailComponent,
      },
      {
        path: ":id/edit",
        component: RecipeEditComponent,
      },
    ],
  },
  { path: "shopping-list", component: ShoppingListComponent },
  { path: "auth", component: AuthComponent },
  { path: "**", redirectTo: "", data: { error: "page not found" } },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
