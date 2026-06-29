import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Button, Dialog, Input, Table, Thead, Tbody, Tr, Th, Td } from "../components/ui";

function FamilyMembersCard({ members = [], onAddMember, onDeleteMember }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => {
    setFormData({ name: "", relation: "", phone: "" });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.relation || !formData.phone) return;
    try {
      setSubmitting(true);
      await onAddMember(formData);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-800 font-black text-lg flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            Family Members
          </h3>
          <Button
            onClick={handleOpen}
            size="sm"
            variant="ghost"
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-lg text-xs px-3 py-1.5 flex items-center gap-1 transition-colors"
          >
            <Plus size={14} />
            Add Member
          </Button>
        </div>

        <div className="overflow-x-auto">
          {members.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No family members added yet.
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-left py-3">Name</Th>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-left py-3">Relation</Th>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-left py-3">Phone Number</Th>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-right py-3 pr-2">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members.map((member) => (
                  <Tr key={member._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <Td className="py-4 text-slate-800 font-semibold text-sm">{member.name}</Td>
                    <Td className="py-4 text-slate-500 text-sm">{member.relation}</Td>
                    <Td className="py-4 text-slate-500 text-sm">{member.phone}</Td>
                    <Td className="py-4 text-right pr-2">
                      <button
                        onClick={() => onDeleteMember(member._id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Add Family Member"
        size="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Name"
            name="name"
            placeholder="Enter member name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Relation"
            name="relation"
            placeholder="Relation (e.g. Wife, Son, Daughter)"
            value={formData.relation}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="10 digit phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </form>
      </Dialog>
    </div>
  );
}

export default FamilyMembersCard;
