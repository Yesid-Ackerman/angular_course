import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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
  //Metodo para Eliminar una Tarea
  deleteTask(index: number){
    this.tasks.update((tasks)=>tasks.filter((task, position) => position !== index ));
  }

  addTask(tittle: string){
    const newTask = {
      id: Date.now(),
      tittle,
      completed: false,
    };
    this.tasks.update((tasks)=> [...tasks, newTask])
  }
  
}
