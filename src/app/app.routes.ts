import { Routes } from '@angular/router';
import {CommonModule} from '@angular/common';
import { Component } from '@angular/core';
// Rutas vistas
import {HomeComponent} from './pages/home/home.component';
import {LabsComponent} from './pages/labs/labs.component';

// direccionamiento
export const routes: Routes = [
    {
        path: '', //nombre de la ruta
        component: HomeComponent //componente al que renderiza
    },
    {
        path: 'labs',
        component: LabsComponent
    }
];


