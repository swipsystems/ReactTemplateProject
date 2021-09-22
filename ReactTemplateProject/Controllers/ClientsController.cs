using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReactTemplateProject.DataLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/Clients")]
    public class ClientsController : ControllerBase
    {
        private IClientRepository _repo;
        private ILogger<ClientsController> _logger;
        public ClientsController(
            IClientRepository repo,
            ILogger<ClientsController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        /// <summary>
        /// Returns list of Clients for dropdown
        /// </summary>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>
        
        [HttpGet("GetDropdown")]
        public IActionResult GetDropdown()
        {
            try
            {
                return Ok(_repo.GetDropdown());
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// Returns list of Clients
        /// </summary>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>
        
        [HttpGet("GetClients")]
        public IActionResult GetClients()
        {
            try
            {
                return Ok(_repo.GetClients());
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        /// <summary>
        /// Returns list of Clients based on search query
        /// </summary>
        /// <returns>
        /// Task<IActionResult>
        /// </returns>

        [HttpGet("SearchClients")]
        public IActionResult SearchClients(string query)
        {
            try
            {
                return Ok(_repo.SearchClients(query));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
    }
}
