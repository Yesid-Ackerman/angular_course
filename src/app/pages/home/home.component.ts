import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal< Task[] >([
    // {
    //   id: Date.now(),
    //   tittle: 'Tarea Con Identificador 1',
    //   completed: false
    // },
    // {
    //   id: Date.now(),
    //   tittle: 'Tarea Con Identificador 2',
    //   completed: false
    // },
    // {
    //   id: Date.now(),
    //   tittle: 'Tarea Con Identificador 3',
    //   completed: false
    // },
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
  // Metodo para Poner en modo de edicion las tareas
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
  // Metodo para que las tareas se modifiquen una vez se presione Enter
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
  // Funcion para que solo me acepte parametros de filtrado iguales a 'All' | 'Pending' | 'Completed'
  filter = signal < 'All' | 'Pending' | 'Completed'> ('All');
  tasksByFilter = computed(()=>{
    const filter = this.filter();
    const tasks = this.tasks();
    if(filter === 'Pending'){
      return tasks.filter(task => !task.completed);
    } if(filter === 'Completed'){
      return tasks.filter(task => task.completed);
    }
    return tasks;
  });
  changeFilter(filter:  'All' | 'Pending' | 'Completed'){
    // this.filter.value = this.filter.value === 'All' ? 'Completed' : 'All';
    this.filter.set(filter);
  };
  // Funcion y Metodo para crear persitencia y los datos se mantengan cuando se recarga la pagina
  // COMPUTED calcula un nuevo estado a partir de otro && EFECT vigila cada vez que un estado cambia
      // constructor(){
      //   effect(() =>{ 
      //     const tasks = this.tasks();
      //     console.log(tasks)
      //     // "stringify" Convierte un Array de Objetos en un String
      //     localStorage.setItem('tasks', JSON.stringify(tasks));
      //   });
      // }
  // Verifica y obtiene la persistencia del localstorage
  injector = inject(Injector);

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }
  //Metodo para que no me limpie el localstoraje antes de ejecutar la funcion ngOnInit
  trackTasks() {
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }
}
