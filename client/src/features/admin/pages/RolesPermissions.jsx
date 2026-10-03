import React, { useState } from "react";
import { ShieldCheck, Check, Save, UserCheck, Lock } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { initialRoles } from "../../../data/admin/usersRolesData";

const RolesPermissions = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(initialRoles[0]);
  const [saved, setSaved] = useState(false);

  const modules = [
    { key: "dashboard", label: "Dashboard Analytics" },
    { key: "leads", label: "Leads & Enquiries" },
    { key: "students", label: "Students Registry" },
    { key: "courses", label: "Course Curriculum" },
    { key: "batches", label: "Batch Schedules" },
    { key: "payments", label: "Payments & Financials" },
    { key: "certificates", label: "Certificate Issuance" },
    { key: "blogs", label: "Blog Editorial Hub" },
    { key: "settings", label: "System Settings" },
  ];

  const handleToggle = (moduleKey, action) => {
    if (selectedRole.name === "Super Admin") return;

    const currentPerm = selectedRole.permissions[moduleKey] || {
      view: false,
      create: false,
      edit: false,
      delete: false,
    };

    const updatedRole = {
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [moduleKey]: {
          ...currentPerm,
          [action]: !currentPerm[action],
        },
      },
    };

    setSelectedRole(updatedRole);
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions Matrix"
        description="Configure granular role-based access control (RBAC) governing what each staff level can view, create, edit, or delete."
        breadcrumbs={[{ label: "Roles & Permissions" }]}
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <Check size={16} className="text-emerald-600" />
          <span>Role permissions updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[13px]late-400">
            Institutional Roles
          </p>

          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${selectedRole.id === role.id
                  ? "border-blue-600 bg-blue-50/50 shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[13px]late-900 text-[13px]m">{role.name}</h4>
                  <span className="text-[13px] font-semibold text-[13px]late-400">
                    {role.usersAssigned} Users
                  </span>
                </div>
                <p className="text-xs text-[13px]late-500 mt-1 leading-relaxed">
                  {role.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[13px]late-900">
                    Permissions: {selectedRole.name}
                  </h3>
                  {selectedRole.name === "Super Admin" && (
                    <span className="flex items-center gap-1 text-[13px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                      <Lock size={11} />
                      Full Unrestricted Root Access
                    </span>
                  )}
                </div>
                <p className="text-xs text-[13px]late-500 mt-0.5">
                  Checkboxes control individual module capability flags.
                </p>
              </div>

              {selectedRole.name !== "Super Admin" && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 shadow-sm cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Matrix</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-[13px] font-bold uppercase text-[13px]late-500">
                  <tr>
                    <th className="p-4">Module Name</th>
                    <th className="p-4 text-center">View</th>
                    <th className="p-4 text-center">Create</th>
                    <th className="p-4 text-center">Edit</th>
                    <th className="p-4 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modules.map((m) => {
                    const perm = selectedRole.permissions[m.key] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                    };
                    const isSuper = selectedRole.name === "Super Admin";

                    return (
                      <tr key={m.key} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-[13px]late-900">
                          {m.label}
                        </td>
                        {["view", "create", "edit", "delete"].map((act) => (
                          <td key={act} className="p-4 text-center">
                            <input
                              type="checkbox"
                              disabled={isSuper}
                              checked={isSuper ? true : Boolean(perm[act])}
                              onChange={() => handleToggle(m.key, act)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-75 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;
