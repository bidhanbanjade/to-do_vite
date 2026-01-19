import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";

function App() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState(""); // Due date state
  const [priority, setPriority] = useState("medium"); // Priority state (high, medium, low)
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate"); // Sort by either dueDate or priority

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error parsing saved tasks", error);
        setTasks([]);
      }
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage", error);
      }
    }
  }, [tasks]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const addOrUpdateTask = () => {
    if (task.trim() === "") return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex].text = task;
      updatedTasks[editIndex].dueDate = dueDate;
      updatedTasks[editIndex].priority = priority; // Update the priority as well
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([
        ...tasks,
        {
          text: task,
          completed: false,
          dueDate: dueDate,
          priority: priority, // Store the priority
        },
      ]);
    }

    setTask("");
    setDueDate("");
    setPriority("medium"); // Reset priority to medium after adding/updating task
  };

  const editTask = (index) => {
    setTask(tasks[index].text);
    setDueDate(tasks[index].dueDate);
    setPriority(tasks[index].priority); // Set the priority when editing
    setEditIndex(index);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    if (editIndex === index) {
      setTask("");
      setDueDate("");
      setPriority("medium");
      setEditIndex(null);
    }
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Sorting tasks based on the selected criteria (dueDate or priority)
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === "dueDate") {
      // Sort by due date (ascending)
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      // Sort by priority (low -> medium -> high)
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <div className={`container mt-5 ${isDarkMode ? "bg-dark text-light" : ""}`} style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Todo App</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="date"
          className="form-control ms-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)} // Update due date
        />
        <select
          className="form-control ms-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)} // Update priority
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="btn btn-primary" onClick={addOrUpdateTask}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <TodoList
        todos={sortedTasks} // Pass sorted tasks to TodoList
        onToggle={toggleComplete}
        onEdit={editTask}
        onDelete={deleteTask}
      />

      <div className="d-flex justify-content-center mt-3">
        <button
          className={`btn btn-sm ${filter === "all" ? "btn-secondary" : "btn-outline-secondary"} me-2`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${filter === "active" ? "btn-secondary" : "btn-outline-secondary"} me-2`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn btn-sm ${filter === "completed" ? "btn-secondary" : "btn-outline-secondary"}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          className={`btn btn-sm ${sortBy === "dueDate" ? "btn-secondary" : "btn-outline-secondary"} me-2`}
          onClick={() => setSortBy("dueDate")}
        >
          Sort by Due Date
        </button>
        <button
          className={`btn btn-sm ${sortBy === "priority" ? "btn-secondary" : "btn-outline-secondary"}`}
          onClick={() => setSortBy("priority")}
        >
          Sort by Priority
        </button>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={toggleTheme}>
          Toggle {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}

export default App;
git 