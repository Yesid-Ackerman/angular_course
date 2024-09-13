import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal< Task[] >([
    {
      id: Date.now(),
      tittle: 'Tarea Con Identificador 1',
      completed: false
    },
    {
      id: Date.now(),
      tittle: 'Tarea Con Identificador 2',
      completed: false
    },
    {
      id: Date.now(),
      tittle: 'Tarea Con Identificador 3',
      completed: false
    },
  ]); 
  // Evento para gregar un nuevo elemento a una lista de tareas mediante un input
  changeHandler(event: Event){
    const input = event.target as HTMLInputElement;
    const newTask = input.value;
    // this.tasks.update((tasks)=> [...tasks, newTask])
    //Mejoramos el metodo agregando Typping
    this.addTask(newTask);
  }
  addTask(tittle: string){
    const newTask = {
      id: Date.now(),
      tittle,
      completed: false,
    };
    this.tasks.update((tasks)=> [...tasks, newTask])
  }
  //Metodo para Eliminar una Tarea
  deleteTask(index: number){
    this.tasks.update((tasks)=>tasks.filter((task, position) => position !== index ));
  }
  // Metodo y Funcion para que el input quede en blanco luego de agregar una tarea
  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  }); 
  inputHandlerY(){
    // Validacion para que tareas en blanco no sean agregadas
    if(this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value. trim();
      if(value !== ''){
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }    
    }
  }
  // Metodo para Actualizar el estado de una Tarea
  updateTask(index: number) {
    /*
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    });
    */
    this.tasks.update(state => {
      const currentTask = state[index];
      state[index] = {
        ...currentTask,
        completed: !currentTask.completed
      };
      return state;
    });
    
  }
  updateTaskEditingMode(index: number){
    this.tasks.update(prevState =>{
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        };
      })          
    })
  }
  updateTaskTextEnter(index: number, event: Event){
    const input = event.target as HTMLInputElement;
    this.tasks.update(prevState =>{
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            tittle : input.value,
            editing : false
          }
        }
        return task;
      })          
    })
  }
}
