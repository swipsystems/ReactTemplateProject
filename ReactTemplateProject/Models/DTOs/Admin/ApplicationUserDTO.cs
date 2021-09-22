using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTemplateProject.Models.DTOs.Admin
{
    public class ApplicationUserDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string OfficePhone { get; set; }
        public string Ext { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public Boolean Active { get; set; }
    }
}
