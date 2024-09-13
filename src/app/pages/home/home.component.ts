import {
  Component,
  Injector,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home', // Define el selector del componente
  standalone: true, // Indica que este componente no depende de un módulo
  imports: [ReactiveFormsModule], // Importa los módulos necesarios para el componente
  templateUrl: './home.component.html', // La ruta al archivo de plantilla HTML
  styleUrls: ['./home.component.css'], // La ruta al archivo de estilos CSS
})
export class HomeComponent {
  // Declaración de señales que representan el estado de las tareas y el filtro activo
  tasks = signal<Task[]>([]); // Lista de tareas (con Signal de Angular)
  filter = signal<'All' | 'Pending' | 'Completed'>('All'); // Filtro de tareas (todas, pendientes, completadas)

  // Computed: calcula y devuelve las tareas según el filtro aplicado
  tasksByFilter = computed(() => {
    const filter = this.filter(); // Obtiene el valor actual del filtro
    const tasks = this.tasks(); // Obtiene la lista de tareas
    if (filter === 'Pending') {
      return tasks.filter((task) => !task.completed); // Retorna solo las tareas pendientes
    }
    if (filter === 'Completed') {
      return tasks.filter((task) => task.completed); // Retorna solo las tareas completadas
    }
    return tasks; // Retorna todas las tareas
  });

  // Control del formulario para una nueva tarea, con validaciones
  newTaskCtrl = new FormControl('', {
    nonNullable: true, // Controla que el valor no pueda ser nulo
    validators: [
      Validators.required, // Valida que el campo no esté vacío
    ],
  });

  // Inyección del servicio Injector
  injector = inject(Injector);

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit() {
    const storage = localStorage.getItem('tasks'); // Obtiene las tareas del localStorage
    if (storage) {
      const tasks = JSON.parse(storage); // Si hay datos en el localStorage, los convierte a objeto
      this.tasks.set(tasks); // Actualiza la lista de tareas
    }
    this.trackTasks(); // Llama a la función que monitorea los cambios en las tareas
  }

  // Monitorea los cambios en las tareas y las guarda en el localStorage
  trackTasks() {
    effect(
      () => {
        const tasks = this.tasks(); // Obtiene las tareas actuales
        console.log(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guarda las tareas en el localStorage
      },
      { injector: this.injector }
    );
  }

  // Maneja el evento de cambio al agregar una nueva tarea
  changeHandler() {
    if (this.newTaskCtrl.valid) {
      // Verifica si el formulario es válido
      const value = this.newTaskCtrl.value.trim(); // Obtiene y limpia el valor del formulario
      if (value !== '') {
        this.addTask(value); // Agrega la nueva tarea
        this.newTaskCtrl.setValue(''); // Limpia el campo de entrada
      }
    }
  }

  // Agrega una nueva tarea a la lista
  addTask(tittle: string) {
    const newTask = {
      id: Date.now(),
      tittle,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  // Elimina una tarea de la lista según su índice
  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  // Metodo y Funcion para que el input quede en blanco luego de agregar una tarea
  inputHandlerY() {
    // Validacion para que tareas en blanco no sean agregadas
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  // Metodo para que las tareas se modifiquen una vez se presione Enter
  updateTaskTextEnter(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            tittle: input.value,
            editing: false,
          };
        }
        return task;
      });
    });
  }

  // Actualiza el estado de una tarea (completada o no)
  updateTask(index: number) {
    this.tasks.update((state) => {
      const currentTask = state[index];
      state[index] = {
        ...currentTask,
        completed: !currentTask.completed,
      };
      return state;
    });
  }

  // Habilita el modo de edición de una tarea específica
  updateTaskEditingMode(index: number) {
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true, // Activa el modo de edición para la tarea seleccionada
          };
        }
        return {
          ...task,
          editing: false, // Desactiva el modo de edición para el resto de tareas
        };
      });
    });
  }

  // Actualiza el texto de una tarea tras la edición
  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement; // Obtiene el nuevo valor del input
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value, // Actualiza el título de la tarea
            editing: false, // Sale del modo de edición
          };
        }
        return task;
      });
    });
  }

  // Cambia el filtro aplicado para las tareas
  changeFilter(filter: 'All' | 'Pending' | 'Completed') {
    this.filter.set(filter); // Establece el nuevo filtro
  }
}
