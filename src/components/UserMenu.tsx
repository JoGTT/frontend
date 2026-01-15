const UserMenu = ({ onLogout, onClose }: { onLogout: () => void; onClose?: () => void }) => {
  return (
    <div className="fixed right-6 top-20 w-56 bg-[var(--color-fondo-claro)] rounded-2xl shadow-2xl border border-[var(--color-primary)] z-50 animate-fade-in">
      <ul className="py-2">
        <li>
          <button
            onClick={() => {
              onClose?.();
              onLogout();
            }}
            className="w-full text-left px-4 py-3 hover:bg-[var(--color-error)]/10 rounded-xl text-[var(--color-error)] font-semibold"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
