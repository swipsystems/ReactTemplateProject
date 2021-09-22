import authService from "../api-authorization/AuthorizeService"

const AdminFunctions = {
    isAdminAsync: async function() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/IsAdminAsync`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data;
    },
    AdminRoleId: '3057196f-40ed-4cdd-b1ef-5c040a1ce311'
}

export default AdminFunctions;