using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ReactTemplateProject.Data;
using ReactTemplateProject.DataLayer.Interfaces;
using ReactTemplateProject.Models;
using ReactTemplateProject.Models.DTOs.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.DataLayer.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ILogger<AdminRepository> _logger;
        private RoleManager<IdentityRole> _roleManager;
        private UserManager<ApplicationUser> _userManager;
        private ApplicationDbContext _db;
        public AdminRepository(
            ILogger<AdminRepository> logger,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext db)
        {
            _logger = logger;
            _roleManager = roleManager;
            _userManager = userManager;
            _db = db;
        }

        #region IdentityRoles

        /// <summary>
        /// Adds new IdentityRole to AspNetUserRoles 
        /// </summary>
        /// <param name="roleName"> Name of IdentityRole </param>
        /// <returns>
        /// Boolean
        /// </returns>

        public async Task<Boolean> CreateRoleAsync(string roleName)
        {
            try
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    var role = new IdentityRole() { Name = roleName };
                    var result = await _roleManager.CreateAsync(role);
                    return result.Succeeded;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.CreateRoleAsync - " + ex.Message);
            }
        }

        /// <summary>
        /// Gets list of IdentityRoles
        /// </summary>
        /// <returns>
        /// List of IdentityRolesDTOs
        /// </returns>

        public List<IdentityRoleDTO> GetRoles()
        {
            try
            {
                var dtos = new List<IdentityRoleDTO>();
                var roles = _roleManager.Roles.ToList();
                foreach (var role in roles)
                {
                    var dto = new IdentityRoleDTO()
                    {
                        Id = role.Id,
                        Name = role.Name
                    };
                    dtos.Add(dto);
                }
                return dtos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.GetRoles - " + ex.Message);
            }
        }

        /// <summary>
        /// Gets IdentityRole
        /// </summary>
        /// <param name="roleId"> Role Id </param>
        /// <returns>
        /// Task<IdentityRoleDTO>
        /// </returns>

        public async Task<IdentityRoleDTO> GetRoleDetailsAsync(string roleId)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                var users = _userManager.Users.ToList();

                var addPool = new List<ApplicationUserDTO>();
                var removePool = new List<ApplicationUserDTO>();

                foreach (var user in users)
                {
                    var au = new ApplicationUserDTO()
                    {
                        Id = user.Id,
                        Name = user.UserName
                    };

                    if (!await _userManager.IsInRoleAsync(user, role.Name))
                    {
                        addPool.Add(au);
                    }
                    else
                    {
                        removePool.Add(au);
                    }
                }

                var dto = new IdentityRoleDTO()
                {
                    Id = role.Id,
                    Name = role.Name,
                    AddPool = addPool,
                    removePool = removePool
                };

                return dto;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.GetRoleDetailsAsync - " + ex.Message);
            }
        }

        /// <summary>
        /// Renames IdentityRole
        /// </summary>
        /// <param name="roleId"> Role Id </param>
        /// /// <param name="roleName"> Role Name </param>
        /// <returns>
        /// Task<bool>
        /// </returns>

        public async Task<bool> RenameRoleAsync(string roleId, string roleName)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                var result = await _roleManager.SetRoleNameAsync(role, roleName);
                await _db.SaveChangesAsync();
                return result.Succeeded;
            }
            catch(Exception ex)
            {
                throw new Exception("Error in AdminRepository.RenameRoleAsync - " + ex.Message);
            }
        }


        /// <summary>
        /// Add new AspNetUserRole
        /// </summary>
        /// <param name="userId"> User Id </param>
        /// /// <param name="roleId"> Role Id </param>
        /// <returns>
        /// Task<bool>
        /// </returns>

        public async Task<bool> AddUserToRoleAsync(string userId, string roleId)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                var user = await _userManager.FindByIdAsync(userId);
                if (!await _userManager.IsInRoleAsync(user, role.Name))
                {
                    var result = await _userManager.AddToRoleAsync(user, role.Name);
                    await _db.SaveChangesAsync();
                    return result.Succeeded;
                }
                else
                {
                    return false;
                }
            }
            catch(Exception ex)
            {
                throw new Exception("Error in AdminRepository.AddUserToRole - " + ex.Message);
            }
        }

        /// <summary>
        /// Removes existing AspNetUserRole
        /// </summary>
        /// <param name="userId"> User Id </param>
        /// /// <param name="roleId"> Role Id </param>
        /// <returns>
        /// Task<bool>
        /// </returns>

        public async Task<bool> RemoveUserFromRoleAsync(string userId, string roleId)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                var user = await _userManager.FindByIdAsync(userId);
                if (await _userManager.IsInRoleAsync(user, role.Name))
                {
                    var result = await _userManager.RemoveFromRoleAsync(user, role.Name);
                    await _db.SaveChangesAsync();
                    return result.Succeeded;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.RemoveUserFromRoleAsync - " + ex.Message);
            }
        }

        #endregion

        #region ApplicationUsers

        /// <summary>
        /// Gets List of ApplicationUsers
        /// </summary>
        /// <returns>
        /// List of ApplicationUserDTOs
        /// </returns>

        public List<ApplicationUserDTO> GetUsers()
        {
            try
            {                
                var dtos = new List<ApplicationUserDTO>();
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    var dto = new ApplicationUserDTO()
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        OfficePhone = user.OfficePhone,
                        Ext = user.Ext,
                        HomePhone = user.HomePhone,
                        MobilePhone = user.MobilePhone,
                        Active = user.Active
                    };
                    dtos.Add(dto);
                }
                return dtos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.GetUsers - " + ex.Message);
            }
        }

        /// <sumamry>
        /// Gets List of ApplicationUsers based on search query
        /// </sumamry>
        /// <param name="query"> Search query </param>
        /// <returns>
        /// List of ApplicationUserDTOs
        /// </returns>

        public List<ApplicationUserDTO> SearchUsers(string query)
        {
            try
            {
                var dtos = GetUsers();
                return dtos.Where(i => !string.IsNullOrWhiteSpace(query) ?
                i.FirstName.StartsWith(query) ||
                i.LastName.StartsWith(query) ||
                i.OfficePhone.Contains(query)
                : i.Id != null)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.SearchUsers - " + ex.Message);
            }
        }

        /// <sumamry>
        /// Gets ApplicationUsers based on id
        /// </sumamry>
        /// <param name="id"> User Id </param>
        /// <returns>
        /// ApplicationUserDTO
        /// </returns>

        public async Task<ApplicationUserDTO> GetUserDetailsAsync(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if(user != null)
                {
                    var dto = new ApplicationUserDTO()
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        OfficePhone = user.OfficePhone,
                        Ext = user.Ext,
                        HomePhone = user.HomePhone,
                        MobilePhone = user.MobilePhone,
                        Active = user.Active
                    };
                    return dto;
                }
                else
                {
                    return new ApplicationUserDTO();
                }
            }
            catch(Exception ex)
            {
                throw new Exception("Error in AdminRepository.GetUserDetailsAsync - " + ex.Message);
            }
        }

        /// <sumamry>
        /// Edits ApplicationUsers based on id
        /// </sumamry>
        /// <param name="dto"> ApplicationUserDTO </param>
        /// <returns>
        /// Boolean
        /// </returns>

        public async Task<Boolean> EditUserAsync(ApplicationUserDTO dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(dto.Id);                
                if(user != null)
                {
                    user.FirstName = dto.FirstName;
                    user.LastName = dto.LastName;
                    user.Email = dto.Email;
                    user.OfficePhone = dto.OfficePhone;
                    user.Ext = dto.Ext;
                    user.HomePhone = dto.HomePhone;
                    user.MobilePhone = dto.MobilePhone;
                    user.Active = dto.Active;

                    await _db.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }
                
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AdminRepository.EditUserAsync - " + ex.Message);
            }
        }

        #endregion

    }
}
