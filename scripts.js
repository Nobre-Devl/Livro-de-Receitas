document.addEventListener('DOMContentLoaded', loadRecipes);

document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const recipeName = document.getElementById('recipeName').value;
    const recipeIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    const recipeInstructions = document.getElementById('recipeInstructions').value;

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    const newRecipe = {
        name: recipeName,
        ingredients: recipeIngredients,
        instructions: recipeInstructions
    };

    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    document.getElementById('recipeForm').reset();
    localStorage.removeItem('ingredients');
    loadRecipes();
    loadIngredients();  
});

document.getElementById('addIngredientBtn').addEventListener('click', function() {
    const ingredient = document.getElementById('recipeIngredients').value;
    if (ingredient) {
        const ingredientsList = JSON.parse(localStorage.getItem('ingredients')) || [];
        ingredientsList.push(ingredient);
        localStorage.setItem('ingredients', JSON.stringify(ingredientsList));
        document.getElementById('recipeIngredients').value = ''; 
        loadIngredients();
    }
});

function loadIngredients() {
    const ingredientsList = JSON.parse(localStorage.getItem('ingredients')) || [];
    const ingredientsUl = document.getElementById('ingredientsList');
    ingredientsUl.innerHTML = '';  
    ingredientsList.forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            ${ingredient} <button class="btn btn-danger btn-sm float-right" onclick="removeIngredient(${index})">Excluir</button>
        `;
        ingredientsUl.appendChild(li);
    });
}

function removeIngredient(index) {
    const ingredientsList = JSON.parse(localStorage.getItem('ingredients')) || [];
    ingredientsList.splice(index, 1);
    localStorage.setItem('ingredients', JSON.stringify(ingredientsList));
    loadIngredients();  
}

function loadRecipes() {
    const recipesList = document.getElementById('recipeList');
    recipesList.innerHTML = '';

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    recipes.forEach((recipe, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <h5>${recipe.name}</h5>
            <p><strong>Ingredientes:</strong> ${recipe.ingredients.join(', ')}</p>
            <p><strong>Instruções:</strong> ${recipe.instructions}</p>
            <button class="btn btn-info btn-sm mr-2" onclick="editRecipe(${index})">Alterar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${index})">Excluir</button>
        `;
        recipesList.appendChild(li);
    });
}

function editRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeToEdit = recipes[index];

    document.getElementById('recipeName').value = recipeToEdit.name;
    document.getElementById('recipeIngredients').value = recipeToEdit.ingredients.join(', ');
    document.getElementById('recipeInstructions').value = recipeToEdit.instructions;

    
    document.getElementById('recipeForm').removeEventListener('submit', saveRecipe);
    document.getElementById('recipeForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedRecipeName = document.getElementById('recipeName').value;
        const updatedRecipeIngredients = document.getElementById('recipeIngredients').value.split(',').map(ingredient => ingredient.trim());
        const updatedRecipeInstructions = document.getElementById('recipeInstructions').value;

        recipes[index] = {
            name: updatedRecipeName,
            ingredients: updatedRecipeIngredients,
            instructions: updatedRecipeInstructions
        };

        localStorage.setItem('recipes', JSON.stringify(recipes));
        loadRecipes();
        document.getElementById('recipeForm').reset();
        loadIngredients();
    });
}

function deleteRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadRecipes();
}
