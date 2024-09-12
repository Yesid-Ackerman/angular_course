import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule], //importaciones ¡¡COLOCAR SIEMPRE, NUNCA OLVIDAR!!!
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola desde Welcome';
  tasks = [
    'Hola 1',
    'Hola 2',
    'Hola 3'
  ];  

  name = signal('Yesith');
  // private edad = 18 -> Esta variable es privada, no pude ser accesada desde el html facilmente
  edad = 18;

  disabled = true
  image = 'data:image/jpeg;base64,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'

person = signal({
  name: 'Yesith',
  age: 18,
  avatar: 'data:image/jpeg;base64,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',
  address: {
    street: 'Calle 123',
    city: 'Bogotá',
    country: 'Colombia'
    }
})
// Evento de tipo Alert en JS
cliclHandler(){
  alert('Hola desde Click')
}

changeHandler(event: Event ){
  console.log(event);
}
keydownHandler(event: KeyboardEvent){
  const input = event.target as HTMLInputElement;
  console.log(input.value);
}
shiftAlert(){
  alert('Has Presionado Shift + t')
}
changeHandlersignal(event: Event ){
  const input = event.target as HTMLInputElement;
  const newValue = input.value;
  this.name.set(newValue)
}
taskss = signal([
  'Hola 1',
  'Hola 2',
  'Hola 3'
]); 
changeAge(event: Event){
  const input = event.target as HTMLInputElement;
  const newValue = input.value;
  this.person.update(prevState => {
    return {
      ... prevState,
      age: parseInt(newValue,10)
    }
  });
}
changeName(event: Event){
  const input = event.target as HTMLInputElement;
  const newValue = input.value;
  this.person.update(prevState => {
    return {
      ... prevState,
      name: newValue
    }
  });
}
}
