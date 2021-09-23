using ReactTemplateProject.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.DataLayer.Interfaces
{
    public interface IClientRepository
    {
        List<DropdownDTO> GetDropdown();
        List<ClientDTO> GetClients();
        List<ClientDTO> SearchClients(string query);
        Boolean AddClient(ClientDTO dto);
        Boolean EditClient(ClientDTO dto);
        ClientDTO GetClientDetails(int id);
    }
}
