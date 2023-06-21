class CalorieTracker{
    constructor(){
        this._calorieLimit = 1020;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
    }
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories; 
        this._render();
    } 
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories; 
        this._render();
    }

    _displayCaloriesTotal(){
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCalorieLimit(){
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed(){
        const calorieConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total,meal) => total + meal.calories,0);
        calorieConsumedEl.innerHTML = +consumed;
    }
    
    _displayCaloriesBurned(){
        const calorieBurnedEl = document.getElementById('calories-burned');
        const burned = this._meals.reduce((total,workout) => total + workout.calories,0);
        calorieBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining(){
        const calorieRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');
        const remaining = this._calorieLimit - this._totalCalories;
        calorieRemainingEl.innerHTML = remaining;

        if(remaining < 0){
         calorieRemainingEl.parentElement.parentElement.classList.remove('bg-light');calorieRemainingEl.parentElement.parentElement.classList.add('bg-danger');
         progressEl.classList.remove('bg-success')
         progressEl.classList.add('bg-danger')
        }else{
            calorieRemainingEl.parentElement.parentElement.classList.remove('bg-danger');calorieRemainingEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }

    _displayCaloriesProgess(){
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        // const percentage = Math.floor((this._totalCalories / this._calorieLimit) * 100);
        const width = Math.min(percentage,100);
        progressEl.style.width = `${width}%`;
    }

    _render(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgess();
    }
}

class Meal{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}
    
class Workout{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}
    
// const tracker = new CalorieTracker();
// const breakfast = new Meal('Breakfast',400);
// const Lunch = new Meal('Lunch',150);
// tracker.addMeal(breakfast);
// tracker.addMeal(Lunch);


// const run = new Workout('Run',0);
// tracker.addWorkout(run);


class App{
    constructor(){
        this._tracker = new CalorieTracker();
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));      
        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));
    }
    _newMeal(e){
        e.preventDefault();
        const name = document.getElementById('meal-name');
        const calories = document.getElementById('meal-calories');
        if(name.value === '' || +calories.value === ''){
            alert('Please fill in all fields');
            return;
        }
        const meal = new Meal(name.value,calories.value);
        this._tracker.addMeal(meal);

        name.value = '';
        calories.value = '';

        const collapseMeal = document.getElementById('collapse-meal');
        collapseMeal.classList.toggle("show");
        // collapseMeal.classList.remove('show');
    }

    _newWorkout(e){
        e.preventDefault();
        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');
        if(name.value === '' || +calories.value === ''){
            alert('Please fill in all fields');
            return;
        }
        const workout = new Workout(name.value,calories.value);
        this._tracker.addWorkout(workout);

        name.value = '';
        calories.value = '';
        
        const collapseMeal = document.getElementById('collapse-workout');
        collapseMeal.classList.toggle("show");
        // collapseMeal.classList.remove('show');
    }
}

const app = new App(); 