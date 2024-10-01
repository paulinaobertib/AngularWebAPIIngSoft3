using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Employee>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet]
        public async Task<Employee> GetById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            if (employee.Name.Length > 100)
            {
                return BadRequest(new
                {
                    status = 400,
                    error = "Bad Request",
                    message = "El nombre no puede exceder los 100 caracteres."
                });
            }

            if (employee.Name.Length < 2)
            {
                return BadRequest(new
                {
                    status = 400,
                    error = "Bad Request",
                    message = "El nombre debe tener al menos 2 caracteres."
                });
            }

            if (employee.Name.Any(char.IsDigit))
            {
                return BadRequest(new
                {
                    status = 400,
                    error = "Bad Request",
                    message = "El nombre no puede contener números."
                });
            }

            string[] nombresProhibidos = { "Empleado", "N/A", "Nombre", "Unknown" };
            if (nombresProhibidos.Contains(employee.Name, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    status = 400,
                    error = "Bad Request",
                    message = "El nombre no puede ser genérico o trivial."
                });
            }

            if (HasExcessiveRepetitions(employee.Name))
            {
                return BadRequest(new
                {
                    status = 400,
                    error = "Bad Request",
                    message = "El nombre contiene repeticiones excesivas de caracteres."
                });
            }

            employee.CreatedDate = DateTime.Now;
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = 200,
                message = "Empleado creado con éxito."
            });
        }

        // Función auxiliar para validar repeticiones excesivas de caracteres.
        private bool HasExcessiveRepetitions(string input)
        {
            int repetitionThreshold = 2; // Definir un umbral de repeticiones permitidas.
            for (int i = 0; i < input.Length - repetitionThreshold; i++)
            {
                if (input.Skip(i).Take(repetitionThreshold + 1).Distinct().Count() == 1)
                {
                    return true;
                }
            }
            return false;
        }

        [HttpPut]
        public async Task Update([FromBody] Employee employee)
        {
            Employee employeeToUpdate = await _context.Employees.FindAsync(employee.Id);
            employeeToUpdate.Name = employee.Name;
            await _context.SaveChangesAsync();
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);
            _context.Remove(employeeToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
