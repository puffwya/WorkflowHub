import React, {
  useState,
  useEffect,
  useCallback
} from "react";

import { useParams } from "react-router-dom";
import apiClient from "../apiClient";

function TaskDetails() {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [requests, setRequests] = useState([]);

  const fetchTask = useCallback(async () => {
    try {
      const res = await apiClient.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error("Failed to load task", err);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await apiClient.get(`/tasks/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  }, [id]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await apiClient.get(`/tasks/${id}/status-requests`);
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load status requests", err);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
    fetchComments();
    fetchRequests();
  }, [fetchTask, fetchComments, fetchRequests]);

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await apiClient.post(`/tasks/${id}/comments`, {
        content: commentText,
      });

      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment", err);
      alert("Failed to add comment");
    }
  };

  const approveRequest = async (requestId) => {
    try {
      await apiClient.post(
        `/tasks/status-requests/${requestId}/approve`
      );

      fetchTask();
      fetchRequests();
    } catch (err) {
      console.error("Approve failed", err);
      alert("Failed to approve request");
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await apiClient.post(
        `/tasks/status-requests/${requestId}/reject`
      );

      fetchRequests();
    } catch (err) {
      console.error("Reject failed", err);
      alert("Failed to reject request");
    }
  };

  if (!task) {
    return <div style={styles.loading}>Loading task...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>{task.title}</h1>
        <p>{task.description}</p>

        <div style={styles.meta}>
          <strong>Status:</strong> {task.status}
        </div>

        <div style={styles.meta}>
          <strong>Priority:</strong> {task.priority}
        </div>
      </div>

      {/* ========================= */}
      {/* STATUS CHANGE REQUESTS */}
      {/* ========================= */}
      <div style={styles.card}>
        <h2>Status Change Requests</h2>

        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} style={styles.request}>
              <div>
                <strong>Requested Status:</strong> {r.requestedStatus}
              </div>

              <div>
                <strong>Status:</strong> {r.status}
              </div>

              <div style={styles.requestButtons}>
                <button
                  style={styles.approveBtn}
                  onClick={() => approveRequest(r.id)}
                >
                  Approve
                </button>

                <button
                  style={styles.rejectBtn}
                  onClick={() => rejectRequest(r.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================= */}
      {/* COMMENTS */}
      {/* ========================= */}
      <div style={styles.card}>
        <h2>Comments</h2>

        <div style={styles.commentInput}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            style={styles.textarea}
          />

          <button onClick={addComment} style={styles.button}>
            Add Comment
          </button>
        </div>

        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} style={styles.comment}>
              <div>{c.content}</div>
              <small>
                {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#f4f7fb",
    minHeight: "100vh",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "18px",
    marginBottom: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  meta: {
    marginTop: "10px",
  },

  commentInput: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "25px",
  },

  textarea: {
    minHeight: "90px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
  },

  button: {
    width: "fit-content",
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  comment: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
  },

  loading: {
    padding: "40px",
  },

  request: {
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  requestButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  approveBtn: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  rejectBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default TaskDetails;
