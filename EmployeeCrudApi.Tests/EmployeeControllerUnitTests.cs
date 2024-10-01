using EmployeeCrudApi.Controllers;
using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace EmployeeCrudApi.Tests
{
    public class EmployeeControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Crear una nueva base de datos en memoria para cada prueba
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfEmployees()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Employees.AddRange(
                new Employee { Id = 1, Name = "John Doe" },
                new Employee { Id = 2, Name = "Jane Doe" }
            );
            context.SaveChanges();

            var controller = new EmployeeController(context);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("John Doe", result[0].Name);
            Assert.Equal("Jane Doe", result[1].Name);
        }

        [Fact]
        public async Task GetById_ReturnsEmployeeById()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Employees.Add(new Employee { Id = 1, Name = "John Doe" });
            context.SaveChanges();

            var controller = new EmployeeController(context);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("John Doe", result.Name);
        }

        [Fact]
        public async Task Create_AddsEmployee()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new EmployeeController(context);

            var newEmployee = new Employee { Id = 3, Name = "New Employee" };

            // Act
            var result = await controller.Create(newEmployee);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var employee = await context.Employees.FindAsync(3);
            Assert.NotNull(employee);
            Assert.Equal("New Employee", employee.Name);
        }

        [Fact]
        public async Task Update_UpdatesEmployee()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var existingEmployee = new Employee { Id = 1, Name = "Old Name" };
            context.Employees.Add(existingEmployee);
            context.SaveChanges();

            var controller = new EmployeeController(context);

            var updatedEmployee = new Employee { Id = 1, Name = "Updated Name" };

            // Act
            await controller.Update(updatedEmployee);

            // Assert
            var employee = await context.Employees.FindAsync(1);
            Assert.NotNull(employee);
            Assert.Equal("Updated Name", employee.Name);
        }

        [Fact]
        public async Task Delete_RemovesEmployee()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var employeeToDelete = new Employee { Id = 1, Name = "John Doe" };
            context.Employees.Add(employeeToDelete);
            context.SaveChanges();

            var controller = new EmployeeController(context);

            // Act
            await controller.Delete(1);

            // Assert
            var employee = await context.Employees.FindAsync(1);
            Assert.Null(employee); // Verifica que el empleado fue eliminado
        }

        [Fact]
        public async Task Create_NameExceedsMaxLength_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new EmployeeController(context);
            var newEmployee = new Employee { Id = 1, Name = new string('A', 101) }; // Nombre de 101 caracteres

            // Act
            var result = await controller.Create(newEmployee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("El nombre no puede exceder los 100 caracteres.", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task Create_NameHasLessThanMinLength_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new EmployeeController(context);
            var newEmployee = new Employee { Id = 1, Name = "A" }; // Nombre con un solo carácter

            // Act
            var result = await controller.Create(newEmployee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("El nombre debe tener al menos 2 caracteres.", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task Create_NameContainsNumbers_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new EmployeeController(context);
            var newEmployee = new Employee { Id = 1, Name = "Juan123" }; // Nombre con números

            // Act
            var result = await controller.Create(newEmployee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("El nombre no puede contener números.", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task Create_NameIsTrivial_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new EmployeeController(context);
            var newEmployee = new Employee { Id = 1, Name = "Empleado" }; // Nombre trivial

            // Act
            var result = await controller.Create(newEmployee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("El nombre no puede ser genérico o trivial.", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task Create_NameHasExcessiveRepetitions_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new EmployeeController(context);
            var newEmployee = new Employee { Id = 1, Name = "Juuuuaannnn" }; // Nombre con repeticiones excesivas

            // Act
            var result = await controller.Create(newEmployee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("El nombre contiene repeticiones excesivas de caracteres.", badRequestResult.Value.ToString());
        }
    }
}
