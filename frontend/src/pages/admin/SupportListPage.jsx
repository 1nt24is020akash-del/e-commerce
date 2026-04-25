import React from 'react';
import { useGetQueriesQuery, useUpdateQueryStatusMutation } from '../../slices/supportApiSlice';
import { FaCheck, FaClock } from 'react-icons/fa';

const SupportListPage = () => {
  const { data: queries, isLoading, error, refetch } = useGetQueriesQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateQueryStatusMutation();

  const statusHandler = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h1>Customer Support Queries</h1>
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="alert alert-danger">{error?.data?.message || error.error}</div>
      ) : (
        <div className="table-container card-glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>MESSAGE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td className="message-cell">{query.message}</td>
                  <td>
                    <span className={`status-badge status-${query.status.toLowerCase().replace(' ', '-')}`}>
                      {query.status}
                    </span>
                  </td>
                  <td>
                    {query.status !== 'Resolved' && (
                      <button
                        className="btn-icon btn-success"
                        onClick={() => statusHandler(query._id, 'Resolved')}
                        title="Mark as Resolved"
                        disabled={isUpdating}
                      >
                        <FaCheck />
                      </button>
                    )}
                    {query.status === 'Pending' && (
                      <button
                        className="btn-icon btn-warning"
                        onClick={() => statusHandler(query._id, 'In Progress')}
                        title="Mark as In Progress"
                        disabled={isUpdating}
                      >
                        <FaClock />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupportListPage;
