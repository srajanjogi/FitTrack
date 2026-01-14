import { useState } from 'react'

function MembersPage() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', phone: '9876543210', status: 'ACTIVE', joinDate: '2024-01-10' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9123456780', status: 'ACTIVE', joinDate: '2024-02-05' },
    { id: 3, name: 'Rahul Mehta', email: 'rahul@example.com', phone: '9988776655', status: 'INACTIVE', joinDate: '2023-11-21' },
  ])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const newMember = {
      id: members.length + 1,
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status,
      joinDate: new Date().toISOString().slice(0, 10),
    }
    setMembers((prev) => [newMember, ...prev])
    setForm({ name: '', email: '', phone: '', status: 'ACTIVE' })
  }

  return (
    <div className="members-layout">
      <div className="members-main">
        <div className="members-header">
          <div>
            <h1>Members</h1>
            <p>View and manage all gym members in one place.</p>
          </div>
          <div className="members-count-pill">{members.length} total</div>
        </div>

        <div className="members-table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>
                    <span className={`status-pill status-${m.status.toLowerCase()}`}>{m.status}</span>
                  </td>
                  <td>{m.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="members-aside">
        <h2>Add member</h2>
        <p className="members-aside-text">Quickly add a new member. Later this will save to the database.</p>
        <form className="members-form" onSubmit={handleSubmit}>
          <div className="members-field">
            <label htmlFor="member-name">Full name</label>
            <input
              id="member-name"
              name="name"
              type="text"
              placeholder="Member name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="members-field">
            <label htmlFor="member-email">Email</label>
            <input
              id="member-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="members-field">
            <label htmlFor="member-phone">Phone</label>
            <input
              id="member-phone"
              name="phone"
              type="text"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="members-field">
            <label htmlFor="member-status">Status</label>
            <select
              id="member-status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <button type="submit" className="members-button">
            Save member
          </button>
        </form>
      </aside>
    </div>
  )
}

export default MembersPage

