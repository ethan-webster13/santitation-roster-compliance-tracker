import { useRoster } from "../../context/RosterContext";

const EmployeeBadge = ({ employee }) => {
    const { selectedEmployeeId, selectEmployee } = useRoster();
    const isSelected = selectedEmployeeId === employee.id;

    const getRoleClass = (role) => {
        if (role === 'supevisor') return 'role-supervisor';
        if (role.includes('lead')) return 'role-lead';
        return 'role-laborer';
    };

    // This fires exactly when the user clicks and starts dragging the badge (desktop path)
    const handleDragStart = (e) => {
        /* THE "BACKPACK" ANALOGY:
            Think of 'dataTransfer' like a temporary backpack the browser gives us for the trip.
            We pack the moving employee's ID into the backpack as plain text.
            When the user drops this badge later, the landing pad will open this backpack to see who arrived.
        */
        e.dataTransfer.setData("text/plain", employee.id.toString());

       // Tells the browser we want to move this card, not copy a duplicate of it
        e.dataTransfer.effectAllowed = "move";
    };

    /* TAP-TO-ASSIGN (touch path):
        Drag-and-drop is unreliable on touch screens, so tapping a badge "picks it up"
        by marking it selected in Context. The next zone tap drops it there.
        stopPropagation() prevents a badge that lives *inside* a zone from also
        triggering that zone's assign handler — tapping a person selects the person. */
    const handleSelect = (e) => {
        e.stopPropagation();
        selectEmployee(employee.id);
    };

    // Keyboard parity: Enter or Space selects, matching the pointer behavior
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(e);
        }
    };

    return (
    <div
      className={`employee-badge draggable ${getRoleClass(employee.role)} ${isSelected ? 'is-selected' : ''}`}
      draggable="true" //Tells the browser "unlock this div and allow it to be dragged"
      onDragStart={handleDragStart}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${employee.firstName} ${employee.lastName}, ${employee.role}. ${isSelected ? 'Selected — tap a zone to assign.' : 'Tap to select for assignment.'}`}
    >
      <span>{employee.firstName} {employee.lastName[0]}.</span>
      <span className="badge-role-text">{employee.role.replace('sanitation ', '')}</span>
    </div>
  );
}

export default EmployeeBadge;
