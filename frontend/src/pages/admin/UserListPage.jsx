import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const UserListPage = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>Users</h1>
      {loadingDelete && <div className="loader"></div>}
      {isLoading ? <div className="loader"></div> : error ? <div className="alert alert-danger">{error.data?.message}</div> : (
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.isAdmin ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => deleteHandler(user._id)}>
                    <FaTrash style={{ color: 'var(--danger-color)' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default UserListPage;
