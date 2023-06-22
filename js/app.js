class CalorieTracker{
    constructor()
    {
        this._calorieLimit = Storage.getCalorieLimit();
        
        this._totalCalorie = Storage.getTotalCalories(0);
        
        this._totalCalories = 0;

        this._meals = Storage.getMeals();

        this._workouts = Storage.getWorkouts();

        this._displayCalorieLimit();

        this._displayCaloriesTotal();

        this._displayCaloriesConsumed();

        this._displayCaloriesBurned();

        this._displayCaloriesRemaining();
    }

    addMeal(meal)
    {
        this._meals.push(meal);

        this._totalCalories += meal.calories; 

        Storage.updateTotalCalories(this._totalCalories);

        Storage.saveMeal(meal);

        this._displayNewMeal(meal);

        this._render();
    } 

    addWorkout(workout)
    {
        this._workouts.push(workout);

        this._totalCalories -= workout.calories;

        Storage.updateTotalCalories(this._totalCalories);

        Storage.saveWorkouts(workout);

        this._displayNewWorkout(workout);

        this._render();
    }

    removeMeal(itemId)
    {
        const index = this._meals.findIndex((meal) => meal.id === itemId);
        if (index !== -1) 
        {
            const meal = this._meals[index];

            this._totalCalories -= meal.calories;

            Storage.updateTotalCalories(this._totalCalories);

            this._meals.splice(index,1);

            this._totalCalories -= meal.calories;

            this._render();
        }
    }

    removeWorkout(itemId) 
    {
        const index = this._workouts.findIndex((workout) => workout.id === itemId);
        if (index !== -1) 
        {
            const workout = this._workouts[index];

            this._totalCalories += workout.calories;

            Storage.updateTotalCalories(this._totalCalories);

            this._workouts.splice(index, 1);

            this._totalCalories += workout.calories;

            this._render();
        }
    }

    reset(){
        this._totalCalories = 0;

        this._meals = [];

        this._workouts = [];

        this._render();
    }

    setLimit(calorieLimit){
        this._calorieLimit = calorieLimit;

        Storage.setCalorieLimit(calorieLimit);

        this._displayCalorieLimit();

        this._render();
    }

    loadItems(){
        this._meals.forEach((meal)=>{
            this._displayNewMeal(meal);
        })

        // this._workouts = Storage.getWorkouts();

        // this._render();
    }

    _displayCaloriesTotal()
    {
        const totalCaloriesEl = document.getElementById('calories-total');

        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCalorieLimit()
    {
        const calorieLimitEl = document.getElementById('calories-limit');

        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed()
    {
        const calorieConsumedEl = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce((total,meal) => total + meal.calories,0);

        calorieConsumedEl.innerHTML = +consumed;
    }
    
    _displayCaloriesBurned()
    {
        const calorieBurnedEl = document.getElementById('calories-burned');

        const burned = this._meals.reduce((total,workout) => total + workout.calories,0);

        calorieBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining()
    {
        const calorieRemainingEl = document.getElementById('calories-remaining');

        const progressEl = document.getElementById('calorie-progress');

        const remaining = this._calorieLimit - this._totalCalories;

        calorieRemainingEl.innerHTML = remaining;

        if(remaining < 0)
        {
            calorieRemainingEl.parentElement.parentElement.classList.remove('bg-light');calorieRemainingEl.parentElement.parentElement.classList.add('bg-danger');

            progressEl.classList.remove('bg-success');

            progressEl.classList.add('bg-danger');
        }
        else
        {
            calorieRemainingEl.parentElement.parentElement.classList.remove('bg-danger');

            calorieRemainingEl.parentElement.parentElement.classList.add('bg-light');

            progressEl.classList.remove('bg-danger');

            progressEl.classList.add('bg-success');
        }
    }

    _displayCaloriesProgess()
    {
        const progressEl = document.getElementById('calorie-progress');

        const percentage = (this._totalCalories / this._calorieLimit) * 100;

        // const percentage = Math.floor((this._totalCalories / this._calorieLimit) * 100);

        const width = Math.min(percentage,100);

        progressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal)
    {
        const mealsEl = document.getElementById('meal-items');

        const mealEl = document.createElement('div');

        mealEl.classList.add('card','my-2');

        mealEl.setAttribute('data-id',meal.id);

        mealEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}
                </h4>
                <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                    ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>`;
        mealsEl.appendChild(mealEl);
    }
    
    _displayNewWorkout(workout)
    {
        const workoutsEl = document.getElementById('workout-items');

        const workoutEl = document.createElement('div');

        workoutEl.classList.add('card','my-2');

        workoutEl.setAttribute('data-id',workout.id);

        workoutEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex      align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}
                </h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                  ${workout.calories}
                </div>
                <button           class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>`;
        workoutsEl.appendChild(workoutEl);
    }

    _render()
    {
        this._displayCaloriesTotal();

        this._displayCaloriesConsumed();

        this._displayCaloriesBurned();

        this._displayCaloriesRemaining();

        this._displayCaloriesProgess();
    }
}

class Meal{
    constructor(name,calories)
    {
        this.id = Math.random().toString(16).slice(2);

        this.name = name;

        this.calories = calories;
    }
}
    
class Workout{
    constructor(name,calories)
    {
        this.id = Math.random().toString(16).slice(2);

        this.name = name;

        this.calories = calories;
    }
}

class Storage
{
    static getCalorieLimit(defaultLimit = 2000)
    {
        let calorieLimit;
        if(localStorage.getItem('calorieLimit') === null)
        {
            calorieLimit = defaultLimit;
        }
        else
        {
            calorieLimit = localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit)
    {
        localStorage.setItem('calorieLimit',calorieLimit);
    }

    static getTotalCalories(defaultCalories = 0){
        let totalCalories;
        if(localStorage.getItem('totalCalories') === null)
        {
            totalCalories = defaultCalories;
        }
        else
        {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static updateTotalCalories(calories){
        localStorage.setItem('totalCalories', calories)
    }

    static getMeals(){
        let meals;
        if(localStorage.getItem('meals') === null)
        {
            meals = [];
        }
        else
        {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal){
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals',JSON.stringify(meals));
    }
    
    static getWorkouts()
    {
        let workouts;
        if(localStorage.getItem('workouts') === null)
        {
            workouts = [];
        }
        else
        {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkouts(workout)
    {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts',JSON.stringify(workouts));
    }
}

class App
{
    constructor()
    {
        this._tracker = new CalorieTracker();

        this._loadEventListeners();

        this._tracker.loadItems();

    }

    _loadEventListeners(){
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this , 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this , 'workout'));

        document.getElementById('meal-items').addEventListener('click',this._removeItem.bind(this,'meal'));

        document.getElementById('workout-items').addEventListener('click',this._removeItem.bind(this,'workout'));

        document.getElementById('filter-meals').addEventListener('keyup',this._filterItems.bind(this,'meal'));

        document.getElementById('filter-workouts').addEventListener('keyup',this._filterItems.bind(this,'workout'));
        
        document.getElementById('reset').addEventListener('click',this._reset.bind(this));
        
        document.getElementById('limit-form').addEventListener('submit',this._setlimit.bind(this));
    }

    _newItem(type,e)
    {
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);

        const calories = document.getElementById(`${type}-calories`);

        if(name.value === '' || calories.value === '')
        {
            alert('Please fill in all fields');

            return;
        }

        if(type === 'meal')
        {
            const meal = new Meal(name.value,+calories.value);

            this._tracker.addMeal(meal);
        }
        else
        {
            const workout = new Workout(name.value,+calories.value);

            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';
        
        if(type === 'meal')
        {
            const collapseMeal = document.getElementById('collapse-meal');

            // collapseItem.classList.toggle("show"); 

            setTimeout(() => collapseMeal.classList.toggle("show"),100);
        }
        else
        {
            const collapseWorkout = document.getElementById('collapse-workout');

            // collapseItem.classList.toggle("show"); 

            setTimeout(() => collapseWorkout.classList.toggle("show"),100);
        }
    }

    _removeItem(type,e)
    {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark'))
        {
            const itemId = e.target.closest('.card').dataset.id;
            if(type === 'meal')
            {
                this._tracker.removeMeal(itemId);
            }
            else
            {
                this._tracker.removeWorkout(itemId);
            }
            e.target.closest('.card').remove();
        }
    }   
    

    _filterItems(type,e)
    {
        const text = e.target.value.toLowerCase();

        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if(name.toLowerCase().indexOf(text) !== -1)
            {
                item.style.display = 'flex';
            }
            else
            {
                item.style.display = 'none';
            }
        });
    }

    _reset()
    {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';

        document.getElementById('workout-items').innerHTML = '';

        document.getElementById('filter-meals').value = '';

    }

    _setlimit(e)
    {
        e.preventDefault();
        const limit = document.getElementById('limit');
        if(limit.value === '')
        {
            alert('Please enter a value');
            return;
        }
        this._tracker.setLimit(+limit.value);

        limit.value = '';

        const modalEl = document.getElementById('limit-modal');

        const modal = bootstrap.Modal.getInstance(modalEl);

        modal.hide();
        
    }
}

const app = new App(); 