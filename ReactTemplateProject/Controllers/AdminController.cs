using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReactTemplateProject.DataLayer.Interfaces;
using ReactTemplateProject.Models;
using ReactTemplateProject.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactTemplateProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/Admin")]
    public class AdminController : ControllerBase
    {
        private IAdminRepository _adminRepo;
        private IClientRepository _clientRepo;
        private UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AdminController> _logger;
        public AdminController(
            IAdminRepository adminRepo,
            IClientRepository clientRepo,
            UserManager<ApplicationUser> userManager,
            ILogger<AdminController> logger)
        {
            _adminRepo = adminRepo;
            _clientRepo = clientRepo;
            _userManager = userManager;
            _logger = logger;
        }

        #region IdentityRoles

        /// <summary>
        /// Gets current user's admin status
        /// </summary>
        /// <returns>
        /// Boolean
        /// </returns>

        public async Task<Boolean> IsAdminUser()
        {
            try
            {
                ClaimsPrincipal claims = this.User;
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
                var user = await _userManager.FindByIdAsync(userId);
                if (await _userManager.IsInRoleAsync(user, "Admin"))
                    return true;
                else
                    return false;
            }
            catch(Exception ex)
            {
                throw new Exception("Error in  AdminController.IsAdminUser - " + ex.Message);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => Adds new IdentityRole to AspNetUserRoles 
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="roleName"> Name of IdentityRole </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("CreateRoleAsync")]
        public async Task<IActionResult> CreateRoleAsync(string roleName)
        {
            try
            {                
                if (await IsAdminUser())
                    return Ok(await _adminRepo.CreateRoleAsync(roleName));
                else
                    return StatusCode(403);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => returns List of IdentityRoles
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("GetRolesAsync")]
        public async Task<IActionResult> GetRolesAsync()
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(_adminRepo.GetRoles());
                else
                    return StatusCode(403);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => returns IdentityRole
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param  name="=roleId"> Role Id </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>
         
        [HttpGet("GetRoleDetailsAsync")]
        public async Task<IActionResult> GetRoleDetailsAsync(string roleId)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(await _adminRepo.GetRoleDetailsAsync(roleId));
                else
                    return StatusCode(403);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => Rename IdentityRole
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="roleId"> Role Id </param>
        /// /// <param name="roleName"> Role Name </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>
        
        [HttpGet("RenameRoleAsync")]
        public async Task<IActionResult> RenameRoleAsync(string roleId, string roleName)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(await _adminRepo.RenameRoleAsync(roleId, roleName));
                else
                    return StatusCode(403);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }


        /// <summary>
        /// If: current user is in Admin role => Add new AspNetUserRole
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="userId"> User Id </param>
        /// /// <param name="roleId"> Role Id </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>


        [HttpGet("AddUserToRoleAsync")]
        public async Task<IActionResult> AddUserToRoleAsync(string userId, string roleId)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(await _adminRepo.AddUserToRoleAsync(userId, roleId));
                else
                    return StatusCode(403);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => Removes existing AspNetUserRole
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="userId"> User Id </param>
        /// /// <param name="roleId"> Role Id </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("RemoveUserFromRoleAsync")]
        public async Task<IActionResult> RemoveUserFromRoleAsync(string userId, string roleId)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(await _adminRepo.RemoveUserFromRoleAsync(userId, roleId));
                else
                    return StatusCode(403);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }


        /// <summary>
        /// Gets current user's admin status
        /// </summary>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("IsAdminAsync")]
        public async Task<IActionResult> IsAdminAsync()
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(true);
                else
                    return Ok(false);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        #endregion

        #region ApplicationUsers

        /// <summary>
        /// If: current user is in Admin role => returns List of ApplicationUsers
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("GetUsersAsync")]
        public async Task<IActionResult> GetUsersAsync()
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(_adminRepo.GetUsers());
                else
                    return StatusCode(403);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => returns List of ApplicationUsers based on search query
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="query"> Search query </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("SearchUsersAsync")]
        public async Task<IActionResult> SearchUsersAsync(string query)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(_adminRepo.SearchUsers(query));
                else
                    return StatusCode(403);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        #endregion

        #region Clients

        /// <summary>
        /// If: current user is in Admin role => Adds new Client to Clients
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="dto"> ClientDTO </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpPost("AddClientAsync")]
        public async Task<IActionResult> AddClientAsync(ClientDTO dto)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(_clientRepo.AddClient(dto));
                else
                    return StatusCode(403);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// If: current user is in Admin role => Edits existing Client
        /// Else: returns 403 Forbidden
        /// </summary>
        /// <param name="dto"> ClientDTO </param>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpPost("EditClientAsync")]
        public async Task<IActionResult> EditClientAsync(ClientDTO dto)
        {
            try
            {
                if (await IsAdminUser())
                    return Ok(_clientRepo.EditClient(dto));
                else
                    return StatusCode(403);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        #endregion

    }
}
