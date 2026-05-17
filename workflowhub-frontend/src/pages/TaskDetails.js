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
      const res = await apiClient.get(
        `/tasks/${id}/comments`
      );

      setComments(res.data);
    } catch (err) {
      console.error(
        "Failed to load comments",
        err
      );
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, [fetchTask, fetchComments]);

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await apiClient.post(
        `/tasks/${id}/comments`,
        {
          content: commentText,
        }
      );

      setCommentText("");

      fetchComments();
    } catch (err) {
      console.error(
        "Failed to add comment",
        err
      );

      alert("Failed to add comment");
    }
  };

  if (!task) {
    return (
      <div style={styles.loading}>
        Loading task...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>{task.title}</h1>

        <p>{task.description}</p>

        <div style={styles.meta}>
          <strong>Status:</strong>{" "}
          {task.status}
        </div>

        <div style={styles.meta}>
          <strong>Priority:</strong>{" "}
          {task.priority}
        </div>
      </div>

      <div style={styles.card}>
        <h2>Comments</h2>

        <div style={styles.commentInput}>
          <textarea
            value={commentText}
            onChange={(e) =>
              setCommentText(e.target.value)
            }
            placeholder="Write a comment..."
            style={styles.textarea}
          />

          <button
            onClick={addComment}
            style={styles.button}
          >
            Add Comment
          </button>
        </div>

        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={styles.comment}
            >
              <div>{c.content}</div>

              <small>
                {new Date(
                  c.createdAt
                ).toLocaleString()}
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
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)",
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
    borderBottom:
      "1px solid #e5e7eb",
  },

  loading: {
    padding: "40px",
  },
};

export default TaskDetails;
