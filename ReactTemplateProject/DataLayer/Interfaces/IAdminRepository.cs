using ReactTemplateProject.Models.DTOs.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.DataLayer.Interfaces
{
    public interface IAdminRepository
    {
        Task<Boolean> CreateRoleAsync(string roleName);
        List<IdentityRoleDTO> GetRoles();
        List<ApplicationUserDTO> GetUsers();
        Task<ApplicationUserDTO> GetUserDetailsAsync(string id);
        List<ApplicationUserDTO> SearchUsers(string query);
        Task<Boolean> EditUserAsync(ApplicationUserDTO dto);
        Task<IdentityRoleDTO> GetRoleDetailsAsync(string roleId);
        Task<bool> RenameRoleAsync(string roleId, string roleName);
        Task<bool> AddUserToRoleAsync(string userId, string roleId);
        Task<bool> RemoveUserFromRoleAsync(string userId, string roleId);
    }
}
