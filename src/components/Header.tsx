import UserIcon from "../assets/usario";

const Header = ({ onUserMenu, user }: { onUserMenu: () => void; user: any }) => {
  const displayName = user?.nombre_completo || user?.nombre || user?.usuario || "Usuario";

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-(--color-fondo-oscuro) shadow-lg z-20">
      <form className="flex-1 max-w-xl mx-6">
        <input
          type="text"
          placeholder="Buscar por H.R., referencia, ubicación, nombre, teléfono..."
          className="w-full px-4 py-2 rounded-2xl bg-(--color-fondo-claro) text-lg text-(--color-gris-oscuro) focus:outline-none focus:ring-2 focus:ring-(--color-vino) shadow"
        />
      </form>
      <div className="flex items-center gap-4">
        <button onClick={onUserMenu} className="flex items-center gap-3 focus:outline-none">
          <span className="w-10 h-10 rounded-full bg-(--color-vino-claro) flex items-center justify-center overflow-hidden">
            <UserIcon width={28} height={28} />
          </span>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-(--color-blanco) font-semibold">{displayName}</span>
            <span className="text-(--color-gris-medio) text-sm">{user?.rol || "Rol"}</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
