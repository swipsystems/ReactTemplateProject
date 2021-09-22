using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.Models.DTOs.Admin
{
    public class IdentityRoleDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<ApplicationUserDTO> AddPool { get; set; }
        public List<ApplicationUserDTO> removePool { get; set; }
    }
}
