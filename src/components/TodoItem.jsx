function TodoItem({ todo, index, onToggle, onEdit, onDelete }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={todo.completed}
          onChange={() => onToggle(index)}
        />

        <span
          style={{
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "gray" : "black",
          }}
        >
          {todo.text}
        </span>
      </div>

      <div>
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => onEdit(index)}
          disabled={todo.completed}
        >
          Edit
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(index)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
