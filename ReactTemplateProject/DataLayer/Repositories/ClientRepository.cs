using Microsoft.Extensions.Logging;
using ReactTemplateProject.Data;
using ReactTemplateProject.DataLayer.Interfaces;
using ReactTemplateProject.Models.DTOs;
using ReactTemplateProject.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.DataLayer.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly ILogger<ClientRepository> _logger;        
        private ApplicationDbContext _db;
        public ClientRepository(
            ILogger<ClientRepository> logger,
            ApplicationDbContext db)
        {
            _logger = logger;
            _db = db;
        }

        /// <summary>
        /// Gets Clients for dropdown
        /// </summary>
        /// <returns>
        /// List<DropdownDTO>
        /// </returns>
        
        public List<DropdownDTO> GetDropdown()
        {
            try
            {
                var dtos = new List<DropdownDTO>();
                var clients = _db.Clients.ToList();
                foreach(var client in clients)
                {
                    var dto = new DropdownDTO()
                    {
                        Id = client.Id,
                        Label = client.Name
                    };
                    dtos.Add(dto);
                }
                return dtos;
            }
            catch(Exception ex)
            {
                throw new Exception("Error in ClientRepository.GetDropdown - " + ex.Message);
            }
        }

        /// <summary>
        /// Gets List of Clients
        /// </summary>
        /// <returns>
        /// List<ClientDTO>
        /// </returns>
        
        public List<ClientDTO> GetClients()
        {
            try
            {
                var dtos = new List<ClientDTO>();
                var clients = _db.Clients.ToList();
                foreach(var client in clients)
                {
                    var dto = new ClientDTO()
                    {
                        Id = client.Id,
                        Name = client.Name
                    };
                    dtos.Add(dto);
                }
                return dtos;
            }
            catch(Exception ex)
            {
                throw new Exception("Error in ClientRepository.GetClients - " + ex.Message);
            }
        }

        /// <summary>
        /// Gets List of Clients based on search query
        /// </summary>
        /// <param name="query"> Search query </param>
        /// <returns>
        /// List<ClientDTO>
        /// </returns>
         
        public List<ClientDTO> SearchClients(string query)
        {
            try
            {
                var dtos = GetClients();
                return dtos.Where(i => !string.IsNullOrWhiteSpace(query) ?
                i.Name.StartsWith(query)
                : i.Id != null)
                    .ToList();
            }
            catch(Exception ex)
            {
                throw new Exception("Error in ClientRepository.SearchClients - " + ex.Message);
            }
        }

        /// <summary>
        /// Adds new Client to Clients
        /// </summary>
        /// <param name="dto"> ClientDTO </param>
        /// <returns>
        /// Boolean
        /// </returns>
        
        public Boolean AddClient(ClientDTO dto)
        {
            try
            {
                var clients = GetClients();
                if(clients.Where(i => i.Name == dto.Name).ToList().Count == 0)
                {
                    var client = new Client()
                    {
                        Name = dto.Name
                    };
                    _db.Clients.Add(client);
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(Exception ex)
            {
                throw new Exception("Error in ClientRepository.AddClient - " + ex.Message);
            }
        }

        /// <summary>
        /// Edits existing Client
        /// </summary>
        /// <param name="dto"> ClientDTO </param>
        /// <returns>
        /// Boolean
        /// </returns>

        public Boolean EditClient(ClientDTO dto)
        {
            try
            {
                var client = _db.Clients.FirstOrDefault(i => i.Id == dto.Id);
                if(client != null)
                {
                    client.Name = dto.Name;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(Exception ex)
            {
                throw new Exception("Error in ClientRepository.EditClient - " + ex.Message);
            }
        }
    }
}
