import { useState, useEffect } from "react";
import { KanbanSquare, LogOut, Plus, Search, Menu, X } from "lucide-react";
import ConnectionStatus from "./ConnectionStatus";
import { useAuth } from "../../App";

function Navbar({ search, setSearch, priority, setPriority, category, setCategory, onNewTask }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-logo">
        <KanbanSquare size={20} strokeWidth={2.5} style={{ color: "#818cf8" }} className="navbar-logo-icon" />
        FlowForge
      </div>

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

      <div className="navbar-right">
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

        <button
          className="new-task-btn"
          onClick={onNewTask}
          data-testid="new-task-btn"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Task
        </button>

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
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        className="navbar-hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Drawer */}
      <div className={`navbar-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-search-wrap">
          <Search size={15} className="drawer-search-icon" />
          <input
            className="drawer-search-input"
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks (mobile)"
          />
        </div>
        
        <div className="drawer-filters">
          <select
            className="drawer-filter-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Filter by priority (mobile)"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="drawer-filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category (mobile)"
          >
            <option value="All">All Category</option>
            <option value="Feature">Feature</option>
            <option value="Bug">Bug</option>
            <option value="Enhancement">Enhancement</option>
          </select>
        </div>

        <div className="drawer-actions">
          <ConnectionStatus />
          {user && (
            <button
              className="signout-btn"
              onClick={signOut}
              style={{ minHeight: '36px', padding: '0.45rem 1rem' }}
            >
              <LogOut size={15} strokeWidth={2} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
