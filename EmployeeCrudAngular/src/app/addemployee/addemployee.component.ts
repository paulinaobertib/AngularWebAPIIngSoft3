import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})

export class AddemployeeComponent implements OnInit {
  newEmployee: Employee = new Employee(0, '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';
  employeeList: Employee[] = [];

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if(employeeId)
      this.editEmployee(employeeId);
    });

    // Obtener todos los empleados
    this.employeeService.getAllEmployee().subscribe((employees: Employee[]) => {
      this.employeeList = employees;
    });
  }

  addEmployee(employee: Employee) {
    // Validación de nombre vacío
    if (employee.name == ""){
      this.toastr.warning('El nombre no puede estar vacío.', 'Advertencia');
      return;
    }

    // Validación de longitud máxima (100 caracteres)
    if (employee.name.length > 100){
      this.toastr.error('El nombre no puede tener más de 100 caracteres.', 'Error');
      return;
    }

    // Validación de longitud mínima (2 caracteres)
    if (employee.name.length < 2){
      this.toastr.error('El nombre no puede tener menos de 2 caracteres.', 'Error');
      return;
    }

    // Validación de números en el nombre
    const number = /\d/;
    if (number.test(employee.name)) {
      this.toastr.error('El nombre no puede tener números.', 'Error');
      return;
    }

    // Validación de nombres prohibidos
    const trivialNames = ['Empleado', 'Trabajador', 'Persona', 'Admin'];
    if (trivialNames.includes(employee.name)) {
      this.toastr.error('El nombre no puede ser genérico o trivial.', 'Error');
      return;
    }

    // Validación de repeticiones excesivas de caracteres
    if (this.hasExcessiveRepetitions(employee.name)) {
      this.toastr.error('El nombre contiene repeticiones excesivas de caracteres.', 'Error');
      return;
    }

    // Validación si el nombre ya existe en la lista de empleados
    const nameExists = this.employeeList.some(emp => emp.name.toLowerCase() === employee.name.toLowerCase());
    if (nameExists) {
      this.toastr.error('El nombre del empleado ya existe.', 'Error');
      return;
    }

    // Creación o actualización de empleado
    if (employee.id == 0) {
      employee.createdDate = new Date().toISOString();
      this.employeeService.createEmployee(employee).subscribe(result => this.router.navigate(['/']));
    }
    else {
      employee.createdDate = new Date().toISOString();
      this.employeeService.updateEmployee(employee).subscribe(result => this.router.navigate(['/']));
    }
    this.submitBtnText = "";
    this.imgLoadingDisplay = 'inline';
  }

  // Función para detectar repeticiones excesivas de caracteres
  hasExcessiveRepetitions(input: string): boolean {
    const repetitionThreshold = 2; // Número de repeticiones permitidas
    for (let i = 0; i < input.length - repetitionThreshold; i++) {
      const substring = input.slice(i, i + repetitionThreshold + 1);
      if (new Set(substring).size === 1) {
        return true;
      }
    }
    return false;
  }

  editEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(res => {
      this.newEmployee.id = res.id;
      this.newEmployee.name = res.name
      this.submitBtnText = "Edit";
    });
  }

}
