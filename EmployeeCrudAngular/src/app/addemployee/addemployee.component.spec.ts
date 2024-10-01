import { TestBed } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { DatePipe } from '@angular/common'; // Asegúrate de importar DatePipe

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot() // Incluye el ToastrModule con su configuración predeterminada
      ],
      providers: [
        EmployeeService,
        DatePipe, // Agregar DatePipe a los proveedores
        {
          provide: ActivatedRoute, // Simula ActivatedRoute
          useValue: {
            queryParams: of({ id: 1 }) // Simula el parámetro id en la URL
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show warning if name is empty', () => {
    spyOn(toastrService, 'warning');
    const employee = new Employee(0, '', '');
    component.addEmployee(employee);
    expect(toastrService.warning).toHaveBeenCalledWith('El nombre no puede estar vacío.', 'Advertencia');
  });

  it('should show error if name exceeds 100 characters', () => {
    spyOn(toastrService, 'error');
    const longName = 'a'.repeat(101); // Nombre con 101 caracteres
    const employee = new Employee(0, longName, '');
    component.addEmployee(employee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener más de 100 caracteres.', 'Error');
  });

  it('should show error if name is shorter than 2 characters', () => {
    spyOn(toastrService, 'error');
    const employee = new Employee(0, 'A', '');
    component.addEmployee(employee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener menos de 2 caracteres.', 'Error');
  });

  it('should show error if name contains numbers', () => {
    spyOn(toastrService, 'error');
    const employee = new Employee(0, 'John123', '');
    component.addEmployee(employee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener números.', 'Error');
  });

  it('should show error if name is generic or trivial', () => {
    spyOn(toastrService, 'error');
    const employee = new Employee(0, 'Empleado', '');
    component.addEmployee(employee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede ser genérico o trivial.', 'Error');
  });

  it('should show error if name contains excessive character repetition', () => {
    spyOn(toastrService, 'error');
    const employee = new Employee(0, 'Jooooohn', '');
    component.addEmployee(employee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre contiene repeticiones excesivas de caracteres.', 'Error');
  });

  it('should not show error if name is valid', () => {
    spyOn(toastrService, 'error');
    const employee = new Employee(0, 'John Doe', '');
    component.employeeList = []; // Asegurar que la lista de empleados esté vacía
    component.addEmployee(employee);
    expect(toastrService.error).not.toHaveBeenCalled();
  });
});
