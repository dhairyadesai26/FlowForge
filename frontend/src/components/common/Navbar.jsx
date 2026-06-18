import { KanbanSquare, LogOut, Plus, Search } from "lucide-react";
import ConnectionStatus from "./ConnectionStatus";
import { useAuth } from "../../App";

function Navbar({ search, setSearch, priority, setPriority, category, setCategory, onNewTask }) {
  const { user, signOut } = useAuth();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="navbar-logo">
        <KanbanSquare size={20} strokeWidth={2.5} style={{ color: "#818cf8" }} />
        Kanban Pro
      </div>

      {/* Search */}
      <div className="navbar-search-wrap">
        <Search size={13} className="navbar-search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="search-input"
          aria-label="Search tasks"
        />
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {/* Priority filter */}
        <select
          className="filter-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          data-testid="priority-filter"
          aria-label="Filter by priority"
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Category filter */}
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data-testid="category-filter"
          aria-label="Filter by category"
        >
          <option value="All">All Category</option>
          <option value="Feature">Feature</option>
          <option value="Bug">Bug</option>
          <option value="Enhancement">Enhancement</option>
        </select>

        <ConnectionStatus />

        {/* New task button */}
        <button
          className="new-task-btn"
          onClick={onNewTask}
          data-testid="new-task-btn"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Task
        </button>

        {/* User info + sign-out */}
        {user && (
          <div className="navbar-user">
            <div className="auth-user-badge" data-testid="auth-user">
              <div className="auth-avatar">{user.initials}</div>
              <span className="auth-user-name">{user.name || user.email}</span>
            </div>
            <button
              className="signout-btn"
              onClick={signOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={15} strokeWidth={2} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
